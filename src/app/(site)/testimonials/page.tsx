import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/site/reveal";
import { TestimonialPhotoCarousel } from "@/components/site/testimonial-photo-carousel";
import { getMediaByCategory } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Patient Testimonials",
  description: "Patient stories and testimonials from Aaravya Hospital, Chandkheda, Ahmedabad.",
};

export default async function TestimonialsPage() {
  const items = await getMediaByCategory("TESTIMONIAL");
  const images = items.filter((i) => i.type === "IMAGE");
  const videos = items.filter((i) => i.type === "VIDEO");

  return (
    <div>
      <PageHero
        eyebrow="Patient Stories"
        title="Patient Testimonials"
        description="Real patients, real recoveries — in their own words."
      />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        {videos.length > 0 && (
          <Reveal>
            <h2 className="font-heading text-xl font-semibold text-forest-900">Video Stories</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((item) => (
                <div key={item.id} className="relative aspect-video overflow-hidden rounded-xl bg-muted shadow-soft-sm">
                  <iframe
                    src={`https://www.youtube.com/embed/${item.youtubeId}`}
                    title="Patient testimonial video"
                    className="size-full"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {images.length > 0 && (
          <Reveal className={videos.length > 0 ? "mt-14" : undefined}>
            <h2 className="font-heading text-xl font-semibold text-forest-900">Patient Photos</h2>
            <div className="mt-5">
              <TestimonialPhotoCarousel items={images} />
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}
