"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
} from "react";

type Props = {
  /** The finished string, e.g. "25+" or "47". Non-digits are preserved. */
  value: string;
  duration?: number;
  as?: ElementType;
  className?: string;
};

/**
 * useLayoutEffect on the client, useEffect on the server. The count has to be
 * zeroed BEFORE the first paint or the finished number flashes for a frame
 * and then restarts, which reads as a glitch rather than an effect.
 */
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * A figure that counts up when it scrolls into view.
 *
 * Progressive enhancement, same contract as Reveal: the server renders the
 * finished value, so without JavaScript the number is simply there. Any
 * non-digit characters in the value — the "+" in "25+" — are held constant
 * and only the digits animate, so nothing has to be parsed back together.
 *
 * Counting is skipped entirely under prefers-reduced-motion. It is also
 * skipped for any value with no digits in it, which is how a "To provide"
 * placeholder passes through untouched.
 */
export default function CountUp({
  value,
  duration = 1400,
  as: Tag = "span",
  className = "",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(value);

  const digits = value.match(/\d+/);
  const target = digits ? parseInt(digits[0], 10) : null;

  // Zero the figure before the first paint, but ONLY if it is below the fold.
  // A figure already on screen when hydration runs would otherwise show its
  // finished value, snap back to zero and count again — a visible flash. The
  // same rule Reveal uses: nothing on screen at load is allowed to animate,
  // because you cannot hide it first without the hiding itself being seen.
  useIsomorphicLayoutEffect(() => {
    if (target === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const node = ref.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    setShown(value.replace(/\d+/, "0"));
  }, [target, value]);

  useEffect(() => {
    if (target === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const node = ref.current;
    if (!node) return;

    let frame = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // Expo-out, matching --ease-settle: fast departure, long settle.
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setShown(value.replace(/\d+/, String(Math.round(target * eased))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    // Already on screen: it was never zeroed, so leave it finished.
    const box = node.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, value, duration]);

  return (
    <Tag ref={ref} className={className}>
      {shown}
    </Tag>
  );
}
