import Button from "@/components/ui/Button";
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
      <div className="shell grid items-center gap-8 py-12 lg:grid-cols-[6fr_4fr] lg:py-16">
        <div>
          <h2 className="mb-3 max-w-[24ch] text-[clamp(1.4rem,1.15rem+1.2vw,2.1rem)]">
            {title}
          </h2>
          <p className="measure text-muted">{body}</p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <Button href={href} full>
            {action}
          </Button>
          <a
            href={`mailto:${site.email}`}
            className="font-mono text-small text-accent underline underline-offset-4"
          >
            Or email us directly →
          </a>
        </div>
      </div>
    </section>
  );
}
