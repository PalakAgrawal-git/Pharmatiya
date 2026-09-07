import { therapeuticAreas } from "@/lib/site";

/**
 * Therapeutic-area index.
 *
 * Set as a single-column index rather than a tiled grid: the areas are a list
 * a reader scans for their own, and a grid forces the eye to track in two
 * directions to do that. One row per area, area name left, evidence right,
 * count set apart in tabular figures where one exists.
 *
 * `note` is descriptive text and is set as such. It was previously rendered
 * in the label style — uppercase, tracked out — which is for apparatus, not
 * sentences: at two columns the long entries ran into the neighbouring
 * column and collided with the next area name.
 *
 * Where the note opens with "N entries", that count is pulled out and set on
 * the right. Every area is backed by entries in data/publications.json, so
 * each claim traces to a citation.
 */
const ENTRIES = /^(\d+)\s+entries?\s+[—-]\s*(.*)$/i;

export default function TherapeuticMatrix({
  inverted = false,
}: {
  inverted?: boolean;
}) {
  return (
    <div>
      <ul className={`border-t ${inverted ? "border-white/20" : "border-rule"}`}>
        {therapeuticAreas.map((item) => {
          const match = item.note.match(ENTRIES);
          const count = match?.[1];
          const detail = match ? match[2] : item.note;

          return (
            <li
              key={item.area}
              className={`grid grid-cols-[1fr_auto] items-baseline gap-x-8 gap-y-1 border-b py-4 transition-colors duration-200 lg:grid-cols-[16rem_1fr_5rem] ${
                inverted
                  ? "border-white/12 hover:bg-white/[0.04]"
                  : "border-rule hover:bg-surface"
              }`}
            >
              <span
                className={`text-[1rem] font-medium ${
                  inverted ? "text-white" : "text-ink"
                }`}
              >
                {item.area}
              </span>

              <span
                className={`col-span-2 text-small leading-[1.5] lg:col-span-1 lg:order-2 ${
                  inverted ? "text-white/55" : "text-muted"
                }`}
              >
                {detail}
              </span>

              <span
                className={`label shrink-0 tabular lg:order-3 lg:text-right ${
                  count
                    ? inverted
                      ? "text-white/70"
                      : "text-accent"
                    : inverted
                      ? "text-white/25"
                      : "text-faint"
                }`}
              >
                {count ?? "—"}
              </span>
            </li>
          );
        })}
      </ul>

      <p
        className={`measure mt-6 text-small ${
          inverted ? "text-white/55" : "text-muted"
        }`}
      >
        Each area is evidenced by entries in our published record below. Our
        therapeutic experience outside the published literature is broader.
      </p>
    </div>
  );
}
