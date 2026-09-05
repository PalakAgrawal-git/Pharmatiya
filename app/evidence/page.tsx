import { methods } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel, Pending } from "@/components/ui/DataLabel";
import CaseStudies from "@/components/evidence/CaseStudies";
import DatasetMap from "@/components/evidence/DatasetMap";
import TherapeuticMatrix from "@/components/evidence/TherapeuticMatrix";
import PublicationList from "@/components/evidence/PublicationList";
import CTA from "@/components/sections/CTA";
import Reveal from "@/components/motion/Reveal";
import GraphGround from "@/components/layout/GraphGround";

export const metadata = {
  title: "Evidence",
  description:
    "What we have done, with which data, by which methods. Dataset coverage across payer, provider and claims sources, therapeutic expertise, and named analytical capability.",
  alternates: { canonical: "/evidence/" },
};

const methodGroups = [
  { title: "Study design", items: methods.design },
  { title: "Statistics", items: methods.statistics },
  { title: "Engineering", items: methods.engineering },
];

export default function EvidencePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-rule">
        <GraphGround />
        <div className="shell relative py-16 lg:py-24">
          <Reveal>
            <SectionHeader
              as="h1"
              eyebrow="Evidence"
              title="What we have done, with which data, by which methods."
            />
          </Reveal>
          <Reveal delay={100}>
            <p className="measure mt-6 text-muted">
              Our client work is confidential. What follows is anonymised, and
              every method described is one we have executed ourselves.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Worked examples persuade before capability lists do, so they come
          first. */}
      <section className="border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DataLabel as="h2" className="mb-8 flex items-center gap-4">
              Case studies
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </DataLabel>
          </Reveal>
          <Reveal delay={100}>
            <CaseStudies />
          </Reveal>
        </div>
      </section>

      {/* Coverage follows because it is the disqualifying question. */}
      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DataLabel as="h2" className="mb-8 flex items-center gap-4">
              Dataset coverage
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </DataLabel>
          </Reveal>
          <Reveal delay={100}>
            <DatasetMap />
          </Reveal>
        </div>
      </section>

      {/* The one tonal break on a long page. Six ruled sections in a row is
          what made this page read as a document rather than a site; the
          therapeutic grid is the section that carries inversion best because
          it is a field of short labels, not running text. */}
      <section className="bg-inverse text-white">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <h2 className="mb-8 flex items-center gap-4 font-mono text-caption font-normal uppercase tracking-[0.14em] text-white/45">
              Therapeutic expertise
              <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <TherapeuticMatrix inverted />
          </Reveal>
        </div>
      </section>

      {/* The published record. This sits high on the page because it is the
          only proof on the site a buyer can verify without asking us for
          anything — the linkable entries carry a DOI, PMID or patent number. */}
      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DataLabel as="h2" className="mb-3 flex items-center gap-4">
              The published record
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </DataLabel>
            <p className="measure mb-8 text-muted">
              Forty-seven publications, abstracts, posters, a patent and a book
              chapter authored or co-authored by our team between 2003 and
              2022 — in JAMA, Circulation, Diabetes, Obesity and Metabolism,
              Vaccine and others. Search it, or filter by type.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <PublicationList />
          </Reveal>
        </div>
      </section>

      {/* Methods sit last: only the most technical reader reaches them, and
          that reader will read them wherever they are. */}
      <section className="border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <Reveal>
            <DataLabel as="h2" className="mb-8 flex items-center gap-4">
              Methods &amp; analytical capability
              <span aria-hidden="true" className="h-px flex-1 bg-rule" />
            </DataLabel>
          </Reveal>

          <div className="grid gap-8 sm:grid-cols-3">
            {methodGroups.map((group, index) => (
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
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell py-12 lg:py-16">
          <Reveal className="lift border border-rule bg-surface p-6 sm:p-8">
            <h2 className="mb-3 text-[1.3rem]">
              See the shape of what you receive.
            </h2>
            <p className="measure mb-4 text-muted">
              A redacted synopsis and analysis report, so you can judge the
              output before you commission any. We send one file — no sequence,
              no list.
            </p>
            <p className="text-caption text-faint">
              <Pending>Pending a sample deliverable from Pharmatiya</Pending>{" "}
              This section is omitted at launch rather than shipped
              non-functional.
            </p>
          </Reveal>
        </div>
      </section>

      <CTA
        title="Bring us the question you cannot answer internally."
        body="A 30-minute call with a senior researcher. We will tell you what data it would take, and whether that data exists."
      />
    </>
  );
}
