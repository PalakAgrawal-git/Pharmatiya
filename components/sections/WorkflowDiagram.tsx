const steps = [
  {
    n: "01",
    name: "Feasibility",
    question: "Can this question be answered with the data available?",
  },
  {
    n: "02",
    name: "Retrospective",
    question: "What does existing data already show?",
  },
  {
    n: "03",
    name: "Pragmatic outreach",
    question: "Who should be approached, and how?",
  },
];

/**
 * The three-stage workflow, drawn as a numbered rail.
 *
 * Stages sit on a shared rule with the number as the anchor, because they are
 * sequential and each gates the next — the case where numbering is
 * information rather than ornament. No boxes: the rule and the numbers carry
 * the structure.
 *
 * The human-review line spans the full width deliberately and is set as a
 * statement rather than a footnote. Review is part of the workflow, not a
 * caveat beneath it, and that is the single claim this component exists to
 * make.
 *
 * `compact` is the homepage form: stage names and the review guarantee, but
 * not the question each stage answers. The full diagram was rendering
 * identically on the homepage and on the product page, so the teaser gave
 * away the whole of the page it was meant to lead to.
 */
export default function WorkflowDiagram({
  inverted = false,
  compact = false,
}: {
  inverted?: boolean;
  compact?: boolean;
}) {
  const rule = inverted ? "border-white/20" : "border-rule-firm";
  const numeral = inverted ? "text-white/40" : "text-faint";
  const title = inverted ? "text-white" : "text-ink";
  const body = inverted ? "text-white/60" : "text-muted";

  return (
    <div>
      <ol className="grid gap-x-8 gap-y-8 sm:grid-cols-3">
        {steps.map((step) => (
          <li key={step.name} className={`border-t ${rule} pt-4`}>
            <span className={`label ${numeral}`}>{step.n}</span>
            <h3 className={`mt-3 text-[1.05rem] font-medium leading-tight ${title}`}>
              {step.name}
            </h3>
            {!compact && (
              <p className={`mt-2.5 text-small leading-[1.5] ${body}`}>
                {step.question}
              </p>
            )}
          </li>
        ))}
      </ol>

      <p
        className={`mt-10 border-t pt-5 text-small leading-[1.5] ${rule} ${
          inverted ? "text-white/85" : "text-ink"
        }`}
      >
        <span className={`label mb-2 block ${inverted ? "text-white/45" : "text-accent"}`}>
          Human review
        </span>
        {compact
          ? "Required at every stage, before any output leaves the system."
          : "Required at every stage, before any output leaves the system. Not optional, and not post-hoc."}
      </p>
    </div>
  );
}
