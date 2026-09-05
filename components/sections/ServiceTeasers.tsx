import Link from "next/link";
import { services } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import ForestPlot from "@/components/evidence/ForestPlot";
import CohortDiagram from "@/components/evidence/CohortDiagram";
import CostEffectivenessPlane from "@/components/evidence/CostEffectivenessPlane";

const graphics = [
  {
    node: <ForestPlot animate />,
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
    caption: "Bootstrap replicates against a willingness-to-pay threshold.",
  },
];

/**
 * Three editorial rows on an alternating 65/35 split — deliberately not three
 * identical cards, which the brief rules out and the current site does.
 *
 * Each row deep-links to its own anchor on Services; on the live site all
 * three teasers point at the same page. Graphics are dropped below `lg`
 * rather than scaled: a forest plot at 375px is illegible, and shipping it as
 * decoration costs bandwidth for no comprehension.
 */
export default function ServiceTeasers() {
  return (
    <section className="border-b border-rule">
      <div className="shell py-16 lg:py-24">
        <Reveal>
          <h2 className="mb-14 flex items-center gap-5 font-mono text-caption uppercase tracking-[0.14em] text-faint">
            What we do
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </h2>
        </Reveal>

        <div className="flex flex-col gap-16 lg:gap-24">
          {services.map((service, index) => {
            const graphic = graphics[index];
            const flipped = index % 2 === 1;

            return (
              <div
                key={service.id}
                className={`grid items-center gap-8 lg:gap-16 ${
                  flipped
                    ? "lg:grid-cols-[35fr_65fr]"
                    : "lg:grid-cols-[65fr_35fr]"
                }`}
              >
                <Reveal className={flipped ? "lg:order-2" : "lg:order-1"}>
                  <h3 className="mb-5 max-w-[16ch] text-[clamp(1.6rem,1.2rem+1.8vw,2.6rem)] leading-[1.05] tracking-[-0.02em]">
                    {service.name}
                  </h3>

                  <p className="measure mb-6 text-lede leading-[1.45] text-muted">
                    {service.problem}
                  </p>

                  <ul className="mb-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-rule pt-4">
                    {service.deliverables.slice(0, 3).map((item) => (
                      <li
                        key={item}
                        className="font-mono text-caption text-faint"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/services/#${service.id}`}
                    className="arrow-link font-mono text-small text-accent underline underline-offset-4"
                  >
                    See this service{" "}
                    <span className="arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                </Reveal>

                <Reveal
                  delay={120}
                  className={`hidden lg:block ${
                    flipped ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <figure>
                    {graphic.node}
                    <figcaption className="mt-3 border-l-2 border-rule pl-3.5 text-caption text-faint">
                      <span className="font-mono text-ink">
                        Fig. {graphic.number}
                      </span>{" "}
                      <span className="text-muted">{graphic.caption}</span>{" "}
                      <span className="font-mono uppercase tracking-[0.08em] text-flag">
                        Illustrative
                      </span>
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
