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
 * Marks content blocked on a client input.
 *
 * Renders nothing. Internal notes — "pending client clearance", "to be
 * confirmed", "run npm run studies" — were appearing to visitors and made a
 * finished site read as an unfinished one. The markers stay in the source so
 * the outstanding inputs remain traceable, and the flags they read from stay
 * in lib/site.ts; they are simply not shown.
 *
 * Set NEXT_PUBLIC_SHOW_PENDING=true to surface them again while reviewing
 * internally. Sections that were nothing but a placeholder are removed at
 * their call site rather than hidden here, because an empty heading is its
 * own kind of unfinished.
 */
export function Pending({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_SHOW_PENDING !== "true") return null;
  return (
    <span className="inline-block rounded-[2px] border border-dashed border-flag bg-surface px-[0.4em] py-[0.1em] font-mono text-[0.7rem] uppercase tracking-[0.06em] text-flag">
      {children}
    </span>
  );
}
