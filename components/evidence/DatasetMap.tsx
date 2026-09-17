import { datasetCoverage, namedSources } from "@/lib/site";
import { DataLabel } from "@/components/ui/DataLabel";

/**
 * Dataset coverage.
 *
 * Dataset TYPES always display. Named organisations display only where
 * `cleared` is true in lib/site.ts, which decides whether they may be named
 * publicly. Nothing here is inferred.
 *
 * Two forms: `compact` is the plain ruled list the About page uses; the full
 * form is a set of cards for the Evidence page, where coverage is one of the
 * first things a buyer checks and deserves more than three thin columns.
 */

const BLURB: Record<string, string> = {
  Payer: "Enrolment, benefits and what the plan paid for.",
  Provider: "What happened clinically, inside the health system.",
  "Claims & pharmacy": "What was dispensed, billed and tested.",
};

export default function DatasetMap({ compact = false }: { compact?: boolean }) {
  const cleared = namedSources.filter((source) => source.cleared);

  if (compact) {
    return (
      <div className="grid gap-6 sm:grid-cols-3">
        {datasetCoverage.map((group) => (
          <div key={group.group} className="border-t border-rule-firm pt-4">
            <DataLabel as="h3" className="mb-3 text-ink">
              {group.group}
            </DataLabel>
            <ul className="flex flex-col gap-1.5">
              {group.types.map((type) => (
                <li key={type} className="text-small text-muted">
                  {type}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {datasetCoverage.map((group, index) => (
          <div
            key={group.group}
            className="lift flex flex-col rounded-[10px] border border-rule-firm bg-surface/40 p-6"
          >
            <span className="label tabular text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-[1.35rem] font-normal leading-tight">{group.group}</h3>
            <p className="mt-2 text-small leading-[1.55] text-muted">
              {BLURB[group.group] ?? ""}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2 border-t border-rule pt-5">
              {group.types.map((type) => (
                <li
                  key={type}
                  className="rounded-full border border-rule-firm px-3 py-1 text-caption text-ink"
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-2 rounded-[10px] border border-dashed border-rule-firm px-6 py-5 sm:flex-row sm:items-baseline sm:gap-8">
        <DataLabel className="shrink-0">Named sources</DataLabel>
        <p className="text-small leading-[1.6] text-muted">
          {cleared.length > 0
            ? cleared.map((source) => source.name).join(" · ")
            : "We hold direct experience with named payer, PBM and provider organisations. Naming them publicly is subject to client clearance."}
        </p>
      </div>
    </div>
  );
}
