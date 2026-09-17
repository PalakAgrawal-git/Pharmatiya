import { studies } from "@/lib/studies";
import Reveal from "@/components/motion/Reveal";

/**
 * Four published studies, told the way a buyer evaluates one: what was asked,
 * with what data, by which method, and what was found.
 *
 * The lead figure is set large because it is the thing a reader carries away,
 * but it is always the authors' own number with the authors' own qualifier
 * beside it — never a headline stripped of its denominator.
 *
 * The study that found nothing is included on purpose and marked as such. A
 * practice that only shows positive results is showing a selection; one that
 * shows a well-run null result is showing its method.
 */

const rows = [
  { key: "question", label: "Question" },
  { key: "data", label: "Data" },
  { key: "method", label: "Method" },
  { key: "finding", label: "Finding" },
] as const;

export default function SelectedStudies() {
  return (
    <div>
      <p className="measure mb-10 mt-6 text-muted">
        Studies our researchers have presented and published, told the way you
        would assess one. These are from the public record, not from client
        engagements, and every figure is quoted as the authors reported it.
      </p>

      <ol className="flex flex-col">
        {studies.map((study, index) => (
          <Reveal
            as="li"
            key={study.id}
            delay={index * 80}
            className="rule-row grid gap-x-12 gap-y-8 border-t border-rule py-10 lg:grid-cols-12"
          >
            <div className="lg:col-span-4">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="label tabular text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="label-sm text-faint">{study.area}</span>
              </p>

              <h3 className="mt-4 text-[clamp(1.25rem,1.05rem+0.7vw,1.6rem)] font-normal leading-[1.2]">
                {study.title}
              </h3>

              <div className="mt-7 border-t border-rule pt-5">
                <p
                  className={`tabular text-[clamp(1.9rem,1.4rem+1.8vw,2.75rem)] font-light leading-none tracking-[-0.03em] ${
                    study.null ? "text-ink" : "text-accent"
                  }`}
                >
                  {study.lead.value}
                </p>
                <p className="mt-3 max-w-[30ch] text-small leading-[1.5] text-muted">
                  {study.lead.label}
                </p>
                {study.null && (
                  <p className="label-sm mt-4 inline-block border border-rule-firm px-2 py-1 text-faint">
                    Null result — published
                  </p>
                )}
              </div>

              <p className="mt-6 text-caption leading-[1.55] text-faint">
                {study.citation}
              </p>
            </div>

            <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-8">
              {rows.map((row) => (
                <div key={row.key} className="border-t border-rule pt-4">
                  <dt className="label-sm text-faint">{row.label}</dt>
                  <dd className="mt-2.5 text-small leading-[1.65] text-muted">
                    {study[row.key]}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
