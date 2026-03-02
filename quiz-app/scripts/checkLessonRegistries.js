const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const lessonsDir = path.join(rootDir, 'src', 'data', 'lessons');
const learnPagePath = path.join(rootDir, 'src', 'app', 'learn', 'page.tsx');
const lessonPagePath = path.join(rootDir, 'src', 'app', 'learn', '[lessonId]', 'page.tsx');
const lessonIndexPath = path.join(rootDir, 'src', 'data', 'lessons', 'lessonIndex.ts');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function getLessonFiles() {
  const files = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name.endsWith('.json')) {
        files.push(path.relative(lessonsDir, fullPath));
      }
    }
  }

  walk(lessonsDir);
  return files.sort();
}

function parseLessonJson(fileName) {
  const fullPath = path.join(lessonsDir, fileName);
  const content = JSON.parse(read(fullPath));
  if (!content.id || typeof content.id !== 'string') {
    throw new Error(`Lesson file is missing a string id: ${fileName}`);
  }
  return content.id;
}

function diff(left, right) {
  const rightSet = new Set(right);
  return left.filter((value) => !rightSet.has(value));
}

function parseLessonImports(content, sourcePath) {
  const importMatches = Array.from(
    content.matchAll(/import\s+([A-Za-z0-9_]+)\s+from\s+'@\/data\/lessons\/([^']+)\.json';/g)
  );

  const varToLessonId = new Map();
  for (const [, varName, fileBase] of importMatches) {
    const lessonFile = `${fileBase}.json`;
    const fullPath = path.join(lessonsDir, lessonFile);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`${sourcePath} imports missing lesson file: ${lessonFile}`);
    }
    const id = parseLessonJson(lessonFile);
    varToLessonId.set(varName, id);
  }
  return varToLessonId;
}

function extractLearnPageIds() {
  const content = read(learnPagePath);
  const varToLessonId = parseLessonImports(content, 'src/app/learn/page.tsx');

  const rawLessonsMatch = content.match(/const RAW_LESSONS = \[([\s\S]*?)\];/);
  if (!rawLessonsMatch) {
    throw new Error('Could not find RAW_LESSONS in src/app/learn/page.tsx');
  }

  const rawBody = rawLessonsMatch[1];
  const lessonVars = Array.from(new Set(rawBody.match(/\blesson[A-Za-z0-9_]+\b/g) || []));
  const unknownVars = lessonVars.filter((varName) => !varToLessonId.has(varName));

  if (unknownVars.length > 0) {
    throw new Error(
      `RAW_LESSONS contains variables with no lesson import mapping: ${unknownVars.join(', ')}`
    );
  }

  return lessonVars.map((varName) => varToLessonId.get(varName));
}

function extractLessonDetailPageIds() {
  const content = read(lessonPagePath);
  const varToLessonId = parseLessonImports(content, 'src/app/learn/[lessonId]/page.tsx');
  const registryEntries = Array.from(
    content.matchAll(/'([^']+)':\s*(lesson[A-Za-z0-9_]+)\s+as Lesson/g)
  );

  const unknownVars = registryEntries
    .map(([, , varName]) => varName)
    .filter((varName) => !varToLessonId.has(varName));

  if (unknownVars.length > 0) {
    throw new Error(
      `LESSONS map in src/app/learn/[lessonId]/page.tsx contains variables with no lesson import mapping: ${Array.from(new Set(unknownVars)).join(', ')}`
    );
  }

  return Array.from(new Set(registryEntries.map((m) => m[1])));
}

function extractLessonIndexIds() {
  const content = read(lessonIndexPath);
  return Array.from(new Set(Array.from(content.matchAll(/id:\s*'([^']+)'/g)).map((m) => m[1])));
}

function main() {
  const lessonFiles = getLessonFiles();
  const jsonIds = lessonFiles.map(parseLessonJson);
  const duplicateJsonIds = jsonIds.filter((id, index) => jsonIds.indexOf(id) !== index);
  if (duplicateJsonIds.length > 0) {
    throw new Error(`Duplicate lesson ids in JSON files: ${Array.from(new Set(duplicateJsonIds)).join(', ')}`);
  }

  const learnIds = extractLearnPageIds().filter(Boolean);
  const detailPageIds = extractLessonDetailPageIds();
  const lessonIndexIds = extractLessonIndexIds();

  const missingFromLearnPage = diff(jsonIds, learnIds);
  const missingFromDetailPage = diff(jsonIds, detailPageIds);
  const missingFromIndex = diff(jsonIds, lessonIndexIds);

  const errors = [];
  if (missingFromLearnPage.length > 0) {
    errors.push(`Missing from src/app/learn/page.tsx RAW_LESSONS: ${missingFromLearnPage.join(', ')}`);
  }
  if (missingFromDetailPage.length > 0) {
    errors.push(`Missing from src/app/learn/[lessonId]/page.tsx LESSONS map: ${missingFromDetailPage.join(', ')}`);
  }
  if (missingFromIndex.length > 0) {
    errors.push(`Missing from src/data/lessons/lessonIndex.ts: ${missingFromIndex.join(', ')}`);
  }

  if (errors.length > 0) {
    console.error('\n[Lesson Registry Check] FAILED');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log(`[Lesson Registry Check] OK (${jsonIds.length} lesson JSON files validated)`);
}

try {
  main();
} catch (error) {
  console.error('\n[Lesson Registry Check] FAILED');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
