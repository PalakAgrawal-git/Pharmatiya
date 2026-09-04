import Link from "next/link";
import { proofFigures, site } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel, Pending } from "@/components/ui/DataLabel";
import DatasetMap from "@/components/evidence/DatasetMap";
import CTA from "@/components/sections/CTA";

export const metadata = {
  title: "About",
  description:
    "A senior evidence team with twenty-five years in HEOR, RWE and outcomes research, including building an organic Outcomes Research division on the payer side.",
  alternates: { canonical: "/about/" },
};

/**
 * Milestones. Date ranges are taken from the span of the published record for
 * each period — the affiliations on those papers are already public — rather
 * than from unpublished employment history. Anything not corroborated that way
 * is left marked as pending.
 */
const milestones = [
  {
    period: "2003–2011",
    event: "Hospital epidemiology and outcomes research",
    detail:
      "Infection surveillance, antibiotic utilisation and hospital-associated infection studies in an integrated health system, published across IDSA, ICAAC, SHEA and ASM.",
  },
  {
    period: "2011–2014",
    event: "Pharmacovigilance and clinical trials product lead",
    detail:
      "Conceptualised and executed pharmacovigilance and clinical-trials products, including a claims-based sentinel system analysing five million lives. US patent 8,744,872 filed January 2013, issued June 2014.",
  },
  {
    period: "2014–2019",
    event: "Payer-side analytics and pragmatic trials",
    detail:
      "Real-world evidence and pragmatic trials on inpatient clinical data and outpatient claims — including the nationwide mSToPS atrial fibrillation screening trial, published in JAMA in 2018.",
  },
  {
    period: "2019–2022",
    event: "Machine learning in outcomes research",
    detail:
      "Applied machine learning to hospitalisation risk in COVID-19, and published on the boundary between machine learning and traditional statistical modelling in healthcare analytics.",
  },
  {
    period: null,
    event: "Pharmatiya founded",
    detail: "Independent HEOR and RWE practice.",
  },
];

