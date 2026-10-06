import { looksLikePHI } from "@/lib/synopsis";
import { americanizeDeep } from "@/lib/americanize";

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
/**
 * A ceiling on cost per request, not a target.
 *
 * It must clear the whole synopsis comfortably. A reply cut off at the
 * limit is truncated JSON, which cannot be parsed and cannot be partly
 * used, so a cap set too low does not produce a shorter document: it
 * produces no document. A full draft runs to roughly 1,700 tokens, and
 * this leaves room for a longer question to need more.
 */
const MAX_TOKENS = Number(process.env.SYNOPSIS_MAX_TOKENS || 4000);
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

Never request, infer or repeat patient-identifying information.

Write in American English throughout: American spelling (hospitalization,
utilization, enrollment, program, randomized, generalized, standardized,
analyze, behavior, hemophilia, pediatric), American terms and US date and
number conventions. Never use British spellings.

Write at the standard of a synopsis going to a sponsor for a decision, not
notes towards one. That means an executive summary that stands alone, a
background that says what is already known, named statistical methods
rather than "appropriate analyses", and a closing ask.

Reply with JSON only, in exactly this shape:

{
  "title": "Sponsor-facing title naming the condition and the setting",
  "summary": "One paragraph a sponsor could read alone and act on: what is proposed, in which data, and what it will establish.",
  "background": ["Why this matters and what is already known.",
                 "What the existing evidence does not settle, and why this data can."],
  "problem": "the problem restated in one or two sentences",
  "condition": "the condition and its ICD-10-CM category, or null",
  "audience": ["who the work is for"],
  "sources": ["each data source required"],
  "question": [{"label": "Population", "value": "..."},
               {"label": "Exposure", "value": "..."},
               {"label": "Comparator", "value": "..."},
               {"label": "Outcomes", "value": "..."},
               {"label": "Timeframe", "value": "..."}],
  "steps": [{"step": "Step 0", "name": "Feasibility",
             "timeframe": "2-4 weeks",
             "sections": [{"heading": "Primary objectives", "items": ["..."]},
                          {"heading": "Secondary objectives", "items": ["..."]},
                          {"heading": "Study design and data source", "items": ["..."]},
                          {"heading": "Cohort definition", "items": ["..."]},
                          {"heading": "Stratification", "items": ["..."]},
                          {"heading": "Statistical analysis plan", "items": ["..."]},
                          {"heading": "Key outputs", "items": ["..."]}]}],
  "value": [{"audience": "Payer", "message": "..."}],
  "review": ["what a reviewer must confirm before this is used"],
  "nextSteps": ["the concrete decision or approval being asked for"],
  "codes": [{"group": "Condition or category",
             "code": "ICD-10-CM code",
             "description": "what the code covers"}]
}

Section headings per step, used as they fit the step: primary objectives,
secondary objectives, study design and data source, cohort definition,
stratification, statistical analysis plan, healthcare resource utilization,
key outputs, strategic impact. Step 2 covers outreach strategies,
governance and compliance, the conversion funnel and operational metrics.

Give enrolment windows and look-back periods in the design section. Name
the statistical methods: Kaplan-Meier and Cox proportional hazards for time
to event, negative binomial for utilisation counts, generalized linear
models for cost, propensity matching for comparability. Name only methods
the question warrants.

Write every string as finished prose. No markdown, no asterisks, no bullet
characters, no headings inside a string: the structure above is the
formatting, and the document is typeset from it.

Each item is a complete sentence or a precise phrase, not a fragment or a
placeholder. Give all three steps.

Give two to four next steps, each one an action with an owner implied.

