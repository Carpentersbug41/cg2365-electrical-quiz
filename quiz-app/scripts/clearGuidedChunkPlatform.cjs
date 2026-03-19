/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();

function loadEnvFile(filename) {
  const filePath = path.join(repoRoot, filename);
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function removePath(targetPath) {
  if (!fs.existsSync(targetPath)) return false;
  fs.rmSync(targetPath, { recursive: true, force: true });
  return true;
}

async function clearDb() {
  const { createClient } = require('@supabase/supabase-js');
  loadEnvFile('.env');
  loadEnvFile('.env.local');

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return { skipped: true, reason: 'Missing Supabase env vars.' };
  }

  const client = createClient(url, key, { auth: { persistSession: false } });
  const results = [];

  const deletions = [
    { table: 'gc_experiment_changes', key: 'id' },
    { table: 'gc_experiments', key: 'id' },
    { table: 'gc_session_events', key: 'session_id' },
    { table: 'gc_session_turns', key: 'session_id' },
    { table: 'gc_session_summaries', key: 'session_id' },
    { table: 'gc_sessions', key: 'id' },
    { table: 'gc_lesson_versions', key: 'id' },
    { table: 'gc_lessons', key: 'id' },
  ];

  for (const deletion of deletions) {
    const { error, count } = await client
      .from(deletion.table)
      .delete({ count: 'exact' })
      .not(deletion.key, 'is', null);
    if (error) {
      throw new Error(`${deletion.table}: ${error.message}`);
    }
    results.push({ table: deletion.table, count: count ?? 0 });
  }

  return { skipped: false, results };
}

async function main() {
  const runtimeTargets = [
    path.join(repoRoot, '.runtime', 'guided-chunk-version-store.json'),
    path.join(repoRoot, '.runtime', 'guided-chunk-frames'),
    path.join(repoRoot, '.runtime', 'guided-chunk-sessions'),
    path.join(repoRoot, '.runtime', 'guided_chunk_2365_target_results.json'),
    path.join(repoRoot, '.runtime', 'guided_chunk_biology_phase1_batch.json'),
    path.join(repoRoot, '.runtime', 'guided_chunk_finalize_results.json'),
  ];

  const localRemoved = runtimeTargets
    .map((target) => ({ target: path.relative(repoRoot, target), removed: removePath(target) }))
    .filter((entry) => entry.removed);

  const db = await clearDb();

  const summary = {
    clearedAt: new Date().toISOString(),
    localRemoved,
    db,
  };

  const outPath = path.join(repoRoot, '.runtime', 'guided_chunk_platform_reset.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(summary, null, 2), 'utf8');
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
