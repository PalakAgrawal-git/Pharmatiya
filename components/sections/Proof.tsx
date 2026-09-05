import Link from "next/link";
import { proofFigures } from "@/lib/site";
import Reveal from "@/components/motion/Reveal";

/**
 * Proof figures.
 *
 * Set at genuine editorial scale on an inverted ground — the first tonal
 * break on the page, and the moment the site stops being quiet. Figures are
 * numbers first, label second, with a hairline rule between each: a
 * statistical table given room, not four boxed cards.
 *
 * Figures marked `pending` render a visible placeholder rather than a number.
 * Nothing is invented to fill the row.
 */
export default function Proof() {
  return (
    <section className="border-b border-rule bg-inverse text-white">
      <div className="shell py-16 lg:py-20">
        <Reveal>
          <p className="mb-12 flex items-center gap-4 font-mono text-caption uppercase tracking-[0.14em] text-white/45">
            The record
            <span aria-hidden="true" className="h-px flex-1 bg-white/15" />
          </p>
        </Reveal>

        <dl className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {proofFigures.map((figure, index) => (
            <Reveal
              key={figure.label}
              delay={index * 90}
              className="border-t border-white/20 pt-5"
            >
              <dt className="font-display text-[clamp(2.6rem,1.6rem+3.6vw,4.4rem)] font-semibold leading-[0.9] tracking-[-0.035em] tabular text-white">
                {figure.value ?? (
                  <span className="font-mono text-[1rem] uppercase tracking-[0.06em] text-flag">
                    To provide
                  </span>
                )}
              </dt>
              <dd className="mt-4 max-w-[24ch] text-small leading-[1.45] text-white/60">
                {figure.label}
              </dd>
            </Reveal>
          ))}
        </dl>

        <Reveal delay={400}>
          <div className="mt-14 border-t border-white/15 pt-6">
            <Link
              href="/evidence/"
              className="arrow-link font-mono text-small text-white underline underline-offset-4 hover:text-white/70"
            >
              Every entry, searchable, with sources{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
