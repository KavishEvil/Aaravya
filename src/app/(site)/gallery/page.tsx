import type { Metadata } from "next";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { legacyAsset } from "@/lib/assets";
import { getMediaByCategory } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Aaravya Hospital — happy patients, our facility, and procedures.",
};

/** Each category's source photos were shot at a different natural ratio —
 * matching it here avoids the aggressive object-cover cropping you get from
 * forcing everything into a uniform square. */
const CATEGORY_ASPECT = {
  HAPPY_FACES: "aspect-3/4",
  INTERIOR: "aspect-4/3",
  SURGERY: "aspect-16/9",
  TESTIMONIAL: "aspect-3/4",
} as const;

function MediaGrid({
  items,
  category,
}: {
  items: Awaited<ReturnType<typeof getMediaByCategory>>;
  category: keyof typeof CATEGORY_ASPECT;
}) {
  const images = items.filter((i) => i.type === "IMAGE");
  const videos = items.filter((i) => i.type === "VIDEO");
  const aspect = CATEGORY_ASPECT[category];

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {images.map((item) => {
        const src = legacyAsset(item.url);
        if (!src) return null;
        return (
          <div key={item.id} className={`relative ${aspect} overflow-hidden rounded-xl bg-muted`}>
            <Image
              src={src}
              alt="Aaravya Hospital"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          </div>
        );
      })}
      {videos.map((item) => (
        <div key={item.id} className="relative aspect-video overflow-hidden rounded-xl bg-muted sm:col-span-2">
          <iframe
            src={`https://www.youtube.com/embed/${item.youtubeId}`}
            title="Aaravya Hospital video"
            className="size-full"
            allowFullScreen
          />
        </div>
      ))}
    </div>
  );
}

export default async function GalleryPage() {
  const [happyFaces, interior, surgery] = await Promise.all([
    getMediaByCategory("HAPPY_FACES"),
    getMediaByCategory("INTERIOR"),
    getMediaByCategory("SURGERY"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="text-center">
        <h1 className="font-heading text-4xl font-semibold text-balance">Gallery</h1>
        <p className="mt-3 text-muted-foreground">
          A look inside Aaravya Hospital — our patients, our facility, and our procedures.
        </p>
      </div>

      <Tabs defaultValue="happy-faces" className="mt-10">
        <TabsList className="mx-auto">
          <TabsTrigger value="happy-faces">Happy Faces</TabsTrigger>
          <TabsTrigger value="interior">Interior</TabsTrigger>
          <TabsTrigger value="surgery">Surgery</TabsTrigger>
        </TabsList>
        <TabsContent value="happy-faces">
          <MediaGrid items={happyFaces} category="HAPPY_FACES" />
        </TabsContent>
        <TabsContent value="interior">
          <MediaGrid items={interior} category="INTERIOR" />
        </TabsContent>
        <TabsContent value="surgery">
          <MediaGrid items={surgery} category="SURGERY" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
