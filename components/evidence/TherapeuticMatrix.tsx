import { therapeuticAreas } from "@/lib/site";
import { Pending } from "@/components/ui/DataLabel";

/**
 * Therapeutic-area grid. Only areas corroborated on the current About page
 * appear. The list is deliberately short — additions require client
 * confirmation rather than inference.
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
        Corroborated engagements. Full therapeutic coverage{" "}
        <Pending>Pharmatiya to confirm</Pending>
      </p>
    </div>
  );
}
