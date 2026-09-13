import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { legacyAsset } from "@/lib/assets";
import { getAllDoctors } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Our Doctors",
  description: "Meet the doctors at Aaravya Hospital, Chandkheda, Ahmedabad.",
};

export default async function DoctorsPage() {
  const doctors = await getAllDoctors();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-semibold text-balance">Our Doctors</h1>
        <p className="mt-3 text-muted-foreground">
          Experienced specialists blending modern surgical technique with
          compassionate, patient-first care.
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        {doctors.map((doctor) => {
          const photo = legacyAsset(doctor.photoUrl);
          return (
            <Link
              key={doctor.slug}
              href={`/doctors/${doctor.slug}`}
              className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8 text-center transition-colors hover:border-brand"
            >
              {photo && (
                <div className="relative size-32 overflow-hidden rounded-full bg-muted">
                  <Image src={photo} alt={doctor.name} fill sizes="128px" className="object-cover" />
                </div>
              )}
              <div>
                <p className="font-heading text-xl font-semibold">{doctor.name}</p>
                <p className="mt-1 text-sm text-brand">{doctor.qualifications}</p>
                <p className="mt-1 text-sm text-muted-foreground">{doctor.designation}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
