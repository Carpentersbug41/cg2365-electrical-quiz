import { NextRequest, NextResponse } from 'next/server';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { findLessonFile } from '@/lib/generation/lessonDetector';
import { getCurriculumScopeFromHeaderOrReferer, isLessonIdAllowedForScope } from '@/lib/routing/curriculumScope';

const execFileAsync = promisify(execFile);

type CloneRequestBody = {
  lessonId?: string;
  repoUrl?: string;
  embedPath?: string;
  overwrite?: boolean;
};
type DeleteRequestBody = {
  lessonId?: string;
  repoUrl?: string;
};
type PackageJsonLike = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
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

function extractRepoFromEmbedUrl(embedUrl: unknown): string | null {
  if (typeof embedUrl !== 'string') return null;
  const normalized = embedUrl.trim();
  const match = normalized.match(/^\/simulations\/([^/\s]+)(?:\/.*)?$/i);
  if (!match) return null;
  return match[1] ?? null;
}

function fileExists(filePath: string): boolean {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function hasViteConfig(repoDir: string): boolean {
  const candidates = ['vite.config.ts', 'vite.config.js', 'vite.config.mjs', 'vite.config.cjs'];
  return candidates.some((candidate) => fileExists(path.join(repoDir, candidate)));
}

function readPackageJson(repoDir: string): PackageJsonLike | null {
  const packageJsonPath = path.join(repoDir, 'package.json');
  if (!fileExists(packageJsonPath)) return null;

  try {
    const raw = fs.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(raw) as PackageJsonLike;
  } catch {
    return null;
  }
}

function isViteRepo(repoDir: string, packageJson: PackageJsonLike | null): boolean {
  if (hasViteConfig(repoDir)) return true;
  const allDeps = {
    ...(packageJson?.dependencies ?? {}),
    ...(packageJson?.devDependencies ?? {}),
  };
  return typeof allDeps.vite === 'string';
}

function inferAutoEmbedPath(repoDir: string): string {
  if (fileExists(path.join(repoDir, 'dist', 'index.html'))) return 'dist/index.html';
  if (fileExists(path.join(repoDir, 'build', 'index.html'))) return 'build/index.html';
  return 'index.html';
}

function isLikelyUnbuiltViteSource(repoDir: string, packageJson: PackageJsonLike | null): boolean {
  if (!isViteRepo(repoDir, packageJson)) return false;
  const indexPath = path.join(repoDir, 'index.html');
  if (!fileExists(indexPath)) return false;
  if (fileExists(path.join(repoDir, 'dist', 'index.html'))) return false;

  try {
    const html = fs.readFileSync(indexPath, 'utf8');
    return /src\s*=\s*["'][^"']*\/src\/.*\.(tsx?|jsx?)["']/i.test(html);
  } catch {
    return false;
  }
}

async function runCommand(command: string, args: string[], cwd: string): Promise<void> {
  const executable = process.platform === 'win32' && command === 'npm' ? 'npm.cmd' : command;
  await execFileAsync(executable, args, { cwd, windowsHide: true });
}

async function buildSimulationRepo(repoDir: string, repoName: string): Promise<void> {
  const packageJson = readPackageJson(repoDir);
  const buildScript = packageJson?.scripts?.build;
  if (!buildScript) return;

  try {
    const hasPackageLock = fileExists(path.join(repoDir, 'package-lock.json'));
    if (hasPackageLock) {
      await runCommand('npm', ['ci', '--no-audit', '--no-fund'], repoDir);
    } else {
      await runCommand('npm', ['install', '--no-audit', '--no-fund'], repoDir);
    }

    if (isViteRepo(repoDir, packageJson)) {
      await runCommand('npm', ['run', 'build', '--', '--base', `/simulations/${repoName}/`], repoDir);
      return;
    }

    await runCommand('npm', ['run', 'build'], repoDir);
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : 'Unknown build failure.';
    throw new Error(`Failed to auto-build simulation repo: ${detail}`);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CloneRequestBody;
    const lessonId = body.lessonId?.trim();
    const repoUrl = body.repoUrl?.trim();
    const overwrite = Boolean(body.overwrite);
    const scope = getCurriculumScopeFromHeaderOrReferer(
      request.headers.get('x-course-prefix'),
      request.headers.get('referer')
    );

    if (!lessonId || !repoUrl) {
      return NextResponse.json(
        { success: false, error: 'lessonId and repoUrl are required.' },
        { status: 400 }
      );
    }

    if (!isLessonIdAllowedForScope(lessonId, scope)) {
      return NextResponse.json(
        { success: false, error: `Lesson ${lessonId} is not available in this curriculum scope.` },
        { status: 403 }
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
    await buildSimulationRepo(targetDir, parsed.repo);

    const packageJson = readPackageJson(targetDir);
    const requestedEmbedPath = body.embedPath?.trim();
    const resolvedEmbedPath = requestedEmbedPath || inferAutoEmbedPath(targetDir);

    if (!requestedEmbedPath && isLikelyUnbuiltViteSource(targetDir, packageJson)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Simulation repo cloned but appears unbuilt (Vite source index without dist). Build step failed or produced no dist/index.html.',
        },
        { status: 500 }
      );
    }

    const embedUrl = normalizeEmbedUrl(parsed.repo, resolvedEmbedPath);
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

export async function DELETE(request: NextRequest) {
  try {
    const body = (await request.json()) as DeleteRequestBody;
    const lessonId = body.lessonId?.trim();
    const repoUrl = body.repoUrl?.trim();
    const scope = getCurriculumScopeFromHeaderOrReferer(
      request.headers.get('x-course-prefix'),
      request.headers.get('referer')
    );

    if (!lessonId && !repoUrl) {
      return NextResponse.json(
        { success: false, error: 'Provide lessonId or repoUrl to identify a simulation repo.' },
        { status: 400 }
      );
    }

    if (lessonId && !isLessonIdAllowedForScope(lessonId, scope)) {
      return NextResponse.json(
        { success: false, error: `Lesson ${lessonId} is not available in this curriculum scope.` },
        { status: 403 }
      );
    }

    let lessonFile: string | null = null;
    let lesson:
      | {
          blocks?: Array<{ type?: string; content?: Record<string, unknown> }>;
          metadata?: Record<string, unknown>;
        }
      | null = null;

    if (lessonId) {
      lessonFile = findLessonFile(lessonId) ?? null;
      if (!lessonFile) {
        return NextResponse.json(
          { success: false, error: `Could not find lesson file for ${lessonId}.` },
          { status: 404 }
        );
      }
      lesson = JSON.parse(fs.readFileSync(lessonFile, 'utf8')) as {
        blocks?: Array<{ type?: string; content?: Record<string, unknown> }>;
        metadata?: Record<string, unknown>;
      };
    }

    const repoFromUrl = repoUrl ? (parseGithubRepo(repoUrl)?.repo ?? null) : null;
    const diagramBlock = lesson?.blocks?.find((block) => block?.type === 'diagram');
    const repoFromEmbed = extractRepoFromEmbedUrl(diagramBlock?.content?.embedUrl);
    const repoName = repoFromUrl ?? repoFromEmbed;

    if (!repoName) {
      return NextResponse.json(
        { success: false, error: 'Could not determine repo name from repoUrl or lesson embedUrl.' },
        { status: 400 }
      );
    }

    const simulationsRoot = path.join(process.cwd(), 'src', 'app', 'simulations');
    const targetDir = path.join(simulationsRoot, repoName);
    const targetRelative = toPosixPath(path.relative(process.cwd(), targetDir));

    let deleted = false;
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
      deleted = true;
    }

    let embedCleared = false;
    if (lesson && diagramBlock?.content) {
      const currentEmbed = diagramBlock.content.embedUrl;
      const currentRepo = extractRepoFromEmbedUrl(currentEmbed);
      if (currentRepo === repoName) {
        delete diagramBlock.content.embedUrl;
        embedCleared = true;
      }

      if (embedCleared) {
        if (lesson.metadata && typeof lesson.metadata === 'object') {
          lesson.metadata.updated = new Date().toISOString().slice(0, 10);
        }
        if (lessonFile) {
          fs.writeFileSync(lessonFile, `${JSON.stringify(lesson, null, 2)}\n`, 'utf8');
        }
      }
    }

    return NextResponse.json({
      success: true,
      lessonId: lessonId ?? null,
      repo: {
        name: repoName,
        path: targetRelative,
      },
      deleted,
      embedCleared,
      message: deleted
        ? 'Simulation repo deleted.'
        : 'Simulation folder was not present; nothing to delete.',
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
