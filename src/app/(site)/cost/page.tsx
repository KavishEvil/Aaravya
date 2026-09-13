import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Cost & Insurance",
  description: "Treatment cost estimates, insurance, and payment options at Aaravya Hospital.",
};

export default async function CostPage() {
  const rules = await prisma.costEstimatorRule.findMany({ include: { procedure: true } });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-semibold text-balance">Cost &amp; Insurance</h1>
        <p className="mt-3 text-muted-foreground">
          Transparent pricing so you can plan ahead — no surprises before your procedure.
        </p>
      </div>

      {rules.length > 0 ? (
        <div className="mt-10 flex flex-col gap-3">
          {rules.map((rule) => (
            <div key={rule.id} className="rounded-xl border border-border bg-card p-5">
              <p className="font-medium text-card-foreground">{rule.procedure.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {rule.city} · {rule.insuranceType} · ₹{rule.costMin.toLocaleString("en-IN")}–₹{rule.costMax.toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="font-heading font-semibold">Cost estimator launching soon</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Exact procedure costs vary by case complexity and insurance
            coverage. Call our coordinator for a personalized estimate before
            your visit — verified figures will appear here as they&rsquo;re
            confirmed by our billing team.
          </p>
          <Button render={<a href="tel:+918733889957" />} className="mt-5 bg-brand text-brand-foreground hover:bg-brand/90">
            Call for a Cost Estimate
          </Button>
        </div>
      )}

      <div className="mt-10 rounded-xl bg-accent p-6 text-accent-foreground">
        <p className="font-heading font-semibold">Cashless &amp; EMI</p>
        <p className="mt-2 text-sm">
          Our insurance desk can verify your policy&rsquo;s cashless eligibility
          before your procedure, and EMI options are available for approved
          treatment plans. Confirm details with our coordinator when you book.
        </p>
        <Button variant="outline" render={<Link href="/book" />} className="mt-4">
          Book a Consultation
        </Button>
      </div>
    </div>
  );
}
