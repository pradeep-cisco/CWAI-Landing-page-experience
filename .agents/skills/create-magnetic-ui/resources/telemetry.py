#!/usr/bin/env python3
import argparse
import hashlib
import json
import os
import platform
import socket
import subprocess
import sys
import urllib.request
from pathlib import Path

DEFAULT_ENDPOINT = "https://harbor.cisco.com/api/telemetry/context-generate"
SCHEMA = "harbor.context.generate.v1"
PACKAGE_NAME = "@harbor/context"
TEXT_MAX_CHARS = 1500
CHAT_SUMMARY_MAX_WORDS = 10
VALID_ACTIONS = {"start", "step", "finish", "log"}
DEFAULT_CONFIG_PATH = Path.home() / ".harbor-context" / "config.json"
DEFAULT_MAGNETIC_CONFIG_PATH = Path.home() / ".magnetic" / "config.json"


def optional(value):
    if value is None:
        return None
    normalized = str(value).strip()
    return normalized or None


def truncate(value, max_chars=TEXT_MAX_CHARS):
    normalized = optional(value)
    if not normalized:
        return None
    if len(normalized) <= max_chars:
        return normalized
    return normalized[: max_chars - 3] + "..."


def truncate_words(value, max_words=CHAT_SUMMARY_MAX_WORDS):
    normalized = optional(value)
    if not normalized:
        return None
    words = normalized.split()
    if len(words) <= max_words:
        return normalized
    return " ".join(words[:max_words])


def compact(record):
    return {key: value for key, value in record.items() if value not in (None, "")}


def first_present(*values):
    for value in values:
        normalized = optional(value)
        if normalized:
            return normalized
    return None


def positive_int(value, fallback=None):
    normalized = optional(value)
    if not normalized:
        return fallback
    try:
        parsed = int(normalized)
    except ValueError:
        return fallback
    return parsed if parsed > 0 else fallback


def read_config_cec(config_path):
    try:
        with Path(config_path).expanduser().open(encoding="utf-8") as handle:
            parsed = json.load(handle)
    except Exception:
        return None
    identity = parsed.get("identity") if isinstance(parsed, dict) else None
    return optional(identity.get("cec")) if isinstance(identity, dict) else None


def read_whoami_cec():
    try:
        result = subprocess.run(
            ["whoami"],
            check=True,
            capture_output=True,
            text=True,
            timeout=2,
        )
    except Exception:
        return None
    return optional(result.stdout)


def resolve_cisco_cec(env=None):
    env = env or os.environ
    return first_present(
        read_whoami_cec(),
        env.get("HARBOR_CONTEXT_CEC"),
        read_config_cec(env.get("HARBOR_CONTEXT_CONFIG_PATH") or DEFAULT_CONFIG_PATH),
        env.get("MAGNETIC_CEC"),
        read_config_cec(env.get("MAGNETIC_CONFIG_PATH") or DEFAULT_MAGNETIC_CONFIG_PATH),
    )


def machine_fingerprint():
    raw = "|".join(
        [
            socket.gethostname() or "unknown",
            platform.system() or "unknown",
            platform.machine() or "unknown",
        ]
    )
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def parse_args(argv):
    parser = argparse.ArgumentParser(add_help=True)
    parser.add_argument("action")
    parser.add_argument("skill")
    parser.add_argument("milestone", nargs="?")
    parser.add_argument("--task-kind", "--kind", dest="task_kind")
    parser.add_argument("--summary", "--prompt", "--prompt-summary", dest="summary")
    parser.add_argument("--details", "--detail", dest="details")
    parser.add_argument("--issue")
    parser.add_argument("--issue-category", dest="issue_category")
    parser.add_argument("--quality")
    parser.add_argument("--status", default="ok")
    parser.add_argument("--run-id", dest="run_id")
    parser.add_argument("--duration-ms", "--duration", dest="duration_ms", type=int)
    parser.add_argument("--thread-id", "--threadId", dest="thread_id")
    parser.add_argument("--chat-summary", "--chatSummary", dest="chat_summary")
    parser.add_argument("--iterations", "--iteration-count", "--iterationCount", dest="iterations", type=int)
    parser.add_argument(
        "--skill-invocations",
        "--skillInvocationCount",
        "--skill-invocation-count",
        dest="skill_invocation_count",
        type=int,
    )
    parser.add_argument("--editor")
    parser.add_argument("--framework")
    parser.add_argument("--dry-run", "--json", dest="dry_run", action="store_true")
    return parser.parse_args(argv)


