"use client";

import EmailAddress from "@/components/ui/EmailAddress";
import { useState, type FormEvent } from "react";
import { sendMessage, type SendResult } from "@/lib/submit";
import { site } from "@/lib/site";
import { Field, TextArea, Select } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { DataLabel } from "@/components/ui/DataLabel";

type Route = "new" | "existing" | "press";

const routes: { id: Route; label: string; description: string }[] = [
  {
    id: "new",
    label: "New client",
    description: "Scoping a study or an evidence need.",
  },
  {
    id: "existing",
    label: "Existing client",
    description: "A question about work in progress.",
  },
  {
    id: "press",
    label: "Press & partners",
    description: "Media, academic or partnership enquiry.",
  },
];

const serviceOptions = [
  "Not sure yet",
  "Evidence generation",
  "Real-world data analytics",
  "Access & value strategy",
] as const;

/**
 * Segmented contact form.
 *
 * The route is chosen BEFORE the form is filled, so an existing client with a
 * project question is never made to complete a new-business form, and a new
 * enquiry arrives pre-qualified. Radio cards rather than a dropdown keep all
 * three paths visible — a visitor who cannot see "existing client" assumes
 * there is no route for them.
 *
 * Submission goes through lib/submit to the configured endpoint, which writes
 * the enquiry into Pharmatiya's sheet. Required fields are checked first, and
 * the result is announced. Nothing here opens a mail client.
 */
export default function ContactRouting() {
  const [route, setRoute] = useState<Route>("new");
  const [state, setState] = useState<"idle" | "invalid" | "sending" | SendResult | "error">("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setState("invalid");
      (form.querySelector(":invalid") as HTMLElement | null)?.focus();
      return;
    }
    const data = new FormData(form);
    /* "Enquiry type", not "Enquiry": the press route's own textarea is named
       `enquiry`, and capitalised it landed on the same key — the route label
       was overwritten by the message, and the subject line with it. */
    const fields: Record<string, string> = {
      "Enquiry type": routes.find((r) => r.id === route)?.label ?? route,
    };
    data.forEach((value, key) => {
      fields[key.charAt(0).toUpperCase() + key.slice(1)] = String(value);
    });
    setState("sending");
    try {
      setState(
        await sendMessage(`Website enquiry: ${fields["Enquiry type"]}`, fields),
      );
    } catch {
      setState("error");
    }
  }

  return (
    <div>
      <fieldset className="mb-10 border-0 p-0">
        <legend className="mb-4 font-mono text-caption uppercase tracking-[0.12em] text-faint">
          What is this about?
        </legend>

        {/* A thin rule over a block of text does not look like something you
            can click, which is how three paragraphs ended up sitting above
            the form reading as prose. Each option is now a card with its own
            edge and a control you can see, so the set reads as a choice
            before a word of it is read. */}
        <div className="grid gap-2.5 sm:grid-cols-3">
          {routes.map((option) => {
            const selected = route === option.id;
            return (
              <label
                key={option.id}
                className={`group relative flex cursor-pointer gap-3 rounded-[10px] border p-4 transition-all duration-200 ${
                  selected
                    ? "border-accent bg-accent/[0.07] shadow-[inset_0_0_0_1px_var(--color-accent)]"
                    : "border-rule-firm bg-surface/30 hover:border-accent/50 hover:bg-surface/60"
                }`}
              >
                <input
                  type="radio"
                  name="route"
                  value={option.id}
                  checked={selected}
                  onChange={() => setRoute(option.id)}
                  className="sr-only"
                />

                {/* The dot carries the state. Colour alone would leave the
                    choice invisible to anyone who cannot separate the two
                    greens, and this is the one control on the page where
                    getting it wrong routes the enquiry to the wrong desk. */}
                <span
                  aria-hidden="true"
                  className={`mt-[3px] flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                    selected ? "border-accent" : "border-rule-firm group-hover:border-accent/60"
                  }`}
                >
                  <span
                    className={`h-[7px] w-[7px] rounded-full bg-accent transition-transform duration-200 ${
                      selected ? "scale-100" : "scale-0"
                    }`}
                  />
                </span>

                <span className="min-w-0">
                  <span
                    className={`label-sm block transition-colors duration-200 ${
                      selected ? "text-accent" : "text-faint group-hover:text-muted"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span
                    className={`mt-2 block text-small leading-[1.5] transition-colors duration-200 ${
                      selected ? "text-ink" : "text-muted"
                    }`}
                  >
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <form
        className="flex flex-col gap-5"
        onSubmit={onSubmit}
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="name"
            name="name"
            label="Name"
            required
            autoComplete="name"
          />
          <Field
            id="organisation"
            name="organisation"
            label="Organisation"
            required
            autoComplete="organization"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            id="email"
            name="email"
            type="email"
            label="Work email"
            required
            autoComplete="email"
            inputMode="email"
          />
          <Field
            id="role"
            name="role"
            label="Role"
            autoComplete="organization-title"
          />
        </div>

        {/* Conditional fields. Announced on change; focus is never stolen
            mid-typing. */}
        <div
          className="flex flex-col gap-6 border-l border-rule pl-8"
          aria-live="polite"
        >
          {route === "new" && (
            <>
              <Select
                id="service"
                name="service"
                label="Which service is closest?"
                options={serviceOptions}
              />
              <TextArea
                id="question"
                name="question"
                label="What question are you trying to answer?"
                required
                rows={4}
                hint="A sentence is enough. We will come back with what it would take to answer it."
              />
            </>
          )}

          {route === "existing" && (
            <>
              <Field
                id="reference"
                name="reference"
                label="Project reference (if known)"
              />
              <TextArea
                id="query"
                name="query"
                label="Your question"
                required
                rows={4}
              />
            </>
          )}

          {route === "press" && (
            <>
              <Field
                id="outlet"
                name="outlet"
                label="Publication or organisation type"
              />
              <Field id="deadline" name="deadline" label="Deadline, if any" />
              <TextArea
                id="enquiry"
                name="enquiry"
                label="Your enquiry"
                required
                rows={4}
              />
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button type="submit" disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Send enquiry"}
          </Button>
          <p role="status" className="text-small text-muted">
            {state === "invalid" && "Please fill in the required fields."}
            {state === "sent" && "Thank you. Your enquiry has been sent, and we will reply shortly."}
            {(state === "unconfigured" || state === "error") && (
              <>
                That did not send. Please write to{" "}
                <EmailAddress className="text-accent underline underline-offset-4" />{" "}
                and we will reply.
              </>
            )}
          </p>
        </div>
      </form>

    </div>
  );
}
