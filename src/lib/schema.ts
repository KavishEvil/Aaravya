import { legacyAsset } from "@/lib/assets";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.aaravyahospital.com";

export function absoluteUrl(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationSchema(opts: {
  phone: string;
  email: string;
  address: string;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Hospital",
    name: "Aaravya Hospital",
    url: SITE_URL,
    telephone: opts.phone,
    email: opts.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: opts.address,
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    sameAs: [opts.facebookUrl, opts.instagramUrl].filter((v): v is string => Boolean(v)),
  };
}

export function physicianSchema(doctor: {
  name: string;
  slug: string;
  qualifications: string;
  designation: string;
  photoUrl?: string | null;
  registrationNumber?: string | null;
}) {
  const image = legacyAsset(doctor.photoUrl);
  return {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    url: absoluteUrl(`/doctors/${doctor.slug}`),
    ...(image ? { image: absoluteUrl(image) } : {}),
    medicalSpecialty: doctor.designation,
    honorificSuffix: doctor.qualifications,
    ...(doctor.registrationNumber ? { identifier: doctor.registrationNumber } : {}),
    worksFor: { "@type": "Hospital", name: "Aaravya Hospital", url: SITE_URL },
  };
}

export function medicalWebPageSchema(opts: {
  name: string;
  description: string;
  url: string;
  lastReviewed: Date;
  reviewedByName?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    lastReviewed: opts.lastReviewed.toISOString(),
    ...(opts.reviewedByName
      ? { reviewedBy: { "@type": "Physician", name: opts.reviewedByName } }
      : {}),
  };
}

export function medicalProcedureSchema(opts: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: opts.name,
    description: opts.description,
    url: opts.url,
  };
}

export function faqPageSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
