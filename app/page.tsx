import Hero from "@/components/sections/Hero";
import Proof from "@/components/sections/Proof";
import Statement from "@/components/sections/Statement";
import ServiceTeasers from "@/components/sections/ServiceTeasers";
import CoverageBand from "@/components/sections/CoverageBand";
import NextGenTeaser from "@/components/sections/NextGenTeaser";
import CTA from "@/components/sections/CTA";

export const metadata = {
  title: "Pharmatiya Health — Health economics and real-world evidence",
  description:
    "Twenty-five years designing HEOR and RWE studies across payer, provider and claims data — protocol through interpretation, for commercial, medical affairs and market access teams.",
  alternates: { canonical: "/" },
};

/**
 * Homepage.
 *
 * Composed as a numbered document: hero, 01 the record, a serif pause, 02 the
 * services, 03 coverage, 04 the product, close. The grounds change three
 * times and no more — paper throughout, sunk once for coverage, inverse once
 * for the product — because a break that happens every section stops being a
 * break.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Proof />
      <Statement />
      <ServiceTeasers />
      <CoverageBand />
      <NextGenTeaser />

      <CTA />
    </>
  );
}
