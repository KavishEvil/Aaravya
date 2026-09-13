import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getConditionsGroupedByCategory } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Conditions & Treatments",
  description:
    "Proctology, general surgery, urology, and peripheral vascular conditions treated at Aaravya Hospital, Chandkheda, Ahmedabad.",
};

export default async function ConditionsPage() {
  const groups = await getConditionsGroupedByCategory();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-semibold text-balance">
          Conditions &amp; Treatments
        </h1>
        <p className="mt-3 text-muted-foreground">
          From non-surgical management to laser and surgical care — browse by
          specialty to find the right treatment page.
        </p>
      </div>

      <div className="mt-14 flex flex-col gap-14">
        {groups.map((group) => (
          <div key={group.category}>
            <h2 className="font-heading text-2xl font-semibold">{group.label}</h2>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {group.conditions.map((c) => (
                <Link
                  key={c.slug}
                  href={`/conditions/${c.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand hover:bg-accent"
                >
                  <p className="font-heading font-medium text-card-foreground">{c.name}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs text-brand opacity-0 transition-opacity group-hover:opacity-100">
                    View treatment <ArrowRight className="size-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
