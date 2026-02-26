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

const GENERATOR_PROMPT = `You are an educational game generator.
Return ONLY JSON.
Never include markdown.
Use only the provided lesson digest.
Do not invent facts beyond digest.
For formula-build games: include a clear prompt naming the target formula, shuffle token order, and include at least one distractor token not used in correctSequence.
For sorting/classify games: use short gameplay-ready items only (phrases, terms, concise definitions), never lesson headings, bullets, or framing lines like "In this lesson", "What this is", "Quick recap".`;

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

function roundOrder(order: number): number {
  return Math.round(order * 1000) / 1000;
}

function cleanText(raw: string): string {
  return raw
    .replace(/\*\*|__|`|#+|\[|\]|\(|\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text: string): string[] {
  const cleaned = cleanText(text);
  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean)
    .filter(s => s.length >= 12);
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

    if (nextBlock?.type === 'spaced-review') continue;

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

  const misconceptions = metaMisconceptions
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
  if (['tap-label'].includes(gameType)) return 'visual';
  return 'other';
}

export function getGameTypeEligibility(gameType: GameType, digest: LessonDigest): EligibilityResult {
  const vocabCount = digest.vocabPairs.length;
  const factCount = digest.keyFacts.length;
  const procedureCount = digest.procedures?.length || 0;
  const misconceptionCount = digest.misconceptions?.length || 0;
  const diagramLabels = digest.diagram?.labels.length || 0;

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
    case 'tap-label':
      return { ok: false, reason: 'tap-label temporarily disabled' };
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
      return extractFormulaSequenceFromDigest(digest)
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
  allowedGameTypes: GameType[]
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
    const prompt = `${PLANNER_PROMPT}\n\nInput:\n${JSON.stringify(plannerInput, null, 2)}\n\nReturn JSON array of objects exactly: [{"slotId":"...","gameType":"...","rationale":"...","contentSource":"vocab|facts|procedure|misconception|diagram"}]`;
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
      fallbackTypes[index] === 'tap-label'
        ? 'diagram'
        : fallbackTypes[index] === 'sequencing'
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
    .filter(t => t.length >= 4);

  return new Set(tokens);
}

function hasDigestGrounding(text: string, digestTokens: Set<string>): boolean {
  const tokens = text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 4);

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

function arraysMatch(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((v, i) => v === b[i]);
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
  let items = [...leftTerms.slice(0, 3), ...rightTerms.slice(0, 3)];

  if (items.length < 6) {
    const fallback = ['Line Conductor', 'Neutral Conductor', 'Radial Circuit', 'OCPD', 'RCD', 'CPC']
      .map((text, idx) => ({
        text,
        correctBin: idx < 3 ? ('left' as const) : ('right' as const),
      }));
    for (const candidate of fallback) {
      if (items.length >= 6) break;
      if (items.some(i => i.text.toLowerCase() === candidate.text.toLowerCase())) continue;
      items.push(candidate);
    }
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
    .filter(item => !isInvalidQuickGameplayItem(item.text, 100));

  if (cleanedItems.length < 6 || labelsInvalid || hasObviousFormatSplit(cleanedItems)) {
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

  const extracted = extractFormulaSequenceFromDigest(digest);
  const providedSequence = dedupeTokens(
    (Array.isArray(content.correctSequence) ? content.correctSequence : [])
      .map(normalizeFormulaToken)
      .filter(isFormulaSymbolToken)
  );
  const correctSequence = isValidFormulaSequence(providedSequence)
    ? providedSequence
    : (extracted && isValidFormulaSequence(extracted) ? extracted : ['V', '=', 'I', '*', 'R']);

  const correctSet = new Set(correctSequence.map(token => token.toLowerCase()));
  const originalTokens = dedupeTokens(
    (Array.isArray(content.tokens) ? content.tokens : [])
      .map(normalizeFormulaToken)
      .filter(isFormulaSymbolToken)
  );

  const existingDistractors = originalTokens.filter(token => !correctSet.has(token.toLowerCase()));
  const generatedDistractors = buildFormulaDistractors(correctSequence, digest, 3);

  const distractors = dedupeTokens([...existingDistractors, ...generatedDistractors]);
  const requiredDistractorCount = correctSequence.length >= 5 ? 2 : 1;
  const selectedDistractors = distractors.slice(0, Math.max(requiredDistractorCount, 1));

  let tokens = dedupeTokens([...correctSequence, ...selectedDistractors]);
  if (tokens.length <= correctSequence.length) {
    const fallbackDistractor = ['+', '-', '/'].find(token => !correctSet.has(token.toLowerCase()));
    if (fallbackDistractor) {
      tokens = dedupeTokens([...tokens, fallbackDistractor]);
    }
  }

  let shuffledTokens = deterministicShuffleTokens(tokens, correctSequence.join('|'));
  if (arraysMatch(shuffledTokens.slice(0, correctSequence.length), correctSequence)) {
    shuffledTokens = [...shuffledTokens.slice(1), shuffledTokens[0]];
  }

  const prompt = normalizeToken((content as { prompt?: string }).prompt) || `Build this formula: ${correctSequence.join(' ')}`;

  return {
    ...content,
    prompt,
    tokens: shuffledTokens,
    correctSequence,
    timerSeconds: 11,
  };
}

function hardenGeneratedGameContent(content: MicrobreakContent, digest: LessonDigest): MicrobreakContent {
  let hardened = content;
  hardened = hardenSortingContent(hardened, digest);
  hardened = hardenClassifyTwoBinsContent(hardened, digest);
  hardened = hardenFormulaBuildContent(hardened, digest);
  return hardened;
}

function extractFormulaSequenceFromDigest(digest: LessonDigest): string[] | null {
  const corpus = [
    ...digest.keyFacts,
    ...digest.vocabPairs.flatMap(v => [v.term, v.definition]),
    ...(digest.procedures || []),
  ];

  for (const raw of corpus) {
    const text = normalizeToken(raw);
    if (!text.includes('=')) continue;
    const candidates = extractEquationCandidates(text);
    for (const candidate of candidates) {
      const tokens = tokenizeFormulaExpression(candidate);
      if (isValidFormulaSequence(tokens)) {
        return tokens;
      }
    }
  }

  return null;
}

function isLikelyInstructionalFraming(text: string): boolean {
  const normalized = String(text || '').trim().toLowerCase();
  if (!normalized) return false;

  if (
    /^[-*#]/.test(normalized) ||
    normalized.startsWith('in this lesson') ||
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
    case 'tap-label':
      return (Array.isArray(content.items) ? String(content.items[0]?.label || '') : '').toLowerCase();
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
      return (Array.isArray(content.correctSequence) ? content.correctSequence.join(' ') : '').toLowerCase();
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
  digestTokenSet: Set<string>,
  digest: LessonDigest
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
    case 'tap-label': {
      const items = Array.isArray(content.items) ? content.items : [];
      if (items.length < 3) errors.push('tap-label requires >=3 items');
      if (digest.diagram?.imageUrl && (!content.imageUrl || !String(content.imageUrl).trim())) {
        errors.push('tap-label requires imageUrl when diagram image is available');
      }
      requireGrounding(items.map(i => i.label), 'tap-label label');
      break;
    }
    case 'quick-win': {
      const questions = Array.isArray(content.questions) ? content.questions : [];
      if (questions.length < 5) errors.push('quick-win requires >=5 questions');
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
      if (gaps.length < 1) errors.push('fill-gap requires >=1 gap');
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
      const tokens = Array.isArray(content.tokens) ? content.tokens : [];
      const correctSequence = Array.isArray(content.correctSequence) ? content.correctSequence : [];
      if (tokens.length < 4) errors.push('formula-build requires >=4 tokens');
      if (correctSequence.length < 4) {
        errors.push('formula-build requires >=4 correct sequence items');
      }
      if (!isValidFormulaSequence(correctSequence.map(token => normalizeFormulaToken(String(token))))) {
        errors.push('formula-build correctSequence must be a valid symbolic formula');
      }
      if (tokens.some(token => !isFormulaSymbolToken(normalizeFormulaToken(String(token))))) {
        errors.push('formula-build tokens must only contain formula symbols/operators');
      }
      if (tokens.length <= correctSequence.length) {
        errors.push('formula-build tokens must include at least one distractor token');
      }
      if (tokens.join('|') === correctSequence.join('|')) {
        errors.push('formula-build tokens must be shuffled, not in exact answer order');
      }
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
    .filter(v => v.left.length > 0 && v.right.length > 0);

  const pairs: Array<{ left: string; right: string }> = [...vocabPairs.slice(0, 6)];
  const facts = digest.keyFacts.map(f => String(f || '').trim()).filter(Boolean);

  let idx = 0;
  while (pairs.length < 4 && idx + 1 < facts.length) {
    const left = facts[idx];
    const right = facts[idx + 1];
    if (left && right) {
      pairs.push({ left, right });
    }
    idx += 2;
  }

  while (pairs.length < 4) {
    const n = pairs.length + 1;
    pairs.push({ left: `Term ${n}`, right: `Definition ${n}` });
  }

  const seen = new Set<string>();
  return pairs.map((p, i) => {
    let left = p.left;
    if (seen.has(left)) left = `${left} (${i + 1})`;
    seen.add(left);
    return { left, right: p.right || `Definition ${i + 1}` };
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
    case 'tap-label':
      return {
        breakType: 'game',
        gameType: 'tap-label',
        duration: 75,
        imageUrl: digest.diagram?.imageUrl,
        items: (digest.diagram?.labels || ['Label A', 'Label B', 'Label C']).slice(0, 3).map((label, idx) => ({
          id: `label-${idx + 1}`,
          label,
          correctPosition: { x: 20 + idx * 25, y: 50 },
        })),
      };
    case 'quick-win':
      return {
        breakType: 'game',
        gameType: 'quick-win',
        duration: 90,
        questions: vocab.slice(0, 5).map(v => ({ question: `What is ${v.term}?`, answer: v.definition })),
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
      return {
        breakType: 'game',
        gameType: 'fill-gap',
        prompt: 'Fill the missing term.',
        textTemplate: `${vocab[0]?.term || 'The term'} means [g1].`,
        gaps: [
          {
            id: 'g1',
            options: [vocab[0]?.definition || 'definition', vocab[1]?.definition || 'other meaning', vocab[2]?.definition || 'different meaning'],
            correctOptionIndex: 0,
          },
        ],
      };
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
      const extracted = extractFormulaSequenceFromDigest(digest);
      const tokenSource = extracted && extracted.length >= 4
        ? extracted
        : ['V', '=', 'I', '*', 'R'];

      const correctSequence = dedupeTokens(tokenSource).slice(0, 6);
      const distractors = buildFormulaDistractors(correctSequence, digest, 3);
      const tokens = deterministicShuffleTokens(
        dedupeTokens([...correctSequence, ...distractors.slice(0, correctSequence.length >= 5 ? 2 : 1)]),
        correctSequence.join('|')
      );

      return {
        breakType: 'game',
        gameType: 'formula-build',
        prompt: 'Build the target formula from the tokens.',
        tokens,
        correctSequence,
        timerSeconds: 11,
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
  failingReasons: string[]
): Promise<GeneratedPlannedGame> {
  const prompt = `${GENERATOR_PROMPT}\n\nRepair one game object.\nPlan:\n${JSON.stringify(plan, null, 2)}\n\nDigest:\n${JSON.stringify(digest, null, 2)}\n\nValidation failures:\n${JSON.stringify(failingReasons, null, 2)}\n\nReturn exactly:\n{"slotId":"${plan.slotId}","content":{...valid game...}}`;

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

export async function generateMicrobreaksFromPlan(
  plan: Plan[],
  digest: LessonDigest
): Promise<GeneratedPlannedGame[]> {
  if (plan.length === 0) return [];

  const model = await getJsonModel();
  const generationInput = {
    plan,
    digest,
    rules: {
      exactLength: plan.length,
      includeSlotId: true,
      schemaStrict: true,
      digestOnly: true,
    },
  };

  let generated: GeneratedPlannedGame[];
  try {
    const prompt = `${GENERATOR_PROMPT}\n\nInput:\n${JSON.stringify(generationInput, null, 2)}\n\nReturn JSON array of length ${plan.length}. Each item format:\n{"slotId":"...","content":{"breakType":"game","gameType":"...",...}}`;
    const result = await model.generateContent(prompt);
    generated = parseJson<GeneratedPlannedGame[]>(result.response.text());
  } catch (error) {
    console.warn(`[GameGenerator] bulk generation failed; using deterministic fallback. ${error instanceof Error ? error.message : 'unknown'}`);
    return plan.map(p => ({
      slotId: p.slotId,
      content: hardenGeneratedGameContent(fallbackGameFromDigest(p, digest), digest),
    }));
  }

  if (!Array.isArray(generated) || generated.length !== plan.length) {
    console.warn('[GameGenerator] Generated batch length mismatch; using deterministic fallback.');
    return plan.map(p => ({
      slotId: p.slotId,
      content: hardenGeneratedGameContent(fallbackGameFromDigest(p, digest), digest),
    }));
  }

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
      const schemaErrors = validateGameSchemaAndContent(planItem.gameType, game.content, digestTokenSet, digest);
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

  for (const [index, reasons] of failures.entries()) {
    const existing = repaired[index];
    const planItem = slotById.get(existing.slotId) || plan[index];
    try {
      const repairedGame = await repairSingleGame(model, planItem, digest, reasons);
      repaired[index] = repairedGame;
    } catch (error) {
      console.warn(`[GameGenerator] targeted repair failed for index ${index}; using fallback. ${error instanceof Error ? error.message : 'unknown'}`);
      repaired[index] = {
        slotId: planItem.slotId,
        content: hardenGeneratedGameContent(fallbackGameFromDigest(planItem, digest), digest),
      };
    }
  }

  const finalDuplicates = validateNoDuplicateStems(repaired);
  repaired.forEach((game, index) => {
    const planItem = slotById.get(game.slotId) || plan[index];
    game.content = hardenGeneratedGameContent(game.content, digest);
    const schemaErrors = validateGameSchemaAndContent(planItem.gameType, game.content, digestTokenSet, digest);
    const duplicateError = finalDuplicates.get(index);

    if (schemaErrors.length > 0 || duplicateError) {
      const fallback = hardenGeneratedGameContent(fallbackGameFromDigest(planItem, digest), digest);
      repaired[index] = {
        slotId: planItem.slotId,
        content: fallback,
      };
    }
  });

  return repaired;
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

  const eligibleTypes = getEligibleTypes(allowedGameTypes, digest);
  if (eligibleTypes.length === 0) {
    throw new Error('No eligible game types available for this lesson based on hard constraints.');
  }

  const plan = await planMicrobreaks(slots, digest, eligibleTypes);
  if (plan.length !== slots.length) {
    throw new Error(`Planner returned ${plan.length} entries for ${slots.length} slots.`);
  }

  const generatedGames = await generateMicrobreaksFromPlan(plan, digest);
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
  return validateGameSchemaAndContent(expectedType, content, extractDigestTokenSet(digest), digest);
}

export function __testFallbackGameFromDigest(plan: Plan, digest: LessonDigest): MicrobreakContent {
  return fallbackGameFromDigest(plan, digest);
}
