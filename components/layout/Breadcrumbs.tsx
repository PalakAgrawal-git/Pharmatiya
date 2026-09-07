"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";

/**
 * Breadcrumbs.
 *
 * The site is one level deep, so this is Home › Page and nothing more. It is
 * carried anyway because it gives search results a labelled path and gives a
 * visitor arriving from search — which is most of them, on the Evidence page —
 * an obvious way back up.
 *
 * Rendered from `nav`, so a page added there is covered without touching this
 * file. Nothing renders on the homepage, where a crumb trail to itself would
 * be noise, or on a route not in `nav` (the 404).
 *
 * The matching BreadcrumbList JSON-LD is emitted here rather than in the page
 * so the two can never disagree. Static export prerenders client components,
 * so both the markup and the structured data are in the served HTML.
 */
export default function Breadcrumbs() {
  const pathname = usePathname();
  const current = nav.find(({ href }) => href !== "/" && pathname.startsWith(href));

  if (!current) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: new URL("/", site.url).toString(),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: current.label,
        item: new URL(current.href, site.url).toString(),
      },
    ],
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-rule bg-paper">
        <ol className="shell flex items-center gap-2 py-2.5 font-mono text-caption text-faint">
          <li>
            <Link href="/" className="text-muted no-underline hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <span aria-current="page" className="text-ink">
              {current.label}
            </span>
          </li>
        </ol>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
