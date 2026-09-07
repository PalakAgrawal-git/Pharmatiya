import { proofFigures } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";

/**
 * The record — two rows of two, on paper.
 *
 * Four boxes would make four small things out of one large one, and a dark
 * band here would spend the site's single tonal break before the section that
 * needs it. So this stays on paper and gets scale and air instead: numerals
 * at display size against a hairline, the label set small and cool beneath,
 * and a great deal of room between them.
 *
 * Two rows rather than four columns is deliberate. At four across, each
 * figure gets a quarter of the measure and reads as a statistic in a row of
 * statistics; at two across each one is given a half-spread and reads as a
 * fact worth stopping on.
 */
export default function Proof() {
  return (
    <section className="border-b border-rule">
      <div className="shell section">
        <Reveal>
          <SectionLabel as="h2" index="01">
            The record
          </SectionLabel>
        </Reveal>

        <dl className="mt-20 grid gap-x-20 gap-y-20 sm:grid-cols-2 lg:mt-28 lg:gap-y-28">
          {proofFigures.map((figure, index) => (
            <Reveal key={figure.label} delay={index * 90}>
              <div className="border-t border-ink/25 pt-7">
                <dt className="text-[clamp(4rem,2rem+8vw,8.5rem)] font-normal leading-[0.82] tracking-[-0.04em] tabular text-ink">
                  <CountUp value={figure.value} />
                </dt>
                <dd className="label-sm mt-8 max-w-[24ch] leading-[1.9] text-faint">
                  {figure.label}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={400}>
          <div className="mt-24">
            <ArrowLink href="/evidence/">
              Every entry, searchable, with sources
            </ArrowLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
