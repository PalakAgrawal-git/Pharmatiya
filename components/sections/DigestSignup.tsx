"use client";

import { DataLabel } from "@/components/ui/DataLabel";
import Slot from "@/components/ui/Slot";

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
    <div className={footer ? "" : "border-t border-rule pt-8"}>
      <DataLabel as={footer ? "h2" : "h3"} className={`mb-3 ${footer ? "text-white/45" : ""}`}>
        Quarterly Insights Digest
      </DataLabel>

      <p
        className={`mb-6 ${
          footer ? "text-small text-white/55" : "measure text-muted"
        }`}
      >
        Four issues a year on HEOR and RWE method, evidence and access.
        Unsubscribe in one click.
      </p>

      {!footer && (
        <Slot id={16} className="mb-6">
          What the Quarterly Insights Digest actually is, and whether it
          exists yet. The description above is drafted — confirm the
          frequency, the subject matter and that you intend to send it. The
          field below cannot submit anywhere until input 05 is settled.
        </Slot>
      )}

      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
          <label
            htmlFor={`digest-email-${variant}`}
            className={`label ${footer ? "text-white/45" : "text-faint"}`}
          >
            Work email
          </label>
          <input
            id={`digest-email-${variant}`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            className={`min-h-12 w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-body transition-colors focus:outline-none ${
              footer
                ? "border-white/25 text-white focus:border-white"
                : "border-rule-firm text-ink focus:border-accent"
            }`}
          />
        </div>

        {/* Disabled until an email platform is configured. It stays visible
            and inert rather than appearing to subscribe and silently failing;
            the disabled state is the honest signal, without a note explaining
            it to visitors. */}
        <button
          type="submit"
          disabled
          aria-disabled="true"
          className={`inline-flex min-h-12 items-center gap-2.5 rounded-[--radius-sm] border px-6 text-small font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            footer
              ? "border-white/25 text-white"
              : "border-ink bg-ink text-paper"
          }`}
        >
          Subscribe
          <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}
