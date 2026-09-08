import AxisRule from "@/components/ui/AxisRule";
type Props = {
  eyebrow?: string;
  /** Small right-hand marker, e.g. "01–03". Sits opposite the eyebrow. */
  index?: string;
  title?: string;
  lede?: string;
  as?: "h1" | "h2";
  /** Sets the title in the editorial serif. Page openings only. */
  display?: boolean;
  className?: string;
};

/**
 * A page or section opening, set as a chapter head.
 *
 * The eyebrow and the optional index sit on a rule above the title — the
 * arrangement a journal uses for a running head, and the piece of apparatus
 * that does most to make the page read as a document rather than a screen.
 *
 * `display` puts the title in the serif. Reserved for page openings, because
 * the serif only carries meaning while it stays rare.
 */
export default function SectionHeader({
  eyebrow,
  index,
  title,
  lede,
  as: Heading = "h2",
  display = false,
  className = "",
}: Props) {
  return (
    <div className={className}>
      {(eyebrow || index) && (
        /* The axis carries the rule here as it does in SectionLabel, so the
           mark appears on page openings too rather than only inside
           sections. Without it Services and Contact were the two pages with
           no trace of the site's own device. */
        <div className="mb-8 flex items-center gap-6 pt-3">
          {eyebrow && <p className="label shrink-0 text-accent">{eyebrow}</p>}
          <AxisRule />
          {index && <p className="label tabular shrink-0 text-faint">{index}</p>}
        </div>
      )}

      {title && (
        <Heading
          className={[
            display ? "display" : "font-medium",
            Heading === "h1"
              ? "text-[clamp(2.3rem,1.5rem+3.4vw,4.25rem)] leading-[1.04]"
              : "text-[clamp(1.85rem,1.4rem+2vw,2.85rem)] leading-[1.08]",
            "max-w-[18ch]",
          ].join(" ")}
        >
          {title}
        </Heading>
      )}

      {lede && (
        <p className="measure mt-7 text-lede leading-[1.5] text-muted">{lede}</p>
      )}
    </div>
  );
}
