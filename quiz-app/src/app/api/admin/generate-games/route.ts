import { NextResponse } from 'next/server';
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { generateMicrobreaksForLesson, findMicrobreakSlots } from '@/lib/generation/gameGenerator';
import { Lesson, GameType } from '@/data/lessons/types';

const LESSONS_DIR = join(process.cwd(), 'src', 'data', 'lessons');

const ALL_SUPPORTED_GAME_TYPES: GameType[] = [
  'matching',
  'sorting',
  'spot-error',
  'tap-label',
  'quick-win',
  'sequencing',
  'fill-gap',
  'is-correct-why',
  'diagnosis-ranked',
  'classify-two-bins',
  'scenario-match',
  'formula-build',
  'tap-the-line',
  'tap-the-word',
  'elimination'
];

type GenerationMode = 'auto' | 'manual';
type OperationMode = 'preview' | 'save';

function isGenerationMode(value: unknown): value is GenerationMode {
  return value === 'auto' || value === 'manual';
}

function isOperationMode(value: unknown): value is OperationMode {
  return value === 'preview' || value === 'save';
}

function sanitizeLessonFilename(filename: unknown): string | null {
  if (typeof filename !== 'string') return null;

  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9\-\.]/g, '');
  if (!sanitizedFilename.endsWith('.json')) return null;
  if (sanitizedFilename.includes('/') || sanitizedFilename.includes('\\')) return null;
  return sanitizedFilename;
}

/**
 * GET /api/admin/generate-games
 * Returns list of all lessons with microbreak status
 */
