import { therapeuticAreas } from "@/lib/site";

/**
 * Therapeutic-area grid. Every area is backed by entries in
 * data/publications.json, so each claim traces to a citation.
 *
 * The grid is drawn as hairline gaps over a rule-coloured ground rather than
 * as bordered cards, so it reads as one table. `inverted` mirrors that
 * construction for the dark ground on the Evidence page — the same figure,
 * not a second component.
 */
export default function TherapeuticMatrix({
  inverted = false,
}: {
  inverted?: boolean;
}) {
  return (
    <div>
      <ul
        className={`grid gap-px border sm:grid-cols-2 lg:grid-cols-3 ${
          inverted
            ? "border-white/20 bg-white/20"
            : "border-rule bg-rule"
        }`}
      >
        {therapeuticAreas.map((item) => (
          <li
            key={item.area}
            className={`p-4 ${
              inverted ? "lift-inverse bg-inverse" : "lift bg-surface"
            }`}
          >
            <p
              className={`font-display text-[1.05rem] font-semibold ${
                inverted ? "text-white" : "text-ink"
              }`}
            >
              {item.area}
            </p>
            <p
              className={`mt-1 font-mono text-caption ${
                inverted ? "text-white/50" : "text-faint"
              }`}
            >
              {item.note}
            </p>
          </li>
        ))}
      </ul>

      <p
        className={`measure mt-4 text-small ${
          inverted ? "text-white/60" : "text-muted"
        }`}
      >
        Each area is evidenced by entries in our published record below. Our
        therapeutic experience outside the published literature is broader.
      </p>
    </div>
  );
}
