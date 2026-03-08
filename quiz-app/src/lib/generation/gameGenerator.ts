import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGeminiModelWithDefault, getGeminiApiKey } from '@/lib/config/geminiConfig';
import {
  Lesson,
  Block,
  GameType,
  MicrobreakContent,
  VocabBlockContent,
  ExplanationBlockContent,
  PracticeBlockContent,
  DiagramBlockContent,
  WorkedExampleBlockContent,
  GuidedPracticeBlockContent,
} from '@/data/lessons/types';

const PLANNER_PROMPT = `You are planning microbreak game assignments for a lesson.
Return ONLY JSON.
Never include markdown.
Respect hard constraints and slot count exactly.`;

const GENERATOR_BASE_PROMPT = `You are an educational game generator.
Return ONLY JSON.
Never include markdown.
Use only the provided lesson digest.
Do not invent facts beyond digest.
For formula-build games: include a clear prompt naming the target formula, shuffle token order, and include at least one distractor token not used in correctSequence.
For sorting/classify games: use short gameplay-ready items only (phrases, terms, concise definitions), never lesson headings, bullets, or framing lines like "In this lesson", "What this is", "Quick recap".
For quick-win games: every answer must be exactly one or two words (never full sentences/definitions).
For fill-gap games: produce about 5 gaps, each gap must be solved by selecting exactly one single-word option, and each gap should include similar plausible one-word distractors.`;

interface GamePromptProfile {
  curriculum: 'cg2365' | 'gcse-science-physics' | 'gcse-science-biology';
  audienceInstruction: string;
  toneInstruction: string;
}

export type MicrobreakSlotAnchorType = 'check' | 'practice' | 'integrative';

export interface Slot {
  slotId: string;
  anchorBlockId: string;
  order: number;
  anchorType: MicrobreakSlotAnchorType;
}

export interface LessonDigest {
  vocabPairs: { term: string; definition: string }[];
  keyFacts: string[];
  procedures?: string[];
  misconceptions?: string[];
  diagram?: {
    id: string;
    labels: string[];
    imageUrl?: string;
  };
}

export type PlanContentSource = 'vocab' | 'facts' | 'procedure' | 'misconception' | 'diagram';

export interface Plan {
  slotId: string;
  gameType: GameType;
  rationale: string;
  contentSource: PlanContentSource;
}

interface GeneratedPlannedGame {
  slotId: string;
  content: MicrobreakContent;
}

interface GameGenerationOptions {
  gameTypes?: GameType[];
  insertAfterBlocks?: string[];
  count?: number;
}

interface EligibilityResult {
  ok: boolean;
  reason?: string;
}

function getGamePromptProfile(lesson: Lesson): GamePromptProfile {
  const lessonId = String(lesson.id || '').toLowerCase();
  const unit = String(lesson.unit || '').toLowerCase();
  const author = String(lesson.metadata?.author || '').toLowerCase();
  const isGcsePhysics = lessonId.startsWith('phy-') || unit.includes('phy');
  const isGcseBiology = lessonId.startsWith('bio-') || unit.includes('bio');
  const isGcse = isGcsePhysics || isGcseBiology || author.includes('gcse');

  if (isGcse) {
    return {
      curriculum: isGcseBiology ? 'gcse-science-biology' : 'gcse-science-physics',
      audienceInstruction: isGcseBiology
        ? 'Primary audience is a 12-year-old girl learning GCSE Biology.'
        : 'Primary audience is a 12-year-old girl learning GCSE Physics.',
      toneInstruction: 'Use a fun, warm, encouraging, age-appropriate tone while staying accurate.',
    };
  }

  return {
    curriculum: 'cg2365',
    audienceInstruction: 'Audience is Level 2 electrical trainees.',
    toneInstruction: 'Use a practical, professional vocational tone.',
  };
}

function buildAudienceTonePromptSection(profile?: GamePromptProfile): string {
  if (!profile) return '';
  return `AUDIENCE + TONE (MANDATORY):
- ${profile.audienceInstruction}
- ${profile.toneInstruction}
- Keep game wording and definition-style phrasing aligned to this audience/tone.`;
}

function buildGameTypePromptSection(gameType: GameType): string {
  switch (gameType) {
    case 'matching':
      return `GAME-TYPE RULES (matching):
- Generate 4-6 pairs.
- Left side must be concise terms/labels (prefer 1-4 words).
- Right side must be concise clues/definitions (prefer <=22 words).
- CRITICAL: For each pair, the right text must NOT contain the exact left term text.
- Avoid repetitive starter phrases across right-side definitions.`;
    case 'sorting':
      return `GAME-TYPE RULES (sorting):
- Exactly 2 buckets.
- At least 6 items.
- Item text must be short gameplay-ready phrases, not long prose.`;
    case 'spot-error':
      return `GAME-TYPE RULES (spot-error):
- Include one clear scenario.
- Include >=3 options.
- Exactly one option must be marked isError=true.`;
    case 'quick-win':
      return `GAME-TYPE RULES (quick-win):
- Include >=5 questions.
- Every answer must be exactly one or two words.
- Keep question stems concise and recall-focused.`;
    case 'sequencing':
      return `GAME-TYPE RULES (sequencing):
- Include >=4 steps.
- Provide both shuffled steps and exact correctOrder.`;
    case 'fill-gap':
      return `GAME-TYPE RULES (fill-gap):
- Produce about 5 gaps (minimum 5, maximum 6).
- Each gap options list must be single-word choices.
- Keep template concise and gameplay-ready.`;
    case 'is-correct-why':
      return `GAME-TYPE RULES (is-correct-why):
- Provide one declarative statement.
- Provide exactly one best reason index.
- Keep reasons concise and grounded in digest facts.`;
    case 'diagnosis-ranked':
      return `GAME-TYPE RULES (diagnosis-ranked):
- Provide one scenario.
- Provide at least 4 options.
- Provide exactly two ranked correct indices.`;
    case 'classify-two-bins':
      return `GAME-TYPE RULES (classify-two-bins):
- Provide two meaningful bin labels (not generic "Term/Definition").
- Provide at least 6 concise items.
- Use both bins with balanced plausible items.`;
    case 'scenario-match':
      return `GAME-TYPE RULES (scenario-match):
- Provide at least 4 scenario-answer pairs.
- Keep scenarios brief and specific.
- Keep answers concise and distinct from distractors.`;
    case 'formula-build':
      return `GAME-TYPE RULES (formula-build):
- Provide exactly one formula question per game (single prompt, single token set, single correctSequence).
- Include at least one distractor token not in correctSequence.
- Keep formula symbolic, not sentence fragments.
- Shuffle token order (do not return tokens in exact answer order).`;
    case 'tap-the-line':
      return `GAME-TYPE RULES (tap-the-line):
- Provide >=3 lines.
- Provide exactly one correctLineIndex in bounds.`;
    case 'tap-the-word':
      return `GAME-TYPE RULES (tap-the-word):
- Provide one sentence and >=3 options.
- Provide exactly one correctOptionIndex in bounds.`;
    case 'elimination':
      return `GAME-TYPE RULES (elimination):
- Provide one question and >=4 options.
- Provide exactly one correctIndex in bounds.
- Add a concise explanation when possible.`;
    default:
      return 'GAME-TYPE RULES: Follow strict schema for the requested gameType.';
  }
}

function buildSingleGameGenerationPrompt(
  plan: Plan,
  digest: LessonDigest,
  promptProfile?: GamePromptProfile
): string {
  const input = {
    plan,
    digest,
    rules: {
      includeSlotId: true,
      schemaStrict: true,
      digestOnly: true,
      singleGameOnly: true,
    },
  };

  return `${GENERATOR_BASE_PROMPT}\n\n${buildAudienceTonePromptSection(promptProfile)}\n\n${buildGameTypePromptSection(plan.gameType)}\n\nGenerate exactly ONE game for the provided slot.\nInput:\n${JSON.stringify(input, null, 2)}\n\nReturn exactly:\n{"slotId":"${plan.slotId}","content":{"breakType":"game","gameType":"${plan.gameType}",...}}`;
}

function buildSingleGameRepairPrompt(
  plan: Plan,
  digest: LessonDigest,
  failingReasons: string[],
  promptProfile?: GamePromptProfile
): string {
  return `${GENERATOR_BASE_PROMPT}\n\n${buildAudienceTonePromptSection(promptProfile)}\n\n${buildGameTypePromptSection(plan.gameType)}\n\nRepair one invalid game object.\nPlan:\n${JSON.stringify(plan, null, 2)}\n\nDigest:\n${JSON.stringify(digest, null, 2)}\n\nValidation failures:\n${JSON.stringify(failingReasons, null, 2)}\n\nReturn exactly:\n{"slotId":"${plan.slotId}","content":{"breakType":"game","gameType":"${plan.gameType}",...}}`;
}

function roundOrder(order: number): number {
  return Math.round(order * 1000) / 1000;
}

