import type { CSSProperties } from "react";
import publicationData from "@/data/publications.json";
import Reveal from "@/components/motion/Reveal";

/**
 * How the practice got here, told with its own publication record.
 *
 * This replaces a vertical spine with dotted nodes — the timeline widget
 * every site ships, and one that carried no information the dates did not
 * already give. The chart below is not a decoration of the history, it is
 * the history: forty-five dated entries between 2003 and 2022, one bar per
 * year, with the four working periods marked underneath.
 *
 * It also tells the truth about the shape. There are years with nothing in
 * them — 2009, 2011, 2012, 2020 — and the record peaks at seven in 2018,
 * the year the mSToPS trial ran in JAMA. A generic timeline would have
 * flattened all of that into evenly spaced dots.
 *
 * Counts are derived from data/publications.json at build time, so the chart
 * cannot disagree with the archive on the Evidence page.
 */

type Era = {
  start: number | null;
  end: number | null;
  event: string;
  detail: string;
};

const eras: Era[] = [
  {
    start: 2003,
    end: 2011,
    event: "Hospital epidemiology and outcomes research",
    detail:
      "Infection surveillance, antibiotic utilisation and hospital-associated infection studies inside an integrated health system, published across IDSA, ICAAC, SHEA and ASM.",
  },
  {
    start: 2011,
    end: 2014,
    event: "Pharmacovigilance and clinical trials",
    detail:
      "Pharmacovigilance and clinical-trials products, including a claims-based sentinel system analysing five million lives. The underlying method is patented — US 8,744,872.",
  },
  {
    start: 2014,
    end: 2019,
    event: "Payer-side analytics and pragmatic trials",
    detail:
      "Real-world evidence on inpatient clinical data and outpatient claims, including the nationwide mSToPS atrial fibrillation screening trial published in JAMA in 2018.",
  },
  {
    start: 2019,
    end: 2022,
    event: "Machine learning in outcomes research",
    detail:
      "Hospitalisation risk in COVID-19, and published work on where machine learning improves on traditional statistical modelling in healthcare analytics — and where it does not.",
  },
  {
    start: null,
    end: null,
    event: "Pharmatiya founded",
    detail:
      "Independent HEOR and RWE practice, working directly with commercial, medical affairs and market access teams.",
  },
];

/* Counted from the archive rather than typed out, so the two cannot drift. */
const years = (publicationData.publications as { year: number | null }[])
  .map((p) => p.year)
  .filter((y): y is number => y !== null);

const FIRST = Math.min(...years);
const LAST = Math.max(...years);
const counts = new Map<number, number>();
for (const y of years) counts.set(y, (counts.get(y) ?? 0) + 1);
const PEAK = Math.max(...counts.values());
const SPAN = LAST - FIRST + 1;

/* Geometry. One slot per year across the plot, the point centred in it. */
const PLOT_X = 4;
const PLOT_W = 692;
const BASELINE = 118;
const MAX_H = 92;
const SLOT = PLOT_W / SPAN;
const slotX = (year: number) => PLOT_X + (year - FIRST) * SLOT;
const pointX = (year: number) => slotX(year) + SLOT / 2;
const pointY = (n: number) => BASELINE - (n / PEAK) * MAX_H;

/* Every year in the span, including the empty ones. The line has to fall to
   the axis in 2009, 2011, 2012 and 2020 rather than skip them — the gaps are
   part of what the chart is for, and a line drawn only through the years
   with output would quietly close them up. */
const series = Array.from({ length: SPAN }, (_, i) => {
  const year = FIRST + i;
  const n = counts.get(year) ?? 0;
  return { year, n, x: pointX(year), y: pointY(n) };
});

const linePath = series
  .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
  .join(" ");

/* Closed back along the axis, so the fill sits under the line without the
   line itself being a closed shape. */
const areaPath = `${linePath} L${series[series.length - 1].x.toFixed(1)},${BASELINE} L${series[0].x.toFixed(1)},${BASELINE} Z`;

/* The real length, summed from the coordinates, so the draw animation
   neither starts partly visible nor stalls at the end on a guess. */
const LINE_LEN = Math.ceil(
  series.reduce((total, p, i) => {
    if (i === 0) return 0;
    const prev = series[i - 1];
    return total + Math.hypot(p.x - prev.x, p.y - prev.y);
  }, 0),
);

const peakPoint = series.find((p) => p.n === PEAK)!;

const axisYears = [FIRST, 2008, 2013, 2018, LAST];
const boundaries = eras
  .filter((e) => e.start !== null && e.start !== FIRST)
  .map((e) => e.start as number);

