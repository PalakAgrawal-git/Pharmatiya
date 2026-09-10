import type { CSSProperties } from "react";

/**
 * Subgroup hazard ratios with 95% confidence intervals.
 *
 * The previous version dropped the numeric column and the tick axis as
 * clutter. That went too far: a forest plot with no scale and no values is
 * not a simplified forest plot, it is an undecodable one — the marks sit at
 * positions that mean nothing, and the only cue left was a single "favours
 * intervention" arrow. This restores the scale and the numbers, and adds the
 * one thing a manuscript figure assumes you already know.
 *
 * That addition is the plain reading of each row. A specialist sees an
 * interval crossing 1.0 and knows it means the difference is not established;
 * nobody else does. So each row says which it is, in words, beside the
 * numbers. It is the difference between a chart you decode and a chart you
 * read.
 *
 * Positions are computed from the values rather than hard-coded, so the
 * geometry cannot drift from the data it claims to plot.
 */

type Row = { label: string; hr: number; lo: number; hi: number };

const rows: Row[] = [
  { label: "Overall", hr: 0.72, lo: 0.61, hi: 0.85 },
  { label: "Age ≥ 65", hr: 0.88, lo: 0.74, hi: 1.05 },
  { label: "Prior therapy", hr: 1.14, lo: 0.93, hi: 1.4 },
  { label: "High adherence", hr: 0.65, lo: 0.48, hi: 0.88 },
];

/* Log scale: ratios are multiplicative, so halving and doubling must occupy
   the same distance either side of 1.0. Domain runs 0.4 to 2.0, which holds
   every interval above with room to spare. */
const MIN = 0.4;
const MAX = 2.0;
const PLOT_X = 132;
const PLOT_W = 198;
const x = (v: number) =>
  PLOT_X + ((Math.log(v) - Math.log(MIN)) / (Math.log(MAX) - Math.log(MIN))) * PLOT_W;

const ROW_Y = (i: number) => 46 + i * 40;
const AXIS_Y = 202;
const ticks = [0.5, 1.0, 2.0];

const fmt = (v: number) => v.toFixed(2);

