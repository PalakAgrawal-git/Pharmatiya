import type { CSSProperties } from "react";
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
      <div className="shell grid grid-cols-1 items-end gap-x-16 gap-y-12 pb-16 pt-10 lg:grid-cols-12 lg:pb-20 lg:pt-12">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="label-sm text-faint">
              Independent health economics &amp; outcomes research
            </p>
          </Reveal>

          <Reveal delay={90}>
            <h1 className="mt-10 max-w-[16ch] text-[clamp(2.25rem,1.2rem+3.9vw,4rem)] font-normal leading-[1.1] tracking-[-0.02em]">
              <Words text="Evidence that holds up" />
              <br />
              <span className="display italic text-accent">
                <Words text="when it is challenged." from={4} />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="measure mt-10 text-lede leading-[1.55] text-muted">
              Built on decades of experience across healthcare delivery, payer
              analytics, and life sciences research, Pharmatiya transforms
              complex real-world data into credible clinical and economic
              evidence that informs treatment decisions, demonstrates value,
              and strengthens market access strategies.
            </p>
          </Reveal>

          {/* Three actions, in the order a visitor is most likely to want
              them. The synopsis builder leads because it is the only one
              that gives something back immediately — booking a call asks
              for a commitment first, and the record is for the reader who
              is already convinced. */}
          <Reveal delay={250}>
            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-5">
              <Button href="/rwe-synopsis/" size="lg" arrow>
                Build a synopsis
              </Button>
              <Button href="/contact/" variant="secondary" size="lg">
                Book a consultation
              </Button>
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

/**
 * Splits a line into per-word clipping bands so the headline can assemble a
 * word at a time. `from` continues the stagger across the line break, so the
 * two halves of the sentence read as one sequence rather than restarting.
 *
 * The words are real text in the markup — this is a wrapper, not a rewrite —
 * so the h1 is one string to a screen reader and to a crawler, and with the
 * animation suppressed the sentence is simply set.
 */
function Words({ text, from = 0 }: { text: string; from?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="word-mask">
          <span
            className="word-rise"
            style={{ "--word-delay": `${(from + i) * 85}ms` } as CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
