"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

/**
 * Desktop navigation, carried entirely by type and spacing.
 *
 * The full `nav` list, Home included. Relying on the wordmark alone to get
 * back to the homepage is a convention some visitors know and others do not,
 * and it left the desktop bar showing five items where the mobile menu and
 * the footer both showed six.
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

  /* A Link to the route you are already on is a no-op in the App Router: no
     navigation happens, so no scroll reset happens either. Clicking "Home"
     from halfway down the homepage therefore did nothing at all, which reads
     as the link being broken — you are left looking at whatever section you
     had reached. Every nav item has the same problem; Home is just where it
     is most obvious, because the record band sits right below the fold.

     Returning to the top is what the click means in that case. Honours
     reduced-motion by jumping rather than sliding. */
  const backToTopIfCurrent = (href: string) => (event: React.MouseEvent) => {
    if (!isCurrent(href)) return;
    event.preventDefault();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };


  return (
    <nav aria-label="Primary" className="ml-auto hidden items-center gap-12 lg:flex">
      <ul className="flex items-center gap-9">
        {nav.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={backToTopIfCurrent(href)}
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

      {/* The action is contextual — on the product page it asks for a demo
          and deep-links to that section — and the two labels are different
          lengths. The bar is right-aligned, and this sits at the end of it,
          so leaving the width to the text made every tab slide sideways on
          the way in and out of the product page.

          Both labels are stacked in one grid cell with the longer one
          holding the width open. Measured rather than guessed at with a
          min-width, so it stays correct if a label is reworded and through
          the swap from the fallback face to Fira Sans. */}
      <Link
        href={onProductPage ? "/contact/#demo" : "/contact/"}
        className="group inline-flex items-baseline gap-2 text-small font-medium text-ink no-underline"
      >
        <span className="grid border-b border-transparent pb-0.5 transition-colors duration-200 group-hover:border-accent">
          <span
            aria-hidden="true"
            className="invisible col-start-1 row-start-1 h-0 overflow-hidden"
          >
            Book a consultation
          </span>
          <span className="col-start-1 row-start-1">
            {onProductPage ? "Request a demo" : "Book a consultation"}
          </span>
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
