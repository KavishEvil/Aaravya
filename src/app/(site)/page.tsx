import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { legacyAsset } from "@/lib/assets";
import { ANONYMOUS_CATEGORIES } from "@/content/anonymous-categories";
import {
  getAllDoctors,
  getConditionsGroupedByCategory,
  getFaqs,
  getMediaByCategory,
} from "@/lib/queries";

export default async function Home() {
  const [conditionGroups, doctors, faqs, testimonialImages] = await Promise.all([
    getConditionsGroupedByCategory(),
    getAllDoctors(),
    getFaqs("homepage"),
    getMediaByCategory("TESTIMONIAL"),
  ]);

  const proctology = conditionGroups.find((g) => g.category === "PROCTOLOGY");
  const featuredImages = testimonialImages.filter((m) => m.type === "IMAGE").slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#3a653d,#7b9a40)] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-white/70">
              Chandkheda, Ahmedabad
            </span>
            <h1 className="mt-3 font-heading text-4xl font-semibold text-balance sm:text-5xl">
              Dedicated Proctology &amp; Colorectal Care
            </h1>
            <p className="mt-5 max-w-lg text-white/85">
              Piles, fissure, fistula, and pilonidal sinus treated with modern
              laser and minimally-invasive techniques — under Dr. Deep
              Prajapati and Dr. Dipti Prajapati.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="xl" render={<Link href="/book" />} className="bg-white text-[#3a653d] hover:bg-white/90">
                Book an Appointment
              </Button>
              <Button
                size="xl"
                variant="outline"
                render={<Link href="/symptom-checker" />}
                className="border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                Check My Symptoms
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-white/10 p-5">
              <p className="font-heading text-3xl font-semibold">1000+</p>
              <p className="mt-1 text-xs text-white/75">Successful Surgeries</p>
            </div>
            <div className="rounded-xl bg-white/10 p-5">
              <p className="font-heading text-3xl font-semibold">21</p>
              <p className="mt-1 text-xs text-white/75">Conditions Treated</p>
            </div>
            <div className="rounded-xl bg-white/10 p-5">
              <p className="font-heading text-3xl font-semibold">5+ yrs</p>
              <p className="mt-1 text-xs text-white/75">Clinical Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-6 py-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-brand" /> Day-care laser procedures
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="size-4 text-brand" /> Doctor-reviewed care plans
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-4 text-brand" /> Female doctor available
          </div>
        </div>
      </section>

      {/* Condition quick links */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold text-balance">
            Anorectal Conditions We Treat
          </h2>
          <p className="mt-3 text-muted-foreground">
            Non-surgical management through to laser and surgical treatment —
            matched to what your condition actually needs.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {proctology?.conditions.map((c) => (
            <Link
              key={c.slug}
              href={`/conditions/${c.slug}`}
              className="group rounded-xl border border-border bg-card p-5 text-center transition-colors hover:border-brand hover:bg-accent"
            >
              <p className="font-heading font-medium text-card-foreground">{c.name}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-brand opacity-0 transition-opacity group-hover:opacity-100">
                Learn more <ArrowRight className="size-3" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline" render={<Link href="/conditions" />}>
            View All Conditions &amp; Treatments
          </Button>
        </div>
      </section>

      {/* Anonymous consultation teaser */}
      <section className="bg-[var(--secondary)] py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="font-heading text-3xl font-semibold text-balance text-[var(--secondary-foreground)]">
            Find Care That Understands Your Lifestyle
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--secondary-foreground)]/80">
            A fully anonymous video consultation — no full name required, camera
            optional, and a female doctor available on request.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ANONYMOUS_CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/anonymous-consultation/${category.slug}`}
                className="rounded-full border border-[var(--secondary-foreground)]/20 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
              >
                {category.label}
              </Link>
            ))}
          </div>
          <Button size="xl" render={<Link href="/anonymous-consultation" />} className="mt-8 bg-brand text-brand-foreground hover:bg-brand/90">
            Start an Anonymous Consultation
          </Button>
        </div>
      </section>

      {/* Doctors */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-center font-heading text-3xl font-semibold text-balance">
          Meet Your Doctors
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {doctors.map((doctor) => (
            <Link
              key={doctor.slug}
              href={`/doctors/${doctor.slug}`}
              className="flex min-h-[18rem] flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8 text-center transition-colors hover:border-brand sm:justify-center"
            >
              {legacyAsset(doctor.photoUrl) && (
                <div className="relative size-32 shrink-0 overflow-hidden rounded-full bg-muted sm:size-36">
                  <Image
                    src={legacyAsset(doctor.photoUrl)!}
                    alt={doctor.name}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="font-heading text-2xl font-semibold">{doctor.name}</p>
                <p className="mt-1.5 text-base text-brand">{doctor.qualifications}</p>
                <p className="mt-1 text-base text-muted-foreground">{doctor.designation}</p>
                {doctor.specializations.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                    {doctor.specializations.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials preview */}
      {featuredImages.length > 0 && (
        <section className="border-y border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center font-heading text-3xl font-semibold text-balance">
              Patient Stories
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {featuredImages.map((item) => (
                <div key={item.id} className="relative aspect-3/4 overflow-hidden rounded-xl bg-muted">
                  {legacyAsset(item.url) && (
                    <Image
                      src={legacyAsset(item.url)!}
                      alt="Patient testimonial"
                      fill
                      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                      className="object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" render={<Link href="/testimonials" />}>
                See All Testimonials
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Cost transparency teaser */}
      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <h2 className="font-heading text-3xl font-semibold text-balance">
          Know Your Treatment Cost Upfront
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Transparent pricing, cashless insurance support, and EMI options —
          no surprises before your procedure.
        </p>
        <Button variant="outline" render={<Link href="/cost" />} className="mt-6">
          Estimate My Cost
        </Button>
      </section>

      {/* FAQ preview */}
      {faqs.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-center font-heading text-3xl font-semibold text-balance">
              Frequently Asked Questions
            </h2>
            <div className="mt-8 flex flex-col gap-3">
              {faqs.slice(0, 4).map((faq) => (
                <div key={faq.id} className="rounded-xl border border-border bg-card p-5">
                  <p className="font-medium text-card-foreground">{faq.question}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="outline" render={<Link href="/faqs" />}>
                View All FAQs
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
