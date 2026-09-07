import type { CSSProperties } from "react";
import Reveal from "@/components/motion/Reveal";

type Stage = { label: string; detail: string };

/**
 * How an engagement runs, stage by stage.
 *
 * This exists to stop Services being the homepage again: the homepage shows
 * what an engagement produces, and Services was showing two of the same three
 * figures renumbered. Results belong on Home and Evidence; this page is the
 * only one that answers "what actually happens if we hire you", and that is a
 * process, not a result.
 *
 * Four numbers on four rules. Numbering is information here — the stages are
 * sequential and each gates the next — which is the case where a numeral
 * earns its place. No boxes: the rule and the number carry the structure, and
 * the last stage takes a hollow marker, the endpoint convention the About
 * timeline uses.
 */
export default function ServiceProcess({ stages }: { stages: readonly Stage[] }) {
  return (
    <Reveal as="ol" className="grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {stages.map((stage, index) => (
        <li
          key={stage.label}
          className="fall-in border-t border-rule-firm pt-6"
          style={{ "--fall-delay": `${index * 110}ms` } as CSSProperties}
        >
          <span className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={`h-[6px] w-[6px] rounded-full ${
                index === stages.length - 1
                  ? "border border-accent bg-transparent"
                  : "bg-accent"
              }`}
            />
            <span className="label tabular text-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
          </span>

          <h4 className="mt-6 text-[1.2rem] font-normal leading-tight">
            {stage.label}
          </h4>

          <p className="mt-4 text-small leading-[1.65] text-muted">
            {stage.detail}
          </p>
        </li>
      ))}
    </Reveal>
  );
}
