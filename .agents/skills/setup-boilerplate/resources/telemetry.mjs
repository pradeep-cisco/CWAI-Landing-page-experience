#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ENDPOINT = 'https://harbor.cisco.com/api/telemetry/context-generate';
const SCHEMA = 'harbor.context.generate.v2';
const SCHEMA_VERSION = 2;
const SOURCE = 'boilerplate_web';
const PACKAGE_NAME = '@harbor/context';
const POST_TIMEOUT_MS = 2000;
const TEXT_MAX_CHARS = 1500;
const CHAT_SUMMARY_MAX_WORDS = 10;
const MAX_QUEUE_EVENTS = 100;
const MAX_FLUSH_EVENTS = 5;
const VALID_ACTIONS = new Set(['start', 'step', 'finish', 'log', 'install', 'artifact']);
const EVENT_TYPES = {
  start: 'run_started',
  step: 'run_progress',
  finish: 'run_finished',
  log: 'run_recorded',
  install: 'installation_recorded',
  artifact: 'artifact_recorded',
};
const RUN_STATUS_ALIASES = {
  ok: 'completed',
  success: 'completed',
  succeeded: 'completed',
  complete: 'completed',
  completed: 'completed',
  error: 'failed',
  failure: 'failed',
  failed: 'failed',
  blocked: 'blocked',
  canceled: 'cancelled',
  cancelled: 'cancelled',
};
const DEFAULT_CONFIG_PATH = path.join(os.homedir(), '.harbor-context', 'config.json');
const DEFAULT_MAGNETIC_CONFIG_PATH = path.join(os.homedir(), '.magnetic', 'config.json');
const DEFAULT_STATE_DIR = path.join(os.homedir(), '.harbor-context');

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  let pending = null;
  for (const token of argv) {
    if (token.startsWith('--')) {
      const [rawKey, inlineValue] = token.slice(2).split(/=(.*)/s);
      if (inlineValue !== undefined) flags[rawKey] = inlineValue;
      else if (['dry-run', 'json'].includes(rawKey)) flags[rawKey] = true;
      else pending = rawKey;
    } else if (pending) {
      flags[pending] = token;
      pending = null;
    } else positional.push(token);
  }
  return { positional, flags };
}

function optionalString(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized || null;
}

