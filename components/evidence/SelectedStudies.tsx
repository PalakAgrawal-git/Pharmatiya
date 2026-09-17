import { studies } from "@/lib/studies";
import Reveal from "@/components/motion/Reveal";

/**
 * Four published studies, as cards.
 *
 * Each card leads with the one number a reader should leave with and the
 * question it answers; the full question, data, method and finding sit in a
 * disclosure underneath. Laid out as four equal rows of dense text they read
 * as a wall — as cards, a reader can scan four findings in one screen and
 * open the one that matters to them.
 *
 * The lead figure is always the authors' own number with the authors' own
 * qualifier beside it. The study that found nothing is kept and marked, not
 * hidden: a well-run null result shows method.
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
      <p className="measure mt-6 text-muted">
        Studies our researchers have presented and published, told the way you
        would assess one. They come from the public record, not from client
        engagements, and every figure is quoted as the authors reported it.
      </p>

      <ol className="mt-10 grid gap-5 md:grid-cols-2">
        {studies.map((study, index) => (
          <Reveal
            as="li"
            key={study.id}
            delay={index * 80}
            className="lift flex flex-col rounded-[10px] border border-rule-firm bg-paper/60 p-6 lg:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="flex items-center gap-3">
                <span className="label tabular text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full border border-rule-firm px-2.5 py-0.5 text-caption text-muted">
                  {study.area}
                </span>
              </span>
              {study.null && (
                <span className="rounded-full border border-flag/50 bg-flag/10 px-2.5 py-0.5 text-caption text-flag">
                  Null result — published
                </span>
              )}
            </div>

            <h3 className="mt-5 text-[clamp(1.2rem,1.05rem+0.5vw,1.45rem)] font-normal leading-[1.25]">
              {study.title}
            </h3>

            <div className="mt-6 flex items-end gap-4 border-t border-rule pt-5">
              <p
                className={`tabular text-[clamp(2rem,1.5rem+1.6vw,2.75rem)] font-light leading-none tracking-[-0.03em] ${
                  study.null ? "text-ink" : "text-accent"
                }`}
              >
                {study.lead.value}
              </p>
            </div>
            <p className="mt-2.5 max-w-[40ch] text-small leading-[1.5] text-muted">
              {study.lead.label}
            </p>

            <p className="mt-5 text-small leading-[1.6] text-ink">{study.question}</p>

            <details className="group mt-5 border-t border-rule pt-4">
              <summary className="flex cursor-pointer list-none items-center justify-between text-small text-accent">
                Data, method and finding
                <span aria-hidden="true" className="transition-transform group-open:rotate-45">
                  ＋
                </span>
              </summary>
              <dl className="mt-4 flex flex-col gap-4">
                {rows.slice(1).map((row) => (
                  <div key={row.key}>
                    <dt className="label-sm text-faint">{row.label}</dt>
                    <dd className="mt-1.5 text-small leading-[1.65] text-muted">
                      {study[row.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </details>

            <p className="mt-auto pt-6 text-caption leading-[1.55] text-faint">
              {study.citation}
            </p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
