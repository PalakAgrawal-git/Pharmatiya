"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  buildSynopsis,
  looksLikePHI,
  readStatement,
  synopsisToText,
  type BuildResult,
} from "@/lib/synopsis";
import {
  makeMeta,
  synopsisDocumentHtml,
  textDocumentHtml,
} from "@/lib/synopsisDocument";

/**
 * NextGen AI, as an application rather than as a page section.
 *
 * A sidebar of synopses, a conversation, a composer. The first message is the
 * problem; every later message refines it, and the synopsis is rebuilt from
 * the whole thread — so "make it payer-facing" or "add adherence" changes the
 * result the way a user expects a follow-up to.
 *
 * The steps shown while it works are the builder's real steps, each reporting
 * what it actually found in the statement (see readStatement). Nothing here
 * names a model: in the default build the draft is made in the browser, and
 * the Trust section on the page says so. With NEXT_PUBLIC_SYNOPSIS_API set,
 * the same interface talks to the model-backed service instead.
 *
 * Threads are kept in this browser's localStorage and nowhere else.
 */

type Step = { label: string; detail: string; done: boolean };

type UserMessage = { id: string; role: "user"; text: string };
type AssistantMessage = {
  id: string;
  role: "assistant";
  status: "working" | "done" | "refused" | "error";
  steps: Step[];
  note?: string;
  result?: BuildResult;
  /** How many sections of the result are showing; results arrive in order. */
  shown: number;
  /** When the draft was completed; dates the document. */
  at?: number;
};
type Message = UserMessage | AssistantMessage;
type Thread = { id: string; title: string; messages: Message[]; updated: number };

const STORE = "pharmatiya-nextgen-threads";
const SERVICE = Boolean(process.env.NEXT_PUBLIC_SYNOPSIS_API);

const SUGGESTIONS = [
  {
    label: "Migraine · payer",
    text: "Build a payer-facing HEOR synopsis for migraine patients cycling through acute therapies using claims and EHR data.",
  },
  {
    label: "Heart failure · provider",
    text: "Heart failure readmissions in a provider health system: which patients drive hospitalisations and cost, using EHR and lab data?",
  },
  {
    label: "Type 2 diabetes · access",
    text: "Real-world adherence and total cost of care for type 2 diabetes patients starting a new therapy, for a market access team, using claims.",
  },
  {
    label: "Psoriasis · pharma",
    text: "Treatment switching and cost for psoriasis patients on biologics, for a pharma medical affairs team, using claims data.",
  },
];

const REFINEMENTS = [
  "Make it payer-facing",
  "Add adherence as an outcome",
  "Use EHR and lab data",
  "Focus on hospitalisations and cost",
];

const uid = () => Math.random().toString(36).slice(2, 10);
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function load(): Thread[] {
  try {
    const raw = window.localStorage.getItem(STORE);
    const threads = raw ? (JSON.parse(raw) as Thread[]) : [];
    // A draft still "working" when the page was closed will never finish.
    return threads.map((t) => ({
      ...t,
      messages: t.messages.map((m) =>
        m.role === "assistant" && m.status === "working"
          ? { ...m, status: "error" as const, note: "This draft was interrupted. Send the question again to rebuild it." }
          : m,
      ),
    }));
  } catch {
    return [];
  }
}

function save(threads: Thread[]) {
  try {
    window.localStorage.setItem(STORE, JSON.stringify(threads.slice(0, 12)));
  } catch {
    /* storage unavailable — the conversation still works for this visit */
  }
}

