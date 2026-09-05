import { site } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel, Pending } from "@/components/ui/DataLabel";
import Button from "@/components/ui/Button";
import WorkflowDiagram from "@/components/sections/WorkflowDiagram";
import StudyFinder from "@/components/sections/StudyFinder";
import Reveal from "@/components/motion/Reveal";
import GraphGround from "@/components/layout/GraphGround";

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
      <section className="relative overflow-hidden border-b border-rule">
        <GraphGround />
        <div className="shell relative grid gap-10 py-16 lg:grid-cols-[6fr_4fr] lg:gap-16 lg:py-24">
          <Reveal>
            <SectionHeader
              as="h1"
              eyebrow={site.productName}
              title="Evidence synopses drafted in hours, reviewed by the researchers who would have written them."
            />
            <p className="measure mt-6 text-muted">
              <Pending>Precise product definition to be confirmed</Pending>
            </p>

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

          {/* No product mockup is invented. The position holds until a real
              screenshot arrives. */}
          <Reveal
            delay={140}
            className="flex min-h-[14rem] flex-col items-center justify-center gap-2 border border-dashed border-rule-firm bg-surface p-6 text-center"
          >
            <DataLabel>Product interface</DataLabel>
            <p className="text-caption text-faint">
              Screenshot pending. No mockup will be invented in its place.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The keyword study search from the current homepage, rebuilt and
          working. It sits directly under the hero because it is the clearest
          demonstration of what the product does — a visitor can try it
          before reading anything. */}
      <section className="border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DataLabel as="h2" className="mb-3 flex items-center gap-4">
              Try it — search prior work
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-rule" />
            </DataLabel>
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
        <div className="shell py-14 lg:py-20">
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
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DataLabel as="h2" className="mb-8 flex items-center gap-4">
              Where AI is used — and where it is not
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-rule" />
            </DataLabel>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            <Reveal className="lift border border-rule bg-surface p-5">
              <h3 className="mb-3 font-mono text-caption uppercase tracking-[0.1em] text-ink">
                The model does
              </h3>
              <ul className="flex flex-col gap-2">
                {division.model.map((item) => (
                  <li key={item} className="text-small text-muted">
                    {item}
                  </li>
                ))}
                <li className="text-small">
                  <Pending>Further detail to confirm</Pending>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={120} className="lift border border-rule bg-surface p-5">
              <h3 className="mb-3 font-mono text-caption uppercase tracking-[0.1em] text-ink">
                A researcher does
              </h3>
              <ul className="flex flex-col gap-2">
                {division.researcher.map((item) => (
                  <li key={item} className="text-small text-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <p className="measure mt-5 text-small text-faint">
              The right-hand column is longer than the left, and that is the
              point.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Trust is designed as page structure, not fine print — a buyer in a
          regulated environment reads AI claims adversarially. */}
      <section className="border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DataLabel as="h2" className="mb-8 flex items-center gap-4">
              Trust
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-rule" />
            </DataLabel>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {trust.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 110}
                className="lift border border-rule bg-surface p-5"
              >
                <h3 className="mb-2 font-mono text-caption uppercase tracking-[0.1em] text-ink">
                  {item.title}
                </h3>
                <p className="text-small text-muted">{item.body}</p>
                {item.pending && (
                  <p className="mt-3">
                    <Pending>{item.pending}</Pending>
                  </p>
                )}
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 border-t border-rule pt-6">
            <DataLabel as="h3" className="mb-2">
              Limitations
            </DataLabel>
            <p className="measure text-small text-muted">
              What the tool does not do.{" "}
              <Pending>Pharmatiya to provide</Pending> Stating limits plainly
              is a trust asset with this audience, not a weakness.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="shell py-12 lg:py-16">
          <Reveal className="lift border border-rule bg-surface p-6 sm:p-8">
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
