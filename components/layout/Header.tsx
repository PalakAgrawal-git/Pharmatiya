import Link from "next/link";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import Wordmark from "./Wordmark";

/**
 * Site header. The consultation CTA is persistent on desktop so the referral
 * visitor — who often skips the page body entirely — never has to hunt for it.
 * On mobile it moves to the sticky bottom bar to keep the header at 56px.
 *
 * The bar sticks. On a six-section page like Evidence the navigation and the
 * consultation CTA would otherwise scroll away at the first screen and never
 * return. Translucency plus a blur keeps the plotting-paper ground of the hero
 * reading through it rather than stamping an opaque slab over the page — and
 * it costs no JavaScript, so there is no scroll listener and no state.
 *
 * z-40 sits under the mobile navigation overlay at z-50, which must cover it.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/85 backdrop-blur-[6px] supports-[not(backdrop-filter:blur(0))]:bg-paper">
      <div className="shell flex items-center gap-6 py-4">
        <Link
          href="/"
          className="flex min-h-11 shrink-0 items-center"
          aria-label="Pharmatiya Health — home"
        >
          <Wordmark />
        </Link>

        <Navigation />
        <MobileNavigation />
      </div>

      {/* Reading progress, sitting on the header's own bottom rule. Pure CSS
          scroll-linked animation — no listener, no state, no re-render. */}
      <div
        aria-hidden="true"
        className="read-progress absolute inset-x-0 bottom-[-1px] h-[2px] bg-accent"
      />
    </header>
  );
}
