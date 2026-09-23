import { partners, departments, outputs, programme, related } from "@/lib/programme";
import Reveal from "@/components/motion/Reveal";

/**
 * The mSToPS programme.
 *
 * The argument of this section is not the trial's result — it is the author
 * list. A manufacturer, a research institute and a national health plan ran
 * one nationwide trial together, and our principal was the health plan's
 * analytics lead on it across six published outputs, 2016 to 2019.
 *
 * The three organisations and the funding line come from the JAMA paper
 * itself. The departments inside the manufacturer are our own account of the
 * engagement, and are introduced as such rather than folded in beside the
 * cited facts.
 */
export default function LandmarkProgramme() {
  return (
    <div>
      <div className="grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="text-[clamp(1.25rem,1.05rem+0.8vw,1.6rem)] font-light leading-[1.3] tracking-[-0.015em]">
            A pharmaceutical manufacturer, a research institute and a national
            health plan, on one author list, running one nationwide trial with
            no study site.
          </p>
          <p className="measure mt-6 text-small leading-[1.7] text-muted">
            {programme.full} tested whether a wearable ECG patch, posted to
            people identified as at risk from their own claims history, would
            find atrial fibrillation that routine care was missing. The health
            plan found the population and measured what followed; the research
            institute designed and ran the trial; the manufacturer funded it
            and sat on the author list. The population came from Aetna’s own
            membership, and our principal is named on the papers from both
            Aetna and Healthagen Outcomes.
          </p>
          <p className="measure mt-4 text-small leading-[1.7] text-muted">
            Three organisations that had no history of sharing a protocol, an
            endpoint or a dataset. That was unusual in 2016. It is how much of
            the industry now works — and we have been inside it from the payer
            side since the beginning.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-rule pt-6">
            {programme.figures.map((figure) => (
              <div key={figure.label}>
                <dt className="sr-only">{figure.label}</dt>
                <dd>
                  <span className="block tabular text-[clamp(1.5rem,1.2rem+1vw,2.1rem)] font-light leading-none tracking-[-0.03em] text-accent">
                    {figure.value}
                  </span>
                  <span className="mt-2.5 block text-caption leading-[1.45] text-muted">
                    {figure.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <ol className="flex flex-col gap-3">
            {partners.map((partner, index) => (
              <Reveal
                as="li"
                key={partner.name}
                delay={index * 90}
                className="lift rounded-[10px] border border-rule-firm bg-surface/40 p-5 lg:p-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="text-[1.15rem] font-normal leading-tight">{partner.name}</h3>
                  <span className="label-sm text-accent">{partner.role}</span>
                </div>
                <p className="mt-3 text-small leading-[1.6] text-muted">{partner.note}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={280} className="mt-6 rounded-[10px] border border-dashed border-rule-firm p-5 lg:p-6">
            <p className="label-sm text-faint">Inside the manufacturer, we worked with</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {departments.map((department) => (
                <li
                  key={department}
                  className="rounded-full border border-rule-firm px-3 py-1 text-caption text-ink"
                >
                  {department}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-caption leading-[1.55] text-faint">
              Four departments that buy evidence differently, on one programme.
            </p>
          </Reveal>
        </div>
      </div>

      {/* The programme, as published. */}
      <Reveal className="mt-14 border-t border-rule pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h3 className="label text-faint">The programme, as published</h3>
          <p className="text-caption text-faint">
            {programme.funding}
          </p>
        </div>

        <ol className="mt-6">
          {outputs.map((output) => {
            const Row = output.link ? "a" : "div";
            return (
              <li key={output.id} className="border-b border-rule first:border-t">
                <Row
                  {...(output.link
                    ? { href: output.link, target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`group grid grid-cols-[3.5rem_1fr] items-baseline gap-x-6 gap-y-1 px-1 py-4 no-underline sm:grid-cols-[3.5rem_1fr_12rem_1.5rem] ${
                    output.link ? "transition-colors hover:bg-surface" : ""
                  }`}
                >
                  <span className="label tabular text-accent">{output.year ?? "—"}</span>
                  <span className="text-small leading-[1.5] text-ink">{output.label}</span>
                  <span className="label-sm col-start-2 text-faint sm:col-start-3">
                    {output.venue ?? "Conference poster"}
                  </span>
                  {output.link && (
                    <>
                      <span
                        aria-hidden="true"
                        className="hidden self-center text-small text-faint/60 transition-all duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:text-accent sm:block"
                      >
                        ↗
                      </span>
                      <span className="sr-only"> (source, opens in a new tab)</span>
                    </>
                  )}
                </Row>
              </li>
            );
          })}
        </ol>

        <p className="mt-6 text-caption leading-[1.6] text-faint">
          Conference abstracts without a permanent online record are listed
          without a link.
        </p>
        <p className="mt-3 text-caption leading-[1.6] text-faint">
          The method the trial demonstrated was then reviewed across the
          industry in{" "}
          <a
            href={related.link ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4"
          >
            {related.label}
          </a>{" "}
          ({related.venue}, {related.year}), which our principal co-authored
          with regulators, sponsors and academic centres.
        </p>
        <p className="mt-3 text-caption leading-[1.6] text-faint">
          Primary result: {programme.citation}{" "}
          <a
            href={programme.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4"
          >
            Read it
          </a>
          .
        </p>
      </Reveal>
    </div>
  );
}
