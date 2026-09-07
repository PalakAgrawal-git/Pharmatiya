"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";
import Button from "@/components/ui/Button";

/**
 * Desktop navigation. A flat list of six — no dropdowns, no folders.
 *
 * The current page is marked with a hairline under the label rather than a
 * weight change, so the row keeps an even colour and nothing jumps when the
 * route changes. Spacing is generous because the bar is mostly empty space by
 * design: it is a masthead, not a toolbar.
 */
export default function Navigation() {
  const pathname = usePathname();

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // The demo request is a lower commitment than a consultation, so the
  // product page swaps the header CTA rather than competing with itself.
  const onProductPage = pathname.startsWith("/nextgen-ai");

  return (
    <nav aria-label="Primary" className="ml-auto hidden items-center gap-10 lg:flex">
      <ul className="flex items-center gap-8">
        {nav.slice(1).map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isCurrent(href) ? "page" : undefined}
              className={`relative py-1 text-small no-underline transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-ink after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100 ${
                isCurrent(href)
                  ? "text-ink after:scale-x-100 after:bg-accent"
                  : "text-muted hover:text-ink"
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
