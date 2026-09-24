import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social";
import { Wordmark } from "@/components/wordmark";
import { getConditionsGroupedByCategory, getContactDetails, getPrimaryLocation, getSiteSettings } from "@/lib/queries";

/**
 * Deliberately dark forest (not the admin's slate/blue --sidebar tokens --
 * those are a separate palette now, see globals.css) so the public footer
 * reads as an extension of the brand rather than borrowing admin chrome.
 */
export async function SiteFooter() {
  const [location, settings, contact, conditionGroups] = await Promise.all([
    getPrimaryLocation(),
    getSiteSettings(),
    getContactDetails(),
    getConditionsGroupedByCategory(),
  ]);

  const proctology = conditionGroups.find((g) => g.category === "PROCTOLOGY");

  return (
    <footer className="border-t border-forest-950 bg-forest-900 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark variant="inverted" />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Dedicated proctology &amp; colorectal care in Chandkheda, Ahmedabad,
            under Dr. Deep Prajapati and Dr. Dipti Prajapati.
          </p>
          <div className="mt-5 flex gap-3">
            {settings.facebook_url && (
              <a
                href={settings.facebook_url}
                aria-label="Facebook"
                className="flex size-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <FacebookIcon className="size-4" />
              </a>
            )}
            {settings.instagram_url && (
              <a
                href={settings.instagram_url}
                aria-label="Instagram"
                className="flex size-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              >
                <InstagramIcon className="size-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-terracotta-400">
            Proctology Care
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {proctology?.conditions.map((c) => (
              <li key={c.slug}>
                <Link href={`/conditions/${c.slug}`} className="text-white/75 transition-colors hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-terracotta-400">
            Quick Links
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li><Link href="/about" className="text-white/75 transition-colors hover:text-white">About Us</Link></li>
            <li><Link href="/cost" className="text-white/75 transition-colors hover:text-white">Cost &amp; Insurance</Link></li>
            <li><Link href="/gallery" className="text-white/75 transition-colors hover:text-white">Gallery</Link></li>
            <li><Link href="/faqs" className="text-white/75 transition-colors hover:text-white">FAQs</Link></li>
            <li><Link href="/testimonials" className="text-white/75 transition-colors hover:text-white">Testimonials</Link></li>
            <li><Link href="/blog" className="text-white/75 transition-colors hover:text-white">Health Library</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-wide text-terracotta-400">
            Get in Touch
          </p>
          <ul className="mt-3 flex flex-col gap-3 text-sm text-white/80">
            {location?.address && (
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-sage-400" />
                <span>{location.address}</span>
              </li>
            )}
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-sage-400" />
              <a href={contact.phoneHref} className="transition-colors hover:text-white">{contact.phone}</a>
            </li>
            <li className="flex gap-2">
              <MessageCircle className="mt-0.5 size-4 shrink-0 text-sage-400" />
              <a href={contact.whatsappHref()} className="transition-colors hover:text-white">WhatsApp Us</a>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-sage-400" />
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">{contact.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/55">
        © {new Date().getFullYear()} Aaravya Hospital. All rights reserved.
      </div>
    </footer>
  );
}