function cleanText(raw: string): string {
  return raw
    .replace(/\*\*|__|`|#+|\[|\]|\(|\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeForContainment(text: string): string {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function definitionContainsTerm(definition: string, term: string): boolean {
  const normalizedDefinition = normalizeForContainment(definition);
  const normalizedTerm = normalizeForContainment(term);
  if (!normalizedDefinition || !normalizedTerm) return false;

  const tokens = normalizedTerm.split(' ').filter(Boolean);
  if (tokens.length === 0) return false;

  const phrasePattern = `\\b${tokens.map(escapeRegex).join('\\s+')}\\b`;
  return new RegExp(phrasePattern, 'i').test(normalizedDefinition);
}

function splitSentences(text: string): string[] {
  const cleaned = cleanText(text);
  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean)
    .filter(s => s.length >= 12);
}

function extractStructuredMisconceptions(text: string): string[] {
  const lines = String(text || '').split(/\r?\n/);
  const extracted: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const match = line.match(/misconception:\s*(.+?)(?:\s*\|\s*correction:|$)/i);
    if (!match) continue;

    const value = cleanText(match[1] || '');
    if (!value) continue;
    extracted.push(value);
  }

  return extracted;
}

function extractBulletLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map(line => line.replace(/^\s*[-*]\s*/, '').trim())
    .filter(Boolean)
    .filter(line => line.length >= 8);
}

function classifyAnchorType(block: Block): MicrobreakSlotAnchorType {
  const id = block.id.toLowerCase();
  const content = block.content as { title?: string; mode?: string };
  const title = String(content?.title || '').toLowerCase();
  const mode = String(content?.mode || '').toLowerCase();

  if (id.includes('integrative') || title.includes('integrative') || mode.includes('integrative')) {
    return 'integrative';
  }
  if (id.includes('check') || title.includes('check')) {
    return 'check';
  }
  return 'practice';
}

function getMinimumSafeGameOrder(blocks: Block[]): number {
  const vocabBlocks = blocks.filter(b => b.type === 'vocab');
  const explanationBlocks = blocks.filter(b => b.type === 'explanation');

  const maxVocabOrder = vocabBlocks.length > 0 ? Math.max(...vocabBlocks.map(b => b.order)) : 0;
  const maxExplanationOrder = explanationBlocks.length > 0 ? Math.max(...explanationBlocks.map(b => b.order)) : 0;

  return explanationBlocks.length > 0 ? maxExplanationOrder : maxVocabOrder;
}

export function findMicrobreakSlots(lessonBlocks: Block[]): Slot[] {
  const sortedBlocks = [...lessonBlocks].sort((a, b) => a.order - b.order);
  const minSafeOrder = getMinimumSafeGameOrder(sortedBlocks);

  const existingMicrobreaks = sortedBlocks
    .filter(b => b.type === 'microbreak')
    .sort((a, b) => a.order - b.order);

  const occupiedOrders = new Set(sortedBlocks.map(b => roundOrder(b.order)));

  const slots: Slot[] = [];

  for (let i = 0; i < sortedBlocks.length; i++) {
    const anchor = sortedBlocks[i];
    if (anchor.type !== 'practice') continue;
    if (anchor.order < minSafeOrder) continue;

    const nextBlock = sortedBlocks[i + 1];
    const nextOrder = nextBlock ? nextBlock.order : anchor.order + 1;

    if (nextBlock?.type === 'spaced-review' || nextBlock?.type === 'socratic') continue;

    const gap = nextOrder - anchor.order;
    if (gap <= 0.05) continue;

    const hasMicrobreakInGap = existingMicrobreaks.some(
      mb => mb.order > anchor.order && mb.order < nextOrder
    );
    if (hasMicrobreakInGap) continue;

    const offset = Math.min(0.25, gap * 0.4);
    let candidateOrder = roundOrder(anchor.order + Math.max(0.05, offset));

    if (candidateOrder >= nextOrder) {
      candidateOrder = roundOrder(anchor.order + gap / 2);
    }
    if (candidateOrder <= anchor.order || candidateOrder >= nextOrder) continue;

    while (occupiedOrders.has(candidateOrder) && candidateOrder < nextOrder - 0.01) {
      candidateOrder = roundOrder(candidateOrder + 0.01);
    }
    if (candidateOrder <= anchor.order || candidateOrder >= nextOrder) continue;

    occupiedOrders.add(candidateOrder);

    const slotId = `${anchor.id}::${candidateOrder.toFixed(3)}`;
    slots.push({
      slotId,
      anchorBlockId: anchor.id,
      order: candidateOrder,
      anchorType: classifyAnchorType(anchor),
    });
  }

  return slots;
}

export function buildLessonDigest(lesson: Lesson): LessonDigest {
  const vocabPairs = lesson.blocks
    .filter(b => b.type === 'vocab')
    .flatMap(b => {
      const content = b.content as VocabBlockContent;
      return (content.terms || []).map(t => ({ term: cleanText(t.term), definition: cleanText(t.definition) }));
    });

  const explanationFacts = lesson.blocks
    .filter(b => b.type === 'explanation')
    .flatMap(b => {
      const content = b.content as ExplanationBlockContent;
      return [...splitSentences(content.title || ''), ...splitSentences(content.content || ''), ...extractBulletLines(content.content || '')];
    });

  const explanationMisconceptions = lesson.blocks
    .filter(b => b.type === 'explanation')
    .flatMap(b => {
      const content = b.content as ExplanationBlockContent;
      return extractStructuredMisconceptions(content.content || '');
    });

  const practiceFacts = lesson.blocks
    .filter(b => b.type === 'practice' || b.type === 'spaced-review')
    .flatMap(b => {
      const content = b.content as PracticeBlockContent;
      const title = typeof content.title === 'string' ? [cleanText(content.title)] : [];
      const questions = Array.isArray(content.questions)
        ? content.questions.flatMap(q => [cleanText(q.questionText || ''), cleanText(q.hint || '')].filter(Boolean))
        : [];
      return [...title, ...questions];
    });

  const proceduresFromWorked = lesson.blocks
    .filter(b => b.type === 'worked-example')
    .flatMap(b => {
      const content = b.content as WorkedExampleBlockContent;
      return (content.steps || []).map(s => cleanText(s.description || '')).filter(Boolean);
    });

  const proceduresFromGuided = lesson.blocks
    .filter(b => b.type === 'guided-practice')
    .flatMap(b => {
      const content = b.content as GuidedPracticeBlockContent;
      return (content.steps || []).map(s => cleanText(s.prompt || '')).filter(Boolean);
    });

  const metadataUnknown = lesson.metadata as Record<string, unknown>;
  const metaMisconceptions = Array.isArray(metadataUnknown?.misconceptions)
    ? (metadataUnknown.misconceptions as Array<Record<string, unknown>>)
        .flatMap(m => [String(m.misconception || ''), String(m.correction || '')])
        .map(cleanText)
        .filter(Boolean)
    : [];

  const diagramBlock = lesson.blocks.find(b => b.type === 'diagram');
  const diagram = diagramBlock
    ? (() => {
        const content = diagramBlock.content as DiagramBlockContent;
        return {
          id: diagramBlock.id,
          labels: (content.elementIds || []).map(cleanText).filter(Boolean),
          imageUrl: typeof content.imageUrl === 'string' && content.imageUrl.trim().length > 0
            ? content.imageUrl.trim()
            : undefined,
        };
      })()
    : undefined;

  const keyFacts = [...explanationFacts, ...practiceFacts]
    .map(cleanText)
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 80);

  const procedures = [...proceduresFromWorked, ...proceduresFromGuided]
    .map(cleanText)
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 30);

  const misconceptions = [...metaMisconceptions, ...explanationMisconceptions]
    .map(cleanText)
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 20);

  return {
    vocabPairs,
    keyFacts,
    procedures: procedures.length ? procedures : undefined,
    misconceptions: misconceptions.length ? misconceptions : undefined,
    diagram,
  };
}

function getGameFamily(gameType: GameType): string {
  if (['matching', 'sorting', 'classify-two-bins', 'scenario-match'].includes(gameType)) return 'classification';
  if (['quick-win', 'fill-gap', 'tap-the-word', 'tap-the-line', 'elimination'].includes(gameType)) return 'recall';
  if (['spot-error', 'is-correct-why', 'diagnosis-ranked'].includes(gameType)) return 'reasoning';
  if (['sequencing', 'formula-build'].includes(gameType)) return 'ordering';
  return 'other';
}

export function getGameTypeEligibility(gameType: GameType, digest: LessonDigest): EligibilityResult {
  const vocabCount = digest.vocabPairs.length;
  const factCount = digest.keyFacts.length;
  const procedureCount = digest.procedures?.length || 0;
  const misconceptionCount = digest.misconceptions?.length || 0;

  switch (gameType) {
    case 'matching':
      return vocabCount >= 4 ? { ok: true } : { ok: false, reason: 'requires at least 4 vocab pairs' };
    case 'fill-gap':
      return vocabCount >= 3 ? { ok: true } : { ok: false, reason: 'requires at least 3 vocab pairs' };
    case 'sequencing':
      return procedureCount >= 4 ? { ok: true } : { ok: false, reason: 'requires at least 4 procedures' };
    case 'spot-error':
      return misconceptionCount >= 1 || factCount >= 6
        ? { ok: true }
        : { ok: false, reason: 'requires misconceptions or enough factual contrast' };
    case 'diagnosis-ranked':
      return misconceptionCount >= 2 || factCount >= 8
        ? { ok: true }
        : { ok: false, reason: 'requires multiple plausible causes' };
    case 'sorting':
      return vocabCount >= 4 || factCount >= 6 ? { ok: true } : { ok: false, reason: 'insufficient material for sorting' };
    case 'quick-win':
      return vocabCount >= 3 || factCount >= 5 ? { ok: true } : { ok: false, reason: 'insufficient recall material' };
    case 'is-correct-why':
      return factCount >= 5 ? { ok: true } : { ok: false, reason: 'insufficient facts for reason checking' };
    case 'classify-two-bins':
      return (misconceptionCount >= 2 && factCount >= 4) || vocabCount >= 6
        ? { ok: true }
        : { ok: false, reason: 'requires misconceptions+facts or richer vocab for non-trivial two-bin classification' };
    case 'scenario-match':
      return factCount >= 6 ? { ok: true } : { ok: false, reason: 'insufficient facts for scenario matching' };
    case 'formula-build':
      return extractFormulaSequencesFromDigest(digest).length > 0
        ? { ok: true }
        : { ok: false, reason: 'requires at least one extractable formula in digest' };
    case 'tap-the-line':
      return factCount >= 4 ? { ok: true } : { ok: false, reason: 'insufficient lines from key facts' };
    case 'tap-the-word':
      return factCount >= 4 ? { ok: true } : { ok: false, reason: 'insufficient sentence facts' };
    case 'elimination':
      return factCount >= 6 ? { ok: true } : { ok: false, reason: 'insufficient options from digest facts' };
    default:
      return { ok: false, reason: 'unsupported game type' };
  }
}

function getEligibleTypes(allowedGameTypes: GameType[], digest: LessonDigest): GameType[] {
  const seen = new Set<GameType>();
  const eligible: GameType[] = [];

  for (const type of allowedGameTypes) {
    if (seen.has(type)) continue;
    seen.add(type);
    if (getGameTypeEligibility(type, digest).ok) {
      eligible.push(type);
    }
  }

  return eligible;
}

function parseJson<T>(text: string): T {
  const trimmed = text.trim();
  return JSON.parse(trimmed) as T;
}

function chooseFallbackTypes(slots: Slot[], eligibleTypes: GameType[]): GameType[] {
  if (eligibleTypes.length === 0) return [];

  const familyByType = new Map<GameType, string>(eligibleTypes.map(t => [t, getGameFamily(t)]));
  const result: GameType[] = [];
  let previousFamily = '';

  for (let i = 0; i < slots.length; i++) {
    const sorted = [...eligibleTypes].sort((a, b) => {
      const familyA = familyByType.get(a) || 'other';
      const familyB = familyByType.get(b) || 'other';
      const repeatPenaltyA = familyA === previousFamily ? 1 : 0;
      const repeatPenaltyB = familyB === previousFamily ? 1 : 0;
      if (repeatPenaltyA !== repeatPenaltyB) return repeatPenaltyA - repeatPenaltyB;
      return result.filter(t => t === a).length - result.filter(t => t === b).length;
    });

    const picked = sorted[0] || eligibleTypes[i % eligibleTypes.length];
    result.push(picked);
    previousFamily = familyByType.get(picked) || 'other';
  }

  return result;
}

function validatePlan(
  plans: Plan[],
  slots: Slot[],
  allowedTypes: Set<GameType>,
  digest: LessonDigest
): { valid: boolean; reason?: string } {
  if (plans.length !== slots.length) {
    return { valid: false, reason: `plan length ${plans.length} does not match slot count ${slots.length}` };
  }

  const slotIds = new Set(slots.map(s => s.slotId));
  const usedSlots = new Set<string>();

  for (const plan of plans) {
    if (!slotIds.has(plan.slotId)) {
      return { valid: false, reason: `unknown slotId ${plan.slotId}` };
    }
    if (usedSlots.has(plan.slotId)) {
      return { valid: false, reason: `duplicate slot usage ${plan.slotId}` };
    }
    usedSlots.add(plan.slotId);

    if (!allowedTypes.has(plan.gameType)) {
      return { valid: false, reason: `game type ${plan.gameType} not in allowedGameTypes` };
    }

    const eligibility = getGameTypeEligibility(plan.gameType, digest);
    if (!eligibility.ok) {
      return { valid: false, reason: `ineligible game ${plan.gameType}: ${eligibility.reason}` };
    }
  }

  return { valid: true };
}

async function getJsonModel() {
  const apiKey = getGeminiApiKey();
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({
    model: getGeminiModelWithDefault(),
    generationConfig: {
      temperature: 0.35,
      responseMimeType: 'application/json',
    },
  });
}

export async function planMicrobreaks(
  slots: Slot[],
  digest: LessonDigest,
  allowedGameTypes: GameType[],
  promptProfile?: GamePromptProfile
): Promise<Plan[]> {
  if (slots.length === 0) return [];

  const eligibleTypes = getEligibleTypes(allowedGameTypes, digest);
  if (eligibleTypes.length === 0) {
    throw new Error('No eligible game types for this lesson digest and selected whitelist');
  }

  const allowedTypeSet = new Set(eligibleTypes);
  const model = await getJsonModel();

  const plannerInput = {
    slots,
    allowedGameTypes: eligibleTypes,
    digest,
    hardRules: {
      exactPlanLength: slots.length,
      uniqueSlotIds: true,
      allowedOnly: true,
      varietyAcrossFamilies: true,
    },
  };

  for (let attempt = 1; attempt <= 3; attempt++) {
    const prompt = `${PLANNER_PROMPT}\n\n${buildAudienceTonePromptSection(promptProfile)}\n\nInput:\n${JSON.stringify(plannerInput, null, 2)}\n\nReturn JSON array of objects exactly: [{"slotId":"...","gameType":"...","rationale":"...","contentSource":"vocab|facts|procedure|misconception|diagram"}]`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    try {
      const parsed = parseJson<Plan[]>(text);
      const planValidation = validatePlan(parsed, slots, allowedTypeSet, digest);
      if (planValidation.valid) {
        return parsed;
      }
      console.warn(`[GameGenerator] plan attempt ${attempt} rejected: ${planValidation.reason}`);
    } catch (error) {
      console.warn(`[GameGenerator] plan attempt ${attempt} failed parse: ${error instanceof Error ? error.message : 'unknown'}`);
    }
  }

  const fallbackTypes = chooseFallbackTypes(slots, eligibleTypes);
  const fallbackPlan: Plan[] = slots.map((slot, index) => ({
    slotId: slot.slotId,
    gameType: fallbackTypes[index],
    rationale: `Fallback assignment for ${slot.anchorType} slot`,
    contentSource:
      fallbackTypes[index] === 'sequencing'
          ? 'procedure'
          : fallbackTypes[index] === 'spot-error' || fallbackTypes[index] === 'diagnosis-ranked'
            ? 'misconception'
            : digest.vocabPairs.length >= digest.keyFacts.length
              ? 'vocab'
              : 'facts',
  }));

  const validation = validatePlan(fallbackPlan, slots, new Set(eligibleTypes), digest);
  if (!validation.valid) {
    throw new Error(`Failed to produce valid fallback plan: ${validation.reason}`);
  }

  return fallbackPlan;
}
function extractDigestTokenSet(digest: LessonDigest): Set<string> {
  const corpus = [
    ...digest.vocabPairs.flatMap(v => [v.term, v.definition]),
    ...digest.keyFacts,
    ...(digest.procedures || []),
    ...(digest.misconceptions || []),
    ...(digest.diagram?.labels || []),
  ]
    .join(' ')
    .toLowerCase();

  const tokens = corpus
    .split(/[^a-z0-9]+/)
    .map(t => t.trim())
    // Keep 3+ chars so common domain acronyms (RCD, MCB, CPC) are grounded.
    .filter(t => t.length >= 3);

  return new Set(tokens);
}

function hasDigestGrounding(text: string, digestTokens: Set<string>): boolean {
  const tokens = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 3);

  if (tokens.length === 0) return false;
  return tokens.some(t => digestTokens.has(t));
}

function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

function normalizeToken(value: unknown): string {
  return String(value || '').trim();
}

const FORMULA_OPERATOR_TOKENS = new Set(['=', '+', '-', '/', '*', 'x', '×', '(', ')']);
const FORMULA_STOPWORDS = new Set([
  'the', 'an', 'and', 'or', 'for', 'to', 'of', 'in', 'on', 'by', 'is', 'are', 'was', 'were',
  'be', 'this', 'that', 'standard', 'formula', 'build', 'target', 'from', 'tokens', 'calculate',
  'used', 'use', 'select', 'state', 'quick', 'break', 'activity',
]);

function normalizeFormulaToken(token: string): string {
  const normalized = normalizeToken(token);
  if (normalized === '×') return 'x';
  return normalized;
}

function isFormulaSymbolToken(token: string): boolean {
  const normalized = normalizeFormulaToken(token);
  if (!normalized) return false;
  if (FORMULA_OPERATOR_TOKENS.has(normalized)) return true;
  if (/^\d+(\.\d+)?$/.test(normalized)) return true;
  if (FORMULA_STOPWORDS.has(normalized.toLowerCase())) return false;
  if (/^[a-z]+$/.test(normalized)) return false;
  return /^[A-Za-z\u0391-\u03C9\u00B5\u03A6\u03A9][A-Za-z0-9\u0391-\u03C9\u00B5\u03A6\u03A9²³^]{0,6}$/.test(normalized);
}

function tokenizeFormulaExpression(expression: string): string[] {
  const raw = normalizeToken(expression);
  if (!raw) return [];

  const matches = raw.match(/[A-Za-z\u0391-\u03C9\u00B5\u03A6\u03A9][A-Za-z0-9\u0391-\u03C9\u00B5\u03A6\u03A9²³^]{0,6}|\d+(?:\.\d+)?|[=+\-*/()x×]/g) || [];
  return matches
    .map(normalizeFormulaToken)
    .filter(isFormulaSymbolToken);
}

function hasRhsMathOperator(tokens: string[]): boolean {
  const equalsIndex = tokens.indexOf('=');
  if (equalsIndex < 0) return false;
  return tokens.slice(equalsIndex + 1).some(token => ['+', '-', '/', '*', 'x'].includes(token));
}

function isValidFormulaSequence(tokens: string[]): boolean {
  if (tokens.length < 4) return false;
  const equalsIndex = tokens.indexOf('=');
  if (equalsIndex <= 0 || equalsIndex >= tokens.length - 1) return false;
  if (!tokens.every(isFormulaSymbolToken)) return false;
  return hasRhsMathOperator(tokens);
}

function extractEquationCandidates(text: string): string[] {
  const cleaned = normalizeToken(text);
  if (!cleaned || !cleaned.includes('=')) return [];

  const candidates: string[] = [];
  const regex = /([A-Za-z\u0391-\u03C9\u00B5\u03A6\u03A9][A-Za-z0-9\u0391-\u03C9\u00B5\u03A6\u03A9²³^]{0,6})\s*=\s*([A-Za-z0-9\u0391-\u03C9\u00B5\u03A6\u03A9²³^().+\-/*x×\s]{1,100})/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(cleaned)) !== null) {
    const lhs = normalizeToken(match[1]);
    const rhs = normalizeToken(match[2]).replace(/[.,;:!?]+$/, '');
    if (!lhs || !rhs) continue;
    candidates.push(`${lhs} = ${rhs}`);
  }
  return candidates;
}

function dedupeTokens(tokens: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const token of tokens) {
    const normalized = normalizeToken(token);
    if (!normalized) continue;
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

function deterministicShuffleTokens(tokens: string[], seed: string): string[] {
  const withKeys = tokens.map((token, idx) => ({
    token,
    idx,
    key: stableHash(`${seed}|${token}|${idx}`),
  }));
  withKeys.sort((a, b) => (a.key - b.key) || (a.idx - b.idx));
  const shuffled = withKeys.map(x => x.token);

  if (shuffled.length > 1 && shuffled.every((token, i) => token === tokens[i])) {
    return [...shuffled.slice(1), shuffled[0]];
  }
  return shuffled;
}

function buildFormulaDistractors(correctSequence: string[], digest: LessonDigest, count: number = 2): string[] {
  const correctSet = new Set(correctSequence.map(t => t.toLowerCase()));
  const digestFormulaTokens = [
    ...digest.keyFacts,
    ...digest.vocabPairs.flatMap(v => [v.term, v.definition]),
    ...(digest.procedures || []),
  ].flatMap(item => tokenizeFormulaExpression(item));

  const operatorCandidates = ['+', '-', '/', '*', 'x', 'P', 'Q', 'R', 'V', 'I', 'B', 'A', 'Φ', 'Zs', 'Ze', 'R1', 'R2'];
  const candidates = dedupeTokens([...digestFormulaTokens, ...operatorCandidates])
    .map(normalizeFormulaToken)
    .filter(token => isFormulaSymbolToken(token) && !correctSet.has(token.toLowerCase()));

  return candidates.slice(0, count);
}

interface FormulaQuestionPayload {
  prompt: string;
  tokens: string[];
  correctSequence: string[];
  timerSeconds: number;
}

function buildFormulaQuestionFromSequence(
  sequence: string[],
  digest: LessonDigest,
  index: number,
  prompt?: string
): FormulaQuestionPayload {
  const normalizedSequence = sequence.map(normalizeFormulaToken).filter(isFormulaSymbolToken).slice(0, 10);
  const correctSequence = isValidFormulaSequence(normalizedSequence) ? normalizedSequence : ['V', '=', 'I', '*', 'R'];
  const distractors = buildFormulaDistractors(correctSequence, digest, 3);
  const requiredDistractorCount = correctSequence.length >= 5 ? 2 : 1;
  const selectedDistractors = distractors.slice(0, Math.max(requiredDistractorCount, 1));

  let tokens = [...correctSequence, ...selectedDistractors];
  if (tokens.length <= correctSequence.length) {
    const fallbackDistractor = ['+', '-', '/'].find(token => !correctSequence.includes(token));
    if (fallbackDistractor) tokens = [...tokens, fallbackDistractor];
  }

  let shuffledTokens = deterministicShuffleTokens(tokens, `${correctSequence.join('|')}|${index}`);
  if (tokens.join('|') === shuffledTokens.join('|') && shuffledTokens.length > 1) {
    shuffledTokens = [...shuffledTokens.slice(1), shuffledTokens[0]];
  }

  return {
    prompt: normalizeToken(prompt) || `Build formula ${index + 1}: ${correctSequence.join(' ')}`,
    tokens: shuffledTokens,
    correctSequence,
    timerSeconds: 11,
  };
}

function buildSafeSortingContentFromDigest(digest: LessonDigest): MicrobreakContent {
  const vocabPairs = digest.vocabPairs
    .map(v => ({ term: normalizeGameplaySnippet(v.term, 50), definition: normalizeGameplaySnippet(v.definition, 90) }))
    .filter(v => v.term.length > 0 && v.definition.length > 0)
    .slice(0, 3);

  const vocabItems = vocabPairs.flatMap(v => [
    { text: v.term, correctBucket: 0 as const },
    { text: v.definition, correctBucket: 1 as const },
  ]);

  const conciseFacts = digest.keyFacts
    .map(f => normalizeGameplaySnippet(f, 85))
    .filter(f => !isInvalidQuickGameplayItem(f, 100));

  const seen = new Set<string>();
  const items = [...vocabItems];
  for (const fact of conciseFacts) {
    if (items.length >= 6) break;
    const key = fact.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ text: fact, correctBucket: (items.length % 2 === 0 ? 0 : 1) as 0 | 1 });
  }

  while (items.length < 6) {
    const n = items.length + 1;
    items.push({ text: `Concept ${n}`, correctBucket: (n % 2 === 0 ? 1 : 0) as 0 | 1 });
  }

  return {
    breakType: 'game',
    gameType: 'sorting',
    duration: 90,
    buckets: ['Term', 'Definition'],
    items: items.slice(0, 6),
  };
}

function hardenSortingContent(content: MicrobreakContent, digest: LessonDigest): MicrobreakContent {
  if (content.breakType !== 'game' || content.gameType !== 'sorting') return content;

  const safeFallback = buildSafeSortingContentFromDigest(digest) as Extract<MicrobreakContent, { gameType: 'sorting' }>;
  const buckets = Array.isArray(content.buckets) && content.buckets.length === 2
    ? [
        normalizeGameplaySnippet(String(content.buckets[0] || ''), 24) || 'Term',
        normalizeGameplaySnippet(String(content.buckets[1] || ''), 24) || 'Definition',
      ] as [string, string]
    : safeFallback.buckets;

  const cleanedItems = (Array.isArray(content.items) ? content.items : [])
    .map((item, idx) => {
      const text = normalizeGameplaySnippet(String(item?.text || ''), 100);
      const bucket = item?.correctBucket === 0 || item?.correctBucket === 1
        ? item.correctBucket
        : ((idx % 2) as 0 | 1);
      return { text, correctBucket: bucket as 0 | 1 };
    })
    .filter(item => !isInvalidQuickGameplayItem(item.text, 100));

  const deduped: Array<{ text: string; correctBucket: 0 | 1 }> = [];
  const seen = new Set<string>();
  for (const item of cleanedItems) {
    const key = item.text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  const merged = [...deduped];
  const fallbackItems = safeFallback.items || [];
  for (const candidate of fallbackItems) {
    if (merged.length >= 6) break;
    if (merged.some(item => item.text.toLowerCase() === candidate.text.toLowerCase())) continue;
    merged.push(candidate);
  }

  const bucketsUsed = new Set(merged.map(i => i.correctBucket).filter(bucket => bucket === 0 || bucket === 1));
  if (bucketsUsed.size < 2 && merged.length > 0) {
    merged[0].correctBucket = 0;
    if (merged.length > 1) merged[1].correctBucket = 1;
  }

  return {
    ...content,
    buckets,
    items: merged.slice(0, 6),
  };
}

function buildSafeClassifyTwoBinsContentFromDigest(digest: LessonDigest): MicrobreakContent {
  const facts = digest.keyFacts
    .map(f => normalizeGameplaySnippet(f, 95))
    .filter(f => !isInvalidQuickGameplayItem(f, 100))
    .filter(looksLikeDeclarativeStatement);

  const misconceptions = (digest.misconceptions || [])
    .map(m => normalizeGameplaySnippet(m, 95))
    .filter(m => !isInvalidQuickGameplayItem(m, 100))
    .filter(looksLikeDeclarativeStatement);

  const factItems = facts.slice(0, 3).map(text => ({ text, correctBin: 'left' as const }));
  const misconceptionItems = misconceptions.slice(0, 3).map(text => ({ text, correctBin: 'right' as const }));
  const statementItems = [...factItems, ...misconceptionItems];
  if (statementItems.length >= 6) {
    return {
      breakType: 'game',
      gameType: 'classify-two-bins',
      leftLabel: 'Accurate Statement',
      rightLabel: 'Misconception',
      items: statementItems.slice(0, 6),
    };
  }

  const vocab = digest.vocabPairs
    .map(v => normalizeGameplaySnippet(v.term, 55))
    .filter(v => !isInvalidQuickGameplayItem(v, 70));

  const isProtective = (text: string) => /(ocpd|rcd|mcb|fuse|breaker|protective|device)/i.test(text);
  const leftTerms = vocab.filter(v => !isProtective(v)).slice(0, 4).map(text => ({ text, correctBin: 'left' as const }));
  const rightTerms = vocab.filter(v => isProtective(v)).slice(0, 4).map(text => ({ text, correctBin: 'right' as const }));
  const items = [...leftTerms.slice(0, 3), ...rightTerms.slice(0, 3)];

  if (items.length < 6) {
    const digestCandidates = dedupeTokens([
      ...digest.vocabPairs
        .map((pair) => normalizeGameplaySnippet(pair.term, 55))
        .filter((text) => !isInvalidQuickGameplayItem(text, 70)),
      ...digest.keyFacts
        .flatMap((fact) =>
          String(fact || '')
            .split(/[^A-Za-z0-9-]+/)
            .map(normalizeSingleWordCandidate)
            .filter(isSingleWordCandidate)
        )
        .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`),
    ])
      .filter(Boolean)
      .map((text) => ({
        text,
        correctBin: isProtective(text) ? ('right' as const) : ('left' as const),
      }));

    for (const candidate of digestCandidates) {
      if (items.length >= 6) break;
      if (items.some(i => i.text.toLowerCase() === candidate.text.toLowerCase())) continue;
      items.push(candidate);
    }
  }

  // Last resort: duplicate grounded items with suffix so validator still sees digest tokens.
  let copyIndex = 1;
  while (items.length < 6 && items.length > 0) {
    const source = items[(copyIndex - 1) % items.length];
    const text = `${source.text} ${copyIndex + 1}`;
    if (!items.some(i => i.text.toLowerCase() === text.toLowerCase())) {
      items.push({ text, correctBin: source.correctBin });
    }
    copyIndex++;
  }

  return {
    breakType: 'game',
    gameType: 'classify-two-bins',
    leftLabel: 'Path / Circuit Element',
    rightLabel: 'Protective Element',
    items: items.slice(0, 6),
  };
}

