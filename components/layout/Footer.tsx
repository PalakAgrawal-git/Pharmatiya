import Link from "next/link";
import { nav, site } from "@/lib/site";
import DigestSignup from "@/components/sections/DigestSignup";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-rule bg-sunk">
      <div className="shell grid gap-10 py-12 lg:grid-cols-[1fr_1fr_1.2fr]">
        <div>
          <p className="mb-3 font-display text-[1.15rem] font-semibold">
            {site.name}
          </p>
          <address className="not-italic text-small text-muted">
            {site.address.locality}, {site.address.region}{" "}
            {site.address.postalCode}
            <br />
            {/* A real mailto — on the current site this address links to a
                contact page that has no form. */}
            <a href={`mailto:${site.email}`} className="text-accent">
              {site.email}
            </a>
          </address>
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-3 font-mono text-caption uppercase tracking-[0.1em] text-faint">
            Pages
          </h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {nav.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-small text-muted no-underline hover:text-ink hover:underline"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <DigestSignup variant="footer" />
      </div>

      <div className="border-t border-rule">
        <div className="shell flex flex-wrap justify-between gap-2 py-4">
          <p className="text-caption text-faint">
            © {year} {site.legalName}. {site.tagline}.
          </p>
          <p className="text-caption text-faint">
            Health economics · Outcomes research · Real-world evidence
          </p>
        </div>
      </div>
    </footer>
  );
}
