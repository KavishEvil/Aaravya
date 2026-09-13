import type { Metadata } from "next";
import Link from "next/link";
import { Lock, MessageCircle, ShieldCheck, UserX } from "lucide-react";
import { ANONYMOUS_CATEGORIES } from "@/content/anonymous-categories";
import { ConfidentialityBadge } from "@/components/confidentiality-badge";

export const metadata: Metadata = {
  title: "Anonymous Video Consultation",
  description:
    "A fully confidential video consultation at Aaravya Hospital — no full name required, camera optional, nickname welcome.",
};

const PROMISES = [
  { icon: UserX, text: "No full name required — a nickname or initials is enough" },
  { icon: Lock, text: "Camera can stay off for your first call" },
  { icon: ShieldCheck, text: "Nothing is recorded unless you consent, and only the treating doctor sees your request" },
];

export default function AnonymousConsultationHub() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <div className="flex justify-center">
          <ConfidentialityBadge />
        </div>
        <h1 className="mt-5 font-heading text-4xl font-semibold text-balance">
          Find Care That Understands Your Lifestyle
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Piles, fissures, and fistula are common — the embarrassment around
          them shouldn&rsquo;t stop you from getting checked. Pick whichever
          fits, or skip straight to &ldquo;Others.&rdquo;
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
        {PROMISES.map(({ icon: Icon, text }) => (
          <div key={text} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center text-xs text-muted-foreground">
            <Icon className="size-5 text-brand" />
            {text}
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ANONYMOUS_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/anonymous-consultation/${category.slug}`}
            className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-brand hover:bg-accent"
          >
            <p className="font-heading text-lg font-semibold">{category.label}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">{category.hook}</p>
            <span className="mt-3 inline-block text-sm font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
              Continue →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <a
          href="https://wa.me/918733889957?text=Hi%2C%20I%27d%20like%20to%20request%20an%20anonymous%20video%20consultation."
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium hover:border-brand"
        >
          <MessageCircle className="size-4 text-brand" /> Don&rsquo;t want to pick a category? Message us on WhatsApp
        </a>
      </div>
    </div>
  );
}
