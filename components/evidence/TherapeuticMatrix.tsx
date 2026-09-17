import type { CSSProperties } from "react";
import { therapeuticAreas } from "@/lib/site";
import { topicCounts } from "@/lib/record";

/**
 * Therapeutic areas, as a ranked bar index.
 *
 * Every area now carries a count, taken from data/publications.json at build
 * time. Before, only the four areas whose note happened to start with "N
 * entries" showed a number and the other eight showed a dash, which read as
 * missing data rather than as a smaller record — and the infectious-disease
 * figure had already gone stale when the archive grew.
 *
 * Bars are scaled to the largest area and sorted by it, so the shape of the
 * practice is legible at a glance: one deep specialism, then a spread.
 */

/* The site's area names differ from the archive's topic tags in two places. */
const TOPIC: Record<string, string> = {
  "Psoriasis & PsA": "Psoriasis",
  "Haemophilia A": "Haemophilia",
};

const LEADING_COUNT = /^\d+\s+entries?\s+[—-]\s*/i;

export default function TherapeuticMatrix({ inverted = false }: { inverted?: boolean }) {
  const rows = therapeuticAreas
    .map((item) => ({
      area: item.area,
      detail: item.note.replace(LEADING_COUNT, ""),
      count: topicCounts[TOPIC[item.area] ?? item.area] ?? 0,
    }))
    .sort((a, b) => b.count - a.count);
  const max = Math.max(...rows.map((r) => r.count), 1);

  const ink = inverted ? "text-white" : "text-ink";
  const soft = inverted ? "text-white/60" : "text-muted";
  const track = inverted ? "bg-white/[0.07]" : "bg-sunk";
  const rule = inverted ? "border-white/12" : "border-rule";

  return (
    <div>
      <ol className={`border-t ${rule}`}>
        {rows.map((row, index) => (
          <li
            key={row.area}
            className={`grid items-center gap-x-8 gap-y-2 border-b py-4 ${rule} sm:grid-cols-[14rem_1fr] lg:grid-cols-[15rem_minmax(0,1fr)_minmax(0,1.1fr)]`}
          >
            <span className={`flex items-baseline gap-3 text-[1rem] font-medium ${ink}`}>
              <span className={`label-sm tabular ${inverted ? "text-white/40" : "text-faint"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {row.area}
            </span>

            <span className="flex items-center gap-3">
              <span className={`relative h-2 flex-1 overflow-hidden rounded-full ${track}`}>
                <span
                  className="rule-grow absolute inset-y-0 left-0 rounded-full bg-accent"
                  style={{ width: `${(row.count / max) * 100}%`, "--rule-delay": `${index * 60}ms` } as CSSProperties}
                />
              </span>
              <span className={`w-8 shrink-0 text-right tabular text-small ${ink}`}>{row.count}</span>
            </span>

            <span className={`text-small leading-[1.5] sm:col-span-2 lg:col-span-1 ${soft}`}>
              {row.detail}
            </span>
          </li>
        ))}
      </ol>

      <p className={`measure mt-6 text-small ${soft}`}>
        Bars count entries in our published record below. Our therapeutic
        experience outside the published literature is broader.
      </p>
    </div>
  );
}
