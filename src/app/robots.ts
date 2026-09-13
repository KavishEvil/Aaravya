import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/schema";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      // Explicitly allow the AI crawlers most likely to cite this site in generative answers.
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
