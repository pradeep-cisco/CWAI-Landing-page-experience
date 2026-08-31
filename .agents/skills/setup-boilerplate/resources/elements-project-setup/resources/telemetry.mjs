#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_ENDPOINT = 'https://harbor.cisco.com/api/telemetry/context-generate';
const SCHEMA = 'harbor.context.generate.v1';
const PACKAGE_NAME = '@harbor/context';
const POST_TIMEOUT_MS = 2000;
const TEXT_MAX_CHARS = 1500;
const CHAT_SUMMARY_MAX_WORDS = 10;
const VALID_ACTIONS = new Set(['start', 'step', 'finish', 'log']);
const DEFAULT_CONFIG_PATH = path.join(os.homedir(), '.harbor-context', 'config.json');
const DEFAULT_MAGNETIC_CONFIG_PATH = path.join(os.homedir(), '.magnetic', 'config.json');

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  let pending = null;

  for (const token of argv) {
    if (token.startsWith('--')) {
      const [rawKey, inlineValue] = token.slice(2).split(/=(.*)/s);
      if (inlineValue !== undefined) {
        flags[rawKey] = inlineValue;
      } else if (['dry-run', 'json'].includes(rawKey)) {
        flags[rawKey] = true;
        pending = null;
      } else {
        pending = rawKey;
      }
    } else if (pending) {
      flags[pending] = token;
      pending = null;
    } else {
      positional.push(token);
    }
  }

  return { positional, flags };
}

function optionalString(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized ? normalized : null;
}

function readConfigCec(configPath) {
  try {
    const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return optionalString(parsed?.identity?.cec);
  } catch {
    return null;
  }
}

export function resolveCiscoCec(env = process.env, explicitCec = null) {
  return optionalString(explicitCec)
    || optionalString(env.HARBOR_CONTEXT_CEC)
    || readConfigCec(env.HARBOR_CONTEXT_CONFIG_PATH || DEFAULT_CONFIG_PATH)
    || optionalString(env.MAGNETIC_CEC)
    || readConfigCec(env.MAGNETIC_CONFIG_PATH || DEFAULT_MAGNETIC_CONFIG_PATH)
    || null;
}

function flag(flags, ...names) {
  for (const name of names) {
    const value = flags[name];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return null;
}

function truncate(value, maxChars = TEXT_MAX_CHARS) {
  const normalized = optionalString(value);
  if (!normalized) return null;
  return normalized.length <= maxChars ? normalized : `${normalized.slice(0, maxChars - 1)}...`;
}

function compact(record) {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  );
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

function findPackageVersion() {
  const candidates = [
    process.env.HARBOR_CONTEXT_PACKAGE_VERSION,
    process.env.npm_package_version,
  ].filter(Boolean);
  if (candidates.length) return candidates[0];

  let cursor = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i++) {
    const packagePath = path.join(cursor, 'package.json');
    try {
      const parsed = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      if (parsed?.name === PACKAGE_NAME && parsed?.version) return parsed.version;
    } catch {}
    const parent = path.dirname(cursor);
    if (parent === cursor) break;
    cursor = parent;
  }

  return null;
}

function parseDurationMs(value) {
  const normalized = optionalString(value);
  if (!normalized) return null;
  const parsed = Number.parseInt(normalized, 10);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : null;
}

