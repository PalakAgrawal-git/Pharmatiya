import { proofFigures } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";

/**
 * The record — one horizontal row of four, on paper.
 *
 * Boxes would make four small things out of one large one, and a dark band
 * here would spend the site's single tonal break before the section that
 * needs it. So this stays on paper and gets scale and air instead: numerals
 * against a hairline, the label set small and cool beneath.
 *
 * The numeral size is capped so four columns hold on one line down to 1024px
 * without the figures colliding — at four across each column is roughly a
 * quarter of the measure, which is what sets the ceiling. Below `lg` the row
 * folds to two, and to one on a phone, rather than shrinking the type until
 * it stops reading as a display figure.
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

        <dl className="mt-20 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-x-12">
          {proofFigures.map((figure, index) => (
            <Reveal key={figure.label} delay={index * 90}>
              <div className="border-t border-ink/25 pt-7">
                <dt className="text-[clamp(3.25rem,1.6rem+4.4vw,6.25rem)] font-normal leading-[0.85] tracking-[-0.04em] tabular text-ink">
                  <CountUp value={figure.value} />
                </dt>
                {/* Sans, not the mono label: these are sentences describing the
                  figure, and tracked-out uppercase at 0.18em wrapped each one
                  into four ragged lines in a quarter-width column. Mono is
                  reserved for apparatus — section marks, figure numbers,
                  years — where the tracking is the point. */}
              <dd className="mt-6 max-w-[22ch] text-small leading-[1.5] text-muted">
                  {figure.label}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={400}>
          <div className="mt-20">
            <ArrowLink href="/evidence/">
              Every entry, searchable, with sources
            </ArrowLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
