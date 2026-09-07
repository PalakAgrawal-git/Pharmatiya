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
      <div className="shell section-tight grid items-center gap-x-16 gap-y-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <h2 className="mb-5 max-w-[20ch] text-[clamp(1.6rem,1.2rem+1.8vw,2.6rem)] font-medium leading-[1.1]">
            {title}
          </h2>
          <p className="measure text-lede leading-[1.45] text-muted">{body}</p>
        </Reveal>

        <Reveal delay={120} className="flex flex-col items-start gap-5 lg:col-span-4 lg:col-start-9">
          <Button href={href} full>
            {action}
          </Button>
          <a
            href={`mailto:${site.email}`}
            className="arrow-link text-small text-ink underline decoration-rule-firm underline-offset-[6px] transition-colors hover:decoration-accent"
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
