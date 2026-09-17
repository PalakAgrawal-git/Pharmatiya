import type { CSSProperties } from "react";

/* The mSToPS participant flow, as published: Steinhubl SR, Waalen J,
   Edwards AM, et al. JAMA 2018;320(2):146-155 — figure 1, supplied by
   Pharmatiya in the RWE presentation deck. Our principal is an author.
   The actively monitored count is the two arms combined (906 + 832). */
const steps = [
  { label: "Plan members assessed for eligibility", n: "1,039,862", y: 16 },
  { label: "Met eligibility criteria", n: "359,161", y: 78 },
  { label: "Invited by mail or email", n: "102,553", y: 140 },
  { label: "Randomised", n: "2,659", y: 202 },
  { label: "Monitored, with 12-month follow-up", n: "1,738", y: 264 },
];

/**
 * Cohort attrition, from a real trial rather than an invented one.
 *
 * This figure used to carry made-up counts. It now draws the published
 * participant flow of the mSToPS trial — a health plan's claims used to find
 * the people worth screening, which is the real-world-data work the service
 * beside it describes.
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
      style={{ fontVariantNumeric: "tabular-nums" }}
      role="img"
      aria-labelledby="cd-title cd-desc"
      className={`w-full ${className}`}
    >
      <title id="cd-title">Participant flow in the mSToPS trial</title>
      <desc id="cd-desc">
        1,039,862 health plan members were assessed. 680,701 were excluded —
        470,094 did not meet the inclusion criteria and 210,607 met an
        exclusion criterion — leaving 359,161 eligible. 102,553 were invited,
        50,000 by mail and 52,553 by email; 2,820 consented, 161 were then
        found ineligible, and 2,659 were randomised: 1,366 to immediate and
        1,293 to delayed monitoring. 1,738 were actively monitored with
        12-month follow-up. A further 3,476 matched observational controls
        were followed. Source: Steinhubl et al., JAMA 2018.
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
            fontFamily="var(--font-sans)"
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
