import type { CSSProperties } from "react";

/** Bootstrap replicates, positioned around a point estimate in the
 *  north-east quadrant: more effective, more costly, below threshold. */
const cloud = [
  [312, 118], [298, 132], [326, 108], [340, 126], [305, 145], [288, 122],
  [334, 140], [352, 116], [318, 100], [296, 158], [346, 154], [364, 132],
  [280, 140], [324, 166], [358, 100], [302, 96], [370, 148], [286, 108],
  [338, 92], [310, 172], [272, 128], [352, 172], [330, 128], [316, 138],
];

/**
 * Cost-effectiveness plane.
 *
 * When animated the axes and threshold arrive first, then the bootstrap cloud
 * accumulates point by point, and the point estimate lands last. That ordering
 * is the argument the figure makes: the replicates are what the estimate rests
 * on, so they precede it.
 */
export default function CostEffectivenessPlane({
  animate = false,
  className = "",
}: {
  animate?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 460 300"
      role="img"
      aria-labelledby="ce-title ce-desc"
      className={`w-full ${className}`}
    >
      <title id="ce-title">Cost-effectiveness plane with willingness-to-pay threshold</title>
      <desc id="ce-desc">
        Bootstrap replicates cluster in the north-east quadrant — the
        intervention is both more effective and more costly than the
        comparator. The great majority fall below the willingness-to-pay
        threshold line, indicating cost-effectiveness at that threshold.
      </desc>

      {/* Willingness-to-pay threshold. Not drawn with `.draw` — the dash
          pattern is load-bearing here (it marks the line as a threshold, not
          a fitted curve) and stroke-dasharray animation would override it. */}
      <line
        x1="230"
        y1="270"
        x2="440"
        y2="60"
        stroke="var(--color-series-3)"
        strokeWidth="1.5"
        strokeDasharray="5 3"
        className={animate ? "fade-part" : undefined}
        style={
          animate ? ({ "--fade-delay": "120ms" } as CSSProperties) : undefined
        }
      />
      <text
        x="436"
        y="54"
        fontSize="10"
        fill="var(--color-series-3)"
        textAnchor="end"
        fontFamily="var(--font-mono)"
      >
        WTP threshold
      </text>

      {/* Axes through the origin */}
      <line x1="20" y1="150" x2="440" y2="150" stroke="var(--color-faint)" strokeWidth="1" />
      <line x1="230" y1="20" x2="230" y2="280" stroke="var(--color-faint)" strokeWidth="1" />

      {cloud.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="3.2"
          fill="var(--color-series-1)"
          fillOpacity="0.28"
          className={animate ? "pop-in" : undefined}
          style={
            animate
              ? ({ "--pop-delay": `${300 + i * 26}ms` } as CSSProperties)
              : undefined
          }
        />
      ))}

      {/* Point estimate — last, once the cloud it summarises is complete. */}
      <g
        className={animate ? "pop-in" : undefined}
        style={
          animate
            ? ({ "--pop-delay": `${300 + cloud.length * 26 + 120}ms` } as CSSProperties)
            : undefined
        }
      >
        <circle cx="322" cy="130" r="5" fill="var(--color-series-1)" />
        <circle
          cx="322"
          cy="130"
          r="9"
          fill="none"
          stroke="var(--color-series-1)"
          strokeWidth="1"
        />
      </g>

      <g fontSize="10" fill="var(--color-faint)" fontFamily="var(--font-mono)">
        {/* Dropped clear of the axis rather than sitting tight under it. At
            its old y=166 the dashed threshold line crossed straight through
            this label and two replicates touched it: the line meets the
            horizontal axis at x=350, so the strip just beneath the axis is
            exactly where the line and the densest part of the cloud both sit.
            By y=190 the line has moved left to x≈308 and the lowest replicate
            is 15px above, so the label clears both — without widening the
            canvas, which would have scaled every label on the figure down. */}
        <text x="452" y="190" textAnchor="end">
          Incremental effect →
        </text>
        <text x="236" y="30">
          ↑ Incremental cost
        </text>
      </g>

      <g fontSize="9.5" fill="var(--color-muted)" fontFamily="var(--font-mono)">
        <text x="240" y="278">More effective, less costly</text>
        <text x="222" y="44" textAnchor="end">More costly, less effective</text>
      </g>
    </svg>
  );
}
