#!/usr/bin/env bash
# Build the site and publish dist/ to the gh-pages branch (served by GitHub Pages).
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
remote="$(git remote get-url origin)"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp -r dist/. "$tmp/"
touch "$tmp/.nojekyll"  # serve files as-is, no Jekyll processing
cd "$tmp"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$OLDPWD" config user.name)" -c user.email="$(git -C "$OLDPWD" config user.email)" \
  commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git push -q -f "$remote" gh-pages
echo "Deployed to gh-pages"
