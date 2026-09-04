type Props = {
  eyebrow?: string;
  title?: string;
  lede?: string;
  as?: "h1" | "h2";
  className?: string;
};

/**
 * Eyebrow / heading / lede. The eyebrow is set in the mono face — the label
 * voice that gives the site its analytical register.
 */
export default function SectionHeader({
  eyebrow,
  title,
  lede,
  as: Heading = "h2",
  className = "",
}: Props) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="mb-4 font-mono text-caption uppercase tracking-[0.14em] text-faint">
          {eyebrow}
        </p>
      )}
      {title && (
        <Heading
          className={
            Heading === "h1"
              ? "mb-4 text-[clamp(2.3rem,1.6rem+3.4vw,4.1rem)]"
              : "mb-4 text-[clamp(1.9rem,1.5rem+2vw,2.9rem)]"
          }
        >
          {title}
        </Heading>
      )}
      {lede && (
        <p className="measure-tight text-lede leading-[1.45] text-muted">
          {lede}
        </p>
      )}
    </div>
  );
}
