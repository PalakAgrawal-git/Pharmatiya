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
/* A full synopsis takes longer than a host's default function limit, which
   would cut the reply off and send the visitor to the browser-side draft. */
export const maxDuration = 60;
/* Five seconds short of the limit, so the route returns its own answer
   rather than being killed mid-reply and returning none. */
const DEADLINE = (maxDuration - 5) * 1000;

/* ── Settings, all from the environment ─────────────────────────────────
   None of these may be NEXT_PUBLIC_: that prefix would publish them. */
const KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const BASE = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
/**
 * The agent's own instructions, pasted in as an environment variable so the
 * text never sits in the repository. They govern content, depth and tone;
 * the JSON shape below still applies, because the page typesets the
 * document from its parts.
 */
const HOUSE = (process.env.SYNOPSIS_INSTRUCTIONS || "").trim();

/**
 * Pharmatiya's own past synopses, uploaded with scripts/upload-samples.mjs.
 *
 * Set, and each draft is written with those documents to hand, so it follows
 * the firm's structure and language rather than a general idea of what a
 * synopsis looks like. Unset, drafting works exactly as before.
 *
 * Nothing is trained: the documents are searched at the moment of drafting.
 * Adding one changes the next synopsis, and removing one takes its influence
 * away just as quickly.
 */
const STORE = process.env.SYNOPSIS_VECTOR_STORE;

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
 * What the model is asked to produce. The structure is Pharmatiya's, not the
 * model's invention: it must fill these sections, not propose its own
 * structure, or the output stops matching the documents the site generates.
 */
const SYSTEM = `You draft HEOR and RWE study synopses for Pharmatiya Health.

Produce a planning draft only. A Pharmatiya researcher reviews and signs off
every synopsis before it is used, so state assumptions rather than hiding
them, and never present a number as settled.

Write in American English throughout: American spelling (hospitalization,
utilization, enrollment, program, randomized, generalized, standardized,
analyze, behavior, hemophilia, pediatric), American terms and US date and
number conventions. Never use British spellings.

Never request, infer or repeat patient-identifying information.

Write at the standard of a synopsis going to a sponsor for a decision. Use
the drug and disease named in the problem statement. Where the statement does
not name one, keep a bracketed placeholder such as [Drug X] or [Disease Y]
rather than inventing it. Use ICD-10-CM categories rather than subcodes, and
mark any sample size or cost as an estimate to be confirmed against the data.

The synopsis has this structure, in this order:

  Title: "Real-World Effectiveness and Economic Impact of [Drug X] in the
    Management of [Disease Y]: A Health Economics and Outcomes Research Study",
    adapted to the question.
  Background: one paragraph on the clinical and economic burden, what is
    already known, and why real-world evidence on the therapy matters.
  Objectives: Primary Objective; Secondary Objectives (healthcare resource
    utilization and direct medical costs, cost-effectiveness from a payer
    perspective, patient-reported outcomes and quality of life where
    relevant, subgroups with differential response).
  Study Design: a paragraph. Retrospective observational cohort on real-world
    data, propensity score matching, and a cost-effectiveness model where
    cost is in question.
  Population: Inclusion Criteria; Exclusion Criteria.
  Data Sources: each source and what it contributes.
  Outcomes: Clinical Outcomes; Economic Outcomes; Patient-Reported Outcomes.
  Statistical Approach: named methods, for example descriptive statistics,
    propensity score matching or inverse probability of treatment weighting,
    Kaplan-Meier and Cox proportional hazards for time to event, generalized
    linear models for cost and utilization, sensitivity analyses, a Markov or
    partitioned survival model for ICERs, and subgroup analyses. Name only
    methods the question warrants.
  Deliverables: study report, manuscript(s), executive summary and
    payer-focused slide deck, health economic model and documentation for
    formulary submissions and HTAs, and recommendations.
  Closing: one sentence stating what the study will provide and for whom.

First decide whether what you were given belongs to this field at all. Be
generous: the visitor is a researcher sketching an idea, not filling in a
form, and one word is a perfectly ordinary way to start.

In scope, and to be answered: a condition, a drug, a device, a population,
an outcome, a data type, a method, a stakeholder, a decision a payer or a
manufacturer faces, and the field's own vocabulary — HEOR, RWE, RWD, HTA,
claims, EHR, PRO, adherence, utilization, cost-effectiveness and the like.
A single term such as "HEOR", "migraine" or "claims" is in scope: draft the
synopsis that term implies, keeping [Drug X] or [Disease Y] where the
visitor has not said which.

Out of scope, and only this: something with no connection to health
research. A poem, a recipe, code, a political opinion, general knowledge,
a film plot.

For those, and only those, reply with exactly {"notAStudyQuestion": true}
and nothing else. Do not fill the shape below with placeholders around it;
an empty answer is useful and a study document about a recipe is not.

Otherwise reply with JSON only, in exactly this shape:

{
  "title": "...",
  "problem": "the problem restated in one or two sentences",
  "condition": "the condition and its ICD-10-CM category, or null",
  "audience": ["who the work is for"],
  "sources": ["each data source required"],
  "background": ["One paragraph, cited by number where a published paper is listed."],
  "sections": [
    {"heading": "Objectives",
     "groups": [{"label": "Primary Objective", "items": ["..."]},
                {"label": "Secondary Objectives", "items": ["..."]}]},
    {"heading": "Study Design", "paragraphs": ["..."]},
    {"heading": "Population",
     "groups": [{"label": "Inclusion Criteria", "items": ["..."]},
                {"label": "Exclusion Criteria", "items": ["..."]}]},
    {"heading": "Data Sources", "groups": [{"items": ["..."]}]},
    {"heading": "Outcomes",
     "groups": [{"label": "Clinical Outcomes", "items": ["..."]},
                {"label": "Economic Outcomes", "items": ["..."]},
                {"label": "Patient-Reported Outcomes", "items": ["..."]}]},
    {"heading": "Cohort Definition and Stratification", "groups": [{"items": ["..."]}]},
    {"heading": "Healthcare Resource Utilization and Cost", "groups": [{"items": ["..."]}]},
    {"heading": "Statistical Approach", "groups": [{"items": ["..."]}]},
    {"heading": "Key Outputs", "groups": [{"items": ["..."]}]},
    {"heading": "Strategic Impact", "groups": [{"items": ["..."]}]},
    {"heading": "Timeline", "groups": [{"items": ["..."]}]},
    {"heading": "Deliverables", "groups": [{"items": ["..."]}]}
  ],
  "closing": "One closing sentence."
}

Be thorough. Background is two to three paragraphs of four or more sentences.
Each list has four to eight specific items, each a complete sentence naming
the variable, window, code family, method or output concerned. Give every
section in the shape above, Strategic Impact broken down by stakeholder, and
short, specific phrases for timeframes.

Write every string as finished prose. No markdown, no asterisks, no bullet
characters, no headings inside a string: the structure above is the
formatting, and the document is typeset from it. Each item is a complete
sentence or a precise phrase, not a fragment or a placeholder.`;

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

