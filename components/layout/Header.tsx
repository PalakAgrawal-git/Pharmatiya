import Link from "next/link";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import Wordmark from "./Wordmark";

/**
 * Site header. The consultation CTA is persistent on desktop so the referral
 * visitor — who often skips the page body entirely — never has to hunt for it.
 * On mobile it moves to the sticky bottom bar to keep the header at 56px.
 */
export default function Header() {
  return (
    <header className="border-b border-rule bg-paper">
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
    </header>
  );
}