function hardenClassifyTwoBinsContent(content: MicrobreakContent, digest: LessonDigest): MicrobreakContent {
  if (content.breakType !== 'game' || content.gameType !== 'classify-two-bins') return content;

  const safeFallback = buildSafeClassifyTwoBinsContentFromDigest(digest) as Extract<MicrobreakContent, { gameType: 'classify-two-bins' }>;
  const leftLabel = normalizeGameplaySnippet(String(content.leftLabel || ''), 28);
  const rightLabel = normalizeGameplaySnippet(String(content.rightLabel || ''), 28);
  const labelsInvalid =
    !leftLabel ||
    !rightLabel ||
    isLikelyInstructionalFraming(leftLabel) ||
    isLikelyInstructionalFraming(rightLabel) ||
    isGenericClassificationLabel(leftLabel) ||
    isGenericClassificationLabel(rightLabel);

  const cleanedItems = (Array.isArray(content.items) ? content.items : [])
    .map((item) => ({
      text: normalizeGameplaySnippet(String(item?.text || ''), 100),
      correctBin: item?.correctBin === 'left' || item?.correctBin === 'right' ? item.correctBin : 'left' as const,
    }))
    .filter(item => !isInvalidQuickGameplayItem(item.text, 100))
    .filter(item => !hasDanglingEllipsis(item.text));

  const truthVsMisconceptionLabels = labelsIndicateTruthVsMisconception(leftLabel, rightLabel);
  const hasCorrectionStyleMisconception = truthVsMisconceptionLabels
    && cleanedItems.some(item => item.correctBin === 'right' && isLikelyCorrectionStatement(item.text));

  if (cleanedItems.length < 6 || labelsInvalid || hasObviousFormatSplit(cleanedItems) || hasCorrectionStyleMisconception) {
    return safeFallback;
  }

  const binsUsed = new Set(cleanedItems.map(i => i.correctBin));
  if (binsUsed.size < 2) return safeFallback;

  return {
    ...content,
    leftLabel,
    rightLabel,
    items: cleanedItems.slice(0, 6),
  };
}

