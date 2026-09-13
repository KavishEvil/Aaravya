import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ComingSoon({
  title,
  description,
  step,
}: {
  title: string;
  description: string;
  step: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        {step}
      </span>
      <h1 className="mt-3 font-heading text-3xl font-semibold text-balance">{title}</h1>
      <p className="mt-3 text-muted-foreground">{description}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button render={<a href="tel:+918733889957" />} className="bg-brand text-brand-foreground hover:bg-brand/90">
          Call +91 87338 89957
        </Button>
        <Button variant="outline" render={<a href="https://wa.me/918733889957" />}>
          WhatsApp Us
        </Button>
      </div>
      <Link href="/" className="mt-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        Back to Home
      </Link>
    </div>
  );
}