function planSteps(problem: string): Step[] {
  if (SERVICE) {
    return [
      { label: "Checking for patient data", detail: "None found", done: false },
      { label: "Sending to NextGen AI", detail: "Your statement, and nothing else", done: false },
      { label: "Drafting the synopsis", detail: "Feasibility · Retrospective · Outreach", done: false },
    ];
  }
  const read = readStatement(problem);
  const words = problem.trim().split(/\s+/).length;
  return [
    { label: "Reading the question", detail: `${words} words · no patient data found`, done: false },
    {
      label: "Condition",
      detail: read.condition ?? "Not named — a general definition is used",
      done: false,
    },
    {
      label: "Code families",
      detail: read.codes ? `ICD-10-CM ${read.codes}` : "Confirmed at feasibility",
      done: false,
    },
    {
      label: "Data and audience",
      detail: [
        read.sources.length ? read.sources.join(", ") : "Claims and EHR",
        read.audience.length ? `for ${read.audience.join(", ").toLowerCase()}` : "for payer, provider and pharma",
      ].join(" · "),
      done: false,
    },
    {
      label: "Outcomes",
      detail: read.outcomes.length ? read.outcomes.join("; ") : "Utilisation, cost and clinical outcomes",
      done: false,
    },
    { label: "Drafting the synopsis", detail: "Feasibility · Retrospective study · Pragmatic outreach", done: false },
  ];
}

