import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

/**
 * The GitHub Pages build is a client preview, not the live site — it is
 * excluded from indexing so it cannot compete with pharmatiya.net in search.
 */
const isPreview = process.env.NEXT_PUBLIC_PREVIEW === "true";

export default function robots(): MetadataRoute.Robots {
  if (isPreview) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
