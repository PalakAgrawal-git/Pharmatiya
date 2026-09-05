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
        <div className="shell py-16 lg:py-24">
          <Reveal className="lg:pl-[14%]">
            <blockquote className="max-w-[28ch]">
              <p className="font-display text-[clamp(1.5rem,1.1rem+2.2vw,2.8rem)] leading-[1.15] tracking-[-0.02em]">
                Twenty-five years in outcomes research — including building an
                organic Outcomes Research division on the payer side.
              </p>
            </blockquote>
            <p className="mt-6 text-small text-muted">
              Organisation <Pending>Name pending client clearance</Pending>
            </p>
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
