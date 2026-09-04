import { site } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel, Pending } from "@/components/ui/DataLabel";
import Button from "@/components/ui/Button";
import WorkflowDiagram from "@/components/sections/WorkflowDiagram";

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
        <div className="shell grid gap-10 py-14 lg:grid-cols-[6fr_4fr] lg:gap-16 lg:py-20">
          <div>
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
                className="font-mono text-small text-accent underline underline-offset-4"
              >
                Already a user? Open {site.productLegacyName} →
              </a>
            </div>
          </div>

          {/* No product mockup is invented. The position holds until a real
              screenshot arrives. */}
          <div className="flex min-h-[14rem] flex-col items-center justify-center gap-2 border border-dashed border-rule-firm bg-surface p-6 text-center">
            <DataLabel>Product interface</DataLabel>
            <p className="text-caption text-faint">
              Screenshot pending. No mockup will be invented in its place.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            How it works
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>
          <WorkflowDiagram />
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Where AI is used — and where it is not
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border border-rule bg-surface p-5">
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
            </div>

            <div className="border border-rule bg-surface p-5">
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
            </div>
          </div>

          <p className="measure mt-5 text-small text-faint">
            The right-hand column is longer than the left, and that is the
            point.
          </p>
        </div>
      </section>

      {/* Trust is designed as page structure, not fine print — a buyer in a
          regulated environment reads AI claims adversarially. */}
      <section className="border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Trust
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>

          <div className="grid gap-5 lg:grid-cols-3">
            {trust.map((item) => (
              <div
                key={item.title}
                className="border border-rule bg-surface p-5"
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
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-rule pt-6">
            <DataLabel as="h3" className="mb-2">
              Limitations
            </DataLabel>
            <p className="measure text-small text-muted">
              What the tool does not do.{" "}
              <Pending>Pharmatiya to provide</Pending> Stating limits plainly
              is a trust asset with this audience, not a weakness.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="shell py-12 lg:py-16">
          <div className="border border-rule bg-surface p-6 sm:p-8">
            <h2 className="mb-2 text-[1.4rem]">Request a demo</h2>
            <p className="measure mb-5 text-muted">
              A 30-minute walkthrough with the team that built it — including
              what it does not do.
            </p>
            <Button href="/contact/#demo">Request a demo</Button>
          </div>
        </div>
      </section>
    </>
  );
}
