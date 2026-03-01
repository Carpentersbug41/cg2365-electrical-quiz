import { NextResponse } from 'next/server';
import { basename, join } from 'node:path';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { Lesson } from '@/data/lessons/types';
import { getCurriculumScopeFromHeaderOrReferer, isLessonIdAllowedForScope } from '@/lib/routing/curriculumScope';

const LESSONS_DIR = join(process.cwd(), 'src', 'data', 'lessons');

type UpsertRequestBody = {
  filename?: string;
  enabled?: boolean;
  questionCount?: number;
  startLevel?: number;
};

function collectLessonJsonFiles(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectLessonJsonFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

function sanitizeLessonFilename(filename: unknown): string | null {
  if (typeof filename !== 'string') return null;
  const cleaned = filename.replace(/[^a-zA-Z0-9\-\.]/g, '');
  if (!cleaned.endsWith('.json')) return null;
  if (cleaned.includes('/') || cleaned.includes('\\')) return null;
  return cleaned;
}

function findLessonPathByFilename(filename: string): string | null {
  const files = collectLessonJsonFiles(LESSONS_DIR);
  const match = files.find((filePath) => basename(filePath) === filename);
  return match ?? null;
}

function clampQuestionCount(value: number): number {
  return Math.max(8, Math.min(10, Math.round(value)));
}

function clampStartLevel(value: number): 1 | 2 | 3 | 4 {
  const clamped = Math.max(1, Math.min(4, Math.round(value)));
  if (clamped === 1 || clamped === 2 || clamped === 3 || clamped === 4) return clamped;
  return 1;
}

function computeSocraticOrder(lesson: Lesson): number {
  const integrativeBlock = lesson.blocks.find((block) => {
    if (block.type !== 'practice') return false;
    const content = block.content as { mode?: string; title?: string };
    const mode = String(content.mode ?? '').toLowerCase();
    const title = String(content.title ?? '').toLowerCase();
    return mode === 'integrative' || title.includes('putting it all together');
  });

  const foundationCheckBlock = lesson.blocks.find((block) => block.type === 'spaced-review');

  let candidate: number;

  if (integrativeBlock && foundationCheckBlock && foundationCheckBlock.order > integrativeBlock.order) {
    candidate = Math.round(((integrativeBlock.order + foundationCheckBlock.order) / 2) * 1000) / 1000;
  } else if (foundationCheckBlock) {
    candidate = Math.round((foundationCheckBlock.order - 0.1) * 1000) / 1000;
  } else {
    const maxOrder = lesson.blocks.reduce((max, block) => Math.max(max, block.order), 0);
    candidate = Math.round((maxOrder + 0.1) * 1000) / 1000;
  }

  const occupiedOrders = new Set(lesson.blocks.map((block) => Math.round(block.order * 1000) / 1000));
  while (occupiedOrders.has(candidate)) {
    candidate = Math.round((candidate + 0.001) * 1000) / 1000;
  }

  return candidate;
}

export async function POST(request: Request) {
  try {
    const scope = getCurriculumScopeFromHeaderOrReferer(
      request.headers.get('x-course-prefix'),
      request.headers.get('referer')
    );
    const body = (await request.json()) as UpsertRequestBody;

    const sanitizedFilename = sanitizeLessonFilename(body.filename);
    if (!sanitizedFilename) {
      return NextResponse.json({ success: false, error: 'Invalid filename.' }, { status: 400 });
    }

    const lessonPath = findLessonPathByFilename(sanitizedFilename);
    if (!lessonPath) {
      return NextResponse.json({ success: false, error: 'Lesson file not found.' }, { status: 404 });
    }

    const lesson = JSON.parse(readFileSync(lessonPath, 'utf8')) as Lesson;
    if (!isLessonIdAllowedForScope(lesson.id, scope)) {
      return NextResponse.json(
        { success: false, error: `Lesson ${lesson.id} is not available in this curriculum scope.` },
        { status: 403 }
      );
    }

    lesson.blocks = lesson.blocks.filter((block) => block.type !== 'socratic');

    const enabled = Boolean(body.enabled);
    if (enabled) {
      const questionCount = clampQuestionCount(Number(body.questionCount ?? 8));
      const startLevel = clampStartLevel(Number(body.startLevel ?? 1));
      const order = computeSocraticOrder(lesson);
      lesson.blocks.push({
        id: `${lesson.id}-socratic`,
        type: 'socratic',
        order,
        content: {
          title: 'Socratic Voice Questions',
          description: 'Adaptive end-of-lesson Socratic oral check.',
          enabled: true,
          questionCount,
          startLevel,
          allowVoiceInput: true,
          allowVoiceOutput: true,
        },
      });
      lesson.blocks.sort((a, b) => a.order - b.order);
    }

    lesson.metadata.updated = new Date().toISOString().slice(0, 10);
    if (lesson.metadata.version) {
      const parts = lesson.metadata.version.split('.');
      parts[1] = String((Number(parts[1]) || 0) + 1);
      lesson.metadata.version = parts.join('.');
    }

    writeFileSync(lessonPath, JSON.stringify(lesson, null, 2));

    const socraticBlock = lesson.blocks.find((block) => block.type === 'socratic');
    return NextResponse.json({
      success: true,
      enabled: Boolean(socraticBlock),
      socratic: socraticBlock ? socraticBlock.content : null,
      order: socraticBlock?.order ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
