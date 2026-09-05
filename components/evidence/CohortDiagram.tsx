import type { CSSProperties } from "react";

const steps = [
  { label: "Source population", n: "1,284,000", y: 20 },
  { label: "Meets index criteria", n: "146,220", y: 82 },
  { label: "Continuous enrolment ≥ 12 months", n: "94,780", y: 144 },
  { label: "No prior exposure", n: "61,405", y: 206 },
  { label: "Final analytic cohort", n: "58,912", y: 268 },
];

const exclusions = [
  { text: "−1,137,780 no qualifying event", y: 113 },
  { text: "−51,440 enrolment gap", y: 175 },
  { text: "−33,375 prior exposure", y: 237 },
];

/**
 * Cohort attrition diagram — the CONSORT-style figure that shows how a source
 * population narrows to an analytic cohort. This is the graphic that most
 * clearly signals methodological seriousness to an HEOR reader.
 *
 * When animated, the boxes arrive top to bottom and each exclusion fades in
 * after the box it removes from. The figure therefore performs the attrition
 * rather than presenting it finished — the population visibly narrows. Off
 * states live in the keyframes, so without JavaScript the diagram renders
 * complete.
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
      viewBox="0 0 460 320"
      role="img"
      aria-labelledby="cd-title cd-desc"
      className={`w-full ${className}`}
    >
      <title id="cd-title">Cohort attrition from source population to analytic cohort</title>
      <desc id="cd-desc">
        A source population of 1,284,000 narrows through four criteria — index
        event, twelve months continuous enrolment, and no prior exposure — to a
        final analytic cohort of 58,912.
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
            x="8"
            y={step.y}
            width="250"
            height="44"
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
            x="20"
            y={step.y + 18}
            fontSize="10.5"
            fill="var(--color-muted)"
            fontFamily="var(--font-sans)"
          >
            {step.label}
          </text>
          <text
            x="20"
            y={step.y + 34}
            fontSize="13"
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
              x1="133"
              y1={step.y + 44}
              x2="133"
              y2={step.y + 62}
              stroke="var(--color-faint)"
              strokeWidth="1"
              markerEnd="url(#cd-arrow)"
            />
          )}
        </g>
      ))}

      {exclusions.map((exclusion, i) => (
        <g
          key={exclusion.text}
          className={animate ? "fade-part" : undefined}
          style={
            animate
              ? ({ "--fade-delay": `${360 + i * 160}ms` } as CSSProperties)
              : undefined
          }
        >
          <line
            x1="133"
            y1={exclusion.y}
            x2="272"
            y2={exclusion.y}
            stroke="var(--color-rule-firm)"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          <text
            x="278"
            y={exclusion.y + 3.5}
            fontSize="10"
            fill="var(--color-series-2)"
            fontFamily="var(--font-mono)"
          >
            {exclusion.text}
          </text>
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
