import type { MetadataRoute } from "next";
import { nav, site } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return nav.map(({ href }) => ({
    url: new URL(href, site.url).toString(),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: href === "/" ? 1 : 0.8,
  }));
}
