import Link from "next/link";
import { site } from "@/lib/site";
import WorkflowDiagram from "./WorkflowDiagram";

/**
 * The only inverted panel on the homepage.
 *
 * Tonal inversion marks a different kind of offering without resorting to a
 * gradient or a glow. Trust markers appear at first mention because
 * scepticism about AI forms immediately in a regulated context.
 */
export default function NextGenTeaser() {
  return (
    <section className="bg-inverse text-white">
      <div className="shell grid gap-10 py-14 lg:grid-cols-[4fr_6fr] lg:gap-16 lg:py-20">
        <div>
          <p className="mb-5 font-mono text-caption uppercase tracking-[0.14em] text-white/50">
            {site.productName}
          </p>
          <h2 className="mb-6 max-w-[20ch] text-[clamp(1.6rem,1.2rem+1.8vw,2.5rem)] text-white">
            AI-assisted evidence synopses, reviewed by the people who would
            have written them.
          </h2>
          <Link
            href="/nextgen-ai/"
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-white bg-white px-6 font-medium text-inverse no-underline transition-colors hover:bg-white/85"
          >
            Explore {site.productName}
          </Link>
        </div>

        <div>
          <WorkflowDiagram inverted />
        </div>
      </div>
    </section>
  );
}
