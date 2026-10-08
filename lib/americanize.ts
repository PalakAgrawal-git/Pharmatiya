/**
 * Synopses are written for a US audience, so they are spelled in American
 * English. The drafting prompt asks the model for it, but a model drifts, so
 * the words that matter in HEOR and RWE writing are also normalised here,
 * after the fact, on every string of the finished synopsis.
 */

const WORDS: Record<string, string> = {
  // -isation / -ise
  hospitalisation: "hospitalization", hospitalisations: "hospitalizations",
  utilisation: "utilization", utilisations: "utilizations",
  standardisation: "standardization", standardised: "standardized", standardise: "standardize",
  generalised: "generalized", generalise: "generalize", generalisation: "generalization",
  randomised: "randomized", randomise: "randomize", randomisation: "randomization",
  characterised: "characterized", characterise: "characterize", characterisation: "characterization",
  categorised: "categorized", categorise: "categorize", categorisation: "categorization",
  stratified: "stratified",
  prioritise: "prioritize", prioritised: "prioritized", prioritising: "prioritizing", prioritisation: "prioritization",
  optimise: "optimize", optimised: "optimized", optimisation: "optimization",
  summarise: "summarize", summarised: "summarized", summarising: "summarizing",
  organisation: "organization", organisations: "organizations", organisational: "organizational",
  organised: "organized", organise: "organize",
  recognise: "recognize", recognised: "recognized",
  minimise: "minimize", minimised: "minimized",
  maximise: "maximize", maximised: "maximized",
  analyse: "analyze", analysed: "analyzed", analyses: "analyses", analysing: "analyzing",
  operationalise: "operationalize", operationalised: "operationalized",
  individualise: "individualize", individualised: "individualized",
  stabilise: "stabilize", stabilised: "stabilized",
  normalise: "normalize", normalised: "normalized",
  harmonise: "harmonize", harmonised: "harmonized",
  finalise: "finalize", finalised: "finalized",
  authorise: "authorize", authorised: "authorized",
  specialised: "specialized", specialisation: "specialization",
  visualise: "visualize", visualised: "visualized", visualisation: "visualization",
  centralised: "centralized", digitised: "digitized", mobilise: "mobilize", sensitised: "sensitized",
  // -our
  behaviour: "behavior", behaviours: "behaviors", behavioural: "behavioral",
  favour: "favor", favourable: "favorable", favoured: "favored",
  colour: "color", labour: "labor", honour: "honor", neighbourhood: "neighborhood", neighbourhoods: "neighborhoods",
  // -re
  centre: "center", centres: "centers", fibre: "fiber", litre: "liter", litres: "liters", metre: "meter", metres: "meters",
  // medical
  haemophilia: "hemophilia", haemoglobin: "hemoglobin", haemorrhage: "hemorrhage", haemorrhagic: "hemorrhagic",
  anaemia: "anemia", anaemic: "anemic", leukaemia: "leukemia", septicaemia: "septicemia",
  oedema: "edema", oesophageal: "esophageal", oesophagus: "esophagus", paediatric: "pediatric", paediatrics: "pediatrics",
  gynaecology: "gynecology", gynaecological: "gynecological", orthopaedic: "orthopedic", orthopaedics: "orthopedics",
  diarrhoea: "diarrhea", foetal: "fetal", foetus: "fetus", oestrogen: "estrogen",
  ischaemia: "ischemia", ischaemic: "ischemic", hyperglycaemia: "hyperglycemia", hypoglycaemia: "hypoglycemia",
  hypercholesterolaemia: "hypercholesterolemia", dyslipidaemia: "dyslipidemia", glycaemic: "glycemic",
  // general
  enrolment: "enrollment", enrolments: "enrollments", enrol: "enroll", enrols: "enrolls",
  programme: "program", programmes: "programs",
  licence: "license", defence: "defense", offence: "offense", pretence: "pretense",
  judgement: "judgment", ageing: "aging", grey: "gray", catalogue: "catalog", catalogues: "catalogs",
  whilst: "while", amongst: "among", towards: "toward", practise: "practice", practised: "practiced",
  artefact: "artifact", artefacts: "artifacts", cheque: "check", tyre: "tire", mould: "mold",
  modelling: "modeling", modelled: "modeled", labelling: "labeling", labelled: "labeled",
  cancelled: "canceled", cancelling: "canceling", travelling: "traveling", fulfil: "fulfill", fulfils: "fulfills",
  skilful: "skillful", instalment: "installment", sceptical: "skeptical", plough: "plow",
  analogue: "analog", dialogue: "dialogue", paracetamol: "acetaminophen",
  // Common slips seen in client input
  organsation: "organization", organsations: "organizations", organisaton: "organization",
};

const PATTERN = new RegExp(
  `\\b(${Object.keys(WORDS)
    .filter((w) => w !== WORDS[w])
    .sort((a, b) => b.length - a.length)
    .join("|")})\\b`,
  "gi",
);

/* -isation is always British, so it is a rule rather than a list. -ise is
   not (otherwise, exercise, advise), so those stay on the list above. */
const ISATION = /\b(\w+?)isation(s|al)?\b/gi;

/** Americanizes one string, keeping the capitalization of each word it changes. */
export function americanize(text: string): string {
  const rule = text.replace(ISATION, (_m, stem: string, tail = "") =>
    stem === stem.toUpperCase() && stem.length > 1
      ? `${stem}IZATION${tail.toUpperCase()}`
      : `${stem}ization${tail}`);
  return rule.replace(PATTERN, (match) => {
    const replacement = WORDS[match.toLowerCase()];
    if (match === match.toUpperCase() && match.length > 1) return replacement.toUpperCase();
    if (match[0] === match[0].toUpperCase()) return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    return replacement;
  });
}

/** Americanizes every string inside a JSON-like value, leaving its shape alone. */
export function americanizeDeep<T>(value: T): T {
  if (typeof value === "string") return americanize(value) as T;
  if (Array.isArray(value)) return value.map(americanizeDeep) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, americanizeDeep(v)]),
    ) as T;
  }
  return value;
}
