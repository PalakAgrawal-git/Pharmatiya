import Link from "next/link";
import Button from "@/components/ui/Button";
import Figure from "@/components/evidence/Figure";
import KaplanMeierGraphic from "@/components/evidence/KaplanMeierGraphic";

/**
 * Homepage hero. 60/40 split on desktop.
 *
 * On mobile the figure moves BELOW the copy and CTA (order-2), so the
 * positioning statement and primary action are both visible without
 * scrolling on a 320px screen.
 */
export default function Hero() {
  return (
    <section className="border-b border-rule">
      <div className="shell grid items-center gap-10 py-14 lg:grid-cols-[6fr_4fr] lg:gap-16 lg:py-20">
        <div className="order-1">
          <p className="mb-5 font-mono text-caption uppercase tracking-[0.14em] text-faint">
            HEOR · RWE · Market access
          </p>

          <h1 className="mb-6 max-w-[18ch] text-[clamp(1.75rem,1.1rem+3.4vw,3.9rem)]">
            Health economics and real-world evidence for teams that have to
            defend the result.
          </h1>

          <p className="measure mb-8 text-lede leading-[1.5] text-muted">
            Twenty-five years designing HEOR and RWE studies across payer,
            provider and claims data — protocol through interpretation, for
            commercial, medical affairs and market access teams.
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button href="/contact/">Book a consultation</Button>
            <Link
              href="/evidence/"
              className="font-mono text-small text-accent underline underline-offset-4"
            >
              Explore the evidence →
            </Link>
          </div>
        </div>

        <div className="order-2">
          <Figure
            number="1"
            caption="Two-arm survival estimate over 24 months. Curves separate from month 6 and do not converge."
          >
            <KaplanMeierGraphic />
          </Figure>
        </div>
      </div>
    </section>
  );
}
