import EmailAddress from "@/components/ui/EmailAddress";
import Link from "next/link";
import { site } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel } from "@/components/ui/DataLabel";
import Button from "@/components/ui/Button";
import ContactRouting from "@/components/sections/ContactRouting";
import Reveal from "@/components/motion/Reveal";

export const metadata = {
  title: "Contact",
  description:
    "Send us the question you are trying to answer. Every enquiry is read by a researcher. Book a 30-minute consultation with a senior researcher.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <>
      {/* The heading is set at 18 characters a line, so a long one stacks
          four deep down the left and leaves the rest of the band empty. A
          short title and a line beside it fill the opening the way every
          other page's does. */}
      <section className="border-b border-rule">
        <div className="shell section-tight grid gap-x-16 gap-y-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <SectionHeader
              as="h1"
              display
              eyebrow="Contact"
              title="Start with the question you are trying to answer."
            />
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <p className="text-small leading-[1.7] text-muted">
              Every enquiry is read by a researcher. If there is a study in it,
              we will tell you what data it would take and whether that data
              exists.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="enquiry" className="scroll-mt-28 border-b border-rule">
        <div className="shell section grid gap-x-16 gap-y-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-4">
            <h2 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] leading-[1.1]">
              Let&rsquo;s connect
            </h2>
            <p className="mt-7 text-small leading-[1.7] text-muted">
              If you are interested in collaborating, send us your details and
              we will be in touch. Your message reaches the person who would
              run the work, not a sales desk.
            </p>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-7 lg:col-start-6">
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
              <EmailAddress className="text-accent underline underline-offset-4" />
            </p>
            <address className="not-italic text-muted">
              {site.legalName}
              <br />
              {site.address.locality}, {site.address.region}{" "}
              {site.address.postalCode}
            </address>
            <p className="mt-5 text-caption text-faint">
              To try it first, the synopsis builder is on the{" "}
              <Link href="/nextgen-ai/#builder" className="text-accent underline">
                {site.productName} page
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

    </>
  );
}
