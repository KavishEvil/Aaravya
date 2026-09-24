"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ConditionCategory } from "@/generated/prisma";
import { deleteImage, ImageValidationError, keyFromUrl, uploadImage } from "@/lib/storage";

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

/** Same precedence as `resolvePhotoUrl` in the doctors actions: a newly-picked
 * file wins, then an explicit removal, then the existing value is left
 * untouched. The previous uploaded file (if any) is cleaned up once replaced. */
async function resolveHeroImageUrl(formData: FormData, previousUrl: string | null): Promise<string | null> {
  const file = formData.get("heroImageUrl");
  const hasNewFile = file instanceof File && file.size > 0;
  const removeRequested = formData.get("heroImageUrl__remove") === "1";

  if (hasNewFile) {
    const uploaded = await uploadImage(file as File, "conditions");
    await deleteImage(keyFromUrl(previousUrl));
    return uploaded.url;
  }
  if (removeRequested) {
    await deleteImage(keyFromUrl(previousUrl));
    return null;
  }
  return previousUrl;
}

function readConditionForm(formData: FormData) {
  return {
    slug: String(formData.get("slug")).trim(),
    name: String(formData.get("name")).trim(),
    category: String(formData.get("category")) as ConditionCategory,
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
  let heroImageUrl: string | null = null;
  try {
    heroImageUrl = await resolveHeroImageUrl(formData, null);
  } catch (err) {
    if (err instanceof ImageValidationError) throw new Error(err.message);
    throw err;
  }
  await prisma.condition.create({ data: { ...data, heroImageUrl } });
  revalidatePath("/admin/conditions");
  revalidatePath("/conditions");
  redirect("/admin/conditions");
}

export async function updateCondition(id: string, formData: FormData) {
  const data = readConditionForm(formData);
  const existing = await prisma.condition.findUnique({ where: { id }, select: { heroImageUrl: true } });

  let heroImageUrl: string | null;
  try {
    heroImageUrl = await resolveHeroImageUrl(formData, existing?.heroImageUrl ?? null);
  } catch (err) {
    if (err instanceof ImageValidationError) throw new Error(err.message);
    throw err;
  }

  await prisma.condition.update({ where: { id }, data: { ...data, heroImageUrl } });
  revalidatePath("/admin/conditions");
  revalidatePath("/conditions");
  revalidatePath(`/conditions/${data.slug}`);
  redirect("/admin/conditions");
}

export async function deleteCondition(id: string) {
  const existing = await prisma.condition.findUnique({ where: { id }, select: { heroImageUrl: true } });
  await prisma.condition.delete({ where: { id } });
  await deleteImage(keyFromUrl(existing?.heroImageUrl ?? null));
  revalidatePath("/admin/conditions");
  revalidatePath("/conditions");
}
