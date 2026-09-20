import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { Reveal, RevealGroup, RevealItem } from "@/components/site/reveal";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Cost & Insurance",
  description: "Treatment cost estimates, insurance, and payment options at Aaravya Hospital.",
};

export default async function CostPage() {
  const rules = await prisma.costEstimatorRule.findMany({ include: { procedure: true } });

  return (
    <div>
      <PageHero
        eyebrow="Transparent Pricing"
        title="Cost & Insurance"
        description="Transparent pricing so you can plan ahead — no surprises before your procedure."
      />

      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
        {rules.length > 0 ? (
          <RevealGroup className="flex flex-col gap-3">
            {rules.map((rule) => (
              <RevealItem key={rule.id}>
                <div className="rounded-xl border border-border bg-card p-5 shadow-soft-sm">
                  <p className="font-medium text-card-foreground">{rule.procedure.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rule.city} · {rule.insuranceType} · ₹{rule.costMin.toLocaleString("en-IN")}–₹{rule.costMax.toLocaleString("en-IN")}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <div className="rounded-2xl border border-dashed border-forest-200 bg-forest-50/60 p-8 text-center">
            <p className="font-heading font-semibold text-forest-900">Cost estimator launching soon</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Exact procedure costs vary by case complexity and insurance
              coverage. Call our coordinator for a personalized estimate before
              your visit — verified figures will appear here as they&rsquo;re
              confirmed by our billing team.
            </p>
            <Button render={<a href="tel:+918733889957" />} className="mt-5 bg-brand text-brand-foreground hover:bg-terracotta-700">
              Call for a Cost Estimate
            </Button>
          </div>
        )}

        <Reveal className="mt-10 rounded-2xl bg-sage-100 p-6 text-sage-900">
          <p className="font-heading font-semibold">Cashless &amp; EMI</p>
          <p className="mt-2 text-sm text-sage-800/90">
            Our insurance desk can verify your policy&rsquo;s cashless eligibility
            before your procedure, and EMI options are available for approved
            treatment plans. Confirm details with our coordinator when you book.
          </p>
          <Button
            variant="outline"
            render={<Link href="/book" />}
            className="mt-4 border-sage-400 text-sage-900 hover:bg-sage-200"
          >
            Book a Consultation
          </Button>
        </Reveal>
      </div>
    </div>
  );
}