/**
 * Names that must never appear in a draft.
 *
 * The samples are real proposals written for named sponsors, and asking the
 * model not to repeat them is a request, not a guarantee: the first live
 * test of the sample search returned a synopsis for an unrelated question
 * that cited two of the documents by filename and named the health plan.
 *
 * So the draft is checked rather than trusted. A draft naming any of these
 * is thrown away and asked for again, and if the second one does it too the
 * visitor gets the browser-side builder instead. A synopsis that is merely
 * shorter is a far smaller problem than one that tells a stranger who
 * Pharmatiya's clients are.
 *
 * SYNOPSIS_FORBIDDEN_NAMES adds to this list, comma separated, so a new
 * engagement can be covered without a deployment.
 */
const FORBIDDEN = [
  "EmblemHealth",
  "Emblem",
  "Pfizer",
  "Novartis",
  "Sanofi",
  "Moderna",
  "Grail",
  "Freenome",
  "Cybin",
  "Johnson & Johnson",
  "Janssen",
  "JnJ",
  "Exact Sciences",
  "SiteSmart",
  "ACPNY",
  "Healthagen",
  ".docx",
]
  .concat((process.env.SYNOPSIS_FORBIDDEN_NAMES || "").split(",").map((s) => s.trim()))
  .filter(Boolean);

const FORBIDDEN_RE = new RegExp(
  FORBIDDEN.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
  "i",
);

/** Which forbidden names a finished draft mentions, if any. */
function leaks(synopsis: unknown): string[] {
  const found = new Set<string>();
  (function walk(node: unknown) {
    if (typeof node === "string") {
      const hit = node.match(FORBIDDEN_RE);
      if (hit) found.add(hit[0]);
    } else if (Array.isArray(node)) node.forEach(walk);
    else if (node && typeof node === "object") Object.values(node).forEach(walk);
  })(synopsis);
  return [...found];
}

/**
 * How to use the sample synopses, when there are any.
 *
 * Worth being explicit that they are a model for form rather than a source
 * of fact: the samples contain real cohort counts from real claims data, and
 * a draft that borrowed those numbers for an unrelated question would be
 * inventing evidence while looking authoritative.
 */
