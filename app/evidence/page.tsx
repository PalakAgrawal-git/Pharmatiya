import { methods } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import { DataLabel, Pending } from "@/components/ui/DataLabel";
import CaseStudies from "@/components/evidence/CaseStudies";
import DatasetMap from "@/components/evidence/DatasetMap";
import TherapeuticMatrix from "@/components/evidence/TherapeuticMatrix";
import CTA from "@/components/sections/CTA";

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
      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <SectionHeader
            as="h1"
            eyebrow="Evidence"
            title="What we have done, with which data, by which methods."
          />
          <p className="measure mt-6 text-muted">
            Client work is confidential. What follows is anonymised, and every
            method described is one we have executed.
          </p>
        </div>
      </section>

      {/* Worked examples persuade before capability lists do, so they come
          first. */}
      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Case studies
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>
          <CaseStudies />
        </div>
      </section>

      {/* Coverage follows because it is the disqualifying question. */}
      <section className="border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Dataset coverage
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>
          <DatasetMap />
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Therapeutic expertise
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>
          <TherapeuticMatrix />
        </div>
      </section>

      {/* Methods sit last: only the most technical reader reaches them, and
          that reader will read them wherever they are. */}
      <section className="border-b border-rule bg-sunk">
        <div className="shell py-14 lg:py-20">
          <DataLabel as="h2" className="mb-8 flex items-center gap-4">
            Methods &amp; analytical capability
            <span aria-hidden="true" className="h-px flex-1 bg-rule" />
          </DataLabel>

          <div className="grid gap-8 sm:grid-cols-3">
            {methodGroups.map((group) => (
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
        </div>
      </section>

      <section className="border-b border-rule">
        <div className="shell py-12 lg:py-16">
          <div className="border border-rule bg-surface p-6 sm:p-8">
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
          </div>
        </div>
      </section>

      <CTA
        title="Bring us the question you cannot answer internally."
        body="A 30-minute call with a senior researcher. We will tell you what data it would take, and whether that data exists."
      />
    </>
  );
}
