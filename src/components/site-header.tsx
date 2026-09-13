import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav } from "@/components/site-nav";
import { Wordmark } from "@/components/wordmark";
import { getAllDoctors, getConditionsGroupedByCategory, getSiteSettings } from "@/lib/queries";

export async function SiteHeader() {
  const [conditionGroups, doctors, settings] = await Promise.all([
    getConditionsGroupedByCategory(),
    getAllDoctors(),
    getSiteSettings(),
  ]);

  const phone = settings.phone ?? "+91 87338 89957";
  const whatsapp = settings.whatsapp ?? "918733889957";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="hidden items-center justify-end gap-4 border-b border-border/60 bg-muted/40 px-6 py-1.5 text-xs text-muted-foreground lg:flex">
        <a href={`https://wa.me/${whatsapp}`} className="flex items-center gap-1 hover:text-foreground">
          <MessageCircle className="size-3.5" /> WhatsApp Us
        </a>
        <a href={`tel:${phone}`} className="flex items-center gap-1 hover:text-foreground">
          <Phone className="size-3.5" /> {phone}
        </a>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/">
          <Wordmark />
        </Link>
        <SiteNav conditionGroups={conditionGroups} doctors={doctors} phone={phone} />
        <Button
          size="lg"
          nativeButton={false}
          render={<Link href="/book" />}
          className="hidden bg-brand text-brand-foreground hover:bg-brand/90 lg:inline-flex"
        >
          Book an Appointment
        </Button>
      </div>
    </header>
  );
}
