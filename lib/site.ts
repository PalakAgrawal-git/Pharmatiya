/**
 * Site-wide constants.
 *
 * Values marked PENDING are placeholders for client inputs that had not
 * landed at build time. Each names the input number from the Phase 1
 * architecture document so it is traceable.
 */

export const site = {
  name: "Pharmatiya Health",
  legalName: "Pharmatiya LLC",
  tagline: "Healthcare Research & Analytics",
  url: "https://www.pharmatiya.net",

  // Retained verbatim from the current site's footer.
  address: {
    locality: "New York",
    region: "NY",
    postalCode: "10280",
    country: "US",
  },

  // PENDING input 6 — confirm whether admin@ remains the public address.
  email: "admin@pharmatiya.net",

  // The existing application. Path preserved so current users keep their route.
  appUrl: "https://app.pharmatiya.net",

  // PENDING — product naming decision. The brief says "NextGen AI"; the live
  // navigation says "RWE - Builder". Change here to switch it site-wide.
  productName: "NextGen AI",
  productLegacyName: "RWE - Builder",
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services/", label: "Services" },
  { href: "/evidence/", label: "Evidence" },
  { href: "/nextgen-ai/", label: "NextGen AI" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Contact" },
] as const;

/**
 * Proof figures. `pending: true` renders a marked placeholder rather than a
 * number — nothing here is invented to fill a layout.
 */
export const proofFigures = [
  { value: "25+", label: "years in HEOR, RWE and outcomes research" },
  {
    value: "1,000+",
    label: "study synopses delivered",
    // Appears only in the brief; not corroborated on the current site.
    unverified: true,
  },
  { value: null, label: "therapeutic areas", pending: true },
  { value: null, label: "datasets worked", pending: true },
] as const;

export const services = [
  {
    id: "evidence-generation",
    name: "Evidence generation",
    problem:
      "Your trial answered a controlled question. Payers and HTA bodies are asking an uncontrolled one.",
    approach:
      "We start with the decision the evidence has to support, not with a study design. Feasibility comes first — whether the question can be answered with data that exists — and only then do we write a protocol. Senior researchers stay on the work from design through interpretation.",
    methodology: [
      "Study design and feasibility assessment",
      "Protocol development",
      "Survival analysis",
      "Propensity scoring",
      "Multivariate modelling",
    ],
    deliverables: [
      "Protocol document",
      "Statistical analysis plan",
      "Analysis datasets and code",
      "Results report with interpretation",
    ],
    deliverablesPending: true,
    cta: "Discuss an evidence-generation project",
  },
  {
    id: "rwe-analytics",
    name: "Real-world data analytics",
    problem:
      "You hold claims or EHR data and no analytic capacity to interrogate it.",
    approach:
      "We build the cohort, run the statistics and hand back something you can act on — including the code, so the work is reproducible rather than a black box. Extraction and analysis are done by the same team, which is why the cohort definition survives contact with the data.",
    methodology: [
      "SQL extraction across Hadoop, Teradata and TOAD",
      "Analysis in SAS and SPSS",
      "Logistic regression and ANOVA",
      "Machine learning on hierarchical files",
      "Cohort development and risk stratification",
    ],
    deliverables: [
      "Defined cohort with attrition accounting",
      "Risk stratification model",
      "Analysis code",
      "Results and interpretation",
    ],
    deliverablesPending: true,
    cta: "Discuss an analytics project",
  },
  {
    id: "access-strategy",
    name: "Access & value strategy",
    problem: "You have the evidence. The payer conversation still stalls.",
    approach:
      "Evidence does not move an access decision on its own; it has to be framed for the person making it. We have sat on the payer side of that table, and we build the value case in the terms a plan actually evaluates — clinical and administrative measures that are simple enough to execute and quick enough to show a return.",
    methodology: [
      "Value proposition development",
      "Value-based and outcomes-based contract design",
      "Care management programme design",
      "Payer–provider value propositions",
    ],
    deliverables: [
      "Value dossier",
      "Contract framework",
      "Payer-ready summary",
    ],
    deliverablesPending: true,
    cta: "Discuss an access engagement",
  },
] as const;

/**
 * Methods and datasets. Every item is stated on the current About page —
 * nothing has been added.
 */
export const methods = {
  design: [
    "Retrospective observational",
    "Prospective pragmatic",
    "Epidemiology and burden of illness",
    "Cohort development",
    "Risk stratification",
  ],
  statistics: [
    "Logistic regression",
    "ANOVA",
    "Survival analysis",
    "Propensity scores",
    "Multivariate models",
    "Machine learning techniques",
  ],
  engineering: [
    "SQL extraction",
    "Hadoop",
    "Teradata",
    "TOAD",
    "SAS",
    "SPSS",
    "Hierarchical data files",
  ],
} as const;

export const datasetCoverage = [
  { group: "Payer", types: ["Medical claims", "Eligibility", "Formulary"] },
  { group: "Provider", types: ["EMR", "EHR", "Registry"] },
  { group: "Claims & pharmacy", types: ["Pharmacy Rx", "Medical", "External lab"] },
] as const;

/**
 * PENDING input 4 — dataset name clearance. These organisations are named on
 * the current About page, but public use has not been cleared. Set
 * `cleared: true` per entry once confirmed; until then the UI shows dataset
 * types only and suppresses every name.
 */
export const namedSources = [
  { name: "Aetna / CVS", cleared: false },
  { name: "Cigna", cleared: false },
  { name: "Select Health", cleared: false },
  { name: "MedStar", cleared: false },
  { name: "Express Scripts", cleared: false },
  { name: "Komodo", cleared: false },
  { name: "Intermountain Healthcare", cleared: false },
] as const;

/**
 * Therapeutic areas corroborated on the current About page. The list is
 * deliberately short — additions require client confirmation.
 */
export const therapeuticAreas = [
  { area: "Wound care", note: "EHR-based analysis" },
  { area: "Lung transplant", note: "EHR-based analysis" },
  { area: "Congestive heart failure", note: "Care management" },
  { area: "Diabetes", note: "Care management" },
  { area: "Medication adherence", note: "Claims-based" },
  { area: "Opioid utilisation", note: "Claims-based" },
] as const;

/**
 * PENDING input 2 — case studies. Empty by design: the Evidence page renders
 * an honest confidentiality statement instead of invented cases.
 */
export const caseStudies: {
  id: string;
  area: string;
  challenge: string;
  dataset: string;
  methodology: string;
  approach: string;
  outcome: string;
}[] = [];
