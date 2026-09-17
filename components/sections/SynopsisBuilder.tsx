"use client";

import { useId, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import {
  buildSynopsis,
  looksLikePHI,
  synopsisToText,
  type BuildResult,
} from "@/lib/synopsis";

/**
 * The synopsis builder, inside the site.
 *
 * The same interaction as the live product: describe the problem, build the
 * synopsis, copy it. It used to be a link out to app.pharmatiya.net, which
 * stops resolving the moment the domain moves to this site — so the product
 * now lives here, and a model-backed service can be connected later through
 * NEXT_PUBLIC_SYNOPSIS_API without touching this component (see
 * lib/synopsis.ts).
 *
 * The output is set as a document, not as a chat bubble: numbered steps on
 * rules, the study question as a definition list, the review note at the
 * foot where a reader expects the caveats.
 */

const EXAMPLES = [
  "Build a payer-facing HEOR synopsis for migraine patients cycling through acute therapies using claims and EHR data.",
  "Heart failure readmissions in a provider health system: which patients drive hospitalisations and cost, using EHR and lab data?",
  "Real-world adherence and total cost of care for type 2 diabetes patients starting a new therapy, for a market access team, using claims.",
];

type State =
  | { status: "idle" }
  | { status: "working" }
  | { status: "refused"; reason: string }
  | { status: "error"; message: string }
  | { status: "done"; result: BuildResult };

export default function SynopsisBuilder() {
  const [problem, setProblem] = useState("");
  const [state, setState] = useState<State>({ status: "idle" });
  const [copied, setCopied] = useState(false);
  const inputId = useId();
  const resultRef = useRef<HTMLDivElement>(null);

  async function build(text = problem) {
    const trimmed = text.trim();
    if (trimmed.length < 12) {
      setState({ status: "refused", reason: "Describe the problem in a sentence or two first." });
      return;
    }
    const phi = looksLikePHI(trimmed);
    if (phi) {
      setState({
        status: "refused",
        reason: `This looks as if it contains ${phi}. Remove any patient-identifying details — the builder needs the question, not the patient.`,
      });
      return;
    }
    setCopied(false);
    setState({ status: "working" });
    try {
      const result = await buildSynopsis(trimmed);
      setState({ status: "done", result });
      requestAnimationFrame(() =>
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } catch (error) {
      setState({
        status: "error",
        message: error instanceof Error ? error.message : "The synopsis could not be built.",
      });
    }
  }

  const asText =
    state.status === "done"
      ? state.result.kind === "text"
        ? state.result.text
        : synopsisToText(state.result.synopsis)
      : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(asText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([asText], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "pharmatiya-synopsis.txt";
    link.click();
    URL.revokeObjectURL(url);
  }

  const working = state.status === "working";

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          build();
        }}
        className="grid gap-x-12 gap-y-8 lg:grid-cols-12"
      >
        <div className="lg:col-span-8">
          <label htmlFor={inputId} className="label text-faint">
            Problem statement
          </label>
          <textarea
            id={inputId}
            value={problem}
            onChange={(event) => setProblem(event.target.value)}
            rows={5}
            placeholder={EXAMPLES[0]}
            aria-describedby={`${inputId}-note`}
            className="mt-3 w-full resize-y rounded-[4px] border border-rule-firm bg-surface px-5 py-4 text-body leading-[1.6] text-ink placeholder:text-faint focus:border-accent focus:outline-none"
          />
          <p id={`${inputId}-note`} className="mt-3 text-caption text-faint">
            Describe the business, clinical or evidence question. Do not include
            patient-identifying information.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Button type="submit" disabled={working} arrow={false}>
              {working ? "Building…" : "Build synopsis"}
            </Button>
            <p role="status" aria-live="polite" className="text-small text-muted">
              {working && "Structuring your question into the framework…"}
              {state.status === "refused" && state.reason}
              {state.status === "error" && `The synopsis could not be built: ${state.message}`}
            </p>
          </div>
        </div>

        <div className="lg:col-span-4">
          <p className="label text-faint">Or start from an example</p>
          <ul className="mt-3 flex flex-col">
            {EXAMPLES.map((example) => (
              <li key={example} className="border-t border-rule">
                <button
                  type="button"
                  disabled={working}
                  onClick={() => {
                    setProblem(example);
                    build(example);
                  }}
                  className="group w-full py-3.5 text-left text-small leading-[1.5] text-muted transition-colors hover:text-ink disabled:opacity-50"
                >
                  {example}
                  <span
                    aria-hidden="true"
                    className="ml-1.5 inline-block text-accent transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </form>

      {state.status === "done" && (
        <div ref={resultRef} className="mt-16 scroll-mt-28 border-t border-accent pt-8">
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
            <div className="max-w-[60ch]">
              <p className="label text-accent">Synopsis</p>
              {state.result.kind === "structured" && (
                <h3 className="mt-3 text-[clamp(1.4rem,1.1rem+1vw,2rem)] font-light leading-[1.15] tracking-[-0.02em]">
                  {state.result.synopsis.title}
                </h3>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" arrow={false} onClick={copy}>
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="secondary" size="sm" arrow={false} onClick={download}>
                Download .txt
              </Button>
            </div>
          </div>

          {state.result.kind === "text" ? (
            <pre className="mt-8 whitespace-pre-wrap font-sans text-small leading-[1.75] text-muted">
              {state.result.text}
            </pre>
          ) : (
            <StructuredSynopsis synopsis={state.result.synopsis} />
          )}
        </div>
      )}
    </div>
  );
}

function StructuredSynopsis({
  synopsis,
}: {
  synopsis: Extract<BuildResult, { kind: "structured" }>["synopsis"];
}) {
  return (
    <div className="mt-10">
      <div className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="label-sm text-faint">Problem statement</p>
          <p className="mt-3 text-small leading-[1.65] text-muted">{synopsis.problem}</p>
        </div>
        <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-[9rem_1fr] lg:col-span-8">
          {synopsis.question.map((row) => (
            <div key={row.label} className="contents">
              <dt className="label-sm pt-0.5 text-faint">{row.label}</dt>
              <dd className="text-small leading-[1.6] text-ink">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <ol className="mt-12 grid gap-x-10 gap-y-12 lg:grid-cols-3">
        {synopsis.steps.map((step) => (
          <li key={step.step} className="border-t border-rule-firm pt-6">
            <p className="label tabular text-accent">{step.step}</p>
            <h4 className="mt-3 text-[1.3rem] font-normal leading-tight">{step.name}</h4>
            <div className="mt-6 flex flex-col gap-6">
              {step.sections.map((section) => (
                <div key={section.heading}>
                  <p className="label-sm text-faint">{section.heading}</p>
                  <ul className="mt-2.5 flex flex-col gap-1.5">
                    {section.items.map((item) => (
                      <li key={item} className="text-small leading-[1.55] text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 grid gap-x-12 gap-y-8 border-t border-rule pt-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label-sm text-faint">Value by stakeholder</p>
          <dl className="mt-4 flex flex-col gap-3">
            {synopsis.value.map((v) => (
              <div key={v.audience} className="grid gap-x-6 sm:grid-cols-[6rem_1fr]">
                <dt className="text-small text-ink">{v.audience}</dt>
                <dd className="text-small leading-[1.55] text-muted">{v.message}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-5">
          <p className="label-sm text-faint">Review</p>
          <ul className="mt-4 flex flex-col gap-2">
            {synopsis.review.map((line) => (
              <li key={line} className="text-small leading-[1.55] text-muted">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
