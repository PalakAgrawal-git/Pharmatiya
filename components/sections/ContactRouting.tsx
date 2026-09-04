"use client";

import { useState } from "react";
import { Field, TextArea, Select } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { DataLabel, Pending } from "@/components/ui/DataLabel";

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
 * PENDING input 10 — a statically exported site cannot process submissions on
 * its own. `action` needs a real endpoint (form service, serverless function
 * or host handler) before launch. Until then submission is disabled rather
 * than silently failing, which is what the current site effectively does.
 */
export default function ContactRouting() {
  const [route, setRoute] = useState<Route>("new");

  return (
    <div>
      <fieldset className="mb-10 border-0 p-0">
        <legend className="mb-4 font-mono text-caption uppercase tracking-[0.12em] text-faint">
          What is this about?
        </legend>

        <div className="grid gap-3 sm:grid-cols-3">
          {routes.map((option) => {
            const selected = route === option.id;
            return (
              <label
                key={option.id}
                className={`cursor-pointer rounded-[2px] border p-4 transition-colors ${
                  selected
                    ? "border-accent bg-accent/6 shadow-[inset_0_0_0_1px_var(--color-accent)]"
                    : "border-rule bg-surface hover:border-rule-firm"
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
                <span
                  className={`block font-mono text-caption font-medium uppercase tracking-[0.08em] ${
                    selected ? "text-accent" : "text-ink"
                  }`}
                >
                  {option.label}
                </span>
                <span className="mt-1.5 block text-small text-muted">
                  {option.description}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <form
        className="flex flex-col gap-5"
        onSubmit={(event) => event.preventDefault()}
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
          className="flex flex-col gap-5 border-l-2 border-accent pl-5"
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

        <label className="flex items-start gap-3 text-small text-muted">
          <input
            type="checkbox"
            name="digest"
            className="mt-1 size-5 accent-[var(--color-accent)]"
          />
          <span>
            Add me to the Quarterly Insights Digest. Sent four times a year;
            unsubscribe in one click.
          </span>
        </label>

        <div>
          <Button type="submit" disabled>
            Send enquiry
          </Button>
          <p className="mt-3 text-caption text-faint">
            Form endpoint <Pending>Pending input 10 — hosting</Pending>{" "}
            Submission is disabled until a handler is configured, rather than
            appearing to send and silently failing.
          </p>
        </div>
      </form>

      <div className="mt-10 border-t border-rule pt-5">
        <DataLabel className="mb-2">Where enquiries go</DataLabel>
        <p className="measure text-small text-muted">
          Routing destinations <Pending>Pending input 6</Pending>
        </p>
      </div>
    </div>
  );
}
