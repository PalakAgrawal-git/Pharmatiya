import { site } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel } from "@/components/ui/DataLabel";
import Button from "@/components/ui/Button";
import ContactRouting from "@/components/sections/ContactRouting";
import DigestSignup from "@/components/sections/DigestSignup";
import Reveal from "@/components/motion/Reveal";
import Slot from "@/components/ui/Slot";

export const metadata = {
  title: "Contact",
  description:
    "Separate routes for new clients, existing clients and press, so enquiries reach the right person. Book a 30-minute consultation with a senior researcher.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="shell section">
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

      <section id="enquiry" className="scroll-mt-28 border-b border-rule">
        <div className="shell section grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] leading-[1.1]">
              Start a conversation
            </h2>
            <p className="mt-7 text-small leading-[1.7] text-muted">
              Tell us what you are working on. The enquiry is routed to the
              person who would run the work, not to a sales desk.
            </p>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
            <ContactRouting />

            <div className="mt-10 flex flex-col gap-4">
              <Slot id={3} blocking>
                Where each kind of enquiry should go. The routing above sorts
                them into three streams but every one of them currently ends
                at the same address.
              </Slot>
              <Slot id={5} blocking>
                Where the form should send, and who hosts it. This is a static
                site with no server, so until there is an endpoint the form
                cannot submit anywhere.
              </Slot>
              <Slot id={6}>
                The public email address. The site uses admin@pharmatiya.net,
                taken from the current site — confirm it or replace it.
              </Slot>
              <Slot id={7}>
                A calendar link, if you want direct booking. Without one the
                only route is the form.
              </Slot>
            </div>
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
