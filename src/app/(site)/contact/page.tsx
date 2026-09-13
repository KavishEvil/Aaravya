import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getPrimaryLocation } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Aaravya Hospital, Chandkheda, Ahmedabad — phone, WhatsApp, email, and directions.",
};

export default async function ContactPage() {
  const location = await getPrimaryLocation();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-semibold text-balance">Contact Us</h1>
        <p className="mt-3 text-muted-foreground">
          Call, WhatsApp, or visit us directly — we&rsquo;re happy to help.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          {location?.address && (
            <div className="flex gap-3 rounded-xl border border-border bg-card p-5">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand" />
              <div>
                <p className="font-medium text-card-foreground">Address</p>
                <p className="mt-1 text-sm text-muted-foreground">{location.address}</p>
              </div>
            </div>
          )}
          {location?.phone && (
            <a
              href={`tel:${location.phone}`}
              className="flex gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand"
            >
              <Phone className="mt-0.5 size-5 shrink-0 text-brand" />
              <div>
                <p className="font-medium text-card-foreground">Phone</p>
                <p className="mt-1 text-sm text-muted-foreground">{location.phone}</p>
              </div>
            </a>
          )}
          {location?.whatsapp && (
            <a
              href={`https://wa.me/${location.whatsapp}`}
              className="flex gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand"
            >
              <MessageCircle className="mt-0.5 size-5 shrink-0 text-brand" />
              <div>
                <p className="font-medium text-card-foreground">WhatsApp</p>
                <p className="mt-1 text-sm text-muted-foreground">Chat with our coordinator</p>
              </div>
            </a>
          )}
          {location?.email && (
            <a
              href={`mailto:${location.email}`}
              className="flex gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand"
            >
              <Mail className="mt-0.5 size-5 shrink-0 text-brand" />
              <div>
                <p className="font-medium text-card-foreground">Email</p>
                <p className="mt-1 text-sm text-muted-foreground">{location.email}</p>
              </div>
            </a>
          )}
        </div>

        {location?.mapEmbedUrl && (
          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              src={location.mapEmbedUrl}
              title="Aaravya Hospital location"
              className="h-full min-h-80 w-full"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}
