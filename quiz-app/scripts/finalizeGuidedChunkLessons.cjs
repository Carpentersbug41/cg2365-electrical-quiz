/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, 'src');

const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function patchedResolveFilename(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    request = path.join(srcRoot, request.slice(2));
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

function registerTsExtension(ext) {
  require.extensions[ext] = function compileTs(module, filename) {
    const source = fs.readFileSync(filename, 'utf8');
    const result = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
        resolveJsonModule: true,
      },
      fileName: filename,
    });
    module._compile(result.outputText, filename);
  };
}

registerTsExtension('.ts');
registerTsExtension('.tsx');

async function main() {
  const lessonCodes = process.argv.slice(2);
  if (lessonCodes.length === 0) {
    throw new Error('Provide at least one guided lesson code.');
  }

  const {
    listGuidedLessonVersions,
    transitionGuidedLessonVersion,
  } = require(path.join(srcRoot, 'lib', 'guidedChunk', 'versionStore.ts'));

  const versions = await listGuidedLessonVersions();
  const results = [];

  for (const lessonCode of lessonCodes) {
    const lessonVersions = versions
      .filter((version) => version.lessonCode === lessonCode)
      .sort((a, b) => a.versionNo - b.versionNo);

    if (!lessonVersions.length) {
      results.push({ lessonCode, success: false, error: 'No versions found.' });
      continue;
    }

    const latest = lessonVersions[lessonVersions.length - 1];
    const retired = [];

    for (const version of lessonVersions) {
      if (version.id === latest.id) continue;
      if (version.status === 'retired') {
        retired.push({ versionNo: version.versionNo, status: version.status });
        continue;
      }
      const updated = await transitionGuidedLessonVersion({
        versionId: version.id,
        action: 'retire',
        actorUserId: null,
      });
      retired.push({ versionNo: updated.versionNo, status: updated.status });
    }

    let published = latest;
    if (latest.status !== 'published') {
      let working = latest;
      if (working.status === 'draft') {
        working = await transitionGuidedLessonVersion({
          versionId: working.id,
          action: 'submit_review',
          actorUserId: null,
        });
      }
      if (working.status === 'needs_review') {
        working = await transitionGuidedLessonVersion({
          versionId: working.id,
          action: 'approve',
          actorUserId: null,
        });
      }
      if (working.status === 'approved') {
        working = await transitionGuidedLessonVersion({
          versionId: working.id,
          action: 'publish',
          actorUserId: null,
        });
      }
      published = working;
    }

    results.push({
      lessonCode,
      success: true,
      publishedVersionNo: published.versionNo,
      publishedStatus: published.status,
      score: published.qualityScore ?? null,
      retired,
    });
  }

  const runtimeDir = path.join(repoRoot, '.runtime');
  fs.mkdirSync(runtimeDir, { recursive: true });
  fs.writeFileSync(
    path.join(runtimeDir, 'guided_chunk_finalize_results.json'),
    JSON.stringify({ finalizedAt: new Date().toISOString(), results }, null, 2),
    'utf8'
  );

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
