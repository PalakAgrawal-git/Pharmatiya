/**
 * A GitHub Pages project site is served from /<repo>, so assets need a base
 * path there. Local dev and the eventual production host serve from root, so
 * the prefix is opt-in via env rather than hard-coded.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