export default function Milestones() {
  return (
    <div>
      <Reveal>
        <svg
          viewBox="0 0 700 168"
          style={{ fontVariantNumeric: "tabular-nums" }}
          role="img"
          aria-labelledby="tl-title tl-desc"
          className="w-full"
        >
          <title id="tl-title">
            Published output by year, {FIRST} to {LAST}
          </title>
          <desc id="tl-desc">
            Forty-five dated entries. Output is steadiest through the hospital
            epidemiology years, thins between {2009} and 2012, and peaks at{" "}
            {PEAK} in 2018, the year of the mSToPS trial. Four working periods
            are marked: {FIRST} to 2011, 2011 to 2014, 2014 to 2019 and 2019 to{" "}
            {LAST}.
          </desc>

          <defs>
            {/* The fill is the line's own colour falling away to nothing, so
                the area reads as the line having weight rather than as a
                second object with an edge of its own. */}
            <linearGradient id="tl-fill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-series-1)"
                stopOpacity="0.28"
              />
              <stop
                offset="100%"
                stopColor="var(--color-series-1)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {/* Period boundaries, drawn behind the line. */}
          {boundaries.map((year) => (
            <line
              key={year}
              x1={slotX(year)}
              y1="8"
              x2={slotX(year)}
              y2={BASELINE}
              stroke="var(--color-rule)"
              strokeWidth="1"
            />
          ))}

          <path
            className="fade-part"
            style={{ "--fade-delay": "900ms" } as CSSProperties}
            d={areaPath}
            fill="url(#tl-fill)"
          />

          <path
            className="draw"
            style={
              { "--len": LINE_LEN, "--draw-delay": "120ms" } as CSSProperties
            }
            d={linePath}
            fill="none"
            stroke="var(--color-series-1)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* A mark on every year that has output. The empty years are left
              as the line touching the axis, which says more than a dot at
              zero would. */}
          <g
            className="fade-part"
            style={{ "--fade-delay": "1000ms" } as CSSProperties}
          >
            {series
              .filter((p) => p.n > 0)
              .map((p) => (
                <circle
                  key={p.year}
                  cx={p.x}
                  cy={p.y}
                  r={p.n === PEAK ? 4 : 2.5}
                  fill={
                    p.n === PEAK ? "var(--color-series-1)" : "var(--color-paper)"
                  }
                  stroke="var(--color-series-1)"
                  strokeWidth="1.5"
                />
              ))}
          </g>

          <line
            x1={PLOT_X}
            y1={BASELINE}
            x2={PLOT_X + PLOT_W}
            y2={BASELINE}
            stroke="var(--color-rule-firm)"
            strokeWidth="1"
          />

          {axisYears.map((year) => (
            <text
              key={year}
              x={slotX(year) + SLOT / 2}
              y={BASELINE + 18}
              fontSize="11"
              fill="var(--color-faint)"
              textAnchor="middle"
              fontFamily="var(--font-sans)"
            >
              {year}
            </text>
          ))}

          {/* The peak is the one point worth naming on the chart itself. */}
          <text
            className="fade-part"
            style={{ "--fade-delay": "1100ms" } as CSSProperties}
            x={peakPoint.x}
            y={peakPoint.y - 11}
            fontSize="11"
            fill="var(--color-series-1)"
            textAnchor="middle"
            fontFamily="var(--font-sans)"
          >
            {PEAK}
          </text>

          <text
            x={PLOT_X + PLOT_W}
            y={BASELINE + 40}
            fontSize="11"
            fill="var(--color-faint)"
            textAnchor="end"
            fontFamily="var(--font-sans)"
          >
            Published entries per year
          </text>
        </svg>
      </Reveal>

      {/* The periods themselves. A list, not a spine — the chart above
          already carries the shape, so this only has to be readable. */}
      <dl className="mt-12 border-t border-rule">
        {eras.map((era, index) => (
          <Reveal
            key={era.event}
            delay={index * 70}
            className="grid gap-x-12 gap-y-2 border-b border-rule py-6 lg:grid-cols-[9rem_1fr]"
          >
            <dt className="label tabular text-accent">
              {era.start && era.end ? (
                `${era.start}–${era.end}`
              ) : (
                <span className="text-faint">Current</span>
              )}
            </dt>
            <dd className="grid gap-2 lg:grid-cols-[1fr_1.4fr] lg:gap-x-12">
              <p className="text-[1.0625rem] leading-[1.4]">{era.event}</p>
              <p className="text-small leading-[1.65] text-muted">
                {era.detail}
              </p>
            </dd>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}
