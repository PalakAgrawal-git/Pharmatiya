import Link from "next/link";

/**
 * The site's default action: a text link with an arrow, not a button.
 *
 * Most secondary actions belong here. A page with one filled control and
 * several of these has a readable hierarchy; a page where every action is a
 * button has none. The underline is drawn from the rule colour and firms to
 * the accent on hover, so the resting state stays quiet.
 */
export default function ArrowLink({
  href,
  children,
  tone = "light",
  external = false,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  external?: boolean;
  className?: string;
}) {
  const classes = [
    "group inline-flex items-baseline gap-2 text-small no-underline transition-colors duration-200",
    tone === "dark"
      ? "text-white/85 hover:text-white"
      : "text-ink hover:text-accent",
    className,
  ].join(" ");

  const inner = (
    <>
      <span
        className={`border-b pb-0.5 transition-colors duration-200 ${
          tone === "dark"
            ? "border-white/30 group-hover:border-white"
            : "border-rule-firm group-hover:border-accent"
        }`}
      >
        {children}
      </span>
      <span
        aria-hidden="true"
        className="text-[0.85em] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[4px] group-hover:-translate-y-[2px]"
      >
        ↗
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} className={classes} rel="noopener noreferrer" target="_blank">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}
