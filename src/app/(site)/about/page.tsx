import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { legacyAsset } from "@/lib/assets";
import { getAllDoctors, getPrimaryLocation } from "@/lib/queries";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Aaravya Hospital, Chandkheda, Ahmedabad — our facility, doctors, and approach to care.",
};

export default async function AboutPage() {
  const [doctors, location] = await Promise.all([getAllDoctors(), getPrimaryLocation()]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-heading text-4xl font-semibold text-balance">About Aaravya Hospital</h1>
      <p className="mt-4 text-muted-foreground">
        Aaravya Hospital is a dedicated proctology and general-surgery centre
        in Chandkheda, Ahmedabad, offering modern laser and minimally-invasive
        treatment for anorectal conditions alongside general surgery,
        urology, and peripheral vascular care.
      </p>
      {location?.address && (
        <p className="mt-4 text-sm text-muted-foreground">{location.address}</p>
      )}

      <ul className="mt-8 flex flex-col gap-2.5">
        {[
          "Day-care laser procedures with faster recovery than open surgery",
          "Doctor-reviewed care plans across proctology, general surgery, urology, and vascular conditions",
          "A female doctor available for patients who prefer one",
          "Transparent, doctor-reviewed treatment information on every condition page",
        ].map((point) => (
          <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand" />
            {point}
          </li>
        ))}
      </ul>

      <h2 className="mt-12 font-heading text-2xl font-semibold">Our Doctors</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {doctors.map((doctor) => {
          const photo = legacyAsset(doctor.photoUrl);
          return (
            <Link
              key={doctor.slug}
              href={`/doctors/${doctor.slug}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand"
            >
              {photo && (
                <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image src={photo} alt={doctor.name} fill sizes="64px" className="object-cover" />
                </div>
              )}
              <div>
                <p className="font-heading font-semibold">{doctor.name}</p>
                <p className="text-sm text-muted-foreground">{doctor.designation}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <Button size="xl" render={<Link href="/book" />} className="mt-10 bg-brand text-brand-foreground hover:bg-brand/90">
        Book an Appointment
      </Button>
    </div>
  );
}
