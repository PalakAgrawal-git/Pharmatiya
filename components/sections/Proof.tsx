import Link from "next/link";
import { proofFigures } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";

/**
 * The record — a statistics strip, not four cards.
 *
 * These are the strongest credibility signals on the site, so they are set at
 * genuine display scale on the one inverted ground the homepage uses. The
 * figures sit on a single hairline with the label beneath each, which is how a
 * results table is set; boxing them would make four small things out of one
 * large one.
 *
 * Numerals are in the serif. It is the only place on the page besides the
 * hero where it appears, and large numerals are what it is for.
 */
export default function Proof() {
  return (
    <section className="bg-inverse text-white">
      <div className="shell section">
        <Reveal>
          <h2 className="label flex items-center gap-5 text-white/45">
            The record
            <span aria-hidden="true" className="rule-grow h-px flex-1 bg-white/15" />
          </h2>
        </Reveal>

        <dl className="mt-16 grid grid-cols-2 gap-x-10 gap-y-14 lg:mt-20 lg:grid-cols-4">
          {proofFigures.map((figure, index) => (
            <Reveal
              key={figure.label}
              delay={index * 90}
              className="border-t border-white/20 pt-6"
            >
              <dt className="display text-[clamp(2.8rem,1.7rem+4vw,5rem)] leading-[0.88] tracking-[-0.03em] tabular text-white">
                <CountUp value={figure.value} />
              </dt>
              <dd className="mt-5 max-w-[22ch] text-small leading-[1.5] text-white/55">
                {figure.label}
              </dd>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={400}>
          <div className="mt-20 border-t border-white/15 pt-7">
            <Link
              href="/evidence/"
              className="arrow-link text-small text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:decoration-white"
            >
              Every entry, searchable, with sources{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
