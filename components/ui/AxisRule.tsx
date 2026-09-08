type Props = {
  /** Matches the surrounding ground so the marks stay legible on dark. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * The section divider, drawn as a forest-plot axis.
 *
 * A forest plot resolves onto one horizontal line with a centre tick — the
 * line of no effect — and two poles either side: favours intervention,
 * favours comparator. That axis is the grammar of the work this practice
 * does, so it is the site's repeated structural mark rather than a plain
 * hairline.
 *
 * It reads as a rule at a glance and rewards a second look, which is the
 * whole intent: nothing here announces itself, but the detail is owned
 * rather than borrowed. The indigo pole sits left and the amber right, in
 * the same order the palette assigns them.
 *
 * Decorative, so it is hidden from assistive technology — the heading beside
 * it already carries the meaning.
 */
export default function AxisRule({ tone = "light", className = "" }: Props) {
  const line = tone === "dark" ? "bg-white/20" : "bg-rule";
  const tick = tone === "dark" ? "bg-white/40" : "bg-rule-firm";
  const poleA = tone === "dark" ? "bg-accent-on-dark" : "bg-accent";
  const poleB = tone === "dark" ? "bg-signal-on-dark" : "bg-signal";

  return (
    <span
      aria-hidden="true"
      className={`rule-grow flex flex-1 items-center gap-0 ${className}`}
    >
      {/* left pole */}
      <span className={`h-[3px] w-[3px] shrink-0 ${poleA}`} />
      <span className={`h-px flex-1 ${line}`} />
      {/* line of no effect */}
      <span className={`h-[7px] w-px shrink-0 ${tick}`} />
      <span className={`h-px flex-1 ${line}`} />
      {/* right pole */}
      <span className={`h-[3px] w-[3px] shrink-0 ${poleB}`} />
    </span>
  );
}
