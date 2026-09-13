"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AnonymousCategory } from "@/generated/prisma";

function toStringOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

function toIntOrNull(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) ? n : null;
}

function readTestimonialForm(formData: FormData) {
  const anonymousCategory = toStringOrNull(formData.get("anonymousCategory"));
  return {
    patientName: toStringOrNull(formData.get("patientName")),
    initials: toStringOrNull(formData.get("initials")),
    quote: toStringOrNull(formData.get("quote")),
    rating: toIntOrNull(formData.get("rating")),
    imageUrl: toStringOrNull(formData.get("imageUrl")),
    videoUrl: toStringOrNull(formData.get("videoUrl")),
    conditionId: toStringOrNull(formData.get("conditionId")),
    doctorId: toStringOrNull(formData.get("doctorId")),
    anonymousCategory: anonymousCategory ? (anonymousCategory as AnonymousCategory) : null,
    isFeatured: formData.get("isFeatured") === "on",
    isApproved: formData.get("isApproved") === "on",
  };
}

export async function createTestimonial(formData: FormData) {
  const data = readTestimonialForm(formData);
  await prisma.testimonial.create({ data });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  const data = readTestimonialForm(formData);
  await prisma.testimonial.update({ where: { id }, data });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
}
