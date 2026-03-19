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
  const runId = process.argv[2] || 'b9c5e1b7-6d25-43ee-8bd0-11e65926cd81';
  const blueprintIds = process.argv.slice(3).length ? process.argv.slice(3) : ['203-4A', '203-4C'];
  const { generateGuidedLessonFromModuleBlueprint } = require(path.join(srcRoot, 'lib', 'guidedChunk', 'modulePlannerBridge.ts'));

  const results = [];

  for (const blueprintId of blueprintIds) {
    try {
      const generated = await generateGuidedLessonFromModuleBlueprint({
        runId,
        blueprintId,
        createdBy: null,
      });

      results.push({
        blueprintId,
        success: true,
        versionNo: generated.version.versionNo,
        versionId: generated.version.id,
        score: generated.score?.total ?? null,
        grade: generated.score?.grade ?? null,
        validation: generated.validation?.passed ?? false,
        issues: (generated.score?.issues ?? []).slice(0, 5),
      });
    } catch (error) {
      results.push({
        blueprintId,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const runtimeDir = path.join(repoRoot, '.runtime');
  fs.mkdirSync(runtimeDir, { recursive: true });
  fs.writeFileSync(
    path.join(runtimeDir, 'guided_chunk_2365_target_results.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), runId, results }, null, 2),
    'utf8'
  );

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
