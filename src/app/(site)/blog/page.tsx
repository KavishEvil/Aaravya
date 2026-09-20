import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Health Library",
  description: "Symptom guides, treatment explainers, and patient FAQs from Aaravya Hospital.",
};

export default async function BlogPage() {
  // NOTE: kept exactly as in the original component -- this query result is
  // not rendered when posts exist (see PROJECT_OVERVIEW context); flagged to
  // the client as a content/functionality gap rather than guessed at here,
  // since building the missing posts grid + a blog/[slug] detail route would
  // be a new feature, out of scope for a visual-only redesign.
  const posts = await prisma.blogPost.findMany({ where: { isPublished: true } });

  return (
    <div>
      <PageHero
        eyebrow="Health Library"
        title="Health Library"
        description="Symptom guides, treatment explainers, and myth-busting articles — reviewed by our doctors."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 sm:py-16">
        {posts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-forest-200 bg-forest-50/60 p-8">
            <p className="font-heading font-semibold text-forest-900">Articles launching soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Our doctor-reviewed health library is in progress. In the meantime,
              each condition page already covers symptoms, causes, and
              treatment options in detail.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
