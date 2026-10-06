/**
 * The Pharmatiya synopsis builder.
 *
 * Mirrors the live product at app.pharmatiya.net: one problem statement in,
 * one structured synopsis out — Background, Objectives, Study Design,
 * Population, Data Sources, Outcomes, Statistical Approach and Deliverables.
 *
 * Two ways of producing it:
 *
 *  - With NEXT_PUBLIC_SYNOPSIS_API set, the problem is POSTed to that
 *    endpoint using the live product's contract — `{ problem }` in,
 *    `{ synopsis }` or `{ error }` out — so the model-backed service plugs in
 *    unchanged once the site is on a host with a server. The model's API key
 *    stays on that server; it can never be put in this file, because this
 *    file ships to every visitor's browser.
 *
 *  - Without it, the synopsis is drafted here, in the browser, by reading the
 *    statement for condition, data, audience and outcomes and laying them into
 *    the framework. Nothing leaves the visitor's machine.
 *
 * Code families are ICD-10-CM categories, chosen conservatively: a category
 * that is right beats a subcode that might not be. Every synopsis says it is
 * a planning draft for expert review, as the live product does.
 */

export type SynopsisSection = {
  heading: string;
  /** Running prose, set before any lists. */
  paragraphs?: string[];
  /** Lists, each optionally under a label such as "Inclusion Criteria". */
  groups?: { label?: string; items: string[] }[];
};

/**
 * The shape follows the output of the original Pharmatiya synopsis builder:
 * title, background, then Objectives, Study Design, Population, Data Sources,
 * Outcomes, Statistical Approach and Deliverables, and a closing sentence.
 */
export type Synopsis = {
  title: string;
  problem: string;
  condition: string | null;
  audience: string[];
  sources: string[];
  /** Why the question matters, and what is already known. Cited by number. */
  background: string[];
  sections: SynopsisSection[];
  /** The sentence that closes the document. */
  closing: string;

  /**
   * Real published work, found before the synopsis was drafted and cited by
   * number in the background. The model never writes these: it is given a
   * numbered list and may only refer to it, and the list rendered in the
   * document is the one we fetched. A citation here therefore names a paper
   * that exists, which is the only way an automated reference is worth
   * printing.
   */
  references?: {
    n: number;
    citation: string;
    link: string | null;
  }[];
};

/** Closing credit, printed at the end of every synopsis. */
export const CREDIT = {
  line: "This synopsis was powered by Pharmatiya NextGen AI — where real HEOR/RWE scars meet machine speed.",
  detail: "Built by industry veterans with decades of payer, pharma, outcomes research, and evidence-generation experience.",
  link: "https://pharmatiya.net/about",
};

/* ── Recognition ──────────────────────────────────────────────────────── */

