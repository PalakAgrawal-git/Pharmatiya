import Link from "next/link";
import { proofFigures } from "@/lib/site";

/**
 * Proof figures, set large in the display face on an offset row — not boxed
 * cards. Placed immediately after positioning because the claim needs
 * substantiating before the visitor invests in reading further.
 *
 * Figures marked `pending` render as a visible placeholder rather than a
 * number. Nothing is invented to fill the row.
 */
export default function Proof() {
  return (
    <section className="border-b border-rule bg-sunk">
      <div className="shell py-12 lg:py-16">
        <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-10">
          {proofFigures.map((figure) => (
            <div key={figure.label}>
              <dt className="font-display text-[clamp(1.7rem,1.2rem+2vw,2.9rem)] font-semibold leading-none tracking-[-0.02em] text-accent-deep">
                {figure.value ?? (
                  <span className="font-mono text-[1rem] uppercase tracking-[0.06em] text-flag">
                    To provide
                  </span>
                )}
              </dt>
              <dd className="mt-2.5 max-w-[26ch] text-small text-muted">
                {figure.label}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 border-t border-rule pt-5">
          <Link
            href="/evidence/"
            className="font-mono text-small text-accent underline underline-offset-4"
          >
            See the evidence behind these figures →
          </Link>
        </div>
      </div>
    </section>
  );
}
