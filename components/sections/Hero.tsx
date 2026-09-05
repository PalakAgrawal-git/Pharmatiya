import Link from "next/link";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import KaplanMeierGraphic from "@/components/evidence/KaplanMeierGraphic";
import GraphGround from "@/components/layout/GraphGround";

/**
 * Homepage hero.
 *
 * The composition is deliberately asymmetric and overlapping: the headline
 * runs wide, the figure sits lower-right and breaks out of the text column
 * on large screens. The ground is plotting paper — millimetre grid at the
 * threshold of visibility — which gives the section a surface without the
 * gradient the brief rules out.
 *
 * On mobile the figure moves below the copy and CTA, so the positioning
 * statement and the primary action are both visible without scrolling on a
 * 320px screen.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <GraphGround />

      <div className="shell relative py-16 lg:py-24">
        <Reveal>
          <p className="mb-6 font-mono text-caption uppercase tracking-[0.18em] text-accent">
            Health economics · Real-world evidence · Market access
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="max-w-[15ch] text-[clamp(2.4rem,1.2rem+5.4vw,5.4rem)] leading-[0.98] tracking-[-0.03em]">
            Evidence that holds up
            <br className="hidden sm:block" />{" "}
            <span className="text-accent">when it is challenged.</span>
          </h1>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal delay={160}>
              <p className="text-lede leading-[1.5] text-muted">
                Twenty-five years designing HEOR and RWE studies across payer,
                provider and claims data — protocol through interpretation, for
                commercial, medical affairs and market access teams.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Button href="/contact/">Book a consultation</Button>
                <Link
                  href="/evidence/"
                  className="arrow-link font-mono text-small text-accent underline underline-offset-4"
                >
                  See the published record{" "}
                  <span className="arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
          </div>

          {/* The figure breaks the right margin on wide screens so the hero
              does not read as two tidy columns. */}
          <Reveal delay={200} className="lg:-mr-[6%]">
            <figure>
              <KaplanMeierGraphic animate />
              <figcaption className="mt-4 flex flex-wrap items-baseline gap-x-3 border-l-2 border-accent pl-4 text-caption text-faint">
                <span className="font-mono text-ink">Fig. 1</span>
                <span className="text-muted">
                  Two-arm survival estimate over 24 months. Curves separate from
                  month 6 and do not converge.
                </span>
                <span className="font-mono uppercase tracking-[0.08em] text-flag">
                  Illustrative data
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
