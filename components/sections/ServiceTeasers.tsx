import Link from "next/link";
import { services } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import ForestPlot from "@/components/evidence/ForestPlot";
import CohortDiagram from "@/components/evidence/CohortDiagram";
import CostEffectivenessPlane from "@/components/evidence/CostEffectivenessPlane";

const graphics = [
  {
    node: <ForestPlot animate />,
    number: "02",
    caption: "Subgroup hazard ratios with 95% confidence intervals.",
  },
  {
    node: <CohortDiagram animate className="mx-auto max-w-[15rem]" />,
    number: "03",
    caption: "Attrition from source population to analytic cohort.",
  },
  {
    node: <CostEffectivenessPlane animate />,
    number: "04",
    caption: "Bootstrap replicates against a willingness-to-pay threshold.",
  },
];

/**
 * Three chapters, each opened by its own number.
 *
 * The row alternates 7/5 and 5/7 across the twelve-column grid, so the eye
 * crosses the page rather than running down a single edge. The service number
 * is set large in the margin as a chapter mark — the one piece of publication
 * apparatus doing structural work here, since these are sequential and a
 * visitor needs to know there are three.
 *
 * Each row leads on `teaser`, not `problem`: the Services page opens every one
 * of its sections with `problem` set large, and printing the same sentences
 * here made the two pages read as one page twice.
 *
 * Graphics are dropped below `lg` rather than scaled — a forest plot at 375px
 * is illegible, and shipping it as decoration costs bandwidth for no
 * comprehension.
 */
export default function ServiceTeasers() {
  return (
    <section className="border-b border-rule">
      <div className="shell section">
        <Reveal>
          <h2 className="label flex items-center gap-5 text-faint">
            What we do
            <span aria-hidden="true" className="rule-grow h-px flex-1 bg-rule" />
          </h2>
        </Reveal>

        <div className="mt-16 flex flex-col gap-24 lg:mt-24 lg:gap-36">
          {services.map((service, index) => {
            const graphic = graphics[index];
            const flipped = index % 2 === 1;

            return (
              <div
                key={service.id}
                className="grid items-center gap-x-16 gap-y-10 lg:grid-cols-12"
              >
                <Reveal
                  className={
                    flipped
                      ? "lg:order-2 lg:col-span-6 lg:col-start-7"
                      : "lg:order-1 lg:col-span-6"
                  }
                >
                  <p className="label text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <h3 className="mt-4 max-w-[14ch] text-[clamp(1.75rem,1.3rem+1.9vw,2.75rem)] font-medium leading-[1.06]">
                    {service.name}
                  </h3>

                  <p className="measure mt-6 text-lede leading-[1.5] text-muted">
                    {service.teaser}
                  </p>

                  <Link
                    href={`/services/#${service.id}`}
                    className="arrow-link mt-8 inline-block text-small text-ink underline decoration-rule-firm underline-offset-[6px] transition-colors hover:decoration-accent"
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
                    flipped
                      ? "lg:order-1 lg:col-span-5 lg:col-start-1"
                      : "lg:order-2 lg:col-span-5 lg:col-start-8"
                  }`}
                >
                  <figure>
                    {graphic.node}
                    <figcaption className="mt-5 border-t border-rule pt-3">
                      <span className="label text-ink">Fig. {graphic.number}</span>
                      <p className="mt-1.5 text-caption leading-relaxed text-muted">
                        {graphic.caption}
                      </p>
                      <p className="label mt-2 text-[0.7rem] text-faint">
                        Illustrative data
                      </p>
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
