import Link from "next/link";
import { proofFigures } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel } from "@/components/ui/DataLabel";
import DatasetMap from "@/components/evidence/DatasetMap";
import TeamRoster from "@/components/sections/TeamRoster";
import Milestones from "@/components/sections/Milestones";
import CTA from "@/components/sections/CTA";
import Reveal from "@/components/motion/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";
import CountUp from "@/components/motion/CountUp";
import Slot from "@/components/ui/Slot";

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
      <section className="border-b border-rule">
        <div className="shell section">
          <Reveal>
            <SectionHeader
              as="h1"
              display
              eyebrow="About / Pharmatiya"
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

          {/* Office and working photography goes here once supplied
              (client input 1). No stock imagery stands in, and no panel
              announces the gap to visitors — the column simply closes up. */}
        </div>
      </section>

      {/* The same proof figures as the homepage band, on the same inverted
          ground. They were previously set small and grey on `sunk`, which
          made the strongest credentials on the page the quietest thing on
          it — and left the page with no tonal break at all. */}
      <section className="bg-inverse text-white">
        <div className="shell section">
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
                <dt className="display text-[clamp(2rem,1.4rem+2.6vw,3.4rem)] leading-[0.92] tracking-[-0.03em] tabular text-white">
                  <CountUp value={figure.value} />
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
        <div className="shell section">
          <Reveal>
            <SectionLabel as="h2" index="02">
              How we got here
            </SectionLabel>
          </Reveal>

<Milestones />

          <div className="mt-10 flex flex-col gap-4">
            <Slot id={25}>
              Office or working photography, if you want any. The page is
              designed to hold without it — nothing here falls back to stock
              imagery.
            </Slot>
            <Slot id={9}>
              The year Pharmatiya was founded. The chronology runs to the last
              published entry and then stops; without a founding year the
              current period cannot be dated.
            </Slot>
            <Slot id={14} blocking>
              Which organisation the Outcomes Research division belonged to.
              It is referred to on this page and in the homepage pull-quote
              without being named, which reads as evasive rather than
              discreet.
            </Slot>
          </div>
        </div>
      </section>

      <section id="team" className="scroll-mt-8 border-b border-rule bg-sunk">
        <div className="shell section">
          <Reveal>
            <SectionLabel as="h2" index="03">
              Who we are
            </SectionLabel>
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
        <div className="shell section">
          <Reveal>
            <SectionLabel as="h2" index="04">
              What we do
            </SectionLabel>
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
