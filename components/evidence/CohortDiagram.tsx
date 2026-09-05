import type { CSSProperties } from "react";

const steps = [
  { label: "Source population", n: "1,284,000", y: 16 },
  { label: "Meets index criteria", n: "146,220", y: 78 },
  { label: "Continuous enrolment ≥ 12 months", n: "94,780", y: 140 },
  { label: "No prior exposure", n: "61,405", y: 202 },
  { label: "Final analytic cohort", n: "58,912", y: 264 },
];

/**
 * Cohort attrition from a source population to an analytic cohort.
 *
 * Reduced for a website. The dashed exclusion callouts down the right-hand
 * side ("−1,137,780 no qualifying event") were manuscript apparatus: they
 * doubled the width the figure needed, which is what forced the type down to
 * roughly five pixels in a narrow column, and the attrition they spelled out
 * is already legible in the falling counts. Dropping them let the canvas
 * narrow from 460 to 280, so the same type now renders getting on for twice
 * the size.
 *
 * The exclusions remain in the accessible description.
 *
 * When animated, the boxes arrive top to bottom, so the figure performs the
 * narrowing rather than presenting it finished.
 */
export default function CohortDiagram({
  animate = false,
  className = "",
}: {
  animate?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 280 320"
      role="img"
      aria-labelledby="cd-title cd-desc"
      className={`w-full ${className}`}
    >
      <title id="cd-title">Cohort attrition from source population to analytic cohort</title>
      <desc id="cd-desc">
        A source population of 1,284,000 narrows through four criteria to a
        final analytic cohort of 58,912. In turn: 1,137,780 excluded for no
        qualifying index event, 51,440 for a gap in continuous enrolment, and
        33,375 for prior exposure.
      </desc>

      {steps.map((step, i) => (
        <g
          key={step.label}
          className={animate ? "fall-in" : undefined}
          style={
            animate
              ? ({ "--fall-delay": `${i * 160}ms` } as CSSProperties)
              : undefined
          }
        >
          <rect
            x="6"
            y={step.y}
            width="268"
            height="46"
            fill="var(--color-surface)"
            stroke={
              i === steps.length - 1
                ? "var(--color-series-1)"
                : "var(--color-rule)"
            }
            strokeWidth={i === steps.length - 1 ? 1.5 : 1}
            rx="2"
          />
          <text
            x="18"
            y={step.y + 18}
            fontSize="11.5"
            fill="var(--color-muted)"
            fontFamily="var(--font-sans)"
          >
            {step.label}
          </text>
          <text
            x="18"
            y={step.y + 36}
            fontSize="14.5"
            fontWeight="600"
            fill={
              i === steps.length - 1
                ? "var(--color-series-1)"
                : "var(--color-ink)"
            }
            fontFamily="var(--font-mono)"
          >
            n = {step.n}
          </text>

          {i < steps.length - 1 && (
            <line
              x1="140"
              y1={step.y + 46}
              x2="140"
              y2={step.y + 62}
              stroke="var(--color-faint)"
              strokeWidth="1"
              markerEnd="url(#cd-arrow)"
            />
          )}
        </g>
      ))}

      <defs>
        <marker
          id="cd-arrow"
          viewBox="0 0 8 8"
          refX="4"
          refY="4"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0,1 L6,4 L0,7 Z" fill="var(--color-faint)" />
        </marker>
      </defs>
    </svg>
  );
}
