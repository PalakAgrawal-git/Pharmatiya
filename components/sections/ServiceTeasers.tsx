import Link from "next/link";
import { services } from "@/lib/site";
import { DataLabel } from "@/components/ui/DataLabel";
import Figure from "@/components/evidence/Figure";
import ForestPlot from "@/components/evidence/ForestPlot";
import CohortDiagram from "@/components/evidence/CohortDiagram";
import CostEffectivenessPlane from "@/components/evidence/CostEffectivenessPlane";

const graphics = [
  {
    node: <ForestPlot />,
    number: "2",
    caption: "Subgroup hazard ratios with 95% confidence intervals.",
  },
  {
    node: <CohortDiagram />,
    number: "3",
    caption: "Attrition from source population to analytic cohort.",
  },
  {
    node: <CostEffectivenessPlane />,
    number: "4",
    caption:
      "Bootstrap replicates against a willingness-to-pay threshold.",
  },
];

/**
 * Three editorial rows with an alternating 65/35 split — deliberately not
 * three identical cards, which the brief rules out and the current site does.
 *
 * Each row deep-links to its own anchor on Services. On the current site all
 * three teasers point at the same page.
 *
 * Graphics are dropped below `lg` rather than scaled: a forest plot at 375px
 * is illegible, and shipping it as decoration costs bandwidth for no
 * comprehension.
 */
export default function ServiceTeasers() {
  return (
    <section className="border-b border-rule">
      <div className="shell py-14 lg:py-20">
        <DataLabel as="h2" className="mb-10 flex items-center gap-4">
          What we do
          <span aria-hidden="true" className="h-px flex-1 bg-rule" />
        </DataLabel>

        <div className="flex flex-col gap-14 lg:gap-20">
          {services.map((service, index) => {
            const graphic = graphics[index];
            const flipped = index % 2 === 1;

            return (
              <div
                key={service.id}
                className={`grid items-center gap-8 lg:gap-14 ${
                  flipped
                    ? "lg:grid-cols-[35fr_65fr]"
                    : "lg:grid-cols-[65fr_35fr]"
                }`}
              >
                <div className={flipped ? "lg:order-2" : "lg:order-1"}>
                  <h3 className="mb-3 text-[clamp(1.3rem,1.1rem+1vw,1.9rem)]">
                    {service.name}
                  </h3>
                  <p className="measure mb-4 text-lede leading-[1.45] text-muted">
                    {service.problem}
                  </p>
                  <p className="mb-5 font-mono text-caption text-faint">
                    {service.deliverables.slice(0, 3).join(" · ")}
                  </p>
                  <Link
                    href={`/services/#${service.id}`}
                    className="font-mono text-small text-accent underline underline-offset-4"
                  >
                    See this service →
                  </Link>
                </div>

                <div
                  className={`hidden lg:block ${
                    flipped ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Figure number={graphic.number} caption={graphic.caption}>
                    {graphic.node}
                  </Figure>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
