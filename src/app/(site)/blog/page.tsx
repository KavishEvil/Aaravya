import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Health Library",
  description: "Symptom guides, treatment explainers, and patient FAQs from Aaravya Hospital.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({ where: { isPublished: true } });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h1 className="font-heading text-4xl font-semibold text-balance">Health Library</h1>
      <p className="mt-3 text-muted-foreground">
        Symptom guides, treatment explainers, and myth-busting articles — reviewed by our doctors.
      </p>

      {posts.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-muted/30 p-8">
          <p className="font-heading font-semibold">Articles launching soon</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Our doctor-reviewed health library is in progress. In the meantime,
            each condition page already covers symptoms, causes, and
            treatment options in detail.
          </p>
        </div>
      )}
    </div>
  );
}
