"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { FunnelStage } from "@/generated/prisma";

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
    heroImageUrl: toStringOrNull(formData.get("heroImageUrl")),
    tags: linesToArray(formData.get("tags")),
    reviewedByDoctorId: toStringOrNull(formData.get("reviewedByDoctorId")),
    isPublished: formData.get("isPublished") === "on",
  };
}

export async function createBlogPost(formData: FormData) {
  const data = readBlogForm(formData);
  await prisma.blogPost.create({ data });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const data = readBlogForm(formData);
  await prisma.blogPost.update({ where: { id }, data });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
