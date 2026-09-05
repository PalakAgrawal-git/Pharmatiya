/**
 * Subgroup hazard ratios with 95% confidence intervals, on a log scale.
 * Positions are computed from the values below so the geometry is honest:
 * x = 56 + (ln(v) + ln 4) * 152.93, giving 0.25 at the left axis and 4 at
 * the right.
 */
const rows = [
  { label: "Overall", hr: 0.72, lo: 0.61, hi: 0.85, x: 217.7, xlo: 192.4, xhi: 243.1 },
  { label: "Age ≥ 65", hr: 0.88, lo: 0.74, hi: 1.05, x: 248.5, xlo: 222.0, xhi: 275.4 },
  { label: "Prior therapy", hr: 1.14, lo: 0.93, hi: 1.4, x: 287.9, xlo: 256.8, xhi: 319.4 },
  { label: "High adherence", hr: 0.65, lo: 0.48, hi: 0.88, x: 202.2, xlo: 155.7, xhi: 248.5 },
];

/**
 * Reduced for a website rather than a manuscript.
 *
 * The numeric column ("0.72 (0.61–0.85)") and the five-tick log axis were the
 * clutter: both are precise-reading furniture, both rendered at roughly five
 * pixels in a narrow column, and neither is what a visitor takes from a forest
 * plot. What they take is which intervals clear the line of no effect — so
 * that line is now labelled and the marks are heavier.
 *
 * Every number remains in the accessible description, so nothing is lost to a
 * screen reader.
 */
export default function ForestPlot({
  animate = false,
  className = "",
}: {
  animate?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 250"
      role="img"
      aria-labelledby="fp-title fp-desc"
      className={`w-full ${className}`}
    >
      <title id="fp-title">
        Forest plot of hazard ratios across four subgroups
      </title>
      <desc id="fp-desc">
        Overall hazard ratio 0.72, confidence interval 0.61 to 0.85, favouring
        intervention. Age 65 and over 0.88, 0.74 to 1.05, crossing the line of
        no effect. Prior therapy 1.14, 0.93 to 1.40, crossing the line of no
        effect. High adherence 0.65, 0.48 to 0.88, favouring intervention.
      </desc>

      {/* Line of no effect, labelled — the single reference a reader needs. */}
      <line
        x1="268"
        y1="20"
        x2="268"
        y2="196"
        stroke="var(--color-rule-firm)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <text
        x="268"
        y="14"
        fontSize="12"
        fill="var(--color-faint)"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
      >
        1.0
      </text>

      {rows.map((row, i) => {
        const y = 44 + i * 40;
        return (
          <g key={row.label}>
            <text
              className={animate ? "fade-part" : undefined}
              style={
                animate
                  ? ({ "--fade-delay": `${100 + i * 130}ms` } as React.CSSProperties)
                  : undefined
              }
              x="10"
              y={y + 4}
              fontSize="12.5"
              fill="var(--color-muted)"
              fontFamily="var(--font-sans)"
            >
              {row.label}
            </text>

            {/* Confidence interval with end caps. When animated it grows
                outward from the point estimate, which is how the interval is
                actually read. */}
            <g
              className={animate ? "grow-x" : undefined}
              style={
                animate
                  ? ({
                      "--origin": `${row.x}px`,
                      "--grow-delay": `${250 + i * 130}ms`,
                    } as React.CSSProperties)
                  : undefined
              }
            >
              <line
                x1={row.xlo}
                y1={y}
                x2={row.xhi}
                y2={y}
                stroke="var(--color-series-1)"
                strokeWidth="2"
              />
              <line
                x1={row.xlo}
                y1={y - 6}
                x2={row.xlo}
                y2={y + 6}
                stroke="var(--color-series-1)"
                strokeWidth="2"
              />
              <line
                x1={row.xhi}
                y1={y - 6}
                x2={row.xhi}
                y2={y + 6}
                stroke="var(--color-series-1)"
                strokeWidth="2"
              />
            </g>

            {/* Point estimate — square, area conventionally weighted by n */}
            <rect
              className={animate ? "fade-part" : undefined}
              style={
                animate
                  ? ({ "--fade-delay": `${150 + i * 130}ms` } as React.CSSProperties)
                  : undefined
              }
              x={row.x - 6}
              y={y - 6}
              width="12"
              height="12"
              fill={
                row.hi < 1 ? "var(--color-series-1)" : "var(--color-series-3)"
              }
            />
          </g>
        );
      })}

      <line
        x1="56"
        y1="196"
        x2="380"
        y2="196"
        stroke="var(--color-faint)"
        strokeWidth="1"
      />

      <text
        x="150"
        y="218"
        fontSize="12"
        fill="var(--color-muted)"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
      >
        ← favours intervention
      </text>
    </svg>
  );
}
