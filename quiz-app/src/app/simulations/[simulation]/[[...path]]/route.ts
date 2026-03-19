import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { getStaticSimulationDir } from '@/lib/simulations/paths';

export const runtime = 'nodejs';

const MIME_BY_EXTENSION: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

type RouteParams = {
  simulation: string;
  path?: string[];
};

function resolveRelativePath(pathParts?: string[]) {
  if (!pathParts || pathParts.length === 0) return 'index.html';
  return pathParts.join('/');
}

function detectContentType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_BY_EXTENSION[ext] ?? 'application/octet-stream';
}

function isSafePath(rootDir: string, targetPath: string) {
  const relative = path.relative(rootDir, targetPath);
  return Boolean(relative) && !relative.startsWith('..') && !path.isAbsolute(relative);
}

export async function GET(
  _request: NextRequest,
  context: { params: RouteParams | Promise<RouteParams> }
) {
  const params = await context.params;
  const simulation = params.simulation?.trim();
  if (!simulation || simulation.includes('/') || simulation.includes('\\')) {
    return NextResponse.json({ error: 'Invalid simulation name.' }, { status: 400 });
  }

  const simulationRoot = path.resolve(getStaticSimulationDir(simulation));
  const relativePath = resolveRelativePath(params.path);
  let targetPath = path.resolve(simulationRoot, relativePath);

  if (!isSafePath(simulationRoot, targetPath) && targetPath !== simulationRoot) {
    return NextResponse.json({ error: 'Invalid path.' }, { status: 400 });
  }

  if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
    targetPath = path.join(targetPath, 'index.html');
  }

  if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
    return NextResponse.json({ error: 'Simulation file not found.' }, { status: 404 });
  }

  const data = fs.readFileSync(targetPath);
  return new NextResponse(data, {
    status: 200,
    headers: {
      'content-type': detectContentType(targetPath),
      'cache-control': 'public, max-age=60',
    },
  });
}
