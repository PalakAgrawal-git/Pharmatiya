import { therapeuticAreas } from "@/lib/site";

/**
 * Therapeutic-area grid. Every area is backed by entries in
 * data/publications.json, so each claim traces to a citation.
 */
export default function TherapeuticMatrix() {
  return (
    <div>
      <ul className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-3">
        {therapeuticAreas.map((item) => (
          <li key={item.area} className="bg-surface p-4">
            <p className="font-display text-[1.05rem] font-semibold text-ink">
              {item.area}
            </p>
            <p className="mt-1 font-mono text-caption text-faint">{item.note}</p>
          </li>
        ))}
      </ul>

      <p className="measure mt-4 text-small text-muted">
        Each area is evidenced by entries in our published record below. Our
        therapeutic experience outside the published literature is broader.
      </p>
    </div>
  );
}
