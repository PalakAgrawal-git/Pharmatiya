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

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(serverBuild ? {} : { output: 'export' }),
  pageExtensions: serverBuild ? ['tsx', 'ts', 'api.ts'] : ['tsx', 'ts'],
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