const SAMPLES = `

You have Pharmatiya's own past synopses available to search. Consult them and
follow their language, their depth and the way they phrase a method, so this
reads as the same firm's work.

Take wording from them, not the section list. They are older and shorter
than what is asked for here, and a draft that copies a sample's outline ends
up missing sections. The structure set out above governs: produce every
section it names, eight at the least, however few a sample has.

Take the form from them, never the findings. Their cohort sizes, their
percentages and their results belong to the studies they describe. Do not
carry a number from a sample into this synopsis.

Name nothing you find in them. No sponsor, no manufacturer, no health plan,
no provider network, no document or file name. Those are confidential, and
this synopsis is written for someone unconnected to them. Describe data
generically: "a national health plan's closed medical and pharmacy claims",
never the plan that holds them.`;

/**
 * Either shape of reply, depending on which endpoint was used.
 *
 * Chat completions puts the text in choices[].message.content; the Responses
 * API returns an output list that also carries the file_search call, so the
 * message has to be found among the items rather than assumed first.
 */
type ProviderReply = {
  choices?: { message?: { content?: string }; finish_reason?: string }[];
  output_text?: string;
  output?: { type?: string; content?: { type?: string; text?: string }[] }[];
  incomplete_details?: { reason?: string };
};

function textOf(data: ProviderReply): string {
  const chat = data.choices?.[0]?.message?.content;
  if (chat) return chat.trim();
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }
  return (data.output ?? [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .filter((c) => c.type === "output_text" && typeof c.text === "string")
    .map((c) => c.text as string)
    .join("")
    .trim();
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

function sectionsOf(v: unknown) {
  if (!Array.isArray(v) || !v.length) return null;
  const out = v.map((item) => {
    const sec = item as Record<string, unknown>;
    if (!isText(sec?.heading)) return null;
    const paragraphs = Array.isArray(sec.paragraphs) ? textList(sec.paragraphs) : null;
    const groups = Array.isArray(sec.groups)
      ? (sec.groups as unknown[]).map((g) => {
          const group = g as Record<string, unknown>;
          const items = textList(group?.items);
          return items ? { ...(isText(group?.label) ? { label: String(group.label).trim() } : {}), items } : null;
        })
      : [];
    if (!groups.every(Boolean)) return null;
    if (!paragraphs && !groups.length) return null;
    return {
      heading: String(sec.heading).trim(),
      ...(paragraphs ? { paragraphs } : {}),
      ...(groups.length ? { groups: groups as { label?: string; items: string[] }[] } : {}),
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
  if (!papers.length || !synopsis.background.length) return synopsis;

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

/** "payers and providers", for the closing sentence when one is missing. */
function listOrThem(audience: string[]): string {
  const clean = audience.map((a) => a.toLowerCase().trim()).filter(Boolean);
  if (!clean.length) return "the teams who commissioned it";
  if (clean.length === 1) return clean[0];
  return `${clean.slice(0, -1).join(", ")} and ${clean[clean.length - 1]}`;
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
  const background = textList(d?.background);
  const sections = sectionsOf(d?.sections);

  /* Which check failed, for the log. A rejected draft used to be reported
     as "not the expected shape" with 600 characters of JSON underneath,
     which says nothing about whether the model missed a field or stopped
     early — and those have different fixes. */
  const missing = [
    !isText(d?.title) && "title",
    !isText(d?.problem) && "problem",
    !audience && "audience",
    !sources && "sources",
    !background && "background",
    !sections && "sections",
  ].filter(Boolean) as string[];
  if (missing.length) {
    console.error(`Synopsis draft missing: ${missing.join(", ")}`);
    return null;
  }

  /* A draft that stops after the objectives is not a synopsis. */
  if (sections!.length < 8) {
    console.error(`Synopsis draft had ${sections!.length} sections, needs 8.`);
    return null;
  }

  /* Non-null below: every one of these was checked above, but the checks
     now run through a list so the log can name what was missing, and that
     costs the compiler its narrowing. */
  return {
    title: String(d.title).trim(),
    problem: String(d.problem).trim(),
    condition: isText(d?.condition) ? String(d.condition).trim() : null,
    audience: audience!,
    sources: sources!,
    background: background!,
    sections: sections!,
    /* One sentence, and the only field the model reliably forgets once it
       has samples to read. Throwing away a complete ten-section synopsis
       over it, and handing the visitor the shorter browser draft instead,
       costs far more than writing the sentence ourselves. */
    closing: isText(d?.closing)
      ? String(d.closing).trim()
      : `This study is designed to provide evidence that ${listOrThem(audience!)} can act on, and is a planning draft for review before use.`,
  };
}

export async function POST(request: Request) {
  const startedAt = Date.now();
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
    /* Asked three times at most. A model given this much structure
       occasionally returns a thinner draft than the brief asks for, and
       asking again is cheaper for everyone than giving the visitor a
       document that reads as notes. Three rather than two because a draft
       discarded for naming a client also spends an attempt, and a leak and
       a missing field should not compete for the same budget.

       But the host kills the function at maxDuration, and a kill is a 504
       with no body — the visitor waits the full minute and then the page
       has to guess what happened. So the attempts run against a clock and
       the route gives up a few seconds early, deliberately, which hands the
       browser-side builder a clean failure it can act on immediately. */
    let lastRaw = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      const left = DEADLINE - (Date.now() - startedAt);
      if (attempt && left < 18_000) {
        console.error(`Synopsis gave up with ${Math.round(left / 1000)}s left rather than be cut off.`);
        break;
      }
      const house = HOUSE
        ? `\n\nHouse instructions. Follow these for the content, depth and tone of every section. Where they conflict with the length guidance above, they win. The JSON shape and American English still apply.\n\n${HOUSE}`
        : "";
      const nudge = attempt
        ? "\n\nThe previous draft was rejected. Return every field in the shape, including the background, all the sections and the closing sentence. Name no company, health plan, sponsor or document: write the data sources generically, as 'a national health plan's closed claims' rather than naming one."
        : "";
      const brief = SYSTEM + house + sources + (STORE ? SAMPLES : "") + nudge;

      /* Two endpoints for one job. With samples uploaded, the request goes
         to the Responses API, which is the one that can search a vector
         store; without, it stays on chat completions, which is what has
         been drafting in production. Both are asked for JSON and both are
         checked the same way, so the samples change the writing and
         nothing else. */
      /* Bounded so one slow reply cannot eat the whole budget and leave
         nothing for a second attempt. */
      const perCall = AbortSignal.timeout(Math.max(DEADLINE - (Date.now() - startedAt) - 2_000, 5_000));

      const response = STORE
        ? await fetch(`${BASE}/responses`, {
            method: "POST",
            signal: perCall,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
            body: JSON.stringify({
              model: MODEL,
              max_output_tokens: MAX_TOKENS,
              temperature: 0.3,
              /* The brief goes in `input` rather than in `instructions`:
                 asking for a JSON format is refused unless the word appears
                 in the input messages, and `instructions` does not count. */
              input: [
                { role: "system", content: brief },
                { role: "user", content: problem },
              ],
              tools: [{ type: "file_search", vector_store_ids: [STORE] }],
              text: { format: { type: "json_object" } },
            }),
          })
        : await fetch(`${BASE}/chat/completions`, {
            method: "POST",
            signal: perCall,
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
            body: JSON.stringify({
              model: MODEL,
              max_tokens: MAX_TOKENS,
              temperature: 0.3,
              /* Guarantees syntactically valid JSON. It does not guarantee
                 the right shape, which is why the reply is still checked. */
              response_format: { type: "json_object" },
              messages: [
                { role: "system", content: brief },
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

      const data = (await response.json()) as ProviderReply;

      /* Truncation is worth naming in the log. It looks identical to a
         malformed reply from the outside, and the fix is different: the
         token ceiling is too low for the shape being asked for. */
      if (
        data.choices?.[0]?.finish_reason === "length" ||
        data.incomplete_details?.reason === "max_output_tokens"
      ) {
        console.error(`Synopsis reply hit the ${MAX_TOKENS}-token ceiling and was cut off.`);
      }

      const raw = textOf(data);

      /* Asked something that is not a research question. Said plainly rather
         than answered: a twelve-section study document whose problem
         statement reads "the user is looking for a recipe to bake sourdough
         bread" is worse than no answer, and that is what this used to
         produce. */
      if (raw && /"notAStudyQuestion"\s*:\s*true/.test(raw)) {
        return fail(
          422,
          "That does not look like a research question. Describe a condition, a population and what you need to find out — for example, adherence and total cost of care for patients starting a new therapy.",
        );
      }

      if (!raw) return fail(502, "The drafting service returned nothing.");
      lastRaw = raw;

      /* The page typesets a synopsis from its parts. A reply that is not
         that shape would be shown as a wall of raw text, which is worse
         than not answering. */
      const synopsis = asSynopsis(raw);
      if (synopsis) {
        /* Checked after the draft is assembled, so it covers every string in
           it rather than whatever the model happened to put where. */
        const named = leaks(synopsis);
        if (named.length) {
          console.error(`Synopsis draft named ${named.join(", ")}; discarded.`);
          lastRaw = raw;
          continue;
        }
        return Response.json({ synopsis: withReferences(americanizeDeep(synopsis), papers) });
      }
    }

    console.error("Synopsis reply was not the expected shape", lastRaw.slice(0, 600));
    return fail(502, "The drafting service returned an unusable draft.");
  } catch (error) {
    console.error("Synopsis request failed", error);
    return fail(502, "The drafting service could not be reached.");
  }
}