function hardenFormulaBuildContent(content: MicrobreakContent, digest: LessonDigest): MicrobreakContent {
  if (content.breakType !== 'game' || content.gameType !== 'formula-build') return content;

  const providedQuestionList = Array.isArray((content as { questions?: Array<{ prompt?: string; correctSequence?: string[] }> }).questions)
    ? (content as { questions?: Array<{ prompt?: string; correctSequence?: string[] }> }).questions ?? []
    : [];
  const firstProvidedQuestion = providedQuestionList[0];
  const firstProvidedSequence = Array.isArray(firstProvidedQuestion?.correctSequence)
    ? firstProvidedQuestion.correctSequence
    : [];

  const topLevelProvidedSequence = Array.isArray(content.correctSequence) ? content.correctSequence : [];
  const candidateSequence = firstProvidedSequence.length > 0 ? firstProvidedSequence : topLevelProvidedSequence;
  const normalizedProvided = candidateSequence.map(normalizeFormulaToken).filter(isFormulaSymbolToken).slice(0, 10);

  const digestSequence = extractFormulaSequencesFromDigest(digest)[0];
  const selectedSequence = isValidFormulaSequence(normalizedProvided)
    ? normalizedProvided
    : (digestSequence && isValidFormulaSequence(digestSequence) ? digestSequence : ['V', '=', 'I', '*', 'R']);

  const prompt =
    normalizeToken(firstProvidedQuestion?.prompt)
    || normalizeToken((content as { prompt?: string }).prompt)
    || `Build this formula: ${selectedSequence.join(' ')}`;

  const singleQuestion = buildFormulaQuestionFromSequence(selectedSequence, digest, 0, prompt);

  return {
    ...content,
    prompt: singleQuestion.prompt,
    tokens: singleQuestion.tokens,
    correctSequence: singleQuestion.correctSequence,
    timerSeconds: singleQuestion.timerSeconds,
  };
}

function hardenFillGapContent(content: MicrobreakContent, digest: LessonDigest): MicrobreakContent {
  if (content.breakType !== 'game' || content.gameType !== 'fill-gap') return content;

  const safeFallback = buildSafeFillGapContentFromDigest(digest) as Extract<MicrobreakContent, { gameType: 'fill-gap' }>;
  const incomingGaps = Array.isArray(content.gaps) ? content.gaps : [];
  const pool = collectFillGapWordPool(digest);
  const fallbackPool = pool.length > 0 ? pool : ['current', 'voltage', 'resistance', 'neutral', 'earth', 'circuit'];

  const sanitized = incomingGaps
    .slice(0, 5)
    .map((gap, idx) => {
      const id = normalizeToken(gap.id) || `g${idx + 1}`;
      const rawOptions = Array.isArray(gap.options) ? gap.options : [];
      const normalizedOptions = rawOptions
        .map(opt => normalizeSingleWordCandidate(String(opt || '')))
        .filter(isSingleWordCandidate);

      const unique = dedupeTokens(normalizedOptions).slice(0, 3);
      const correctRaw = rawOptions[gap.correctOptionIndex];
      const correct = normalizeSingleWordCandidate(String(correctRaw || unique[0] || fallbackPool[idx % fallbackPool.length]));
      if (!isSingleWordCandidate(correct)) return null;

      const options = [...unique];
      if (!options.includes(correct)) options.unshift(correct);
      while (options.length < 3) {
        const candidate = fallbackPool[(idx + options.length) % fallbackPool.length];
        if (!options.includes(candidate) && isSingleWordCandidate(candidate)) {
          options.push(candidate);
        } else {
          break;
        }
      }

      const cleanedOptions = dedupeTokens(options).slice(0, 3);
      if (cleanedOptions.length < 3) return null;
      const shuffled = deterministicShuffleTokens(cleanedOptions, `${id}:${correct}`);
      const correctOptionIndex = shuffled.findIndex(opt => opt === correct);

      return {
        id,
        options: shuffled,
        correctOptionIndex: correctOptionIndex >= 0 ? correctOptionIndex : 0,
        answer: correct,
      };
    })
    .filter((gap): gap is { id: string; options: string[]; correctOptionIndex: number; answer: string } => Boolean(gap));

  if (sanitized.length < 5) {
    return safeFallback;
  }

  const textTemplate = typeof content.textTemplate === 'string' ? content.textTemplate : '';
  const hasPlaceholders = sanitized.every(g => textTemplate.includes(`[${g.id}]`));
  const template = hasPlaceholders
    ? textTemplate
    : sanitized.map((gap, idx) => `${idx + 1}. ${buildFillGapSentence(gap.answer, gap.id, digest)}`).join('\n');

  return {
    ...content,
    prompt: normalizeToken((content as { prompt?: string }).prompt) || 'Pick the one-word term that best completes each gap.',
    textTemplate: template,
    gaps: sanitized.map((gap) => ({
      id: gap.id,
      options: gap.options,
      correctOptionIndex: gap.correctOptionIndex,
    })),
  };
}

