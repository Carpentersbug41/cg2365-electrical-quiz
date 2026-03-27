'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { v2AuthedFetch } from '@/lib/v2/client';
import { courseHref } from '@/lib/routing/courseHref';

type DynamicScoreReport = {
  total: number;
  grade: string;
  breakdown: {
    beginnerClarity: number;
    teachingBeforeTesting: number;
    markingRobustness: number;
    alignmentToLO: number;
    questionQuality: number;
  };
  issues: Array<{
    category: string;
    problem: string;
    suggestion: string;
  }>;
  phaseFeedback: Array<{
    phaseKey: string;
    phaseTitle: string;
    stage: string;
    status: 'strong' | 'mixed' | 'weak';
    strengths: string[];
    issues: string[];
    suggestedFixes: string[];
  }>;
  summary: string;
};

type DynamicDiagnosticScore = {
  total: number;
  grade: string;
  breakdown: Record<string, number>;
  issues: Array<{
    category: string;
    problem: string;
    suggestion: string;
  }>;
  summary: string;
};

type DynamicValidation = {
  passed: boolean;
  issues: string[];
};

type DynamicPhaseArtifact = {
  phase: string;
  status: 'completed' | 'failed';
  output: unknown;
  startedAt: string;
  finishedAt: string;
};

type DynamicVersionSummary = {
  id: string;
  lessonCode: string;
  title: string;
  versionNo: number;
  status: string;
  qualityScore: number | null;
  createdAt: string;
  report?: DynamicScoreReport | null;
  validation?: DynamicValidation | null;
  planScore?: DynamicDiagnosticScore | null;
  fidelityScore?: DynamicDiagnosticScore | null;
};

type GenerateResult = {
  accepted?: boolean;
  lessonCode: string;
  version: DynamicVersionSummary | null;
  score: DynamicScoreReport | null;
  planScore: DynamicDiagnosticScore | null;
  fidelityScore: DynamicDiagnosticScore | null;
  validation: DynamicValidation | null;
  phases: DynamicPhaseArtifact[];
  previewUrl: string | null;
  simpleChatbotPreviewUrl: string | null;
  rejectionReason?: string | null;
};

function formatMetricLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function DiagnosticBreakdown({
  title,
  score,
}: {
  title: string;
  score: DynamicDiagnosticScore | null;
}) {
  if (!score) return null;

  return (
    <div>
      <div className="font-semibold text-slate-900">{title}</div>
      <p className="mt-1">{score.summary}</p>
      <ul className="mt-2 space-y-1 text-slate-700">
        {Object.entries(score.breakdown).map(([key, value]) => (
          <li key={key}>
            {formatMetricLabel(key)}: {value}
          </li>
        ))}
      </ul>
      <div className="mt-2 text-slate-600">
        Total: <strong>{score.total}</strong> ({score.grade})
      </div>
      {score.issues.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {score.issues.map((issue, index) => (
            <li key={`${issue.category}-${index}`} className="rounded-xl border border-slate-200 bg-white p-3">
              <div className="font-medium text-slate-900">{issue.category}</div>
              <div className="mt-1 text-slate-900">{issue.problem}</div>
              <div className="mt-1 text-slate-700">Fix: {issue.suggestion}</div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function ScoreBreakdown({ score, validation }: { score: DynamicScoreReport | null; validation: DynamicValidation | null }) {
  if (!score && !validation) return null;

  return (
    <div className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
      {score ? (
        <>
          <div>
            <div className="font-semibold text-slate-900">Score summary</div>
            <p className="mt-1">{score.summary}</p>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Breakdown</div>
            <ul className="mt-2 space-y-1 text-slate-700">
              <li>Beginner clarity: {score.breakdown.beginnerClarity}</li>
              <li>Teaching before testing: {score.breakdown.teachingBeforeTesting}</li>
              <li>Marking robustness: {score.breakdown.markingRobustness}</li>
              <li>Alignment to LO: {score.breakdown.alignmentToLO}</li>
              <li>Question quality: {score.breakdown.questionQuality}</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-slate-900">Scoring issues</div>
            {score.issues.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {score.issues.map((issue, index) => (
                  <li key={`${issue.category}-${index}`} className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                    <div className="font-medium text-amber-900">{issue.category}</div>
                    <div className="mt-1 text-amber-950">{issue.problem}</div>
                    <div className="mt-1 text-amber-900">Fix: {issue.suggestion}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-slate-500">No scoring issues recorded.</p>
            )}
          </div>
          <div>
            <div className="font-semibold text-slate-900">Phase feedback</div>
            {score.phaseFeedback.length > 0 ? (
              <div className="mt-2 space-y-2">
                {score.phaseFeedback.map((phase) => (
                  <div key={phase.phaseKey} className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="font-medium text-slate-900">
                      {phase.phaseTitle} <span className="text-slate-500">({phase.stage}, {phase.status})</span>
                    </div>
                    {phase.strengths.length > 0 ? <div className="mt-1 text-emerald-800">Strong: {phase.strengths.join(' ')}</div> : null}
                    {phase.issues.length > 0 ? <div className="mt-1 text-amber-900">Issue: {phase.issues.join(' ')}</div> : null}
                    {phase.suggestedFixes.length > 0 ? <div className="mt-1 text-slate-700">Fix: {phase.suggestedFixes.join(' ')}</div> : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-slate-500">No phase feedback recorded.</p>
            )}
          </div>
        </>
      ) : null}

      {validation ? (
        <div>
          <div className="font-semibold text-slate-900">Validation</div>
          <p className="mt-1">{validation.passed ? 'Passed' : 'Needs review'}</p>
          {validation.issues.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {validation.issues.map((issue, index) => (
                <li key={`${issue}-${index}`}>{issue}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function PhaseDebug({ phases }: { phases: DynamicPhaseArtifact[] }) {
  if (phases.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="font-semibold text-slate-900">Generation phases</div>
      <ul className="mt-2 space-y-1">
        {phases.map((phase, index) => (
          <li key={`${phase.phase}-${index}`}>
            {phase.phase}: {phase.status}
          </li>
        ))}
      </ul>
      {['Phase 10 Score', 'Phase 13 Rescore & Accept/Reject'].map((phaseName) => {
        const phase = phases.find((item) => item.phase === phaseName);
        const output =
          phase?.output && typeof phase.output === 'object'
            ? (phase.output as Record<string, unknown>)
            : null;
        const rawText = typeof output?.rawText === 'string' ? output.rawText : null;
        const parseFailed = Boolean(output?.parseFailed);
        if (!phase || !rawText) return null;
        return (
          <details key={phaseName} className="mt-2 rounded-xl border border-slate-200 bg-white p-3">
            <summary className="cursor-pointer font-medium text-slate-900">
              {phaseName} raw scorer output{parseFailed ? ' (parse repaired/fallback)' : ''}
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{rawText}</pre>
          </details>
        );
      })}
    </div>
  );
}

export default function DynamicGeneratePage() {
  const searchParams = useSearchParams();
  const [lessonCode, setLessonCode] = useState('203-4A');
  const [title, setTitle] = useState('203.4A - Earthing Systems and ADS Components');
  const [unit, setUnit] = useState('Unit 203');
  const [topic, setTopic] = useState('Earthing Systems and ADS Components');
  const [sourceText, setSourceText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [versions, setVersions] = useState<DynamicVersionSummary[]>([]);
  const preserveDevBypass = searchParams?.get('devBypassAuth') === '1';

  function withDevBypass(href: string): string {
    if (!preserveDevBypass) return href;
    return href.includes('?') ? `${href}&devBypassAuth=1` : `${href}?devBypassAuth=1`;
  }

  async function loadVersions() {
    try {
      const response = await v2AuthedFetch('/api/admin/dynamic-guided-v2/versions');
      const data = (await response.json()) as { success?: boolean; versions?: DynamicVersionSummary[] };
      if (response.ok && data.success && Array.isArray(data.versions)) {
        setVersions(data.versions);
      }
    } catch {
      // Ignore list load failures on first paint.
    }
  }

  useEffect(() => {
    void loadVersions();
  }, []);

  useEffect(() => {
    if (!result) return;
    console.groupCollapsed('[dynamic-generate] latest-result', `${result.lessonCode} ${result.version ? `v${result.version.versionNo}` : 'rejected'}`);
    console.log('version', result.version);
    console.log('lessonScore', result.score);
    console.log('planScore', result.planScore);
    console.log('fidelityScore', result.fidelityScore);
    console.log('validation', result.validation);
    console.log('phases', result.phases);
    console.groupEnd();
  }, [result]);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await v2AuthedFetch('/api/admin/dynamic-guided-v2/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonCode,
          title,
          unit,
          topic,
          subject: 'C&G 2365',
          audience: 'Level 2 electrical learner',
          tonePrompt:
            'Teach like a strong 2365 electrical tutor: practical, direct, technically precise, concise, and natural. Avoid robotic feedback and avoid textbook filler.',
          sourceText,
        }),
      });
      const data = (await response.json()) as {
        success?: boolean;
        accepted?: boolean;
        message?: string;
        lessonCode?: string;
        version?: DynamicVersionSummary | null;
        score?: DynamicScoreReport | null;
        planScore?: DynamicDiagnosticScore | null;
        fidelityScore?: DynamicDiagnosticScore | null;
        validation?: DynamicValidation | null;
        phases?: DynamicPhaseArtifact[] | null;
        previewUrl?: string | null;
        simpleChatbotPreviewUrl?: string | null;
        rejectionReason?: string | null;
      };
      if (!response.ok || !data.lessonCode) {
        throw new Error(data.message || 'Dynamic generation failed.');
      }
      const nextResult: GenerateResult = {
        accepted: data.accepted ?? data.success ?? false,
        lessonCode: data.lessonCode,
        version: data.version ?? null,
        score: data.score ?? null,
        planScore: data.planScore ?? null,
        fidelityScore: data.fidelityScore ?? null,
        validation: data.validation ?? null,
        phases: Array.isArray(data.phases) ? data.phases : [],
        previewUrl: data.previewUrl ?? null,
        simpleChatbotPreviewUrl: data.simpleChatbotPreviewUrl ?? null,
        rejectionReason: data.rejectionReason ?? null,
      };
      setResult(nextResult);
      console.groupCollapsed('[dynamic-generate] result', `${data.lessonCode} ${data.version ? `v${data.version.versionNo}` : 'rejected'}`);
      console.log('version', data.version);
      console.log('lessonScore', data.score ?? null);
      console.log('planScore', data.planScore ?? null);
      console.log('fidelityScore', data.fidelityScore ?? null);
      console.log('validation', data.validation ?? null);
      console.log('phases', Array.isArray(data.phases) ? data.phases : []);
      console.log('accepted', data.accepted ?? data.success ?? false);
      console.log('rejectionReason', data.rejectionReason ?? null);
      console.groupEnd();
      if (!(data.accepted ?? data.success ?? false)) {
        setError(data.rejectionReason || 'Dynamic generation failed the quality gate.');
      }
      await loadVersions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Dynamic generation failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Dynamic Generator</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">2365 Dynamic Lesson Generator</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Generate one native 2365 dynamic lesson draft directly from grounded source text, then preview it in the dynamic runtime or simple-chatbot.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-700">
                <span>Lesson code</span>
                <input className="rounded-xl border border-slate-300 px-3 py-2" value={lessonCode} onChange={(e) => setLessonCode(e.target.value)} />
              </label>
              <label className="grid gap-2 text-sm text-slate-700">
                <span>Unit</span>
                <input className="rounded-xl border border-slate-300 px-3 py-2" value={unit} onChange={(e) => setUnit(e.target.value)} />
              </label>
            </div>
            <div className="mt-4 grid gap-4">
              <label className="grid gap-2 text-sm text-slate-700">
                <span>Title</span>
                <input className="rounded-xl border border-slate-300 px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="grid gap-2 text-sm text-slate-700">
                <span>Topic</span>
                <input className="rounded-xl border border-slate-300 px-3 py-2" value={topic} onChange={(e) => setTopic(e.target.value)} />
              </label>
              <label className="grid gap-2 text-sm text-slate-700">
                <span>Grounded source text</span>
                <textarea
                  className="min-h-[280px] rounded-2xl border border-slate-300 px-3 py-2 font-mono text-sm"
                  value={sourceText}
                  onChange={(e) => setSourceText(e.target.value)}
                  placeholder="Paste the source grounding for the dynamic lesson here..."
                />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                disabled={loading || !lessonCode.trim() || !title.trim() || !topic.trim() || !sourceText.trim()}
                onClick={handleGenerate}
              >
                {loading ? 'Generating...' : 'Generate dynamic lesson'}
              </button>
              <Link href={courseHref('/admin/dynamic-module')} className="text-sm font-medium text-slate-700 underline">
                Open dynamic module planner
              </Link>
            </div>
            {error ? <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Latest result</h2>
              {result ? (
                <div className="mt-4 space-y-3 text-sm text-slate-700">
                  <div>Lesson: <strong>{result.lessonCode}</strong></div>
                  <div>Version: <strong>{result.version ? result.version.versionNo : 'not saved'}</strong></div>
                  <div>Lesson score: <strong>{result.score ? `${result.score.total} (${result.score.grade})` : 'n/a'}</strong></div>
                  <div>Plan score: <strong>{result.planScore ? `${result.planScore.total} (${result.planScore.grade})` : 'n/a'}</strong></div>
                  <div>Fidelity score: <strong>{result.fidelityScore ? `${result.fidelityScore.total} (${result.fidelityScore.grade})` : 'n/a'}</strong></div>
                  <div>Validation: <strong>{result.validation?.passed ? 'passed' : 'needs review'}</strong></div>
                  {result.accepted === false && result.rejectionReason ? (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800">
                      Quality gate failed: {result.rejectionReason}
                    </div>
                  ) : null}
                  <ScoreBreakdown score={result.score} validation={result.validation} />
                  <div className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                    <DiagnosticBreakdown title="Plan score" score={result.planScore} />
                    <DiagnosticBreakdown title="Plan-to-lesson fidelity" score={result.fidelityScore} />
                  </div>
                  <PhaseDebug phases={result.phases} />
                  <div className="flex flex-wrap gap-3 pt-2">
                    {result.previewUrl ? (
                    <Link className="rounded-lg border border-slate-300 px-3 py-2" href={withDevBypass(result.previewUrl)}>
                      Preview dynamic runtime
                    </Link>
                    ) : null}
                    {result.simpleChatbotPreviewUrl ? (
                    <Link className="rounded-lg border border-slate-300 px-3 py-2" href={withDevBypass(result.simpleChatbotPreviewUrl)}>
                      Preview simple-chatbot
                    </Link>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No dynamic generation run yet in this session.</p>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Stored versions</h2>
              <div className="mt-4 space-y-3">
                {versions.slice(0, 12).map((version) => (
                  <div key={version.id} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700">
                    <div className="font-medium text-slate-900">{version.lessonCode} v{version.versionNo}</div>
                    <div>{version.title}</div>
                    <div className="text-slate-500">Score: {version.qualityScore ?? 'n/a'} | {new Date(version.createdAt).toLocaleString()}</div>
                    {version.report ? (
                      <div className="mt-2 text-xs text-slate-600">
                        {version.report.grade} | clarity {version.report.breakdown.beginnerClarity} | teaching {version.report.breakdown.teachingBeforeTesting} | marking {version.report.breakdown.markingRobustness}
                      </div>
                    ) : null}
                  </div>
                ))}
                {versions.length === 0 ? <p className="text-sm text-slate-500">No dynamic versions stored yet.</p> : null}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
