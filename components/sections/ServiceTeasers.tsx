import { services } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";
import ForestPlot from "@/components/evidence/ForestPlot";
import CohortDiagram from "@/components/evidence/CohortDiagram";
import CostEffectivenessPlane from "@/components/evidence/CostEffectivenessPlane";

/**
 * Three services, three different compositions.
 *
 * This is the section that most made the page read as a template, because
 * three identical rows are three cards however they are styled. Each now has
 * its own arrangement:
 *
 *   01  text 5 / figure 6, the number oversized behind the heading
 *   02  figure 6 first / text 5, the mirror
 *   03  heading 4 wide, body and figure sharing 7, a third structure
 *
 * The figures are the identity, so they are given real width and hung on a
 * rule with a figure number — a journal plate, not a widget. They drop below
 * `lg` rather than scaling: a forest plot at 390px is illegible, and shipping
 * it as decoration costs bandwidth for no comprehension.
 */
const figures = [
  {
    node: <ForestPlot animate />,
    number: "02",
    title: "Adjusted hazard ratios",
    sub: "95% confidence interval",
  },
  {
    node: <CohortDiagram animate className="mx-auto max-w-[17rem]" />,
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

function Plate({ index }: { index: number }) {
  const f = figures[index];
  return (
    <figure>
      {f.node}
      <figcaption className="mt-6 border-t border-rule pt-4">
        <p className="label-sm text-ink">
          Fig. {f.number} / {f.title}
        </p>
        <p className="label-sm mt-2 text-faint">{f.sub}</p>
      </figcaption>
    </figure>
  );
}

export default function ServiceTeasers() {
  const [a, b, c] = services;

  return (
    <section className="border-b border-rule">
      <div className="shell section">
        <Reveal>
          <SectionLabel as="h2" index="02">
            What we do
          </SectionLabel>
        </Reveal>

        {/* 01 — text left, figure right, numeral set large behind the head. */}
        <div className="mt-20 grid gap-x-16 gap-y-12 lg:mt-28 lg:grid-cols-12">
          <Reveal className="relative lg:col-span-5">
            <span aria-hidden="true" className="ghost absolute -left-2 -top-16 hidden lg:block">
              01
            </span>
            <h3 className="relative text-[clamp(1.9rem,1.3rem+2.2vw,3rem)] leading-[1.05]">
              {a.name}
            </h3>
            <p className="mt-8 text-lede leading-[1.55] text-muted">{a.teaser}</p>
            <ul className="mt-8 flex flex-col gap-2 border-t border-rule pt-5">
              {a.methodology.slice(0, 3).map((m) => (
                <li key={m} className="label-sm text-faint">
                  {m}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <ArrowLink href={`/services/#${a.id}`}>See this service</ArrowLink>
            </div>
          </Reveal>
          <Reveal delay={120} className="hidden lg:col-span-6 lg:col-start-7 lg:block">
            <Plate index={0} />
          </Reveal>
        </div>

        {/* 02 — mirrored: the figure leads. */}
        <div className="mt-28 grid gap-x-16 gap-y-12 lg:mt-40 lg:grid-cols-12">
          <Reveal className="hidden lg:col-span-6 lg:block">
            <Plate index={1} />
          </Reveal>
          <Reveal delay={120} className="relative lg:col-span-5 lg:col-start-8">
            <span aria-hidden="true" className="ghost absolute -left-2 -top-16 hidden lg:block">
              02
            </span>
            <h3 className="relative max-w-[12ch] text-[clamp(1.9rem,1.3rem+2.2vw,3rem)] leading-[1.05]">
              {b.name}
            </h3>
            <p className="mt-8 text-lede leading-[1.55] text-muted">{b.teaser}</p>
            <ul className="mt-8 flex flex-col gap-2 border-t border-rule pt-5">
              {b.methodology.slice(0, 3).map((m) => (
                <li key={m} className="label-sm text-faint">
                  {m}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <ArrowLink href={`/services/#${b.id}`}>See this service</ArrowLink>
            </div>
          </Reveal>
        </div>

        {/* 03 — a third structure: heading alone in four, body and figure
            sharing the remaining seven. */}
        <div className="mt-28 grid gap-x-16 gap-y-12 lg:mt-40 lg:grid-cols-12">
          <Reveal className="relative lg:col-span-4">
            <span aria-hidden="true" className="ghost absolute -left-2 -top-16 hidden lg:block">
              03
            </span>
            <h3 className="relative max-w-[10ch] text-[clamp(1.9rem,1.3rem+2.2vw,3rem)] leading-[1.05]">
              {c.name}
            </h3>
          </Reveal>
          <Reveal delay={100} className="lg:col-span-3 lg:col-start-6">
            <p className="text-lede leading-[1.55] text-muted">{c.teaser}</p>
            <ul className="mt-8 flex flex-col gap-2 border-t border-rule pt-5">
              {c.methodology.slice(0, 3).map((m) => (
                <li key={m} className="label-sm text-faint">
                  {m}
                </li>
              ))}
            </ul>
            <div className="mt-9">
              <ArrowLink href={`/services/#${c.id}`}>See this service</ArrowLink>
            </div>
          </Reveal>
          <Reveal delay={180} className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <Plate index={2} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
