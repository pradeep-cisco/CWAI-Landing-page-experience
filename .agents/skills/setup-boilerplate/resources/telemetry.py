#!/usr/bin/env python3
import argparse
import datetime
import hashlib
import json
import os
import platform
import socket
import subprocess
import sys
import urllib.request
import uuid
from pathlib import Path

DEFAULT_ENDPOINT = "https://harbor.cisco.com/api/telemetry/context-generate"
SCHEMA = "harbor.context.generate.v1"
PACKAGE_NAME = "@harbor/context"
POST_TIMEOUT_SECONDS = 2
TEXT_MAX_CHARS = 1500
CHAT_SUMMARY_MAX_WORDS = 10
MAX_QUEUE_EVENTS = 100
MAX_FLUSH_EVENTS = 5
VALID_ACTIONS = {"start", "step", "finish", "log", "install", "artifact"}
DEFAULT_CONFIG_PATH = Path.home() / ".harbor-context" / "config.json"
DEFAULT_MAGNETIC_CONFIG_PATH = Path.home() / ".magnetic" / "config.json"
DEFAULT_STATE_DIR = Path.home() / ".harbor-context"


def optional(value):
    if value is None:
        return None
    normalized = str(value).strip()
    return normalized or None


def first_present(*values):
    for value in values:
        normalized = optional(value)
        if normalized:
            return normalized
    return None


def truncate(value, max_chars=TEXT_MAX_CHARS):
    normalized = optional(value)
    if not normalized:
        return None
    return normalized if len(normalized) <= max_chars else normalized[: max_chars - 3] + "..."


def truncate_words(value, max_words=CHAT_SUMMARY_MAX_WORDS):
    normalized = optional(value)
    if not normalized:
        return None
    words = normalized.split()
    return normalized if len(words) <= max_words else " ".join(words[:max_words])


def compact(record):
    return {key: value for key, value in record.items() if value not in (None, "")}


def positive_int(value, fallback=None, minimum=0):
    normalized = optional(value)
    if not normalized:
        return fallback
    try:
        parsed = int(normalized)
    except ValueError:
        return fallback
    return parsed if parsed >= minimum else fallback


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
        result = subprocess.run(["whoami"], check=True, capture_output=True, text=True, timeout=2)
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
    raw = "|".join([socket.gethostname() or "unknown", platform.system() or "unknown", platform.machine() or "unknown"])
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


def state_dir(env):
    return Path(env.get("HARBOR_CONTEXT_STATE_DIR") or DEFAULT_STATE_DIR).expanduser().resolve()


def read_or_create_install_id(env):
    path = state_dir(env) / "install-id"
    try:
        existing = optional(path.read_text(encoding="utf-8"))
        if existing:
            return existing
    except Exception:
        pass
    value = str(uuid.uuid4())
    try:
        path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        with path.open("x", encoding="utf-8") as handle:
            handle.write(value + "\n")
        path.chmod(0o600)
        return value
    except Exception:
        try:
            return optional(path.read_text(encoding="utf-8")) or value
        except Exception:
            return value


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
    parser.add_argument("--run-id", "--runId", dest="run_id")
    parser.add_argument("--parent-run-id", "--parentRunId", dest="parent_run_id")
    parser.add_argument("--event-id", "--eventId", dest="event_id")
    parser.add_argument("--install-id", "--installId", dest="install_id")
    parser.add_argument("--source-repo", "--sourceRepo", dest="source_repo")
    parser.add_argument("--distribution")
    parser.add_argument("--skill-version", "--skillVersion", dest="skill_version")
    parser.add_argument("--artifact-id", "--artifactId", dest="artifact_id")
    parser.add_argument("--artifact-type", "--artifactType", dest="artifact_type")
    parser.add_argument("--duration-ms", "--duration", dest="duration_ms", type=int)
    parser.add_argument("--thread-id", "--threadId", dest="thread_id")
    parser.add_argument("--chat-summary", "--chatSummary", dest="chat_summary")
    parser.add_argument("--iterations", "--iteration-count", "--iterationCount", type=int)
    parser.add_argument("--skill-invocations", "--skillInvocationCount", "--skill-invocation-count", dest="skill_invocation_count", type=int)
    parser.add_argument("--editor")
    parser.add_argument("--framework")
    parser.add_argument("--dry-run", "--json", dest="dry_run", action="store_true")
    return parser.parse_args(argv)


