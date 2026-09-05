import Link from "next/link";
import { proofFigures } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel } from "@/components/ui/DataLabel";
import DatasetMap from "@/components/evidence/DatasetMap";
import TeamRoster from "@/components/sections/TeamRoster";
import Milestones from "@/components/sections/Milestones";
import CTA from "@/components/sections/CTA";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import GraphGround from "@/components/layout/GraphGround";

export const metadata = {
  title: "About",
  description:
    "A senior evidence team with twenty-five years in health economics, outcomes research and real-world evidence, across payer, provider and claims data.",
  alternates: { canonical: "/about/" },
};

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
      <section className="relative overflow-hidden border-b border-rule">
        <GraphGround />
        <div className="shell relative grid gap-10 py-16 lg:grid-cols-[6fr_4fr] lg:gap-16 lg:py-24">
          <Reveal>
            <SectionHeader
              as="h1"
              eyebrow="About us"
              title="A senior evidence team, not a staffing model."
            />
            <p className="measure mt-6 text-muted">
              We work with commercial, medical affairs and HEOR teams inside
              pharmaceutical and device companies, and directly with payers and
              providers. The people who scope your study are the people who run
              it.
            </p>
            <p className="measure mt-4 text-muted">
              That matters because the failure mode in this work is a protocol
              written by someone who will never touch the data. We keep design,
              analysis and interpretation with the same senior team, and we
              have spent enough time on the payer side to know which evidence
              actually moves an access decision.
            </p>
          </Reveal>

          {/* No stock photography substitute — this holds as a typographic
              panel until real photography arrives. */}
          <Reveal
            delay={140}
            className="flex min-h-[14rem] flex-col items-center justify-center gap-2 border border-dashed border-rule-firm bg-surface p-6 text-center"
          >
            <DataLabel>Office &amp; working photography</DataLabel>
            <p className="text-caption text-faint">
              Pending. No stock imagery will be substituted.
            </p>
          </Reveal>
        </div>
      </section>

      {/* The same proof figures as the homepage band, on the same inverted
          ground. They were previously set small and grey on `sunk`, which
          made the strongest credentials on the page the quietest thing on
          it — and left the page with no tonal break at all. */}
      <section className="bg-inverse text-white">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <h2 className="mb-10 flex items-center gap-4 font-mono text-caption font-normal uppercase tracking-[0.14em] text-white/45">
              Our track record
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-white/15" />
            </h2>
          </Reveal>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
            {proofFigures.map((figure, index) => (
              <Reveal
                key={figure.label}
                delay={index * 90}
                className="border-t border-white/20 pt-5"
              >
                <dt className="font-display text-[clamp(1.9rem,1.3rem+2.4vw,3.2rem)] font-semibold leading-[0.95] tracking-[-0.03em] tabular text-white">
                  {figure.value ? (
                    <CountUp value={figure.value} />
                  ) : (
                    <span className="font-mono text-[1rem] uppercase tracking-[0.06em] text-flag">
                      To provide
                    </span>
                  )}
                </dt>
                <dd className="mt-3 max-w-[26ch] text-small leading-[1.45] text-white/60">
                  {figure.label}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DataLabel as="h2" className="mb-8 flex items-center gap-4">
              How we got here
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-rule" />
            </DataLabel>
          </Reveal>

<Milestones />
        </div>
      </section>

      <section id="team" className="scroll-mt-8 border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DataLabel as="h2" className="mb-3 flex items-center gap-4">
              Who we are
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-rule" />
            </DataLabel>
            <p className="measure mb-8 text-muted">
              Credentials matter to the people who commission this work, so we
              list them.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <TeamRoster />
          </Reveal>
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DataLabel as="h2" className="mb-8 flex items-center gap-4">
              What we do
              <span aria-hidden="true" className="rule-grow h-px flex-1 bg-rule" />
            </DataLabel>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-2">
            {expertise.map((group, index) => (
              <Reveal
                key={group.title}
                delay={index * 110}
                className="border-t border-rule-firm pt-4"
              >
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
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 border-t border-rule pt-6">
            <DataLabel as="h3" className="mb-4">
              The data we work in
            </DataLabel>
            <DatasetMap compact />
            <p className="mt-6">
              <Link
                href="/evidence/"
                className="arrow-link font-mono text-small text-accent underline underline-offset-4"
              >
                Our full methods and published record{" "}
                <span className="arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <CTA
        title="Talk to us about the question you are trying to answer."
        body="Thirty minutes with a senior researcher — not an account manager."
        action="Book a consultation"
      />
    </>
  );
}
