import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = process.cwd();
const CHECK_DIRS = ['src/app/api/admin/v2', 'src/app/v2'];
const FORBIDDEN_IMPORT_PATTERNS = ["from '@/lib/generation", "from '@/lib/module_planner"];

function collectFiles(dirPath: string): string[] {
  return fs.readdirSync(dirPath, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath);
    }
    if (!entry.isFile() || !/\.(ts|tsx)$/.test(entry.name)) {
      return [];
    }
    return [fullPath];
  });
}

describe('V2 route boundary', () => {
  it('keeps legacy generation and module planner imports out of V2 route and UI files', () => {
    const violations: string[] = [];

    for (const relativeDir of CHECK_DIRS) {
      const absoluteDir = path.join(ROOT, relativeDir);
      const files = collectFiles(absoluteDir);
      for (const filePath of files) {
        const content = fs.readFileSync(filePath, 'utf8');
        const matchedPattern = FORBIDDEN_IMPORT_PATTERNS.find((pattern) => content.includes(pattern));
        if (!matchedPattern) continue;
        violations.push(`${path.relative(ROOT, filePath)} -> ${matchedPattern}`);
      }
    }

    expect(violations).toEqual([]);
  });
});
