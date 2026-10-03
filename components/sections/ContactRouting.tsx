"use client";

import EmailAddress from "@/components/ui/EmailAddress";
import { useState, type FormEvent } from "react";
import { sendMessage, type SendResult } from "@/lib/submit";
import { Field, TextArea, Select } from "@/components/ui/Field";
import Button from "@/components/ui/Button";

const serviceOptions = [
  "Not sure yet",
  "Evidence generation",
  "Real-world data analytics",
  "Access & value strategy",
] as const;

/**
 * The enquiry form.
 *
 * One form, not three. It used to ask which of three routes applied before
 * anything could be filled in, which put a question in front of the form
 * that the form itself answers: what someone wants is clear from what they
 * write, and sorting it is our job rather than the visitor's.
 *
 * Submission goes through lib/submit to the configured endpoint, which writes
 * the enquiry into Pharmatiya's sheet. Required fields are checked first, and
 * the result is announced. Nothing here opens a mail client.
 */
export default function ContactRouting() {
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
    const fields: Record<string, string> = {};
    data.forEach((value, key) => {
      fields[key.charAt(0).toUpperCase() + key.slice(1)] = String(value);
    });
    setState("sending");
    try {
      setState(await sendMessage("Website enquiry", fields));
    } catch {
      setState("error");
    }
  }

  return (
    <div>
      {/* The form had a question above it where a heading belongs. This
          names the thing instead of interrogating the visitor. */}
      <p className="mb-6 border-b border-rule pb-4 font-mono text-caption uppercase tracking-[0.12em] text-faint">
        Your enquiry
      </p>

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
