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
  const { listGcseBiologyPhase1LessonProfiles } = require(path.join(srcRoot, 'data', 'v2', 'gcse', 'biology', 'phase1LessonProfiles.ts'));
  const { generateGuidedChunkFrame } = require(path.join(srcRoot, 'lib', 'generation', 'guidedChunk', 'index.ts'));
  const { saveGeneratedGuidedChunkFrame } = require(path.join(srcRoot, 'lib', 'guidedChunk', 'generatedFrameStore.ts'));

  const profiles = listGcseBiologyPhase1LessonProfiles();
  const results = [];

  for (const profile of profiles) {
    const lessonCode = `${profile.lessonCode}-gc`;
    try {
      const generated = await generateGuidedChunkFrame({
        lessonCode,
        title: profile.topic,
        unit: profile.lessonCode.split('-').slice(0, 2).join('-'),
        topic: profile.topic,
        sourceText: `${profile.mustHaveTopics}\n\n${profile.additionalInstructions}`,
        sourceRefs: ['gcse-biology-phase1-batch'],
        targetAudience: 'GCSE Biology learner',
        curriculum: 'gcse-science-biology',
        lessonProfileNotes: profile.additionalInstructions,
      });

      await saveGeneratedGuidedChunkFrame(generated.frame, {
        curriculum: 'gcse-science-biology',
        qualityScore: generated.score?.total ?? null,
        grade: generated.score?.grade ?? null,
      });

      results.push({
        lessonCode,
        success: true,
        score: generated.score?.total ?? null,
        grade: generated.score?.grade ?? null,
        validation: generated.validation?.passed ?? false,
        issues: (generated.score?.issues ?? []).slice(0, 3),
      });
    } catch (error) {
      results.push({
        lessonCode,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const runtimeDir = path.join(repoRoot, '.runtime');
  fs.mkdirSync(runtimeDir, { recursive: true });
  fs.writeFileSync(
    path.join(runtimeDir, 'guided_chunk_biology_phase1_batch.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2),
    'utf8'
  );

  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
