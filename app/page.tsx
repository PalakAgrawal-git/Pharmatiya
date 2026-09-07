import Link from "next/link";
import Hero from "@/components/sections/Hero";
import Proof from "@/components/sections/Proof";
import ServiceTeasers from "@/components/sections/ServiceTeasers";
import CoverageBand from "@/components/sections/CoverageBand";
import NextGenTeaser from "@/components/sections/NextGenTeaser";
import CTA from "@/components/sections/CTA";
import Reveal from "@/components/motion/Reveal";
import { Pending } from "@/components/ui/DataLabel";

export const metadata = {
  title: "Pharmatiya Health — Health economics and real-world evidence",
  description:
    "Twenty-five years designing HEOR and RWE studies across payer, provider and claims data — protocol through interpretation, for commercial, medical affairs and market access teams.",
  alternates: { canonical: "/" },
};

/**
 * Homepage.
 *
 * The section rhythm is deliberate and never repeats two grounds in a row:
 * plotting-paper hero → inverted proof band → open editorial rows → sunk
 * coverage → inverted product panel → open pull-quote → closing CTA. That
 * alternation is what keeps a restrained palette from reading as flat.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Proof />
      <ServiceTeasers />
      <CoverageBand />
      <NextGenTeaser />

      {/* Editorial pull-quote. The single strongest credential, set at scale
          with nothing competing for attention. */}
      <section className="border-b border-rule">
        <div className="shell section">
          <Reveal className="lg:pl-[14%]">
            {/* The measure lives on the <p>, not the <blockquote>. `ch` resolves
                against the font-size of the element it is set on, and the
                blockquote inherits body type — so 28ch there meant 28
                characters of 17px text, capping this quote at 286px and
                wrapping 45px display type into eleven two-word lines. */}
            <blockquote>
              <p className="display max-w-[26ch] text-[clamp(1.6rem,1.1rem+2.4vw,3rem)] leading-[1.14]">
                Twenty-five years in outcomes research — including building an
                organic Outcomes Research division on the payer side.
              </p>
            </blockquote>
            <Link
              href="/about/"
              className="arrow-link mt-5 inline-block font-mono text-small text-accent underline underline-offset-4"
            >
              About us{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <CTA />
    </>
  );
}
