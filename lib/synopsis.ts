/**
 * The Pharmatiya synopsis builder.
 *
 * Mirrors the live product at app.pharmatiya.net: one problem statement in,
 * one structured synopsis out, in Pharmatiya's three-step framework —
 * Step 0 Feasibility, Step 1 Retrospective Study, Step 2 Pragmatic Outreach.
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

export type Synopsis = {
  title: string;
  problem: string;
  condition: string | null;
  audience: string[];
  sources: string[];
  question: { label: string; value: string }[];
  steps: {
    step: string;
    name: string;
    sections: { heading: string; items: string[] }[];
  }[];
  value: { audience: string; message: string }[];
  review: string[];
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
  { name: "Haemophilia A", match: /ha?emophilia/i, codes: "D66 (hereditary factor VIII deficiency)" },
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
  { name: "Hospitalisations and emergency visits", match: /hospitali|admission|emergency|\bed\b visits|readmi/i },
  { name: "Healthcare resource utilisation (HCRU)", match: /utili[sz]ation|\bhcru\b|visits/i },
  { name: "Total cost of care", match: /cost|spend|economic|budget/i },
  { name: "Clinical outcomes and complications", match: /outcome|complication|mortality|survival/i },
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

/* ── Drafting ─────────────────────────────────────────────────────────── */

const DEFAULT_SOURCES = ["Medical and pharmacy claims", "EHR / EMR"];
const DEFAULT_AUDIENCE = ["Payer", "Provider", "Pharma"];
const DEFAULT_OUTCOMES = [
  "Healthcare resource utilisation (HCRU)",
  "Total cost of care",
  "Clinical outcomes and complications",
];

const VALUE: Record<string, string> = {
  Payer: "Where cost and utilisation concentrate, and which management actions change them.",
  Provider: "Which patients to prioritise, and how the care pathway performs against comparable care.",
  Pharma: "Real-world effectiveness and value evidence for access, contracting and medical affairs.",
};

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
  const hasLab = sources.some((s) => s.includes("Laboratory"));

  const population = condition
    ? `Adults with ${condition.name.charAt(0).toLowerCase()}${condition.name.slice(1)}`
    : "Adults meeting the condition definition in the problem statement";

  const diagnosis = condition
    ? `Diagnosis: ICD-10-CM ${condition.codes}`
    : "Diagnosis: the ICD-10-CM category for the condition, confirmed at feasibility";

  return {
    title: `${condition ? `${condition.name} — ` : ""}${listOf(audience)}-facing HEOR / RWE synopsis`,
    problem: text,
    condition: condition?.name ?? null,
    audience,
    sources,
    question: [
      { label: "Population", value: population },
      { label: "Exposure", value: "The therapy, pathway or intervention named in the problem statement" },
      { label: "Comparator", value: "Usual care, or patients without the exposure, matched on baseline characteristics" },
      { label: "Outcomes", value: outcomes.join("; ") },
      { label: "Time horizon", value: "12-month baseline and 12-month follow-up from the index date" },
    ],
    steps: [
      {
        step: "Step 0",
        name: "Feasibility",
        sections: [
          { heading: "Data sources", items: sources },
          {
            heading: "Cohort logic",
            items: [
              "Index date: first qualifying diagnosis, or first fill of the exposure, in the identification window",
              hasClaims
                ? "Continuous enrolment for 12 months before and after the index date"
                : "Active care in the system for 12 months before and after the index date",
              "Age 18 or over at index",
              "Diagnosis confirmed by one inpatient or two outpatient encounters at least 30 days apart",
              "Exclusions: prior exposure in the baseline period, and conditions that would confound the outcome",
            ],
          },
          {
            heading: "Code families",
            items: [
              diagnosis,
              "Treatment: NDC codes for pharmacy fills; HCPCS J-codes for administered therapies",
              "Procedures and visits: CPT and HCPCS codes, grouped by care setting",
              ...(hasEhr || hasLab ? ["Clinical: LOINC codes for laboratory values; problem-list and medication-list entries"] : []),
            ],
          },
          {
            heading: "Feasibility output",
            items: [
              "Patient counts at each inclusion and exclusion step",
              "Baseline demographics and comorbidity burden",
              "Follow-up time available, and completeness of each outcome field",
              "A go / no-go recommendation, with the reason",
            ],
          },
        ],
      },
      {
        step: "Step 1",
        name: "Retrospective study",
        sections: [
          {
            heading: "Objectives",
            items: [
              `Primary: describe and compare ${outcomes[0].charAt(0).toLowerCase()}${outcomes[0].slice(1)} between the exposure groups`,
              "Secondary: quantify resource use and cost over follow-up, and identify the subgroups carrying the most burden",
            ],
          },
          {
            heading: "Cohorts",
            items: ["Exposed cohort", "Comparator cohort, propensity-score matched on baseline characteristics"],
          },
          { heading: "Endpoints", items: outcomes },
          {
            heading: "HCRU and cost",
            items: [
              "Inpatient admissions and length of stay; emergency, outpatient and specialist visits; pharmacy fills",
              "All-cause and condition-related cost per patient per month, from the payer perspective",
            ],
          },
          {
            heading: "Statistical plan",
            items: [
              "Descriptive statistics, with standardised differences before and after matching",
              "Time to event: Kaplan–Meier estimates and Cox proportional hazards models",
              "Counts: negative binomial regression. Costs: generalised linear model, gamma distribution, log link",
              "Sensitivity analyses on the index definition, follow-up length and matching specification",
            ],
          },
        ],
      },
      {
        step: "Step 2",
        name: "Pragmatic outreach",
        sections: [
          {
            heading: "Outreach workflow",
            items: [
              "Identify the patients or members who match the Step 1 risk profile",
              "Stratify them by risk and by likelihood of benefit",
              "Reach them through the channel the population responds to, with consent captured before enrolment",
            ],
          },
          { heading: "Conversion funnel", items: ["Identified", "Contacted", "Consented", "Enrolled", "Retained to follow-up"] },
          {
            heading: "Dashboards",
            items: [
              "Enrolment against target, by site and by channel",
              "Outcomes against the matched comparator, refreshed at every data cut",
            ],
          },
          {
            heading: "RWE activation",
            items: [
              "Publication and conference plan",
              "Evidence packaged for formulary, contracting and guideline conversations",
            ],
          },
        ],
      },
    ],
    value: audience.map((a) => ({ audience: a, message: VALUE[a] })),
    review: [
      "A planning draft, not a protocol. A Pharmatiya researcher reviews every synopsis before it is used with a client.",
      "Code lists, windows and sample sizes are confirmed against the chosen data source at feasibility.",
      "No protected health information is needed, and none is accepted.",
    ],
  };
}