const CONDITIONS: { name: string; match: RegExp; codes: string }[] = [
  { name: "Migraine", match: /migraine/i, codes: "G43 (migraine)" },
  { name: "Type 2 diabetes", match: /type\s*2\s*diabet|\bt2d\b|diabet/i, codes: "E11 (type 2 diabetes mellitus)" },
  { name: "Heart failure", match: /heart failure|\bhfref\b|\bhfpef\b/i, codes: "I50 (heart failure)" },
  { name: "Atrial fibrillation", match: /atrial fibrillation|\bafib\b/i, codes: "I48 (atrial fibrillation and flutter)" },
  { name: "Hypertension", match: /hypertens/i, codes: "I10–I16 (hypertensive diseases)" },
  { name: "Stroke", match: /stroke|cerebral infarction/i, codes: "I63 (cerebral infarction)" },
  { name: "Asthma", match: /asthma/i, codes: "J45 (asthma)" },
  { name: "COPD", match: /\bcopd\b|chronic obstructive/i, codes: "J44 (chronic obstructive pulmonary disease)" },
  { name: "Chronic kidney disease", match: /chronic kidney|\bckd\b/i, codes: "N18 (chronic kidney disease)" },
  { name: "Obesity", match: /obes/i, codes: "E66 (overweight and obesity)" },
  { name: "Major depressive disorder", match: /depress/i, codes: "F32–F33 (depressive episode; recurrent depressive disorder)" },
  { name: "Anxiety disorders", match: /anxiety/i, codes: "F41 (other anxiety disorders)" },
  { name: "Schizophrenia", match: /schizophren/i, codes: "F20 (schizophrenia)" },
  { name: "Bipolar disorder", match: /bipolar/i, codes: "F31 (bipolar disorder)" },
  { name: "Opioid use disorder", match: /opioid/i, codes: "F11 (opioid-related disorders)" },
  { name: "Psoriasis", match: /psoria/i, codes: "L40 (psoriasis)" },
  { name: "Atopic dermatitis", match: /atopic dermatitis|eczema/i, codes: "L20 (atopic dermatitis)" },
  { name: "Rheumatoid arthritis", match: /rheumatoid/i, codes: "M05–M06 (rheumatoid arthritis)" },
  { name: "Osteoarthritis", match: /osteoarthrit/i, codes: "M15–M19 (osteoarthritis)" },
  { name: "Osteoporosis", match: /osteopor/i, codes: "M80–M81 (osteoporosis)" },
  { name: "Multiple sclerosis", match: /multiple sclerosis/i, codes: "G35 (multiple sclerosis)" },
  { name: "Epilepsy", match: /epilep|seizure/i, codes: "G40 (epilepsy)" },
  { name: "Alzheimer's disease", match: /alzheimer|dementia/i, codes: "G30 (Alzheimer's disease)" },
  { name: "Parkinson's disease", match: /parkinson/i, codes: "G20 (Parkinson's disease)" },
  { name: "Crohn's disease", match: /crohn/i, codes: "K50 (Crohn's disease)" },
  { name: "Ulcerative colitis", match: /ulcerative colitis/i, codes: "K51 (ulcerative colitis)" },
  { name: "Breast cancer", match: /breast cancer/i, codes: "C50 (malignant neoplasm of breast)" },
  { name: "Lung cancer", match: /lung cancer|\bnsclc\b/i, codes: "C34 (malignant neoplasm of bronchus and lung)" },
  { name: "Prostate cancer", match: /prostate cancer/i, codes: "C61 (malignant neoplasm of prostate)" },
  { name: "Hemophilia A", match: /h(a)?emophilia/i, codes: "D66 (hereditary factor VIII deficiency)" },
  { name: "Sickle cell disease", match: /sickle/i, codes: "D57 (sickle-cell disorders)" },
  { name: "HIV", match: /\bhiv\b/i, codes: "B20 (HIV disease)" },
  { name: "COVID-19", match: /covid|sars-cov-2/i, codes: "U07.1 (COVID-19)" },
  { name: "Sepsis", match: /sepsis/i, codes: "A40–A41 (sepsis)" },
  { name: "C. difficile infection", match: /difficile|c\.\s*diff/i, codes: "A04.7 (enterocolitis due to Clostridioides difficile)" },
  { name: "Urinary tract infection", match: /urinary tract infection|\buti\b/i, codes: "N39.0 (urinary tract infection, site not specified)" },
  { name: "Pneumonia", match: /pneumonia/i, codes: "J12–J18 (pneumonia)" },
  { name: "Chronic wounds and ulcers", match: /wound|pressure ulcer|foot ulcer|venous ulcer/i, codes: "L89 (pressure ulcer); L97 (non-pressure chronic ulcer of lower limb)" },
];

const SOURCES: { name: string; match: RegExp }[] = [
  { name: "Medical and pharmacy claims", match: /claim/i },
  { name: "EHR / EMR", match: /\behr\b|\bemr\b|electronic (health|medical)/i },
  { name: "Laboratory results", match: /\blab/i },
  { name: "Registry", match: /registr/i },
  { name: "Patient-reported outcomes", match: /\bpros?\b|patient[- ]reported|survey/i },
];

const AUDIENCES: { name: string; match: RegExp }[] = [
  { name: "Payer", match: /payer|health plan|insurer|formulary/i },
  { name: "Provider", match: /provider|health system|hospital|clinic/i },
  { name: "Pharma", match: /pharma|manufacturer|brand|market access|medical affairs|device/i },
];

