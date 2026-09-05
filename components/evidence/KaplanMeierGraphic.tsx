type Props = {
  /** Draws the curves on scroll. Requires an ancestor with data-reveal. */
  animate?: boolean;
  className?: string;
};

const INTERVENTION =
  "M56,30 H102.75 V44.4 H149.5 V63.6 H196.25 V82.8 H243 V97.2 H289.75 V111.6 H336.5 V121.2 H383.25 V130.8 H430 V135.6";
const COMPARATOR =
  "M56,30 H102.75 V68.4 H149.5 V106.8 H196.25 V145.2 H243 V174 H289.75 V202.8 H336.5 V222 H383.25 V236.4 H430 V246";

/**
 * Two-arm Kaplan–Meier survival estimate.
 *
 * Deliberately reduced for a website rather than a manuscript. The finding a
 * visitor needs is "these two arms separate and stay separated"; gridlines,
 * intermediate axis ticks and censoring marks all served precise reading off
 * the plot, which nobody does on a marketing page and which rendered at
 * around five pixels in a narrow column. Two curves, the two axis extremes
 * and a direct label for each arm carry the same finding at a glance.
 *
 * Nothing was removed from the accessible description: a screen-reader user
 * still gets the exact figures.
 *
 * When animated, the curves draw from the origin as they scroll into view —
 * the comparator falling away first, then the intervention holding. That is
 * the finding itself performing, which is the point.
 */
export default function KaplanMeierGraphic({
  animate = false,
  className = "",
}: Props) {
  // Path length is roughly the sum of the horizontal and vertical runs; over-
  // estimating is safe, it just means the dash starts fully offset.
  const len = 900;

  return (
    <svg
      viewBox="0 0 520 320"
      role="img"
      aria-labelledby="km-title km-desc"
      className={`w-full ${className}`}
    >
      <title id="km-title">
        Kaplan–Meier survival estimate for two study arms over 24 months
      </title>
      <desc id="km-desc">
        Stepped survival curves. The intervention arm retains 78 per cent
        event-free survival at 24 months; the comparator arm retains 55 per
        cent. Curves separate from around month 6 and do not converge.
      </desc>

      <g stroke="var(--color-faint)" strokeWidth="1">
        <line x1="56" y1="30" x2="56" y2="270" />
        <line x1="56" y1="270" x2="430" y2="270" />
      </g>

      {/* Only the extremes are labelled. The scale is what matters, not
          reading a value off the curve. */}
      <g
        fontSize="12"
        fill="var(--color-faint)"
        textAnchor="end"
        fontFamily="var(--font-mono)"
      >
        <text x="48" y="34">1.0</text>
        <text x="48" y="274">0.5</text>
      </g>

      <g
        fontSize="12"
        fill="var(--color-faint)"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
      >
        <text x="56" y="292">0</text>
        <text x="243" y="292">12</text>
        <text x="430" y="292">24</text>
        <text x="243" y="314" fill="var(--color-muted)">
          Months since index
        </text>
      </g>

      <text
        x="14"
        y="150"
        fontSize="12"
        fill="var(--color-muted)"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        transform="rotate(-90 14 150)"
      >
        Event-free survival
      </text>

      {/* Comparator first — it is the arm that falls away. Dashed as well as
          coloured, so the series survive greyscale and colour-blind viewing. */}
      <path
        className={animate ? "draw" : undefined}
        style={
          animate
            ? ({ "--len": len, "--draw-delay": "150ms" } as React.CSSProperties)
            : undefined
        }
        fill="none"
        stroke="var(--color-series-2)"
        strokeWidth="2.75"
        strokeDasharray={animate ? undefined : "6 3"}
        d={COMPARATOR}
      />

      <path
        className={animate ? "draw" : undefined}
        style={
          animate
            ? ({ "--len": len, "--draw-delay": "450ms" } as React.CSSProperties)
            : undefined
        }
        fill="none"
        stroke="var(--color-series-1)"
        strokeWidth="2.75"
        d={INTERVENTION}
      />

      {/* Series labels sit in a gutter to the right of the plot, aligned to
          the height each curve ends at. Set inside the plot they ran through
          the curves they name — a curve is at its most crowded exactly where
          it terminates. The gutter comes from ending the plot at x=430 rather
          than widening the canvas, which would have scaled every label down
          with it. */}
      <g
        className={animate ? "fade-part" : undefined}
        style={
          animate
            ? ({ "--fade-delay": "1700ms" } as React.CSSProperties)
            : undefined
        }
      >
        <text
          x="438"
          y="140"
          fontSize="12.5"
          fontWeight="600"
          fill="var(--color-series-1)"
          fontFamily="var(--font-sans)"
        >
          Intervention
        </text>
        <text
          x="438"
          y="250"
          fontSize="12.5"
          fontWeight="600"
          fill="var(--color-series-2)"
          fontFamily="var(--font-sans)"
        >
          Comparator
        </text>
      </g>
    </svg>
  );
}
