import type { CSSProperties } from "react";
import Reveal from "@/components/motion/Reveal";

type Stage = { label: string; detail: string };

/**
 * How an engagement runs, stage by stage.
 *
 * This exists to stop Services being the homepage again. The homepage shows
 * what an engagement produces — forest plot, cohort attrition, cost-
 * effectiveness — and Services was showing two of those same three figures
 * renumbered, so a visitor who clicked through was shown the same charts a
 * second time. Results belong on Home and Evidence; this page is the only one
 * that answers "what actually happens if we hire you", and that is a process,
 * not a result.
 *
 * The visual language is deliberately different from the other diagrams on
 * the site: no axes and no data, because there is none here to plot. A rail
 * with numbered gates, read left to right on desktop and top to bottom on
 * mobile — closer to a project plan than to a figure.
 *
 * Numbering is real information: these stages are sequential and each gates
 * the next, which is the case where numbered markers earn their place.
 */
export default function ServiceProcess({ stages }: { stages: readonly Stage[] }) {
  return (
    <Reveal as="ol" className="grid gap-px bg-rule sm:grid-cols-2 lg:grid-cols-4">
      {stages.map((stage, index) => (
        <li
          key={stage.label}
          className="fall-in relative bg-paper p-5"
          style={{ "--fall-delay": `${index * 110}ms` } as CSSProperties}
        >
          {/* The gate marker. Filled for every stage but the last, which is
              hollow — the same convention the timeline uses for an endpoint
              rather than a step. */}
          <span aria-hidden="true" className="mb-4 flex items-center gap-2">
            <span
              className={`size-2.5 shrink-0 ${
                index === stages.length - 1
                  ? "border border-accent bg-paper"
                  : "bg-accent"
              }`}
            />
            <span className="h-px flex-1 bg-rule" />
          </span>

          <p className="font-mono text-caption text-faint">
            {String(index + 1).padStart(2, "0")}
          </p>

          <h4 className="mt-1 font-display text-[1.15rem] font-semibold leading-tight">
            {stage.label}
          </h4>

          <p className="mt-2.5 text-small leading-[1.5] text-muted">
            {stage.detail}
          </p>
        </li>
      ))}
    </Reveal>
  );
}
