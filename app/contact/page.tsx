import { site } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel, Pending } from "@/components/ui/DataLabel";
import ContactRouting from "@/components/sections/ContactRouting";
import DigestSignup from "@/components/sections/DigestSignup";
import Reveal from "@/components/motion/Reveal";
import GraphGround from "@/components/layout/GraphGround";

export const metadata = {
  title: "Contact",
  description:
    "Separate routes for new clients, existing clients and press, so enquiries reach the right person. Book a 30-minute consultation with a senior researcher.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
        <GraphGround />
        <div className="shell relative py-16 lg:py-24">
          <Reveal>
            <SectionHeader
              as="h1"
              eyebrow="Contact"
              title="Tell us which applies and the enquiry reaches the right person directly."
            />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <ContactRouting />
          </Reveal>
        </div>
      </section>

      <section id="demo" className="scroll-mt-8 border-b border-rule bg-sunk">
        <div className="shell grid gap-8 py-14 lg:grid-cols-2 lg:py-20">
          <Reveal className="lift border border-rule bg-surface p-6">
            <DataLabel as="h2" className="mb-3">
              Book directly
            </DataLabel>
            <p className="mb-5 text-muted">
              A 30-minute consultation with a senior researcher. No sales team,
              no discovery call before the discovery call.
            </p>
            <div className="flex min-h-[9rem] flex-col items-center justify-center gap-2 border border-dashed border-rule-firm bg-paper p-5 text-center">
              <DataLabel>Calendar</DataLabel>
              <p className="text-caption text-faint">
                <Pending>Pending input 6</Pending>
              </p>
              <p className="max-w-[34ch] text-caption text-faint">
                If no calendar is supplied this becomes a “request a time”
                field in the form above.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120} className="lift border border-rule bg-surface p-6">
            <DataLabel as="h2" className="mb-3">
              Direct contact
            </DataLabel>
            <p className="mb-4">
              <a
                href={`mailto:${site.email}`}
                className="text-accent underline underline-offset-4"
              >
                {site.email}
              </a>
            </p>
            <address className="not-italic text-muted">
              {site.legalName}
              <br />
              {site.address.locality}, {site.address.region}{" "}
              {site.address.postalCode}
            </address>
            <p className="mt-5 text-caption text-faint">
              Existing users of {site.productLegacyName} can reach the
              application directly at{" "}
              <a href={site.appUrl} className="text-accent underline">
                app.pharmatiya.net
              </a>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DigestSignup />
          </Reveal>
        </div>
      </section>
    </>
  );
}
