import { site } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel, Pending } from "@/components/ui/DataLabel";
import Button from "@/components/ui/Button";
import WorkflowDiagram from "@/components/sections/WorkflowDiagram";
import StudyFinder from "@/components/sections/StudyFinder";
import Reveal from "@/components/motion/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata = {
  title: `${site.productName}`,
  description:
    "AI-assisted evidence synopses with mandatory human expert review. Feasibility, retrospective and pragmatic outreach — no PHI uploaded, and the underlying model disclosed.",
  alternates: { canonical: "/nextgen-ai/" },
};

const division = {
  model: [
    "Drafts synopsis structure",
    "Summarises literature",
    "Proposes cohort definitions",
  ],
  researcher: [
    "Approves the study question",
    "Validates every method choice",
    "Signs off all output before it leaves",
    "Retains professional responsibility",
  ],
};

const trust = [
  {
    title: "No PHI uploaded",
    body: "Protected health information is not uploaded to the system.",
    pending: "Exact data handling to be confirmed",
  },
  {
    title: "Human review mandatory",
    body: "No output reaches a client without expert sign-off. Review is a stage in the workflow, not a check at the end.",
    pending: null,
  },
  {
    title: "Model disclosed",
    body: "We name the underlying model and its version, and we say when it changes.",
    pending: "Model and version to be specified",
  },
];

export default function NextGenPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="shell section">
          <Reveal>
            <SectionHeader
              as="h1"
              display
              eyebrow={site.productName}
              index="Human-reviewed"
              title="Evidence synopses drafted in hours, reviewed by the researchers who would have written them."
            />
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href="/contact/#demo">Request a demo</Button>
              <a
                href={site.appUrl}
                className="arrow-link font-mono text-small text-accent underline underline-offset-4"
              >
                Already a user? Open {site.productLegacyName}{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </Reveal>

          {/* The product interface goes here once a real screenshot exists
              (client input 5). Nothing stands in for it: an empty panel
              announcing a missing asset is worse than a hero that simply runs
              to one column, and inventing a dashboard would be worse still. */}
        </div>
      </section>

      {/* The keyword study search from the current homepage, rebuilt and
          working. It sits directly under the hero because it is the clearest
          demonstration of what the product does — a visitor can try it
          before reading anything. */}
      <section className="border-b border-rule bg-sunk">
        <div className="shell section">
          <Reveal>
            <SectionLabel as="h2" index="01">
              Try it — search prior work
            </SectionLabel>
            <p className="measure mb-6 text-muted">
              Feasibility starts with a question most teams cannot answer
              quickly: has this been looked at before, in which data? Type a
              condition, a data type or a method.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <StudyFinder />
          </Reveal>
        </div>
      </section>

      {/* Inverted, as the workflow is on the homepage teaser. The diagram is
          the same figure in both places, so it should not change ground
          between them — and this page needed a tonal break of its own. */}
      <section className="bg-inverse text-white">
        <div className="shell section">
          <Reveal>
            <h2 className="mb-8 flex items-center gap-4 font-mono text-caption font-normal uppercase tracking-[0.14em] text-white/45">
              How it works
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-white/15" />
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <WorkflowDiagram inverted />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell section">
          <Reveal>
            <SectionLabel as="h2" index="03">
              Where AI is used — and where it is not
            </SectionLabel>
          </Reveal>

          {/* Deliberately unequal. The researcher column is wider, set on the
              accent rule and listed in heavier type, because the asymmetry is
              the argument: the model drafts, a person is accountable. Two
              matched cards would have said the opposite. */}
          <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
            <Reveal className="border-t border-rule pt-5 lg:col-span-4">
              <h3 className="label text-faint">The model does</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {division.model.map((item) => (
                  <li key={item} className="text-small text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={120} className="border-t-2 border-accent pt-5 lg:col-span-7 lg:col-start-6">
              <h3 className="label text-accent">A researcher does</h3>
              <ul className="mt-5 flex flex-col gap-3">
                {division.researcher.map((item) => (
                  <li key={item} className="text-[1.05rem] leading-[1.5] text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <p className="measure mt-12 text-small text-faint">
              The right-hand column is longer than the left, and that is the
              point.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Trust is designed as page structure, not fine print — a buyer in a
          regulated environment reads AI claims adversarially. */}
      <section className="border-b border-rule bg-sunk">
        <div className="shell section">
          <Reveal>
            <SectionLabel as="h2" index="04">
              Trust
            </SectionLabel>
          </Reveal>

          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {trust.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 110}
                className="border-t border-rule-firm pt-5"
              >
                <p className="label tabular text-faint">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 text-[1.05rem] font-medium leading-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-small leading-[1.5] text-muted">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>


        </div>
      </section>

      <section className="border-t border-rule">
        <div className="shell section-tight">
          <Reveal className="border-t border-rule pt-10">
            <h2 className="mb-2 text-[1.4rem]">Request a demo</h2>
            <p className="measure mb-5 text-muted">
              A 30-minute walkthrough with the team that built it — including
              what it does not do.
            </p>
            <Button href="/contact/#demo">Request a demo</Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
