import type { CSSProperties } from "react";

/**
 * Three retrospective study designs on one spine.
 *
 * Redrawn from the "Study design — retrospective studies" slide in
 * Pharmatiya's RWE presentation. Every design shares the same structure — a
 * baseline window, an event or intervention, an outcome window — and the
 * deck places the event at a different point for each. The positions below
 * are taken from that slide's geometry, not chosen for the look of it.
 *
 * The deck labels the designs and nothing more, so neither does this: no
 * rule is claimed about what the position of the event means.
 */
const designs = [
  { numeral: "I", name: "Impact analysis", at: 0.47 },
  { numeral: "II", name: "Diagnostics", at: 0.2 },
  { numeral: "III", name: "Screening", at: 0.77 },
];

const X0 = 96;
const X1 = 560;
const ROW = 64;
const TOP = 44;

export default function StudyDesigns({ animate = false }: { animate?: boolean }) {
  return (
    <svg
      viewBox={`0 0 700 ${TOP + designs.length * ROW + 8}`}
      style={{ fontVariantNumeric: "tabular-nums" }}
      role="img"
      aria-labelledby="sd-title sd-desc"
      className="w-full"
    >
      <title id="sd-title">Three retrospective study designs</title>
      <desc id="sd-desc">
        Each design runs from baseline data, through an event or intervention,
        to outcomes data. Design I is an impact analysis, design II supports
        diagnostics, and design III supports screening. The event sits at a
        different point on the timeline in each.
      </desc>

      <g fontFamily="var(--font-mono)" fontSize="10" fill="var(--color-faint)" letterSpacing="0.12em">
        <text x={X0} y="16">BASELINE DATA</text>
        <text x={X1} y="16" textAnchor="end">OUTCOMES DATA</text>
      </g>

      {designs.map((design, i) => {
        const y = TOP + i * ROW;
        const x = X0 + design.at * (X1 - X0);
        return (
          <g
            key={design.name}
            className={animate ? "fade-part" : undefined}
            style={animate ? ({ "--fade-delay": `${150 + i * 180}ms` } as CSSProperties) : undefined}
          >
            <text x="0" y={y + 4} fontFamily="var(--font-mono)" fontSize="11" fill="var(--color-accent)">
              {design.numeral}
            </text>

            {/* Baseline and outcome windows, then the spine between them. */}
            <rect x={X0} y={y - 5} width="54" height="10" rx="1" fill="var(--color-rule-firm)" />
            <rect x={X1 - 54} y={y - 5} width="54" height="10" rx="1" fill="var(--color-rule-firm)" />
            <line x1={X0} y1={y} x2={X1} y2={y} stroke="var(--color-rule-firm)" strokeWidth="1" />

            <line x1={x} y1={y - 14} x2={x} y2={y + 14} stroke="var(--color-series-1)" strokeWidth="1.5" />
            <circle cx={x} cy={y} r="4.5" fill="var(--color-series-1)" />
            <text
              x={x}
              y={y - 20}
              textAnchor="middle"
              fontFamily="var(--font-sans)"
              fontSize="10.5"
              fill="var(--color-muted)"
            >
              Event / intervention
            </text>

            <text x={X1 + 18} y={y + 4} fontFamily="var(--font-sans)" fontSize="13" fill="var(--color-ink)">
              {design.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
