import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social";
import { Wordmark } from "@/components/wordmark";
import { getConditionsGroupedByCategory, getPrimaryLocation, getSiteSettings } from "@/lib/queries";

export async function SiteFooter() {
  const [location, settings, conditionGroups] = await Promise.all([
    getPrimaryLocation(),
    getSiteSettings(),
    getConditionsGroupedByCategory(),
  ]);

  const proctology = conditionGroups.find((g) => g.category === "PROCTOLOGY");

  return (
    <footer className="border-t border-border bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark variant="inverted" />
          <p className="mt-4 max-w-xs text-sm text-[var(--sidebar-foreground)]/70">
            Dedicated proctology &amp; colorectal care in Chandkheda, Ahmedabad,
            under Dr. Deep Prajapati and Dr. Dipti Prajapati.
          </p>
          <div className="mt-5 flex gap-3">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                aria-label="Facebook"
                className="flex size-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <FacebookIcon className="size-4" />
              </a>
            )}
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <InstagramIcon className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-[var(--sidebar-foreground)]/50">
            Proctology Care
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {proctology?.conditions.map((c) => (
              <li key={c.slug}>
                <Link href={`/conditions/${c.slug}`} className="text-[var(--sidebar-foreground)]/80 hover:text-[var(--sidebar-foreground)]">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-[var(--sidebar-foreground)]/50">
            Quick Links
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><Link href="/about" className="text-[var(--sidebar-foreground)]/80 hover:text-[var(--sidebar-foreground)]">About Us</Link></li>
            <li><Link href="/cost" className="text-[var(--sidebar-foreground)]/80 hover:text-[var(--sidebar-foreground)]">Cost &amp; Insurance</Link></li>
            <li><Link href="/gallery" className="text-[var(--sidebar-foreground)]/80 hover:text-[var(--sidebar-foreground)]">Gallery</Link></li>
            <li><Link href="/faqs" className="text-[var(--sidebar-foreground)]/80 hover:text-[var(--sidebar-foreground)]">FAQs</Link></li>
            <li><Link href="/testimonials" className="text-[var(--sidebar-foreground)]/80 hover:text-[var(--sidebar-foreground)]">Testimonials</Link></li>
            <li><Link href="/blog" className="text-[var(--sidebar-foreground)]/80 hover:text-[var(--sidebar-foreground)]">Health Library</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-[var(--sidebar-foreground)]/50">
            Get in Touch
          </p>
          <ul className="mt-3 flex flex-col gap-3 text-sm text-[var(--sidebar-foreground)]/80">
            {location?.address && (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
                <span>{location.address}</span>
              </li>
            )}
            {settings.phone && (
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
                <a href={`tel:${settings.phone}`} className="hover:text-[var(--sidebar-foreground)]">{settings.phone}</a>
              </li>
            )}
            {settings.whatsapp && (
              <li className="flex gap-2">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
                <a href={`https://wa.me/${settings.whatsapp}`} className="hover:text-[var(--sidebar-foreground)]">WhatsApp Us</a>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />
                <a href={`mailto:${settings.email}`} className="hover:text-[var(--sidebar-foreground)]">{settings.email}</a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-[var(--sidebar-foreground)]/50">
        © {new Date().getFullYear()} Aaravya Hospital. All rights reserved.
      </div>
    </footer>
  );
}
