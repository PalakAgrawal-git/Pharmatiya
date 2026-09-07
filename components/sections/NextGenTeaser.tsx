import Link from "next/link";
import { site } from "@/lib/site";
import WorkflowDiagram from "./WorkflowDiagram";
import Reveal from "@/components/motion/Reveal";

/**
 * The product panel — the second of two inverted grounds on the homepage,
 * separated from the proof band by two lighter sections so the alternation
 * reads as rhythm rather than repetition.
 *
 * Nothing here is futuristic. No neon, no circuitry, no glow: a buyer in a
 * regulated environment reads AI claims adversarially, and the design has to
 * agree with the copy that this is a supervised instrument rather than an
 * autonomous one. Tonal inversion alone marks it as a different kind of
 * offering.
 */
export default function NextGenTeaser() {
  return (
    <section className="bg-inverse text-white">
      <div className="shell section grid gap-x-16 gap-y-14 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <p className="label text-white/45">{site.productName}</p>

          <h2 className="mt-8 max-w-[17ch] text-[clamp(1.8rem,1.3rem+2.2vw,3rem)] font-medium leading-[1.08] text-white">
            AI-assisted evidence synopses, reviewed by the people who would
            have written them.
          </h2>

          <Link
            href="/nextgen-ai/"
            className="group mt-10 inline-flex min-h-12 items-center gap-2.5 rounded-[--radius-sm] border border-white/25 px-6 text-small font-medium text-white no-underline transition-colors duration-200 hover:border-white hover:bg-white hover:text-inverse"
          >
            Explore {site.productName}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px]"
            >
              →
            </span>
          </Link>
        </Reveal>

        <Reveal delay={140} className="lg:col-span-6 lg:col-start-7">
          <WorkflowDiagram inverted compact />
        </Reveal>
      </div>
    </section>
  );
}
