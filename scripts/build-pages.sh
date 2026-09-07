#!/usr/bin/env bash
# Build the site and publish it into docs/.
#
# GitHub Pages on this repo is set to "Deploy from a branch", which serves the
# repository's own files rather than a build artifact. next build writes to
# ./out, which is gitignored, so a branch deploy can never see it.
#
# The published directory is docs/ rather than the repository root. Serving
# from the root meant every tracked file there was downloadable from the live
# site — including the resume, which carries the personal contact details and
# licence numbers the Disclosure boundary keeps off the site deliberately.
# Pages source must be set to: Branch main, Folder /docs.
#
# .nojekyll ships with the build and is load-bearing: without it Pages runs
# Jekyll, and Jekyll skips any directory beginning with an underscore, which
# would drop the whole of _next/ and take every stylesheet and script with it.
set -euo pipefail
cd "$(dirname "$0")/.."

# Project sites are served from /<repo>, so assets need that prefix.
export NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH:-/Pharmatiya}"
export NEXT_PUBLIC_PREVIEW="${NEXT_PUBLIC_PREVIEW:-true}"

npm run build

# Remove only what a previous build generated. The hand-authored documents in
# docs/ — architecture, wireframes, roadmap, the content request — live in the
# same directory and must survive.
for entry in _next _not-found 404 about contact evidence nextgen-ai services; do
  rm -rf "./docs/$entry"
done
rm -f ./docs/index.html ./docs/404.html ./docs/robots.txt ./docs/sitemap.xml \
      ./docs/index.txt ./docs/__next.*.txt ./docs/.nojekyll

mkdir -p docs
cp -r out/. docs/
rm -rf ./out

echo "Built site published to docs/."
