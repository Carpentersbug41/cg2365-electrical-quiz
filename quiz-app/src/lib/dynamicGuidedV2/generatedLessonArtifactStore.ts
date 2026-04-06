import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import type { DynamicLessonGenerationResult } from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import type { DynamicLessonVersionSummary } from '@/lib/dynamicGuidedV2/versionStore';

const ARTIFACT_ROOT = path.join(process.cwd(), '.runtime', 'dynamic-guided-v2-generated-lessons');

function ensureDir(dirPath: string): void {
  mkdirSync(dirPath, { recursive: true });
}

function sanitizeSegment(value: string): string {
  return value.replace(/[^a-z0-9._-]+/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

function stripBom(text: string): string {
  return text.replace(/^\uFEFF/, '');
}

function timestampFilePart(date = new Date()): string {
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const mi = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  return `${yyyy}${mm}${dd}-${hh}${mi}${ss}z`;
}

export function writeDynamicGeneratedLessonArtifact(input: {
  result: DynamicLessonGenerationResult;
  version?: DynamicLessonVersionSummary | null;
  sourceContext?: string | null;
  createdBy?: string | null;
}): {
  lessonDir: string;
  runFilePath: string;
  latestFilePath: string;
  statusFilePath: string;
} {
  const lessonCode = input.result.lesson.lessonCode;
  const lessonDir = path.join(ARTIFACT_ROOT, sanitizeSegment(lessonCode));
  ensureDir(lessonDir);

  const status = input.result.accepted ? 'accepted' : 'rejected';
  const stamp = timestampFilePart();
  const runFileName = `${stamp}-${status}.json`;
  const latestFileName = 'latest.json';
  const statusLatestFileName = `latest-${status}.json`;

  const payload = {
    lessonCode,
    exportedAt: new Date().toISOString(),
    accepted: input.result.accepted,
    refined: input.result.refined,
    rejectionReason: input.result.rejectionReason,
    sourceContext: input.sourceContext ?? null,
    createdBy: input.createdBy ?? null,
    version: input.version ?? null,
    score: input.result.score,
    planScore: input.result.planScore,
    fidelityScore: input.result.fidelityScore,
    validation: input.result.validation,
    fixPlan: input.result.fixPlan ?? null,
    lesson: input.result.lesson,
    candidateLesson: input.result.candidateLesson ?? null,
    candidateValidation: input.result.candidateValidation ?? null,
    candidateScore: input.result.candidateScore ?? null,
    postRepairScore: input.result.postRepairScore ?? null,
    repairSummary: input.result.repairSummary ?? null,
    phases: input.result.phases,
  };

  const runFilePath = path.join(lessonDir, runFileName);
  const latestFilePath = path.join(lessonDir, latestFileName);
  const statusFilePath = path.join(lessonDir, statusLatestFileName);

  const serialized = JSON.stringify(payload, null, 2);
  writeFileSync(runFilePath, serialized, 'utf8');
  writeFileSync(latestFilePath, serialized, 'utf8');
  writeFileSync(statusFilePath, serialized, 'utf8');

  return {
    lessonDir,
    runFilePath,
    latestFilePath,
    statusFilePath,
  };
}

export function readLatestDynamicGeneratedLessonArtifact(lessonCode: string): {
  lesson: DynamicGuidedV2Lesson;
  accepted: boolean;
  version: DynamicLessonVersionSummary | null;
} | null {
  const lessonDir = path.join(ARTIFACT_ROOT, sanitizeSegment(lessonCode));
  const latestFilePath = path.join(lessonDir, 'latest.json');
  if (!existsSync(latestFilePath)) {
    return null;
  }

  try {
    const raw = JSON.parse(stripBom(readFileSync(latestFilePath, 'utf8'))) as {
      lesson?: DynamicGuidedV2Lesson;
      accepted?: boolean;
      version?: DynamicLessonVersionSummary | null;
    };
    if (!raw.lesson) {
      return null;
    }
    return {
      lesson: raw.lesson,
      accepted: raw.accepted === true,
      version: raw.version ?? null,
    };
  } catch {
    return null;
  }
}

export function listDynamicGeneratedLessonArtifacts(): Array<{
  lessonCode: string;
  title: string | null;
  accepted: boolean;
}> {
  if (!existsSync(ARTIFACT_ROOT)) {
    return [];
  }

  return readdirSync(ARTIFACT_ROOT)
    .filter((entry) => {
      try {
        return statSync(path.join(ARTIFACT_ROOT, entry)).isDirectory();
      } catch {
        return false;
      }
    })
    .map((entry) => {
      const artifact = readLatestDynamicGeneratedLessonArtifact(entry);
      return {
        lessonCode: artifact?.lesson.lessonCode ?? entry.toUpperCase(),
        title: artifact?.lesson.title ?? null,
        accepted: artifact?.accepted === true,
      };
    })
    .sort((a, b) => a.lessonCode.localeCompare(b.lessonCode));
}
