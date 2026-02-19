import fs from 'node:fs';
import path from 'node:path';
import { createDefaultQuestionRun, executeQuestionRun } from '../src/lib/questions/generation/orchestrator';

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (!process.env[key]) process.env[key] = value;
  }
}

function parseArgNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  loadEnvFile(path.join(cwd, '.env'));
  loadEnvFile(path.join(cwd, '.env.local'));

  const unitCode = String(process.argv[2] ?? '203').trim();
  const loCode = String(process.argv[3] ?? 'LO6').trim().toUpperCase();
  const level = parseArgNumber(process.argv[4], 2) as 2 | 3;
  const targetCount = parseArgNumber(process.argv[5], 50);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY for LLM generation.');
  }

  const startedAt = Date.now();
  const run = await createDefaultQuestionRun({
    unit_code: unitCode,
    level,
    lo_codes: [loCode],
    target_count: targetCount,
    format_mix: { mcq: 1 },
    difficulty_mix: { easy: 0.4, med: 0.5, hard: 0.1 },
    created_by: null,
  });
  console.log(`Created run: ${run.id} (unit=${unitCode}, lo=${loCode}, level=${level}, target=${targetCount})`);

  const result = await executeQuestionRun(run.id);
  const validate = result.steps.find((step) => step.step_key === 'validate')?.output ?? {};
  const refresh = result.steps.find((step) => step.step_key === 'refresh_summary')?.output ?? {};
  const batchReports = ((validate as Record<string, unknown>).debug as Record<string, unknown> | undefined)
    ?.batch_reports as Array<Record<string, unknown>> | undefined;

  console.log(`Run status: ${result.run.status}`);
  console.log(`Elapsed ms: ${Date.now() - startedAt}`);
  console.log(`Validate created_count: ${String((validate as Record<string, unknown>).created_count ?? 0)}`);
  console.log(`Validate failed_count: ${String((validate as Record<string, unknown>).failed_count ?? 0)}`);
  console.log(`Validate timed_out: ${String((validate as Record<string, unknown>).timed_out ?? false)}`);
  console.log(`Refresh summary created_count: ${String((refresh as Record<string, unknown>).created_count ?? 0)}`);
  if (Array.isArray(batchReports) && batchReports.length > 0) {
    for (const report of batchReports) {
      const lo = String(report.lo_code ?? '-');
      const parsed = String(report.parsed_count ?? 0);
      const accepted = String(report.accepted_count ?? 0);
      const target = String(report.target_count ?? 0);
      console.log(`Batch report ${lo}: parsed=${parsed}, accepted=${accepted}/${target}`);
      const summary = Array.isArray(report.attempt_summary) ? report.attempt_summary : [];
      for (const line of summary.slice(0, 8)) {
        console.log(`  - ${String(line)}`);
      }
    }
  }

  const inserted = Array.isArray((validate as Record<string, unknown>).inserted_question_ids)
    ? ((validate as Record<string, unknown>).inserted_question_ids as unknown[]).length
    : 0;
  if (inserted === 0) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
