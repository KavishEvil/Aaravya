"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FunnelStage } from "@/generated/prisma";
import { deleteImage, keyFromUrl, resolveImageUpload } from "@/lib/storage";

function toStringOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

function linesToArray(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function readBlogForm(formData: FormData) {
  return {
    slug: String(formData.get("slug")).trim(),
    title: String(formData.get("title")).trim(),
    funnelStage: String(formData.get("funnelStage")) as FunnelStage,
    body: String(formData.get("body")).trim(),
    excerpt: toStringOrNull(formData.get("excerpt")),
    tags: linesToArray(formData.get("tags")),
    reviewedByDoctorId: toStringOrNull(formData.get("reviewedByDoctorId")),
    isPublished: formData.get("isPublished") === "on",
  };
}

function revalidateBlog(...slugs: string[]) {
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  for (const slug of slugs) revalidatePath(`/blog/${slug}`);
}

export async function createBlogPost(formData: FormData) {
  const data = readBlogForm(formData);
  const heroImageUrl = await resolveImageUpload(formData, "heroImageUrl", "blog", null);
  await prisma.blogPost.create({ data: { ...data, heroImageUrl } });
  revalidateBlog(data.slug);
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const data = readBlogForm(formData);
  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true, heroImageUrl: true } });
  const heroImageUrl = await resolveImageUpload(formData, "heroImageUrl", "blog", existing?.heroImageUrl ?? null);
  await prisma.blogPost.update({ where: { id }, data: { ...data, heroImageUrl } });
  revalidateBlog(data.slug, ...(existing && existing.slug !== data.slug ? [existing.slug] : []));
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const existing = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true, heroImageUrl: true } });
  await prisma.blogPost.delete({ where: { id } });
  await deleteImage(keyFromUrl(existing?.heroImageUrl ?? null));
  revalidateBlog(...(existing ? [existing.slug] : []));
}
