#!/bin/bash
# Build the site and publish dist/ to the main branch of the live repo.
# GitHub Pages serves main at path "/" for frappandcapp.com.
# Source, build and docs live on the "source" branch. Usage: ./deploy.sh "commit message"
set -euo pipefail
REPO="https://github.com/tlcgithubaccount/Frappandcapp.git"
MSG="${1:-Deploy site}"
cd "$(dirname "$0")"

node build.mjs
python3 tools/htmlcheck.py dist/index.html dist/*/index.html
rm -f dist/preview.html dist/frapp-capp-docket-site*.html

WORK=$(mktemp -d)
git clone -q --branch main --single-branch "$REPO" "$WORK"
# replace the published files, keeping git history
find "$WORK" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R dist/. "$WORK"/
printf '# frappandcapp.com\n\nThis branch is the built site served by GitHub Pages. Do not edit here.\nSource, build and docs are on the `source` branch: `git switch source`, edit, then `./deploy.sh "message"`.\n' > "$WORK/README.md"
git -C "$WORK" add -A
if git -C "$WORK" diff --cached --quiet; then echo "Nothing to deploy."; rm -rf "$WORK"; exit 0; fi
git -C "$WORK" commit -q -m "$MSG"
git -C "$WORK" push -q origin main
rm -rf "$WORK"
echo "Deployed to main. GitHub Pages rebuilds in about a minute: https://frappandcapp.com/"
