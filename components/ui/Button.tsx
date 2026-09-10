import Link from "next/link";

type Variant = "primary" | "secondary";
type Size = "sm" | "md";

type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit";
  disabled?: boolean;
  full?: boolean;
  external?: boolean;
  arrow?: boolean;
  className?: string;
};

/**
 * Nearly square, dark, and used sparingly.
 *
 * Radius is 4px, which is enough to soften the corner and nothing like the
 * pill vocabulary of a product site. Most actions on this site are not
 * buttons at all — a secondary action is a text link with an arrow, because
 * putting every action in a filled control flattens the hierarchy between
 * them. Reserve this for the one thing you want a visitor to do on a page.
 */
const base =
  "glow group inline-flex items-center justify-center gap-3 rounded-[4px] border text-small font-medium no-underline transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "border-ink bg-ink text-paper hover:border-accent hover:bg-accent",
  secondary:
    "border-rule-firm bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4",
  md: "min-h-[3.25rem] px-7",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  type = "button",
  disabled,
  full,
  external,
  arrow = true,
  className = "",
}: Props) {
  const classes = [base, variants[variant], sizes[size], full ? "w-full" : "", className]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className="text-[0.9em] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[4px] group-hover:-translate-y-[2px]"
        >
          ↗
        </span>
      )}
    </>
  );

  if (href && !disabled) {
    if (external) {
      return (
        <a href={href} className={classes} rel="noopener noreferrer" target="_blank">
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} aria-disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
