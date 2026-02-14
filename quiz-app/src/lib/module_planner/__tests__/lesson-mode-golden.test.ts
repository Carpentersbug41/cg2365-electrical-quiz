import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const writtenLessons = new Map<string, unknown>();

function scoreForRequest(unit: number, lessonId: string): number {
  const seed = unit + lessonId.charCodeAt(0) + lessonId.charCodeAt(lessonId.length - 1);
  return 88 + (seed % 12);
}

vi.mock('@/lib/generation/rateLimiter', () => ({
  globalRateLimiter: {
    getIdentifier: () => 'test-id',
    checkLimit: () => ({ allowed: true, remaining: 5, resetTime: Date.now() + 60000 }),
  },
}));

vi.mock('@/lib/generation/errorHandler', () => ({
  ErrorHandler: class {
    validateEnvironment() {
      return { valid: true, errors: [] as string[] };
    }

    async rollbackAll() {
      return;
    }

    logGenerationAttempt() {
      return;
    }

    handleApiError(error: unknown) {
      return {
        status: 500,
        message: error instanceof Error ? error.message : 'Unknown test error',
      };
    }
  },
}));

vi.mock('@/lib/generation/validationService', () => ({
  ValidationService: class {
    validateLesson() {
      return { valid: true, errors: [] as string[], warnings: [] as string[] };
    }

    validateQuiz() {
      return { valid: true, errors: [] as string[], warnings: [] as string[] };
    }
  },
}));

vi.mock('@/lib/generation/fileIntegrator', () => ({
  FileIntegrator: class {
    async integrateAllFiles(_body: unknown, lessonFilename: string, quizFilename: string) {
      return {
        success: true,
        filesUpdated: [lessonFilename, quizFilename],
        errors: [] as string[],
      };
    }
  },
}));

vi.mock('@/lib/generation/gitService', () => ({
  GitService: class {
    async isGitConfigured() {
      return false;
    }

    async commitAndPush() {
      return { success: false, error: 'git disabled in test', commitHash: '', commitUrl: '' };
    }
  },
}));

vi.mock('@/lib/generation/fileGenerator', () => ({
  FileGenerator: class {
    async generateLesson(request: { unit: number; lessonId: string; topic: string }) {
      const lessonId = `${request.unit}-${request.lessonId}`;
      const score = scoreForRequest(request.unit, request.lessonId);
      return {
        success: true,
        content: {
          id: lessonId,
          title: request.topic,
          description: `Golden lesson for ${lessonId}`,
          layout: 'split-vis',
          unit: `Unit ${request.unit}`,
          topic: request.topic,
          learningOutcomes: ['LO-test'],
          prerequisites: [],
          blocks: [],
          metadata: {
            created: '2026-02-12',
            updated: '2026-02-12',
            version: '1.0.0',
            author: 'golden-test',
          },
        },
        refinementMetadata: {
          wasRefined: true,
          originalScore: score - 2,
          finalScore: score,
          patchesApplied: 1,
          details: [],
        },
      };
    }

    async generateQuiz(request: { unit: number; lessonId: string }) {
      const id = `${request.unit}-${request.lessonId}`;
      return {
        success: true,
        questions: [
          {
            id: 1,
            question: `Q for ${id}`,
            options: ['A', 'B', 'C', 'D'],
            correctAnswer: 0,
            section: 'test',
            category: 'test',
            tags: ['golden'],
            learningOutcomeId: 'LO-test',
            answerType: 'mcq',
            difficulty: 1,
            estimatedTime: 30,
            explanation: 'Because test',
          },
        ],
      };
    }

    async writeLessonFile(request: { unit: number; lessonId: string }, lesson: unknown) {
      const key = `${request.unit}-${request.lessonId}`;
      writtenLessons.set(key, JSON.parse(JSON.stringify(lesson)));
      return `C:\\tmp\\${key}.json`;
    }

    async writeQuizFile(request: { unit: number; lessonId: string }) {
      const key = `${request.unit}-${request.lessonId}`;
      return `C:\\tmp\\${key}Questions.ts`;
    }
  },
}));

import { POST as lessonGeneratorPost } from '@/app/api/lesson-generator/route';

const GOLDEN_INPUTS = [
  { unit: 201, lessonId: '1A', topic: 'Golden Topic 1', section: 'Health and Safety 2365 Level 2' },
  { unit: 201, lessonId: '1B', topic: 'Golden Topic 2', section: 'Health and Safety 2365 Level 2' },
  { unit: 202, lessonId: '1A', topic: 'Golden Topic 3', section: 'Science 2365 Level 2' },
  { unit: 202, lessonId: '3A', topic: 'Golden Topic 4', section: 'Science 2365 Level 2' },
  { unit: 202, lessonId: '5B', topic: 'Golden Topic 5', section: 'Science 2365 Level 2' },
  { unit: 203, lessonId: '1A', topic: 'Golden Topic 6', section: 'Installation 2365 Level 2' },
  { unit: 203, lessonId: '2B', topic: 'Golden Topic 7', section: 'Installation 2365 Level 2' },
  { unit: 204, lessonId: '1A', topic: 'Golden Topic 8', section: 'Wiring Systems 2365 Level 2' },
  { unit: 204, lessonId: '2A', topic: 'Golden Topic 9', section: 'Wiring Systems 2365 Level 2' },
  { unit: 210, lessonId: '1A', topic: 'Golden Topic 10', section: 'Communication 2365 Level 2' },
  { unit: 305, lessonId: '1A', topic: 'Golden Topic 11', section: 'Advanced Safety 2365 Level 3' },
  { unit: 305, lessonId: '2A', topic: 'Golden Topic 12', section: 'Advanced Safety 2365 Level 3' },
];

function sanitizeSnapshotValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => sanitizeSnapshotValue(item));
  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      if (key === 'generatedAt' && typeof nested === 'string') {
        output[key] = '<generated-at>';
      } else {
        output[key] = sanitizeSnapshotValue(nested);
      }
    }
    return output;
  }
  return value;
}

describe('lesson mode golden regression', () => {
  beforeEach(() => {
    writtenLessons.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('keeps lesson mode API output stable for 12 golden inputs', async () => {
    const snapshots: unknown[] = [];

    for (const input of GOLDEN_INPUTS) {
      const request = new Request('http://localhost:3000/api/lesson-generator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(input),
      });

      const responsePromise = lessonGeneratorPost(request as never);
      await vi.runAllTimersAsync();
      const response = await responsePromise;
      const payload = (await response.json()) as Record<string, unknown>;
      const lessonKey = `${input.unit}-${input.lessonId}`;

      snapshots.push({
        request: input,
        status: response.status,
        response: sanitizeSnapshotValue(payload),
        lessonJson: sanitizeSnapshotValue(writtenLessons.get(lessonKey)),
      });
    }

    expect(snapshots).toMatchSnapshot();
  });
});