Give at least six code rows covering the condition and the categories a
cohort would need, grouped by what they identify. A one-line appendix is
worse than none.`;

/* ── Literature ─────────────────────────────────────────────────────────
   Real published work, found before anything is drafted.

   The model is never asked to write a citation. It is handed a numbered
   list of papers that were actually returned by a search, and may only
   refer to them by number; the list printed in the document is the one
   fetched here. A reference that does not exist is therefore not something
   the model is discouraged from producing — it has no way to produce one.

   Europe PMC, because its search is a single public endpoint needing no
   key, and it indexes MEDLINE. Relevance order, not citation count: the
   most-cited papers for any clinical phrase are the global burden of
   disease surveys, which are never what a synopsis needs. */

const PMC = "https://www.ebi.ac.uk/europepmc/webservices/rest/search";
const STOP = new Set(
  ("a an and the of for to in on with using from by at is are as that this these those our we " +
    "their it its new real world patients team study data analysis across among within").split(" "),
);

type Paper = { citation: string; link: string | null };

async function findPapers(problem: string): Promise<Paper[]> {
  const words = (problem.toLowerCase().match(/[a-z0-9-]+/g) ?? [])
    .filter((w) => w.length > 2 && !STOP.has(w))
    .slice(0, 6);
  if (words.length < 2) return [];

  const query =
    `(${words.map((w) => `TITLE_ABS:"${w}"`).join(" AND ")})` +
    ` AND (FIRST_PDATE:[2015-01-01 TO 2030-12-31]) AND (SRC:MED)`;

  try {
    const url = `${PMC}?query=${encodeURIComponent(query)}&format=json&pageSize=8`;
    const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
    if (!response.ok) return [];
    const data = (await response.json()) as {
      resultList?: { result?: Record<string, string>[] };
    };
    return (data.resultList?.result ?? [])
      .filter((r) => r.title && r.journalTitle && r.pubYear)
      .map((r) => {
        const first = (r.authorString ?? "").split(",")[0].trim();
        const who = first ? `${first}${(r.authorString ?? "").includes(",") ? " et al." : ""} ` : "";
        return {
          citation: `${who}${r.title!.replace(/\.$/, "")}. ${r.journalTitle}. ${r.pubYear}.`,
          link: r.doi ? `https://doi.org/${r.doi}` : r.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/` : null,
        };
      });
  } catch {
    /* The search is an enrichment, not a dependency. A synopsis without a
       background citation is still a synopsis; a failed draft is not. */
    return [];
  }
}

type Body = { problem?: unknown };

function fail(status: number, error: string) {
  return Response.json({ error }, { status });
}

/* ── Checking the reply ─────────────────────────────────────────────────
   A language model is asked for this shape, not held to it. Everything
   below is a check on what actually came back; anything missing or of the
   wrong type means the draft is refused rather than half-rendered. */

const isText = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;
const textList = (v: unknown): string[] | null =>
  Array.isArray(v) && v.length > 0 && v.every(isText) ? (v as string[]).map((s) => s.trim()) : null;

function pairs<K extends string>(v: unknown, a: K, b: K) {
  if (!Array.isArray(v) || !v.length) return null;
  const out = v.map((item) => {
    const row = item as Record<string, unknown>;
    return isText(row?.[a]) && isText(row?.[b])
      ? { [a]: String(row[a]).trim(), [b]: String(row[b]).trim() }
      : null;
  });
  return out.every(Boolean) ? (out as Record<K, string>[]) : null;
}

function steps(v: unknown) {
  if (!Array.isArray(v) || !v.length) return null;
  const out = v.map((item) => {
    const step = item as Record<string, unknown>;
    if (!isText(step?.step) || !isText(step?.name) || !Array.isArray(step?.sections)) return null;
    const timeframe = isText(step?.timeframe) ? String(step.timeframe).trim() : undefined;
    const sections = (step.sections as unknown[]).map((s) => {
      const section = s as Record<string, unknown>;
      const items = textList(section?.items);
      return isText(section?.heading) && items
        ? { heading: String(section.heading).trim(), items }
        : null;
    });
    if (!sections.length || !sections.every(Boolean)) return null;
    return {
      step: String(step.step).trim(),
      name: String(step.name).trim(),
      ...(timeframe ? { timeframe } : {}),
      sections: sections as { heading: string; items: string[] }[],
    };
  });
  return out.every(Boolean) ? (out as NonNullable<(typeof out)[number]>[]) : null;
}

/**
 * Keeps the citations that point at a real paper, and drops the rest.
 *
 * The model is told to cite only the relevant papers, so the list it was
 * given is usually wider than the list it uses. Printing the unused ones
 * would attach references to a document that does not rely on them. A
 * marker pointing outside the list — [9] when eight were offered — is
 * removed from the text rather than printed as a dead number.
 *
 * Surviving citations are renumbered to run 1..n in order of first
 * appearance, so the background and the reference list agree.
 */
function withReferences(
  synopsis: ReturnType<typeof asSynopsis> & object,
  papers: Paper[],
) {
  if (!papers.length || !synopsis.background?.length) return synopsis;

  const order: number[] = [];
  const renumber = (text: string) =>
    text.replace(/\[([\d,\s]+)\]/g, (whole, group: string) => {
      const kept = group
        .split(",")
        .map((part) => Number(part.trim()))
        .filter((n) => Number.isInteger(n) && n >= 1 && n <= papers.length)
        .map((n) => {
          if (!order.includes(n)) order.push(n);
          return order.indexOf(n) + 1;
        });
      return kept.length ? `[${kept.join(",")}]` : "";
    });

  const background = synopsis.background.map(renumber).map((t) => t.replace(/\s+([.,;])/g, "$1").trim());
  if (!order.length) return { ...synopsis, background };

  return {
    ...synopsis,
    background,
    references: order.map((source, i) => ({
      n: i + 1,
      citation: papers[source - 1].citation,
      link: papers[source - 1].link,
    })),
  };
}

