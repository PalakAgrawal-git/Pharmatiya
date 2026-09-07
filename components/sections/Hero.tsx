import Link from "next/link";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import KaplanMeierGraphic from "@/components/evidence/KaplanMeierGraphic";
import GraphGround from "@/components/layout/GraphGround";

/**
 * Homepage hero, composed as the opening spread of a report.
 *
 * The statement sits in a 7-column measure on the left and the figure runs in
 * the remaining 5 on the right, breaking the margin — an asymmetry that does
 * the work a centred hero cannot. The headline is set in the serif because
 * this is the one sentence carrying the identity; everything else on the page
 * is sans, which is what keeps the serif meaning something.
 *
 * The figure is presented as a publication figure and not as a product
 * screenshot: no card, no frame, no shadow. Its caption carries a figure
 * number and the illustrative-data marker, exactly as it would in print.
 *
 * On mobile the figure moves below the copy and the CTA, so the positioning
 * statement and the primary action are both reachable without scrolling.
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-rule">
      <GraphGround />

      <div className="shell relative grid items-center gap-x-16 gap-y-14 py-20 lg:grid-cols-12 lg:py-32">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-accent">
              <span>Health economics</span>
              <span aria-hidden="true" className="text-rule-firm">/</span>
              <span>Real-world evidence</span>
              <span aria-hidden="true" className="text-rule-firm">/</span>
              <span>Market access</span>
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="display mt-8 text-[clamp(2.6rem,1.4rem+4.6vw,5rem)] leading-[1.02]">
              Evidence that holds up
              <br className="hidden sm:block" />{" "}
              <span className="text-accent">when it is challenged.</span>
            </h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="measure mt-9 text-lede leading-[1.5] text-muted">
              Twenty-five years designing HEOR and RWE studies across payer,
              provider and claims data — protocol through interpretation, for
              commercial, medical affairs and market access teams.
            </p>
          </Reveal>

          <Reveal delay={250}>
            <div className="mt-11 flex flex-wrap items-center gap-x-9 gap-y-4">
              <Button href="/contact/">Book a consultation</Button>
              <Link
                href="/evidence/"
                className="arrow-link text-small text-ink underline decoration-rule-firm underline-offset-[6px] transition-colors hover:decoration-accent"
              >
                See the published record{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={210} className="lg:col-span-5 lg:-mr-[8%]">
          <figure>
            <KaplanMeierGraphic animate />
            <figcaption className="mt-5 border-t border-rule pt-3">
              <span className="label text-ink">Fig. 01</span>
              <p className="mt-1.5 text-caption leading-relaxed text-muted">
                Two-arm survival estimate over 24 months. Curves separate from
                month 6 and do not converge.
              </p>
              <p className="label mt-2 text-[0.7rem] text-faint">
                Illustrative data
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
