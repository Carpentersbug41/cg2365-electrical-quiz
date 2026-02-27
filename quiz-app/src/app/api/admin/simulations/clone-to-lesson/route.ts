import { NextRequest, NextResponse } from 'next/server';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { findLessonFile } from '@/lib/generation/lessonDetector';

const execFileAsync = promisify(execFile);

type CloneRequestBody = {
  lessonId?: string;
  repoUrl?: string;
  embedPath?: string;
  overwrite?: boolean;
};

function parseGithubRepo(url: string): { owner: string; repo: string } | null {
  const match = url
    .trim()
    .match(/^https:\/\/github\.com\/([^/\s]+)\/([^/\s]+?)(?:\.git)?\/?$/i);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

function toPosixPath(value: string): string {
  return value.replace(/\\/g, '/');
}

function normalizeEmbedUrl(repo: string, embedPath?: string): string {
  if (!embedPath?.trim()) {
    return `/simulations/${repo}`;
  }

  const trimmed = embedPath.trim();
  if (trimmed.startsWith('/')) return trimmed;
  return `/simulations/${repo}/${trimmed.replace(/^\/+/, '')}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CloneRequestBody;
    const lessonId = body.lessonId?.trim();
    const repoUrl = body.repoUrl?.trim();
    const overwrite = Boolean(body.overwrite);

    if (!lessonId || !repoUrl) {
      return NextResponse.json(
        { success: false, error: 'lessonId and repoUrl are required.' },
        { status: 400 }
      );
    }

    const parsed = parseGithubRepo(repoUrl);
    if (!parsed) {
      return NextResponse.json(
        {
          success: false,
          error: 'repoUrl must be a GitHub URL like https://github.com/owner/repo(.git)',
        },
        { status: 400 }
      );
    }

    const lessonFile = findLessonFile(lessonId);
    if (!lessonFile) {
      return NextResponse.json(
        { success: false, error: `Could not find lesson file for ${lessonId}.` },
        { status: 404 }
      );
    }

    const simulationsRoot = path.join(process.cwd(), 'src', 'app', 'simulations');
    const targetDir = path.join(simulationsRoot, parsed.repo);
    fs.mkdirSync(simulationsRoot, { recursive: true });

    if (fs.existsSync(targetDir)) {
      if (!overwrite) {
        return NextResponse.json(
          {
            success: false,
            error: `Target folder already exists: ${toPosixPath(path.relative(process.cwd(), targetDir))}`,
          },
          { status: 409 }
        );
      }
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    await execFileAsync('git', ['clone', '--depth', '1', repoUrl, targetDir], {
      cwd: process.cwd(),
      windowsHide: true,
    });

    fs.rmSync(path.join(targetDir, '.git'), { recursive: true, force: true });

    const embedUrl = normalizeEmbedUrl(parsed.repo, body.embedPath);
    const rawLesson = fs.readFileSync(lessonFile, 'utf8');
    const lesson = JSON.parse(rawLesson) as {
      blocks?: Array<{ type?: string; content?: Record<string, unknown> }>;
      metadata?: Record<string, unknown>;
    };

    const diagramBlock = lesson.blocks?.find((block) => block?.type === 'diagram');
    if (!diagramBlock || !diagramBlock.content) {
      return NextResponse.json(
        {
          success: false,
          error: `Lesson ${lessonId} has no diagram block to attach an iframe URL.`,
        },
        { status: 400 }
      );
    }

    diagramBlock.content.embedUrl = embedUrl;
    if (lesson.metadata && typeof lesson.metadata === 'object') {
      lesson.metadata.updated = new Date().toISOString().slice(0, 10);
    }

    fs.writeFileSync(lessonFile, `${JSON.stringify(lesson, null, 2)}\n`, 'utf8');

    return NextResponse.json({
      success: true,
      lessonId,
      embedUrl,
      repo: {
        owner: parsed.owner,
        name: parsed.repo,
        path: toPosixPath(path.relative(process.cwd(), targetDir)),
      },
      lessonFile: toPosixPath(path.relative(process.cwd(), lessonFile)),
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

