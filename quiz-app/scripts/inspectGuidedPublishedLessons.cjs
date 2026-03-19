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

function loadEnvFile(filename) {
  const filePath = path.join(repoRoot, filename);
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile('.env');
loadEnvFile('.env.local');

async function main() {
  const lessonCodes = process.argv.slice(2);
  if (lessonCodes.length === 0) {
    throw new Error('Provide at least one lesson code.');
  }

  const {
    getPublishedGuidedChunkVersionSummaryByCode,
    loadPublishedGuidedChunkFrame,
  } = require(path.join(srcRoot, 'lib', 'guidedChunk', 'versionStore.ts'));

  const results = [];

  for (const lessonCode of lessonCodes) {
    const summary = await getPublishedGuidedChunkVersionSummaryByCode(lessonCode);
    const frame = await loadPublishedGuidedChunkFrame(lessonCode);
    results.push({
      lessonCode,
      summary,
      firstChunk: frame?.loSequence?.[0]?.chunkPlan?.[0]?.teachingCore ?? null,
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
