'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { getCoursePrefixForClient } from '@/lib/routing/curricula';
import { v2AuthedFetch } from '@/lib/v2/client';

type StageKey = 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6';

interface SyllabusVersion {
  id: string;
  filename: string;
  content_hash: string;
  created_at: string;
  meta_json: Record<string, unknown> | null;
}

interface RunSummary {
  run: {
    id: string;
    unit: string;
    status: string;
    request_hash: string | null;
    syllabus_version_id: string;
  };
  artifacts: Array<{
    stage: StageKey;
    artifact_json: unknown;
    created_at: string;
    retrieved_chunk_ids?: string[];
    retrieved_chunk_text?: string;
  }>;
  lessons: Array<{
    blueprint_id: string;
    lesson_id: string;
    status: string;
    error: string | null;
    lesson_json?: unknown | null;
    created_at?: string;
  }>;
  replayable: Record<StageKey, boolean>;
}

interface RunListItem {
  id: string;
  unit: string;
  status: string;
  created_at: string;
  syllabus_version_id: string;
}

interface GuidedVersionSummary {
  id: string;
  lessonCode: string;
  versionNo: number;
  status: string;
  qualityScore?: number | null;
  grade?: string | null;
  report?: {
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
  } | null;
  validation?: {
    passed: boolean;
    issues: string[];
  } | null;
  planScore?: DynamicDiagnosticScore | null;
  fidelityScore?: DynamicDiagnosticScore | null;
}

interface DynamicDiagnosticScore {
  total: number;
  grade: string;
  breakdown: Record<string, number>;
  issues: Array<{
    category: string;
    problem: string;
    suggestion: string;
  }>;
  summary: string;
}

interface DynamicPhaseArtifactView {
  phase: string;
  status: 'completed' | 'failed';
  output?: unknown;
}

interface StageResult {
  success: boolean;
  stage: StageKey;
  replayed: boolean;
  artifact: unknown;
  message?: string;
}

interface CanonicalUnitStructure {
  unit: string;
  range?: string[];
  los: Array<{
    loNumber: string;
    title?: string;
    acs: Array<{
      acNumber: string;
      text?: string;
      acKey: string;
      range?: string[];
    }>;
    range?: string[];
  }>;
}

type PopulateState = 'IDLE' | 'RUNNING' | 'READY' | 'FAILED';
interface GuidedDraftState {
  blueprintId: string;
  status: 'planned' | 'generating' | 'generated' | 'failed';
  versionNo?: number | null;
  score?: number | null;
  grade?: string | null;
  scoreReport?: GuidedVersionSummary['report'] | null;
  planScore?: DynamicDiagnosticScore | null;
  fidelityScore?: DynamicDiagnosticScore | null;
  validation?: GuidedVersionSummary['validation'] | null;
  previewUrl?: string | null;
  secondaryUrl?: string | null;
  secondaryLabel?: string | null;
  error?: string | null;
  rejectionReason?: string | null;
  phases?: DynamicPhaseArtifactView[] | null;
}

const STAGE_ROUTE: Record<StageKey, string> = {
  M0: 'm0-distill',
  M1: 'm1-analyze',
  M2: 'm2-coverage',
  M3: 'm3-plan',
  M4: 'm4-blueprints',
  M5: 'm5-validate',
  M6: 'm6-generate',
};

