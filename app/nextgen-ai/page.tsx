import { site } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import ArrowLink from "@/components/ui/ArrowLink";
import WorkflowDiagram from "@/components/sections/WorkflowDiagram";
import AskFlow from "@/components/sections/AskFlow";
import StudyFinder from "@/components/sections/StudyFinder";
import SynopsisBuilder from "@/components/sections/SynopsisBuilder";
import Reveal from "@/components/motion/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";

export const metadata = {
  title: `${site.productName}`,
  description:
    "Build an HEOR or RWE study synopsis from a plain-language problem statement — feasibility, retrospective study and pragmatic outreach — with mandatory expert review and no patient data.",
  alternates: { canonical: "/nextgen-ai/" },
};

/* What the product does, in the terms the live product uses for its own
   three steps. Nothing here goes beyond what it demonstrably produces. */
const division = {
  model: [
    "Structures a plain-language problem into a synopsis",
    "Drafts cohort logic and claims / EHR code families",
    "Proposes objectives, endpoints, cost and statistical plans",
    "Outlines the outreach workflow and dashboards",
  ],
  researcher: [
    "Approves the study question",
    "Validates every method choice",
    "Confirms code lists and sample sizes against the data",
    "Signs off all output before it leaves",
    "Retains professional responsibility",
  ],
};

/* Set at build time. When a model-backed service is connected the page says
   so; until then it describes what actually happens, which is that the draft
   is built in the visitor's browser. See lib/synopsis.ts. */
const serviceConnected = Boolean(process.env.NEXT_PUBLIC_SYNOPSIS_API);

const trust = [
  {
    title: "No patient data",
    body: "The builder needs the question, not the patient. A statement that contains an identifier is refused before anything is drafted.",
  },
  {
    title: "Human review, every time",
    body: "No synopsis reaches a client without expert sign-off. Review is a stage in the workflow, not a check at the end.",
  },
  {
    title: "Where your question goes",
    body: serviceConnected
      ? "Your problem statement is sent to Pharmatiya's own drafting service, which uses a language model to produce the synopsis. Nothing is published."
      : "On this site the synopsis is drafted in your browser. Your problem statement is not sent anywhere or stored.",
  },
  {
    title: "What it does not do",
    body: "It does not decide whether a study is feasible, fix final code lists or sample sizes, or write the protocol. It drafts the structure; a researcher decides.",
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
              lede="Describe the problem in a sentence. The builder structures it into a payer-, provider- and pharma-ready synopsis in our three-step framework — then a researcher reviews it."
            />
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Button href="#builder" arrow={false}>
                Build a synopsis ↓
              </Button>
              <ArrowLink href="/contact/#demo">Request a demo</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The product, on the page. It was a link to app.pharmatiya.net, which
          stops resolving when the domain moves here. */}
      <section id="builder" className="scroll-mt-24 border-b border-rule bg-sunk">
        <div className="shell section">
          <Reveal>
            <SectionLabel as="h2" index="01" className="mb-8">
              Build a synopsis
            </SectionLabel>
          </Reveal>
          <SynopsisBuilder />
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell section">
          <Reveal>
            <SectionLabel as="h2" index="02">
              Search prior work
            </SectionLabel>
            <p className="measure mb-6 mt-6 text-muted">
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
          between them. */}
      <section className="bg-inverse text-white">
        <div className="shell section">
          <Reveal>
            <h2 className="mb-8 flex items-center gap-4 font-mono text-caption font-normal uppercase tracking-[0.14em] text-white/45">
              How it works
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-white/15" />
            </h2>
          </Reveal>
          <AskFlow />

          <Reveal className="mt-16 border-t border-white/15 pt-10">
            <p className="label mb-8 text-white/45">The framework</p>
            <WorkflowDiagram inverted />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell section">
          <Reveal>
            <SectionLabel as="h2" index="03" className="mb-8">
              Where AI is used — and where it is not
            </SectionLabel>
          </Reveal>

          {/* Deliberately unequal. The researcher column is wider, set on the
              accent rule and listed in heavier type, because the asymmetry is
              the argument: the model drafts, a person is accountable. */}
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
            <SectionLabel as="h2" index="04" className="mb-8">
              Trust
            </SectionLabel>
          </Reveal>

          <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
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
                <p className="mt-3 text-small leading-[1.55] text-muted">
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
              Thirty minutes with the team that built it — including what it
              does not do.
            </p>
            <Button href="/contact/#demo">Request a demo</Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