def build_payload(argv=None, env=None):
    env = env or os.environ
    args = parse_args(argv if argv is not None else sys.argv[1:])
    if args.action not in VALID_ACTIONS:
        raise ValueError("telemetry action must be one of: start, step, finish, log")
    if args.action == "step" and not optional(args.milestone):
        raise ValueError("telemetry step requires a milestone name")
    if args.duration_ms is not None and args.duration_ms < 0:
        raise ValueError("--duration-ms must be a non-negative integer")
    if args.iterations is not None and args.iterations < 0:
        raise ValueError("--iterations must be a non-negative integer")
    if args.skill_invocation_count is not None and args.skill_invocation_count <= 0:
        raise ValueError("--skill-invocations must be a positive integer")

    cec = resolve_cisco_cec(env)
    skill_invocation_count = args.skill_invocation_count or positive_int(
        first_present(
            env.get("HARBOR_CONTEXT_SKILL_INVOCATION_COUNT"),
            env.get("SKILL_INVOCATION_COUNT"),
        ),
        1,
    )

    meta = compact(
        {
            "schema": SCHEMA,
            "package": PACKAGE_NAME,
            "packageVersion": optional(env.get("HARBOR_CONTEXT_PACKAGE_VERSION")),
            "skill": args.skill,
            "cec": cec,
            "event": args.action,
            "milestone": optional(args.milestone),
            "taskKind": optional(args.task_kind),
            "status": optional(args.status) or "ok",
            "quality": optional(args.quality),
            "details": truncate(args.details),
            "issue": truncate(args.issue),
            "issueCategory": optional(args.issue_category),
            "runId": optional(args.run_id),
            "durationMs": args.duration_ms,
            "threadId": first_present(
                args.thread_id,
                env.get("HARBOR_CONTEXT_THREAD_ID"),
                env.get("CODEX_THREAD_ID"),
                env.get("THREAD_ID"),
            ),
            "chatSummary": truncate_words(args.chat_summary),
            "iterations": args.iterations,
            "skillInvocationCount": skill_invocation_count,
            "runtime": "python",
        }
    )

    return compact(
        {
            "editor": optional(args.editor)
            or optional(env.get("HARBOR_CONTEXT_EDITOR"))
            or optional(env.get("EDITOR"))
            or "unknown",
            "machine": machine_fingerprint(),
            "framework": optional(args.framework)
            or optional(env.get("HARBOR_CONTEXT_FRAMEWORK"))
            or "unknown",
            "skillInvocationCount": skill_invocation_count,
            "prompt": truncate(args.summary),
            "meta": meta,
        }
    )


def post_payload(endpoint, payload):
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        endpoint,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=2) as response:
            return 200 <= response.status < 300
    except Exception:
        return False


def main():
    if os.environ.get("HARBOR_CONTEXT_TELEMETRY_DISABLED") == "1":
        return 0

    try:
        args = parse_args(sys.argv[1:])
        payload = build_payload(sys.argv[1:])
    except Exception as exc:
        if "--dry-run" in sys.argv or "--json" in sys.argv:
            print(str(exc), file=sys.stderr)
        return 0

    if args.dry_run:
        print(json.dumps(payload, indent=2))
        return 0

    endpoint = os.environ.get("HARBOR_CONTEXT_GENERATE_TELEMETRY_URL") or DEFAULT_ENDPOINT
    post_payload(endpoint, payload)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
