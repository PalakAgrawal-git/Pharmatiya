import Link from "next/link";
import { datasetCoverage } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";

/**
 * Dataset coverage as an index, not a card set.
 *
 * Answers the most common disqualifying question — "do they have my data?" —
 * before a qualified buyer bounces assuming they are not served.
 *
 * Deliberately no bars, scores or icons. A depth-of-experience percentage
 * would be invented data, and this site does not do that; typography and a
 * numbered rule carry it instead. Each group is numbered because a reader
 * scanning for their own source needs to see there are three and no more.
 */
export default function CoverageBand() {
  return (
    <section className="border-b border-rule bg-sunk">
      <div className="shell section">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="label flex items-center gap-4 text-faint">
              Data coverage
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-rule-firm" />
            </h2>
            <p className="mt-7 text-[clamp(1.4rem,1.1rem+1.3vw,2rem)] font-medium leading-[1.14]">
              Payer, provider and claims data — for twenty-five years.
            </p>
            <p className="measure mt-6 text-muted">
              If your question sits in one of these sources, we have almost
              certainly answered a version of it before.
            </p>
            <Link
              href="/evidence/"
              className="arrow-link mt-8 inline-block text-small text-ink underline decoration-rule-firm underline-offset-[6px] transition-colors hover:decoration-accent"
            >
              Full coverage and therapeutic areas{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>

          <div className="flex flex-col lg:col-span-7 lg:col-start-6">
            {datasetCoverage.map((group, index) => (
              <Reveal
                key={group.group}
                delay={index * 110}
                className="grid gap-x-10 gap-y-4 border-b border-rule-firm py-8 first:border-t first:pt-0 lg:grid-cols-[13rem_1fr] lg:first:pt-8"
              >
                <div>
                  <p className="label text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-[1.15rem] font-medium leading-tight">
                    {group.group}
                  </h3>
                </div>
                <ul className="flex flex-col gap-2">
                  {group.types.map((type) => (
                    <li key={type} className="text-small text-muted">
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
