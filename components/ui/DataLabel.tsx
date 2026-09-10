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
