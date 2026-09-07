import { services } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";
import ForestPlot from "@/components/evidence/ForestPlot";
import CohortDiagram from "@/components/evidence/CohortDiagram";
import CostEffectivenessPlane from "@/components/evidence/CostEffectivenessPlane";

/**
 * Three services, set as entries in an index.
 *
 * The previous arrangement gave each service its own composition, which was
 * the right instinct and the wrong result: three different asymmetric splits
 * left large dead areas inside every row, the figure floating away from the
 * text it belonged to, and no shared edge to read down.
 *
 * This is a single structure repeated three times, and the discipline is what
 * makes it read as a document: a rule across the full measure, the number and
 * the name in the left column, the argument in the middle, the plate on the
 * right. Every row starts on the same three edges, so the eye runs down the
 * page instead of hunting across it.
 *
 * Variation comes from the figures themselves — a forest plot, an attrition
 * diagram and a cost-effectiveness plane are three very different shapes —
 * rather than from moving the furniture around them.
 *
 * Plates drop below `lg` rather than scaling: a forest plot at 390px is
 * illegible, and shipping it as decoration costs bandwidth for no
 * comprehension.
 */
const figures = [
  {
    node: <ForestPlot animate />,
    number: "02",
    title: "Adjusted hazard ratios",
    sub: "95% confidence interval",
  },
  {
    // Capped: this canvas is tall and narrow, so at full column width it would
    // run half again as deep as the other two and break the row rhythm.
    node: <CohortDiagram animate className="max-w-[19rem]" />,
    number: "03",
    title: "Cohort attrition",
    sub: "Source population to analytic cohort",
  },
  {
    node: <CostEffectivenessPlane animate />,
    number: "04",
    title: "Cost-effectiveness plane",
    sub: "Bootstrap replicates vs. threshold",
  },
];

export default function ServiceTeasers() {
  return (
    <section className="border-b border-rule">
      <div className="shell section">
        <Reveal>
          <SectionLabel as="h2" index="02">
            What we do
          </SectionLabel>
        </Reveal>

        <div className="mt-14 lg:mt-20">
          {services.map((service, index) => {
            const figure = figures[index];

            return (
              <div
                key={service.id}
                className="grid items-start gap-x-10 gap-y-8 border-t border-ink/20 pb-16 pt-9 last:pb-0 lg:grid-cols-12 lg:gap-y-0 lg:pb-20 lg:pt-10"
              >
                <Reveal className="lg:col-span-3">
                  <p className="label tabular text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-5 max-w-[11ch] text-[clamp(1.6rem,1.2rem+1.5vw,2.3rem)] leading-[1.08]">
                    {service.name}
                  </h3>
                </Reveal>

                <Reveal delay={100} className="lg:col-span-4 lg:col-start-5">
                  <p className="text-[1.0625rem] leading-[1.6] text-muted">
                    {service.teaser}
                  </p>

                  <ul className="mt-8 flex flex-col gap-2.5 border-t border-rule pt-5">
                    {service.methodology.slice(0, 3).map((method) => (
                      <li key={method} className="label-sm text-faint">
                        {method}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <ArrowLink href={`/services/#${service.id}`}>
                      See this service
                    </ArrowLink>
                  </div>
                </Reveal>

                <Reveal
                  delay={180}
                  className="hidden lg:col-span-4 lg:col-start-9 lg:block"
                >
                  <figure>
                    {figure.node}
                    <figcaption className="mt-6 border-t border-rule pt-4">
                      <p className="label-sm text-ink">
                        Fig. {figure.number} / {figure.title}
                      </p>
                      <p className="label-sm mt-2 text-faint">{figure.sub}</p>
                    </figcaption>
                  </figure>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
