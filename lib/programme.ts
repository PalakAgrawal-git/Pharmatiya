import publicationData from "@/data/publications.json";

/**
 * The mSToPS programme — the landmark study, and the point it proves.
 *
 * What makes it worth a section of its own is not the trial alone but who
 * ran it: a manufacturer, a research institute and a national health plan on
 * one author list, working on one question. That arrangement was unusual in
 * 2016 and is ordinary now.
 *
 * Every organisation named here is named on the JAMA paper's own author
 * affiliations (JAMA. 2018;320(2):146-155), and the funding line is quoted
 * from it. The later three-year outcomes paper (PLOS ONE 2021) is *not*
 * included: our principal is not an author on it, and this list only claims
 * work he did.
 */

type Entry = { id: string; year: number | null; venue: string | null; link: string | null };

const entries = publicationData.publications as Entry[];

export const partners = [
  {
    role: "Manufacturer",
    name: "Janssen Scientific Affairs",
    note: "Sponsored the trial and sat on the author list, through a research grant to Scripps.",
  },
  {
    role: "Research institute",
    name: "Scripps Translational Science Institute",
    note: "Designed and ran the trial, and held the grant.",
  },
  {
    role: "Health plan",
    name: "Healthagen Outcomes",
    note: "The analytics business of a national health plan. Identified the at-risk population from claims, and measured what happened next. Our principal worked here.",
  },
];

/** Inside the manufacturer. Our own account of the engagement. */
export const departments = [
  "Market access",
  "Commercial",
  "R&D",
  "Medical affairs",
];

/** The programme's outputs that our principal co-authored, oldest first. */
const OUTPUTS: { id: string; label: string }[] = [
  { id: "p17", label: "Rationale and design of the trial" },
  { id: "p15", label: "Digital recruitment of a nationwide cohort" },
  { id: "p14", label: "Screening an at-risk population nationwide" },
  { id: "p13", label: "An end-to-end trial inside a health insurance system" },
  { id: "p7", label: "Primary trial result" },
  { id: "p6", label: "What the recruitment model taught us" },
];

export const outputs = OUTPUTS.map((output) => {
  const entry = entries.find((e) => e.id === output.id);
  return {
    ...output,
    year: entry?.year ?? null,
    venue: entry?.venue ?? null,
    link: entry?.link ?? null,
  };
}).sort((a, b) => (a.year ?? 0) - (b.year ?? 0));

/* Related, but not an mSToPS output: a multi-institution review of the
   method the trial is an example of. Kept separate so the programme list
   claims only the programme. */
export const related = {
  label: "Technology-Enabled Clinical Trials",
  venue: "Circulation",
  year: 2019,
  link: entries.find((e) => e.id === "p5")?.link ?? null,
};

export const programme = {
  name: "mSToPS",
  full: "mHealth Screening To Prevent Strokes",
  citation: "Steinhubl SR, Waalen J, Edwards AM, Ariniello LM, Mehta RR, et al. JAMA. 2018;320(2):146-155.",
  link: "https://doi.org/10.1001/jama.2018.8102",
  funding:
    "Supported by a research grant from Janssen Pharmaceuticals to the Scripps Translational Science Institute.",
  figures: [
    { value: "2,659", label: "randomised, nationwide, with no study site" },
    { value: "1,738", label: "actively monitored with 12-month follow-up" },
    { value: String(OUTPUTS.length), label: "published outputs we co-authored, 2016–2019" },
  ],
};
