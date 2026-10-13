/**
 * A GitHub Pages project site is served from /<repo>, so assets need a base
 * path there. Local dev and the eventual production host serve from root, so
 * the prefix is opt-in via env rather than hard-coded.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Static export, unless a server is asked for.
 *
 * The site is a set of files by default, which is what a host like GitHub
 * Pages can serve. But files cannot hold a secret: an API key in anything
 * the browser downloads is readable by every visitor. So the drafting
 * service at app/api/synopsis needs somewhere to run.
 *
 * Set SERVER_BUILD=1 (Vercel, or any Node host) and that route is deployed
 * and the key stays on the server. Leave it unset and the export is
 * unchanged — the route is simply not built, and the synopsis builder falls
 * back to drafting in the browser.
 *
 * The route lives in a file named route.api.ts, and `api.ts` is only a
 * recognised page extension in a server build. A static export therefore
 * does not see the file at all, rather than failing because it found one.
 */
const serverBuild = process.env.SERVER_BUILD === '1';

/**
 * The addresses the old site answered on.
 *
 * Taken from its sitemap the day before the domain moved. Anyone holding a
 * bookmark, a link in an email, or a search result for one of these would
 * otherwise meet a 404 the moment DNS changes — and a search engine seeing
 * 404s where it had ranked pages drops them rather than following to the
 * replacements.
 *
 * Permanent, because they are: the old pages are not coming back, and a
 * permanent redirect is what passes a page's standing to its successor.
 *
 * Only in a server build. A static export cannot redirect, so a host like
 * GitHub Pages serves the site without these; the live site is on Vercel,
 * which can.
 */
const OLD_PAGES = [
  ['/home/', '/'],
  ['/aboutus/', '/about/'],
  /* The old booking page. The new contact page keeps booking in its own
     section rather than on a page of its own. */
  ['/appointments/', '/contact/#demo'],
  /* Sign-up for the separate application, which this site does not replace. */
  ['/register/', '/contact/'],
  /* The old site's matcher is the ancestor of the synopsis builder. */
  ['/rwe-matcher/', '/rwe-synopsis/'],
  /* Pages with no successor: drafts and personal pages left published.
     Sent to the front page rather than nowhere. */
  ['/adrika/', '/'],
  ['/vacation/', '/'],
  ['/dev/', '/'],
  ['/dev2/', '/'],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(serverBuild ? {} : { output: 'export' }),
  pageExtensions: serverBuild ? ['tsx', 'ts', 'api.ts'] : ['tsx', 'ts'],
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
  ...(serverBuild
    ? {
        async redirects() {
          return OLD_PAGES.map(([source, destination]) => ({
            source,
            destination,
            permanent: true,
          }));
        },
      }
    : {}),
};

export default nextConfig;
