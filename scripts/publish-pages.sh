#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: npm run deploy:pages -- <repository-git-url>" >&2
  exit 2
fi

target_repo="$1"
repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

VITE_BASE_PATH=/pages/magnetic/boilerplate-web/ npm run build
cp dist/index.html dist/404.html
touch dist/.nojekyll

publish_dir="$(mktemp -d)"
trap 'rm -rf -- "$publish_dir"' EXIT
git init -q "$publish_dir"
git -C "$publish_dir" remote add origin "$target_repo"

existing_branch="$(git ls-remote --heads "$target_repo" gh-pages)"
if [[ -n "$existing_branch" ]]; then
  git -C "$publish_dir" fetch -q origin gh-pages
  git -C "$publish_dir" switch -q -c gh-pages FETCH_HEAD
  git -C "$publish_dir" rm -r -q --ignore-unmatch .
else
  git -C "$publish_dir" checkout -q --orphan gh-pages
fi

cp -R dist/. "$publish_dir/"
git -C "$publish_dir" add -A

if git -C "$publish_dir" diff --cached --quiet; then
  echo "GitHub Pages already contains this build."
  exit 0
fi

git -C "$publish_dir" commit -qm "Deploy GitHub Pages site"
git -C "$publish_dir" push origin gh-pages