def build_payload(argv=None, env=None):
    env = env or os.environ
    args = parse_args(argv if argv is not None else sys.argv[1:])
    if args.action not in VALID_ACTIONS:
        raise ValueError("telemetry action must be one of: start, step, finish, log, install, artifact")
    if args.action == "step" and not optional(args.milestone):
        raise ValueError("telemetry step requires a milestone name")
    if args.duration_ms is not None and args.duration_ms < 0:
        raise ValueError("--duration-ms must be a non-negative integer")
    if args.iterations is not None and args.iterations < 0:
        raise ValueError("--iterations must be a non-negative integer")
    if args.skill_invocation_count is not None and args.skill_invocation_count <= 0:
        raise ValueError("--skill-invocations must be a positive integer")

    skill_invocations = args.skill_invocation_count or positive_int(
        first_present(env.get("HARBOR_CONTEXT_SKILL_INVOCATION_COUNT"), env.get("SKILL_INVOCATION_COUNT")), 1, 1
    )
    meta = compact({
        "schema": SCHEMA,
        "package": PACKAGE_NAME,
        "packageVersion": optional(env.get("HARBOR_CONTEXT_PACKAGE_VERSION")),
        "skill": args.skill,
        "cec": resolve_cisco_cec(env),
        "event": args.action,
        "eventId": args.event_id or str(uuid.uuid4()),
        "installId": args.install_id or optional(env.get("HARBOR_CONTEXT_INSTALL_ID")) or read_or_create_install_id(env),
        "sourceRepo": args.source_repo or optional(env.get("HARBOR_CONTEXT_SOURCE_REPO")) or "magnetic/boilerplate-web",
        "distribution": args.distribution or optional(env.get("HARBOR_CONTEXT_DISTRIBUTION")) or "boilerplate-web",
        "skillVersion": args.skill_version or optional(env.get("HARBOR_CONTEXT_SKILL_VERSION")),
        "milestone": optional(args.milestone),
        "taskKind": optional(args.task_kind),
        "status": optional(args.status) or "ok",
        "quality": optional(args.quality),
        "details": truncate(args.details),
        "issue": truncate(args.issue),
        "issueCategory": optional(args.issue_category),
        "runId": args.run_id or optional(env.get("HARBOR_CONTEXT_RUN_ID")) or str(uuid.uuid4()),
        "parentRunId": args.parent_run_id or optional(env.get("HARBOR_CONTEXT_PARENT_RUN_ID")),
        "durationMs": args.duration_ms,
        "threadId": first_present(args.thread_id, env.get("HARBOR_CONTEXT_THREAD_ID"), env.get("CODEX_THREAD_ID"), env.get("THREAD_ID")),
        "chatSummary": truncate_words(args.chat_summary),
        "iterations": args.iterations,
        "artifactId": args.artifact_id,
        "artifactType": args.artifact_type,
        "skillInvocationCount": skill_invocations,
        "runtime": "python",
    })
    return compact({
        "editor": optional(args.editor) or optional(env.get("HARBOR_CONTEXT_EDITOR")) or optional(env.get("EDITOR")) or "unknown",
        "machine": machine_fingerprint(),
        "framework": optional(args.framework) or optional(env.get("HARBOR_CONTEXT_FRAMEWORK")) or "unknown",
        "skillInvocationCount": skill_invocations,
        "prompt": truncate(args.summary),
        "meta": meta,
    })


def queue_path(env):
    return state_dir(env) / "telemetry-outbox.jsonl"


def read_queue(env):
    try:
        entries = []
        for line in queue_path(env).read_text(encoding="utf-8").splitlines():
            try:
                entries.append(json.loads(line))
            except json.JSONDecodeError:
                continue
        return entries
    except Exception:
        return []


def write_queue(env, entries):
    path = queue_path(env)
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    if not entries:
        try:
            path.unlink()
        except FileNotFoundError:
            pass
        return
    temporary = path.with_name(f"{path.name}.{os.getpid()}.tmp")
    temporary.write_text("\n".join(json.dumps(entry, separators=(",", ":")) for entry in entries[-MAX_QUEUE_EVENTS:]) + "\n", encoding="utf-8")
    temporary.chmod(0o600)
    temporary.replace(path)


def enqueue(env, payload):
    entries = read_queue(env)
    entries.append({"eventId": payload["meta"]["eventId"], "queuedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(), "payload": payload})
    write_queue(env, entries)


def post_payload(endpoint, payload):
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(endpoint, data=data, headers={"Content-Type": "application/json", "X-Telemetry-Event-Id": payload["meta"]["eventId"]}, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=POST_TIMEOUT_SECONDS) as response:
            return 200 <= response.status < 300
    except Exception:
        return False


def flush_queue(endpoint, env):
    entries = read_queue(env)
    if not entries:
        return
    remaining = []
    for index, entry in enumerate(entries):
        if index >= MAX_FLUSH_EVENTS or not post_payload(endpoint, entry.get("payload", {})):
            remaining.append(entry)
    write_queue(env, remaining)


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
    flush_queue(endpoint, os.environ)
    if post_payload(endpoint, payload):
        flush_queue(endpoint, os.environ)
    else:
        enqueue(os.environ, payload)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
