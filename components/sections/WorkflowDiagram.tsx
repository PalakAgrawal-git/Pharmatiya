const steps = [
  {
    n: "1",
    name: "Feasibility",
    question: "Can this question be answered with the data available?",
  },
  {
    n: "2",
    name: "Retrospective",
    question: "What does existing data already show?",
  },
  {
    n: "3",
    name: "Pragmatic outreach",
    question: "Who should be approached, and how?",
  },
];

/**
 * The three-stage workflow.
 *
 * The human-review bar spans all three stages deliberately: review is drawn
 * as part of the workflow, not as a caveat beneath it. Horizontal on desktop,
 * vertical on mobile — the single adaptation that most affects comprehension
 * of the product on a phone.
 *
 * `compact` is the homepage form: stage names and the review guarantee, but
 * not the question each stage answers. The full diagram was rendering
 * identically on the homepage and on the product page, so the teaser gave
 * away the whole of the page it was meant to lead to. The product page keeps
 * the questions, which are the part worth clicking through for.
 */
export default function WorkflowDiagram({
  inverted = false,
  compact = false,
}: {
  inverted?: boolean;
  compact?: boolean;
}) {
  const border = inverted ? "border-white/20" : "border-rule";
  const surface = inverted ? "bg-white/5" : "bg-surface";
  const hover = inverted ? "lift-inverse" : "lift";
  const title = inverted ? "text-white" : "text-ink";
  const body = inverted ? "text-white/70" : "text-muted";
  const numeral = inverted ? "text-white/40" : "text-faint";

  return (
    <div>
      <ol className="grid gap-3 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.name}
            className={`relative rounded-[2px] border ${hover} ${border} ${surface} p-4`}
          >
            <span className={`font-mono text-caption ${numeral}`}>
              {step.n}
            </span>
            <h3
              className={`mt-1 font-mono text-small font-medium uppercase tracking-[0.08em] ${title}`}
            >
              {step.name}
            </h3>
            {!compact && (
              <p className={`mt-2 text-small ${body}`}>{step.question}</p>
            )}

            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute font-mono ${numeral} left-1/2 -bottom-3 -translate-x-1/2 lg:left-auto lg:-right-2.5 lg:top-1/2 lg:bottom-auto lg:-translate-y-1/2 lg:translate-x-0`}
              >
                <span className="lg:hidden">↓</span>
                <span className="hidden lg:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>

      <p
        className={`mt-4 rounded-[2px] border px-4 py-3 font-mono text-caption ${
          inverted
            ? "border-white/30 bg-white/10 text-white"
            : "border-accent bg-accent/8 text-accent"
        }`}
      >
        {compact
          ? "Human expert review at every stage — required, not post-hoc."
          : "Human expert review — required at every stage before output leaves the system. Not optional, not post-hoc."}
      </p>
    </div>
  );
}
