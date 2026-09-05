/**
 * The team.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * TO ADD SOMEONE: copy the template at the bottom of this file, fill it in,
 * and add it to the `team` array. Nothing else needs to change — the About
 * page renders whatever is here, in order.
 *
 * Every field except `name` and `role` is optional; anything left out is
 * simply not rendered, so a partly-filled entry still looks finished.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type TeamMember = {
  /** Used as the React key and the anchor id. Lowercase, no spaces. */
  id: string;

  /** Full name as it should appear. */
  name: string;

  /** Post-nominals, e.g. "R.Ph., M.S." Optional. */
  credentials?: string;

  /** Job title. Keep it plain — "Principal", not "Chief Evidence Officer". */
  role: string;

  /**
   * Set false while a title is unconfirmed. Renders a visible marker so an
   * unverified title is never published as though it were settled.
   */
  roleConfirmed?: boolean;

  /** Two or three sentences. Written in the third person. */
  bio: string;

  education?: string[];
  licensure?: string[];
  affiliations?: string[];

  /** Patents, standards work, editorial roles — anything externally checkable. */
  credits?: { label: string; href?: string }[];

  /**
   * Path to a headshot in /public, e.g. "/team/rajesh-mehta.jpg".
   * Leave null and a typographic panel stands in — never a stock portrait.
   */
  photo?: string | null;
};

export const team: TeamMember[] = [
  {
    id: "rajesh-mehta",
    name: "Rajesh R. Mehta",
    credentials: "R.Ph., M.S.",
    role: "Principal",
    roleConfirmed: false,
    bio:
      "A licensed pharmacist who moved into outcomes research and stayed for twenty-five years. Published work spans hospital infection surveillance, claims-based pharmacovigilance and nationwide pragmatic trials — including the mSToPS atrial fibrillation screening trial in JAMA, and a systematic review of therapeutic inertia in type 2 diabetes in Diabetes, Obesity and Metabolism.",
    education: [
      "M.S. Pharmacy Administration, magna cum laude, Idaho State University",
      "B.Pharm, University of Pune",
    ],
    licensure: ["Registered pharmacist, Utah and Maryland"],
    affiliations: [
      "ISPOR",
      "American Diabetes Association",
      "American College of Cardiology",
    ],
    credits: [
      {
        label: "US Patent 8,744,872 — System and method for pharmacovigilance",
        href: "https://patents.google.com/patent/US8744872",
      },
    ],
    photo: null,
  },

  /* ── TEMPLATE — copy this, fill it in, delete the comment markers ──────
  {
    id: "firstname-lastname",
    name: "Firstname Lastname",
    credentials: "PhD",
    role: "Senior Researcher",
    roleConfirmed: true,
    bio: "Two or three sentences. What they work on, and what they did before.",
    education: ["PhD Epidemiology, University"],
    licensure: [],
    affiliations: ["ISPOR"],
    credits: [],
    photo: null,
  },
  ─────────────────────────────────────────────────────────────────────── */
];
