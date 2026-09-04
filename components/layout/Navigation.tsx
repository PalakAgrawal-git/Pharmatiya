"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";
import Button from "@/components/ui/Button";

/**
 * Desktop navigation. A flat list of six — no dropdowns, no folders. This
 * removes the extra click the current site's "Products" folder imposes, and
 * puts Services in the primary navigation for the first time.
 */
export default function Navigation() {
  const pathname = usePathname();

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // The demo request is a lower commitment than a consultation, so the
  // product page swaps the header CTA rather than competing with itself.
  const onProductPage = pathname.startsWith("/nextgen-ai");

  return (
    <nav aria-label="Primary" className="ml-auto hidden items-center gap-8 lg:flex">
      <ul className="flex items-center gap-6">
        {nav.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isCurrent(href) ? "page" : undefined}
              className={`border-b-2 py-1 text-small no-underline transition-colors ${
                isCurrent(href)
                  ? "border-accent text-ink"
                  : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <Button href={onProductPage ? "/contact/#demo" : "/contact/"} size="sm">
        {onProductPage ? "Request a demo" : "Book a consultation"}
      </Button>
    </nav>
  );
}
