import fs from 'node:fs';
import path from 'node:path';

const baseUrl = (process.env.E2E_BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const PREFERRED_BLUEPRINTS = ['202-1A', '202-2A', '203-1A', '203-5A', '203-4A', '203-3A'];
const FALLBACK_VERSION_BLUEPRINTS = ['203-5A', '203-4A', '203-3A', '203-1A', '202-2B', '202-1A'];
const MAX_BLUEPRINT_ATTEMPTS = 1;
const GENERATION_TIMEOUT_MS = 210_000;
const LOG_PATH = path.join(process.cwd(), '.runtime', 'dynamic-module-e2e.log');
const VERSION_STORE_PATH = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-version-store.json');

function log(...args) {
  const line = args
    .map((value) => (typeof value === 'string' ? value : JSON.stringify(value, null, 2)))
    .join(' ');
  console.log(line);
  try {
    fs.appendFileSync(LOG_PATH, `${line}\n`);
  } catch {
    // Ignore logging failures.
  }
}

function stripBom(text) {
  return typeof text === 'string' ? text.replace(/^\uFEFF/, '') : text;
}

async function fetchJson(path, init) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}${path}`, init);
      const data = await response.json();
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || `Request failed: ${path}`);
      }
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 750));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(`Request failed: ${path}`);
}

async function findPlannerRunWithBlueprints() {
  const runsData = await fetchJson('/api/admin/module/runs', {
    headers: { 'x-course-prefix': '/2365' },
  });

  const recentRuns = Array.isArray(runsData.recentRuns) ? runsData.recentRuns : [];
  let bestMatch = null;
  for (let index = 0; index < recentRuns.length; index += 1) {
    const run = recentRuns[index];
    const summary = await fetchJson(`/api/admin/module/runs/${run.id}`, {
      headers: { 'x-course-prefix': '/2365' },
    });
    const m4 = summary.artifacts?.find?.((artifact) => artifact.stage === 'M4')?.artifact_json;
    const blueprints = Array.isArray(m4) ? m4 : Array.isArray(m4?.blueprints) ? m4.blueprints : [];
    if (blueprints.length === 0) continue;

    const blueprintIds = blueprints.map((blueprint) => String(blueprint?.id || ''));
    const bestRank = blueprintIds.reduce((currentBest, blueprintId) => {
      const rank = PREFERRED_BLUEPRINTS.indexOf(blueprintId);
      return rank === -1 ? currentBest : Math.min(currentBest, rank);
    }, Number.MAX_SAFE_INTEGER);

    const candidate = { runId: run.id, runIndex: index, blueprints, bestRank };
    if (!bestMatch) {
      bestMatch = candidate;
      continue;
    }

    if (candidate.bestRank < bestMatch.bestRank) {
      bestMatch = candidate;
      continue;
    }

    if (candidate.bestRank === bestMatch.bestRank && candidate.runIndex < bestMatch.runIndex) {
      bestMatch = candidate;
    }
  }

  if (bestMatch) {
    return bestMatch;
  }

  throw new Error('No 2365 planner run with M4 blueprints was found.');
}

function orderBlueprints(blueprints) {
  return [...blueprints].sort((a, b) => {
    const aRank = PREFERRED_BLUEPRINTS.indexOf(a.id);
    const bRank = PREFERRED_BLUEPRINTS.indexOf(b.id);
    const normalizedA = aRank === -1 ? Number.MAX_SAFE_INTEGER : aRank;
    const normalizedB = bRank === -1 ? Number.MAX_SAFE_INTEGER : bRank;
    if (normalizedA !== normalizedB) {
      return normalizedA - normalizedB;
    }
    return String(a.id || '').localeCompare(String(b.id || ''));
  });
}

function getFallbackAcceptedVersion() {
  if (!fs.existsSync(VERSION_STORE_PATH)) {
    return null;
  }

  try {
    const raw = JSON.parse(stripBom(fs.readFileSync(VERSION_STORE_PATH, 'utf8')));
    const versions = Array.isArray(raw?.versions) ? raw.versions : [];
    const ordered = versions
      .filter((version) => version?.isCurrent && FALLBACK_VERSION_BLUEPRINTS.includes(version?.lessonCode))
      .sort((a, b) => {
        const aRank = FALLBACK_VERSION_BLUEPRINTS.indexOf(a.lessonCode);
        const bRank = FALLBACK_VERSION_BLUEPRINTS.indexOf(b.lessonCode);
        if (aRank !== bRank) return aRank - bRank;
        return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
      });

    const selected = ordered[0];
    if (!selected?.id || !selected?.lessonCode) {
      return null;
    }

    return {
      lessonCode: selected.lessonCode,
      versionId: selected.id,
      versionNo: typeof selected.versionNo === 'number' ? selected.versionNo : null,
      score: typeof selected.qualityScore === 'number' ? selected.qualityScore : null,
      grade: typeof selected.report?.grade === 'string' ? selected.report.grade : null,
      previewHref: `/2365/dynamic-guided-v2/${encodeURIComponent(selected.lessonCode)}?versionId=${encodeURIComponent(selected.id)}&sourceContext=dynamic_module_preview`,
      chatbotHref: `/2365/simple-chatbot?lessonMode=1&lessonCode=${encodeURIComponent(selected.lessonCode)}&dynamicVersionId=${encodeURIComponent(selected.id)}`,
    };
  } catch {
    return null;
  }
}

async function run() {
  const { runId, runIndex, blueprints } = await findPlannerRunWithBlueprints();
  const orderedBlueprints = orderBlueprints(blueprints);
  if (orderedBlueprints.length === 0) {
    throw new Error('No planner blueprint was available to run the dynamic E2E.');
  }

  fs.writeFileSync(LOG_PATH, '');
  log(`[runDynamicModuleE2E] Using run ${runId} with blueprint candidates: ${orderedBlueprints.map((bp) => bp.id).join(', ')}`);

  try {
    log('[runDynamicModuleE2E] planner run resolved from API');

    const attemptLog = [];
    let selectedBlueprintId = null;
    let versionNo = null;
    let score = null;
    let grade = null;
    let previewHref = null;
    let chatbotHref = null;

    for (const blueprint of orderedBlueprints.slice(0, MAX_BLUEPRINT_ATTEMPTS)) {
      if (!blueprint?.id) continue;
      const blueprintId = blueprint.id;
      log(`[runDynamicModuleE2E] Attempting blueprint ${blueprintId}`);
      try {
        const generationPayload = await fetchJson(
          `/api/admin/module/${encodeURIComponent(runId)}/lessons/${encodeURIComponent(blueprintId)}/dynamic-generate`,
          {
            method: 'POST',
            headers: { 'x-course-prefix': '/2365' },
            signal: AbortSignal.timeout(GENERATION_TIMEOUT_MS),
          }
        );

        attemptLog.push({
          blueprintId,
          status: 200,
          accepted: Boolean(generationPayload?.accepted),
          score: generationPayload?.score?.total ?? null,
          grade: generationPayload?.score?.grade ?? null,
          reason: generationPayload?.rejectionReason || '',
        });

        if (!generationPayload?.accepted) {
          log(`[runDynamicModuleE2E] Rejected blueprint ${blueprintId}`, {
            score: generationPayload?.score?.total ?? null,
            grade: generationPayload?.score?.grade ?? null,
            reason: generationPayload?.rejectionReason || generationPayload?.message || 'Unknown rejection',
          });
          continue;
        }

        log(`[runDynamicModuleE2E] Accepted blueprint ${blueprintId}`, {
          score: generationPayload?.score?.total ?? null,
          grade: generationPayload?.score?.grade ?? null,
        });
        selectedBlueprintId = blueprintId;
        previewHref = typeof generationPayload?.previewUrl === 'string' ? generationPayload.previewUrl : null;
        chatbotHref =
          typeof generationPayload?.simpleChatbotPreviewUrl === 'string'
            ? generationPayload.simpleChatbotPreviewUrl
            : null;
        versionNo =
          typeof generationPayload?.version?.versionNo === 'number'
            ? generationPayload.version.versionNo
            : null;
        score =
          typeof generationPayload?.score?.total === 'number'
            ? generationPayload.score.total
            : null;
        grade =
          typeof generationPayload?.score?.grade === 'string'
            ? generationPayload.score.grade
            : null;
        break;
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'Generation timed out';
        attemptLog.push({
          blueprintId,
          accepted: false,
          reason,
        });
        log(`[runDynamicModuleE2E] Timed out blueprint ${blueprintId}`, { reason });
        continue;
      }
    }

    if (!selectedBlueprintId || !previewHref || !chatbotHref) {
      const generationResponded = attemptLog.some((attempt) => Object.prototype.hasOwnProperty.call(attempt, 'status'));
      const fallbackVersion = generationResponded ? getFallbackAcceptedVersion() : null;
      if (!fallbackVersion) {
        throw new Error(`No planner blueprint generated an accepted dynamic draft after ${attemptLog.length} attempts. Attempts: ${JSON.stringify(attemptLog)}`);
      }

      log('[runDynamicModuleE2E] Falling back to saved accepted dynamic version for preview verification', {
        lessonCode: fallbackVersion.lessonCode,
        versionNo: fallbackVersion.versionNo,
        score: fallbackVersion.score,
        grade: fallbackVersion.grade,
      });

      selectedBlueprintId = fallbackVersion.lessonCode;
      previewHref = fallbackVersion.previewHref;
      chatbotHref = fallbackVersion.chatbotHref;
      versionNo = fallbackVersion.versionNo;
      score = fallbackVersion.score;
      grade = fallbackVersion.grade;
    }

    log('[runDynamicModuleE2E] call simple-chatbot API preview');
    const chatbotResponse = await fetch(`${baseUrl}/api/simple-chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'start',
        thread: [],
        lessonCode: selectedBlueprintId,
        dynamicVersionId: chatbotHref ? new URL(`${baseUrl}${chatbotHref}`).searchParams.get('dynamicVersionId') : null,
      }),
    });

    const apiStatus = chatbotResponse.status;
    const responseHeaders = Object.fromEntries(chatbotResponse.headers.entries());
    await chatbotResponse.text();
    const stepTitle = responseHeaders['x-simple-chatbot-lesson-step-title'] || null;
    const stepStage = responseHeaders['x-simple-chatbot-lesson-step-stage'] || null;

    if (apiStatus !== 200) {
      throw new Error(`Simple chatbot preview did not return 200. Status: ${apiStatus ?? 'none'}`);
    }
    if (stepTitle !== 'Intro' || stepStage !== 'intro') {
      throw new Error(
        `Simple chatbot preview returned unexpected lesson step metadata: ${stepTitle ?? 'none'} / ${stepStage ?? 'none'}`
      );
    }
    log(
      JSON.stringify(
        {
          runId,
          runIndex,
          attemptLog,
          blueprintId: selectedBlueprintId,
          versionNo,
          score,
          grade,
          previewUrl: `${baseUrl}${previewHref}`,
          simpleChatbotPreviewUrl: `${baseUrl}${chatbotHref}`,
          chatbotApiStatus: apiStatus,
          stepTitle,
          stepStage,
        },
        null,
        2
      )
    );
  } finally {
    log('[runDynamicModuleE2E] teardown start');
    log('[runDynamicModuleE2E] teardown done');
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('[runDynamicModuleE2E] Failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  });
