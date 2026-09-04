import { caseStudies } from "@/lib/site";
import { DataLabel } from "@/components/ui/DataLabel";
import Button from "@/components/ui/Button";

const spine = [
  { key: "challenge", label: "Challenge" },
  { key: "dataset", label: "Dataset" },
  { key: "methodology", label: "Methodology" },
  { key: "approach", label: "Approach" },
  { key: "outcome", label: "Outcome" },
] as const;

/**
 * Case studies.
 *
 * Pending client input 2. Where no material has been supplied this section
 * renders an honest statement of confidentiality and a contact route — it is
 * NOT filled with invented cases, and it does not render empty boxes.
 */
export default function CaseStudies() {
  if (caseStudies.length === 0) {
    return (
      <div className="border border-rule bg-surface p-6 sm:p-8">
        <h3 className="mb-3 text-[1.3rem]">
          Our client work is confidential.
        </h3>
        <p className="measure mb-4 text-muted">
          We do not publish client names, and we will not publish an outcome we
          cannot evidence. Anonymised case material — the question, the data,
          the method and what the work enabled — is available under NDA, or we
          can walk you through comparable engagements on a call.
        </p>
        <Button href="/contact/" variant="secondary">
          Ask for anonymised case material
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {caseStudies.map((study, index) => (
        <article key={study.id} className="border border-rule bg-surface p-6 sm:p-8">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3 border-b border-rule pb-4">
            <DataLabel as="h3" className="text-ink">
              Case {String(index + 1).padStart(2, "0")}
            </DataLabel>
            <p className="font-mono text-caption text-faint">{study.area}</p>
          </div>

          <dl className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {spine.map((row) => (
              <div key={row.key}>
                <dt className="mb-1 font-mono text-caption uppercase tracking-[0.1em] text-faint">
                  {row.label}
                </dt>
                <dd className="text-small text-muted">{study[row.key]}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}
