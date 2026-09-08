import Button from "@/components/ui/Button";
import ArrowLink from "@/components/ui/ArrowLink";
import Reveal from "@/components/motion/Reveal";
import SurvivalReadout from "@/components/evidence/SurvivalReadout";

/**
 * The opening spread.
 *
 * Seven columns of article introduction, five of figure, and nothing between
 * them but the grid — no card, no frame, no shadow. The figure is hung on a
 * rule with its number and caption beneath, which is how a journal places a
 * figure beside an introduction, and it is what makes the chart read as
 * evidence rather than as an illustration of evidence.
 *
 * The headline is mostly sans; only the closing clause is in the serif. That
 * single switch is the whole typographic idea of the site — the sentence
 * turns at the moment it becomes a claim.
 *
 * On mobile the figure moves below the copy and the action, so the
 * positioning statement and the primary CTA are both reachable without
 * scrolling on a 390px screen.
 */
export default function Hero() {
  return (
    <section className="border-b border-rule">
      <div className="shell grid grid-cols-1 items-end gap-x-16 gap-y-16 pb-24 pt-14 lg:grid-cols-12 lg:pb-28 lg:pt-20">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label-sm text-faint">
              Independent health economics &amp; outcomes research
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-10 max-w-[16ch] text-[clamp(2.25rem,1.2rem+3.9vw,4rem)] font-normal leading-[1.1] tracking-[-0.02em]">
              Evidence that holds up
              <br />
              <span className="display italic text-accent">
                when it is challenged.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="measure mt-10 text-lede leading-[1.55] text-muted">
              Twenty-five years designing HEOR and RWE studies across payer,
              provider and claims data — protocol through interpretation, for
              commercial, medical affairs and market access teams.
            </p>
          </Reveal>

          <Reveal delay={250}>
            <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
              <Button href="/contact/">Book a consultation</Button>
              <ArrowLink href="/evidence/">View published record</ArrowLink>
            </div>
          </Reveal>
        </div>

        <Reveal delay={210} className="lg:col-span-5">
          <figure>
            <SurvivalReadout />
            <figcaption className="mt-6 border-t border-rule pt-4">
              <p className="label-sm text-ink">Fig. 01 / Survival estimate</p>
              <p className="label-sm mt-2 text-faint">24-month follow-up</p>
              <p className="mt-4 max-w-[38ch] text-caption leading-relaxed text-muted">
                Two arms, separating from month 6 and not converging.
                Illustrative data.
              </p>
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
