import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";
import { site } from "@/lib/site";

type Props = {
  title?: string;
  body?: string;
  action?: string;
  href?: string;
  band?: boolean;
};

/**
 * Closing call to action. Each page passes its own copy, so the same
 * paragraph never repeats across the site — the current site duplicates one
 * identical contact block on three pages.
 */
export default function CTA({
  title = "Start with a conversation about the question you are trying to answer.",
  body = "A 30-minute call with a senior researcher. No sales team.",
  action = "Book a consultation",
  href = "/contact/",
  band = true,
}: Props) {
  return (
    <section className={band ? "border-t border-rule bg-sunk" : "border-t border-rule"}>
      <div className="shell grid items-center gap-10 py-16 lg:grid-cols-[6fr_4fr] lg:py-20">
        <Reveal>
          <h2 className="mb-4 max-w-[22ch] text-[clamp(1.6rem,1.2rem+1.8vw,2.7rem)] leading-[1.1] tracking-[-0.02em]">
            {title}
          </h2>
          <p className="measure text-lede leading-[1.45] text-muted">{body}</p>
        </Reveal>

        <Reveal delay={120} className="flex flex-col items-start gap-4">
          <Button href={href} full>
            {action}
          </Button>
          <a
            href={`mailto:${site.email}`}
            className="arrow-link font-mono text-small text-accent underline underline-offset-4"
          >
            Or email us directly{" "}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