function hardenQuickWinContent(content: MicrobreakContent, digest: LessonDigest): MicrobreakContent {
  if (content.breakType !== 'game' || content.gameType !== 'quick-win') return content;

  const fallbackQuestions = digest.vocabPairs.slice(0, 5).map((pair, idx) => ({
    question: normalizeGameplaySnippet(`Word for: ${pair.definition || pair.term}`, 120) || `Quick recall ${idx + 1}`,
    answer: normalizeQuickWinAnswer(pair.term || pair.definition || `Term ${idx + 1}`) || `Term${idx + 1}`,
  }));
  const defaultFallbackQuestions = fallbackQuestions.length > 0
    ? fallbackQuestions
    : Array.from({ length: 5 }, (_, idx) => ({
        question: normalizeGameplaySnippet(digest.keyFacts[idx] || `Quick recall ${idx + 1}`, 120) || `Quick recall ${idx + 1}`,
        answer: normalizeQuickWinAnswer(digest.keyFacts[idx] || `Term ${idx + 1}`) || `Term${idx + 1}`,
      }));

  const incoming = Array.isArray(content.questions) ? content.questions : [];
  const sanitized = incoming
    .slice(0, 7)
    .map((q, idx) => {
      const question = normalizeGameplaySnippet(String(q?.question || '').trim(), 140) || `Quick recall ${idx + 1}`;
      const answer = normalizeQuickWinAnswer(String(q?.answer || '').trim());
      return {
        question,
        answer: answer || defaultFallbackQuestions[idx % defaultFallbackQuestions.length]?.answer || `Term${idx + 1}`,
      };
    })
    .filter(q => q.question.length > 0 && q.answer.length > 0);

  const questions = sanitized.length >= 5
    ? sanitized.slice(0, 6)
    : [...sanitized, ...defaultFallbackQuestions].slice(0, 5);

  return {
    ...content,
    questions,
  };
}

function hardenMatchingContent(content: MicrobreakContent, digest: LessonDigest): MicrobreakContent {
  if (content.breakType !== 'game' || content.gameType !== 'matching') return content;

  const fallbackPairs = buildFallbackMatchingPairs(digest);
  const incoming = Array.isArray(content.pairs) ? content.pairs : [];
  const seenLeft = new Set<string>();

  const sanitized = incoming
    .map((pair) => ({
      left: normalizeGameplaySnippet(String(pair?.left || '').trim(), 80),
      right: normalizeGameplaySnippet(String(pair?.right || '').trim(), 160),
    }))
    .filter((pair) => pair.left.length > 0 && pair.right.length > 0)
    .filter((pair) => !definitionContainsTerm(pair.right, pair.left))
    .filter((pair) => {
      if (seenLeft.has(pair.left)) return false;
      seenLeft.add(pair.left);
      return true;
    });

  const merged = [...sanitized];
  for (const pair of fallbackPairs) {
    if (merged.length >= 6) break;
    if (merged.some((existing) => existing.left === pair.left)) continue;
    if (definitionContainsTerm(pair.right, pair.left)) continue;
    merged.push(pair);
  }

  const pairs = merged.length >= 4 ? merged.slice(0, 6) : fallbackPairs.slice(0, 4);

  return {
    ...content,
    pairs,
  };
}

function hardenGeneratedGameContent(content: MicrobreakContent, digest: LessonDigest): MicrobreakContent {
  let hardened = content;
  hardened = hardenMatchingContent(hardened, digest);
  hardened = hardenSortingContent(hardened, digest);
  hardened = hardenClassifyTwoBinsContent(hardened, digest);
  hardened = hardenFormulaBuildContent(hardened, digest);
  hardened = hardenFillGapContent(hardened, digest);
  hardened = hardenQuickWinContent(hardened, digest);
  return hardened;
}

function extractFormulaSequencesFromDigest(digest: LessonDigest): string[][] {
  const corpus = [
    ...digest.keyFacts,
    ...digest.vocabPairs.flatMap(v => [v.term, v.definition]),
    ...(digest.procedures || []),
  ];

  const seen = new Set<string>();
  const sequences: string[][] = [];

  for (const raw of corpus) {
    const text = normalizeToken(raw);
    if (!text.includes('=')) continue;
    const candidates = extractEquationCandidates(text);
    for (const candidate of candidates) {
      const tokens = tokenizeFormulaExpression(candidate);
      if (isValidFormulaSequence(tokens)) {
        const signature = tokens.join('|');
        if (seen.has(signature)) continue;
        seen.add(signature);
        sequences.push(tokens);
        if (sequences.length >= 6) return sequences;
      }
    }
  }

  return sequences;
}

function isLikelyInstructionalFraming(text: string): boolean {
  const normalized = String(text || '').trim().toLowerCase();
  if (!normalized) return false;

  if (
    /^[-*#]/.test(normalized) ||
    normalized.startsWith('in this lesson') ||
    normalized.startsWith('you will learn') ||
    normalized.startsWith('what this is') ||
    normalized.startsWith('why it matters') ||
    normalized.startsWith('key takeaways') ||
    normalized.startsWith('coming up next') ||
    normalized.startsWith('quick recap')
  ) {
    return true;
  }

  return false;
}

function hasDanglingEllipsis(text: string): boolean {
  return /\.\.\.\s*$/.test(String(text || '').trim());
}

function labelsIndicateTruthVsMisconception(leftLabel: string, rightLabel: string): boolean {
  const left = String(leftLabel || '').toLowerCase();
  const right = String(rightLabel || '').toLowerCase();
  const leftIsTruth = /(accurate|correct|true|fact)/.test(left);
  const rightIsMisconception = /(misconception|incorrect|false|myth)/.test(right);
  return leftIsTruth && rightIsMisconception;
}

function isLikelyCorrectionStatement(text: string): boolean {
  const normalized = String(text || '').trim().toLowerCase();
  if (!normalized) return false;
  return (
    normalized.startsWith('correction:') ||
    normalized.startsWith('while ') ||
    normalized.startsWith('however ') ||
    normalized.startsWith('therefore ') ||
    normalized.startsWith('in contrast ') ||
    normalized.startsWith('this means ')
  );
}

function normalizeGameplaySnippet(text: string, maxLength: number = 90): string {
  const cleaned = cleanText(String(text || ''))
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(in this lesson|what this is|why it matters|key takeaways|key points|quick recap|coming up next)\s*[:\-]?\s*/i, '')
    .trim();

  if (cleaned.length <= maxLength) return cleaned;
  const truncated = cleaned.slice(0, maxLength).trim();
  const lastSpace = truncated.lastIndexOf(' ');
  const safe = lastSpace > Math.floor(maxLength * 0.6) ? truncated.slice(0, lastSpace) : truncated;
  return `${safe.trim()}...`;
}

function toQuickWinAnswerWords(text: string): string[] {
  return String(text || '')
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .map(token => token.trim())
    .filter(Boolean);
}

function isOneOrTwoWords(text: string): boolean {
  const words = toQuickWinAnswerWords(text);
  return words.length >= 1 && words.length <= 2;
}

function normalizeQuickWinAnswer(text: string): string {
  const words = toQuickWinAnswerWords(text);
  if (words.length === 0) return '';
  return words.slice(0, 2).join(' ');
}

function normalizeSingleWordCandidate(value: string): string {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^[^a-z0-9]+|[^a-z0-9]+$/gi, '')
    .replace(/[^a-z0-9-]/gi, '');
}

function isSingleWordCandidate(value: string): boolean {
  if (!value) return false;
  if (/\s/.test(value)) return false;
  // Keep >=4 chars so every option can be digest-grounded by token matcher.
  return /^[a-z0-9-]{4,24}$/i.test(value);
}

