import { NextRequest, NextResponse } from 'next/server';
import { promisify } from 'node:util';
import { exec, execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { findLessonFile } from '@/lib/generation/lessonDetector';
import { getCurriculumScopeFromHeaderOrReferer, isLessonIdAllowedForScope } from '@/lib/routing/curriculumScope';

const execFileAsync = promisify(execFile);
const execAsync = promisify(exec);

type CloneRequestBody = {
  lessonId?: string;
  repoUrl?: string;
  embedPath?: string;
  overwrite?: boolean;
  explanationBlockId?: string;
};
type DeleteRequestBody = {
  lessonId?: string;
  repoUrl?: string;
  explanationBlockId?: string;
};
type PackageJsonLike = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type EditableLessonBlock = {
  id?: string;
  type?: string;
  order?: number;
  content?: Record<string, unknown>;
};

type EditableLesson = {
  blocks?: EditableLessonBlock[];
  metadata?: Record<string, unknown>;
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

function hasLocalPostCssConfig(repoDir: string): boolean {
  const candidates = [
    'postcss.config.js',
    'postcss.config.cjs',
    'postcss.config.mjs',
    'postcss.config.ts',
    '.postcssrc',
    '.postcssrc.json',
    '.postcssrc.js',
    '.postcssrc.cjs',
    '.postcssrc.mjs',
  ];
  return candidates.some((candidate) => fs.existsSync(path.join(repoDir, candidate)));
}

function applyViteWindowsSpawnWorkaround(repoDir: string): void {
  if (process.platform !== 'win32') return;

  const chunksDir = path.join(repoDir, 'node_modules', 'vite', 'dist', 'node', 'chunks');
  if (!fs.existsSync(chunksDir)) return;

  const chunkFiles = fs
    .readdirSync(chunksDir)
    .filter((entry) => entry.endsWith('.js'))
    .map((entry) => path.join(chunksDir, entry));

  const pattern =
    /exec\("net use", \(error, stdout\) => \{([\s\S]*?)\n  \}\);\n\}/m;

  for (const filePath of chunkFiles) {
    const source = fs.readFileSync(filePath, 'utf8');
    if (!source.includes('exec("net use", (error, stdout) => {')) continue;

    const patched = source.replace(
      pattern,
      'try { exec("net use", (error, stdout) => {$1\n  });\n  } catch {\n    safeRealpathSync = fs__default.realpathSync.native;\n  }\n}'
    );

    if (patched !== source) {
      fs.writeFileSync(filePath, patched, 'utf8');
      return;
    }
  }
}

function inferAutoEmbedPath(repoDir: string): string {
  if (fileExists(path.join(repoDir, 'dist', 'index.html'))) return 'dist/index.html';
  if (fileExists(path.join(repoDir, 'build', 'index.html'))) return 'build/index.html';
  return 'index.html';
}

function ensureFallbackSimulationPage(repoDir: string, repoName: string, reason: string): void {
  const safeReason = reason.replace(/[<>&]/g, (char) => {
    if (char === '<') return '&lt;';
    if (char === '>') return '&gt;';
    return '&amp;';
  });
  const distDir = path.join(repoDir, 'dist');
  fs.mkdirSync(distDir, { recursive: true });
  const fallbackHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Simulation Ready Check</title>
    <style>
      body { font-family: Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; }
      .card { max-width: 760px; margin: 24px auto; background: #fff; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; }
      code { background: #e2e8f0; padding: 2px 4px; border-radius: 4px; }
      h1 { margin: 0 0 8px; font-size: 1.1rem; }
      p { margin: 0 0 8px; line-height: 1.4; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Simulation repo cloned, but auto-build failed.</h1>
      <p>Repo: <code>${repoName}</code></p>
      <p>This fallback page is shown so the iframe is not blank.</p>
      <p>Build error: <code>${safeReason}</code></p>
    </div>
  </body>
</html>`;
  fs.writeFileSync(path.join(distDir, 'index.html'), fallbackHtml, 'utf8');
}

function patchDistIndexAssetBase(repoDir: string, repoName: string): void {
  const distIndexPath = path.join(repoDir, 'dist', 'index.html');
  if (!fileExists(distIndexPath)) return;

  const expectedAssetPrefix = `/simulations/${repoName}/assets/`;
  const correctedAssetPrefix = `/simulations/${repoName}/dist/assets/`;

  const source = fs.readFileSync(distIndexPath, 'utf8');
  if (!source.includes(expectedAssetPrefix)) return;

  const patched = source.split(expectedAssetPrefix).join(correctedAssetPrefix);
  if (patched !== source) {
    fs.writeFileSync(distIndexPath, patched, 'utf8');
  }
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

function computeInsertedOrder(blocks: EditableLessonBlock[], insertAtIndex: number): number {
  const previous = blocks[insertAtIndex - 1];
  const next = blocks[insertAtIndex];
  const previousOrder = typeof previous?.order === 'number' ? previous.order : insertAtIndex;
  const nextOrder = typeof next?.order === 'number' ? next.order : null;

  if (nextOrder !== null && nextOrder > previousOrder) {
    return Number(((previousOrder + nextOrder) / 2).toFixed(4));
  }

  return Number((previousOrder + 0.1).toFixed(4));
}

function getDiagramBlockForExplanation(
  lesson: EditableLesson,
  explanationBlockId: string
): { block: EditableLessonBlock; index: number } | null {
  const blocks = lesson.blocks ?? [];
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    if (block?.type !== 'diagram') continue;
    const linkedExplanationId = block.content?.linkedExplanationId;
    if (typeof linkedExplanationId === 'string' && linkedExplanationId === explanationBlockId) {
      return { block, index };
    }
  }
  return null;
}

function attachEmbedToLessonDiagram(
  lesson: EditableLesson,
  lessonId: string,
  embedUrl: string,
  explanationBlockId?: string
): { diagramBlockId: string; explanationBlockId?: string } {
  const blocks = lesson.blocks ?? [];
  lesson.blocks = blocks;

  if (explanationBlockId) {
    const explanationIndex = blocks.findIndex(
      (block) => block?.type === 'explanation' && block.id === explanationBlockId
    );
    if (explanationIndex === -1) {
      throw new Error(`Explanation block ${explanationBlockId} was not found in lesson ${lessonId}.`);
    }

    const linkedDiagram = getDiagramBlockForExplanation(lesson, explanationBlockId);
    const targetInsertIndex = explanationIndex + 1;
    let diagramBlock: EditableLessonBlock;
    let diagramIndex: number;

    if (linkedDiagram) {
      diagramBlock = linkedDiagram.block;
      diagramIndex = linkedDiagram.index;
      if (diagramIndex !== targetInsertIndex) {
        const [moved] = blocks.splice(diagramIndex, 1);
        const adjustedInsertIndex = diagramIndex < targetInsertIndex ? targetInsertIndex - 1 : targetInsertIndex;
        blocks.splice(adjustedInsertIndex, 0, moved);
        diagramBlock = moved;
        diagramIndex = adjustedInsertIndex;
      }
    } else {
      const explanationBlock = blocks[explanationIndex];
      const explanationTitle =
        typeof explanationBlock?.content?.title === 'string'
          ? explanationBlock.content.title
          : explanationBlockId;
      const newDiagramId = `${lessonId}-diagram-${explanationBlockId.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
      diagramBlock = {
        id: newDiagramId,
        type: 'diagram',
        order: 0,
        content: {
          title: `Visual: ${explanationTitle}`,
          description: `Embedded visual for ${explanationTitle}`,
          diagramType: 'concept',
          elementIds: [],
          linkedExplanationId: explanationBlockId,
        },
      };
      blocks.splice(targetInsertIndex, 0, diagramBlock);
      diagramIndex = targetInsertIndex;
    }

    diagramBlock.content = diagramBlock.content ?? {};
    diagramBlock.content.embedUrl = embedUrl;
    diagramBlock.content.linkedExplanationId = explanationBlockId;
    diagramBlock.order = computeInsertedOrder(blocks, diagramIndex);

    return {
      diagramBlockId: typeof diagramBlock.id === 'string' ? diagramBlock.id : `${lessonId}-diagram`,
      explanationBlockId,
    };
  }

  const diagramBlock = blocks.find((block) => block?.type === 'diagram');
  if (!diagramBlock) {
    throw new Error(`Lesson ${lessonId} has no diagram block to attach an iframe URL.`);
  }

  diagramBlock.content = diagramBlock.content ?? {};
  diagramBlock.content.embedUrl = embedUrl;

  return {
    diagramBlockId: typeof diagramBlock.id === 'string' ? diagramBlock.id : `${lessonId}-diagram`,
  };
}

async function runCommand(command: string, args: string[], cwd: string): Promise<void> {
  if (process.platform === 'win32') {
    const quoteArg = (value: string): string =>
      /[\s"&|<>^]/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value;
    const winCommand = [command, ...args].map(quoteArg).join(' ');

    try {
      await execAsync(winCommand, { cwd, windowsHide: true });
      return;
    } catch (error) {
      try {
        const executable = command === 'npm' ? 'npm.cmd' : command;
        await execFileAsync(executable, args, { cwd, windowsHide: true });
        return;
      } catch {
        throw error;
      }
    }
  }

  await execFileAsync(command, args, { cwd, windowsHide: true });
}

async function buildSimulationRepo(repoDir: string, repoName: string): Promise<void> {
  const packageJson = readPackageJson(repoDir);
  const buildScript = packageJson?.scripts?.build;
  if (!buildScript) return;
  const needsLocalPostCssShield = !hasLocalPostCssConfig(repoDir);
  const tempPostCssConfigPath = path.join(repoDir, 'postcss.config.cjs');

  try {
    if (needsLocalPostCssShield) {
      fs.writeFileSync(tempPostCssConfigPath, 'module.exports = { plugins: {} };\n', 'utf8');
    }

    const hasPackageLock = fileExists(path.join(repoDir, 'package-lock.json'));
    if (hasPackageLock) {
      await runCommand('npm', ['ci', '--no-audit', '--no-fund'], repoDir);
    } else {
      await runCommand('npm', ['install', '--no-audit', '--no-fund'], repoDir);
    }

    if (isViteRepo(repoDir, packageJson)) {
      applyViteWindowsSpawnWorkaround(repoDir);
      await runCommand('npm', ['run', 'build', '--', '--base', `/simulations/${repoName}/dist/`], repoDir);
      patchDistIndexAssetBase(repoDir, repoName);
      return;
    }

    await runCommand('npm', ['run', 'build'], repoDir);
  } catch (error) {
    const detail =
      error instanceof Error
        ? error.message
        : 'Unknown build failure.';
    throw new Error(`Failed to auto-build simulation repo: ${detail}`);
  } finally {
    if (needsLocalPostCssShield && fs.existsSync(tempPostCssConfigPath)) {
      fs.rmSync(tempPostCssConfigPath, { force: true });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CloneRequestBody;
    const lessonId = body.lessonId?.trim();
    const repoUrl = body.repoUrl?.trim();
    const overwrite = Boolean(body.overwrite);
    const explanationBlockId = body.explanationBlockId?.trim();
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
    let buildErrorMessage: string | null = null;
    try {
      await buildSimulationRepo(targetDir, parsed.repo);
    } catch (error) {
      buildErrorMessage =
        error instanceof Error ? error.message : 'Unknown build failure.';
      ensureFallbackSimulationPage(targetDir, parsed.repo, buildErrorMessage);
    }

    const packageJson = readPackageJson(targetDir);
    const requestedEmbedPath = body.embedPath?.trim();
    const resolvedEmbedPath =
      requestedEmbedPath ||
      (buildErrorMessage ? 'dist/index.html' : inferAutoEmbedPath(targetDir));

    if (!requestedEmbedPath && !buildErrorMessage && isLikelyUnbuiltViteSource(targetDir, packageJson)) {
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
    const lesson = JSON.parse(rawLesson) as EditableLesson;
    let attachResult: { diagramBlockId: string; explanationBlockId?: string };
    try {
      attachResult = attachEmbedToLessonDiagram(lesson, lessonId, embedUrl, explanationBlockId);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to attach embed URL to lesson.',
        },
        { status: 400 }
      );
    }

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
      explanationBlockId: attachResult.explanationBlockId,
      diagramBlockId: attachResult.diagramBlockId,
      buildWarning: buildErrorMessage ?? undefined,
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
    const explanationBlockId = body.explanationBlockId?.trim();
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
    let lesson: EditableLesson | null = null;

    if (lessonId) {
      lessonFile = findLessonFile(lessonId) ?? null;
      if (!lessonFile) {
        return NextResponse.json(
          { success: false, error: `Could not find lesson file for ${lessonId}.` },
          { status: 404 }
        );
      }
      lesson = JSON.parse(fs.readFileSync(lessonFile, 'utf8')) as EditableLesson;
    }

    const repoFromUrl = repoUrl ? (parseGithubRepo(repoUrl)?.repo ?? null) : null;
    const diagramBlock =
      explanationBlockId && lesson
        ? getDiagramBlockForExplanation(lesson, explanationBlockId)?.block
        : lesson?.blocks?.find((block) => block?.type === 'diagram');
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
      explanationBlockId: explanationBlockId ?? null,
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
