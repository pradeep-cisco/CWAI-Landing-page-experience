---
name: setup-boilerplate
description: Use this skill when updating this Magnetic boilerplate repository from the upstream remote, preserving local prototype files, resolving update conflicts, reinstalling dependencies, rebuilding, and restarting the dev server.
---

# Setup Boilerplate

## Purpose

Use this skill to safely refresh this repository from `upstream/main` without losing local prototype work. The expected outcome is: local work preserved, repo rebased onto the latest upstream code, conflicts resolved, dependencies refreshed, build verified, and the dev server running again.

## Downstream Elements routes

Use the package-generated Elements setup skill at:

`resources/elements-project-setup/SKILL.md`

Read it before installing Harbor Elements or resolving the project's Elements profile. For UI generation, use the repository adapter at `../create-magnetic-ui/SKILL.md`. Do not expose or recreate package-generated `elements-*` skills at the top level.

## Default Workflow

Prefer the bundled script for the repeatable parts:

```bash
.agents/skills/setup-boilerplate/scripts/update_boilerplate.sh
```

The script:

1. Checks Git and `pnpm` prerequisites.
2. Refuses to run during an unfinished merge, rebase, cherry-pick, or revert.
3. Disables pushes to the canonical repository when `origin` points there.
4. Adds or corrects `upstream` to `https://wwwin-github.cisco.com/kabimany/magnetic-boilerplate`.
5. Disables pushes to the canonical repository through `upstream`.
6. Stashes modified and untracked non-ignored files with a recognizable stash name.
7. Runs `git remote update`.
8. Runs `git rebase upstream/main`.
9. Pops the saved stash if one was created.
10. Stops the dev server when it was previously started by this script, or when `DEV_SERVER_PID` is provided.
11. Runs `pnpm install`.
12. Runs `pnpm build`.
13. Starts `pnpm dev` in the background and writes `.setup-boilerplate-dev.pid` plus `.setup-boilerplate-dev.log`.

After the script completes, report the dev server URL from the script output and mention the log file if the user needs troubleshooting.

## Conflict Handling

If the rebase or stash pop reports conflicts, resolve them before handing the repo back.

1. Inspect conflict state:

```bash
git status --short
git diff --name-only --diff-filter=U
```

2. Open each conflicted file, preserve the local prototype intent where possible, and reconcile it with upstream changes.
3. Stage resolved files:

```bash
git add <resolved-files>
```

4. Continue based on the operation:
   - During rebase: run `git rebase --continue`, then continue the setup workflow from dependency installation.
   - During stash pop conflicts: there is no `stash pop --continue`; after staging resolutions, verify `git status`, keep or drop the stash only after confirming local changes are present.

5. If a generated file conflicts, prefer regenerating it after `pnpm install` or `pnpm build` unless it was intentionally edited.

Never discard local work to make the update easier. If a file cannot be reconciled confidently, explain the exact file and competing changes before asking for direction.

## Guardrails

