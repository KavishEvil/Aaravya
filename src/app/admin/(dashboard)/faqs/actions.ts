"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function toStringOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

function readFaqForm(formData: FormData) {
  return {
    question: String(formData.get("question")).trim(),
    answer: String(formData.get("answer")).trim(),
    conditionId: toStringOrNull(formData.get("conditionId")),
    topic: toStringOrNull(formData.get("topic")),
    pageContext: String(formData.get("pageContext")).trim() || "faqs-page",
    sortOrder: Number(formData.get("sortOrder")) || 0,
  };
}

export async function createFaq(formData: FormData) {
  const data = readFaqForm(formData);
  await prisma.faq.create({ data });
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, formData: FormData) {
  const data = readFaqForm(formData);
  await prisma.faq.update({ where: { id }, data });
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string) {
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
}