/** Plain text, for copying and downloading. */
export function synopsisToText(s: Synopsis): string {
  const lines: string[] = [s.title.toUpperCase(), "", "PROBLEM STATEMENT", s.problem, "", "STUDY QUESTION"];
  s.question.forEach((q) => lines.push(`${q.label}: ${q.value}`));
  s.steps.forEach((step) => {
    lines.push("", `${step.step.toUpperCase()} — ${step.name.toUpperCase()}`);
    step.sections.forEach((section) => {
      lines.push(`${section.heading}:`);
      section.items.forEach((item) => lines.push(`  - ${item}`));
    });
  });
  lines.push("", "VALUE BY STAKEHOLDER");
  s.value.forEach((v) => lines.push(`${v.audience}: ${v.message}`));
  lines.push("", "REVIEW");
  s.review.forEach((r) => lines.push(`- ${r}`));
  lines.push("", "Pharmatiya Health");
  return lines.join("\n");
}

/* ── Service mode ─────────────────────────────────────────────────────── */

const api = process.env.NEXT_PUBLIC_SYNOPSIS_API;

export type BuildResult =
  | { kind: "structured"; synopsis: Synopsis }
  | { kind: "text"; text: string };

export async function buildSynopsis(problem: string): Promise<BuildResult> {
  if (api) {
    const response = await fetch(api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem }),
    });
    const data = (await response.json()) as { synopsis?: string; error?: string };
    if (!response.ok || data.error || !data.synopsis) {
      throw new Error(data.error ?? `Synopsis service returned ${response.status}`);
    }
    return { kind: "text", text: data.synopsis };
  }
  // A short pause. The draft is instant, and a result that appears with no
  // transition reads as the page jumping rather than as work being done.
  await new Promise((resolve) => setTimeout(resolve, 650));
  return { kind: "structured", synopsis: draftSynopsis(problem) };
}
