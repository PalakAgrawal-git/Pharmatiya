/**
 * A visible placeholder for content the client still owes.
 *
 * The site previously hid these: `Pending` returned null unless an
 * environment flag was set, which meant the three documents sent to the
 * client — the content request, its summary and the one-page version — all
 * described markers nobody could see. Worse, the call sites had been removed
 * entirely, so even the flag surfaced nothing.
 *
 * A slot is deliberately unmistakable. It is not a greyed-out approximation
 * of the finished content, because a plausible-looking placeholder is how
 * invented copy ends up shipping: someone reads it, decides it reads well
 * enough, and it goes live. This announces itself as an empty slot and names
 * the item number from the content request so a reply can reference it.
 *
 * `id` is the item number in docs/content-required.html. Keep them in step.
 */

type Props = {
  /** Item number in the content request. */
  id: number;
  /** What is needed, in the client's words. */
  children: React.ReactNode;
  /** Blocking items are called out; the rest read as ordinary outstanding work. */
  blocking?: boolean;
  /** Inline slots sit inside a sentence rather than replacing a block. */
  inline?: boolean;
  className?: string;
};

export default function Slot({
  id,
  children,
  blocking = false,
  inline = false,
  className = "",
}: Props) {
  const label = `Client input ${String(id).padStart(2, "0")}${
    blocking ? " — blocking" : ""
  }`;

  if (inline) {
    return (
      <span
        className={`inline-block rounded-[2px] border border-dashed border-flag/70 px-[0.5em] py-[0.15em] align-baseline font-mono text-[0.72em] uppercase tracking-[0.06em] text-flag ${className}`}
      >
        <span className="sr-only">Awaiting client input: </span>
        {children}
      </span>
    );
  }

  return (
    <div
      className={`rounded-[3px] border border-dashed border-flag/60 bg-flag/[0.05] px-5 py-4 ${className}`}
    >
      <p className="label-sm text-flag">{label}</p>
      <p className="mt-2.5 max-w-[62ch] text-small leading-[1.6] text-muted">
        {children}
      </p>
    </div>
  );
}
