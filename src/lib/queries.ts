import { cache } from "react";
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

/**
 * Wrapped in React's `cache()` because this is called once from
 * `generateMetadata` and once from the page component for the same request —
 * without this, every visit to a condition page ran the (fairly heavy)
 * query, with its `procedures`/`faqs`/`reviewedByDoctor` includes, twice.
 * `cache()` dedupes calls with the same arguments within a single render.
 */
export const getConditionBySlug = cache(async (slug: string) => {
  return prisma.condition.findUnique({
    where: { slug },
    include: {
      reviewedByDoctor: true,
      procedures: true,
      faqs: { orderBy: { sortOrder: "asc" } },
    },
  });
});

export async function getAllDoctors() {
  return prisma.doctor.findMany({ orderBy: { isFeatured: "desc" } });
}

/** See `getConditionBySlug` — same generateMetadata + page double-fetch fix. */
export const getDoctorBySlug = cache(async (slug: string) => {
  return prisma.doctor.findUnique({
    where: { slug },
    include: { reviewedConditions: true, procedures: true },
  });
});

export async function getAllProcedureSlugs() {
  const procedures = await prisma.procedure.findMany({ select: { slug: true } });
  return procedures.map((p) => p.slug);
}

/** See `getConditionBySlug` — same generateMetadata + page double-fetch fix. */
export const getProcedureBySlug = cache(async (slug: string) => {
  return prisma.procedure.findUnique({
    where: { slug },
    include: { condition: true, doctor: true },
  });
});

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

/**
 * Wrapped in `cache()` too: this is fetched independently in
 * `(site)/layout.tsx` (for the org JSON-LD + analytics IDs + header/footer)
 * and, previously, again inside the chat widget's data loader — the widget
 * has since been changed to receive settings as a prop instead of
 * re-fetching, but `cache()` is kept here as a safety net for any future
 * caller that also needs settings within the same request.
 */
export const getSiteSettings = cache(async () => {
  const rows = await prisma.siteSetting.findMany();
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
});
