import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx <= 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim().replace(/^"(.*)"$/, '$1');
    if (!process.env[key]) process.env[key] = value;
  }
}

function normalizeText(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value) {
  const stop = new Set(['the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'must', 'which']);
  return normalizeText(value)
    .split(' ')
    .filter((t) => t.length >= 3 && !stop.has(t));
}

function jaccard(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection += 1;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

function parseJsonSafe(raw) {
  const stripped = String(raw)
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(stripped);
}

function isValidMcq(row) {
  if (!row || typeof row !== 'object') return false;
  if (typeof row.stem !== 'string' || row.stem.trim().length < 20) return false;
  if (!Array.isArray(row.options) || row.options.length < 4) return false;
  const cleanOptions = row.options.map((x) => String(x).trim()).filter((x) => x.length > 0);
  if (cleanOptions.length < 4) return false;
  if (new Set(cleanOptions.map((x) => x.toLowerCase())).size !== cleanOptions.length) return false;
  if (typeof row.correct !== 'string' || !cleanOptions.some((x) => x.toLowerCase() === row.correct.trim().toLowerCase())) return false;
  return true;
}

async function main() {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const root = path.resolve(__dirname, '..');
  loadEnvFile(path.join(root, '.env'));
  loadEnvFile(path.join(root, '.env.local'));

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-3-flash-preview';
  if (!supabaseUrl || !serviceRole || !geminiKey) {
    throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / GEMINI_API_KEY');
  }

  const unitCode = process.argv[2] || '203';
  const loCode = process.argv[3] || 'LO6';
  const level = Number(process.argv[4] || 2);
  const count = Number(process.argv[5] || 50);

  const supabase = createClient(supabaseUrl, serviceRole);
  const { data: versions, error: versionError } = await supabase
    .from('syllabus_versions')
    .select('id, created_at')
    .order('created_at', { ascending: false })
    .limit(1);
  if (versionError) throw new Error(versionError.message);
  const versionId = versions?.[0]?.id;
  if (!versionId) throw new Error('No syllabus version found.');

  const { data: structures, error: structureError } = await supabase
    .from('syllabus_structure')
    .select('unit, structure_json')
    .eq('syllabus_version_id', versionId)
    .eq('unit', unitCode)
    .limit(1);
  if (structureError) throw new Error(structureError.message);
  const structure = structures?.[0]?.structure_json;
  const los = Array.isArray(structure?.los) ? structure.los : [];
  const lo = los.find((item) => String(item?.loNumber ?? '').toUpperCase() === loCode.replace(/^LO/i, '').toUpperCase());
  const acList = Array.isArray(lo?.acs) ? lo.acs.map((ac) => String(ac?.acNumber ?? '').trim()).filter((x) => x.length > 0) : [];
  if (acList.length === 0) throw new Error(`No ACs found for ${unitCode} ${loCode}`);

  const { data: approvedRows, error: approvedError } = await supabase
    .from('question_items')
    .select('id, lo_code, ac_code, stem, correct, format, status')
    .eq('status', 'approved')
    .eq('unit_code', unitCode)
    .eq('level', level)
    .eq('lo_code', loCode)
    .eq('format', 'mcq')
    .limit(200);
  if (approvedError) throw new Error(approvedError.message);

  const antiDupHistory = (approvedRows || [])
    .slice(0, 20)
    .map((row, idx) => `${idx + 1}. [${row.lo_code}|${row.ac_code}] Q: ${String(row.stem)} | A: ${String(row.correct)}`)
    .join('\n');

  const prompt = [
    `Generate exactly ${count} distinct MCQ questions as strict JSON only.`,
    'Return object shape: {"questions":[{"unit_code","lo_code","ac_code","level","difficulty","format","stem","options","correct","rationale"}]}',
    'Rules:',
    '- unit_code must be the provided unit',
    '- lo_code must be the provided LO code',
    '- format must be "mcq"',
    '- options length exactly 4',
    '- correct must match exactly one option string',
    '- avoid near-duplicates and paraphrases',
    '- spread questions across the provided AC list',
    '- each question should assess a materially different scenario/angle',
    '',
    `Scope: unit_code=${unitCode}, lo_code=${loCode}, level=${level}, ac_list=${JSON.stringify(acList)}`,
    '',
    'Existing approved question history (avoid duplicating/paraphrasing):',
    antiDupHistory || '(none)',
  ].join('\n');

  const ai = new GoogleGenerativeAI(geminiKey);
  const model = ai.getGenerativeModel({
    model: modelName,
    generationConfig: { temperature: 0.4, responseMimeType: 'application/json', maxOutputTokens: 16000 },
  });

  const started = Date.now();
  const result = await model.generateContent(prompt);
  const elapsedMs = Date.now() - started;
  const text = result.response.text();
  const parsed = parseJsonSafe(text);
  const questions = Array.isArray(parsed?.questions) ? parsed.questions : [];

  const validFlags = questions.map((q) => isValidMcq(q));
  const validCount = validFlags.filter(Boolean).length;
  const invalidCount = questions.length - validCount;

  const stemNorm = questions.map((q) => normalizeText(q?.stem));
  const exactDupStemCount = stemNorm.length - new Set(stemNorm).size;

  let nearDupPairs = 0;
  let answerCorrelatedPairs = 0;
  const examples = [];
  for (let i = 0; i < questions.length; i += 1) {
    for (let j = i + 1; j < questions.length; j += 1) {
      const a = questions[i];
      const b = questions[j];
      const stemScore = jaccard(tokenize(a?.stem), tokenize(b?.stem));
      const answerScore = jaccard(tokenize(a?.correct), tokenize(b?.correct));
      const near = stemScore >= 0.58;
      const answerCorrelated = answerScore >= 0.65 && stemScore >= 0.48;
      if (near) nearDupPairs += 1;
      if (answerCorrelated) answerCorrelatedPairs += 1;
      if ((near || answerCorrelated) && examples.length < 12) {
        examples.push({
          i: i + 1,
          j: j + 1,
          stemScore: Number(stemScore.toFixed(3)),
          answerScore: Number(answerScore.toFixed(3)),
          stemA: String(a?.stem ?? '').slice(0, 160),
          stemB: String(b?.stem ?? '').slice(0, 160),
          answerA: String(a?.correct ?? '').slice(0, 120),
          answerB: String(b?.correct ?? '').slice(0, 120),
        });
      }
    }
  }

  const report = {
    trial: {
      unitCode,
      loCode,
      level,
      requestedCount: count,
      modelName,
      elapsedMs,
    },
    output: {
      parsedCount: questions.length,
      validCount,
      invalidCount,
      exactDupStemCount,
      nearDupPairs,
      answerCorrelatedPairs,
    },
    examples,
  };

  const outPath = path.join(root, 'reports', 'batch50_trial_report.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(JSON.stringify(report, null, 2));
  console.log(`\nSaved report: ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
