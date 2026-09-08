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
    <section>
      {/* The running head sits on the paper, above the band, rather than
          inside it. It is the chapter marker for the section as a whole, so
          setting it on the dark ground made it read as a label belonging to
          the figures — and it put a second, quieter thing inside a block
          whose whole job is to carry four loud ones. Out here it introduces
          the band; in there it competed with it. */}
      {/* Weighted toward the band: more room above than below, so the head
          reads as introducing what follows rather than as trailing the
          hero. Set here because the hero's own bottom padding stops at its
          rule, leaving nothing between that rule and this line. */}
      <div className="shell pt-12 pb-7 lg:pt-16 lg:pb-8">
        <Reveal>
          <SectionLabel as="h2" index="01">
            The record
          </SectionLabel>
        </Reveal>
      </div>

      <div className="bg-inverse text-white">
        <div className="shell py-[clamp(2.25rem,1.5rem+3vw,4.25rem)]">
          <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-12">
            {proofFigures.map((figure, index) => (
              <Reveal key={figure.label} delay={index * 90}>
                <div className="border-t border-white/25 pt-5">
                  <dt className="text-[clamp(2.5rem,1.5rem+2.6vw,4rem)] font-normal leading-[0.9] tracking-[-0.035em] tabular text-white">
                    <CountUp value={figure.value} />
                  </dt>
                  <dd className="mt-4 max-w-[22ch] text-small leading-[1.5] text-white/55">
                    {figure.label}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={400}>
            <div className="mt-9">
              <ArrowLink href="/evidence/" tone="dark">
                Every entry, searchable, with sources
              </ArrowLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
