import Link from "next/link";
import { nav, site } from "@/lib/site";
import DigestSignup from "@/components/sections/DigestSignup";

/**
 * The footer closes the page on the dark ground.
 *
 * Ending on inverse rather than another light band gives the document a
 * bottom edge — without it the page trails off into the same bone it started
 * on. It is also the third and final use of the dark ground, which is what
 * keeps that ground meaning something.
 *
 * Deliberately underpopulated: the wordmark and what the practice does, the
 * six pages, one subscription. No sitemap sprawl, no social row, no repeated
 * calls to action.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-inverse text-white">
      <div className="shell section-tight grid gap-x-16 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="display text-[1.5rem] leading-none text-white">
            Pharmatiya <span className="text-white/45">Health</span>
          </p>
          <ul className="mt-6 flex flex-col gap-1.5 text-small text-white/55">
            <li>Health economics</li>
            <li>Outcomes research</li>
            <li>Real-world evidence</li>
          </ul>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3">
          <h2 className="label text-white/45">Pages</h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-2.5">
            {nav.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-small text-white/70 no-underline transition-colors hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4 lg:col-start-9">
          <DigestSignup variant="footer" />
        </div>
      </div>

      <div className="border-t border-white/12">
        <div className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-6">
          <p className="text-caption text-white/45">
            © {year} {site.legalName} · {site.address.locality},{" "}
            {site.address.region}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="text-caption text-white/45 no-underline transition-colors hover:text-white"
          >
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
