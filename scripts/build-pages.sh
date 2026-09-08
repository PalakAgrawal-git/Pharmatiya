#!/usr/bin/env bash
# Build the site and publish it where GitHub Pages can serve it.
#
# Pages here is set to "Deploy from a branch", which serves the repository's
# own files rather than a build artifact. next build writes to ./out, which is
# gitignored, so a branch deploy can never see it.
#
# The build is published to BOTH docs/ and the repository root, because the
# Pages "folder" setting decides which one is live and it is currently still
# the root. Publishing to only one of them silently serves a stale site: that
# is exactly what happened when this script was switched to docs/ alone while
# the setting still pointed at the root.
#
# docs/ is where it should end up. Serving from the root exposes every tracked
# file there — including the resume, with the personal contact details and
# licence numbers the Disclosure boundary keeps off the site. Once Pages is set
# to Branch main / Folder /docs, drop PUBLISH_ROOT and delete the generated
# entries from the root.
#
# .nojekyll is load-bearing wherever the site is served from: without it Pages
# runs Jekyll, and Jekyll skips directories beginning with an underscore, which
# drops _next/ and takes every stylesheet and script with it.
set -euo pipefail
cd "$(dirname "$0")/.."

# Git Bash and MSYS rewrite anything that looks like a Unix path when it is
# passed to a native binary, so NEXT_PUBLIC_BASE_PATH=/Pharmatiya reached Next
# as "C:/Program Files/Git/Pharmatiya" and the build aborted. Harmless
# everywhere else; without it this script simply cannot run on Windows.
export MSYS_NO_PATHCONV=1
export MSYS2_ARG_CONV_EXCL='*' 

PUBLISH_ROOT="${PUBLISH_ROOT:-1}"   # set to 0 once Pages serves /docs

export NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH:-/Pharmatiya}"
export NEXT_PUBLIC_PREVIEW="${NEXT_PUBLIC_PREVIEW:-true}"

npm run build

# Entries a previous build generated. Everything else in a target directory is
# hand-authored and must survive — docs/ also holds the architecture,
# wireframes, roadmap and content-request documents.
GENERATED_DIRS="_next _not-found 404 about contact evidence nextgen-ai services"
GENERATED_FILES="index.html 404.html robots.txt sitemap.xml llms.txt og.png index.txt .nojekyll"

publish_to() {
  local dest="$1"
  mkdir -p "$dest"
  for d in $GENERATED_DIRS; do rm -rf "${dest:?}/$d"; done
  for f in $GENERATED_FILES; do rm -f "${dest:?}/$f"; done
  rm -f "${dest:?}"/__next.*.txt "${dest:?}"/icon.svg "${dest:?}"/apple-icon.png
  cp -r out/. "$dest"/
}

publish_to docs
[ "$PUBLISH_ROOT" = "1" ] && publish_to .

rm -rf ./out
echo "Built site published to docs/$([ "$PUBLISH_ROOT" = "1" ] && echo " and the repository root")."
