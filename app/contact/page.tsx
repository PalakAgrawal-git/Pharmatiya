import { site } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel, Pending } from "@/components/ui/DataLabel";
import Button from "@/components/ui/Button";
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
        <div className="shell relative section">
          <Reveal>
            <SectionHeader
              as="h1"
              display
              eyebrow="Contact"
              title="Tell us which applies and the enquiry reaches the right person directly."
            />
          </Reveal>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-24 border-b border-rule">
        <div className="shell section">
          <Reveal>
            <ContactRouting />
          </Reveal>
        </div>
      </section>

      <section id="demo" className="scroll-mt-8 border-b border-rule bg-sunk">
        <div className="shell section grid gap-x-16 gap-y-12 lg:grid-cols-12">
          <Reveal className="border-t border-rule pt-6 lg:col-span-5">
            <DataLabel as="h2" className="mb-4">
              Book directly
            </DataLabel>
            <p className="mb-5 text-muted">
              A 30-minute consultation with a senior researcher. No sales team,
              no discovery call before the discovery call.
            </p>
            {/* A booking calendar replaces this once one is supplied
                (client input 6). Until then the enquiry form above is the
                route, so this points at it rather than showing an empty
                embed. */}
            <Button href="#enquiry" variant="secondary">
              Request a time
            </Button>
          </Reveal>

          <Reveal delay={120} className="border-t border-rule pt-6 lg:col-span-5 lg:col-start-7">
            <DataLabel as="h2" className="mb-4">
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
        <div className="shell section">
          <Reveal>
            <DigestSignup />
          </Reveal>
        </div>
      </section>
    </>
  );
}
