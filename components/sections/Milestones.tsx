import type { CSSProperties } from "react";
import { Pending } from "@/components/ui/DataLabel";
import Reveal from "@/components/motion/Reveal";

/**
 * Periods are taken from the span of our published record for each phase —
 * the affiliations on those papers are already public — rather than from
 * unpublished employment history. Anything not corroborated that way carries
 * a null span and is marked pending instead of estimated.
 *
 * Years are numbers, not a "2003–2011" string, because the bars are measured
 * from them. A label and a bar that could disagree is a figure waiting to
 * become wrong.
 */
const milestones = [
  {
    start: 2003,
    end: 2011,
    event: "Hospital epidemiology and outcomes research",
    detail:
      "We built our practice inside an integrated health system: infection surveillance, antibiotic utilisation and hospital-associated infection studies, published across IDSA, ICAAC, SHEA and ASM.",
  },
  {
    start: 2011,
    end: 2014,
    event: "Pharmacovigilance and clinical trials",
    detail:
      "We conceptualised and executed pharmacovigilance and clinical-trials products, including a claims-based sentinel system analysing five million lives. The underlying method is patented — US 8,744,872, filed January 2013, issued June 2014.",
  },
  {
    start: 2014,
    end: 2019,
    event: "Payer-side analytics and pragmatic trials",
    detail:
      "We ran real-world evidence and pragmatic trials on inpatient clinical data and outpatient claims — including the nationwide mSToPS atrial fibrillation screening trial, published in JAMA in 2018.",
  },
  {
    start: 2019,
    end: 2022,
    event: "Machine learning in outcomes research",
    detail:
      "We applied machine learning to hospitalisation risk in COVID-19, and published on where machine learning genuinely improves on traditional statistical modelling in healthcare analytics — and where it does not.",
  },
  {
    start: null,
    end: null,
    event: "Pharmatiya founded",
    detail:
      "Independent HEOR and RWE practice, working directly with commercial, medical affairs and market access teams.",
  },
];

const longest = Math.max(
  ...milestones.map((m) => (m.start && m.end ? m.end - m.start : 0)),
);

/**
 * The practice's chronology.
 *
 * Previously a ruled two-column list, which did nothing with the one thing
 * that makes this content a timeline: the eras are different lengths. Each
 * now carries a bar measured against the longest of them, so the eight years
 * of hospital epidemiology read as visibly longer than the three of
 * pharmacovigilance. That is the same principle as the figures elsewhere on
 * the site — the subject matter carries the graphic, rather than decoration
 * being applied on top of it.
 *
 * The spine draws downward as the block scrolls in and the entries arrive
 * behind it, so the eye travels the chronology in the order it happened. The
 * undated founding entry ends the spine as a hollow node rather than a filled
 * one: the marker is doing the same job as the "date to provide" flag beside
 * it, not pretending to a date we do not have.
 */
export default function Milestones() {
  return (
    <Reveal as="ol" className="relative">
      {milestones.map((milestone, index) => {
        const span =
          milestone.start && milestone.end ? milestone.end - milestone.start : null;
        const dated = span !== null;

        const last = index === milestones.length - 1;

        return (
          <li
            key={milestone.event}
            className="fall-in relative grid gap-x-10 gap-y-2 py-6 pl-10 lg:grid-cols-[11rem_1fr]"
            style={{ "--fall-delay": `${index * 120}ms` } as CSSProperties}
          >
            {/* Square node, the same mark the forest plot uses for a point
                estimate. Filled where the period is evidenced, hollow where
                the date is still outstanding. */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-[26px] h-[15px] w-[15px] rounded-[1px] border-2 border-accent ${
                dated ? "bg-accent" : "bg-paper"
              }`}
            />

            {/* One connector per gap rather than a single rule behind the
                whole list: it runs from this node to the next one, so the
                chronology ends exactly at the last node instead of trailing
                past it. Each grows as its entry arrives, so the line reaches
                a node just before the node appears. */}
            {!last && (
              <span
                aria-hidden="true"
                className="spine-draw absolute left-[7px] top-[41px] -bottom-[26px] w-px bg-rule-firm"
                style={
                  { "--spine-delay": `${index * 120 + 220}ms` } as CSSProperties
                }
              />
            )}

            <div>
              <p className="font-mono text-caption tabular text-accent">
                {dated ? (
                  `${milestone.start}–${milestone.end}`
                ) : (
                  <Pending>Date to provide</Pending>
                )}
              </p>

              {dated && (
                <>
                  {/* Width is the era's length against the longest era, so the
                      bars are a scale rather than an ornament. */}
                  {/* The wrapper caps the scale at the width the years
                      column has on large screens. Without it the bars are a
                      percentage of a full-width stacked column below lg, so
                      the eight-year era stretched to 667px on a tablet and
                      the comparison stopped reading as a scale. */}
                  <span aria-hidden="true" className="mt-2.5 block max-w-[11rem]">
                    <span
                      className="grow-x block h-[3px] bg-accent/35"
                      style={
                        {
                          width: `${(span / longest) * 100}%`,
                          "--origin": "left",
                          "--grow-delay": `${300 + index * 120}ms`,
                        } as CSSProperties
                      }
                    />
                  </span>
                  <p className="mt-2 font-mono text-[0.8rem] tabular text-faint">
                    {span} {span === 1 ? "year" : "years"}
                  </p>
                </>
              )}
            </div>

            <div>
              <p className="font-display text-[1.15rem] font-semibold leading-snug">
                {milestone.event}
              </p>
              <p className="measure mt-2 text-small text-muted">
                {milestone.detail}
              </p>
            </div>
          </li>
        );
      })}
    </Reveal>
  );
}
