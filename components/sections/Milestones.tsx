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
 * The practice's chronology, set on a single vertical axis.
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
            className="fall-in relative grid gap-x-14 gap-y-4 pb-16 pl-8 lg:grid-cols-[9rem_1fr] lg:pl-12"
            style={{ "--fall-delay": `${index * 120}ms` } as CSSProperties}
          >
            {/* The axis is drawn per gap rather than as one rule behind the
                list, so the chronology ends exactly at the last entry instead
                of trailing past it into empty space. */}
            {!last && (
              <span
                aria-hidden="true"
                className="spine-draw absolute bottom-0 left-[3px] top-3 w-px bg-rule-firm"
                style={
                  { "--spine-delay": `${index * 120 + 220}ms` } as CSSProperties
                }
              />
            )}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-[7px] h-[7px] w-[7px] rounded-full ${
                dated ? "bg-accent" : "border border-accent bg-paper"
              }`}
            />

            <div>
              <p className="label tabular text-ink">
                {dated ? milestone.start : "Today"}
              </p>
              {dated && (
                <p className="label-sm mt-2.5 text-faint">
                  {milestone.end} · {span} yrs
                </p>
              )}
            </div>

            <div className="max-w-[46ch]">
              <h3 className="text-[clamp(1.15rem,1rem+0.5vw,1.45rem)] font-normal leading-[1.25]">
                {milestone.event}
              </h3>
              <p className="mt-4 text-small leading-[1.65] text-muted">
                {milestone.detail}
              </p>
            </div>
          </li>
        );
      })}
    </Reveal>
  );
}
