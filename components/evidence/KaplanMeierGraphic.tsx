type Props = {
  /** Drops censoring marks and gridlines, thickens strokes. */
  simplified?: boolean;
  /** Draws the curves on scroll. Requires an ancestor with data-reveal. */
  animate?: boolean;
  className?: string;
};

const INTERVENTION =
  "M56,30 H111.5 V44.4 H167 V63.6 H222.5 V82.8 H278 V97.2 H333.5 V111.6 H389 V121.2 H444.5 V130.8 H500 V135.6";
const COMPARATOR =
  "M56,30 H111.5 V68.4 H167 V106.8 H222.5 V145.2 H278 V174 H333.5 V202.8 H389 V222 H444.5 V236.4 H500 V246";

/**
 * Two-arm Kaplan–Meier survival estimate.
 *
 * When animated, the curves draw from the origin as they scroll into view —
 * the comparator falling away first, then the intervention holding. That is
 * the finding itself performing, which is the point: the motion carries
 * meaning rather than decorating the page.
 *
 * On small screens the figure is simplified rather than scaled: censoring
 * marks and gridlines go, stroke weight rises, only axis extremes stay
 * labelled.
 */
export default function KaplanMeierGraphic({
  simplified = false,
  animate = false,
  className = "",
}: Props) {
  const stroke = simplified ? 2.75 : 2;
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

      {!simplified && (
        <g stroke="var(--color-rule)" strokeWidth="1">
          <line x1="56" y1="30" x2="500" y2="30" />
          <line x1="56" y1="90" x2="500" y2="90" />
          <line x1="56" y1="150" x2="500" y2="150" />
          <line x1="56" y1="210" x2="500" y2="210" />
        </g>
      )}

      <g stroke="var(--color-faint)" strokeWidth="1">
        <line x1="56" y1="30" x2="56" y2="270" />
        <line x1="56" y1="270" x2="500" y2="270" />
      </g>

      <g
        fontSize="11"
        fill="var(--color-faint)"
        textAnchor="end"
        fontFamily="var(--font-mono)"
      >
        <text x="48" y="34">1.0</text>
        {!simplified && <text x="48" y="94">0.875</text>}
        {!simplified && <text x="48" y="154">0.75</text>}
        {!simplified && <text x="48" y="214">0.625</text>}
        <text x="48" y="274">0.5</text>
      </g>

      <g
        fontSize="11"
        fill="var(--color-faint)"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
      >
        <text x="56" y="290">0</text>
        {!simplified && <text x="167" y="290">6</text>}
        <text x="278" y="290">12</text>
        {!simplified && <text x="389" y="290">18</text>}
        <text x="500" y="290">24</text>
        <text x="278" y="312" fill="var(--color-muted)">
          Months since index
        </text>
      </g>

      <text
        x="14"
        y="150"
        fontSize="11"
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
        strokeWidth={stroke}
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
        strokeWidth={stroke}
        d={INTERVENTION}
      />

      {!simplified && (
        <g
          stroke="var(--color-series-1)"
          strokeWidth="1.5"
          className={animate ? "fade-part" : undefined}
          style={
            animate
              ? ({ "--fade-delay": "1500ms" } as React.CSSProperties)
              : undefined
          }
        >
          <line x1="200" y1="58" x2="200" y2="70" />
          <line x1="310" y1="91" x2="310" y2="103" />
          <line x1="420" y1="115" x2="420" y2="127" />
        </g>
      )}

      {/* Inline labels at the end of each series rather than a detached key,
          arriving once the curves have finished drawing. */}
      <g
        className={animate ? "fade-part" : undefined}
        style={
          animate
            ? ({ "--fade-delay": "1700ms" } as React.CSSProperties)
            : undefined
        }
      >
        <text
          x="494"
          y="128"
          fontSize="12"
          fontWeight="550"
          fill="var(--color-series-1)"
          textAnchor="end"
          fontFamily="var(--font-sans)"
        >
          Intervention
        </text>
        <text
          x="494"
          y="264"
          fontSize="12"
          fontWeight="550"
          fill="var(--color-series-2)"
          textAnchor="end"
          fontFamily="var(--font-sans)"
        >
          Comparator
        </text>
      </g>
    </svg>
  );
}
