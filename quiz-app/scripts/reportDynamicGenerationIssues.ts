import { loadEnvConfig } from '@next/env';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

loadEnvConfig(process.cwd());

type IssueRow = {
  run_id: string;
  lesson_code: string;
  normalized_key: string;
  category: string;
  problem: string;
  repairable: boolean;
  created_at: string;
};

type RunRow = {
  id: string;
  lesson_code: string;
  lesson_score: number;
  origin: 'live_generation' | 'artifact_backfill';
  created_at: string;
};

function getSinceIso(days: number): string {
  const now = Date.now();
  return new Date(now - days * 24 * 60 * 60 * 1000).toISOString();
}

async function main(): Promise<void> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new Error('Supabase admin client unavailable. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
  }

  const days = Math.max(1, Number(process.env.DYNAMIC_ISSUE_REPORT_DAYS ?? 14));
  const sinceIso = getSinceIso(days);

  const [{ data: issues, error: issuesError }, { data: runs, error: runsError }] = await Promise.all([
    adminClient
      .from('dynamic_generation_issues')
      .select('run_id, lesson_code, normalized_key, category, problem, repairable, created_at')
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: false }),
    adminClient
      .from('dynamic_generation_runs')
      .select('id, lesson_code, lesson_score, origin, created_at')
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: false }),
  ]);

  if (issuesError) throw new Error(issuesError.message);
  if (runsError) throw new Error(runsError.message);

  const issueRows = (issues ?? []) as IssueRow[];
  const runRows = (runs ?? []) as RunRow[];
  const runById = new Map(runRows.map((row) => [row.id, row]));

  const byKey = new Map<
    string,
    {
      count: number;
      repairableCount: number;
      liveCount: number;
      backfillCount: number;
      lessons: Set<string>;
      scores: number[];
      sampleProblem: string;
      category: string;
    }
  >();

  for (const issue of issueRows) {
    const run = runById.get(issue.run_id);
    const entry = byKey.get(issue.normalized_key) ?? {
      count: 0,
      repairableCount: 0,
      liveCount: 0,
      backfillCount: 0,
      lessons: new Set<string>(),
      scores: [],
      sampleProblem: issue.problem,
      category: issue.category,
    };
    entry.count += 1;
    if (issue.repairable) entry.repairableCount += 1;
    if (run?.origin === 'live_generation') entry.liveCount += 1;
    if (run?.origin === 'artifact_backfill') entry.backfillCount += 1;
    entry.lessons.add(issue.lesson_code);
    if (typeof run?.lesson_score === 'number') entry.scores.push(run.lesson_score);
    byKey.set(issue.normalized_key, entry);
  }

  const avgScoreByLesson = new Map<string, { total: number; count: number }>();
  const originCounts = { live_generation: 0, artifact_backfill: 0 };

  for (const run of runRows) {
    const entry = avgScoreByLesson.get(run.lesson_code) ?? { total: 0, count: 0 };
    entry.total += run.lesson_score;
    entry.count += 1;
    avgScoreByLesson.set(run.lesson_code, entry);
    originCounts[run.origin] += 1;
  }

  const report = {
    generatedAt: new Date().toISOString(),
    days,
    sinceIso,
    runCount: runRows.length,
    issueCount: issueRows.length,
    originCounts,
    topPatterns: Array.from(byKey.entries())
      .map(([normalizedKey, entry]) => ({
        normalizedKey,
        category: entry.category,
        count: entry.count,
        repairableCount: entry.repairableCount,
        liveCount: entry.liveCount,
        backfillCount: entry.backfillCount,
        lessonCount: entry.lessons.size,
        averageScoreWhenPresent:
          entry.scores.length > 0 ? Number((entry.scores.reduce((sum, score) => sum + score, 0) / entry.scores.length).toFixed(1)) : null,
        sampleProblem: entry.sampleProblem,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),
    lessonAverages: Array.from(avgScoreByLesson.entries())
      .map(([lessonCode, entry]) => ({
        lessonCode,
        averageScore: Number((entry.total / entry.count).toFixed(1)),
        runCount: entry.count,
      }))
      .sort((a, b) => a.lessonCode.localeCompare(b.lessonCode)),
  };

  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error('[report-dynamic-generation-issues] failed', error);
  process.exitCode = 1;
});
