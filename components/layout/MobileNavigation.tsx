"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

/**
 * Mobile navigation.
 *
 * A single flat list of six — the current site's two-level "Folder: Products /
 * Back" drill-down disappears along with the Products folder.
 *
 * Focus is trapped while open, Escape closes, focus returns to the trigger,
 * and background scroll is locked.
 */
export default function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock background scroll while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape to close, Tab cycles within the panel.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        triggerRef.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (open) {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }
  }, [open]);

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="ml-auto lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-sm border border-rule bg-surface px-3 font-mono text-caption text-ink"
      >
        <span aria-hidden="true" className="text-[1rem] leading-none">
          ☰
        </span>
        Menu
      </button>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex flex-col bg-paper"
        >
          <div className="flex items-center border-b border-rule px-5 py-4">
            <span className="font-mono text-caption uppercase tracking-[0.12em] text-faint">
              Menu
            </span>
            <button
              type="button"
              onClick={() => {
                close();
                triggerRef.current?.focus();
              }}
              className="ml-auto flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-rule bg-surface px-3 font-mono text-caption text-ink"
            >
              Close
            </button>
          </div>

          <nav aria-label="Primary" className="flex-1 overflow-y-auto px-5 py-4">
            <ul className="flex flex-col">
              {nav.map(({ href, label }) => (
                <li key={href} className="border-b border-rule">
                  <Link
                    href={href}
                    aria-current={isCurrent(href) ? "page" : undefined}
                    className={`flex min-h-14 items-center font-display text-[1.25rem] no-underline ${
                      isCurrent(href) ? "text-accent" : "text-ink"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-rule px-5 py-4">
            <Link
              href="/contact/"
              className="flex min-h-12 w-full items-center justify-center border border-accent bg-accent px-6 font-medium text-paper no-underline"
            >
              Book a consultation
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