function parsePositiveInt(value, fallback = null) {
  const normalized = optionalString(value);
  if (!normalized) return fallback;
  const parsed = Number.parseInt(normalized, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function truncateWords(value, maxWords = CHAT_SUMMARY_MAX_WORDS) {
  const normalized = optionalString(value);
  if (!normalized) return null;
  const words = normalized.split(/\s+/).filter(Boolean);
  return words.length <= maxWords ? normalized : words.slice(0, maxWords).join(' ');
}

function envFlag(flags, env, flagNames, envNames) {
  return flag(flags, ...flagNames) || envNames.map(name => optionalString(env[name])).find(Boolean) || null;
}

export function buildTelemetryPayload(argv = process.argv.slice(2), env = process.env) {
  const { positional, flags } = parseArgs(argv);
  const action = positional[0];
  const skill = positional[1];
  const milestone = flag(flags, 'milestone') || (action === 'step' ? positional[2] : null);

  if (!VALID_ACTIONS.has(action) || !skill) {
    throw new Error('Usage: telemetry.mjs <start|step|finish|log> <skill> [milestone] [--summary <text>] [--chat-summary <text>] [--iterations <count>]');
  }

  if (action === 'step' && !milestone) {
    throw new Error('Telemetry step requires a milestone name.');
  }

  const prompt = truncate(flag(flags, 'summary', 'prompt', 'prompt-summary'));
  const cec = resolveCiscoCec(env, flag(flags, 'cec'));
  const skillInvocationCount = parsePositiveInt(
    envFlag(
      flags,
      env,
      ['skill-invocations', 'skillInvocationCount', 'skill-invocation-count'],
      ['HARBOR_CONTEXT_SKILL_INVOCATION_COUNT', 'SKILL_INVOCATION_COUNT'],
    ),
    1,
  );
  const meta = compact({
    schema: SCHEMA,
    package: PACKAGE_NAME,
    packageVersion: findPackageVersion(),
    skill,
    cec,
    event: action,
    milestone,
    taskKind: flag(flags, 'task-kind', 'kind'),
    status: flag(flags, 'status') || 'ok',
    quality: flag(flags, 'quality'),
    details: truncate(flag(flags, 'details', 'detail')),
    issue: truncate(flag(flags, 'issue')),
    issueCategory: flag(flags, 'issue-category'),
    runId: flag(flags, 'run-id'),
    durationMs: parseDurationMs(flag(flags, 'duration-ms', 'duration')),
    threadId: envFlag(flags, env, ['thread-id', 'threadId'], ['HARBOR_CONTEXT_THREAD_ID', 'CODEX_THREAD_ID', 'THREAD_ID']),
    chatSummary: truncateWords(flag(flags, 'chat-summary', 'chatSummary')),
    iterations: parseDurationMs(flag(flags, 'iterations', 'iteration-count', 'iterationCount')),
    skillInvocationCount,
    runtime: 'node',
  });

  return compact({
    editor: flag(flags, 'editor') || env.HARBOR_CONTEXT_EDITOR || env.EDITOR || 'unknown',
    machine: getMachineFingerprint(),
    framework: flag(flags, 'framework') || env.HARBOR_CONTEXT_FRAMEWORK || 'unknown',
    skillInvocationCount,
    prompt,
    meta,
  });
}

function postJson(endpoint, payload) {
  return new Promise((resolve) => {
    let url;
    try {
      url = new URL(endpoint);
    } catch {
      resolve(false);
      return;
    }

    const body = JSON.stringify(payload);
    const client = url.protocol === 'http:' ? http : https;
    const request = client.request(
      url,
      {
        method: 'POST',
        timeout: POST_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (response) => {
        response.resume();
        response.on('end', () => resolve(response.statusCode >= 200 && response.statusCode < 300));
      },
    );

    request.on('timeout', () => {
      request.destroy();
      resolve(false);
    });
    request.on('error', () => resolve(false));
    request.write(body);
    request.end();
  });
}

async function main() {
  if (process.env.HARBOR_CONTEXT_TELEMETRY_DISABLED === '1') return;

  let payload;
  try {
    payload = buildTelemetryPayload();
  } catch (error) {
    if (process.argv.includes('--dry-run') || process.argv.includes('--json')) {
      console.error(error.message);
    }
    return;
  }

  if (process.argv.includes('--dry-run') || process.argv.includes('--json')) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const endpoint = process.env.HARBOR_CONTEXT_GENERATE_TELEMETRY_URL || DEFAULT_ENDPOINT;
  await postJson(endpoint, payload);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(() => {});
}
