"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConditionCategory } from "@/generated/prisma";

function linesToArray(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function toStringOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s.length > 0 ? s : null;
}

/** Encodes as "Title | Description" per line, matching the format shown in the form's help text. */
function parseTreatmentOptions(value: FormDataEntryValue | null) {
  return linesToArray(value)
    .map((line) => {
      const [title, ...rest] = line.split("|");
      return { title: title?.trim() ?? "", description: rest.join("|").trim() };
    })
    .filter((o) => o.title);
}

function readConditionForm(formData: FormData) {
  return {
    slug: String(formData.get("slug")).trim(),
    name: String(formData.get("name")).trim(),
    category: String(formData.get("category")) as ConditionCategory,
    heroImageUrl: toStringOrNull(formData.get("heroImageUrl")),
    seoTitle: toStringOrNull(formData.get("seoTitle")),
    metaDescription: toStringOrNull(formData.get("metaDescription")),
    directAnswer: String(formData.get("directAnswer")).trim(),
    introText: toStringOrNull(formData.get("introText")),
    definitionHeading: toStringOrNull(formData.get("definitionHeading")),
    definitionText: toStringOrNull(formData.get("definitionText")),
    symptoms: linesToArray(formData.get("symptoms")),
    causes: toStringOrNull(formData.get("causes")),
    treatmentOptions: parseTreatmentOptions(formData.get("treatmentOptions")),
    whyChooseUsPoints: linesToArray(formData.get("whyChooseUsPoints")),
    closingHeading: toStringOrNull(formData.get("closingHeading")),
    closingText: toStringOrNull(formData.get("closingText")),
    reviewedByDoctorId: toStringOrNull(formData.get("reviewedByDoctorId")),
  };
}

export async function createCondition(formData: FormData) {
  const data = readConditionForm(formData);
  await prisma.condition.create({ data });
  revalidatePath("/admin/conditions");
  revalidatePath("/conditions");
  redirect("/admin/conditions");
}

export async function updateCondition(id: string, formData: FormData) {
  const data = readConditionForm(formData);
  await prisma.condition.update({ where: { id }, data });
  revalidatePath("/admin/conditions");
  revalidatePath("/conditions");
  revalidatePath(`/conditions/${data.slug}`);
  redirect("/admin/conditions");
}

export async function deleteCondition(id: string) {
  await prisma.condition.delete({ where: { id } });
  revalidatePath("/admin/conditions");
  revalidatePath("/conditions");
}
