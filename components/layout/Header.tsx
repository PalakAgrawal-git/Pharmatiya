import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import HomeLink from "./HomeLink";

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
    <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur-[10px] supports-[not(backdrop-filter:blur(0))]:bg-paper">
      <div className="shell flex h-[4.75rem] items-center gap-8">
        <HomeLink />

        <Navigation />
        <MobileNavigation />
      </div>

      {/* The bar carries no rule at the top of the page and grows one as
          soon as it starts overlapping content, so the masthead sits on open
          paper rather than in a boxed strip. Both this and the reading
          progress are scroll-linked CSS animations — no listener, no state,
          no re-render. */}
      <div
        aria-hidden="true"
        className="header-rule absolute inset-x-0 bottom-0 h-px bg-rule"
      />
      <div
        aria-hidden="true"
        className="read-progress absolute inset-x-0 bottom-0 h-px bg-accent"
      />
    </header>
  );
}