const STAGE_LABEL: Record<StageKey, string> = {
  M0: 'Distill',
  M1: 'Analyze',
  M2: 'Extract Coverage',
  M3: 'Plan',
  M4: 'Build Blueprints',
  M5: 'Validate',
  M6: 'Generate',
};
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatMetricLabel(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function DiagnosticScorePanel({
  title,
  score,
}: {
  title: string;
  score?: DynamicDiagnosticScore | null;
}) {
  if (!score) return null;

  return (
    <div>
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1">{score.summary}</p>
      <ul className="mt-2 space-y-1">
        {Object.entries(score.breakdown).map(([key, value]) => (
          <li key={key}>
            {formatMetricLabel(key)}: {value}
          </li>
        ))}
      </ul>
      <p className="mt-2">
        Total: <strong>{score.total}</strong> ({score.grade})
      </p>
      {score.issues.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {score.issues.map((issue, index) => (
            <li key={`${issue.category}-${index}`} className="rounded border border-slate-200 bg-slate-50 p-2">
              <div className="font-medium text-slate-900">{issue.category}</div>
              <div className="mt-1">{issue.problem}</div>
              <div className="mt-1 text-slate-700">Fix: {issue.suggestion}</div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function DynamicDraftDiagnostics({
  scoreReport,
  planScore,
  fidelityScore,
  validation,
  phases,
}: {
  scoreReport?: GuidedVersionSummary['report'] | null;
  planScore?: DynamicDiagnosticScore | null;
  fidelityScore?: DynamicDiagnosticScore | null;
  validation?: GuidedVersionSummary['validation'] | null;
  phases?: DynamicPhaseArtifactView[] | null;
}) {
  if (!scoreReport && !planScore && !fidelityScore && !validation && (!phases || phases.length === 0)) {
    return null;
  }

  return (
    <div className="mt-3 space-y-3 rounded border border-slate-200 bg-white/80 p-3 text-slate-800">
      {scoreReport ? (
        <div>
          <p className="font-semibold text-slate-900">Score summary</p>
          <p className="mt-1">{scoreReport.summary}</p>
          <ul className="mt-2 space-y-1">
            <li>Beginner clarity: {scoreReport.breakdown.beginnerClarity}</li>
            <li>Teaching before testing: {scoreReport.breakdown.teachingBeforeTesting}</li>
            <li>Marking robustness: {scoreReport.breakdown.markingRobustness}</li>
            <li>Alignment to LO: {scoreReport.breakdown.alignmentToLO}</li>
            <li>Question quality: {scoreReport.breakdown.questionQuality}</li>
          </ul>
        </div>
      ) : null}
      {scoreReport?.issues?.length ? (
        <div>
          <p className="font-semibold text-slate-900">Scoring issues</p>
          <ul className="mt-2 space-y-2">
            {scoreReport.issues.map((issue, index) => (
              <li key={`${issue.category}-${index}`} className="rounded border border-amber-200 bg-amber-50 p-2">
                <div className="font-medium text-amber-950">{issue.category}</div>
                <div className="mt-1">{issue.problem}</div>
                <div className="mt-1 text-amber-900">Fix: {issue.suggestion}</div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {scoreReport?.phaseFeedback?.length ? (
        <div>
          <p className="font-semibold text-slate-900">Phase feedback</p>
          <div className="mt-2 space-y-2">
            {scoreReport.phaseFeedback.map((phase) => (
              <div key={phase.phaseKey} className="rounded border border-slate-200 bg-slate-50 p-2">
                <div className="font-medium text-slate-900">
                  {phase.phaseTitle} <span className="text-slate-500">({phase.stage}, {phase.status})</span>
                </div>
                {phase.strengths.length > 0 ? (
                  <div className="mt-1 text-emerald-800">Strong: {phase.strengths.join(' ')}</div>
                ) : null}
                {phase.issues.length > 0 ? (
                  <div className="mt-1 text-amber-900">Issue: {phase.issues.join(' ')}</div>
                ) : null}
                {phase.suggestedFixes.length > 0 ? (
                  <div className="mt-1 text-slate-700">Fix: {phase.suggestedFixes.join(' ')}</div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <DiagnosticScorePanel title="Plan score" score={planScore} />
      <DiagnosticScorePanel title="Plan-to-lesson fidelity" score={fidelityScore} />
      {validation ? (
        <div>
          <p className="font-semibold text-slate-900">Validation</p>
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
      {phases && phases.length > 0 ? (
        <div>
          <p className="font-semibold text-slate-900">Phase results</p>
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
              <details key={phaseName} className="mt-2 rounded border border-slate-200 bg-slate-50 p-2">
                <summary className="cursor-pointer font-medium text-slate-900">
                  {phaseName} raw scorer output{parseFailed ? ' (parse repaired/fallback)' : ''}
                </summary>
                <pre className="mt-2 max-h-64 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{rawText}</pre>
              </details>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default function ModulePlannerPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isV2Mode = pathname?.startsWith('/v2') ?? false;
  const isGuidedMode = pathname?.includes('/guided-module') ?? false;
  const isDynamicMode = pathname?.includes('/dynamic-module') ?? false;
  const coursePrefix = getCoursePrefixForClient();
  const preserveDevBypass = searchParams?.get('devBypassAuth') === '1';
  const prefixHref = useCallback(
    (path: string) => {
      if (!path.startsWith('/')) return path;
      if (path.startsWith('/api')) return path;
      if (!coursePrefix) return path;
      return `${coursePrefix}${path}`;
    },
    [coursePrefix]
  );
  const withDevBypass = useCallback(
    (href: string | null | undefined) => {
      if (!href) return null;
      if (!preserveDevBypass) return href;
      return href.includes('?') ? `${href}&devBypassAuth=1` : `${href}?devBypassAuth=1`;
    },
    [preserveDevBypass]
  );
  const guidedLabel =
    coursePrefix === '/2365'
      ? 'Guided 2365 Planner'
      : coursePrefix === '/gcse/science/biology'
        ? 'Guided Biology Planner'
        : coursePrefix === '/gcse/science/physics'
          ? 'Guided Physics Planner'
      : 'Guided Module Planner';
  const guidedDescription =
    coursePrefix === '/2365'
      ? 'Use the proven planner stages to extract 2365 LO/AC structure, then generate guided tutor lesson drafts from the lesson matrix.'
      : coursePrefix === '/gcse/science/biology'
        ? 'Use the proven planner stages to extract GCSE Biology structure, then generate guided tutor lesson drafts from the lesson matrix.'
        : coursePrefix === '/gcse/science/physics'
        ? 'Use the proven planner stages to extract GCSE Physics structure, then generate guided tutor lesson drafts from the lesson matrix.'
        : 'Use the proven planner stages to extract structure and then generate guided tutor lessons from the lesson matrix.';
  const dynamicLabel = coursePrefix === '/2365' ? 'Dynamic 2365 Module Planner' : 'Dynamic Module Planner';
  const dynamicDescription =
    coursePrefix === '/2365'
      ? 'Use the proven planner stages to extract 2365 LO/AC structure, then generate native dynamic lesson drafts from the lesson matrix.'
      : 'Use the proven planner stages to extract structure, then generate native dynamic lesson drafts from the lesson matrix.';
  const moduleApiBase = isV2Mode ? '/api/admin/v2/module' : '/api/admin/module';
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [units, setUnits] = useState<string[]>([]);
  const [unit, setUnit] = useState('');
  const [unitLos, setUnitLos] = useState<string[]>([]);
  const [chatTranscript, setChatTranscript] = useState('');
  const [manualLosInput, setManualLosInput] = useState('');
  const [manualLoOverride, setManualLoOverride] = useState(false);
  const [notes, setNotes] = useState('');
  const [runId, setRunId] = useState('');
  const [recentRuns, setRecentRuns] = useState<RunListItem[]>([]);
  const [runSummary, setRunSummary] = useState<RunSummary | null>(null);
  const [stageResults, setStageResults] = useState<Partial<Record<StageKey, StageResult>>>({});
  const [replayFromArtifacts, setReplayFromArtifacts] = useState(false);
  const [defaultMaxLessons, setDefaultMaxLessons] = useState(9);
  const [maxAcsPerLesson, setMaxAcsPerLesson] = useState(4);
  const [preferredAcsPerLesson, setPreferredAcsPerLesson] = useState(2);
  const [level, setLevel] = useState('Level 2');
  const [audience, setAudience] = useState('beginner');
  const [orderingPreference, setOrderingPreference] = useState<'foundation-first' | 'lo-order'>('foundation-first');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [retryNotice, setRetryNotice] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState('');
  const [syllabusVersions, setSyllabusVersions] = useState<SyllabusVersion[]>([]);
  const [syllabusVersionId, setSyllabusVersionId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [populateState, setPopulateState] = useState<PopulateState>('IDLE');
  const [activeStage, setActiveStage] = useState<StageKey | null>(null);
  const [activeTaskLabel, setActiveTaskLabel] = useState<string | null>(null);
  const [taskProgress, setTaskProgress] = useState(0);
  const [generatingGuidedBlueprintId, setGeneratingGuidedBlueprintId] = useState<string | null>(null);
  const [deletingRunId, setDeletingRunId] = useState<string | null>(null);
  const [deletingDraftBlueprintId, setDeletingDraftBlueprintId] = useState<string | null>(null);
  const [unitStructure, setUnitStructure] = useState<CanonicalUnitStructure | null>(null);
  const [guidedDraftsByBlueprint, setGuidedDraftsByBlueprint] = useState<Record<string, GuidedDraftState>>({});

  const selectedLos = useMemo(
    () => {
      const source = manualLoOverride ? manualLosInput : unitLos.join(',');
      return source
        .split(',')
        .map((lo: string) => lo.trim())
        .filter((lo: string) => lo.length > 0);
    },
    [manualLoOverride, manualLosInput, unitLos]
  );

  const activeVersion = useMemo(
    () => syllabusVersions.find((version) => version.id === syllabusVersionId) ?? null,
    [syllabusVersions, syllabusVersionId]
  );

  const chunkDiagnostics = useMemo(() => {
    if (!runSummary) return [];
    const rows: Array<{ stage: StageKey; id: string; pageStart: string; pageEnd: string }> = [];
    runSummary.artifacts.forEach((artifact) => {
      if (!artifact.retrieved_chunk_text) return;
      try {
        const parsed = JSON.parse(artifact.retrieved_chunk_text) as Array<Record<string, unknown>>;
        parsed.forEach((item) => {
          rows.push({
            stage: artifact.stage,
            id: String(item.id ?? '?'),
            pageStart: String(item.pageStart ?? '?'),
            pageEnd: String(item.pageEnd ?? '?'),
          });
        });
      } catch {
        // ignore malformed payload
      }
    });
    return rows;
  }, [runSummary]);

  const buildHeaders = useCallback(
    (contentType?: string): HeadersInit => {
      const headers: Record<string, string> = {};
      if (contentType) headers['content-type'] = contentType;
      headers['x-course-prefix'] = getCoursePrefixForClient();
      if (adminToken.trim().length > 0) {
        headers['x-module-admin-token'] = adminToken.trim();
        headers['x-v2-admin-token'] = adminToken.trim();
      }
      return headers;
    },
    [adminToken]
  );

  const callApi = useCallback(
    async (url: string, body?: unknown, isFormData = false, method?: 'GET' | 'POST' | 'DELETE') => {
      const requestMethod = method ?? (body ? 'POST' : 'GET');
      const maxAttempts = requestMethod === 'GET' ? 3 : 1;
      let lastError: Error | null = null;
      setRetryNotice(null);

      for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
        let response: Response;
        const targetUrl = url.startsWith('/api/admin/module') && isV2Mode
          ? url.replace('/api/admin/module', moduleApiBase)
          : url;
        try {
          const fetchImpl = isV2Mode ? v2AuthedFetch : fetch;
          response = await fetchImpl(targetUrl, {
            method: requestMethod,
            cache: 'no-store',
            headers: body ? (isFormData ? buildHeaders() : buildHeaders('application/json')) : buildHeaders(),
            body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown network failure';
          lastError = new Error(`Network error while calling API: ${message}`);
          if (attempt < maxAttempts) {
            setRetryNotice(`Retrying request (${attempt + 1}/${maxAttempts}): ${targetUrl}`);
            await sleep(250 * attempt);
            continue;
          }
          setRetryNotice(null);
          throw lastError;
        }

        const contentType = response.headers.get('content-type') ?? '';
        const rawBody = await response.text();
        const hasBody = rawBody.trim().length > 0;
        const expectsJson = /\bjson\b/i.test(contentType);
        let data: Record<string, unknown> = {};

        if (hasBody) {
          if (expectsJson) {
            try {
              const parsed = JSON.parse(rawBody) as unknown;
              data = parsed && typeof parsed === 'object'
                ? (parsed as Record<string, unknown>)
                : { value: parsed };
            } catch {
              if (response.ok) {
                throw new Error(`Invalid JSON response from ${targetUrl}`);
              }
              data = { rawBody };
            }
          } else {
            data = { rawBody };
          }
        }
        if (!response.ok || data.success === false) {
          const fallbackMessage = (() => {
            if (typeof data.rawBody === 'string' && data.rawBody.trim().length > 0) {
              const bodyText = data.rawBody;
              if (bodyText.includes('<html') || bodyText.includes('<!DOCTYPE')) {
                return `Request failed (${response.status}) while calling ${targetUrl}`;
              }
              return bodyText.slice(0, 300);
            }
            return `Request failed (${response.status}) while calling ${targetUrl}`;
          })();
          const message =
            (typeof data.message === 'string' && data.message) ||
            (typeof data.error === 'string' && data.error) ||
            fallbackMessage;

          const isTransient =
            requestMethod === 'GET' &&
            (response.status >= 500 || response.status === 429 || message.toLowerCase().includes('network'));
          if (isTransient && attempt < maxAttempts) {
            setRetryNotice(`Retrying request (${attempt + 1}/${maxAttempts}): ${targetUrl}`);
            await sleep(300 * attempt);
            continue;
          }
          setRetryNotice(null);
          throw new Error(message);
        }
        setRetryNotice(null);
        return data;
      }
      setRetryNotice(null);
      throw lastError ?? new Error('Request failed unexpectedly');
    },
    [buildHeaders, isV2Mode, moduleApiBase]
  );

  const loadVersionScope = useCallback(async (versionId: string, preferredUnit?: string) => {
    if (!versionId) {
      setUnits([]);
      setUnit('');
      setUnitLos([]);
      return;
    }

    const params = new URLSearchParams();
    params.set('syllabusVersionId', versionId);
    if (preferredUnit) params.set('unit', preferredUnit);
    const data = await callApi(`/api/admin/module/runs?${params.toString()}`);

    const nextUnits = Array.isArray(data.units) ? data.units.map((value) => String(value)) : [];
    const resolvedUnit = String(data.resolvedUnit ?? preferredUnit ?? nextUnits[0] ?? '');
    const los = Array.isArray(data.unitLos) ? data.unitLos.map((value) => String(value)) : [];
    const structure = (data.unitStructure ?? null) as CanonicalUnitStructure | null;

    setUnits(nextUnits);
    setUnit(resolvedUnit);
    setUnitLos(los);
    setUnitStructure(structure);
  }, [callApi]);

  const loadGuidedDraftState = useCallback(async (lessonCodes: string[]) => {
    const uniqueCodes = Array.from(new Set(lessonCodes.map((value) => value.trim()).filter(Boolean)));
    if (uniqueCodes.length === 0) {
      setGuidedDraftsByBlueprint({});
      return;
    }

    try {
      let versions: GuidedVersionSummary[] = [];
      if (isDynamicMode) {
        const response = await v2AuthedFetch('/api/admin/dynamic-guided-v2/versions');
        const data = (await response.json()) as { success?: boolean; versions?: Array<Record<string, unknown>>; message?: string };
        if (!response.ok || !data.success || !Array.isArray(data.versions)) {
          throw new Error(data.message || 'Failed to load dynamic drafts.');
        }
        versions = data.versions.map((version) => ({
          id: String(version.id ?? ''),
          lessonCode: String(version.lessonCode ?? ''),
          versionNo: Number(version.versionNo ?? 0),
          status: String(version.status ?? ''),
          qualityScore: typeof version.qualityScore === 'number' ? version.qualityScore : null,
          grade: typeof version.report === 'object' && version.report && typeof (version.report as { grade?: unknown }).grade === 'string'
            ? String((version.report as { grade?: unknown }).grade)
            : null,
          report:
            typeof version.report === 'object' && version.report
              ? (version.report as GuidedVersionSummary['report'])
              : null,
          planScore:
            typeof version.planScore === 'object' && version.planScore
              ? (version.planScore as DynamicDiagnosticScore)
              : null,
          fidelityScore:
            typeof version.fidelityScore === 'object' && version.fidelityScore
              ? (version.fidelityScore as DynamicDiagnosticScore)
              : null,
          validation:
            typeof version.validation === 'object' && version.validation
              ? (version.validation as GuidedVersionSummary['validation'])
              : null,
        }));
      } else {
        const data = await callApi('/api/admin/guided-chunk/versions');
        versions = Array.isArray(data.versions) ? (data.versions as GuidedVersionSummary[]) : [];
      }
      const nextState: Record<string, GuidedDraftState> = {};

      for (const lessonCode of uniqueCodes) {
        const matching = versions
          .filter((version) => version.lessonCode === lessonCode)
          .sort((a, b) => b.versionNo - a.versionNo);
        const latest = matching[0];
        if (!latest) continue;
        nextState[lessonCode] = {
          blueprintId: lessonCode,
          status:
            latest.status === 'retired'
              ? 'planned'
              : latest.status === 'draft' ||
                  latest.status === 'needs_review' ||
                  latest.status === 'approved' ||
                  latest.status === 'published'
                ? 'generated'
                : 'planned',
          versionNo: latest.versionNo,
          score: typeof latest.qualityScore === 'number' ? latest.qualityScore : null,
          grade: typeof latest.grade === 'string' ? latest.grade : null,
          scoreReport: latest.report ?? null,
          planScore: latest.planScore ?? null,
          fidelityScore: latest.fidelityScore ?? null,
          validation: latest.validation ?? null,
          previewUrl: isDynamicMode
            ? withDevBypass(prefixHref(`/dynamic-guided-v2/${encodeURIComponent(lessonCode)}?versionId=${encodeURIComponent(latest.id)}&sourceContext=dynamic_module_preview`))
            : withDevBypass(prefixHref(`/guided-chunk/${encodeURIComponent(lessonCode)}?versionId=${encodeURIComponent(latest.id)}&sourceContext=guided_chunk_admin_preview`)),
          secondaryUrl: isDynamicMode
            ? withDevBypass(prefixHref(`/simple-chatbot?lessonMode=1&lessonCode=${encodeURIComponent(lessonCode)}&dynamicVersionId=${encodeURIComponent(latest.id)}`))
            : withDevBypass(prefixHref('/admin/guided-chunk')),
          secondaryLabel: isDynamicMode ? 'Open in Simple Chatbot' : 'Open Guided Admin',
        };
      }

      setGuidedDraftsByBlueprint(nextState);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : `Failed to load ${isDynamicMode ? 'dynamic' : 'guided'} drafts.`;
      if (!message.toLowerCase().includes('role required') && !message.toLowerCase().includes('invalid v2 admin token')) {
        console.error('[ModulePlanner] Failed to hydrate draft state', caughtError);
      }
    }
  }, [callApi, isDynamicMode, prefixHref, withDevBypass]);

  const loadBootstrap = useCallback(async () => {
    try {
      const data = await callApi('/api/admin/module/runs');
      setEnabled(true);
      const versions = Array.isArray(data.syllabusVersions)
        ? (data.syllabusVersions as SyllabusVersion[])
        : [];
      const runs = Array.isArray(data.recentRuns)
        ? (data.recentRuns as RunListItem[])
        : [];
      const sortedRuns = [...runs].sort((a, b) => b.created_at.localeCompare(a.created_at));
      const defaultVersionId = String(data.defaultSyllabusVersionId ?? '');
      const nextVersionId =
        syllabusVersionId && versions.some((version) => version.id === syllabusVersionId)
          ? syllabusVersionId
          : defaultVersionId;

      setSyllabusVersions(versions);
      setRecentRuns(sortedRuns);
      setSyllabusVersionId(nextVersionId);
      if (nextVersionId) {
        await loadVersionScope(nextVersionId, unit);
      } else {
        setUnits([]);
        setUnit('');
        setUnitLos([]);
      }
      const latestIngestion =
        data.latestIngestion && typeof data.latestIngestion === 'object'
          ? (data.latestIngestion as Record<string, unknown>)
          : null;
      if (!latestIngestion) {
        setPopulateState('IDLE');
      } else {
        const state = String(latestIngestion.state ?? 'IDLE').toUpperCase();
        if (state === 'READY' || state === 'FAILED' || state === 'RUNNING') {
          setPopulateState(state as PopulateState);
        } else {
          setPopulateState('IDLE');
        }
      }
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      if (msg.includes('MODULE_PLANNER_ENABLED') || msg.toLowerCase().includes('disabled')) {
        setEnabled(false);
      } else {
        setEnabled(null);
        setError(msg);
      }
    }
  }, [callApi, loadVersionScope, syllabusVersionId, unit]);

  const loadRunSummary = useCallback(
    async (id: string): Promise<RunSummary> => {
      const data = await callApi(`/api/admin/module/runs/${id}`);
      const summary = data as unknown as RunSummary;
      setRunSummary(summary);
      const nextResults: Partial<Record<StageKey, StageResult>> = {};
      summary.artifacts.forEach((artifact) => {
        nextResults[artifact.stage] = {
          success: true,
          stage: artifact.stage,
          replayed: false,
          artifact: artifact.artifact_json,
        };
      });
      setStageResults(nextResults);
      return summary;
    },
    [callApi]
  );

  useEffect(() => {
    void loadBootstrap();
  }, [loadBootstrap]);

  useEffect(() => {
    if (!runSummary) {
      setGuidedDraftsByBlueprint({});
      return;
    }

    const m4Raw = runSummary.artifacts.find((artifact) => artifact.stage === 'M4')?.artifact_json as
      | Array<{ id: string }>
      | { blueprints?: Array<{ id: string }> }
      | undefined;
    const blueprints = Array.isArray(m4Raw)
      ? m4Raw
      : Array.isArray(m4Raw?.blueprints)
        ? m4Raw.blueprints
        : [];

    void loadGuidedDraftState(blueprints.map((item) => item.id));
  }, [loadGuidedDraftState, runSummary]);

  useEffect(() => {
    if (!loading) {
      setTaskProgress(0);
      return;
    }

    setTaskProgress((current) => (current > 0 ? current : 8));
    const timer = window.setInterval(() => {
      setTaskProgress((current) => {
        if (current >= 92) return current;
        const bump = current < 40 ? 6 : current < 70 ? 3 : 1;
        return Math.min(92, current + bump);
      });
    }, 450);

    return () => window.clearInterval(timer);
  }, [loading, activeTaskLabel]);

  const handlePopulateSyllabus = async () => {
    setLoading(true);
    setActiveTaskLabel('Populating syllabus');
    setError(null);
    setInfo(null);
    setPopulateState('RUNNING');
    try {
      const data = await callApi('/api/admin/module/syllabus/populate', {});
      const nextVersionId = String(data.syllabusVersionId ?? '');
      setPopulateState('READY');
      await loadBootstrap();
      if (nextVersionId) {
        setSyllabusVersionId(nextVersionId);
        await loadVersionScope(nextVersionId);
      }
      setInfo(String(data.message ?? `Syllabus populate completed (${nextVersionId.slice(0, 8)}).`));
    } catch (e) {
      setPopulateState('FAILED');
      setError(e instanceof Error ? e.message : 'Failed to populate syllabus');
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleClearSyllabus = async () => {
    if (!confirm('Delete all syllabus versions for this curriculum scope and reset module runs?')) {
      return;
    }

    setLoading(true);
    setActiveTaskLabel('Clearing syllabus versions');
    setError(null);
    setInfo(null);
    try {
      const data = await callApi('/api/admin/module/syllabus/clear', {});
      await loadBootstrap();
      setRunId('');
      setRunSummary(null);
      setStageResults({});
      setSyllabusVersionId('');
      setUnits([]);
      setUnit('');
      setUnitLos([]);
      setUnitStructure(null);
      setInfo(String(data.message ?? 'Syllabus versions cleared.'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to clear syllabus versions');
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleSyllabusVersionChange = async (nextVersionId: string) => {
    setSyllabusVersionId(nextVersionId);
    setRunId('');
    setRunSummary(null);
    setStageResults({});
    if (!nextVersionId) {
      setUnits([]);
      setUnit('');
      setUnitLos([]);
      return;
    }
    try {
      await loadVersionScope(nextVersionId);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load version data');
    }
  };

  const handleUnitChange = async (nextUnit: string) => {
    setUnit(nextUnit);
    setRunId('');
    setRunSummary(null);
    setStageResults({});
    if (!syllabusVersionId) return;
    try {
      await loadVersionScope(syllabusVersionId, nextUnit);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load unit LOs');
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setError('Pick a file before upload.');
      return;
    }

    setLoading(true);
    setActiveTaskLabel('Uploading syllabus');
    setError(null);
    setInfo(null);
    try {
      const form = new FormData();
      form.append('file', uploadFile);
      const data = await callApi('/api/syllabus/upload', form, true);
      await loadBootstrap();
      const nextVersionId = String(data.syllabusVersionId);
      setSyllabusVersionId(nextVersionId);
      await loadVersionScope(nextVersionId);
      setInfo(`Uploaded syllabus version ${nextVersionId}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload syllabus');
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleCreateRun = async () => {
    if (!syllabusVersionId) {
      setError('Select a syllabus version first.');
      return;
    }
    if (!unit) {
      setError('Select a unit first.');
      return;
    }
    setLoading(true);
    setActiveTaskLabel('Creating run');
    setError(null);
    setInfo(null);
    try {
      const data = await callApi('/api/admin/module/runs', {
        syllabusVersionId,
        unit,
        chatTranscript,
      });
      const nextRunId = String((data.run as { id: string }).id);
      setRunId(nextRunId);
      await loadRunSummary(nextRunId);
      setInfo(`Created module run ${nextRunId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create run');
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleRefreshRunSummary = async () => {
    if (!runId) {
      setError('Create or select a run before refreshing summary.');
      return;
    }
    setLoading(true);
    setActiveTaskLabel('Refreshing run summary');
    setError(null);
    setInfo(null);
    try {
      await loadRunSummary(runId);
      setInfo(`Refreshed run summary for ${runId}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to refresh run summary');
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleLoadRun = async (id: string) => {
    setLoading(true);
    setActiveTaskLabel(`Loading run ${id}`);
    setError(null);
    setInfo(null);
    try {
      const runIdValue = id.trim();
      setRunId(runIdValue);
      await loadRunSummary(runIdValue);
      setInfo(`Loaded run ${runIdValue}.`);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to load run';
      if (message.includes('Run not found')) {
        setRunId('');
        setRunSummary(null);
        setStageResults({});
        await loadBootstrap();
        setError(`Run ${id} no longer exists. Refreshed recent runs.`);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
      setActiveTaskLabel(null);
    }
  };

  const handleDeleteRun = async (id: string) => {
    const target = recentRuns.find((row) => row.id === id);
    const confirmation = window.confirm(
      `Delete run ${id}${target ? ` (Unit ${target.unit}, ${new Date(target.created_at).toLocaleString()})` : ''}? This cannot be undone.`
    );
    if (!confirmation) return;

    setDeletingRunId(id);
    setError(null);
    setInfo(null);
    try {
      await callApi(`/api/admin/module/runs/${id}`, undefined, false, 'DELETE');
      setRecentRuns((prev) => prev.filter((row) => row.id !== id));
      if (runId === id) {
        setRunId('');
        setRunSummary(null);
        setStageResults({});
      }
      // Confirm the run no longer exists server-side.
      try {
        await callApi(`/api/admin/module/runs/${id}`);
        setError(`Delete warning: run ${id} still resolves from API.`);
      } catch {
        // Expected path: API should 404 after deletion.
      }
      await loadBootstrap();
      setInfo(`Deleted run ${id}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete run');
    } finally {
      setDeletingRunId(null);
    }
  };

  const handleDeleteGeneratedDraft = async (blueprintId: string) => {
    const draft = guidedDraftsByBlueprint[blueprintId];
    if (!isDynamicMode || !draft?.previewUrl || draft.versionNo == null) return;

    const matchingVersions = await v2AuthedFetch(
      `/api/admin/dynamic-guided-v2/versions?lessonCode=${encodeURIComponent(blueprintId)}`
    );
    const versionData = (await matchingVersions.json()) as {
      success?: boolean;
      versions?: Array<{ id?: string; versionNo?: number }>;
      message?: string;
    };
    if (!matchingVersions.ok || !versionData.success || !Array.isArray(versionData.versions)) {
      throw new Error(versionData.message || 'Failed to load dynamic versions for deletion.');
    }

    const targetVersion = versionData.versions.find((version) => Number(version.versionNo ?? 0) === draft.versionNo);
    if (!targetVersion?.id) {
      throw new Error(`Could not find version id for ${blueprintId} v${draft.versionNo}.`);
    }

    const confirmation = window.confirm(
      `Delete dynamic draft ${blueprintId} v${draft.versionNo}? This removes the saved generated lesson draft.`
    );
    if (!confirmation) return;

    setDeletingDraftBlueprintId(blueprintId);
    setError(null);
    setInfo(null);
    try {
      await callApi(
        `/api/admin/dynamic-guided-v2/versions?versionId=${encodeURIComponent(targetVersion.id)}`,
        undefined,
        false,
        'DELETE'
      );
      await loadGuidedDraftState(Object.keys(guidedDraftsByBlueprint));
      setInfo(`Deleted dynamic draft ${blueprintId} v${draft.versionNo}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete dynamic draft');
    } finally {
      setDeletingDraftBlueprintId(null);
    }
  };

  const runStage = async (stage: StageKey) => {
    if (!runId) {
      setError('Create a run before executing stages.');
      return;
    }
    setLoading(true);
    setActiveStage(stage);
    setActiveTaskLabel(`Running ${stage} - ${STAGE_LABEL[stage]}`);
    setError(null);
    setInfo(null);
    try {
      const endpoint = STAGE_ROUTE[stage];
      const basePayload = { replayFromArtifacts };
      const payload =
        stage === 'M0'
          ? {
              ...basePayload,
              syllabusVersionId,
              unit,
              selectedLos,
              constraints: {
                minimiseLessons: false,
                defaultMaxLessonsPerLO: defaultMaxLessons,
                maxAcsPerLesson,
                preferredAcsPerLesson,
                maxLessonsOverrides: {},
                level,
                audience,
              },
              orderingPreference,
              notes,
              chatTranscript,
            }
          : basePayload;

      const data = (await callApi(`/api/admin/module/${runId}/${endpoint}`, payload)) as unknown as StageResult;
      setStageResults((prev) => ({ ...prev, [stage]: data }));
      await loadRunSummary(runId);
      setInfo(`${STAGE_LABEL[stage]} completed${data.replayed ? ' (replayed)' : ''}.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : `Failed stage ${stage}`);
    } finally {
      setLoading(false);
      setActiveStage(null);
      setActiveTaskLabel(null);
    }
  };

  const runPlanningFlow = async () => {
    if (!runId) {
      setError('Create a run before planning.');
      return;
    }
    setLoading(true);
    setActiveTaskLabel('Planning lessons (M0-M5)');
    setError(null);
    setInfo(null);
    try {
      const planningStages: StageKey[] = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'];
      for (const stage of planningStages) {
        setActiveStage(stage);
        const endpoint = STAGE_ROUTE[stage];
        const basePayload = { replayFromArtifacts };
        const payload =
          stage === 'M0'
            ? {
                ...basePayload,
                syllabusVersionId,
                unit,
                selectedLos,
                constraints: {
                  minimiseLessons: false,
                  defaultMaxLessonsPerLO: defaultMaxLessons,
                  maxAcsPerLesson,
                  preferredAcsPerLesson,
                  maxLessonsOverrides: {},
                  level,
                  audience,
                },
                orderingPreference,
                notes,
                chatTranscript,
              }
            : basePayload;
        const data = (await callApi(`/api/admin/module/${runId}/${endpoint}`, payload)) as unknown as StageResult;
        setStageResults((prev) => ({ ...prev, [stage]: data }));
      }
      await loadRunSummary(runId);
      setInfo(`Planning complete. Review the lesson matrix, then generate ${isDynamicMode ? 'dynamic' : 'guided'} drafts.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed during planning flow');
    } finally {
      setLoading(false);
      setActiveStage(null);
      setActiveTaskLabel(null);
    }
  };

  const handleGenerateGuidedLesson = async (blueprintId: string) => {
    if (!runId) {
      setError('Create a run first.');
      return;
    }

    setGeneratingGuidedBlueprintId(blueprintId);
    setGuidedDraftsByBlueprint((prev) => ({
      ...prev,
      [blueprintId]: {
        blueprintId,
        status: 'generating',
      },
    }));
    setError(null);
    setInfo(null);

    try {
      const data = await callApi(
        `${moduleApiBase}/${runId}/lessons/${encodeURIComponent(blueprintId)}/${isDynamicMode ? 'dynamic-generate' : 'guided-generate'}`,
        {}
      );
      const versionNo = typeof data.version?.versionNo === 'number' ? data.version.versionNo : '?';
      const score = typeof data.score?.total === 'number' ? data.score.total : null;
      const grade = typeof data.score?.grade === 'string' ? data.score.grade : null;
      const previewUrl = typeof data.previewUrl === 'string' ? data.previewUrl : null;
      const secondaryUrl =
        typeof data.simpleChatbotPreviewUrl === 'string'
          ? data.simpleChatbotPreviewUrl
          : typeof data.adminUrl === 'string'
            ? data.adminUrl
            : null;
      const accepted = Boolean(data.accepted ?? data.success);
      const phases = Array.isArray(data.phases) ? (data.phases as DynamicPhaseArtifactView[]) : null;
      setGuidedDraftsByBlueprint((prev) => ({
        ...prev,
        [blueprintId]: {
          blueprintId,
          status: accepted ? 'generated' : 'failed',
          versionNo: typeof versionNo === 'number' ? versionNo : null,
          score,
          grade,
          scoreReport:
            typeof data.score === 'object' && data.score
              ? (data.score as GuidedVersionSummary['report'])
              : null,
          planScore:
            typeof data.planScore === 'object' && data.planScore
              ? (data.planScore as DynamicDiagnosticScore)
              : null,
          fidelityScore:
            typeof data.fidelityScore === 'object' && data.fidelityScore
              ? (data.fidelityScore as DynamicDiagnosticScore)
              : null,
          validation:
            typeof data.validation === 'object' && data.validation
              ? (data.validation as GuidedVersionSummary['validation'])
              : null,
          previewUrl: withDevBypass(previewUrl),
          secondaryUrl: withDevBypass(secondaryUrl),
          secondaryLabel: isDynamicMode ? 'Open in Simple Chatbot' : 'Open Guided Admin',
          error: accepted ? null : typeof data.rejectionReason === 'string' ? data.rejectionReason : `Failed to generate ${isDynamicMode ? 'dynamic' : 'guided'} lesson.`,
          rejectionReason: typeof data.rejectionReason === 'string' ? data.rejectionReason : null,
          phases,
        },
      }));
      if (isDynamicMode) {
        console.groupCollapsed('[dynamic-module] draft', `${blueprintId} ${accepted ? `v${versionNo}` : 'rejected'}`);
        console.log('lessonScore', data.score ?? null);
        console.log('planScore', data.planScore ?? null);
        console.log('fidelityScore', data.fidelityScore ?? null);
        console.log('validation', data.validation ?? null);
        console.log('version', data.version ?? null);
        console.log('previewUrl', previewUrl);
        console.log('simpleChatbotPreviewUrl', secondaryUrl);
        console.log('accepted', accepted);
        console.log('rejectionReason', data.rejectionReason ?? null);
        console.log('phases', phases);
        console.groupEnd();
      }
      if (accepted) {
        setInfo(
          [
            `Generated ${isDynamicMode ? 'dynamic' : 'guided'} draft for ${blueprintId} as v${versionNo}.`,
            score != null ? `Score ${score}${grade ? ` (${grade})` : ''}.` : null,
            previewUrl ? `Preview: ${previewUrl}` : null,
          ]
            .filter(Boolean)
            .join(' ')
        );
      } else {
        setError(typeof data.rejectionReason === 'string' ? data.rejectionReason : `Failed to generate ${isDynamicMode ? 'dynamic' : 'guided'} lesson for ${blueprintId}.`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : `Failed to generate ${isDynamicMode ? 'dynamic' : 'guided'} lesson for ${blueprintId}.`;
      setGuidedDraftsByBlueprint((prev) => ({
        ...prev,
        [blueprintId]: {
          blueprintId,
          status: 'failed',
          error: message,
        },
      }));
      setError(message);
    } finally {
      setGeneratingGuidedBlueprintId(null);
    }
  };

  const stageOrder: StageKey[] = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5'];

  return (
    <main className="admin-page min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold">
              {isDynamicMode ? dynamicLabel : isGuidedMode ? guidedLabel : isV2Mode ? 'V2 Module Planner' : 'Module Planner vNext'}
            </h1>
            <p className="text-sm text-slate-600">
              {isDynamicMode
                ? dynamicDescription
                : isGuidedMode
                ? guidedDescription
                : isV2Mode
                ? 'Run the proven module planner, then import generated lessons into V2 draft versions.'
                : 'Syllabus-versioned module planner pipeline (M0-M5) with manual per-lesson generation'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={isDynamicMode ? prefixHref('/admin/dynamic-generate') : isGuidedMode ? prefixHref('/admin/guided-chunk') : isV2Mode ? '/v2/generate' : '/generate'} className="rounded border border-slate-300 px-3 py-2 text-sm">
              {isDynamicMode ? 'Dynamic Lesson Generator' : isGuidedMode ? 'Guided Runtime' : 'Lesson'}
            </Link>
            <span className="rounded bg-slate-900 px-3 py-2 text-sm text-white">{isDynamicMode ? 'Dynamic Planner' : isGuidedMode ? 'Guided Planner' : 'Module'}</span>
          </div>
        </header>

        {(isGuidedMode || isDynamicMode) && (
          <section className={`rounded-lg p-4 text-sm text-slate-800 shadow-sm ${isDynamicMode ? 'border border-amber-200 bg-amber-50' : 'border border-indigo-200 bg-indigo-50'}`}>
            <h2 className={`font-semibold ${isDynamicMode ? 'text-amber-950' : 'text-indigo-950'}`}>{isDynamicMode ? 'Dynamic 2365 Workflow' : 'New Guided Workflow'}</h2>
            <p className="mt-1">
              {isDynamicMode
                ? 'This page uses the standard staged planner to break a 2365 syllabus into LO-backed lesson blueprints, then generates native dynamic lesson drafts from that lesson matrix.'
                : <>This page is for the guided tutor system only. The old static lesson generator stays in <span className="font-semibold">/admin/module</span>.</>}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>Populate syllabus</li>
              <li>Select a syllabus version and unit</li>
              <li>Create a run</li>
              <li>Plan lessons through M0-M5</li>
              <li>Generate {isDynamicMode ? 'dynamic' : 'guided'} drafts from the lesson matrix</li>
            </ol>
          </section>
        )}

        <section className="rounded-lg bg-white p-4 shadow-sm space-y-3">
          <label className="block text-sm font-medium">Admin token (optional)</label>
          <div className="flex gap-2">
            <input className="w-full rounded border border-slate-300 px-2 py-2" value={adminToken} onChange={(e) => setAdminToken(e.target.value)} />
            <button onClick={() => void loadBootstrap()} className="rounded border border-slate-300 px-3 py-2 text-sm">Reload</button>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            <button onClick={() => void handlePopulateSyllabus()} disabled={loading} className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60">
              {populateState === 'RUNNING' ? 'Populating...' : 'Populate syllabus'}
            </button>
            <button
              onClick={() => void handleClearSyllabus()}
              disabled={loading}
              className="rounded border border-rose-300 px-3 py-2 text-sm text-rose-700 disabled:opacity-60"
            >
              Clear syllabus data
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
            />
            <button
              onClick={handleChooseFile}
              disabled={loading}
              className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60"
            >
              {uploadFile ? `File: ${uploadFile.name}` : 'Choose file'}
            </button>
            <button onClick={() => void handleUpload()} disabled={loading} className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60">Upload syllabus</button>
            <select className="rounded border border-slate-300 px-2 py-2" value={syllabusVersionId} onChange={(e) => void handleSyllabusVersionChange(e.target.value)}>
              <option value="">Select syllabus version</option>
              {syllabusVersions.map((version) => (
                <option key={version.id} value={version.id}>{version.filename} - {version.id.slice(0, 8)}</option>
              ))}
            </select>
          </div>
          {loading && (
            <div className="rounded border border-sky-200 bg-sky-50 p-3">
              <div className="mb-1 flex items-center justify-between text-xs text-sky-800">
                <span>{activeTaskLabel ?? 'Working...'}</span>
                <span>{taskProgress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded bg-sky-100">
                <div
                  className="h-full rounded bg-sky-500 transition-all duration-500"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
            </div>
          )}
          <p className="text-xs text-slate-600">
            Populate state:{' '}
            <span className={populateState === 'FAILED' ? 'text-rose-700' : 'text-slate-700'}>
              {populateState}
            </span>
          </p>
          {syllabusVersions.length === 0 && (
            <p className="text-sm text-slate-700">
              No syllabus versions available yet. Click `Populate syllabus` to ingest the pre-seeded syllabus source.
            </p>
          )}
          {activeVersion && (
            <p className="text-xs text-slate-600">
              {activeVersion.filename} | {activeVersion.content_hash.slice(0, 12)} | {new Date(activeVersion.created_at).toLocaleString()} | chunks {String(activeVersion.meta_json?.chunkCount ?? '?')} | LOs {String(activeVersion.meta_json?.loCount ?? '?')} | ACs {String(activeVersion.meta_json?.acCount ?? '?')} | units {JSON.stringify(activeVersion.meta_json?.unitsFound ?? [])}
            </p>
          )}
        </section>

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Runs</h2>
          <p className="mb-2 text-xs text-slate-600">Newest first. Actions apply to the exact Run ID shown on each row.</p>
          {recentRuns.length === 0 ? (
            <p className="text-sm text-slate-600">No runs yet.</p>
          ) : (
            <div className="space-y-2">
              {recentRuns.map((row, index) => (
                <div key={row.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-slate-200 p-2 text-sm">
                  <div>
                    <p className="font-medium">
                      Run #{index + 1} | Unit {row.unit}
                    </p>
                    <p className="text-xs text-slate-600 break-all">
                      Run ID: {row.id}
                    </p>
                    <p className="text-xs text-slate-600">
                      Date: {new Date(row.created_at).toLocaleString()} | Status: {row.status} | Syllabus: {row.syllabus_version_id.slice(0, 8)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => void handleLoadRun(row.id)}
                      disabled={loading || deletingRunId === row.id}
                      className="rounded border border-slate-300 px-2 py-1 text-xs disabled:opacity-60"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => void handleDeleteRun(row.id)}
                      disabled={loading || deletingRunId !== null}
                      className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:opacity-60"
                    >
                      {deletingRunId === row.id ? 'Deleting...' : 'Delete Entire Run'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {enabled !== false && (
          <section className="grid gap-4 rounded-lg bg-white p-4 shadow-sm md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-sm font-medium">Unit
                <select className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={unit} onChange={(e) => void handleUnitChange(e.target.value)} disabled={!syllabusVersionId || units.length === 0}>
                  {units.length === 0 ? (
                    <option value="">No units available</option>
                  ) : (
                    units.map((u) => <option key={u} value={u}>Unit {u}</option>)
                  )}
                </select>
              </label>
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected LOs (default)</p>
                {!manualLoOverride && (
                  <div className="rounded border border-slate-200 bg-slate-50 px-2 py-2 text-sm">
                    {unitLos.length > 0 ? unitLos.join(', ') : 'No LOs found for selected unit.'}
                  </div>
                )}
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={manualLoOverride}
                    onChange={(e) => {
                      const enabledOverride = e.target.checked;
                      setManualLoOverride(enabledOverride);
                      if (enabledOverride && manualLosInput.trim().length === 0) {
                        setManualLosInput(unitLos.join(', '));
                      }
                    }}
                  />
                  Manual LO override (advanced)
                </label>
                {manualLoOverride && (
                  <input
                    className="w-full rounded border border-slate-300 px-2 py-2"
                    value={manualLosInput}
                    onChange={(e) => setManualLosInput(e.target.value)}
                    placeholder="LO1, LO5"
                  />
                )}
              </div>
              <label className="block text-sm font-medium">Chat Transcript
                <textarea className="mt-1 h-36 w-full rounded border border-slate-300 px-2 py-2" value={chatTranscript} onChange={(e) => setChatTranscript(e.target.value)} />
              </label>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium">Notes
                <textarea className="mt-1 h-20 w-full rounded border border-slate-300 px-2 py-2" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-sm font-medium">Max lessons/LO
                  <input type="number" min={1} className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={defaultMaxLessons} onChange={(e) => setDefaultMaxLessons(Number.parseInt(e.target.value || '9', 10))} />
                </label>
                <label className="block text-sm font-medium">Ordering
                  <select className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={orderingPreference} onChange={(e) => setOrderingPreference(e.target.value as 'foundation-first' | 'lo-order')}>
                    <option value="foundation-first">foundation-first</option>
                    <option value="lo-order">lo-order</option>
                  </select>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="block text-sm font-medium">Max ACs/Lesson (hard)
                  <input type="number" min={1} className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={maxAcsPerLesson} onChange={(e) => setMaxAcsPerLesson(Number.parseInt(e.target.value || '4', 10))} />
                </label>
                <label className="block text-sm font-medium">Preferred ACs/Lesson (soft)
                  <input type="number" min={1} className="mt-1 w-full rounded border border-slate-300 px-2 py-2" value={preferredAcsPerLesson} onChange={(e) => setPreferredAcsPerLesson(Number.parseInt(e.target.value || '2', 10))} />
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="rounded border border-slate-300 px-2 py-2" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="Level" />
                <input className="rounded border border-slate-300 px-2 py-2" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Audience" />
              </div>
              <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={replayFromArtifacts} onChange={(e) => setReplayFromArtifacts(e.target.checked)} />Replay-from-artifacts</label>
              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => void handleCreateRun()} disabled={loading || !syllabusVersionId || !unit} className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60">Create Run</button>
                <button onClick={() => void runPlanningFlow()} disabled={loading || !runId} className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-60">Plan lessons (M0-M5)</button>
                {runId && <span className="self-center text-xs text-slate-600">Run: {runId}</span>}
              </div>
            </div>
          </section>
        )}

        {unitStructure && (
          <section className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Truth Layer: Unit {unitStructure.unit}</h2>
            {Array.isArray(unitStructure.range) && unitStructure.range.length > 0 && (
              <div className="mb-3 rounded border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
                <p className="font-medium">Range</p>
                <ul className="mt-1 space-y-1">
                  {unitStructure.range.map((item, idx) => (
                    <li key={`${item}-${idx}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-3">
              {unitStructure.los.map((lo) => (
                <div key={lo.loNumber} className="rounded border border-slate-200 p-3">
                  <p className="text-sm font-medium">LO{lo.loNumber}{lo.title ? ` - ${lo.title}` : ''}</p>
                  {Array.isArray(lo.range) && lo.range.length > 0 && (
                    <div className="mt-2 rounded border border-slate-100 bg-slate-50 p-2 text-xs text-slate-700">
                      <p className="font-medium">Range</p>
                      <ul className="mt-1 space-y-1">
                        {lo.range.map((item, idx) => (
                          <li key={`${item}-${idx}`}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <ul className="mt-2 space-y-1 text-xs text-slate-700">
                    {lo.acs.map((ac) => (
                      <li key={ac.acKey}>
                        <span className="font-semibold">{ac.acKey}</span>: {ac.text ?? ''}
                        {Array.isArray(ac.range) && ac.range.length > 0 ? ` (Range: ${ac.range.join(', ')})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold">Stages</h2>
          {loading && (
            <div className="mb-3 rounded border border-sky-200 bg-sky-50 p-2 text-xs text-sky-800">
              <p>{activeTaskLabel ?? 'Working...'}</p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded bg-sky-100">
                <div className="h-full w-1/3 animate-pulse rounded bg-sky-500" />
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {stageOrder.map((stage) => (
              (() => {
                const hasArtifact = Boolean(stageResults[stage]?.artifact);
                const isRunning = activeStage === stage;
                const className = isRunning
                  ? 'border-sky-500 bg-sky-50 text-sky-900'
                  : hasArtifact
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                    : 'border-slate-300 bg-white text-slate-900';
                return (
                  <button
                    key={stage}
                    onClick={() => void runStage(stage)}
                    disabled={loading || !runId}
                    className={`rounded border px-3 py-2 text-sm disabled:opacity-60 ${className}`}
                  >
                    {isRunning ? 'Running...' : STAGE_LABEL[stage]}
                    {isRunning ? '' : hasArtifact ? ' Done' : runSummary?.replayable?.[stage] ? ' *' : ''}
                  </button>
                );
              })()
            ))}
            <button
              onClick={() => void handleRefreshRunSummary()}
              disabled={loading || !runId}
              className="rounded bg-slate-900 px-3 py-2 text-sm text-white disabled:opacity-60"
            >
              Refresh Run Summary
            </button>
          </div>
        </section>

        {retryNotice && (
          <section className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            {retryNotice}
          </section>
        )}
        {error && <section className="rounded border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700">{error}</section>}
        {info && <section className="rounded border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{info}</section>}

        <section className="grid gap-4 md:grid-cols-2">
          {stageOrder.map((stage) => {
            const artifact = stageResults[stage]?.artifact;
            const replayed = stageResults[stage]?.replayed;
            return (
              <article key={stage} className="rounded-lg bg-white p-4 shadow-sm">
                <h3 className="mb-2 font-semibold">{stage} - {STAGE_LABEL[stage]} {replayed ? '(replayed)' : ''}</h3>
                <pre className="max-h-80 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{artifact ? JSON.stringify(artifact, null, 2) : 'No artifact yet'}</pre>
              </article>
            );
          })}
        </section>

        {runSummary && (
          <section className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Run Summary</h2>
            <pre className="max-h-96 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">{JSON.stringify(runSummary, null, 2)}</pre>
            {chunkDiagnostics.length > 0 && (
              <div className="mt-3 rounded border border-slate-200 p-3 text-xs">
                <p className="font-medium">Chunks Used (stage / chunk / pages)</p>
                <ul className="mt-2 space-y-1">
                  {chunkDiagnostics.map((row, index) => (
                    <li key={`${row.stage}-${row.id}-${index}`}>{row.stage} / {row.id} / {row.pageStart}-{row.pageEnd}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {runSummary && (
          <section className="rounded-lg bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold">Lesson Plan Matrix</h2>
            {(() => {
              const m2 = runSummary.artifacts.find((a) => a.stage === 'M2')?.artifact_json as
                | { los?: Array<{ lo: string; coverageTargets: Array<{ acKey: string; acText: string }> }> }
                | undefined;
              const m4Raw = runSummary.artifacts.find((a) => a.stage === 'M4')?.artifact_json as
                | Array<{ id: string; lo: string; topic: string; acAnchors: string[] }>
                | { blueprints?: Array<{ id: string; lo: string; topic: string; acAnchors: string[] }> }
                | undefined;
              const m4 = Array.isArray(m4Raw)
                ? m4Raw
                : Array.isArray(m4Raw?.blueprints)
                  ? m4Raw.blueprints
                  : [];
              const acByKey = new Map<string, string>();
              m2?.los?.forEach((lo) => lo.coverageTargets?.forEach((ac) => acByKey.set(ac.acKey, ac.acText)));
              if (m4.length === 0) {
                return <p className="text-sm text-slate-600">No planned lessons yet. Run planning through M4/M5 first.</p>;
              }

              const byLo = new Map<string, Array<{ id: string; lo: string; topic: string; acAnchors: string[] }>>();
              m4.forEach((bp) => {
                const arr = byLo.get(bp.lo) ?? [];
                arr.push(bp);
                byLo.set(bp.lo, arr);
              });

              return (
                <div className="space-y-4">
                  {Array.from(byLo.entries())
                    .sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))
                    .map(([lo, lessons]) => (
                      <div key={lo} className="rounded border border-slate-300 p-3">
                        <h3 className="text-sm font-semibold">{lo} ({lessons.length} lesson{lessons.length === 1 ? '' : 's'})</h3>
                        <div className="mt-3 space-y-3">
                          {lessons.map((bp) => {
                            const guidedState = guidedDraftsByBlueprint[bp.id];
                            const state = guidedState?.status ?? 'planned';
                            return (
                              <div key={bp.id} className="rounded border border-slate-200 p-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-semibold">{bp.id}</p>
                                    <p className="text-xs text-slate-600">{bp.topic}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="rounded bg-slate-100 px-2 py-1 text-xs">{state}</span>
                                    
                                    <button
                                      onClick={() => void handleGenerateGuidedLesson(bp.id)}
                                      disabled={Boolean(generatingGuidedBlueprintId)}
                                      className="rounded border border-indigo-300 px-2 py-1 text-xs text-indigo-700 disabled:opacity-60"
                                    >
                                      {generatingGuidedBlueprintId === bp.id
                                        ? `Generating ${isDynamicMode ? 'Dynamic' : 'Guided'}...`
                                        : state === 'generated' || state === 'failed'
                                          ? `Regenerate ${isDynamicMode ? 'Dynamic' : 'Guided'}`
                                          : `Generate ${isDynamicMode ? 'Dynamic' : 'Guided'}`}
                                    </button>
                                    {guidedState?.previewUrl ? (
                                      <Link href={guidedState.previewUrl} className="rounded border border-slate-300 px-2 py-1 text-xs">
                                        {isDynamicMode ? 'Preview Dynamic Draft' : 'Preview Guided Draft'}
                                      </Link>
                                    ) : null}
                                    {guidedState?.secondaryUrl ? (
                                      <Link href={guidedState.secondaryUrl} className="rounded border border-slate-300 px-2 py-1 text-xs">
                                        {guidedState.secondaryLabel ?? (isDynamicMode ? 'Open in Simple Chatbot' : 'Open Guided Admin')}
                                      </Link>
                                    ) : null}
                                    {isDynamicMode && state === 'generated' ? (
                                      <button
                                        onClick={() => void handleDeleteGeneratedDraft(bp.id)}
                                        disabled={loading || deletingDraftBlueprintId !== null}
                                        className="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 disabled:opacity-60"
                                      >
                                        {deletingDraftBlueprintId === bp.id ? 'Deleting Draft...' : 'Delete Dynamic Draft'}
                                      </button>
                                    ) : null}
                                  </div>
                                </div>

                                {state === 'generated' && (
                                  <div className="mt-3 rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                                    <p className="font-semibold">{isDynamicMode ? 'Dynamic draft generated' : 'Guided draft generated'}</p>
                                    <p className="mt-1">
                                      Version: v{guidedState?.versionNo ?? '?'}
                                      {guidedState?.score != null ? ` | Lesson score: ${guidedState.score}` : ''}
                                      {guidedState?.grade ? ` | Grade: ${guidedState.grade}` : ''}
                                    </p>
                                    {isDynamicMode ? (
                                      <DynamicDraftDiagnostics
                                        scoreReport={guidedState.scoreReport}
                                        planScore={guidedState.planScore}
                                        fidelityScore={guidedState.fidelityScore}
                                        validation={guidedState.validation}
                                        phases={guidedState.phases}
                                      />
                                    ) : null}
                                  </div>
                                )}

                                {state === 'failed' && guidedState?.error && (
                                  <div className="mt-3 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900">
                                    <p className="font-semibold">{isDynamicMode ? 'Dynamic generation failed' : 'Guided generation failed'}</p>
                                    <p className="mt-1">{guidedState.error}</p>
                                    {guidedState?.score != null ? (
                                      <p className="mt-1">
                                        Lesson score: {guidedState.score}
                                        {guidedState.grade ? ` (${guidedState.grade})` : ''}
                                      </p>
                                    ) : null}
                                    {isDynamicMode ? (
                                      <DynamicDraftDiagnostics
                                        scoreReport={guidedState.scoreReport}
                                        planScore={guidedState.planScore}
                                        fidelityScore={guidedState.fidelityScore}
                                        validation={guidedState.validation}
                                        phases={guidedState.phases}
                                      />
                                    ) : null}
                                  </div>
                                )}
                                
                                <div className="mt-2 text-xs text-slate-700">
                                  <p className="font-medium">Covered ACs</p>
                                  <ul className="mt-1 space-y-1">
                                    {bp.acAnchors.map((ac) => (
                                      <li key={ac}>
                                        <span className="font-semibold">{ac}</span>
                                        {acByKey.get(ac) ? ` - ${acByKey.get(ac)}` : ''}
                                      </li>
                                    ))}
                                  </ul>
                                  
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                </div>
              );
            })()}
          </section>
        )}
      </div>
    </main>
  );
}