- **Wrong directory**: First verify `git rev-parse --show-toplevel` points to this repo and `package.json` exists.
- **Accidental pushes to the canonical repo**: If `origin` or `upstream` points at `https://wwwin-github.cisco.com/kabimany/magnetic-boilerplate`, set that remote's `pushurl` to `DISABLED_PUSH_TO_CANONICAL_REPO`. This preserves fetch/rebase behavior while making accidental pushes fail.
- **Missing `upstream` remote**: Add `https://wwwin-github.cisco.com/kabimany/magnetic-boilerplate` automatically, then continue.
- **Wrong `upstream` remote**: Correct it to `https://wwwin-github.cisco.com/kabimany/magnetic-boilerplate`, then continue.
- **Missing `upstream/main`**: Run `git remote update` again. If it still does not exist, inspect `git branch -r` and ask whether the upstream default branch changed.
- **Detached HEAD**: Stop and ask which branch should be updated. Rebase work should happen on a branch.
- **Unfinished Git operation**: Stop. Resolve or abort the existing operation before starting this workflow.
- **Local commits ahead of upstream**: `git rebase upstream/main` is still valid. If the local commits conflict, resolve them during the rebase.
- **Rebase failed because history diverged badly**: Do not hard reset. Offer to create a backup branch with `git branch backup/<name>-before-update` before any risky recovery.
- **Stash pop conflicts**: Git normally keeps the stash when conflicts occur. Do not drop it until the local work has been verified in the working tree.
- **Untracked files**: Use `git stash push --include-untracked` so new prototype files are preserved. Do not use `--all`; ignored dependency and build folders should not be stashed.
- **Dependency install fails**: Check for VPN, registry, auth, or lockfile errors. Retry only after identifying the likely cause. Keep the repo updated even if installation needs separate auth help.
- **Build fails after update**: Treat it as a real compatibility issue. Inspect the error, fix code if it is caused by the local prototype, or report the upstream breakage clearly.
- **Dev server already running**: Stop the known server session or pass `DEV_SERVER_PID=<pid>` to the script. Avoid killing unrelated Node processes.
- **Port already in use**: Start Vite on the next available port or set `DEV_SERVER_PORT=<port>` when rerunning the script.
- **Package manager mismatch**: This repo has `pnpm-lock.yaml`; use `pnpm`, not `npm install`, for this workflow.

## Manual Command Sequence

Use this when the script is unavailable or you need closer control:

```bash
git status --short
git config --unset-all remote.origin.pushurl || true # only if origin points to the canonical repo
git config --add remote.origin.pushurl DISABLED_PUSH_TO_CANONICAL_REPO # only if origin points to the canonical repo
git stash push --include-untracked -m "setup-boilerplate before upstream rebase $(date +%Y%m%d-%H%M%S)"
git remote add upstream https://wwwin-github.cisco.com/kabimany/magnetic-boilerplate # only if missing
git config --unset-all remote.upstream.pushurl || true
git config --add remote.upstream.pushurl DISABLED_PUSH_TO_CANONICAL_REPO
git remote update
git rebase upstream/main
git stash pop
pnpm install
pnpm build
pnpm dev
```

If there were no local changes, skip the stash push and stash pop. If `git stash push` says no local changes were saved, do not run `git stash pop`.

## Completion Checklist

Before reporting completion:

- `git status --short` has no unresolved conflict markers or unmerged paths.
- Local prototype files are present after the stash pop.
- `pnpm install` completed.
- `pnpm build` completed.
- The dev server is running and the URL is known.
- Any remaining non-blocking local changes are clearly summarized.

## Telemetry

After the setup workflow completes, record exactly one best-effort task telemetry event from this skill directory:

```bash
node ".agents/skills/setup-boilerplate/resources/telemetry.mjs" log setup-boilerplate --task-kind update --status ok --quality verified --summary "<task outcome, max 10 words>" --chat-summary "<success/viability summary, max 10 words>" --iterations "<successful iteration count>" --skill-invocations "<setup-boilerplate invocations in this assistant task>" --editor codex --framework react
```

The telemetry payload must use `editor=codex` and `framework=react`. The telemetry helper runs `whoami` and sends that value as `meta.cec`. The `meta.skill` value is the invoked skill, `setup-boilerplate`; do not include any other skill names in the telemetry event. Make `--summary` and `--chat-summary` concise outcome judgments. Set `--iterations` to the number of update/build/retry cycles needed to reach the final outcome, and use `--skill-invocations 1` unless this skill was invoked more than once in the same assistant task.

If the setup workflow is blocked or fails, send the same single `log` event with `--status blocked` or `--status error`, include `--issue "<short blocker/failure>"` plus `--issue-category "<git|dependencies|build|runtime|validation>"`, and keep `--editor codex --framework react`. If Node is unavailable but Python is available, use `python3 ".agents/skills/setup-boilerplate/resources/telemetry.py"` with the same arguments. If neither `node` nor `python3` is available, skip telemetry and continue. Telemetry is best-effort and must never block the setup workflow or final response.
