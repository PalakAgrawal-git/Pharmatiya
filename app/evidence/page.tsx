import { methods } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";
import CaseStudies from "@/components/evidence/CaseStudies";
import SelectedStudies from "@/components/evidence/SelectedStudies";
import DatasetMap from "@/components/evidence/DatasetMap";
import TherapeuticMatrix from "@/components/evidence/TherapeuticMatrix";
import PublicationList from "@/components/evidence/PublicationList";
import CTA from "@/components/sections/CTA";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import SectionLabel from "@/components/ui/SectionLabel";
import { record, inWords, capitalise } from "@/lib/record";
import { studies } from "@/lib/studies";

export const metadata = {
  title: "Evidence",
  description:
    "What we have done, with which data, by which methods. Published studies, therapeutic expertise, dataset coverage and the full published record.",
  alternates: { canonical: "/evidence/" },
};

const methodGroups = [
  { title: "Study design", items: methods.design },
  { title: "Statistics", items: methods.statistics },
  { title: "Data engineering", items: methods.engineering },
];

/* Counted from the archive, so the hero cannot disagree with the list. */
const glance = [
  { value: String(record.total), label: "Publications, abstracts and posters" },
  { value: String(record.publications), label: "Full publications, incl. JAMA and Circulation" },
  { value: String(record.areas), label: "Therapeutic areas" },
  { value: String(record.lastYear - record.firstYear + 1), label: `Years of output, ${record.firstYear}–${record.lastYear}` },
];

const sections = [
  { id: "studies", label: "Selected studies" },
  { id: "areas", label: "Therapeutic areas" },
  { id: "data", label: "Data coverage" },
  { id: "record", label: "Published record" },
  { id: "methods", label: "Methods" },
];

/** One heading pattern for every section, so the page reads as a set. */
function Head({ index, label, title, lede, tone = "light" }: { index: string; label: string; title: string; lede?: string; tone?: "light" | "dark" }) {
  return (
    <Reveal className="mb-10 grid gap-x-16 gap-y-4 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-6">
        <SectionLabel as="p" index={index} tone={tone} rule={false}>
          {label}
        </SectionLabel>
        <h2 className={`mt-4 text-[clamp(1.6rem,1.2rem+1.4vw,2.35rem)] font-light leading-[1.12] tracking-[-0.02em] ${tone === "dark" ? "text-white" : ""}`}>
          {title}
        </h2>
      </div>
      {lede && (
        <p className={`text-small leading-[1.65] lg:col-span-5 lg:col-start-8 ${tone === "dark" ? "text-white/60" : "text-muted"}`}>
          {lede}
        </p>
      )}
    </Reveal>
  );
}

export default function EvidencePage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="shell section grid gap-x-16 gap-y-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-6">
            <SectionHeader
              as="h1"
              display
              eyebrow="Evidence"
              index={`${record.firstYear}–${record.lastYear}`}
              title="What we have done, with which data, by which methods."
            />
            <p className="measure mt-6 text-muted">
              Our client work is confidential. What follows is our published
              record — the studies, the data they used and the methods behind
              them — and every method described is one we have executed
              ourselves.
            </p>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-5 lg:col-start-8">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-rule-firm bg-rule">
              {glance.map((item) => (
                <div key={item.label} className="bg-paper p-5">
                  <dt className="sr-only">{item.label}</dt>
                  <dd>
                    <CountUp
                      value={item.value}
                      className="block tabular text-[clamp(2rem,1.6rem+1.4vw,2.75rem)] font-light leading-none tracking-[-0.03em] text-ink"
                    />
                    <span aria-hidden="true" className="mt-2.5 block text-caption leading-[1.4] text-muted">
                      {item.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={200} as="nav" aria-label="On this page" className="lg:col-span-12">
            <ul className="flex flex-wrap gap-2 border-t border-rule pt-6">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-rule-firm px-3.5 py-1.5 text-caption text-muted no-underline transition-colors hover:border-accent hover:text-ink"
                  >
                    <span className="tabular text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Worked examples persuade before capability lists do. */}
      <section id="studies" className="scroll-mt-24 border-b border-rule bg-sunk">
        <div className="shell section">
          <Head index="01" label="Selected studies" title={`${capitalise(inWords(studies.length))} studies, told the way you would assess one`} />
          <SelectedStudies />
          <Reveal delay={100} className="mt-14">
            <CaseStudies />
          </Reveal>
        </div>
      </section>

      {/* The one tonal break on a long page: a field of short labels and
          bars carries inversion better than running text does. */}
      <section id="areas" className="scroll-mt-24 bg-inverse text-white">
        <div className="shell section">
          <Head
            index="02"
            label="Therapeutic areas"
            tone="dark"
            title="Where our published work is concentrated"
            lede="One deep specialism in infectious disease and hospital outcomes, then a spread across cardiology, diabetes, respiratory, dermatology and mental health."
          />
          <Reveal delay={100}>
            <TherapeuticMatrix inverted />
          </Reveal>
        </div>
      </section>

      {/* Coverage is the disqualifying question — "do they have my data?" */}
      <section id="data" className="scroll-mt-24 border-b border-rule">
        <div className="shell section">
          <Head
            index="03"
            label="Data coverage"
            title="The real-world data we work in"
            lede="Payer, provider and pharmacy data — extracted and analysed by the same team, so the cohort definition survives contact with the data."
          />
          <Reveal delay={100}>
            <DatasetMap />
          </Reveal>
        </div>
      </section>

      {/* The only proof on the site a buyer can verify without asking us for
          anything — the linkable entries carry a DOI, PMID or patent. */}
      <section id="record" className="scroll-mt-24 border-b border-rule bg-sunk">
        <div className="shell section">
          <Head
            index="04"
            label="Published record"
            title="Everything we have published, searchable"
            lede={`${capitalise(inWords(record.total))} publications, abstracts, posters, a patent and a book chapter authored or co-authored by our team between ${record.firstYear} and ${record.lastYear} — in JAMA, Circulation, Diabetes, Obesity and Metabolism, Vaccine and others. Search it, or filter by type.`}
          />
          <Reveal delay={100}>
            <PublicationList />
          </Reveal>
        </div>
      </section>

      {/* Methods sit last: only the most technical reader reaches them. */}
      <section id="methods" className="scroll-mt-24 border-b border-rule">
        <div className="shell section">
          <Head
            index="05"
            label="Methods"
            title="Methods and analytical capability"
            lede="Every method listed is one we have run ourselves, from study design through to the code."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {methodGroups.map((group, index) => (
              <Reveal
                key={group.title}
                delay={index * 110}
                className="lift rounded-[10px] border border-rule-firm bg-surface/40 p-6"
              >
                <h3 className="text-[1.15rem] font-normal">{group.title}</h3>
                <ul className="mt-4 flex flex-wrap gap-2 border-t border-rule pt-4">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-rule-firm px-3 py-1 text-caption text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
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