function asSynopsis(raw: string) {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  const d = parsed as Record<string, unknown>;

  const audience = textList(d?.audience);
  const sources = textList(d?.sources);
  const review = textList(d?.review);
  const question = pairs(d?.question, "label", "value");
  const value = pairs(d?.value, "audience", "message");
  const plan = steps(d?.steps);

  if (!isText(d?.title) || !isText(d?.problem)) return null;
  if (!audience || !sources || !review || !question || !value || !plan) return null;

  /* The summary and the background are what make this read as a document
     rather than as notes, which was the whole complaint. A draft without
     them is asked for again rather than accepted. */
  const background = textList(d?.background);
  if (!isText(d?.summary) || !background) return null;

  /* The framework is three steps. A draft that stops at feasibility is not
     the thing the page describes, whatever else is right about it. */
  if (plan.length < 3) return null;

  /* These two enrich the document but are not worth refusing a draft over:
     a synopsis missing its appendix is still a usable synopsis. */
  const nextSteps = textList(d?.nextSteps);
  const codes = Array.isArray(d?.codes)
    ? (d.codes as unknown[])
        .map((c) => c as Record<string, unknown>)
        .filter((c) => isText(c?.group) && isText(c?.code) && isText(c?.description))
        .map((c) => ({
          group: String(c.group).trim(),
          code: String(c.code).trim(),
          description: String(c.description).trim(),
        }))
    : [];

  return {
    title: String(d.title).trim(),
    problem: String(d.problem).trim(),
    condition: isText(d?.condition) ? String(d.condition).trim() : null,
    audience,
    sources,
    question,
    steps: plan,
    value,
    review,
    summary: String(d.summary).trim(),
    background,
    ...(nextSteps ? { nextSteps } : {}),
    ...(codes.length ? { codes } : {}),
  };
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

  const papers = await findPapers(problem);
  const sources = papers.length
    ? `\n\nPublished work found for this question. Cite these in the background by
number in square brackets, as [1] or [2,3]. Cite only those genuinely
relevant to this question and ignore the rest; an irrelevant citation is
worse than none. Never cite anything not on this list, and never invent a
reference.\n\n` + papers.map((p, i) => `[${i + 1}] ${p.citation}`).join("\n")
    : "";

  try {
    /* Asked twice at most. A model given this much structure occasionally
       returns a thinner draft than the brief asks for — a missing summary
       or background — and asking again is cheaper for everyone than giving
       the visitor a document that reads as notes. */
    let lastRaw = "";
    for (let attempt = 0; attempt < 2; attempt++) {
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
          /* Guarantees syntactically valid JSON. It does not guarantee the
             right shape, which is why the reply is still checked below. */
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: SYSTEM + sources },
            { role: "user", content: problem },
            ...(attempt
              ? [
                  {
                    role: "system" as const,
                    content:
                      "The previous draft was missing required fields. Return every field in the shape, including summary, background, nextSteps and codes.",
                  },
                ]
              : []),
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
        choices?: { message?: { content?: string }; finish_reason?: string }[];
      };

      /* Truncation is worth naming in the log. It looks identical to a
         malformed reply from the outside, and the fix is different: the
         token ceiling is too low for the shape being asked for. */
      if (data.choices?.[0]?.finish_reason === "length") {
        console.error(`Synopsis reply hit the ${MAX_TOKENS}-token ceiling and was cut off.`);
      }

      const raw = data.choices?.[0]?.message?.content?.trim();
      if (!raw) return fail(502, "The drafting service returned nothing.");
      lastRaw = raw;

      /* The page typesets a synopsis from its parts. A reply that is not
         that shape would be shown as a wall of raw text, which is worse
         than not answering. */
      const synopsis = asSynopsis(raw);
      if (synopsis) return Response.json({ synopsis: withReferences(americanizeDeep(synopsis), papers) });
    }

    console.error("Synopsis reply was not the expected shape", lastRaw.slice(0, 600));
    return fail(502, "The drafting service returned an unusable draft.");
  } catch (error) {
    console.error("Synopsis request failed", error);
    return fail(502, "The drafting service could not be reached.");
  }
}