function flag(flags, ...names) {
  for (const name of names) {
    const value = flags[name];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

function envFlag(flags, env, flagNames, envNames) {
  return flag(flags, ...flagNames) || envNames.map(name => optionalString(env[name])).find(Boolean) || null;
}

function normalizeRunStatus(action, status) {
  if (!['finish', 'log'].includes(action)) return null;
  return RUN_STATUS_ALIASES[optionalString(status)?.toLowerCase()] || null;
}

function truncate(value, maxChars = TEXT_MAX_CHARS) {
  const normalized = optionalString(value);
  if (!normalized) return null;
  return normalized.length <= maxChars ? normalized : `${normalized.slice(0, maxChars - 3)}...`;
}

function truncateWords(value, maxWords = CHAT_SUMMARY_MAX_WORDS) {
  const normalized = optionalString(value);
  if (!normalized) return null;
  const words = normalized.split(/\s+/).filter(Boolean);
  return words.length <= maxWords ? normalized : words.slice(0, maxWords).join(' ');
}

function compact(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
}

function readConfigCec(configPath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return optionalString(parsed?.identity?.cec);
  } catch {
    return null;
  }
}

function readWhoamiCec() {
  try {
    return optionalString(execSync('whoami', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim());
  } catch {
    return null;
  }
}

export function resolveCiscoCec(env = process.env) {
  return readWhoamiCec()
    || optionalString(env.HARBOR_CONTEXT_CEC)
    || readConfigCec(env.HARBOR_CONTEXT_CONFIG_PATH || DEFAULT_CONFIG_PATH)
    || optionalString(env.MAGNETIC_CEC)
    || readConfigCec(env.MAGNETIC_CONFIG_PATH || DEFAULT_MAGNETIC_CONFIG_PATH)
    || null;
}

function readLinuxMachineId() {
  for (const file of ['/etc/machine-id', '/var/lib/dbus/machine-id']) {
    try {
      const value = fs.readFileSync(file, 'utf8').trim();
      if (value) return value;
    } catch {}
  }
  return null;
}

function getRawMachineId() {
  try {
    if (process.platform === 'darwin') {
      return execSync("ioreg -rd1 -c IOPlatformExpertDevice | awk -F '\"' '/IOPlatformUUID/{print $4}'", {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
    }
    if (process.platform === 'win32') {
      const output = execSync('reg query HKLM\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid', {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      });
      return output.match(/MachineGuid\s+REG_SZ\s+([^\r\n]+)/i)?.[1]?.trim() || null;
    }
    if (process.platform === 'linux') return readLinuxMachineId();
  } catch {}
  return null;
}

export function getMachineFingerprint() {
  const raw = getRawMachineId() || `${os.hostname()}|${process.platform}|${process.arch}`;
  return createHash('sha256').update(raw).digest('hex');
}

function stateDir(env) {
  return path.resolve(env.HARBOR_CONTEXT_STATE_DIR || DEFAULT_STATE_DIR);
}

function readOrCreateInstallId(env) {
  const file = path.join(stateDir(env), 'install-id');
  try {
    const existing = optionalString(fs.readFileSync(file, 'utf8'));
    if (existing) return existing;
  } catch {}
  const value = randomUUID();
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
    fs.writeFileSync(file, `${value}\n`, { flag: 'wx', mode: 0o600 });
    return value;
  } catch {
    try { return optionalString(fs.readFileSync(file, 'utf8')) || value; } catch { return value; }
  }
}

function parseInteger(value, fallback = null, minimum = 0) {
  const normalized = optionalString(value);
  if (!normalized) return fallback;
  const parsed = Number.parseInt(normalized, 10);
  return Number.isInteger(parsed) && parsed >= minimum ? parsed : fallback;
}

function findPackageVersion() {
  const candidates = [process.env.HARBOR_CONTEXT_PACKAGE_VERSION, process.env.npm_package_version].filter(Boolean);
  if (candidates.length) return candidates[0];
  let cursor = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i += 1) {
    try {
      const parsed = JSON.parse(fs.readFileSync(path.join(cursor, 'package.json'), 'utf8'));
      if (parsed?.name === PACKAGE_NAME && parsed?.version) return parsed.version;
    } catch {}
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }
  return null;
}

export function buildTelemetryPayload(argv = process.argv.slice(2), env = process.env) {
  const { positional, flags } = parseArgs(argv);
  const action = positional[0];
  const skill = positional[1];
  const milestone = flag(flags, 'milestone') || (action === 'step' ? positional[2] : null);
  if (!VALID_ACTIONS.has(action) || !skill) {
    throw new Error('Usage: telemetry.mjs <start|step|finish|log|install|artifact> <skill> [milestone] [options]');
  }
  if (action === 'step' && !milestone) throw new Error('Telemetry step requires a milestone name.');

  const skillInvocationCount = parseInteger(
    envFlag(flags, env, ['skill-invocations', 'skillInvocationCount', 'skill-invocation-count'],
      ['HARBOR_CONTEXT_SKILL_INVOCATION_COUNT', 'SKILL_INVOCATION_COUNT']), 1, 1,
  );
  const legacyStatus = flag(flags, 'status') || 'ok';
  const runId = envFlag(flags, env, ['run-id', 'runId'], ['HARBOR_CONTEXT_RUN_ID', 'CODEX_RUN_ID']) || randomUUID();
  const eventType = EVENT_TYPES[action];
  const runStatus = normalizeRunStatus(action, legacyStatus);
  const meta = compact({
    schema: SCHEMA,
    schemaVersion: SCHEMA_VERSION,
    source: SOURCE,
    eventType,
    runStatus,
    package: PACKAGE_NAME,
    packageVersion: findPackageVersion(),
    skill,
    cec: resolveCiscoCec(env),
    event: action,
    eventId: flag(flags, 'event-id', 'eventId') || randomUUID(),
    installId: envFlag(flags, env, ['install-id', 'installId'], ['HARBOR_CONTEXT_INSTALL_ID']) || readOrCreateInstallId(env),
    sourceRepo: envFlag(flags, env, ['source-repo', 'sourceRepo'], ['HARBOR_CONTEXT_SOURCE_REPO']) || 'magnetic/boilerplate-web',
    distribution: envFlag(flags, env, ['distribution'], ['HARBOR_CONTEXT_DISTRIBUTION']) || 'boilerplate-web',
    skillVersion: envFlag(flags, env, ['skill-version', 'skillVersion'], ['HARBOR_CONTEXT_SKILL_VERSION']),
    milestone,
    taskKind: flag(flags, 'task-kind', 'kind'),
    status: legacyStatus,
    quality: flag(flags, 'quality'),
    details: truncate(flag(flags, 'details', 'detail')),
    issue: truncate(flag(flags, 'issue')),
    issueCategory: flag(flags, 'issue-category'),
    runId,
    parentRunId: envFlag(flags, env, ['parent-run-id', 'parentRunId'], ['HARBOR_CONTEXT_PARENT_RUN_ID']),
    durationMs: parseInteger(flag(flags, 'duration-ms', 'duration'), null, 0),
    threadId: envFlag(flags, env, ['thread-id', 'threadId'], ['HARBOR_CONTEXT_THREAD_ID', 'CODEX_THREAD_ID', 'THREAD_ID']),
    chatSummary: truncateWords(flag(flags, 'chat-summary', 'chatSummary')),
    iterations: parseInteger(flag(flags, 'iterations', 'iteration-count', 'iterationCount'), null, 0),
    artifactId: flag(flags, 'artifact-id', 'artifactId'),
    artifactType: flag(flags, 'artifact-type', 'artifactType'),
    skillInvocationCount,
    runtime: 'node',
  });

  return compact({
    schema_version: SCHEMA_VERSION,
    source: SOURCE,
    event_type: eventType,
    run_status: runStatus,
    run_id: runId,
    editor: flag(flags, 'editor') || env.HARBOR_CONTEXT_EDITOR || env.EDITOR || 'unknown',
    machine: getMachineFingerprint(),
    framework: flag(flags, 'framework') || env.HARBOR_CONTEXT_FRAMEWORK || 'unknown',
    skillInvocationCount,
    prompt: truncate(flag(flags, 'summary', 'prompt', 'prompt-summary')),
    meta,
  });
}

function queueFile(env) {
  return path.join(stateDir(env), 'telemetry-outbox.jsonl');
}

function readQueue(env) {
  try {
    return fs.readFileSync(queueFile(env), 'utf8').split('\n').filter(Boolean).flatMap(line => {
      try { return [JSON.parse(line)]; } catch { return []; }
    });
  } catch {
    return [];
  }
}

function writeQueue(env, entries) {
  const file = queueFile(env);
  const temporary = `${file}.${process.pid}.tmp`;
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  if (!entries.length) {
    try { fs.unlinkSync(file); } catch {}
    return;
  }
  fs.writeFileSync(temporary, `${entries.slice(-MAX_QUEUE_EVENTS).map(entry => JSON.stringify(entry)).join('\n')}\n`, { mode: 0o600 });
  fs.renameSync(temporary, file);
}

function enqueue(env, payload) {
  const entries = readQueue(env);
  entries.push({ eventId: payload.meta.eventId, queuedAt: new Date().toISOString(), payload });
  writeQueue(env, entries);
}

function postJson(endpoint, payload) {
  return new Promise(resolve => {
    let url;
    try { url = new URL(endpoint); } catch { resolve(false); return; }
    const body = JSON.stringify(payload);
    const client = url.protocol === 'http:' ? http : https;
    const request = client.request(url, {
      method: 'POST',
      timeout: POST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'X-Telemetry-Event-Id': payload.meta.eventId,
      },
    }, response => {
      response.resume();
      response.on('end', () => resolve(response.statusCode >= 200 && response.statusCode < 300));
    });
    request.on('timeout', () => { request.destroy(); resolve(false); });
    request.on('error', () => resolve(false));
    request.end(body);
  });
}

async function flushQueue(endpoint, env) {
  const entries = readQueue(env);
  if (!entries.length) return;
  const remaining = [];
  let attempted = 0;
  for (const entry of entries) {
    if (attempted >= MAX_FLUSH_EVENTS || !(await postJson(endpoint, entry.payload))) remaining.push(entry);
    attempted += 1;
  }
  writeQueue(env, remaining);
}

async function main() {
  if (process.env.HARBOR_CONTEXT_TELEMETRY_DISABLED === '1') return;
  let payload;
  try { payload = buildTelemetryPayload(); } catch (error) {
    if (process.argv.includes('--dry-run') || process.argv.includes('--json')) console.error(error.message);
    return;
  }
  if (process.argv.includes('--dry-run') || process.argv.includes('--json')) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }
  const endpoint = process.env.HARBOR_CONTEXT_GENERATE_TELEMETRY_URL || DEFAULT_ENDPOINT;
  await flushQueue(endpoint, process.env);
  if (await postJson(endpoint, payload)) await flushQueue(endpoint, process.env);
  else enqueue(process.env, payload);
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch(() => {});
