'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { courseHref } from '@/lib/routing/courseHref';
import { getCoursePrefixForClient } from '@/lib/routing/curricula';

type LessonExplanationOption = {
  id: string;
  title: string;
  order: number;
  linkedDiagramId?: string | null;
  linkedDiagramEmbedUrl?: string | null;
};

type LessonOption = {
  lessonId: string;
  title: string;
  simulationEmbedUrl?: string | null;
  simulationRepoName?: string | null;
  explanations?: LessonExplanationOption[];
};

type LessonsStatusResponse = {
  success: boolean;
  lessons?: LessonOption[];
  error?: string;
};

type CloneResponse = {
  success: boolean;
  error?: string;
  lessonId?: string;
  explanationBlockId?: string | null;
  diagramBlockId?: string;
  embedUrl?: string;
  deleted?: boolean;
  embedCleared?: boolean;
  message?: string;
  repo?: {
    owner?: string;
    name: string;
    path: string;
  };
};

type VisualConceptPrompt = {
  conceptTitle: string;
  diagramPrompt: string;
  animationPrompt: string;
};

type VisualPromptResponse = {
  success: boolean;
  error?: string;
  lessonId?: string;
  explanationBlockId?: string;
  model?: string;
  concepts?: VisualConceptPrompt[];
};

