"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Wordmark from "./Wordmark";

/**
 * The masthead wordmark, linking home.
 *
 * Carries the same behaviour as the nav items: a Link to the route you are
 * already on is a no-op in the App Router, so clicking the logo from halfway
 * down the homepage did nothing at all. Returning to the top is what the
 * click means there — and the logo is the control most people reach for to
 * get back to the start, so it needed this more than the nav did.
 */
export default function HomeLink() {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      onClick={(event) => {
        if (pathname !== "/") return;
        event.preventDefault();
        const reduced = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
      className="flex min-h-11 shrink-0 items-center"
      aria-label="Pharmatiya Health — home"
    >
      <Wordmark />
    </Link>
  );
}
