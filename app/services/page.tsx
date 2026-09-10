import Link from "next/link";
import { services } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel } from "@/components/ui/DataLabel";
import Button from "@/components/ui/Button";
import ArrowLink from "@/components/ui/ArrowLink";
import CTA from "@/components/sections/CTA";
import Reveal from "@/components/motion/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ServiceProcess from "@/components/sections/ServiceProcess";
import Slot from "@/components/ui/Slot";

export const metadata = {
  title: "Services",
  description:
    "Evidence generation, real-world data analytics, and access and value strategy. Each engagement framed around the question you need answered, with named methods and deliverables.",
  alternates: { canonical: "/services/" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="shell relative grid gap-10 py-12 lg:grid-cols-[6fr_4fr] lg:py-16">
          <Reveal>
            <SectionHeader
              as="h1"
              display
              eyebrow="Services"
              index="01–03"
              title="Three engagement types. Most projects combine two."
              lede="Each begins with the question you need answered, not with a package."
            />
          </Reveal>

          {/* Landing target for the homepage deep links: a visitor arriving
              at one service can still see the other two exist. */}
          <Reveal
            as="nav"
            delay={120}
            aria-label="On this page"
            className="self-start border-t border-rule pt-5 lg:sticky lg:top-28"
          >
            <DataLabel as="h2" className="mb-3">
              On this page
            </DataLabel>
            <ul className="flex flex-col gap-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`#${service.id}`}
                    className="arrow-link text-small text-accent no-underline hover:underline"
                  >
                    {service.name}{" "}
                    <span className="arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {services.map((service, index) => {
        const flipped = index % 2 === 1;

        return (
          <section
            key={service.id}
            id={service.id}
            className={`scroll-mt-8 border-b border-rule ${
              flipped ? "bg-sunk" : ""
            }`}
          >
            <div className="shell section">
              <Reveal>
                <DataLabel as="h2" className="mb-8 flex items-center gap-4">
                  Service {String(index + 1).padStart(2, "0")} — {service.name}
                  <span aria-hidden="true" className="rule-grow h-px flex-1 bg-rule" />
                </DataLabel>
              </Reveal>

              <div className="grid items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-16">
                <Reveal>
                  <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-faint">
                    The problem
                  </p>
                  <h3 className="max-w-[22ch] text-[clamp(1.4rem,1.1rem+1.3vw,2.2rem)] leading-[1.1] tracking-[-0.02em]">
                    {service.problem}
                  </h3>
                </Reveal>

                <Reveal delay={100}>
                  <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-faint">
                    Our approach
                  </p>
                  <p className="measure text-lede leading-[1.5] text-muted">
                    {service.approach}
                  </p>
                </Reveal>
              </div>

              {/* How the engagement runs. Unique to this page — the homepage
                  carries the result figures, this carries the process. */}
              <div className="mt-12">
                <Reveal>
                  <p className="mb-5 flex items-center gap-4 font-mono text-caption uppercase tracking-[0.12em] text-faint">
                    How it runs
                    <span aria-hidden="true" className="rule-grow h-px flex-1 bg-rule" />
                  </p>
                </Reveal>
                <ServiceProcess stages={service.stages} />
              </div>

              <Reveal className="mt-16 grid gap-x-16 gap-y-10 border-t border-rule pt-10 sm:grid-cols-2">
                <div>
                  <p className="label-sm mb-5 text-faint">Methodology</p>
                  <ul className="flex flex-col gap-2.5">
                    {service.methodology.map((item) => (
                      <li key={item} className="text-small text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="label-sm mb-5 text-faint">Deliverables</p>
                  <ul className="flex flex-col gap-2.5">
                    {service.deliverables.map((item) => (
                      <li key={item} className="text-small text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {service.deliverablesPending && (
                    <Slot id={12} className="mt-5">
                      The full deliverables list for this service. What is
                      above is drafted from the brief — confirm, correct, and
                      add anything a client actually receives that is missing.
                    </Slot>
                  )}
                </div>
              </Reveal>

              {index === 0 && (
                <Reveal className="mt-10 flex flex-col gap-4">
                  <Slot id={11}>
                    Your own description of each of the three services, in the
                    words you use with clients. Everything on this page is
                    drafted from the proposal and needs your sign-off before
                    launch.
                  </Slot>
                  <Slot id={13}>
                    Engagement model or pricing guidance — retainer, project,
                    day rate, or a typical range. A buyer who cannot tell
                    whether you are in their budget often does not ask.
                  </Slot>
                </Reveal>
              )}

              <Reveal
                delay={80}
                className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-rule pt-10"
              >
                <Button href="/contact/">{service.cta}</Button>
                <ArrowLink href="/evidence/">
                  See the methods behind this
                </ArrowLink>
              </Reveal>
            </div>
          </section>
        );
      })}

      <CTA
        title="Not sure which of these fits?"
        body="Describe the question you are trying to answer and we will tell you what it would take to answer it — including if the answer is that the data does not exist."
        action="Start a conversation"
        band={false}
      />
    </>
  );
}
