"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteImage, ImageValidationError, keyFromUrl, uploadImage } from "@/lib/storage";

function linesToArray(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toIntOrNull(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) ? n : null;
}

function toStringOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

/**
 * Resolves the `photoUrl` field for a create/update from the raw FormData.
 * `ImageUploadField` submits the photo as an actual `File` under this same
 * field name (empty/size-0 when the admin didn't touch it) plus a
 * `photoUrl__remove` flag set to "1" when "Remove image" was clicked without
 * picking a replacement. Order of precedence: a newly-picked file wins, then
 * an explicit removal, then the existing value is left untouched. Either way
 * the previous uploaded file (if any) is cleaned up once it's replaced.
 */
async function resolvePhotoUrl(formData: FormData, previousUrl: string | null): Promise<string | null> {
  const file = formData.get("photoUrl");
  const hasNewFile = file instanceof File && file.size > 0;
  const removeRequested = formData.get("photoUrl__remove") === "1";

  if (hasNewFile) {
    const uploaded = await uploadImage(file as File, "doctors");
    await deleteImage(keyFromUrl(previousUrl));
    return uploaded.url;
  }
  if (removeRequested) {
    await deleteImage(keyFromUrl(previousUrl));
    return null;
  }
  return previousUrl;
}

function readDoctorForm(formData: FormData) {
  return {
    slug: String(formData.get("slug")).trim(),
    name: String(formData.get("name")).trim(),
    qualifications: String(formData.get("qualifications")).trim(),
    designation: String(formData.get("designation")).trim(),
    registrationNumber: toStringOrNull(formData.get("registrationNumber")),
    yearsExperience: toIntOrNull(formData.get("yearsExperience")),
    surgeriesCount: toIntOrNull(formData.get("surgeriesCount")),
    specializations: linesToArray(formData.get("specializations")),
    bioParagraphs: linesToArray(formData.get("bioParagraphs")),
    philosophy: toStringOrNull(formData.get("philosophy")),
    phone: toStringOrNull(formData.get("phone")),
    facebookUrl: toStringOrNull(formData.get("facebookUrl")),
    instagramUrl: toStringOrNull(formData.get("instagramUrl")),
    linkedinUrl: toStringOrNull(formData.get("linkedinUrl")),
    isFeatured: formData.get("isFeatured") === "on",
  };
}

export async function createDoctor(formData: FormData) {
  const data = readDoctorForm(formData);
  let photoUrl: string | null = null;
  try {
    photoUrl = await resolvePhotoUrl(formData, null);
  } catch (err) {
    // Surfaced by the nearest admin error.tsx boundary. A field-level inline
    // error would be nicer, but that needs useActionState + a return-value
    // contract change to this action, which is outside this pass's scope.
    if (err instanceof ImageValidationError) throw new Error(err.message);
    throw err;
  }
  await prisma.doctor.create({ data: { ...data, photoUrl } });
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
  redirect("/admin/doctors");
}

export async function updateDoctor(id: string, formData: FormData) {
  const data = readDoctorForm(formData);
  const existing = await prisma.doctor.findUnique({ where: { id }, select: { photoUrl: true } });

  let photoUrl: string | null;
  try {
    photoUrl = await resolvePhotoUrl(formData, existing?.photoUrl ?? null);
  } catch (err) {
    if (err instanceof ImageValidationError) throw new Error(err.message);
    throw err;
  }

  await prisma.doctor.update({ where: { id }, data: { ...data, photoUrl } });
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
  revalidatePath(`/doctors/${data.slug}`);
  redirect("/admin/doctors");
}

export async function deleteDoctor(id: string) {
  const existing = await prisma.doctor.findUnique({ where: { id }, select: { photoUrl: true } });
  await prisma.doctor.delete({ where: { id } });
  await deleteImage(keyFromUrl(existing?.photoUrl ?? null));
  revalidatePath("/admin/doctors");
  revalidatePath("/doctors");
}
