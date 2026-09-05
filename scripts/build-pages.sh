#!/usr/bin/env bash
# Build the site and sync it into the repository root.
#
# GitHub Pages on this repo is set to "Deploy from a branch", which serves the
# repository's own files rather than a build artifact. The Next.js build lands
# in ./out, which is gitignored, so a branch deploy could never see it — the
# repo root had no index.html, and Pages fell back to rendering README.md
# through Jekyll. Copying the build to the root is what makes the branch
# deploy serve the actual site.
#
# .nojekyll comes with it and matters: without it Pages runs Jekyll, and Jekyll
# skips any directory beginning with an underscore, which would drop the whole
# of _next/ and take every stylesheet and script with it.
set -euo pipefail
cd "$(dirname "$0")/.."

# Project sites are served from /<repo>, so assets need that prefix.
export NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH:-/Pharmatiya}"
export NEXT_PUBLIC_PREVIEW="${NEXT_PUBLIC_PREVIEW:-true}"

npm run build

# Replace only the generated entries, so nothing in the source tree is touched.
for entry in _next _not-found 404 about contact evidence nextgen-ai services; do
  rm -rf "./$entry"
done
rm -f ./index.html ./404.html ./robots.txt ./sitemap.xml ./index.txt ./__next.*.txt

cp -r out/. .
rm -rf ./out

echo "Built site synced to the repository root."
