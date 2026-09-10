import { datasetCoverage, namedSources } from "@/lib/site";
import { DataLabel } from "@/components/ui/DataLabel";
import Slot from "@/components/ui/Slot";

/**
 * Dataset coverage.
 *
 * Dataset TYPES always display. Named organisations display only where
 * `cleared` is true in lib/site.ts — pending client input 4, which decides
 * whether they may be named publicly. Nothing here is inferred.
 */
export default function DatasetMap({ compact = false }: { compact?: boolean }) {
  const cleared = namedSources.filter((source) => source.cleared);

  return (
    <div>
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

      {!compact && (
        <div className="mt-8 border-t border-rule pt-5">
          <DataLabel className="mb-2">Named sources</DataLabel>
          {cleared.length > 0 ? (
            <p className="measure text-small text-muted">
              {cleared.map((source) => source.name).join(" · ")}
            </p>
          ) : (
            <>
              <p className="measure text-small text-muted">
                We hold direct experience with named payer, PBM and provider
                organisations. Naming them publicly is subject to client
                clearance.
              </p>
              <Slot id={2} blocking className="mt-5">
                Which of the payer, PBM and provider organisations in the
                record may be named on a public page. Every entry in
                <code> namedSources </code> is currently held back. Confirm
                per organisation, or confirm that none may be named and this
                statement stands as the final copy.
              </Slot>
            </>
          )}
        </div>
      )}
    </div>
  );
}
