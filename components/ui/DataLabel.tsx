type Props = {
  children: React.ReactNode;
  as?: "p" | "h2" | "h3" | "h4" | "span" | "dt";
  className?: string;
};

/** Uppercase mono label — the site's structural voice for section markers. */
export function DataLabel({ children, as: Tag = "p", className = "" }: Props) {
  return (
    <Tag
      className={`font-mono text-caption uppercase tracking-[0.12em] text-faint ${className}`}
    >
      {children}
    </Tag>
  );
}

/**
 * Marks content that is blocked on a client input. Rendered inline so that
 * an unfinished page is unmistakably unfinished — never quietly filled with
 * invented content.
 */
export function Pending({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-[2px] border border-dashed border-flag bg-surface px-[0.4em] py-[0.1em] font-mono text-[0.7rem] uppercase tracking-[0.06em] text-flag">
      {children}
    </span>
  );
}
