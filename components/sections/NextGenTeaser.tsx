import { site } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowLink from "@/components/ui/ArrowLink";

const stages = [
  { n: "01", name: "Feasibility" },
  { n: "02", name: "Retrospective" },
  { n: "03", name: "Pragmatic outreach" },
];

/**
 * The one dark section on the homepage.
 *
 * Used once, so the inversion still means something when it arrives. Nothing
 * about it is futuristic: no gradient, no glow, no circuitry. A buyer in a
 * regulated environment reads AI claims adversarially, and the design has to
 * agree with the copy that this is a supervised instrument, not an autonomous
 * one — so it gets the quietest treatment on the site, not the loudest.
 *
 * The workflow is three numbers on three rules. The human-review line sits
 * beneath all of them, spanning the full measure, because review is a stage
 * of the workflow rather than a caveat under it.
 */
export default function NextGenTeaser() {
  return (
    <section className="bg-inverse text-white">
      <div className="shell section">
        <Reveal>
          <SectionLabel as="h2" index="04" tone="dark">
            {site.productName}
          </SectionLabel>
        </Reveal>

        <div className="mt-20 grid gap-x-16 gap-y-16 lg:mt-28 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h3 className="text-[clamp(2rem,1.3rem+2.8vw,3.6rem)] leading-[1.06] text-white">
              AI-assisted evidence.
              <br />
              {/* On the dark ground the emphasis takes the amber pole, the
                  counterweight to the indigo the hero uses. Same device,
                  opposite side of the axis. */}
              <span className="text-signal-on-dark">
                Human-reviewed conclusions.
              </span>
            </h3>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <p className="text-small leading-[1.7] text-white/60">
              Synopses drafted in hours and reviewed by the researchers who
              would otherwise have written them. The model drafts; a person
              signs.
            </p>
            <div className="mt-8">
              <ArrowLink href="/nextgen-ai/" tone="dark">
                Explore {site.productName}
              </ArrowLink>
            </div>
          </Reveal>
        </div>

        <ol className="mt-24 grid gap-x-16 gap-y-10 lg:mt-32 lg:grid-cols-3">
          {stages.map((stage, index) => (
            <Reveal
              as="li"
              key={stage.name}
              delay={index * 110}
              className="border-t border-white/20 pt-6"
            >
              <span className="label tabular text-white/40">{stage.n}</span>
              <h4 className="mt-5 text-[1.35rem] font-normal leading-tight text-white">
                {stage.name}
              </h4>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={360}>
          <p className="mt-16 border-t border-white/20 pt-6 text-[clamp(1.05rem,0.9rem+0.5vw,1.35rem)] leading-[1.5] text-white/85">
            <span className="label mb-4 block text-white/40">Human review</span>
            Required at every stage, before any output leaves the system.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
