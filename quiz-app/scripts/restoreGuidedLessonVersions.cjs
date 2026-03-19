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
  const selections = process.argv.slice(2);
  if (selections.length === 0) {
    throw new Error('Provide selections like 203-4A:1 203-4B:2 203-4C:1');
  }

  const {
    listGuidedLessonVersions,
    transitionGuidedLessonVersion,
  } = require(path.join(srcRoot, 'lib', 'guidedChunk', 'versionStore.ts'));

  const versions = await listGuidedLessonVersions();
  const results = [];

  for (const selection of selections) {
    const [lessonCode, versionNoRaw] = selection.split(':');
    const versionNo = Number(versionNoRaw);
    if (!lessonCode || !Number.isFinite(versionNo)) {
      results.push({ selection, success: false, error: 'Invalid selection format.' });
      continue;
    }

    const lessonVersions = versions.filter((version) => version.lessonCode === lessonCode);
    const target = lessonVersions.find((version) => version.versionNo === versionNo);
    if (!target) {
      results.push({ lessonCode, versionNo, success: false, error: 'Version not found.' });
      continue;
    }

    let working = target;
    if (working.status === 'retired') {
      working = await transitionGuidedLessonVersion({
        versionId: working.id,
        action: 'revert_draft',
        actorUserId: null,
      });
    }
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

    results.push({
      lessonCode,
      versionNo: working.versionNo,
      success: true,
      status: working.status,
      score: working.qualityScore ?? null,
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
