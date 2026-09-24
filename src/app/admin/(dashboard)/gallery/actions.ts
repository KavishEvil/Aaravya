"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MediaCategory, MediaType } from "@/generated/prisma";
import { deleteImage, keyFromUrl, resolveImageUpload } from "@/lib/storage";

/** Accepts a bare 11-character ID or any common YouTube URL form. */
function parseYoutubeId(value: FormDataEntryValue | null): string | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  const match = raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}

function readMediaForm(formData: FormData) {
  const type = String(formData.get("type"));
  const category = String(formData.get("category"));
  if (!Object.values(MediaType).includes(type as MediaType)) throw new Error("Choose a valid media type.");
  if (!Object.values(MediaCategory).includes(category as MediaCategory)) throw new Error("Choose a valid category.");
  const sortOrder = Number(formData.get("sortOrder"));
  const caption = String(formData.get("caption") ?? "").trim();
  return {
    type: type as MediaType,
    category: category as MediaCategory,
    caption: caption || null,
    sortOrder: Number.isFinite(sortOrder) ? Math.trunc(sortOrder) : 0,
  };
}

/**
 * Resolves `url`/`youtubeId` for the chosen type. Validation runs before any
 * upload or removal so a rejected save never deletes the stored image.
 */
async function resolveMedia(formData: FormData, type: MediaType, previousUrl: string | null) {
  if (type === "VIDEO") {
    const youtubeId = parseYoutubeId(formData.get("youtubeId"));
    if (!youtubeId) throw new Error("Enter a YouTube video ID or link for video items.");
    return { youtubeId, url: null, replacedUrl: previousUrl };
  }

  const file = formData.get("url");
  const hasNewFile = file instanceof File && file.size > 0;
  const removeRequested = formData.get("url__remove") === "1";
  if (!hasNewFile && (!previousUrl || removeRequested)) {
    throw new Error("Choose an image for photo items.");
  }
  const url = await resolveImageUpload(formData, "url", "gallery", previousUrl);
  return { youtubeId: null, url, replacedUrl: null };
}

function revalidateMedia() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function createMediaItem(formData: FormData) {
  const data = readMediaForm(formData);
  const { youtubeId, url } = await resolveMedia(formData, data.type, null);
  await prisma.mediaItem.create({ data: { ...data, youtubeId, url } });
  revalidateMedia();
  redirect("/admin/gallery");
}

export async function updateMediaItem(id: string, formData: FormData) {
  const data = readMediaForm(formData);
  const existing = await prisma.mediaItem.findUnique({ where: { id }, select: { url: true } });
  const { youtubeId, url, replacedUrl } = await resolveMedia(formData, data.type, existing?.url ?? null);
  await prisma.mediaItem.update({ where: { id }, data: { ...data, youtubeId, url } });
  // Switching a photo item to a video drops its image.
  await deleteImage(keyFromUrl(replacedUrl));
  revalidateMedia();
  redirect("/admin/gallery");
}

export async function deleteMediaItem(id: string) {
  const existing = await prisma.mediaItem.findUnique({ where: { id }, select: { url: true } });
  await prisma.mediaItem.delete({ where: { id } });
  await deleteImage(keyFromUrl(existing?.url ?? null));
  revalidateMedia();
}