export default function AdminSimulationsPage() {
  type PlacementMode = 'main-diagram' | 'below-explanation';

  const extractRepoFromEmbedUrl = (embedUrl?: string | null): string | null => {
    if (!embedUrl) return null;
    const match = embedUrl.trim().match(/^\/simulations\/([^/?#]+)/i);
    return match?.[1] ?? null;
  };

  const coursePrefix = getCoursePrefixForClient();
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [actionStatus, setActionStatus] = useState<'idle' | 'cloning' | 'updating' | 'deleting'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CloneResponse | null>(null);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [visualPrompts, setVisualPrompts] = useState<VisualConceptPrompt[]>([]);
  const [visualPromptModel, setVisualPromptModel] = useState<string | null>(null);
  const [visualPromptError, setVisualPromptError] = useState<string | null>(null);

  const [lessonId, setLessonId] = useState('');
  const [explanationBlockId, setExplanationBlockId] = useState('');
  const [placementMode, setPlacementMode] = useState<PlacementMode>('below-explanation');
  const [repoUrl, setRepoUrl] = useState('');
  const [embedPath, setEmbedPath] = useState('');
  const [overwrite, setOverwrite] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadLessons = async () => {
      setIsLoadingLessons(true);
      setError(null);

      try {
        const response = await fetch('/api/lessons-status', {
          headers: {
            'x-course-prefix': coursePrefix,
          },
        });
        const data = (await response.json()) as LessonsStatusResponse;
        if (!response.ok || !data.success || !Array.isArray(data.lessons)) {
          throw new Error(data.error || 'Failed to load lessons.');
        }

        if (!mounted) return;
        setLessons(data.lessons);
        if (data.lessons.length > 0) {
          setLessonId(data.lessons[0].lessonId);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load lessons.');
      } finally {
        if (mounted) setIsLoadingLessons(false);
      }
    };

    void loadLessons();
    return () => {
      mounted = false;
    };
  }, [coursePrefix]);

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.lessonId === lessonId),
    [lessons, lessonId]
  );
  const selectedExplanations = selectedLesson?.explanations ?? [];
  const selectedExplanation =
    selectedExplanations.find((item) => item.id === explanationBlockId) ?? null;
  const selectedLessonTitle = selectedLesson?.title ?? '';
  const selectedEmbedUrl =
    placementMode === 'below-explanation'
      ? selectedExplanation?.linkedDiagramEmbedUrl ?? null
      : selectedLesson?.simulationEmbedUrl ?? null;
  const selectedRepo =
    (placementMode === 'below-explanation'
      ? extractRepoFromEmbedUrl(selectedExplanation?.linkedDiagramEmbedUrl)
      : null) ??
    selectedLesson?.simulationRepoName ??
    extractRepoFromEmbedUrl(selectedLesson?.simulationEmbedUrl ?? null);

  const isSubmitting = actionStatus !== 'idle';

  useEffect(() => {
    const fallback = selectedExplanations[0]?.id ?? '';
    if (fallback !== explanationBlockId) {
      setExplanationBlockId(fallback);
      setVisualPrompts([]);
      setVisualPromptError(null);
      setVisualPromptModel(null);
    }
  }, [selectedExplanations, explanationBlockId]);

  const onGenerateVisualPrompts = async () => {
    if (!lessonId || !explanationBlockId) {
      setVisualPromptError('Select a lesson and explanation section first.');
      return;
    }

    setIsGeneratingPrompts(true);
    setVisualPromptError(null);
    setVisualPromptModel(null);
    setVisualPrompts([]);

    try {
      const response = await fetch('/api/admin/simulations/visual-prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-course-prefix': coursePrefix,
        },
        body: JSON.stringify({
          lessonId,
          explanationBlockId,
        }),
      });

      const data = (await response.json()) as VisualPromptResponse;
      if (!response.ok || !data.success || !Array.isArray(data.concepts)) {
        throw new Error(data.error || 'Failed to generate visual prompts.');
      }

      setVisualPrompts(data.concepts.slice(0, 1));
      setVisualPromptModel(data.model ?? null);
    } catch (err) {
      setVisualPromptError(err instanceof Error ? err.message : 'Failed to generate visual prompts.');
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lessonId || !repoUrl.trim()) {
      setError('Lesson and GitHub URL are required.');
      return;
    }
    if (placementMode === 'below-explanation' && !explanationBlockId) {
      setError('Explanation section is required for block placement.');
      return;
    }

    setActionStatus('cloning');
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/simulations/clone-to-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-course-prefix': coursePrefix,
        },
        body: JSON.stringify({
          lessonId,
          explanationBlockId: placementMode === 'below-explanation' ? explanationBlockId : undefined,
          repoUrl: repoUrl.trim(),
          embedPath: embedPath.trim() || undefined,
          overwrite,
        }),
      });

      const data = (await response.json()) as CloneResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Clone/update failed.');
      }

      if (data.lessonId) {
        const targetExplanationId =
          typeof data.explanationBlockId === 'string' && data.explanationBlockId.trim()
            ? data.explanationBlockId
            : null;
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.lessonId === data.lessonId
              ? {
                  ...lesson,
                  simulationEmbedUrl: data.embedUrl ?? lesson.simulationEmbedUrl ?? null,
                  simulationRepoName:
                    data.repo?.name ?? extractRepoFromEmbedUrl(data.embedUrl ?? lesson.simulationEmbedUrl),
                  explanations: targetExplanationId
                    ? (lesson.explanations ?? []).map((explanation) =>
                        explanation.id === targetExplanationId
                          ? {
                              ...explanation,
                              linkedDiagramEmbedUrl: data.embedUrl ?? explanation.linkedDiagramEmbedUrl ?? null,
                              linkedDiagramId: data.diagramBlockId ?? explanation.linkedDiagramId ?? null,
                            }
                          : explanation
                      )
                    : lesson.explanations,
                }
              : lesson
          )
        );
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Clone/update failed.');
    } finally {
      setActionStatus('idle');
    }
  };

  const onUpdateRepo = async () => {
    if (!lessonId || !repoUrl.trim()) {
      setError('Lesson and GitHub URL are required.');
      return;
    }
    if (placementMode === 'below-explanation' && !explanationBlockId) {
      setError('Explanation section is required for block placement.');
      return;
    }

    setActionStatus('updating');
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/simulations/clone-to-lesson', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-course-prefix': coursePrefix,
        },
        body: JSON.stringify({
          lessonId,
          explanationBlockId: placementMode === 'below-explanation' ? explanationBlockId : undefined,
          repoUrl: repoUrl.trim(),
          embedPath: embedPath.trim() || undefined,
          overwrite: true,
        }),
      });

      const data = (await response.json()) as CloneResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Update failed.');
      }

      if (data.lessonId) {
        const targetExplanationId =
          typeof data.explanationBlockId === 'string' && data.explanationBlockId.trim()
            ? data.explanationBlockId
            : null;
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.lessonId === data.lessonId
              ? {
                  ...lesson,
                  simulationEmbedUrl: data.embedUrl ?? lesson.simulationEmbedUrl ?? null,
                  simulationRepoName:
                    data.repo?.name ?? extractRepoFromEmbedUrl(data.embedUrl ?? lesson.simulationEmbedUrl),
                  explanations: targetExplanationId
                    ? (lesson.explanations ?? []).map((explanation) =>
                        explanation.id === targetExplanationId
                          ? {
                              ...explanation,
                              linkedDiagramEmbedUrl: data.embedUrl ?? explanation.linkedDiagramEmbedUrl ?? null,
                              linkedDiagramId: data.diagramBlockId ?? explanation.linkedDiagramId ?? null,
                            }
                          : explanation
                      )
                    : lesson.explanations,
                }
              : lesson
          )
        );
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setActionStatus('idle');
    }
  };

  const onDeleteRepo = async () => {
    if (!lessonId) {
      setError('Lesson is required.');
      return;
    }
    if (placementMode === 'below-explanation' && !explanationBlockId) {
      setError('Explanation section is required for block placement.');
      return;
    }

    const confirmed = window.confirm(
      `Delete the linked simulation repo folder for ${lessonId}? This removes files from src/simulations.`
    );
    if (!confirmed) return;

    setActionStatus('deleting');
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/simulations/clone-to-lesson', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-course-prefix': coursePrefix,
        },
        body: JSON.stringify({
          lessonId,
          explanationBlockId: placementMode === 'below-explanation' ? explanationBlockId : undefined,
          repoUrl: repoUrl.trim() || undefined,
        }),
      });

      const data = (await response.json()) as CloneResponse;
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Delete failed.');
      }

      if (data.lessonId) {
        const targetExplanationId =
          typeof data.explanationBlockId === 'string' && data.explanationBlockId.trim()
            ? data.explanationBlockId
            : null;
        setLessons((prev) =>
          prev.map((lesson) =>
            lesson.lessonId === data.lessonId
              ? {
                  ...lesson,
                  simulationEmbedUrl: data.embedCleared ? null : lesson.simulationEmbedUrl ?? null,
                  simulationRepoName: data.embedCleared ? null : lesson.simulationRepoName ?? null,
                  explanations: targetExplanationId
                    ? (lesson.explanations ?? []).map((explanation) =>
                        explanation.id === targetExplanationId
                          ? {
                              ...explanation,
                              linkedDiagramEmbedUrl: data.embedCleared
                                ? null
                                : explanation.linkedDiagramEmbedUrl ?? null,
                            }
                          : explanation
                      )
                    : lesson.explanations,
                }
              : lesson
          )
        );
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    } finally {
      setActionStatus('idle');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Admin</p>
          <h1 className="mt-2 text-2xl font-semibold">Explanation Visuals + Simulation Linker</h1>
          <p className="mt-2 text-sm text-slate-600">
            Generate one visual prompt for a specific explanation section, then clone/link a GitHub simulation into
            <code className="ml-1">src/simulations</code> and attach its <code>embedUrl</code> right after that explanation.
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Lesson</span>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={lessonId}
                onChange={(event) => setLessonId(event.target.value)}
                disabled={isLoadingLessons || isSubmitting}
              >
                {lessons.map((lesson) => (
                  <option key={lesson.lessonId} value={lesson.lessonId}>
                    {lesson.lessonId} - {lesson.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">GitHub Repo URL</span>
              <input
                type="url"
                value={repoUrl}
                onChange={(event) => setRepoUrl(event.target.value)}
                placeholder="https://github.com/owner/repo.git"
                className="rounded-lg border border-slate-300 px-3 py-2"
                disabled={isSubmitting}
                required
              />
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Placement Target</span>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={placementMode}
                onChange={(event) => setPlacementMode(event.target.value as PlacementMode)}
                disabled={isLoadingLessons || isSubmitting}
              >
                <option value="below-explanation">Below explanation block</option>
                <option value="main-diagram">Main diagram area</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Explanation Section</span>
              <select
                className="rounded-lg border border-slate-300 px-3 py-2"
                value={explanationBlockId}
                onChange={(event) => setExplanationBlockId(event.target.value)}
                disabled={
                  placementMode !== 'below-explanation' ||
                  isLoadingLessons ||
                  isSubmitting ||
                  selectedExplanations.length === 0
                }
              >
                {selectedExplanations.map((explanation) => (
                  <option key={explanation.id} value={explanation.id}>
                    {explanation.id} - {explanation.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <p>
              Selected lesson: <strong>{selectedLesson ? `${selectedLesson.lessonId} - ${selectedLesson.title}` : 'None selected'}</strong>
            </p>
            <p>
              Placement target:{' '}
              <strong>
                {placementMode === 'below-explanation' ? 'Below explanation block' : 'Main diagram area'}
              </strong>
            </p>
            {placementMode === 'below-explanation' && (
              <p>
                Selected explanation:{' '}
                <strong>
                  {selectedExplanation ? `${selectedExplanation.id} - ${selectedExplanation.title}` : 'No explanation selected'}
                </strong>
              </p>
            )}
            <p>
              Current simulation repo: <strong>{selectedRepo ?? 'No repo linked'}</strong>
            </p>
            {selectedEmbedUrl && (
              <p>
                Current embed URL: <code>{selectedEmbedUrl}</code>
              </p>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onGenerateVisualPrompts}
                disabled={
                  placementMode !== 'below-explanation' ||
                  isGeneratingPrompts ||
                  isSubmitting ||
                  !lessonId ||
                  !explanationBlockId
                }
                className="rounded-lg bg-violet-700 px-4 py-2 text-sm font-medium text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGeneratingPrompts ? 'Generating Visual Prompt...' : 'Generate Visual Prompt'}
              </button>
              {visualPromptModel && <span className="text-xs text-slate-600">Model: {visualPromptModel}</span>}
            </div>
            {placementMode !== 'below-explanation' && (
              <p className="mt-2 text-sm text-slate-600">
                Visual prompt generation is tied to explanation content. Switch placement target to "Below explanation block" to use it.
              </p>
            )}
            {visualPromptError && <p className="mt-2 text-sm font-medium text-red-700">{visualPromptError}</p>}
            {visualPrompts.length > 0 && (
              <div className="mt-3 space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  Explanation target: {selectedExplanation ? `${selectedExplanation.id} - ${selectedExplanation.title}` : 'Unknown'}
                </p>
                {visualPrompts.map((concept, index) => (
                  <div key={`${concept.conceptTitle}-${index}`} className="rounded-md border border-slate-200 bg-white p-3">
                    <p className="text-sm font-semibold text-slate-800">
                      Prompt for {selectedExplanation?.id ?? 'explanation'}: {concept.conceptTitle}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      <span className="font-medium">Diagram:</span> {concept.diagramPrompt}
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      <span className="font-medium">Animation:</span> {concept.animationPrompt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-medium">Embed Path (optional)</span>
              <input
                type="text"
                value={embedPath}
                onChange={(event) => setEmbedPath(event.target.value)}
                placeholder="Leave blank to auto-detect (recommended)"
                className="rounded-lg border border-slate-300 px-3 py-2"
                disabled={isSubmitting}
              />
            </label>

            <label className="mt-7 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(event) => setOverwrite(event.target.checked)}
                disabled={isSubmitting}
              />
              Overwrite existing simulation folder if present
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <button
              type="submit"
              disabled={isSubmitting || isLoadingLessons}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionStatus === 'cloning' ? 'Cloning + Linking...' : 'Clone + Attach to Explanation'}
            </button>
            <button
              type="button"
              onClick={onUpdateRepo}
              disabled={isSubmitting || isLoadingLessons}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionStatus === 'updating' ? 'Updating...' : 'Update Repo'}
            </button>
            <button
              type="button"
              onClick={onDeleteRepo}
              disabled={isSubmitting || isLoadingLessons}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {actionStatus === 'deleting' ? 'Deleting...' : 'Delete Repo'}
            </button>
          </div>

          {error && <p className="text-sm font-medium text-red-700">{error}</p>}
        </form>

        {result?.success && (
          <section className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-sm text-emerald-900">
            <p className="font-semibold">
              {result.deleted ? 'Simulation repo delete completed.' : 'Updated lesson iframe successfully.'}
            </p>
            <p className="mt-2">
              Lesson: <strong>{result.lessonId}</strong>
              {selectedLessonTitle ? ` (${selectedLessonTitle})` : ''}
            </p>
            {result.explanationBlockId && (
              <p>
                Explanation block: <code>{result.explanationBlockId}</code>
              </p>
            )}
            {result.diagramBlockId && (
              <p>
                Diagram block: <code>{result.diagramBlockId}</code>
              </p>
            )}
            {result.embedUrl && <p>Embed URL: <code>{result.embedUrl}</code></p>}
            {typeof result.embedCleared === 'boolean' && (
              <p>Embed link cleared: <code>{String(result.embedCleared)}</code></p>
            )}
            {result.repo?.path && <p>Repo path: <code>{result.repo.path}</code></p>}
            {result.message && <p>{result.message}</p>}
            <a
              className="mt-3 inline-block rounded-md border border-emerald-500 px-3 py-1.5 font-medium hover:bg-emerald-100"
              href={courseHref(`/learn/${result.lessonId ?? ''}`)}
            >
              Open lesson
            </a>
          </section>
        )}
      </div>
    </main>
  );
}
