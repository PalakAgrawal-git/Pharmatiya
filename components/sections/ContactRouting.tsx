"use client";

import { useState, type FormEvent } from "react";
import { sendMessage, type SendResult } from "@/lib/submit";
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
 * Submission goes through lib/submit: a form endpoint when one is configured,
 * the visitor's mail client otherwise. Required fields are checked before
 * anything is sent, and the result is announced.
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
    const fields: Record<string, string> = {
      Enquiry: routes.find((r) => r.id === route)?.label ?? route,
    };
    data.forEach((value, key) => {
      fields[key.charAt(0).toUpperCase() + key.slice(1)] = String(value);
    });
    setState("sending");
    try {
      setState(await sendMessage(`Website enquiry — ${fields.Enquiry}`, fields));
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

        <div className="grid gap-3 sm:grid-cols-3">
          {routes.map((option) => {
            const selected = route === option.id;
            return (
              <label
                key={option.id}
                /* Three boxes for three choices was the last card set on the
                   page. The options now sit on a shared rule and the selected
                   one is marked by that rule thickening to the accent — the
                   convention the navigation and the archive tabs already use,
                   so selection reads the same way across the site. */
                className={`cursor-pointer border-t-2 pt-5 transition-colors duration-200 ${
                  selected ? "border-accent" : "border-rule hover:border-rule-firm"
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
                  className={`label-sm block ${
                    selected ? "text-accent" : "text-faint"
                  }`}
                >
                  {option.label}
                </span>
                <span
                  className={`mt-3 block text-small leading-[1.55] ${
                    selected ? "text-ink" : "text-muted"
                  }`}
                >
                  {option.description}
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
            {state === "sent" && "Thank you — your enquiry has been sent."}
            {state === "mail-client" &&
              "Your email app has opened with the enquiry written — press send to finish."}
            {state === "error" &&
              "That did not send. Please email us directly and we will reply."}
          </p>
        </div>
      </form>

    </div>
  );
}
