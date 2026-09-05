import Link from "next/link";
import { datasetCoverage } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";

/**
 * Dataset coverage on the homepage.
 *
 * Answers the most common disqualifying question — "do they have my data?" —
 * before a qualified buyer bounces assuming they are not served.
 *
 * Deliberately no bars or scores. A depth-of-experience percentage would be
 * invented data, and this site does not do that. Scale and spacing carry the
 * weight instead: the source types are the content, set large.
 */
export default function CoverageBand() {
  return (
    <section className="border-b border-rule bg-sunk">
      <div className="shell py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] lg:gap-20">
          <Reveal>
            <h2 className="mb-6 flex items-center gap-4 font-mono text-caption uppercase tracking-[0.14em] text-faint">
              Coverage
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </h2>
            <p className="text-[clamp(1.4rem,1.1rem+1.4vw,2.1rem)] leading-[1.12] tracking-[-0.02em]">
              Payer, provider and claims data — for twenty-five years.
            </p>
            <p className="measure mt-5 text-muted">
              If your question sits in one of these sources, we have almost
              certainly answered a version of it before.
            </p>
            <Link
              href="/evidence/"
              className="arrow-link mt-6 inline-block font-mono text-small text-accent underline underline-offset-4"
            >
              Full coverage and therapeutic areas{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>

          <div className="flex flex-col">
            {datasetCoverage.map((group, index) => (
              <Reveal
                key={group.group}
                delay={index * 110}
                className="grid gap-x-8 gap-y-3 border-b border-rule-firm py-7 first:border-t first:pt-0 lg:grid-cols-[11rem_1fr] lg:first:pt-7"
              >
                <h3 className="font-display text-[1.3rem] font-semibold leading-tight">
                  {group.group}
                </h3>
                <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
                  {group.types.map((type) => (
                    <li
                      key={type}
                      className="font-mono text-[clamp(0.95rem,0.85rem+0.4vw,1.15rem)] text-muted"
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
