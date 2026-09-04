import Link from "next/link";
import Hero from "@/components/sections/Hero";
import Proof from "@/components/sections/Proof";
import ServiceTeasers from "@/components/sections/ServiceTeasers";
import NextGenTeaser from "@/components/sections/NextGenTeaser";
import CTA from "@/components/sections/CTA";
import DatasetMap from "@/components/evidence/DatasetMap";
import { DataLabel, Pending } from "@/components/ui/DataLabel";

export const metadata = {
  title: "Pharmatiya Health — Health economics and real-world evidence",
  description:
    "Twenty-five years designing HEOR and RWE studies across payer, provider and claims data — protocol through interpretation, for commercial, medical affairs and market access teams.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Proof />
      <ServiceTeasers />

      {/* Coverage answers the most common disqualifying question on the
          homepage, so a qualified buyer does not bounce assuming they are
          not served. */}
      <section className="border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Data &amp; therapeutic coverage
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>

          <DatasetMap compact />

          <div className="mt-10 border-t border-rule pt-5">
            <Link
              href="/evidence/"
              className="font-mono text-small text-accent underline underline-offset-4"
            >
              Full coverage detail and therapeutic areas →
            </Link>
          </div>
        </div>
      </section>

      <NextGenTeaser />

      {/* Narrow offset editorial column — the single strongest credential. */}
      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <div className="lg:max-w-[46ch] lg:pl-[8%]">
            <p className="mb-4 font-display text-[clamp(1.15rem,1rem+0.7vw,1.5rem)] leading-[1.4]">
              Twenty-five years in HEOR and outcomes research, including
              building the organic Outcomes Research division at{" "}
              <Pending>Name pending client clearance</Pending>.
            </p>
            <Link
              href="/about/"
              className="font-mono text-small text-accent underline underline-offset-4"
            >
              About Pharmatiya →
            </Link>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
