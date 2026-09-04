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

/** Events are drawn from the current About page. Dates are not estimated. */
const milestones = [
  {
    event: "Outcomes Research division established",
    detail:
      "Built an organic outcomes research function on the payer side — hiring, training and managing the clinical, biostatistics and analytical team.",
  },
  {
    event: "Payer-side analytics build-out",
    detail:
      "Proprietary pharmacy, lab and medical claims used to identify and risk-stratify populations for care management.",
  },
  {
    event: "Pharmacovigilance & clinical trials product lead",
    detail:
      "Conceptualised, developed and executed pharmacovigilance and clinical-trials products.",
  },
  { event: "Pharmatiya founded", detail: "Independent HEOR and RWE practice." },
  {
    event: `${site.productName} developed`,
    detail:
      "AI-assisted evidence synopses with mandatory human expert review.",
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

          {/* An unnumbered sequence until dates are supplied — none are
              estimated. */}
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
                  <p className="mt-1">
                    <Pending>Date to provide</Pending>
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

          <div className="border border-dashed border-rule-firm bg-surface p-6 sm:p-8">
            <p className="measure text-muted">
              Team profiles — names, credentials and specialisms — with real
              photography. <Pending>Pending client input 1</Pending>
            </p>
            <p className="measure mt-3 text-small text-faint">
              If photography is unavailable at launch this section ships as
              names and credentials in typographic treatment. It will not ship
              with stock portraits or illustrated avatars.
            </p>
          </div>
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