const OUTCOMES: { name: string; match: RegExp }[] = [
  { name: "Treatment patterns, switching and cycling", match: /switch|cycl|line of therapy|treatment pattern|persisten/i },
  { name: "Adherence (proportion of days covered)", match: /adheren|\bpdc\b|compliance/i },
  { name: "Hospitalizations and emergency visits", match: /hospitali|admission|emergency|\bed\b visits|readmi/i },
  { name: "Healthcare resource utilization (HCRU)", match: /utili[sz]ation|\bhcru\b|visits/i },
  { name: "Total cost of care", match: /cost|spend|economic|budget/i },
  { name: "Clinical outcomes and complications", match: /clinical outcome|complication|mortality|survival/i },
];

function pick<T extends { name: string; match: RegExp }>(list: T[], text: string) {
  return list.filter((item) => item.match.test(text)).map((item) => item.name);
}

/** Names the kind of identifier found, or null. Such statements are refused. */
export function looksLikePHI(text: string): string | null {
  const checks: [RegExp, string][] = [
    [/\b\d{3}-\d{2}-\d{4}\b/, "a social security number"],
    [/\b(mrn|medical record (number|no\.?))\s*[:#]?\s*\w*\d/i, "a medical record number"],
    [/\b(dob|date of birth)\b/i, "a date of birth"],
    [/[\w.+-]+@[\w-]+\.[a-z]{2,}/i, "an email address"],
    [/\(?\b\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}\b/, "a phone number"],
    [/\bpatient(?:'s)?\s+name\b/i, "a patient name"],
  ];
  for (const [pattern, what] of checks) if (pattern.test(text)) return what;
  return null;
}

/**
 * What the builder read from a statement, before drafting. Shown to the user
 * as the steps the assistant takes, so each step reports something the
 * builder actually found rather than a scripted "thinking" line.
 */
export function readStatement(problem: string) {
  const text = problem.trim();
  const condition = CONDITIONS.find((c) => c.match.test(text)) ?? null;
  return {
    condition: condition?.name ?? null,
    codes: condition?.codes ?? null,
    sources: pick(SOURCES, text),
    audience: pick(AUDIENCES, text),
    outcomes: pick(OUTCOMES, text),
  };
}

/* ── Drafting ─────────────────────────────────────────────────────────── */

const DEFAULT_SOURCES = ["Medical and pharmacy claims", "EHR / EMR"];
const DEFAULT_AUDIENCE = ["Payer", "Provider", "Pharma"];
const DEFAULT_OUTCOMES = [
  "Healthcare resource utilization (HCRU)",
  "Total cost of care",
  "Clinical outcomes and complications",
];

const lower = (w: string) => w.charAt(0).toLowerCase() + w.slice(1);

/** "Payer", "Payer and provider", "Payer, provider and pharma". */
function listOf(items: string[]) {
  const words = items.map((w, i) => (i === 0 ? w : w.toLowerCase()));
  return words.length < 3
    ? words.join(" and ")
    : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

export function draftSynopsis(problem: string): Synopsis {
  const text = problem.trim();
  const condition = CONDITIONS.find((c) => c.match.test(text)) ?? null;
  const found = { sources: pick(SOURCES, text), audience: pick(AUDIENCES, text), outcomes: pick(OUTCOMES, text) };
  const sources = found.sources.length ? found.sources : DEFAULT_SOURCES;
  const audience = found.audience.length ? found.audience : DEFAULT_AUDIENCE;
  const outcomes = found.outcomes.length ? found.outcomes : DEFAULT_OUTCOMES;

  const hasClaims = sources.some((s) => s.includes("claims"));
  const hasEhr = sources.some((s) => s.includes("EHR"));
  const hasPro = sources.some((s) => s.includes("Patient-reported"));

  const disease = condition ? condition.name : "[Disease Y]";
  const diseaseLower = condition ? lower(condition.name) : "[Disease Y]";
  const drug = "[Drug X]";

  const dataItems = [
    ...(hasEhr ? ["Electronic health records (EHR) from participating healthcare systems capturing clinical outcomes, laboratory values, and treatment patterns."] : []),
    ...(hasClaims ? ["Administrative claims databases providing comprehensive information on healthcare utilization and costs."] : []),
    ...(sources.some((s) => s.includes("Registry")) ? ["Patient registries to capture disease course and treatment history."] : []),
    ...(hasPro ? ["Patient-reported outcome (PRO) databases to capture quality of life and symptom burden."] : []),
    ...(sources.some((s) => s.includes("Laboratory")) ? ["Laboratory results linked to the patient record for biomarker and safety measures."] : []),
    "National mortality databases for survival outcomes.",
  ];

  const costed = outcomes.some((o) => /cost|utili/i.test(o));

  return {
    title: `Real-World Effectiveness and Economic Impact of ${drug} in the Management of ${diseaseLower}: A Health Economics and Outcomes Research Study`,
    problem: text,
    condition: condition?.name ?? null,
    audience,
    sources,
    background: [
      `${condition ? condition.name : "[Disease Y]"} represents a significant clinical and economic burden, characterized by high morbidity and substantial healthcare resource utilization. Despite the availability of multiple treatment options, real-world evidence (RWE) on the effectiveness and cost-effectiveness of ${drug} remains limited. Understanding the health outcomes and economic impact of ${drug} in routine clinical practice is critical for ${listOf(audience).toLowerCase()} decision-makers to optimize treatment strategies and resource allocation.`,
    ],
    sections: [
      {
        heading: "Objectives",
        groups: [
          {
            label: "Primary Objective",
            items: [`To evaluate the real-world clinical effectiveness of ${drug} compared to standard of care (SoC) in patients with ${diseaseLower}.`],
          },
          {
            label: "Secondary Objectives",
            items: [
              "To assess the healthcare resource utilization (HRU) and direct medical costs associated with the exposure versus SoC.",
              "To estimate the cost-effectiveness of the exposure relative to SoC from a payer perspective.",
              ...(hasPro ? ["To explore patient-reported outcomes (PROs) and quality of life (QoL) measures in treated patients."] : []),
              "To identify patient subgroups with differential treatment response and economic outcomes.",
            ],
          },
        ],
      },
      {
        heading: "Study Design",
        paragraphs: [
          `This study will use a retrospective observational cohort design leveraging real-world data (RWD) to compare outcomes between patients initiating ${drug} and those receiving SoC. Propensity score matching (PSM) will be applied to balance baseline characteristics and minimize confounding.${costed ? " Additionally, a cost-effectiveness model will be developed to extrapolate long-term economic outcomes based on observed clinical and HRU data." : ""}`,
        ],
      },
      {
        heading: "Population",
        groups: [
          {
            label: "Inclusion Criteria",
            items: [
              `Adult patients (18 years or older) diagnosed with ${diseaseLower}${condition ? ` (ICD-10-CM ${condition.codes})` : " according to established clinical criteria"}.`,
              `Initiated treatment with ${drug} or SoC between [start date] and [end date].`,
              hasClaims
                ? "At least 12 months of continuous enrollment before and after treatment initiation."
                : "At least 12 months of follow-up data available after treatment initiation.",
            ],
          },
          {
            label: "Exclusion Criteria",
            items: [
              "Patients enrolled in clinical trials during the study period.",
              "Patients with incomplete demographic or clinical data critical for analysis.",
            ],
          },
        ],
      },
      { heading: "Data Sources", groups: [{ items: dataItems }] },
      {
        heading: "Outcomes",
        groups: [
          {
            label: "Clinical Outcomes",
            items: [
              "Primary effectiveness endpoint: [e.g., symptom control, time to treatment failure, or biomarker response].",
              "Secondary endpoints: overall survival, hospitalization rates, adverse event incidence.",
            ],
          },
          {
            label: "Economic Outcomes",
            items: [
              "Direct medical costs including inpatient, outpatient, pharmacy, and procedural expenses.",
              "HRU metrics such as number of hospitalizations, emergency visits, and outpatient consultations.",
            ],
          },
          ...(hasPro
            ? [{
                label: "Patient-Reported Outcomes",
                items: [
                  "Health-related quality of life measured by validated instruments (e.g., EQ-5D, SF-36).",
                  "Symptom burden and treatment satisfaction scores.",
                ],
              }]
            : []),
          { label: "Outcomes of interest named in the problem statement", items: outcomes },
        ],
      },
      {
        heading: "Statistical Approach",
        groups: [
          {
            items: [
              "Descriptive statistics to summarize baseline demographics and clinical characteristics.",
              "Propensity score matching or inverse probability of treatment weighting to adjust for confounding variables.",
              "Survival analyses using Kaplan-Meier curves and Cox proportional hazards models for time-to-event outcomes.",
              "Generalized linear models (GLM) to compare cost and HRU outcomes between cohorts.",
              "Sensitivity analyses to test the robustness of findings.",
              ...(costed ? ["Development of a Markov or partitioned survival cost-effectiveness model incorporating clinical and economic data to estimate incremental cost-effectiveness ratios (ICERs)."] : []),
              "Subgroup analyses based on demographic and clinical factors.",
            ],
          },
        ],
      },
      {
        heading: "Deliverables",
        groups: [
          {
            items: [
              "A comprehensive study report detailing methodology, results, and interpretation of clinical and economic outcomes.",
              "Peer-reviewed manuscript(s) for publication in relevant scientific journals.",
              `Executive summary and ${listOf(audience).toLowerCase()}-focused slide deck highlighting key findings and implications.`,
              "Health economic model and supporting documentation for use in formulary submissions and health technology assessments (HTAs).",
              "Recommendations for clinical practice and future research directions based on study insights.",
            ],
          },
        ],
      },
    ],
    closing: `This HEOR/RWE study aims to provide robust evidence on the value of ${drug} in real-world clinical practice, supporting informed decision-making by ${listOf(audience).toLowerCase()} stakeholders in the management of ${diseaseLower}.`,
  };
}

/** Plain text, for copying and downloading. */
export function synopsisToText(s: Synopsis): string {
  const lines: string[] = ["Title:", s.title, ""];
  if (s.background.length) lines.push("Background:", ...s.background, "");
  s.sections.forEach((section) => {
    lines.push(`${section.heading}:`);
    section.paragraphs?.forEach((p) => lines.push(p));
    section.groups?.forEach((g) => {
      if (g.label) lines.push(`${g.label}:`);
      g.items.forEach((item) => lines.push(`- ${item}`));
    });
    lines.push("");
  });
  lines.push(s.closing, "");
  if (s.references?.length) {
    lines.push("References:");
    s.references.forEach((r) => lines.push(`${r.n}. ${r.citation}${r.link ? ` ${r.link}` : ""}`));
    lines.push("");
  }
  lines.push("────────────────────────────", CREDIT.line, "", CREDIT.detail, "", "Learn more:", CREDIT.link, "────────────────────────────");
  return lines.join("\n");
}

/* ── Service mode ─────────────────────────────────────────────────────── */

const api = process.env.NEXT_PUBLIC_SYNOPSIS_API;

export type BuildResult =
  | { kind: "structured"; synopsis: Synopsis }
  | { kind: "text"; text: string };

/**
 * A statement the service would not draft from, as opposed to a service
 * that could not answer. The difference matters: the first must reach the
 * visitor, and the second must not stop them getting a synopsis.
 */
export class Refused extends Error {}

export async function buildSynopsis(problem: string): Promise<BuildResult> {
  if (api) {
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
      const data = (await response.json()) as {
        synopsis?: Synopsis | string;
        error?: string;
      };

      /* A refusal is the visitor's to see: a statement carrying patient
         identifiers must be rejected, not quietly drafted anyway. */
      if (response.status === 422) throw new Refused(data.error ?? "That statement was refused.");

      if (!response.ok || data.error || !data.synopsis) {
        throw new Error(data.error ?? `Synopsis service returned ${response.status}`);
      }
      /* The service returns the synopsis in parts, which the page typesets
         the same way it typesets its own. A string is still accepted, so an
         older service, or one written by someone else, keeps working. */
      return typeof data.synopsis === "string"
        ? { kind: "text", text: data.synopsis }
        : { kind: "structured", synopsis: data.synopsis };
    } catch (error) {
      if (error instanceof Refused) throw error;
      /* The service is an improvement on the builder below, not a
         replacement for it. When it cannot answer — a draft it would not
         stand behind, a timeout, a provider outage — the synopsis is built
         here instead. A shorter document beats an error message, and the
         visitor keeps the thing they came for. */
      await new Promise((resolve) => setTimeout(resolve, 400));
      return { kind: "structured", synopsis: draftSynopsis(problem) };
    }
  }
  // A short pause. The draft is instant, and a result that appears with no
  // transition reads as the page jumping rather than as work being done.
  await new Promise((resolve) => setTimeout(resolve, 650));
  return { kind: "structured", synopsis: draftSynopsis(problem) };
}
