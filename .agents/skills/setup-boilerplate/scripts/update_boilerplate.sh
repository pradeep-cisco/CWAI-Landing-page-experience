#!/usr/bin/env bash
set -euo pipefail

log() {
  printf '[setup-boilerplate] %s\n' "$*"
}

fail() {
  printf '[setup-boilerplate] ERROR: %s\n' "$*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

canonical_upstream_url="https://wwwin-github.cisco.com/kabimany/magnetic-boilerplate"
disabled_push_url="DISABLED_PUSH_TO_CANONICAL_REPO"

normalize_remote_url() {
  local url="$1"
  url="${url%.git}"
  case "$url" in
    git@wwwin-github.cisco.com:kabimany/magnetic-boilerplate)
      printf '%s\n' "$canonical_upstream_url"
      ;;
    git@github-cisco-wwwin:kabimany/magnetic-boilerplate)
      printf '%s\n' "$canonical_upstream_url"
      ;;
    ssh://git@wwwin-github.cisco.com/kabimany/magnetic-boilerplate)
      printf '%s\n' "$canonical_upstream_url"
      ;;
    *)
      printf '%s\n' "$url"
      ;;
  esac
}

disable_push_to_canonical_remote() {
  local remote_name="$1"
  local remote_url
  remote_url="$(git remote get-url "$remote_name" 2>/dev/null || true)"
  [[ -n "$remote_url" ]] || return 0

  if [[ "$(normalize_remote_url "$remote_url")" == "$canonical_upstream_url" ]]; then
    git config --unset-all "remote.$remote_name.pushurl" >/dev/null 2>&1 || true
    git config --add "remote.$remote_name.pushurl" "$disabled_push_url"
    log "Disabled pushes to canonical repository through '$remote_name'."
  fi
}

repo_root="$(git rev-parse --show-toplevel 2>/dev/null)" || fail "Run this from inside a Git repository."
cd "$repo_root"

require_command git
require_command pnpm

[[ -f package.json ]] || fail "package.json was not found at $repo_root."
[[ -f pnpm-lock.yaml ]] || fail "pnpm-lock.yaml was not found. This workflow expects pnpm."

git_dir="$(git rev-parse --git-dir)"
if [[ -d "$git_dir/rebase-merge" || -d "$git_dir/rebase-apply" ]]; then
  fail "A rebase is already in progress. Resolve it or run 'git rebase --abort' before setup."
fi
if [[ -f "$git_dir/MERGE_HEAD" ]]; then
  fail "A merge is already in progress. Resolve it or run 'git merge --abort' before setup."
fi
if [[ -f "$git_dir/CHERRY_PICK_HEAD" ]]; then
  fail "A cherry-pick is already in progress. Resolve it or run 'git cherry-pick --abort' before setup."
fi
if [[ -f "$git_dir/REVERT_HEAD" ]]; then
  fail "A revert is already in progress. Resolve it or run 'git revert --abort' before setup."
fi

current_branch="$(git branch --show-current)"
[[ -n "$current_branch" ]] || fail "Detached HEAD detected. Check out the working branch first."

disable_push_to_canonical_remote origin

if ! git remote get-url upstream >/dev/null 2>&1; then
  log "Adding canonical upstream remote: $canonical_upstream_url"
  git remote add upstream "$canonical_upstream_url"
else
  upstream_url="$(git remote get-url upstream)"
  normalized_upstream_url="$(normalize_remote_url "$upstream_url")"
  if [[ "$normalized_upstream_url" != "$canonical_upstream_url" || "$upstream_url" != "$canonical_upstream_url" ]]; then
    log "Setting upstream remote to canonical HTTPS URL: $canonical_upstream_url"
    git remote set-url upstream "$canonical_upstream_url"
  fi
fi
disable_push_to_canonical_remote upstream

stash_ref=""
if [[ -n "$(git status --porcelain=v1)" ]]; then
  stash_message="setup-boilerplate before upstream rebase $(date +%Y%m%d-%H%M%S)"
  log "Stashing local work: $stash_message"
  before_stash="$(git rev-parse -q --verify refs/stash 2>/dev/null || true)"
  git stash push --include-untracked -m "$stash_message"
  after_stash="$(git rev-parse -q --verify refs/stash 2>/dev/null || true)"
  if [[ "$before_stash" != "$after_stash" && -n "$after_stash" ]]; then
    stash_ref="stash@{0}"
  fi
else
  log "No local changes to stash."
fi

log "Updating remotes."
git remote update

if ! git rev-parse --verify --quiet upstream/main >/dev/null; then
  fail "upstream/main was not found after remote update. Check whether the upstream default branch changed."
fi

log "Rebasing $current_branch onto upstream/main."
if ! git rebase upstream/main; then
  log "Rebase stopped with conflicts. Resolve conflicted files, run 'git add <files>', then 'git rebase --continue'."
  exit 2
fi

if [[ -n "$stash_ref" ]]; then
  log "Restoring stashed local work."
  if ! git stash pop "$stash_ref"; then
    log "Stash pop stopped with conflicts. Resolve conflicted files, then verify local work before dropping any stash."
    exit 3
  fi
else
  log "No setup stash to restore."
fi

pid_file="$repo_root/.setup-boilerplate-dev.pid"
if [[ -n "${DEV_SERVER_PID:-}" ]]; then
  if kill -0 "$DEV_SERVER_PID" >/dev/null 2>&1; then
    log "Stopping dev server from DEV_SERVER_PID=$DEV_SERVER_PID."
    kill "$DEV_SERVER_PID" || true
    sleep 2
  fi
elif [[ -f "$pid_file" ]]; then
  old_pid="$(cat "$pid_file")"
  if [[ -n "$old_pid" ]] && kill -0 "$old_pid" >/dev/null 2>&1; then
    log "Stopping dev server from $pid_file: $old_pid."
    kill "$old_pid" || true
    sleep 2
  fi
  rm -f "$pid_file"
else
  log "No tracked dev server PID found. If another dev server is running, stop it or rerun with DEV_SERVER_PID=<pid>."
fi

log "Installing dependencies with pnpm."
pnpm install

log "Building the app."
pnpm build

dev_port="${DEV_SERVER_PORT:-5173}"
log_file="$repo_root/.setup-boilerplate-dev.log"
log "Starting dev server on port $dev_port."
nohup pnpm dev -- --host 127.0.0.1 --port "$dev_port" >"$log_file" 2>&1 &
new_pid="$!"
printf '%s\n' "$new_pid" >"$pid_file"

sleep 3
if ! kill -0 "$new_pid" >/dev/null 2>&1; then
  fail "Dev server exited early. Check $log_file."
fi

log "Dev server started: http://127.0.0.1:$dev_port"
log "PID file: $pid_file"
log "Log file: $log_file"
