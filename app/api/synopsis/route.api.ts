import { looksLikePHI } from "@/lib/synopsis";

/**
 * The drafting service.
 *
 * This is the only place the model's API key is ever read. It runs on the
 * server, never ships to a browser, and the key is not exposed to the page —
 * which is why the endpoint exists at all rather than the site calling the
 * model directly.
 *
 * Contract, unchanged from the browser-side builder so the two are
 * interchangeable:
 *
 *   POST { problem: string }  ->  200 { synopsis: string }
 *                                 4xx/5xx { error: string }
 *
 * Until OPENAI_API_KEY is set this returns 503 and the site falls back to
 * drafting in the browser. Nothing here is required for the site to work.
 *
 * NOTE: this route only exists in a server build. With `output: 'export'`
 * the site has no server and this file is not deployed. See next.config.mjs.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Settings, all from the environment ─────────────────────────────────
   None of these may be NEXT_PUBLIC_: that prefix would publish them. */
const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const BASE = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
/** A ceiling on cost per request, not a target. */
const MAX_TOKENS = Number(process.env.SYNOPSIS_MAX_TOKENS || 1800);
/** The longest problem statement accepted, in characters. */
const MAX_INPUT = 4000;

/**
 * What the model is asked to produce. The framework is Pharmatiya's, not the
 * model's invention: it must fill these three steps, not propose its own
 * structure, or the output stops matching the documents the site generates.
 */
const SYSTEM = `You draft HEOR and RWE study synopses for Pharmatiya Health.

Produce a planning draft only. A Pharmatiya researcher reviews and signs off
every synopsis before it is used, so state assumptions rather than hiding
them, and never present a number as settled.

Structure every synopsis in Pharmatiya's three-step framework, in this order:
  Step 0 - Feasibility
  Step 1 - Retrospective Study
  Step 2 - Pragmatic Outreach

For each step give the cohort definition, the data required, the objectives
and endpoints, and the analysis. Use ICD-10-CM categories rather than
specific subcodes: a category that is right beats a subcode that might not
be. Where a sample size or a cost appears, mark it as an estimate to be
confirmed against the data.

Close with value by stakeholder, and with what a reviewer must confirm.

Never request, infer or repeat patient-identifying information.`;

type Body = { problem?: unknown };

function fail(status: number, error: string) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  if (!KEY) {
    return fail(503, "The drafting service is not configured.");
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return fail(400, "Expected JSON.");
  }

  const problem = typeof body.problem === "string" ? body.problem.trim() : "";
  if (!problem) return fail(400, "Describe the problem you want a synopsis for.");
  if (problem.length > MAX_INPUT) {
    return fail(413, "That statement is too long. Describe the question in a few sentences.");
  }

  /* The browser checks this too. It is checked again here because the browser
     check can be bypassed, and a statement carrying an identifier must not
     reach a third party's servers. */
  if (looksLikePHI(problem)) {
    return fail(422, "That looks like it contains patient-identifying information. Describe the question, not the patient.");
  }

  try {
    const response = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.3,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: problem },
        ],
      }),
    });

    if (!response.ok) {
      /* The provider's own message can name the account, the key or the
         billing state. Log it for us; tell the visitor nothing about it. */
      console.error("Synopsis provider error", response.status, await response.text());
      return fail(502, "The drafting service is unavailable. Please try again shortly.");
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const synopsis = data.choices?.[0]?.message?.content?.trim();
    if (!synopsis) return fail(502, "The drafting service returned nothing.");

    return Response.json({ synopsis });
  } catch (error) {
    console.error("Synopsis request failed", error);
    return fail(502, "The drafting service could not be reached.");
  }
}
