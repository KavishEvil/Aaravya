import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllProcedureSlugs, getProcedureBySlug } from "@/lib/queries";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, medicalProcedureSchema } from "@/lib/schema";

export async function generateStaticParams() {
  const slugs = await getAllProcedureSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const procedure = await getProcedureBySlug(slug);
  if (!procedure) return {};
  return {
    title: procedure.name,
    description: procedure.description.slice(0, 155),
  };
}

export default async function ProcedurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const procedure = await getProcedureBySlug(slug);
  if (!procedure) notFound();

  const facts = [
    { label: "Duration", value: procedure.duration },
    { label: "Anesthesia", value: procedure.anesthesiaType },
    { label: "Hospital Stay", value: procedure.hospitalStay },
    { label: "Success Rate", value: procedure.successRate },
  ].filter((f) => f.value);

  const schema = medicalProcedureSchema({
    name: procedure.name,
    description: procedure.description,
    url: absoluteUrl(`/treatments/${procedure.slug}`),
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <JsonLd data={schema} />
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/conditions/${procedure.condition.slug}`} className="hover:text-foreground">
          {procedure.condition.name}
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground">{procedure.name}</span>
      </nav>

      <h1 className="mt-4 font-heading text-4xl font-semibold text-balance">{procedure.name}</h1>
      <p className="mt-4 text-muted-foreground">{procedure.description}</p>

      {facts.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="rounded-xl border border-border bg-card p-4 text-center">
              <p className="font-mono text-[0.65rem] uppercase tracking-wide text-muted-foreground">
                {f.label}
              </p>
              <p className="mt-1 font-heading font-semibold">{f.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          Duration, anesthesia type, hospital stay, and success-rate figures for
          this procedure will be published here once confirmed by our
          clinical team — call us for exact details for your case.
        </div>
      )}

      {(procedure.costMin || procedure.costMax) && (
        <div className="mt-6 rounded-xl bg-accent p-5 text-accent-foreground">
          <p className="font-heading font-semibold">
            Starting from ₹{procedure.costMin?.toLocaleString("en-IN")}
            {procedure.costMax ? ` – ₹${procedure.costMax.toLocaleString("en-IN")}` : ""}
          </p>
          <Link href="/cost" className="text-sm underline">
            See the full cost estimator
          </Link>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button
          size="xl"
          render={<Link href={`/book?condition=${procedure.condition.slug}`} />}
          className="bg-brand text-brand-foreground hover:bg-brand/90"
        >
          Book This Procedure
        </Button>
        <Button size="xl" variant="outline" render={<Link href={`/conditions/${procedure.condition.slug}`} />}>
          Back to {procedure.condition.name}
        </Button>
      </div>
    </div>
  );
}
