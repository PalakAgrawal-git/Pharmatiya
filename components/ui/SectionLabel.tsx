import AxisRule from "@/components/ui/AxisRule";
type Props = {
  /** Two-digit section mark, e.g. "02". */
  index?: string;
  children: React.ReactNode;
  as?: "p" | "h2";
  tone?: "light" | "dark";
  /** Draws a hairline running off the end of the label. */
  rule?: boolean;
  className?: string;
};

/**
 * The running head: `02 / SERVICES`, set in mono with a hairline running off
 * to the margin.
 *
 * This is the site's most repeated piece of apparatus and the thing that makes
 * a page read as a numbered document rather than a stack of blocks. It is
 * deliberately small and muted — it orients, it does not announce.
 */
export default function SectionLabel({
  index,
  children,
  as: Tag = "p",
  tone = "light",
  rule = true,
  className = "",
}: Props) {
  const ink = tone === "dark" ? "text-white/45" : "text-faint";
  const mark = tone === "dark" ? "text-white/70" : "text-accent";

  return (
    <Tag className={`label flex items-center gap-4 ${ink} ${className}`}>
      {index && (
        <>
          <span className={`tabular ${mark}`}>{index}</span>
          <span aria-hidden="true" className={ink}>
            /
          </span>
        </>
      )}
      <span>{children}</span>
      {rule && <AxisRule tone={tone} />}
    </Tag>
  );
}
