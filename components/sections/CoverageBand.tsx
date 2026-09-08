import { datasetCoverage } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";

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
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-3">
            <SectionLabel as="h2" index="03" rule={false}>
              Data coverage
            </SectionLabel>
            <p className="mt-7 text-[clamp(1.5rem,1.1rem+1.5vw,2.25rem)] leading-[1.12]">
              Payer, provider and claims data — for twenty-five years.
            </p>
            <p className="measure mt-6 text-muted">
              If your question sits in one of these sources, we have almost
              certainly answered a version of it before.
            </p>
            <div className="mt-8">
              <ArrowLink href="/evidence/">
                Full coverage and therapeutic areas
              </ArrowLink>
            </div>
          </Reveal>

          <div className="flex flex-col lg:col-span-8 lg:col-start-5">
            {datasetCoverage.map((group, index) => (
              <Reveal
                key={group.group}
                delay={index * 110}
                className="grid gap-x-12 gap-y-5 border-b border-rule py-7 first:border-t lg:grid-cols-[14rem_1fr]"
              >
                <div className="flex items-baseline gap-4">
                  <span className="label tabular text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.2rem] font-normal leading-tight">
                    {group.group}
                  </h3>
                </div>
                <ul className="flex flex-wrap gap-x-10 gap-y-2">
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