export default function AssistantWorkspace() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const reduced = useRef(false);
  const composerId = useId();

  useEffect(() => {
    setThreads(load());
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const active = threads.find((t) => t.id === activeId) ?? null;
  const viewingMessage =
    (active?.messages.find((m) => m.id === viewing && m.role === "assistant") as
      | AssistantMessage
      | undefined) ?? null;

  const update = useCallback((id: string, fn: (t: Thread) => Thread) => {
    setThreads((all) => {
      const next = all.map((t) => (t.id === id ? fn(t) : t)).sort((a, b) => b.updated - a.updated);
      save(next);
      return next;
    });
  }, []);

  const patchAssistant = useCallback(
    (threadId: string, messageId: string, patch: Partial<AssistantMessage> | ((m: AssistantMessage) => Partial<AssistantMessage>)) =>
      update(threadId, (t) => ({
        ...t,
        updated: Date.now(),
        messages: t.messages.map((m) =>
          m.id === messageId && m.role === "assistant"
            ? { ...m, ...(typeof patch === "function" ? patch(m) : patch) }
            : m,
        ),
      })),
    [update],
  );

  // Keep the newest content in view as it arrives.
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    if (!active) {
      log.scrollTo({ top: 0 });
      return;
    }
    log.scrollTo({ top: log.scrollHeight, behavior: reduced.current ? "auto" : "smooth" });
  }, [active]);

  async function send(raw: string) {
    const text = raw.trim();
    if (!text || busy) return;
    setDraft("");

    let thread = active;
    if (!thread) {
      thread = { id: uid(), title: text.slice(0, 60), messages: [], updated: Date.now() };
      const created = thread;
      setThreads((all) => {
        const next = [created, ...all];
        save(next);
        return next;
      });
      setActiveId(created.id);
    }
    const threadId = thread.id;
    const userMsg: UserMessage = { id: uid(), role: "user", text };
    const assistantId = uid();

    const phi = looksLikePHI(text);
    const problem = [...thread.messages.filter((m): m is UserMessage => m.role === "user").map((m) => m.text), text].join(" ");

    const assistant: AssistantMessage = phi
      ? {
          id: assistantId,
          role: "assistant",
          status: "refused",
          steps: [],
          note: `That message looks as if it contains ${phi}. I can't work with patient-identifying details — describe the question, not the patient, and I'll build it.`,
          shown: 0,
        }
      : { id: assistantId, role: "assistant", status: "working", steps: planSteps(problem), shown: 0 };

    update(threadId, (t) => ({ ...t, updated: Date.now(), messages: [...t.messages, userMsg, assistant] }));
    if (phi) return;

    setBusy(true);
    const pace = reduced.current ? 0 : 1;
    try {
      const building = buildSynopsis(problem);
      for (let i = 0; i < assistant.steps.length - 1; i++) {
        await wait(420 * pace);
        patchAssistant(threadId, assistantId, (m) => ({
          steps: m.steps.map((s, j) => (j === i ? { ...s, done: true } : s)),
        }));
      }
      const result = await building;
      await wait(300 * pace);
      patchAssistant(threadId, assistantId, (m) => ({
        status: "done",
        result,
        at: Date.now(),
        steps: m.steps.map((s) => ({ ...s, done: true })),
      }));
      const sections = result.kind === "structured" ? 5 : 1;
      for (let i = 1; i <= sections; i++) {
        await wait(220 * pace);
        patchAssistant(threadId, assistantId, { shown: i });
      }
    } catch (error) {
      patchAssistant(threadId, assistantId, {
        status: "error",
        note: `I couldn't build that: ${error instanceof Error ? error.message : "the service did not respond"}. Try again in a moment.`,
      });
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  function newThread() {
    setActiveId(null);
    setDraft("");
    inputRef.current?.focus();
  }

  function clearAll() {
    setThreads([]);
    save([]);
    setActiveId(null);
  }

  async function copy(message: AssistantMessage) {
    if (!message.result) return;
    const text = message.result.kind === "text" ? message.result.text : synopsisToText(message.result.synopsis);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(message.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      /* clipboard blocked; the download remains */
    }
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-rule-firm bg-[#0c1513] shadow-[0_30px_80px_-30px_rgb(0_0_0/0.7)] lg:grid lg:h-[max(38rem,min(50rem,calc(100vh-8rem)))] lg:grid-cols-[15.5rem_1fr]">
      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="hidden flex-col border-r border-rule bg-[#0a1110] lg:flex" aria-label="Synopses">
        <div className="flex items-center gap-2.5 px-5 pb-4 pt-5">
          <Mark />
          <div className="leading-tight">
            <p className="text-small font-medium text-ink">NextGen AI</p>
            <p className="text-caption text-faint">Synopsis Builder</p>
          </div>
        </div>

        <div className="px-3">
          <button
            type="button"
            onClick={newThread}
            className="flex w-full items-center gap-2 rounded-[6px] border border-rule-firm px-3 py-2.5 text-small text-ink transition-colors hover:border-accent hover:bg-surface"
          >
            <span aria-hidden="true" className="text-accent">＋</span> New synopsis
          </button>
        </div>

        <p className="label-sm mt-6 px-5 text-faint">Recent</p>
        <ul className="mt-2 min-h-0 flex-1 overflow-y-auto px-3">
          {threads.length === 0 && (
            <li className="px-2 py-2 text-caption text-faint">Your synopses appear here.</li>
          )}
          {threads.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setActiveId(t.id)}
                aria-current={t.id === activeId ? "true" : undefined}
                className={`w-full truncate rounded-[6px] px-2.5 py-2 text-left text-caption transition-colors ${
                  t.id === activeId ? "bg-surface text-ink" : "text-muted hover:bg-surface/60 hover:text-ink"
                }`}
              >
                {t.title}
              </button>
            </li>
          ))}
        </ul>
        {threads.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="mx-5 mb-2 self-start text-caption text-faint underline-offset-4 hover:text-ink hover:underline"
          >
            Clear history
          </button>
        )}

        <div className="border-t border-rule px-5 py-4">
          <p className="label-sm text-faint">Framework</p>
          <ol className="mt-2.5 flex flex-col gap-1.5 text-caption text-muted">
            <li><span className="tabular text-accent">0</span> · Feasibility</li>
            <li><span className="tabular text-accent">1</span> · Retrospective study</li>
            <li><span className="tabular text-accent">2</span> · Pragmatic outreach</li>
          </ol>
        </div>
      </aside>

      {/* ── Conversation ───────────────────────────────────────── */}
      <section className="flex min-h-[40rem] min-w-0 flex-col lg:min-h-0" aria-label="NextGen AI conversation">
        <header className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="lg:hidden"><Mark /></span>
            <p className="truncate text-small text-ink">{active ? active.title : "New synopsis"}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="flex items-center gap-2 text-caption text-muted" role="status">
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${busy ? "animate-pulse bg-flag" : "bg-accent"}`}
              />
              {busy ? "Drafting" : "Ready"}
            </span>
            <button
              type="button"
              onClick={newThread}
              className="rounded-[6px] border border-rule-firm px-2.5 py-1.5 text-caption text-muted hover:text-ink lg:hidden"
            >
              New
            </button>
          </div>
        </header>

        <div ref={logRef} role="log" aria-live="polite" className="min-h-0 flex-1 overflow-y-auto">
          {!active ? (
            <Welcome onPick={send} disabled={busy} />
          ) : (
            <div className="mx-auto flex max-w-[46rem] flex-col gap-8 px-5 py-8">
              {active.messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <p className="max-w-[85%] rounded-[14px] rounded-br-[4px] bg-inverse px-4 py-3 text-small leading-[1.6] text-ink">
                      {m.text}
                    </p>
                  </div>
                ) : (
                  <AssistantTurn
                    key={m.id}
                    message={m}
                    copied={copiedId === m.id}
                    onCopy={() => copy(m)}
                    onOpen={() => setViewing(m.id)}
                    onRefine={send}
                    busy={busy}
                    isLast={m.id === active.messages[active.messages.length - 1].id}
                  />
                ),
              )}
            </div>
          )}
        </div>

        {/* ── Composer ───────────────────────────────────────── */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
          className="border-t border-rule px-4 pb-4 pt-3"
        >
          <div className="mx-auto max-w-[46rem]">
            <div className="flex items-end gap-2 rounded-[14px] border border-rule-firm bg-surface px-3 py-2 transition-colors focus-within:border-accent">
              <label htmlFor={composerId} className="sr-only">
                {active ? "Refine the synopsis" : "Describe your evidence question"}
              </label>
              <textarea
                id={composerId}
                ref={inputRef}
                value={draft}
                rows={1}
                onChange={(event) => {
                  setDraft(event.target.value);
                  event.target.style.height = "auto";
                  event.target.style.height = `${Math.min(event.target.scrollHeight, 180)}px`;
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send(draft);
                  }
                }}
                placeholder={active ? "Refine it — e.g. “use EHR and lab data”" : "Describe your evidence question…"}
                className="max-h-[180px] min-h-[2.5rem] flex-1 resize-none bg-transparent px-1 py-2 text-small leading-[1.55] text-ink placeholder:text-faint focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                aria-label="Send"
                className="mb-1 grid size-9 shrink-0 place-items-center rounded-[10px] bg-ink text-paper transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                  <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-caption text-faint">
              NextGen AI drafts; a Pharmatiya researcher reviews. Don&rsquo;t include patient-identifying information.
            </p>
          </div>
        </form>
      </section>

      {viewingMessage && (
        <DocumentViewer message={viewingMessage} onClose={() => setViewing(null)} />
      )}
    </div>
  );
}

/* ── Pieces ─────────────────────────────────────────────────────────── */

function Mark() {
  return (
    <span className="grid size-8 place-items-center rounded-[8px] bg-accent/15 ring-1 ring-accent/40">
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <path
          d="M2 15h3l2.5-6 3 9 2.5-12L15 11h3"
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Welcome({ onPick, disabled }: { onPick: (text: string) => void; disabled: boolean }) {
  return (
    // Centred with auto margins rather than justify-content: centring with
    // justify-content pushes an overflowing top edge out of scroll reach.
    <div className="flex min-h-full">
    <div className="m-auto w-full max-w-[46rem] px-5 py-10">
      <div className="flex items-center gap-3">
        <Mark />
        <p className="label-sm text-accent">NextGen AI · Synopsis Builder</p>
      </div>
      <p className="mt-6 text-[clamp(1.75rem,1.3rem+1.6vw,2.5rem)] font-light leading-[1.12] tracking-[-0.025em] text-ink">
        What evidence question are you working on?
      </p>
      <p className="mt-4 max-w-[52ch] text-small leading-[1.65] text-muted">
        Describe it in a sentence — the condition, who it is for, the data you
        hold. I&rsquo;ll structure it into a feasibility plan, a retrospective study
        and a pragmatic outreach design.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            disabled={disabled}
            onClick={() => onPick(s.text)}
            className="group rounded-[10px] border border-rule-firm bg-surface/50 p-4 text-left transition-colors hover:border-accent hover:bg-surface disabled:opacity-50"
          >
            <span className="label-sm text-accent">{s.label}</span>
            <span className="mt-2 line-clamp-2 block text-small leading-[1.5] text-muted group-hover:text-ink">
              {s.text}
            </span>
          </button>
        ))}
      </div>
    </div>
    </div>
  );
}

function AssistantTurn({
  message,
  copied,
  onCopy,
  onOpen,
  onRefine,
  busy,
  isLast,
}: {
  message: AssistantMessage;
  copied: boolean;
  onCopy: () => void;
  onOpen: () => void;
  onRefine: (text: string) => void;
  busy: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0"><Mark /></span>
      <div className="min-w-0 flex-1">
        <p className="text-caption font-medium text-ink">NextGen AI</p>

        {message.note && (
          <p className="mt-2 text-small leading-[1.6] text-muted">{message.note}</p>
        )}

        {message.steps.length > 0 && (
          <ol className="mt-3 flex flex-col gap-2 rounded-[10px] border border-rule bg-[#0a1110] p-4">
            {message.steps.map((step, i) => {
              const current = !step.done && message.steps.slice(0, i).every((s) => s.done) && message.status === "working";
              if (!step.done && !current) return null;
              return (
                <li key={step.label} className="grid grid-cols-[1.1rem_1fr] gap-x-2.5 text-caption">
                  <span aria-hidden="true" className="pt-0.5">
                    {step.done ? (
                      <svg viewBox="0 0 12 12" width="12" height="12"><path d="M2 6.5 4.8 9 10 3" fill="none" stroke="var(--color-accent)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    ) : (
                      <span className="block size-3 animate-spin rounded-full border-[1.5px] border-rule-firm border-t-accent" />
                    )}
                  </span>
                  <span>
                    <span className="text-ink">{step.label}</span>
                    <span className="text-faint"> — {step.detail}</span>
                  </span>
                </li>
              );
            })}
          </ol>
        )}

        {message.status === "done" && message.result && message.shown >= 1 && (
          <div className="mt-4">
            <p className="text-small leading-[1.65] text-muted">
              {message.result.kind === "structured"
                ? `Here is the synopsis — ${message.result.synopsis.steps.length + 4} sections in the three-step framework, set as a client document. Open it to review, or save it as a PDF or Word file.`
                : "Here is the synopsis, set as a client document. Open it to review, or save it as a PDF or Word file."}
            </p>
            <DocumentCard message={message} onOpen={onOpen} />

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ToolButton onClick={onCopy}>{copied ? "Copied ✓" : "Copy text"}</ToolButton>
              <span className="ml-1 text-caption text-faint">Draft — for expert review before client use</span>
            </div>

            {isLast && (
              <div className="mt-5">
                <p className="text-caption text-faint">Refine it</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {REFINEMENTS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      disabled={busy}
                      onClick={() => onRefine(r)}
                      className="rounded-full border border-rule-firm px-3 py-1.5 text-caption text-muted transition-colors hover:border-accent hover:text-ink disabled:opacity-50"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[6px] border border-rule-firm px-2.5 py-1.5 text-caption text-muted transition-colors hover:border-accent hover:text-ink"
    >
      {children}
    </button>
  );
}

/* ── The deliverable ────────────────────────────────────────────────── */

function documentFor(message: AssistantMessage) {
  const meta = makeMeta(message.id, new Date(message.at ?? Date.now()));
  const result = message.result!;
  const title =
    result.kind === "structured" ? result.synopsis.title : "HEOR / RWE study synopsis";
  const html =
    result.kind === "structured"
      ? synopsisDocumentHtml(result.synopsis, meta)
      : textDocumentHtml(result.text, meta);
  return { meta, title, html };
}

function downloadWord(html: string, reference: string) {
  // Word opens HTML saved as .doc as an ordinary document. The grey viewing
  // backdrop and page shadow are for the screen only, so they are removed.
  const word = html
    .replace("html { background: #e9ecea; }", "html { background: #fff; }")
    .replace("padding: 32px 16px 48px;", "padding: 0;")
    .replace("box-shadow: 0 2px 24px rgba(0,0,0,.12);", "");
  const url = URL.createObjectURL(new Blob(["\ufeff", word], { type: "application/msword" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${reference}.doc`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function DocumentCard({ message, onOpen }: { message: AssistantMessage; onOpen: () => void }) {
  const { meta, title } = documentFor(message);
  const sections =
    message.result?.kind === "structured"
      ? ["Problem statement", "Study question", ...message.result.synopsis.steps.map((s) => `${s.step} — ${s.name}`)]
      : ["Synopsis"];

  return (
    <div className="mt-3 flex flex-col gap-4 rounded-[12px] border border-rule-firm bg-surface/40 p-3 sm:flex-row sm:items-center">
      {/* A miniature of the page, so the card reads as a file and not as text. */}
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${title}`}
        className="group relative h-[8.5rem] w-full shrink-0 overflow-hidden rounded-[6px] bg-[#e9ecea] p-2 sm:w-[6.5rem]"
      >
        <span className="block h-full rounded-[2px] bg-white px-2 pt-2 text-left shadow-sm transition-transform group-hover:-translate-y-0.5">
          <span className="block border-b-2 border-[#2f8f81] pb-1 text-[6px] font-semibold text-[#0f1a18]">Pharmatiya</span>
          <span className="mt-1.5 block text-[5.5px] leading-[1.3] text-[#0f1a18]">{title}</span>
          {[80, 92, 70, 88, 60, 84, 76].map((w, i) => (
            <span key={i} className="mt-1 block h-[2px] rounded bg-[#cfd6d3]" style={{ width: `${w}%` }} />
          ))}
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="label-sm text-accent">Study synopsis · Draft</p>
        <p className="mt-1 text-small font-medium leading-snug text-ink">{title}</p>
        <p className="mt-1 text-caption text-faint">
          {meta.reference} · {meta.date}
        </p>
        <p className="mt-2 line-clamp-2 text-caption text-muted">{sections.join(" · ")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="rounded-[6px] bg-ink px-3 py-1.5 text-caption font-medium text-paper transition-colors hover:bg-accent"
          >
            Open document
          </button>
          <ToolButton onClick={() => downloadWord(documentFor(message).html, meta.reference)}>
            Download Word
          </ToolButton>
        </div>
      </div>
    </div>
  );
}

function DocumentViewer({ message, onClose }: { message: AssistantMessage; onClose: () => void }) {
  const { meta, title, html } = documentFor(message);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${meta.reference}`}
      className="fixed inset-0 z-[60] flex flex-col bg-[#060b0a]/85 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="mx-auto flex h-full w-full max-w-[64rem] flex-col p-3 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-[10px] border border-b-0 border-rule-firm bg-[#0c1513] px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-small font-medium text-ink">{title}</p>
            <p className="text-caption text-faint">
              {meta.reference} · Draft for expert review
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => frameRef.current?.contentWindow?.print()}
              className="rounded-[6px] bg-ink px-3 py-1.5 text-caption font-medium text-paper transition-colors hover:bg-accent"
            >
              Save as PDF
            </button>
            <ToolButton onClick={() => downloadWord(html, meta.reference)}>Download Word</ToolButton>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close document"
              className="grid size-8 place-items-center rounded-[6px] border border-rule-firm text-muted transition-colors hover:text-ink"
            >
              ✕
            </button>
          </div>
        </div>
        <iframe
          ref={frameRef}
          title={`${title} document`}
          srcDoc={html}
          className="min-h-0 w-full flex-1 rounded-b-[10px] border border-rule-firm bg-[#e9ecea]"
        />
      </div>
    </div>
  );
}