function collectFillGapWordPool(digest: LessonDigest): string[] {
  const raw = [
    ...digest.vocabPairs.flatMap(v => [v.term, v.definition]),
    ...digest.keyFacts,
    ...(digest.procedures || []),
    ...(digest.misconceptions || []),
  ];

  const seen = new Set<string>();
  const words: string[] = [];

  for (const text of raw) {
    const tokens = String(text || '')
      .split(/[^A-Za-z0-9-]+/)
      .map(normalizeSingleWordCandidate)
      .filter(Boolean);
    for (const token of tokens) {
      if (!isSingleWordCandidate(token)) continue;
      if (seen.has(token)) continue;
      seen.add(token);
      words.push(token);
      if (words.length >= 60) return words;
    }
  }

  return words;
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildFillGapSentence(answer: string, gapId: string, digest: LessonDigest): string {
  const facts = digest.keyFacts.slice(0, 20);
  const re = new RegExp(`\\b${escapeRegExp(answer)}\\b`, 'i');
  const fromFact = facts.find(f => re.test(String(f || '')));
  if (fromFact) {
    return String(fromFact).replace(re, `[${gapId}]`);
  }

  // Keep fallback sentence grounded to digest vocabulary/facts for validator safety.
  const factAnchor = normalizeGameplaySnippet(String(facts[0] || '').trim(), 120);
  if (factAnchor) {
    const replaced = factAnchor.replace(/\b[a-z0-9-]{4,}\b/i, `[${gapId}]`);
    if (replaced !== factAnchor) return replaced;
    return `${factAnchor} [${gapId}]`;
  }

  const vocabAnchor = normalizeGameplaySnippet(String(digest.vocabPairs[0]?.definition || '').trim(), 100);
  if (vocabAnchor) {
    const replaced = vocabAnchor.replace(/\b[a-z0-9-]{4,}\b/i, `[${gapId}]`);
    if (replaced !== vocabAnchor) return replaced;
    return `${vocabAnchor} [${gapId}]`;
  }

  return `Use lesson context to choose [${gapId}]`;
}

function pickFillGapDistractors(answer: string, pool: string[], count: number): string[] {
  const candidates = pool
    .filter(word => word !== answer)
    .map(word => ({ word, diff: Math.abs(word.length - answer.length) }))
    .sort((a, b) => a.diff - b.diff)
    .map(entry => entry.word);

  const out: string[] = [];
  for (const word of candidates) {
    if (out.includes(word)) continue;
    out.push(word);
    if (out.length >= count) break;
  }
  return out;
}

function buildSafeFillGapContentFromDigest(digest: LessonDigest): MicrobreakContent {
  const pool = collectFillGapWordPool(digest);
  const fallbackPool = ['current', 'voltage', 'resistance', 'neutral', 'earth', 'circuit', 'switch', 'fuse'];
  const sourcePool = pool.length >= 8 ? pool : fallbackPool;

  const uniqueAnswers = sourcePool.slice(0, 5);
  while (uniqueAnswers.length < 5) {
    uniqueAnswers.push(fallbackPool[uniqueAnswers.length % fallbackPool.length]);
  }

  const gaps = uniqueAnswers.map((answer, idx) => {
    const id = `g${idx + 1}`;
    const distractors = pickFillGapDistractors(answer, sourcePool, 2);
    const options = dedupeTokens([answer, ...distractors]).slice(0, 3);
    const ordered = deterministicShuffleTokens(options, `${id}:${answer}`);
    const correctOptionIndex = ordered.findIndex(opt => opt === answer);
    return {
      id,
      options: ordered,
      correctOptionIndex: correctOptionIndex >= 0 ? correctOptionIndex : 0,
    };
  });

  const lines = gaps.map((gap, idx) => `${idx + 1}. ${buildFillGapSentence(uniqueAnswers[idx], gap.id, digest)}`);

  return {
    breakType: 'game',
    gameType: 'fill-gap',
    prompt: 'Pick the one-word term that best completes each gap.',
    textTemplate: lines.join('\n'),
    gaps,
  };
}

function isInvalidQuickGameplayItem(text: string, maxLength: number = 100): boolean {
  const normalized = String(text || '').trim();
  if (!normalized) return true;
  if (/^\s*[-*#]/.test(normalized)) return true;
  if (isLikelyInstructionalFraming(normalized)) return true;
  return normalized.length > maxLength;
}

function isGenericClassificationLabel(label: string): boolean {
  const normalized = String(label || '').trim().toLowerCase();
  if (!normalized) return true;
  return [
    'term',
    'terms',
    'definition',
    'definitions',
    'word',
    'meaning',
    'concept',
    'description',
    'left',
    'right',
    'item',
    'items',
    'category',
    'categories',
  ].includes(normalized);
}

function hasObviousFormatSplit(
  items: Array<{ text: string; correctBin: 'left' | 'right' }> | Array<{ text: string; correctBucket: 0 | 1 }>
): boolean {
  const toBin = (item: { correctBin?: 'left' | 'right'; correctBucket?: 0 | 1 }): 'left' | 'right' =>
    item.correctBin ? item.correctBin : (item.correctBucket === 0 ? 'left' : 'right');

  const left = items
    .filter(i => toBin(i as { correctBin?: 'left' | 'right'; correctBucket?: 0 | 1 }) === 'left')
    .map(i => String(i.text || '').trim());
  const right = items
    .filter(i => toBin(i as { correctBin?: 'left' | 'right'; correctBucket?: 0 | 1 }) === 'right')
    .map(i => String(i.text || '').trim());
  if (left.length < 2 || right.length < 2) return false;

  const avgWords = (arr: string[]) => arr.reduce((sum, t) => sum + t.split(/\s+/).filter(Boolean).length, 0) / arr.length;
  const leftAvg = avgWords(left);
  const rightAvg = avgWords(right);
  return (leftAvg <= 3 && rightAvg >= 9) || (rightAvg <= 3 && leftAvg >= 9);
}

function looksLikeDeclarativeStatement(text: string): boolean {
  const normalized = String(text || '').trim();
  if (!normalized) return false;
  if (isLikelyInstructionalFraming(normalized)) return false;

  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length < 4) return false;

  return /\b(is|are|was|were|has|have|can|cannot|can't|must|should|will|does|do|did|means?|causes?|produces?|creates?|attracts?|repels?|interacts?)\b/i.test(normalized);
}

function getGameStem(content: MicrobreakContent): string {
  if (content.breakType === 'rest') return 'rest';

  const safeFirst = (value: unknown): string => {
    if (!Array.isArray(value) || value.length === 0) return '';
    return String(value[0] ?? '');
  };

  switch (content.gameType) {
    case 'matching':
      return (Array.isArray(content.pairs) ? String(content.pairs[0]?.left || '') : '').toLowerCase();
    case 'sorting':
      return (Array.isArray(content.items) ? String(content.items[0]?.text || '') : '').toLowerCase();
    case 'spot-error':
      return (content.scenario || '').toLowerCase();
    case 'quick-win':
      return (Array.isArray(content.questions) ? String(content.questions[0]?.question || '') : '').toLowerCase();
    case 'sequencing':
      return safeFirst(content.steps).toLowerCase();
    case 'fill-gap':
      return (content.textTemplate || '').toLowerCase();
    case 'is-correct-why':
      return (content.statement || '').toLowerCase();
    case 'diagnosis-ranked':
      return (content.scenario || '').toLowerCase();
    case 'classify-two-bins':
      return (Array.isArray(content.items) ? String(content.items[0]?.text || '') : '').toLowerCase();
    case 'scenario-match':
      return (Array.isArray(content.pairs) ? String(content.pairs[0]?.scenario || '') : '').toLowerCase();
    case 'formula-build':
      {
        const questions = Array.isArray((content as { questions?: Array<{ correctSequence?: string[] }> }).questions)
          ? (content as { questions?: Array<{ correctSequence?: string[] }> }).questions ?? []
          : [];
        if (questions.length > 0) {
          const first = Array.isArray(questions[0]?.correctSequence) ? questions[0]?.correctSequence ?? [] : [];
          return first.join(' ').toLowerCase();
        }
        return (Array.isArray(content.correctSequence) ? content.correctSequence.join(' ') : '').toLowerCase();
      }
    case 'tap-the-line':
      return safeFirst(content.lines).toLowerCase();
    case 'tap-the-word':
      return (content.sentence || '').toLowerCase();
    case 'elimination':
      return (content.question || '').toLowerCase();
    default:
      return 'unknown';
  }
}

function validateGameSchemaAndContent(
  expectedType: GameType,
  content: MicrobreakContent,
  digestTokenSet: Set<string>
): string[] {
  const errors: string[] = [];

  if (content.breakType !== 'game') {
    errors.push('content.breakType must be "game"');
    return errors;
  }

  if (content.gameType !== expectedType) {
    errors.push(`gameType mismatch: expected ${expectedType}, got ${content.gameType}`);
    return errors;
  }

  const requireGrounding = (texts: unknown[], label: string) => {
    for (const value of texts) {
      const text = typeof value === 'string' ? value : '';
      if (!text) continue;
      if (!hasDigestGrounding(text, digestTokenSet)) {
        errors.push(`${label} lacks digest grounding: ${text.slice(0, 80)}`);
        break;
      }
    }
  };

  switch (content.gameType) {
    case 'matching': {
      const pairs = Array.isArray(content.pairs) ? content.pairs : [];
      if (pairs.length < 4) errors.push('matching requires >=4 pairs');
      if (pairs.some(p => !String(p.left || '').trim() || !String(p.right || '').trim())) {
        errors.push('matching pairs must include non-empty left and right text');
      }
      if (pairs.some(p => definitionContainsTerm(String(p.right || ''), String(p.left || '')))) {
        errors.push('matching definitions must not include the target term text');
      }
      requireGrounding(pairs.flatMap(p => [p.left, p.right]), 'matching pair');
      break;
    }
    case 'sorting': {
      const buckets = Array.isArray(content.buckets) ? content.buckets : [];
      const items = Array.isArray(content.items) ? content.items : [];
      if (buckets.length !== 2) errors.push('sorting requires 2 buckets');
      if (items.length < 6) errors.push('sorting requires >=6 items');
      if (buckets.some(bucket => isLikelyInstructionalFraming(String(bucket || '')))) {
        errors.push('sorting bucket labels must not be lesson framing text');
      }
      if (items.some(i => isInvalidQuickGameplayItem(String(i?.text || '')))) {
        errors.push('sorting items must be concise concepts, not lesson framing or long prose');
      }
      const bucketsUsed = new Set(items.map(i => i.correctBucket).filter(bucket => bucket === 0 || bucket === 1));
      if (bucketsUsed.size < 2) {
        errors.push('sorting must include items for both buckets');
      }
      requireGrounding(items.map(i => i.text), 'sorting item');
      break;
    }
    case 'spot-error': {
      const scenario = typeof content.scenario === 'string' ? content.scenario : '';
      const options = Array.isArray(content.options) ? content.options : [];
      if (!scenario) errors.push('spot-error requires scenario');
      if (options.length < 3) errors.push('spot-error requires >=3 options');
      if (options.filter(o => o.isError).length !== 1) errors.push('spot-error requires exactly one error option');
      requireGrounding([scenario, ...options.map(o => o.text)], 'spot-error');
      break;
    }
    case 'quick-win': {
      const questions = Array.isArray(content.questions) ? content.questions : [];
      if (questions.length < 5) errors.push('quick-win requires >=5 questions');
      if (questions.some(q => !isOneOrTwoWords(String(q?.answer || '')))) {
        errors.push('quick-win answers must be one or two words only');
      }
      requireGrounding(questions.flatMap(q => [q.question, q.answer]), 'quick-win question');
      break;
    }
    case 'sequencing': {
      const steps = Array.isArray(content.steps) ? content.steps : [];
      const correctOrder = Array.isArray(content.correctOrder) ? content.correctOrder : [];
      if (steps.length < 4) errors.push('sequencing requires >=4 steps');
      if (correctOrder.length !== steps.length) {
        errors.push('sequencing correctOrder must match steps length');
      }
      requireGrounding([...steps, ...correctOrder], 'sequencing');
      break;
    }
    case 'fill-gap': {
      const textTemplate = typeof content.textTemplate === 'string' ? content.textTemplate : '';
      const gaps = Array.isArray(content.gaps) ? content.gaps : [];
      if (!textTemplate) errors.push('fill-gap requires textTemplate');
      if (gaps.length < 5) errors.push('fill-gap requires about 5 gaps (minimum 5)');
      if (gaps.length > 6) errors.push('fill-gap should not exceed 6 gaps');
      for (const gap of gaps) {
        if (!String(gap.id || '').trim()) errors.push('fill-gap gap id is required');
        const options = Array.isArray(gap.options) ? gap.options : [];
        if (options.length < 3) errors.push(`fill-gap ${gap.id || 'gap'} requires >=3 options`);
        if (gap.correctOptionIndex < 0 || gap.correctOptionIndex >= options.length) {
          errors.push(`fill-gap ${gap.id || 'gap'} correctOptionIndex out of bounds`);
        }
        const normalized = options.map(opt => normalizeSingleWordCandidate(String(opt || ''))).filter(Boolean);
        if (normalized.some(opt => !isSingleWordCandidate(opt))) {
          errors.push(`fill-gap ${gap.id || 'gap'} options must be single-word`);
        }
        if (normalized.some(opt => opt.length > 24)) {
          errors.push(`fill-gap ${gap.id || 'gap'} options are too long`);
        }
        if (new Set(normalized).size !== normalized.length) {
          errors.push(`fill-gap ${gap.id || 'gap'} options must be unique`);
        }
        if (textTemplate && !textTemplate.includes(`[${gap.id}]`)) {
          errors.push(`fill-gap textTemplate missing placeholder for ${gap.id}`);
        }
      }
      requireGrounding([textTemplate, ...gaps.flatMap(g => (Array.isArray(g.options) ? g.options : []))], 'fill-gap');
      break;
    }
    case 'is-correct-why': {
      const statement = typeof content.statement === 'string' ? content.statement : '';
      const reasons = Array.isArray(content.reasons) ? content.reasons : [];
      if (!statement) errors.push('is-correct-why requires statement');
      if (statement && !looksLikeDeclarativeStatement(statement)) {
        errors.push('is-correct-why statement must be a testable declarative statement');
      }
      if (reasons.length < 3) errors.push('is-correct-why requires >=3 reasons');
      if (content.correctReasonIndex < 0 || content.correctReasonIndex >= reasons.length) {
        errors.push('is-correct-why correctReasonIndex out of bounds');
      }
      if (reasons.some(r => typeof r !== 'string' || !r.trim())) {
        errors.push('is-correct-why reasons must be non-empty strings');
      }
      if (reasons.some(r => /^\s*[-*]/.test(String(r)))) {
        errors.push('is-correct-why reasons must not include markdown bullet formatting');
      }
      if (reasons.some(r => String(r).length > 180)) {
        errors.push('is-correct-why reasons are too long for quick gameplay');
      }
      if (reasons.some(r => isLikelyInstructionalFraming(String(r)))) {
        errors.push('is-correct-why reasons must be gameplay options, not lesson framing text');
      }
      requireGrounding([statement, ...reasons], 'is-correct-why');
      break;
    }
    case 'diagnosis-ranked': {
      const scenario = typeof content.scenario === 'string' ? content.scenario : '';
      const options = Array.isArray(content.options) ? content.options : [];
      if (!scenario) errors.push('diagnosis-ranked requires scenario');
      if (options.length < 4) errors.push('diagnosis-ranked requires >=4 options');
      if (!Array.isArray(content.correctRankedIndices) || content.correctRankedIndices.length !== 2) {
        errors.push('diagnosis-ranked requires two ranked indices');
      }
      requireGrounding([scenario, ...options], 'diagnosis-ranked');
      break;
    }
    case 'classify-two-bins': {
      const leftLabel = typeof content.leftLabel === 'string' ? content.leftLabel : '';
      const rightLabel = typeof content.rightLabel === 'string' ? content.rightLabel : '';
      const items = Array.isArray(content.items) ? content.items : [];
      if (!leftLabel || !rightLabel) errors.push('classify-two-bins requires left/right labels');
      if (items.length < 6) errors.push('classify-two-bins requires >=6 items');
      if (/^\s*left\b/i.test(leftLabel) || /^\s*right\b/i.test(rightLabel)) {
        errors.push('classify-two-bins labels must be meaningful content labels, not side placeholders');
      }
      if (isGenericClassificationLabel(leftLabel) || isGenericClassificationLabel(rightLabel)) {
        errors.push('classify-two-bins labels must not be generic term/definition-style labels');
      }
      if (isLikelyInstructionalFraming(leftLabel) || isLikelyInstructionalFraming(rightLabel)) {
        errors.push('classify-two-bins labels must not be lesson framing text');
      }
      if (items.some(i => isLikelyInstructionalFraming(String(i?.text || '')))) {
        errors.push('classify-two-bins items must be concise concepts, not lesson framing or bullets');
      }
      if (items.some(i => String(i?.text || '').trim().length > 120)) {
        errors.push('classify-two-bins items are too long for quick classification');
      }
      if (items.some(i => hasDanglingEllipsis(String(i?.text || '')))) {
        errors.push('classify-two-bins items must be complete statements, not truncated with ellipses');
      }
      if (
        labelsIndicateTruthVsMisconception(leftLabel, rightLabel) &&
        items.some(i => i?.correctBin === 'right' && isLikelyCorrectionStatement(String(i?.text || '')))
      ) {
        errors.push('classify-two-bins misconception bin includes correction-style statements');
      }
      if (hasObviousFormatSplit(items.map(i => ({ text: String(i?.text || ''), correctBin: i?.correctBin === 'right' ? 'right' : 'left' })))) {
        errors.push('classify-two-bins must not rely on obvious format split (short terms vs long definitions)');
      }
      const binsUsed = new Set(items.map(i => i.correctBin).filter(bin => bin === 'left' || bin === 'right'));
      if (binsUsed.size < 2) {
        errors.push('classify-two-bins must include items for both bins');
      }
      requireGrounding([leftLabel, rightLabel, ...items.map(i => i.text)], 'classify-two-bins');
      break;
    }
    case 'scenario-match': {
      const pairs = Array.isArray(content.pairs) ? content.pairs : [];
      if (pairs.length < 4) errors.push('scenario-match requires >=4 pairs');
      requireGrounding(pairs.flatMap(p => [p.scenario, p.answer]), 'scenario-match');
      break;
    }
    case 'formula-build': {
      const questions = Array.isArray((content as { questions?: Array<{ tokens?: string[]; correctSequence?: string[] }> }).questions)
        ? (content as { questions?: Array<{ tokens?: string[]; correctSequence?: string[] }> }).questions ?? []
        : [];

      const targets = questions.length > 0
        ? questions
        : [{ tokens: content.tokens, correctSequence: content.correctSequence }];

      if (targets.length === 0) {
        errors.push('formula-build requires at least one question');
        break;
      }

      targets.forEach((question, questionIndex) => {
        const tokens = Array.isArray(question.tokens) ? question.tokens : [];
        const correctSequence = Array.isArray(question.correctSequence) ? question.correctSequence : [];
        const label = questions.length > 0 ? `formula-build question ${questionIndex + 1}` : 'formula-build';

        if (tokens.length < 4) errors.push(`${label} requires >=4 tokens`);
        if (correctSequence.length < 4) {
          errors.push(`${label} requires >=4 correct sequence items`);
        }
        if (!isValidFormulaSequence(correctSequence.map(token => normalizeFormulaToken(String(token))))) {
          errors.push(`${label} correctSequence must be a valid symbolic formula`);
        }
        if (tokens.some(token => !isFormulaSymbolToken(normalizeFormulaToken(String(token))))) {
          errors.push(`${label} tokens must only contain formula symbols/operators`);
        }
        if (tokens.length <= correctSequence.length) {
          errors.push(`${label} tokens must include at least one distractor token`);
        }
        if (tokens.join('|') === correctSequence.join('|')) {
          errors.push(`${label} tokens must be shuffled, not in exact answer order`);
        }
      });
      break;
    }
    case 'tap-the-line': {
      const lines = Array.isArray(content.lines) ? content.lines : [];
      if (lines.length < 3) errors.push('tap-the-line requires >=3 lines');
      if (content.correctLineIndex < 0 || content.correctLineIndex >= lines.length) {
        errors.push('tap-the-line correctLineIndex out of bounds');
      }
      requireGrounding(lines, 'tap-the-line');
      break;
    }
    case 'tap-the-word': {
      const sentence = typeof content.sentence === 'string' ? content.sentence : '';
      const options = Array.isArray(content.options) ? content.options : [];
      if (!sentence) errors.push('tap-the-word requires sentence');
      if (options.length < 3) errors.push('tap-the-word requires >=3 options');
      if (content.correctOptionIndex < 0 || content.correctOptionIndex >= options.length) {
        errors.push('tap-the-word correctOptionIndex out of bounds');
      }
      requireGrounding([sentence, ...options], 'tap-the-word');
      break;
    }
    case 'elimination': {
      const question = typeof content.question === 'string' ? content.question : '';
      const options = Array.isArray(content.options) ? content.options : [];
      if (!question) errors.push('elimination requires question');
      if (options.length < 4) errors.push('elimination requires >=4 options');
      if (content.correctIndex < 0 || content.correctIndex >= options.length) {
        errors.push('elimination correctIndex out of bounds');
      }
      requireGrounding([question, ...options], 'elimination');
      break;
    }
    default:
      errors.push('unsupported game type');
  }

  return errors;
}
function buildFallbackMatchingPairs(digest: LessonDigest): Array<{ left: string; right: string }> {
  const vocabPairs = digest.vocabPairs
    .map(v => ({ left: String(v.term || '').trim(), right: String(v.definition || '').trim() }))
    .filter(v => v.left.length > 0 && v.right.length > 0)
    .filter(v => !definitionContainsTerm(v.right, v.left));

  const pairs: Array<{ left: string; right: string }> = [...vocabPairs.slice(0, 6)];
  const facts = digest.keyFacts.map(f => String(f || '').trim()).filter(Boolean);

  let idx = 0;
  while (pairs.length < 4 && idx + 1 < facts.length) {
    const left = facts[idx];
    const right = facts[idx + 1];
    if (left && right && !definitionContainsTerm(right, left)) {
      pairs.push({ left, right });
    }
    idx += 2;
  }

  while (pairs.length < 4) {
    const n = pairs.length + 1;
    pairs.push({ left: `Term ${n}`, right: `Key concept from the lesson ${n}.` });
  }

  const seen = new Set<string>();
  return pairs.map((p, i) => {
    let left = p.left;
    if (seen.has(left)) left = `${left} (${i + 1})`;
    seen.add(left);
    const safeRight =
      p.right && !definitionContainsTerm(p.right, left)
        ? p.right
        : `Core idea from the lesson ${i + 1}.`;
    return { left, right: safeRight };
  });
}

function fallbackGameFromDigest(plan: Plan, digest: LessonDigest): MicrobreakContent {
  const vocab = digest.vocabPairs;
  const facts = digest.keyFacts;
  const procedures = digest.procedures || [];
  const misconceptions = digest.misconceptions || [];

  switch (plan.gameType) {
    case 'matching':
      return {
        breakType: 'game',
        gameType: 'matching',
        duration: 90,
        pairs: buildFallbackMatchingPairs(digest),
      };
    case 'sorting':
      return buildSafeSortingContentFromDigest(digest);
    case 'spot-error':
      return {
        breakType: 'game',
        gameType: 'spot-error',
        duration: 60,
        scenario: facts[0] || 'Identify the incorrect statement.',
        options: [
          { text: facts[1] || 'Correct statement one', isError: false },
          { text: misconceptions[0] || 'Incorrect statement', isError: true },
          { text: facts[2] || 'Correct statement two', isError: false },
        ],
      };
    case 'quick-win':
      return {
        breakType: 'game',
        gameType: 'quick-win',
        duration: 90,
        questions: vocab.slice(0, 5).map((v, idx) => ({
          question: `Word for: ${v.definition || v.term}?`,
          answer: normalizeQuickWinAnswer(v.term || v.definition || `Term ${idx + 1}`) || `Term${idx + 1}`,
        })),
      };
    case 'sequencing':
      return {
        breakType: 'game',
        gameType: 'sequencing',
        prompt: 'Arrange the steps in order.',
        steps: procedures.slice(0, 4),
        correctOrder: procedures.slice(0, 4),
        timerSeconds: 25,
      };
    case 'fill-gap':
      return buildSafeFillGapContentFromDigest(digest);
    case 'is-correct-why':
      {
        const cleanFacts = facts.filter(f => !isLikelyInstructionalFraming(f));
        const cleanMisconceptions = misconceptions.filter(m => !isLikelyInstructionalFraming(m));
        const statement = cleanFacts.find(looksLikeDeclarativeStatement) || 'Like poles repel, and unlike poles attract.';
        const reasonPool = [
          ...cleanFacts.filter(f => f !== statement),
          ...cleanMisconceptions,
        ]
          .map(s => String(s || '').trim())
          .filter(Boolean)
          .filter(s => !isLikelyInstructionalFraming(s))
          .slice(0, 6);

        const reasons = [
          reasonPool[0] || 'Because field interaction determines whether poles attract or repel.',
          reasonPool[1] || 'Because all magnetic parts automatically pull toward each other.',
          reasonPool[2] || 'Because total flux and flux density are always identical values.',
        ];

        return {
          breakType: 'game',
          gameType: 'is-correct-why',
          statement,
          isCorrect: true,
          reasons,
          correctReasonIndex: 0,
        };
      }
    case 'diagnosis-ranked':
      return {
        breakType: 'game',
        gameType: 'diagnosis-ranked',
        scenario: facts[0] || 'Identify the two most likely causes.',
        options: [misconceptions[0] || facts[1] || 'Cause A', misconceptions[1] || facts[2] || 'Cause B', facts[3] || 'Cause C', facts[4] || 'Cause D'],
        correctRankedIndices: [0, 1],
      };
    case 'classify-two-bins':
      return buildSafeClassifyTwoBinsContentFromDigest(digest);
    case 'scenario-match':
      return {
        breakType: 'game',
        gameType: 'scenario-match',
        pairs: facts.slice(0, 4).map((f, idx) => ({ scenario: f, answer: vocab[idx % Math.max(1, vocab.length)]?.term || `Answer ${idx + 1}` })),
        distractors: facts.slice(4, 6),
      };
    case 'formula-build': {
      const extractedSequence = extractFormulaSequencesFromDigest(digest)[0];
      const selectedSequence = extractedSequence && extractedSequence.length >= 4
        ? extractedSequence
        : ['V', '=', 'I', '*', 'R'];
      const first = buildFormulaQuestionFromSequence(selectedSequence, digest, 0, `Build this formula: ${selectedSequence.join(' ')}`);

      return {
        breakType: 'game',
        gameType: 'formula-build',
        prompt: first.prompt,
        tokens: first.tokens,
        correctSequence: first.correctSequence,
        timerSeconds: first.timerSeconds,
      };
    }
    case 'tap-the-line':
      return {
        breakType: 'game',
        gameType: 'tap-the-line',
        lines: facts.slice(0, 4),
        correctLineIndex: 0,
      };
    case 'tap-the-word': {
      const sentence = facts[0] || 'Choose the correct word.';
      const options = vocab.slice(0, 3).map(v => v.term);
      return {
        breakType: 'game',
        gameType: 'tap-the-word',
        sentence,
        options: options.length >= 3 ? options : ['Option A', 'Option B', 'Option C'],
        correctOptionIndex: 0,
      };
    }
    case 'elimination':
      return {
        breakType: 'game',
        gameType: 'elimination',
        question: facts[0] || 'Eliminate wrong options, then choose the best answer.',
        options: [facts[1] || 'A', facts[2] || 'B', facts[3] || 'C', facts[4] || 'D'],
        correctIndex: 0,
        explanation: facts[1] || 'Selected answer is most accurate.',
      };
    default:
      return {
        breakType: 'game',
        gameType: 'quick-win',
        duration: 90,
        questions: [{ question: 'Quick recall', answer: 'Answer' }],
      };
  }
}

async function repairSingleGame(
  model: Awaited<ReturnType<typeof getJsonModel>>,
  plan: Plan,
  digest: LessonDigest,
  failingReasons: string[],
  promptProfile?: GamePromptProfile
): Promise<GeneratedPlannedGame> {
  const prompt = buildSingleGameRepairPrompt(plan, digest, failingReasons, promptProfile);

  const result = await model.generateContent(prompt);
  const parsed = parseJson<GeneratedPlannedGame>(result.response.text());
  return parsed;
}

function validateNoDuplicateStems(games: GeneratedPlannedGame[]): Map<number, string> {
  const seen = new Map<string, number>();
  const duplicates = new Map<number, string>();

  games.forEach((game, index) => {
    const stem = getGameStem(game.content);
    if (!stem) return;
    if (seen.has(stem)) {
      duplicates.set(index, `duplicate stem with game index ${seen.get(stem)}`);
    } else {
      seen.set(stem, index);
    }
  });

  return duplicates;
}

function distributeFormulaBuildSequences(games: GeneratedPlannedGame[], digest: LessonDigest): GeneratedPlannedGame[] {
  const formulaIndices = games
    .map((game, index) => ({ game, index }))
    .filter(({ game }) => game.content?.breakType === 'game' && game.content?.gameType === 'formula-build')
    .map(({ index }) => index);

  if (formulaIndices.length <= 1) return games;

  const sequences = extractFormulaSequencesFromDigest(digest);
  if (sequences.length <= 1) return games;

  const updated = [...games];
  formulaIndices.forEach((gameIndex, sequenceIndex) => {
    const game = updated[gameIndex];
    const content = game.content as Extract<MicrobreakContent, { gameType: 'formula-build' }>;
    const targetSequence = sequences[sequenceIndex % sequences.length];
    const question = buildFormulaQuestionFromSequence(
      targetSequence,
      digest,
      sequenceIndex,
      normalizeToken(content.prompt) || `Build this formula: ${targetSequence.join(' ')}`
    );

    updated[gameIndex] = {
      ...game,
      content: {
        ...content,
        prompt: question.prompt,
        tokens: question.tokens,
        correctSequence: question.correctSequence,
        timerSeconds: question.timerSeconds,
      },
    };
  });

  return updated;
}

export async function generateMicrobreaksFromPlan(
  plan: Plan[],
  digest: LessonDigest,
  promptProfile?: GamePromptProfile
): Promise<GeneratedPlannedGame[]> {
  if (plan.length === 0) return [];

  const model = await getJsonModel();
  const generated = await Promise.all(
    plan.map(async (planItem) => {
      try {
        const prompt = buildSingleGameGenerationPrompt(planItem, digest, promptProfile);
        const result = await model.generateContent(prompt);
        const parsed = parseJson<GeneratedPlannedGame>(result.response.text());
        if (!parsed || parsed.slotId !== planItem.slotId || !parsed.content) {
          throw new Error('single-game response missing expected slotId/content');
        }
        return parsed;
      } catch (error) {
        console.warn(
          `[GameGenerator] single-game generation failed for slot ${planItem.slotId}; using fallback. ${
            error instanceof Error ? error.message : 'unknown'
          }`
        );
        return {
          slotId: planItem.slotId,
          content: hardenGeneratedGameContent(fallbackGameFromDigest(planItem, digest), digest),
        } as GeneratedPlannedGame;
      }
    })
  );

  const digestTokenSet = extractDigestTokenSet(digest);

  const slotById = new Map(plan.map(p => [p.slotId, p]));
  const repaired = [...generated];

  const failures = new Map<number, string[]>();
  repaired.forEach((game, index) => {
    const planItem = slotById.get(game.slotId);
    const itemErrors: string[] = [];

    if (!planItem) itemErrors.push(`unknown slotId ${game.slotId}`);
    if (!game.content) itemErrors.push('missing content');

    if (planItem && game.content) {
      game.content = hardenGeneratedGameContent(game.content, digest);
      const schemaErrors = validateGameSchemaAndContent(planItem.gameType, game.content, digestTokenSet);
      itemErrors.push(...schemaErrors);
    }

    if (itemErrors.length) failures.set(index, itemErrors);
  });

  const duplicateFailures = validateNoDuplicateStems(repaired);
  duplicateFailures.forEach((msg, index) => {
    const current = failures.get(index) || [];
    current.push(msg);
    failures.set(index, current);
  });

  const repairEntries = [...failures.entries()];
  const repairedItems = await Promise.all(
    repairEntries.map(async ([index, reasons]) => {
      const existing = repaired[index];
      const planItem = slotById.get(existing.slotId) || plan[index];
      try {
        const repairedGame = await repairSingleGame(model, planItem, digest, reasons, promptProfile);
        return { index, game: repairedGame };
      } catch (error) {
        console.warn(`[GameGenerator] targeted repair failed for index ${index}; using fallback. ${error instanceof Error ? error.message : 'unknown'}`);
        return {
          index,
          game: {
            slotId: planItem.slotId,
            content: hardenGeneratedGameContent(fallbackGameFromDigest(planItem, digest), digest),
          } as GeneratedPlannedGame,
        };
      }
    })
  );

  repairedItems.forEach(({ index, game }) => {
    repaired[index] = game;
  });

  const finalDuplicates = validateNoDuplicateStems(repaired);
  repaired.forEach((game, index) => {
    const planItem = slotById.get(game.slotId) || plan[index];
    game.content = hardenGeneratedGameContent(game.content, digest);
    const schemaErrors = validateGameSchemaAndContent(planItem.gameType, game.content, digestTokenSet);
    const duplicateError = finalDuplicates.get(index);

    if (schemaErrors.length > 0 || duplicateError) {
      const fallback = hardenGeneratedGameContent(fallbackGameFromDigest(planItem, digest), digest);
      repaired[index] = {
        slotId: planItem.slotId,
        content: fallback,
      };
    }
  });

  return distributeFormulaBuildSequences(repaired, digest);
}
function getNextMicrobreakNumber(lesson: Lesson): number {
  const maxExistingNumber = lesson.blocks
    .filter(b => b.type === 'microbreak')
    .map(b => {
      const match = b.id.match(/-microbreak-(\d+)$/);
      return match ? Number.parseInt(match[1], 10) : 0;
    })
    .reduce((max, current) => Math.max(max, current), 0);

  return maxExistingNumber + 1;
}

export function insertGamesIntoLesson(
  lesson: Lesson,
  generatedGames: GeneratedPlannedGame[],
  slots: Slot[]
): Block[] {
  const slotById = new Map(slots.map(s => [s.slotId, s]));
  const nextMicrobreakNumber = getNextMicrobreakNumber(lesson);
  const occupiedOrders = new Set(lesson.blocks.map(b => roundOrder(b.order)));

  const blocks: Block[] = [];

  generatedGames.forEach((game, index) => {
    const slot = slotById.get(game.slotId);
    if (!slot) return;

    let order = roundOrder(slot.order);
    while (occupiedOrders.has(order)) {
      order = roundOrder(order + 0.01);
    }
    occupiedOrders.add(order);

    blocks.push({
      id: `${lesson.id}-microbreak-${nextMicrobreakNumber + index}`,
      type: 'microbreak',
      order,
      content: game.content,
    });
  });

  return blocks.sort((a, b) => a.order - b.order);
}

export async function generateMicrobreaksForLesson(
  lesson: Lesson,
  options?: GameGenerationOptions
): Promise<Block[]> {
  const allowedGameTypes: GameType[] = options?.gameTypes && options.gameTypes.length > 0
    ? options.gameTypes
    : ['matching', 'sorting', 'quick-win', 'fill-gap'];

  if (typeof options?.count === 'number') {
    console.warn('[GameGenerator] `count` is ignored under slot-driven architecture.');
  }
  if (options?.insertAfterBlocks?.length) {
    console.warn('[GameGenerator] `insertAfterBlocks` is ignored under slot-driven architecture.');
  }

  const slots = findMicrobreakSlots(lesson.blocks);
  if (slots.length === 0) {
    console.warn(`[GameGenerator] No valid insertion slots available for lesson ${lesson.id}.`);
    return [];
  }

  const digest = buildLessonDigest(lesson);
  const promptProfile = getGamePromptProfile(lesson);

  const eligibleTypes = getEligibleTypes(allowedGameTypes, digest);
  if (eligibleTypes.length === 0) {
    throw new Error('No eligible game types available for this lesson based on hard constraints.');
  }

  const plan = await planMicrobreaks(slots, digest, eligibleTypes, promptProfile);
  if (plan.length !== slots.length) {
    throw new Error(`Planner returned ${plan.length} entries for ${slots.length} slots.`);
  }

  const generatedGames = await generateMicrobreaksFromPlan(plan, digest, promptProfile);
  if (generatedGames.length !== plan.length) {
    throw new Error(`Generator returned ${generatedGames.length} entries for ${plan.length} planned slots.`);
  }

  const blocks = insertGamesIntoLesson(lesson, generatedGames, slots);
  if (blocks.length !== slots.length) {
    throw new Error(`Insertion produced ${blocks.length} games for ${slots.length} slots.`);
  }

  console.log(`[GameGenerator] Generated ${blocks.length} microbreak game(s) for lesson ${lesson.id} using ${slots.length} slot(s).`);
  return blocks;
}

export function generateSimpleMatchingGame(lesson: Lesson, blockIndex: number = 1): Block {
  const vocabBlock = lesson.blocks.find(b => b.type === 'vocab');
  if (!vocabBlock) {
    throw new Error('No vocabulary block found in lesson');
  }

  const vocabContent = vocabBlock.content as VocabBlockContent;
  const pairs = vocabContent.terms.slice(0, 5).map(t => ({
    left: t.term,
    right: t.definition.substring(0, 80),
  }));

  return {
    id: `${lesson.id}-microbreak-${blockIndex}`,
    type: 'microbreak',
    content: {
      breakType: 'game',
      gameType: 'matching',
      duration: 90,
      pairs,
    },
    order: lesson.blocks.length + blockIndex,
  };
}

export function generateSimpleSortingGame(lesson: Lesson, categories: [string, string], blockIndex: number = 2): Block {
  return {
    id: `${lesson.id}-microbreak-${blockIndex}`,
    type: 'microbreak',
    content: {
      breakType: 'game',
      gameType: 'sorting',
      duration: 90,
      buckets: categories,
      items: [
        { text: 'Example item 1', correctBucket: 0 },
        { text: 'Example item 2', correctBucket: 1 },
        { text: 'Example item 3', correctBucket: 0 },
        { text: 'Example item 4', correctBucket: 1 },
        { text: 'Example item 5', correctBucket: 0 },
        { text: 'Example item 6', correctBucket: 1 },
      ],
    },
    order: lesson.blocks.length + blockIndex,
  };
}

// Test hooks for deterministic unit tests around internal validation and fallback logic.
export function __testLooksLikeDeclarativeStatement(text: string): boolean {
  return looksLikeDeclarativeStatement(text);
}

export function __testValidateGameSchemaAndContent(
  expectedType: GameType,
  content: MicrobreakContent,
  digest: LessonDigest
): string[] {
  return validateGameSchemaAndContent(expectedType, content, extractDigestTokenSet(digest));
}

export function __testFallbackGameFromDigest(plan: Plan, digest: LessonDigest): MicrobreakContent {
  return fallbackGameFromDigest(plan, digest);
}
