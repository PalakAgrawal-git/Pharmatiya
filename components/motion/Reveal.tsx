"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

type Props = {
  children: ReactNode;
  /** Milliseconds to hold before this element settles. Use to stagger a row. */
  delay?: number;
  threshold?: number;
  as?: ElementType;
  className?: string;
  /**
   * Anything else is forwarded to the rendered element. Reveal is often the
   * outermost node of a landmark — `as="nav"` with an `aria-label`, `as="ol"`,
   * a section `id` used as an anchor target — and a closed prop type would
   * force a redundant wrapper div around every one of those.
   */
  [key: string]: unknown;
};

/**
 * Scroll-triggered reveal.
 *
 * Three states, and the ordering matters:
 *
 *  - "idle"  — server render and no-JS. Nothing is hidden, so the page is
 *              complete without JavaScript and there is no flash.
 *  - "armed" — applied on mount only to elements BELOW the fold, which are
 *              not visible anyway, so hiding them costs nothing.
 *  - "shown" — plays the transition.
 *
 * Anything already in the viewport on load goes straight to "shown" without
 * arming, so the hero never fades in on top of itself.
 *
 * Twelve lines of IntersectionObserver rather than a motion library — the
 * whole site ships less JavaScript than one would cost.
 */
export default function Reveal({
  children,
  delay = 0,
  threshold = 0.04,
  as: Tag = "div",
  className = "",
  ...rest
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "shown">("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const box = node.getBoundingClientRect();
    const alreadyVisible = box.top < window.innerHeight && box.bottom > 0;

    if (alreadyVisible) {
      setState("shown");
      return;
    }

    setState("armed");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -4% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Tag
      {...rest}
      ref={ref}
      data-reveal={state}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