export default function ForestPlot({
  animate = false,
  className = "",
}: {
  animate?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 470 268"
      style={{ fontVariantNumeric: "tabular-nums" }}
      role="img"
      aria-labelledby="fp-title fp-desc"
      className={`w-full ${className}`}
    >
      <title id="fp-title">
        Hazard ratios with 95% confidence intervals across four subgroups
      </title>
      <desc id="fp-desc">
        Overall 0.72, confidence interval 0.61 to 0.85 — favours intervention.
        Age 65 and over 0.88, 0.74 to 1.05 — crosses 1.0, so no clear
        difference. Prior therapy 1.14, 0.93 to 1.40 — crosses 1.0, so no
        clear difference. High adherence 0.65, 0.48 to 0.88 — favours
        intervention. A ratio below 1.0 means fewer events on the
        intervention arm.
      </desc>

      {/* Column headings, so the numbers are not unlabelled. */}
      <g
        fontSize="9.5"
        fill="var(--color-faint)"
        fontFamily="var(--font-sans)"
        letterSpacing="0.08em"
      >
        <text x="0" y="18">SUBGROUP</text>
        <text x="342" y="18">HAZARD RATIO (95% CI)</text>
      </g>
      <line x1="0" y1="26" x2="470" y2="26" stroke="var(--color-rule)" strokeWidth="1" />

      {/* Line of no effect, labelled in words rather than left as a bare
          dashed rule that only a specialist reads. */}
      <line
        x1={x(1)}
        y1="32"
        x2={x(1)}
        y2={AXIS_Y}
        stroke="var(--color-rule-firm)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {rows.map((row, i) => {
        const y = ROW_Y(i);
        const crosses = row.lo <= 1 && row.hi >= 1;
        const colour = crosses ? "var(--color-series-3)" : "var(--color-series-1)";

        return (
          <g key={row.label}>
            <text
              x="0"
              y={y + 4}
              fontSize="12"
              fill="var(--color-ink)"
              fontFamily="var(--font-sans)"
              className={animate ? "fade-part" : undefined}
              style={
                animate
                  ? ({ "--fade-delay": `${100 + i * 120}ms` } as CSSProperties)
                  : undefined
              }
            >
              {row.label}
            </text>

            {/* The interval, growing out from the estimate — which is how it
                is read: the point first, then how far it could be wrong. */}
            <g
              className={animate ? "grow-x" : undefined}
              style={
                animate
                  ? ({
                      "--origin": `${x(row.hr)}px`,
                      "--grow-delay": `${240 + i * 120}ms`,
                    } as CSSProperties)
                  : undefined
              }
            >
              <line
                x1={x(row.lo)}
                y1={y}
                x2={x(row.hi)}
                y2={y}
                stroke={colour}
                strokeWidth="1.5"
              />
              <line x1={x(row.lo)} y1={y - 5} x2={x(row.lo)} y2={y + 5} stroke={colour} strokeWidth="1.5" />
              <line x1={x(row.hi)} y1={y - 5} x2={x(row.hi)} y2={y + 5} stroke={colour} strokeWidth="1.5" />
            </g>

            <rect
              x={x(row.hr) - 4.5}
              y={y - 4.5}
              width="9"
              height="9"
              fill={colour}
              className={animate ? "fade-part" : undefined}
              style={
                animate
                  ? ({ "--fade-delay": `${160 + i * 120}ms` } as CSSProperties)
                  : undefined
              }
            />

            {/* Numbers, and then what they mean. */}
            <g
              className={animate ? "fade-part" : undefined}
              style={
                animate
                  ? ({ "--fade-delay": `${560 + i * 120}ms` } as CSSProperties)
                  : undefined
              }
            >
              <text
                x="342"
                y={y + 1}
                fontSize="11.5"
                fill="var(--color-ink)"
                fontFamily="var(--font-sans)"
              >
                {fmt(row.hr)} ({fmt(row.lo)}–{fmt(row.hi)})
              </text>
              <text
                x="342"
                y={y + 14}
                fontSize="10"
                fill={crosses ? "var(--color-faint)" : "var(--color-series-1)"}
                fontFamily="var(--font-sans)"
              >
                {crosses ? "No clear difference" : "Favours intervention"}
              </text>
            </g>
          </g>
        );
      })}

      {/* Axis with a real scale. Without ticks the marks sit at positions
          that carry no information. */}
      <line
        x1={PLOT_X}
        y1={AXIS_Y}
        x2={PLOT_X + PLOT_W}
        y2={AXIS_Y}
        stroke="var(--color-faint)"
        strokeWidth="1"
      />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} y1={AXIS_Y} x2={x(t)} y2={AXIS_Y + 5} stroke="var(--color-faint)" strokeWidth="1" />
          <text
            x={x(t)}
            y={AXIS_Y + 18}
            fontSize="10.5"
            fill="var(--color-faint)"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
          >
            {t.toFixed(1)}
          </text>
        </g>
      ))}

      {/* Both directions named, on their own line — set alongside the
          centre annotation they collided with it, since the plot is only
          198 units wide. Previously only the left arrow survived, so the
          scale had no stated meaning at all. */}
      <text x={PLOT_X} y={AXIS_Y + 32} fontSize="10" fill="var(--color-muted)" fontFamily="var(--font-sans)">
        ← fewer events
      </text>
      <text
        x={PLOT_X + PLOT_W}
        y={AXIS_Y + 32}
        fontSize="10"
        fill="var(--color-muted)"
        textAnchor="end"
        fontFamily="var(--font-sans)"
      >
        more events →
      </text>
      <text
        x={x(1)}
        y={AXIS_Y + 48}
        fontSize="10"
        fill="var(--color-faint)"
        textAnchor="middle"
        fontFamily="var(--font-sans)"
      >
        1.0 = no difference
      </text>
    </svg>
  );
}
