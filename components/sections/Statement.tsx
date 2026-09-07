import Reveal from "@/components/motion/Reveal";

/**
 * A deliberate pause.
 *
 * One serif statement across nine columns with a great deal of nothing around
 * it, and a short supporting paragraph set narrow beneath. It carries no
 * chart, no link and no action.
 *
 * Both start on the first column. Indenting them read as centred on a wide
 * screen, which broke the single left edge the rest of the page is built on.
 *
 * A page composed entirely of sections that each do a job reads as a
 * brochure; the empty space here is what makes the rest look chosen rather
 * than filled. This is also the second and last appearance of the serif on
 * the homepage, so it lands.
 */
export default function Statement() {
  return (
    <section className="border-b border-rule">
      <div className="shell section grid gap-x-16 gap-y-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-9">
          <p className="display text-[clamp(1.75rem,1.1rem+2.8vw,3.25rem)] leading-[1.18]">
            Evidence is only useful when someone can defend it.
          </p>
        </Reveal>

        <Reveal delay={140} className="lg:col-span-4">
          <p className="text-small leading-[1.7] text-muted">
            A result that cannot survive a payer's methodologist is not a
            result. We design for the challenge that comes after the readout —
            which is why feasibility, the analysis plan and the interpretation
            are all done by the same senior team.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
