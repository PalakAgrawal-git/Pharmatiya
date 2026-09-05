import Link from "next/link";
import { site } from "@/lib/site";
import WorkflowDiagram from "./WorkflowDiagram";
import Reveal from "@/components/motion/Reveal";

/**
 * The product panel — the second of two inverted grounds on the homepage,
 * separated from the proof band by two lighter sections so the alternation
 * reads as rhythm rather than repetition.
 *
 * Tonal inversion marks a different kind of offering without resorting to a
 * gradient or a glow. Trust markers appear at first mention because
 * scepticism about AI forms immediately in a regulated context.
 */
export default function NextGenTeaser() {
  return (
    <section className="bg-inverse text-white">
      <div className="shell grid gap-12 py-16 lg:grid-cols-[4fr_6fr] lg:gap-16 lg:py-24">
        <Reveal>
          <p className="mb-5 font-mono text-caption uppercase tracking-[0.14em] text-white/50">
            {site.productName}
          </p>
          <h2 className="mb-7 max-w-[18ch] text-[clamp(1.7rem,1.2rem+2.2vw,3rem)] leading-[1.08] tracking-[-0.025em] text-white">
            AI-assisted evidence synopses, reviewed by the people who would
            have written them.
          </h2>
          <Link
            href="/nextgen-ai/"
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-white bg-white px-6 font-medium text-inverse no-underline transition-colors hover:bg-white/85"
          >
            Explore {site.productName}
          </Link>
        </Reveal>

        <Reveal delay={140}>
          <WorkflowDiagram inverted compact />
        </Reveal>
      </div>
    </section>
  );
}
