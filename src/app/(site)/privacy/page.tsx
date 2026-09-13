import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Approach",
  description: "How Aaravya Hospital handles your information, especially for anonymous consultation requests.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-4xl font-semibold text-balance">Our Privacy Approach</h1>
      <p className="mt-4 text-muted-foreground">
        This page explains, in plain language, what actually happens to your
        information when you use this site — particularly for an anonymous
        consultation request. It is a description of our system&rsquo;s real
        behaviour, not a substitute for a full legal privacy policy, which
        will be published before public launch.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <section>
          <h2 className="font-heading text-lg font-semibold">What we ask for</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            For an anonymous consultation request, we only ask for a nickname
            or initials and a phone number — enough to send you a video call
            link. A full legal name is never required for this flow. Email
            and any notes you add are optional.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-semibold">Who sees your request</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your request is visible to our booking coordinator (to schedule
            the call) and the treating doctor. It is not shared outside the
            clinic, and it is stored in the same system as every other
            appointment — anonymity here is a presentation choice for you,
            not a separate, less-secure system.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-semibold">Recording</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Video consultations are not recorded unless you explicitly
            consent to it during the call. Keeping your camera off is fine
            and does not affect the quality of care.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-lg font-semibold">Questions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If anything here is unclear, message us on WhatsApp before
            booking — you can ask questions without giving any identifying
            details first.
          </p>
        </section>
      </div>
    </div>
  );
}
