import Link from "next/link";
import { nav } from "@/lib/site";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="shell py-20 lg:py-28">
      <p className="mb-4 font-mono text-caption uppercase tracking-[0.14em] text-faint">
        404
      </p>
      <h1 className="mb-4 text-[clamp(1.9rem,1.5rem+2vw,2.9rem)]">
        That page does not exist.
      </h1>
      <p className="measure mb-8 text-muted">
        It may have moved during the site rebuild. Everything is one click
        away:
      </p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {nav.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="text-accent underline underline-offset-4">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
