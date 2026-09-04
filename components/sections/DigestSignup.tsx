"use client";

import { DataLabel } from "@/components/ui/DataLabel";

/**
 * Quarterly Insights Digest subscription.
 *
 * The current site names this Digest in two places and captures nothing.
 * This is its first working subscription path — pending an email platform
 * (input 10 group), the control is present and honest about its state rather
 * than a decorative field.
 */
export default function DigestSignup({
  variant = "page",
}: {
  variant?: "page" | "footer";
}) {
  const footer = variant === "footer";

  return (
    <div className={footer ? "" : "border border-rule bg-surface p-6 sm:p-8"}>
      <DataLabel as={footer ? "h2" : "h3"} className="mb-2">
        Quarterly Insights Digest
      </DataLabel>

      <p
        className={`mb-4 ${
          footer ? "text-small text-muted" : "measure text-muted"
        }`}
      >
        Four issues a year on HEOR and RWE method, evidence and access.
        Unsubscribe in one click.
      </p>

      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
          <label
            htmlFor={`digest-email-${variant}`}
            className="font-mono text-caption text-muted"
          >
            Work email
          </label>
          <input
            id={`digest-email-${variant}`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className="min-h-12 w-full rounded-[2px] border border-rule bg-paper px-3.5 py-3 text-body text-ink placeholder:text-faint focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled
          aria-disabled="true"
          className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-accent bg-accent px-6 font-medium text-paper disabled:cursor-not-allowed disabled:opacity-40"
        >
          Subscribe
        </button>
      </form>
    </div>
  );
}
