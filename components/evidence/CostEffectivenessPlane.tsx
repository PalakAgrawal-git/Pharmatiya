import type { CSSProperties } from "react";

/**
 * Bootstrap replicates in the north-east quadrant: the intervention is both
 * more effective and more costly than the comparator. All but two sit below
 * the willingness-to-pay line, so it is cost-effective at that threshold.
 *
 * Every point satisfies y > 150 - (3/7)(x - 230), which is the threshold line
 * below. That relationship is what the figure asserts, so the coordinates are
 * derived from it rather than sprinkled by eye.
 */
const cloud = [
  [272, 141], [286, 138], [296, 132], [300, 144], [312, 128],
  [318, 140], [326, 120], [334, 134], [340, 146], [346, 118],
  [356, 130], [364, 112], [376, 124],
  // Two replicates above the line. A cloud that fell entirely on one side
  // would be describing certainty the method does not produce.
  [330, 100], [306, 106],
];

/**
 * Cost-effectiveness plane.
 *
 * Reduced for a website: the two quadrant captions and two-thirds of the
 * scatter are gone. A visitor reads this figure as "the cloud sits below the
 * threshold line", and twenty-four overlapping points plus corner labels made
 * that harder to see, not easier.
 *
 * The threshold line was also wrong and is corrected here. It ran from
 * (230,270) to (440,60) — crossing the horizontal axis well right of the
 * origin — but on a cost-effectiveness plane the threshold is cost = lambda x
 * effect and must pass through the origin. As drawn, only 2 of 24 replicates
 * fell on the cost-effective side while the accessible description claimed
 * "the great majority" did, so the figure and its own alt text disagreed. The
 * line now starts at the origin and the cloud is positioned against it.
 *
 * When animated the axes and threshold arrive first, then the cloud
 * accumulates, and the point estimate lands last: the replicates are what the
 * estimate rests on, so they precede it.
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
      viewBox="112 8 348 212"
      role="img"
      aria-labelledby="ce-title ce-desc"
      className={`w-full ${className}`}
    >
      <title id="ce-title">Cost-effectiveness plane with willingness-to-pay threshold</title>
      <desc id="ce-desc">
        Bootstrap replicates cluster in the north-east quadrant — the
        intervention is both more effective and more costly than the
        comparator. Thirteen of fifteen fall below the willingness-to-pay
        threshold line, indicating cost-effectiveness at that threshold.
      </desc>

      {/* Axes through the origin at (230, 150). The viewBox crops the empty
          left of the plane rather than centring the origin: with the whole
          cloud in the north-east quadrant, a symmetric frame spent over half
          its width on white space. Both loss quadrants stay visible, which is
          the part that carries meaning. */}
      <line x1="122" y1="150" x2="440" y2="150" stroke="var(--color-faint)" strokeWidth="1" />
      <line x1="230" y1="30" x2="230" y2="215" stroke="var(--color-faint)" strokeWidth="1" />

      {/* Willingness-to-pay threshold: cost = lambda x effect, so it passes
          through the origin. Not drawn with `.draw` — the dash pattern marks
          it as a threshold rather than a fitted curve, and animating
          stroke-dasharray would override it. */}
      <line
        x1="230"
        y1="150"
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
        x="438"
        y="50"
        fontSize="12"
        fill="var(--color-series-3)"
        textAnchor="end"
        fontFamily="var(--font-mono)"
      >
        WTP threshold
      </text>

      {cloud.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="4.5"
          fill="var(--color-series-1)"
          fillOpacity="0.3"
          className={animate ? "pop-in" : undefined}
          style={
            animate
              ? ({ "--pop-delay": `${300 + i * 45}ms` } as CSSProperties)
              : undefined
          }
        />
      ))}

      {/* Point estimate — last, once the cloud it summarises is complete. */}
      <g
        className={animate ? "pop-in" : undefined}
        style={
          animate
            ? ({ "--pop-delay": `${300 + cloud.length * 45 + 120}ms` } as CSSProperties)
            : undefined
        }
      >
        <circle cx="325" cy="128" r="6" fill="var(--color-series-1)" />
        <circle
          cx="325"
          cy="128"
          r="11"
          fill="none"
          stroke="var(--color-series-1)"
          strokeWidth="1.25"
        />
      </g>

      {/* The strip below the axis is now free of both the line and the cloud,
          because the corrected threshold rises only into the upper right. */}
      <g fontSize="12" fill="var(--color-faint)" fontFamily="var(--font-mono)">
        <text x="438" y="172" textAnchor="end">
          Incremental effect →
        </text>
        <text x="238" y="26">
          ↑ Incremental cost
        </text>
      </g>
    </svg>
  );
}
