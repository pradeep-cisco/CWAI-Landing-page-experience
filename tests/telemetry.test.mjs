import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTelemetryPayload as buildCreatePayload } from '../.agents/skills/create-magnetic-ui/resources/telemetry.mjs';
import { buildTelemetryPayload as buildSetupPayload } from '../.agents/skills/setup-boilerplate/resources/telemetry.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function withStateDir(callback) {
  const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'boilerplate-telemetry-'));
  try {
    return callback(stateDir);
  } finally {
    fs.rmSync(stateDir, { recursive: true, force: true });
  }
}

test('create-magnetic-ui emits the normalized one-shot run contract', () => {
  withStateDir((stateDir) => {
    const payload = buildCreatePayload([
      'log',
      'create-magnetic-ui',
      '--status',
      'ok',
      '--run-id',
      'create-run-1',
    ], {
      HARBOR_CONTEXT_STATE_DIR: stateDir,
    });

    assert.equal(payload.schema_version, 2);
    assert.equal(payload.source, 'boilerplate_web');
    assert.equal(payload.event_type, 'run_recorded');
    assert.equal(payload.run_status, 'completed');
    assert.equal(payload.run_id, 'create-run-1');
    assert.equal(payload.meta.runId, 'create-run-1');
    assert.equal(payload.meta.schema, 'harbor.context.generate.v2');
    assert.equal(payload.meta.schemaVersion, 2);
    assert.equal(payload.meta.source, 'boilerplate_web');
    assert.equal(payload.meta.eventType, 'run_recorded');
    assert.equal(payload.meta.runStatus, 'completed');
  });
});

test('setup-boilerplate emits paired lifecycle fields', () => {
  withStateDir((stateDir) => {
    const env = { HARBOR_CONTEXT_STATE_DIR: stateDir };
    const start = buildSetupPayload([
      'start',
      'setup-boilerplate',
      '--run-id',
      'setup-run-1',
    ], env);
    const finish = buildSetupPayload([
      'finish',
      'setup-boilerplate',
      '--run-id',
      'setup-run-1',
      '--status',
      'error',
    ], env);

    assert.equal(start.event_type, 'run_started');
    assert.equal(start.run_status, undefined);
    assert.equal(start.run_id, 'setup-run-1');
    assert.equal(finish.event_type, 'run_finished');
    assert.equal(finish.run_status, 'failed');
    assert.equal(finish.run_id, start.run_id);
  });
});

test('boilerplate non-run events keep distinct event types', () => {
  withStateDir((stateDir) => {
    const env = { HARBOR_CONTEXT_STATE_DIR: stateDir };
    const install = buildSetupPayload(['install', 'setup-boilerplate'], env);
    const artifact = buildCreatePayload(['artifact', 'create-magnetic-ui'], env);

    assert.equal(install.event_type, 'installation_recorded');
    assert.equal(install.run_status, undefined);
    assert.equal(artifact.event_type, 'artifact_recorded');
    assert.equal(artifact.run_status, undefined);
  });
});

test('python fallback emits the normalized contract', () => {
  withStateDir((stateDir) => {
    const helperPath = path.join(
      __dirname,
      '..',
      '.agents',
      'skills',
      'create-magnetic-ui',
      'resources',
      'telemetry.py',
    );
    const result = spawnSync('python3', [
      helperPath,
      'finish',
      'create-magnetic-ui',
      '--run-id',
      'python-run-1',
      '--status',
      'blocked',
      '--dry-run',
    ], {
      encoding: 'utf8',
      env: {
        ...process.env,
        HARBOR_CONTEXT_STATE_DIR: stateDir,
      },
    });

    assert.equal(result.status, 0, result.stderr);
    const payload = JSON.parse(result.stdout);
    assert.equal(payload.schema_version, 2);
    assert.equal(payload.source, 'boilerplate_web');
    assert.equal(payload.event_type, 'run_finished');
    assert.equal(payload.run_status, 'blocked');
    assert.equal(payload.run_id, 'python-run-1');
    assert.equal(payload.meta.runId, 'python-run-1');
    assert.equal(payload.meta.schema, 'harbor.context.generate.v2');
    assert.equal(payload.meta.schemaVersion, 2);
    assert.equal(payload.meta.source, 'boilerplate_web');
    assert.equal(payload.meta.eventType, 'run_finished');
    assert.equal(payload.meta.runStatus, 'blocked');
  });
});
