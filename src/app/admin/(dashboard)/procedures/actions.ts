"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

function toStringOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

function toIntOrNull(value: FormDataEntryValue | null): number | null {
  const n = Number(value);
  return value && !Number.isNaN(n) ? n : null;
}

function readProcedureForm(formData: FormData) {
  return {
    slug: String(formData.get("slug")).trim(),
    name: String(formData.get("name")).trim(),
    conditionId: String(formData.get("conditionId")),
    doctorId: toStringOrNull(formData.get("doctorId")),
    description: String(formData.get("description")).trim(),
    duration: toStringOrNull(formData.get("duration")),
    anesthesiaType: toStringOrNull(formData.get("anesthesiaType")),
    hospitalStay: toStringOrNull(formData.get("hospitalStay")),
    successRate: toStringOrNull(formData.get("successRate")),
    costMin: toIntOrNull(formData.get("costMin")),
    costMax: toIntOrNull(formData.get("costMax")),
    downloadablePdfUrl: toStringOrNull(formData.get("downloadablePdfUrl")),
  };
}

export async function createProcedure(formData: FormData) {
  const data = readProcedureForm(formData);
  await prisma.procedure.create({ data });
  revalidatePath("/admin/procedures");
  revalidatePath("/treatments");
  redirect("/admin/procedures");
}

export async function updateProcedure(id: string, formData: FormData) {
  const data = readProcedureForm(formData);
  await prisma.procedure.update({ where: { id }, data });
  revalidatePath("/admin/procedures");
  revalidatePath(`/treatments/${data.slug}`);
  redirect("/admin/procedures");
}

export async function deleteProcedure(id: string) {
  await prisma.procedure.delete({ where: { id } });
  revalidatePath("/admin/procedures");
}
