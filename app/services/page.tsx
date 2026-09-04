import Link from "next/link";
import { services } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel, Pending } from "@/components/ui/DataLabel";
import Button from "@/components/ui/Button";
import CTA from "@/components/sections/CTA";
import Figure from "@/components/evidence/Figure";
import KaplanMeierGraphic from "@/components/evidence/KaplanMeierGraphic";
import CohortDiagram from "@/components/evidence/CohortDiagram";
import CostEffectivenessPlane from "@/components/evidence/CostEffectivenessPlane";

export const metadata = {
  title: "Services",
  description:
    "Evidence generation, real-world data analytics, and access and value strategy. Each engagement framed around the question you need answered, with named methods and deliverables.",
  alternates: { canonical: "/services/" },
};

const graphics = [
  {
    node: <KaplanMeierGraphic />,
    number: "2.1",
    caption: "Two-arm survival estimate with separation from month 6.",
  },
  {
    node: <CohortDiagram />,
    number: "2.2",
    caption: "Attrition from source population to analytic cohort.",
  },
  {
    node: <CostEffectivenessPlane />,
    number: "2.3",
    caption: "Bootstrap replicates against a willingness-to-pay threshold.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="shell grid gap-10 py-14 lg:grid-cols-[6fr_4fr] lg:py-20">
          <SectionHeader
            as="h1"
            eyebrow="Services"
            title="Three engagement types. Most projects combine two."
            lede="Each begins with the question you need answered, not with a package."
          />

          {/* Landing target for the homepage deep links: a visitor arriving
              at one service can still see the other two exist. */}
          <nav
            aria-label="On this page"
            className="self-start border border-rule bg-surface p-5"
          >
            <DataLabel as="h2" className="mb-3">
              On this page
            </DataLabel>
            <ul className="flex flex-col gap-2">
              {services.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`#${service.id}`}
                    className="text-small text-accent no-underline hover:underline"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {services.map((service, index) => {
        const graphic = graphics[index];
        const flipped = index % 2 === 1;

        return (
          <section
            key={service.id}
            id={service.id}
            className={`scroll-mt-8 border-b border-rule ${
              flipped ? "bg-sunk" : ""
            }`}
          >
            <div className="shell py-14 lg:py-20">
              <DataLabel as="h2" className="mb-8 flex items-center gap-4">
                Service {String(index + 1).padStart(2, "0")} — {service.name}
                <span aria-hidden="true" className="h-px flex-1 bg-rule" />
              </DataLabel>

              <div
                className={`grid items-start gap-10 lg:gap-14 ${
                  flipped
                    ? "lg:grid-cols-[35fr_65fr]"
                    : "lg:grid-cols-[65fr_35fr]"
                }`}
              >
                <div className={flipped ? "lg:order-2" : "lg:order-1"}>
                  <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-faint">
                    The problem
                  </p>
                  <h3 className="mb-6 max-w-[24ch] text-[clamp(1.3rem,1.1rem+1.1vw,2rem)]">
                    {service.problem}
                  </h3>

                  <p className="mb-2 font-mono text-caption uppercase tracking-[0.12em] text-faint">
                    Our approach
                  </p>
                  <p className="measure text-muted">{service.approach}</p>
                </div>

                <div className={flipped ? "lg:order-1" : "lg:order-2"}>
                  <Figure number={graphic.number} caption={graphic.caption}>
                    {graphic.node}
                  </Figure>
                </div>
              </div>

              <div className="mt-10 grid gap-8 border-t border-rule pt-8 sm:grid-cols-2">
                <div>
                  <DataLabel as="h4" className="mb-3">
                    Methodology
                  </DataLabel>
                  <ul className="flex flex-col gap-1.5">
                    {service.methodology.map((item) => (
                      <li key={item} className="text-small text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <DataLabel as="h4" className="mb-3">
                    Deliverables
                  </DataLabel>
                  <ul className="flex flex-col gap-1.5">
                    {service.deliverables.map((item) => (
                      <li key={item} className="text-small text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                  {service.deliverablesPending && (
                    <p className="mt-3 text-caption text-faint">
                      <Pending>Full list to be confirmed</Pending>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-rule pt-8">
                <Button href="/contact/">{service.cta}</Button>
                <Link
                  href="/evidence/"
                  className="font-mono text-small text-accent underline underline-offset-4"
                >
                  See the methods behind this →
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      <section className="border-b border-rule">
        <div className="shell py-12 lg:py-16">
          <DataLabel as="h2" className="mb-3">
            Engagement model
          </DataLabel>
          <p className="measure text-muted">
            How projects typically start, run and conclude.{" "}
            <Pending>Pharmatiya to provide</Pending> This section is omitted at
            launch rather than shipped with placeholder pricing.
          </p>
        </div>
      </section>

      <CTA
        title="Not sure which of these fits?"
        body="Describe the question you are trying to answer and we will tell you what it would take to answer it — including if the answer is that the data does not exist."
        action="Start a conversation"
      />
    </>
  );
}