const expertise = [
  {
    title: "Evidence & analytics",
    items: [
      "Study design",
      "Statistical analysis",
      "Cohort development",
      "Risk stratification",
      "Data engineering",
    ],
  },
  {
    title: "Strategy & access",
    items: [
      "Value propositions",
      "Value-based contracting",
      "Care management programme design",
      "Payer–provider value propositions",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="shell grid gap-10 py-14 lg:grid-cols-[6fr_4fr] lg:gap-16 lg:py-20">
          <div>
            <SectionHeader
              as="h1"
              eyebrow="About"
              title="A senior evidence team, not a staffing model."
            />
            <p className="measure mt-6 text-muted">
              Pharmatiya works with commercial, medical affairs and HEOR teams
              inside pharmaceutical and device companies, and directly with
              payers and providers. The people who scope your study are the
              people who run it.
            </p>
            <p className="measure mt-4 text-muted">
              That matters because the failure mode in this work is a protocol
              written by someone who will never touch the data. We keep design,
              analysis and interpretation with the same senior team.
            </p>
          </div>

          {/* No stock photography substitute — this becomes a typographic
              panel until real photography arrives. */}
          <div className="flex min-h-[14rem] flex-col items-center justify-center gap-2 border border-dashed border-rule-firm bg-surface p-6 text-center">
            <DataLabel>Office &amp; working photography</DataLabel>
            <p className="text-caption text-faint">
              Pending. No stock imagery will be substituted.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-rule bg-sunk">
        <div className="shell py-12 lg:py-16">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Track record
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>

          <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {proofFigures.map((figure) => (
              <div key={figure.label}>
                <dt className="font-display text-[clamp(1.7rem,1.2rem+2vw,2.9rem)] font-semibold leading-none tracking-[-0.02em] text-accent-deep">
                  {figure.value ?? (
                    <span className="font-mono text-[1rem] uppercase tracking-[0.06em] text-flag">
                      To provide
                    </span>
                  )}
                </dt>
                <dd className="mt-2.5 max-w-[26ch] text-small text-muted">
                  {figure.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Milestones
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>

          {/* Periods are the span of the published record, not estimates. */}
          <ol className="border-t border-rule">
            {milestones.map((milestone) => (
              <li
                key={milestone.event}
                className="grid gap-2 border-b border-rule py-5 lg:grid-cols-[14rem_1fr] lg:gap-10"
              >
                <div>
                  <p className="font-display text-[1.05rem] font-semibold">
                    {milestone.event}
                  </p>
                  <p className="mt-1 font-mono text-caption tabular text-accent">
                    {milestone.period ?? <Pending>Date to provide</Pending>}
                  </p>
                </div>
                <p className="measure text-small text-muted">
                  {milestone.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Team
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>

          <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
            {/* Photography pending client input 1 — a typographic panel
                stands in. No stock portrait is substituted. */}
            <div className="flex min-h-[11rem] flex-col items-center justify-center gap-2 border border-dashed border-rule-firm bg-surface p-5 text-center">
              <DataLabel>Photograph</DataLabel>
              <p className="text-caption text-faint">Pending</p>
            </div>

            <div className="border-t border-rule-firm pt-4">
              <h3 className="text-[1.35rem]">Rajesh R. Mehta, R.Ph., M.S.</h3>
              <p className="mt-1 font-mono text-caption uppercase tracking-[0.1em] text-faint">
                Health economics &amp; outcomes research{" "}
                <Pending>Role title to confirm</Pending>
              </p>

              <p className="measure mt-4 text-muted">
                A licensed pharmacist who moved into outcomes research and
                stayed for twenty-five years. His published work runs from
                hospital infection surveillance through claims-based
                pharmacovigilance to nationwide pragmatic trials — including
                the mSToPS atrial fibrillation screening trial published in{" "}
                <em>JAMA</em> in 2018, and a systematic review of therapeutic
                inertia in type 2 diabetes in{" "}
                <em>Diabetes, Obesity and Metabolism</em>.
              </p>

              <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="font-mono text-caption uppercase tracking-[0.1em] text-faint">
                    Education
                  </dt>
                  <dd className="mt-1 text-small text-muted">
                    M.S. Pharmacy Administration, <em>magna cum laude</em>,
                    Idaho State University
                    <br />
                    B.Pharm, University of Pune
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-caption uppercase tracking-[0.1em] text-faint">
                    Licensure
                  </dt>
                  <dd className="mt-1 text-small text-muted">
                    Registered pharmacist, Utah and Maryland
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-caption uppercase tracking-[0.1em] text-faint">
                    Patent
                  </dt>
                  <dd className="mt-1 text-small text-muted">
                    <a
                      href="https://patents.google.com/patent/US8744872"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-4"
                    >
                      US 8,744,872
                    </a>{" "}
                    — System and method for pharmacovigilance
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-caption uppercase tracking-[0.1em] text-faint">
                    Affiliations
                  </dt>
                  <dd className="mt-1 text-small text-muted">
                    ISPOR · American Diabetes Association · American College of
                    Cardiology
                  </dd>
                </div>
              </dl>

              <p className="mt-5">
                <Link
                  href="/evidence/"
                  className="font-mono text-small text-accent underline underline-offset-4"
                >
                  The full published record →
                </Link>
              </p>
            </div>
          </div>

          <p className="measure mt-6 text-small text-faint">
            Further team profiles <Pending>Pending client input 1</Pending>
          </p>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Expertise
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>

          <div className="grid gap-8 sm:grid-cols-2">
            {expertise.map((group) => (
              <div key={group.title} className="border-t border-rule-firm pt-4">
                <h3 className="mb-3 font-mono text-caption uppercase tracking-[0.12em] text-ink">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-small text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-rule pt-6">
            <DataLabel as="h3" className="mb-4">
              Dataset &amp; partner experience
            </DataLabel>
            <DatasetMap compact />
            <p className="mt-6">
              <Link
                href="/evidence/"
                className="font-mono text-small text-accent underline underline-offset-4"
              >
                Full methods detail →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <CTA
        title="Speak with Pharmatiya."
        body="Talk to a senior researcher about your question — not an account manager."
        action="Book a consultation"
      />
    </>
  );
}
