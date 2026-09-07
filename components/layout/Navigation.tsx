"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

/**
 * Desktop navigation, carried entirely by type and spacing.
 *
 * No filled CTA in the bar. A consultation is the one thing this site wants,
 * and setting it as a text link with an arrow — the same treatment every
 * other action gets — is what keeps the masthead quiet. A pill here would be
 * the single loudest object on every page.
 *
 * The current page is marked by a hairline that enters from the left rather
 * than by a weight change, so the row keeps an even colour and nothing shifts
 * when the route changes.
 */
export default function Navigation() {
  const pathname = usePathname();

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const onProductPage = pathname.startsWith("/nextgen-ai");

  return (
    <nav aria-label="Primary" className="ml-auto hidden items-center gap-12 lg:flex">
      <ul className="flex items-center gap-9">
        {nav.slice(1).map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={isCurrent(href) ? "page" : undefined}
              className={`relative py-1 text-small no-underline transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] hover:after:scale-x-100 ${
                isCurrent(href)
                  ? "text-ink after:scale-x-100 after:bg-accent"
                  : "text-muted after:bg-ink hover:text-ink"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={onProductPage ? "/contact/#demo" : "/contact/"}
        className="group inline-flex items-baseline gap-2 text-small font-medium text-ink no-underline"
      >
        <span className="border-b border-ink/35 pb-0.5 transition-colors duration-200 group-hover:border-accent">
          {onProductPage ? "Request a demo" : "Book a consultation"}
        </span>
        <span
          aria-hidden="true"
          className="text-[0.85em] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[4px] group-hover:-translate-y-[2px]"
        >
          ↗
        </span>
      </Link>
    </nav>
  );
}
