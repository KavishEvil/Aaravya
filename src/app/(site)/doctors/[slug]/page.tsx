import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { legacyAsset } from "@/lib/assets";
import { prisma } from "@/lib/prisma";
import { getDoctorBySlug } from "@/lib/queries";
import { JsonLd } from "@/components/json-ld";
import { physicianSchema } from "@/lib/schema";

export async function generateStaticParams() {
  const doctors = await prisma.doctor.findMany({ select: { slug: true } });
  return doctors.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) return {};
  return {
    title: doctor.name,
    description: `${doctor.name} — ${doctor.designation} at Aaravya Hospital, Chandkheda, Ahmedabad.`,
  };
}

export default async function DoctorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = await getDoctorBySlug(slug);
  if (!doctor) notFound();

  const photo = legacyAsset(doctor.photoUrl);
  const schema = physicianSchema(doctor);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <JsonLd data={schema} />
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <div>
          {photo && (
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Image src={photo} alt={doctor.name} fill sizes="280px" className="object-cover" priority />
            </div>
          )}
          <div className="mt-5 rounded-xl border border-border bg-card p-4 text-sm">
            {doctor.registrationNumber && (
              <p className="text-muted-foreground">Reg. No: {doctor.registrationNumber}</p>
            )}
            {doctor.yearsExperience && (
              <p className="mt-1 text-muted-foreground">{doctor.yearsExperience}+ years experience</p>
            )}
            {doctor.surgeriesCount && (
              <p className="mt-1 text-muted-foreground">{doctor.surgeriesCount}+ successful surgeries</p>
            )}
          </div>
          {doctor.phone && (
            <Button
              render={<a href={`tel:${doctor.phone}`} />}
              className="mt-4 w-full bg-brand text-brand-foreground hover:bg-brand/90"
            >
              <Phone className="mr-1.5" /> Call to Book
            </Button>
          )}
        </div>

        <div>
          <h1 className="font-heading text-3xl font-semibold text-balance">{doctor.name}</h1>
          <p className="mt-1 font-medium text-brand">{doctor.qualifications}</p>
          <p className="mt-1 text-muted-foreground">{doctor.designation}</p>

          {doctor.specializations.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {doctor.specializations.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-4">
            {doctor.bioParagraphs.map((paragraph, i) => (
              <p key={i} className="text-muted-foreground">{paragraph}</p>
            ))}
          </div>

          {doctor.philosophy && (
            <blockquote className="mt-6 rounded-xl border-l-4 border-brand bg-accent p-5 text-accent-foreground italic">
              &ldquo;{doctor.philosophy}&rdquo;
            </blockquote>
          )}

          {doctor.reviewedConditions.length > 0 && (
            <div className="mt-8">
              <p className="font-heading text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Conditions Reviewed By {doctor.name}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {doctor.reviewedConditions.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/conditions/${c.slug}`}
                    className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-brand hover:text-brand"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Button
            size="xl"
            render={<Link href={`/book?doctor=${doctor.slug}`} />}
            className="mt-8 bg-brand text-brand-foreground hover:bg-brand/90"
          >
            Book an Appointment with {doctor.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
