import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { ANONYMOUS_CATEGORIES, getAnonymousCategory } from "@/content/anonymous-categories";
import { ConfidentialityBadge } from "@/components/confidentiality-badge";
import { AnonymousRequestForm } from "./request-form";

export async function generateStaticParams() {
  return ANONYMOUS_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getAnonymousCategory(slug);
  if (!category) return {};
  return {
    title: `Anonymous Consultation — ${category.label}`,
    description: category.headline,
  };
}

export default async function AnonymousCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getAnonymousCategory(slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <nav className="text-xs text-muted-foreground">
        <Link href="/anonymous-consultation" className="hover:text-foreground">
          Anonymous Consultation
        </Link>{" "}
        / <span className="text-foreground">{category.label}</span>
      </nav>

      <div className="mt-4">
        <ConfidentialityBadge />
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-brand">
            {category.hook}
          </span>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-balance sm:text-4xl">
            {category.headline}
          </h1>
          <p className="mt-5 text-muted-foreground">{category.intro}</p>

          <section className="mt-8">
            <h2 className="font-heading text-xl font-semibold">Why this is common</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {category.whyCommon.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8">
            <h2 className="font-heading text-xl font-semibold">What to expect</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {category.whatToExpect.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-8 rounded-xl bg-muted/40 p-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">This still goes through the same doctors and the same care.</p>
            <p className="mt-1">
              Choosing this category just tailors the information on this page — your
              consultation, treatment, and records are handled exactly the same way as
              any other appointment.{" "}
              <Link href="/privacy" className="underline hover:text-foreground">
                Read our privacy approach
              </Link>
              .
            </p>
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <AnonymousRequestForm categorySlug={category.slug} offerFemaleDoctor={category.offerFemaleDoctor} />
          <a
            href="https://wa.me/918733889957?text=Hi%2C%20I%27d%20like%20to%20request%20an%20anonymous%20video%20consultation."
            className="flex items-center justify-center gap-2 rounded-xl border border-border p-4 text-sm font-medium hover:border-brand"
          >
            <MessageCircle className="size-4 text-brand" /> Prefer WhatsApp? Message us directly
          </a>
        </aside>
      </div>
    </div>
  );
}
