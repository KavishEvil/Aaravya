import type { Metadata } from "next";
import Image from "next/image";
import { legacyAsset } from "@/lib/assets";
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
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-semibold text-balance">Patient Testimonials</h1>
        <p className="mt-3 text-muted-foreground">
          Real patients, real recoveries — in their own words.
        </p>
      </div>

      {videos.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading text-xl font-semibold">Video Stories</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((item) => (
              <div key={item.id} className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                <iframe
                  src={`https://www.youtube.com/embed/${item.youtubeId}`}
                  title="Patient testimonial video"
                  className="size-full"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading text-xl font-semibold">Patient Photos</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((item) => {
              const src = legacyAsset(item.url);
              if (!src) return null;
              return (
                <div key={item.id} className="relative aspect-3/4 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={src}
                    alt="Patient testimonial"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