export async function GET() {
  try {
    const files = readdirSync(LESSONS_DIR).filter(f => f.endsWith('.json') && f !== 'lessonIndex.ts');

    const lessons = files.map(filename => {
      try {
        const lessonPath = join(LESSONS_DIR, filename);
        const lessonData = readFileSync(lessonPath, 'utf-8');
        const lesson: Lesson = JSON.parse(lessonData);

        const microbreakCount = lesson.blocks.filter(b => b.type === 'microbreak').length;

        const vocabBlocks = lesson.blocks.filter(b => b.type === 'vocab');
        const vocabTermCount = vocabBlocks.reduce((sum, block) => {
          const content = block.content as { terms?: { term: string; definition: string }[] };
          return sum + (content.terms?.length || 0);
        }, 0);

        const explanationCount = lesson.blocks.filter(b => b.type === 'explanation').length;
        const availableMicrobreakSlots = findMicrobreakSlots(lesson.blocks).length;

        return {
          id: lesson.id,
          filename,
          title: lesson.title,
          unit: lesson.unit,
          description: lesson.description,
          microbreakCount,
          hasVocab: vocabTermCount > 0,
          vocabTermCount,
          hasExplanations: explanationCount > 0,
          explanationCount,
          totalBlocks: lesson.blocks.length,
          availableMicrobreakSlots,
        };
      } catch (error) {
        console.error(`Error loading lesson ${filename}:`, error);
        return null;
      }
    }).filter(Boolean);

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Error scanning lessons:', error);
    return NextResponse.json(
      { error: 'Failed to scan lessons directory' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/generate-games
 * Generates and optionally saves microbreak games for a lesson
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const legacyMode = body?.mode;
    const operation: OperationMode = isOperationMode(body?.operation)
      ? body.operation
      : (isOperationMode(legacyMode) ? legacyMode : 'preview');

    const generationMode: GenerationMode = isGenerationMode(body?.mode)
      ? body.mode
      : 'auto';

    const filename = body?.filename;
    const allowedGameTypes = Array.isArray(body?.allowedGameTypes)
      ? body.allowedGameTypes
      : (Array.isArray(body?.gameTypes) ? body.gameTypes : []);

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return NextResponse.json(
        {
          error: 'Server configuration error',
          details: 'GEMINI_API_KEY environment variable is not configured. Please add it to your .env file.'
        },
        { status: 500 }
      );
    }

    if (!filename) {
      return NextResponse.json(
        { error: 'filename is required' },
        { status: 400 }
      );
    }

    if (generationMode === 'manual' && (!Array.isArray(allowedGameTypes) || allowedGameTypes.length === 0)) {
      return NextResponse.json(
        { error: 'In manual mode, allowedGameTypes must contain at least one game type.' },
        { status: 400 }
      );
    }

    const sanitizedFilename = sanitizeLessonFilename(filename);
    if (!sanitizedFilename) {
      return NextResponse.json(
        { error: 'Invalid filename format' },
        { status: 400 }
      );
    }

    const lessonPath = join(LESSONS_DIR, sanitizedFilename);

    let lesson: Lesson;
    try {
      const lessonData = readFileSync(lessonPath, 'utf-8');
      lesson = JSON.parse(lessonData);
    } catch {
      return NextResponse.json(
        { error: `Lesson file not found: ${sanitizedFilename}` },
        { status: 404 }
      );
    }

    try {
      const slotCount = findMicrobreakSlots(lesson.blocks).length;
      const pool = generationMode === 'manual'
        ? (allowedGameTypes as GameType[])
        : ALL_SUPPORTED_GAME_TYPES;

      if (slotCount === 0) {
        return NextResponse.json({
          success: true,
          [operation === 'preview' ? 'preview' : 'saved']: operation === 'preview' ? true : false,
          slotCount,
          gamesPlanned: 0,
          allowedPoolUsed: {
            count: pool.length,
            gameTypes: pool,
          },
          generatedCount: 0,
          modeUsed: generationMode,
          games: []
        });
      }

      const games = await generateMicrobreaksForLesson(lesson, {
        gameTypes: pool,
      });

      if (operation === 'preview') {
        return NextResponse.json({
          success: true,
          preview: true,
          slotCount,
          gamesPlanned: slotCount,
          allowedPoolUsed: {
            count: pool.length,
            gameTypes: pool,
          },
          generatedCount: games.length,
          modeUsed: generationMode,
          games: games.map(g => ({
            id: g.id,
            type: g.type,
            order: g.order,
            content: g.content
          }))
        });
      }

      lesson.blocks.push(...games);
      lesson.blocks.sort((a, b) => a.order - b.order);

      lesson.metadata.updated = new Date().toISOString().split('T')[0];
      if (lesson.metadata.version) {
        const versionParts = lesson.metadata.version.split('.');
        versionParts[1] = String(parseInt(versionParts[1] || '0') + 1);
        lesson.metadata.version = versionParts.join('.');
      }

      writeFileSync(lessonPath, JSON.stringify(lesson, null, 2));

      return NextResponse.json({
        success: true,
        saved: true,
        lessonPath: lessonPath.replace(process.cwd(), ''),
        slotCount,
        gamesPlanned: slotCount,
        allowedPoolUsed: {
          count: pool.length,
          gameTypes: pool,
        },
        generatedCount: games.length,
        modeUsed: generationMode,
        gamesAdded: games.length,
        games: games.map(g => ({
          id: g.id,
          type: g.type,
          order: g.order,
          content: g.content
        }))
      });
    } catch (error) {
      console.error('Game generation error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('Request params:', {
        filename,
        operation,
        mode: generationMode,
        allowedGameTypes
      });

      return NextResponse.json(
        {
          error: 'Failed to generate games',
          details: error instanceof Error ? error.message : 'Unknown error',
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined,
          requestInfo: {
            filename,
            operation,
            mode: generationMode,
            allowedGameTypes
          }
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Request handling error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return NextResponse.json(
      {
        error: 'Invalid request',
        details: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/admin/generate-games
 * Deletes all microbreak games from a lesson file
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const filename = body?.filename;

    if (!filename) {
      return NextResponse.json(
        { error: 'filename is required' },
        { status: 400 }
      );
    }

    const sanitizedFilename = sanitizeLessonFilename(filename);
    if (!sanitizedFilename) {
      return NextResponse.json(
        { error: 'Invalid filename format' },
        { status: 400 }
      );
    }

    const lessonPath = join(LESSONS_DIR, sanitizedFilename);

    let lesson: Lesson;
    try {
      const lessonData = readFileSync(lessonPath, 'utf-8');
      lesson = JSON.parse(lessonData);
    } catch {
      return NextResponse.json(
        { error: `Lesson file not found: ${sanitizedFilename}` },
        { status: 404 }
      );
    }

    const previousGameCount = lesson.blocks.filter(b => b.type === 'microbreak').length;
    lesson.blocks = lesson.blocks.filter(b => b.type !== 'microbreak');
    const removedCount = previousGameCount;

    lesson.metadata.updated = new Date().toISOString().split('T')[0];
    if (lesson.metadata.version) {
      const versionParts = lesson.metadata.version.split('.');
      versionParts[1] = String(parseInt(versionParts[1] || '0') + 1);
      lesson.metadata.version = versionParts.join('.');
    }

    writeFileSync(lessonPath, JSON.stringify(lesson, null, 2));

    return NextResponse.json({
      success: true,
      deleted: true,
      lessonPath: lessonPath.replace(process.cwd(), ''),
      removedCount,
      previousGameCount,
      remainingGameCount: lesson.blocks.filter(b => b.type === 'microbreak').length,
    });
  } catch (error) {
    console.error('Delete games error:', error);
    return NextResponse.json(
      {
        error: 'Failed to delete games',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
