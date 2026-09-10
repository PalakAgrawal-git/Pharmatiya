"use client";

import { useCallback, useRef, useState } from "react";
import KaplanMeierGraphic from "./KaplanMeierGraphic";

/**
 * The survival estimate, made readable.
 *
 * Hovering — or focusing and using the arrow keys — drops a guideline at the
 * nearest follow-up month and reads both arms off the curve at that point.
 *
 * This is the one piece of the site that behaves like the instrument the
 * practice actually sells. A static chart on a consultancy homepage is
 * decoration whatever it is a chart of; a chart you can interrogate is a
 * small demonstration of the work. It stays quiet until someone engages with
 * it, which is the difference between fancy and loud.
 *
 * Progressive enhancement, the same contract as everything else here: the
 * chart underneath is the plain server-rendered SVG with its full accessible
 * description, so with JavaScript off nothing is lost but the readout.
 */

/* Step data, read off the same coordinates the curve is drawn from rather
   than kept as a second copy that could drift: x = 56 + (month / 24) * 374,
   and survival = (270 - y) / 480 + 0.5. */
const MONTHS = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const INTERVENTION = [1.0, 0.97, 0.93, 0.89, 0.86, 0.83, 0.81, 0.79, 0.78];
const COMPARATOR = [1.0, 0.92, 0.84, 0.76, 0.7, 0.64, 0.6, 0.57, 0.55];

const X0 = 56;
const X1 = 430;
const xFor = (month: number) => X0 + (month / 24) * (X1 - X0);
const yFor = (survival: number) => 270 - (survival - 0.5) * 480;
const pct = (v: number) => `${Math.round(v * 100)}%`;

export default function SurvivalReadout() {
  const [index, setIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const nearestFromClientX = useCallback((clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    // Map the pointer into the 520-wide viewBox, then to the nearest month.
    const vbX = ((clientX - box.left) / box.width) * 520;
    const month = ((vbX - X0) / (X1 - X0)) * 24;
    const i = Math.round(month / 3);
    setIndex(Math.max(0, Math.min(MONTHS.length - 1, i)));
  }, []);

  const step = (by: number) =>
    setIndex((current) => {
      const next = (current ?? 0) + by;
      return Math.max(0, Math.min(MONTHS.length - 1, next));
    });

  const active = index !== null;
  const month = active ? MONTHS[index] : null;
  const x = active ? xFor(month!) : 0;

  return (
    <div>
      {/* The overlay is positioned against this wrapper, which holds the two
          SVGs and nothing else. Sharing a container with the readout below
          made the overlay taller than the chart, and preserveAspectRatio then
          centred its viewBox in that taller box — dropping every mark by half
          the difference, so the dots sat off the curve and the month label
          collided with the axis title. `block` on the chart closes the last
          gap: an inline SVG leaves descender space beneath it. */}
      <div className="relative">
        <KaplanMeierGraphic animate className="block" />

        <svg
          ref={svgRef}
          viewBox="0 0 520 320"
          className="absolute inset-0 h-full w-full cursor-crosshair focus:outline-none"
          tabIndex={0}
          role="slider"
          aria-label="Read the survival estimate at a follow-up month"
          aria-valuemin={0}
          aria-valuemax={24}
          aria-valuenow={month ?? 0}
          aria-valuetext={
            active
              ? `${month} months: intervention ${pct(INTERVENTION[index])}, comparator ${pct(COMPARATOR[index])}`
              : "No month selected"
          }
          onPointerMove={(e) => nearestFromClientX(e.clientX)}
          onPointerLeave={() => setIndex(null)}
          onFocus={() => setIndex((c) => c ?? 4)}
          onBlur={() => setIndex(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              step(1);
            } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              step(-1);
            } else if (e.key === "Escape") {
              setIndex(null);
            }
          }}
        >
          {/* A transparent hit area, so the pointer is tracked across the whole
              plot rather than only where a mark happens to be. */}
          <rect x={X0} y="20" width={X1 - X0} height="250" fill="transparent" />

          {active && (
            <g>
              <line
                x1={x}
                y1="24"
                x2={x}
                y2="270"
                stroke="var(--color-ink)"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.5"
              />

              {[
                { v: INTERVENTION[index], c: "var(--color-series-1)" },
                { v: COMPARATOR[index], c: "var(--color-series-2)" },
              ].map((arm) => (
                <g key={arm.c}>
                  <circle cx={x} cy={yFor(arm.v)} r="5.5" fill="var(--color-paper)" />
                  <circle cx={x} cy={yFor(arm.v)} r="3.25" fill={arm.c} />
                </g>
              ))}

              {/* Month, set on the axis where the guideline meets it. */}
              <text
                x={x}
                y="292"
                textAnchor="middle"
                fontSize="12"
                fontFamily="var(--font-mono)"
                fill="var(--color-ink)"
              >
                {month}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* The readout itself. Reserves its line so nothing below shifts when it
          appears, and is announced politely rather than on every pixel of
          pointer movement. */}
      <p
        aria-live="polite"
        className="mt-4 flex min-h-[1.5rem] flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-caption"
      >
        {active ? (
          <>
            <span className="text-ink">{month} months</span>
            <span className="text-series-1">
              Intervention {pct(INTERVENTION[index])}
            </span>
            <span className="text-series-2">
              Comparator {pct(COMPARATOR[index])}
            </span>
          </>
        ) : (
          <span className="text-faint">
            Hover the curve, or focus it and use the arrow keys, to read either
            arm.
          </span>
        )}
      </p>
    </div>
  );
}
