import { prisma } from "@/lib/prisma";
import { ConditionCategory } from "@/generated/prisma";

export const CATEGORY_LABELS: Record<ConditionCategory, string> = {
  PROCTOLOGY: "Proctology",
  GENERAL_SURGERY: "General Surgery",
  UROLOGY: "Urology",
  PERIPHERAL_VASCULAR: "Peripheral Vascular Diseases",
};

export const CATEGORY_ORDER: ConditionCategory[] = [
  "PROCTOLOGY",
  "GENERAL_SURGERY",
  "UROLOGY",
  "PERIPHERAL_VASCULAR",
];

export async function getConditionsGroupedByCategory() {
  const conditions = await prisma.condition.findMany({
    orderBy: { name: "asc" },
    select: { slug: true, name: true, category: true, heroImageUrl: true },
  });

  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    conditions: conditions.filter((c) => c.category === category),
  })).filter((group) => group.conditions.length > 0);
}

export async function getAllConditionSlugs() {
  const conditions = await prisma.condition.findMany({ select: { slug: true } });
  return conditions.map((c) => c.slug);
}

export async function getConditionBySlug(slug: string) {
  return prisma.condition.findUnique({
    where: { slug },
    include: {
      reviewedByDoctor: true,
      procedures: true,
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function getAllDoctors() {
  return prisma.doctor.findMany({ orderBy: { isFeatured: "desc" } });
}

export async function getDoctorBySlug(slug: string) {
  return prisma.doctor.findUnique({
    where: { slug },
    include: { reviewedConditions: true, procedures: true },
  });
}

export async function getAllProcedureSlugs() {
  const procedures = await prisma.procedure.findMany({ select: { slug: true } });
  return procedures.map((p) => p.slug);
}

export async function getProcedureBySlug(slug: string) {
  return prisma.procedure.findUnique({
    where: { slug },
    include: { condition: true, doctor: true },
  });
}

export async function getFaqs(pageContext?: string) {
  return prisma.faq.findMany({
    where: pageContext ? { pageContext } : undefined,
    orderBy: [{ pageContext: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getMediaByCategory(category: "HAPPY_FACES" | "INTERIOR" | "SURGERY" | "TESTIMONIAL") {
  return prisma.mediaItem.findMany({
    where: { category },
    orderBy: { sortOrder: "asc" },
  });
}

export async function getPrimaryLocation() {
  return prisma.location.findFirst({ where: { isPrimary: true } });
}

export async function getSiteSettings() {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
}
