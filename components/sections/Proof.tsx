import { proofFigures } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";

/**
 * The record — four figures on one line, on the dark ground.
 *
 * Inverting this band alone gives the page a hard stop between the hero and
 * the services, and it is where the inversion earns most: these are the
 * strongest credibility signals on the site, and a dark field makes them the
 * one thing a visitor cannot scroll past without reading.
 *
 * The figures are set smaller than display scale on purpose. Against dark
 * they carry further than they would on paper, so the size that read as
 * confident on bone read as shouting here.
 *
 * Note this is now the second dark section on the homepage, with the product
 * panel. Adding a third would spend the contrast entirely.
 */
export default function Proof() {
  return (
    <section className="bg-inverse text-white">
      <div className="shell section">
        <Reveal>
          <SectionLabel as="h2" index="01" tone="dark">
            The record
          </SectionLabel>
        </Reveal>

        <dl className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-x-12">
          {proofFigures.map((figure, index) => (
            <Reveal key={figure.label} delay={index * 90}>
              <div className="border-t border-white/25 pt-6">
                <dt className="text-[clamp(2.5rem,1.5rem+2.6vw,4rem)] font-normal leading-[0.9] tracking-[-0.035em] tabular text-white">
                  <CountUp value={figure.value} />
                </dt>
                <dd className="mt-5 max-w-[22ch] text-small leading-[1.5] text-white/55">
                  {figure.label}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={400}>
          <div className="mt-16">
            <ArrowLink href="/evidence/" tone="dark">
              Every entry, searchable, with sources
            </ArrowLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
