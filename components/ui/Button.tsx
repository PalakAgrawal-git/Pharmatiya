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
  /** Appends a trailing arrow that shifts on hover. */
  arrow?: boolean;
  className?: string;
};

/**
 * A compact control, not a pill.
 *
 * Radius is 3px — enough that the corner is not sharp, far short of the
 * rounded-rectangle vocabulary that makes a page read as a product site. The
 * fill is ink rather than accent: the accent is spent on emphasis inside the
 * content, and a dark button reads as more considered than a coloured one.
 * The arrow moves 3px on hover; nothing scales, nothing glows.
 */
const base =
  "group inline-flex items-center justify-center gap-2.5 rounded-[--radius-sm] border font-medium no-underline transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "border-ink bg-ink text-paper hover:border-accent hover:bg-accent",
  secondary:
    "border-rule-firm bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-paper",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 text-small",
  md: "min-h-12 px-6 text-small",
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
  const classes = [
    base,
    variants[variant],
    sizes[size],
    full ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className="translate-x-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]"
        >
          →
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
