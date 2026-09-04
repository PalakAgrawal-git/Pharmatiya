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
  className?: string;
};

/**
 * Radius is 2px throughout — enough to avoid harshness, far short of the pill
 * and large-radius vocabulary the brief rules out. Minimum hit area is 44px.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-[2px] border font-medium no-underline transition-colors disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "border-accent bg-accent text-paper hover:border-accent-deep hover:bg-accent-deep",
  secondary:
    "border-accent bg-transparent text-accent hover:bg-accent hover:text-paper",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-4 text-small",
  md: "min-h-12 px-6 text-body",
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

  if (href && !disabled) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} aria-disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
