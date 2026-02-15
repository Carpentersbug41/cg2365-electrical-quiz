import { Lesson } from '@/lib/generation/types';
import { MasterBlockPlanEntry, MasterLessonBlueprint } from './types';

interface BuildMasterBlueprintInput {
  lessonId: string;
  unit: string;
  lo: string;
  topic: string;
  layout: 'split-vis' | 'linear-flow';
  audience: string;
  prerequisites: string[];
  acAnchors: string[];
  acTexts: string[];
  rangeItems: string[];
  inScopeTopics: string[];
  outOfScopeTopics: Array<{ topic: string; taughtInLessonId: string | null }>;
}

function toSentenceCase(value: string): string {
  const text = value.replace(/\s+/g, ' ').trim();
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function unique(items: string[]): string[] {
  return Array.from(new Set(items.filter((item) => item && item.trim().length > 0)));
}

function isSafetyRelevant(unit: string, corpus: string): boolean {
  if (unit === '204') return true;
  const hints = ['wiring', 'isolate', 'prove dead', 'live work', 'terminal', 'conductor', 'safety'];
  const lowered = corpus.toLowerCase();
  return hints.some((hint) => lowered.includes(hint));
}

function needsWorkedExample(corpus: string): boolean {
  const hints = ['calculate', 'formula', 'select', 'size', 'workflow', 'procedure', 'step'];
  const lowered = corpus.toLowerCase();
  return hints.some((hint) => lowered.includes(hint));
}

function buildBlockPlan(lessonId: string, layout: 'split-vis' | 'linear-flow', includeWorked: boolean): MasterBlockPlanEntry[] {
  const entries: MasterBlockPlanEntry[] = [
    { sequence: 1, key: 'outcomes', label: 'Outcomes', type: 'outcomes', order: 1, id: `${lessonId}-outcomes`, required: true },
    { sequence: 2, key: 'vocab', label: 'Vocab', type: 'vocab', order: 2, id: `${lessonId}-vocab`, required: true },
    {
      sequence: 3,
      key: 'diagram',
      label: 'Diagram',
      type: 'diagram',
      order: 3,
      id: `${lessonId}-diagram`,
      required: layout === 'split-vis',
    },
    { sequence: 4, key: 'explanation-a', label: 'Explanation A', type: 'explanation', order: 4, id: `${lessonId}-explain-a`, required: true },
    {
      sequence: 5,
      key: 'check-a',
      label: 'Understanding Check A',
      type: 'practice',
      mode: 'conceptual',
      order: 4.5,
      id: `${lessonId}-check-1`,
      required: true,
    },
    { sequence: 6, key: 'explanation-b', label: 'Explanation B', type: 'explanation', order: 5, id: `${lessonId}-explain-b`, required: false },
    {
      sequence: 7,
      key: 'check-b',
      label: 'Understanding Check B',
      type: 'practice',
      mode: 'conceptual',
      order: 5.5,
      id: `${lessonId}-check-2`,
      required: false,
    },
  ];

  if (includeWorked) {
    entries.push(
      {
        sequence: 10,
        key: 'worked-example',
        label: 'Worked Example',
        type: 'worked-example',
        order: 6,
        id: `${lessonId}-worked-example`,
        required: false,
      },
      {
        sequence: 11,
        key: 'guided-practice',
        label: 'Guided Practice',
        type: 'guided-practice',
        order: 7,
        id: `${lessonId}-guided`,
        required: false,
      }
    );
  }

  entries.push(
    {
      sequence: includeWorked ? 12 : 10,
      key: 'practice',
      label: 'Practice',
      type: 'practice',
      order: 8,
      id: `${lessonId}-practice`,
      required: true,
    },
    {
      sequence: includeWorked ? 13 : 11,
      key: 'integrative',
      label: 'Integrative',
      type: 'practice',
      mode: 'integrative',
      order: 9.5,
      id: `${lessonId}-integrative`,
      required: true,
    },
    {
      sequence: includeWorked ? 14 : 12,
      key: 'spaced-review',
      label: 'Spaced Review',
      type: 'spaced-review',
      order: 10,
      id: `${lessonId}-spaced-review`,
      required: true,
    }
  );

  return entries;
}

export function buildMasterLessonBlueprint(input: BuildMasterBlueprintInput): MasterLessonBlueprint {
  const corpus = `${input.topic} ${input.acTexts.join(' ')}`;
  const includeWorked = needsWorkedExample(corpus);
  const safetyRequired = isSafetyRelevant(input.unit, corpus);
  const entries = buildBlockPlan(input.lessonId, input.layout, includeWorked);
  const assumptionSeeds = [
    'Knows basic electrical terminology used in previous lessons.',
    'Can read short technical definitions and simple circuit statements.',
    'Can follow single-step written instructions.',
  ];

  return {
    identity: {
      lessonId: input.lessonId,
      title: `${input.lessonId} ${toSentenceCase(input.topic)}`,
      unit: input.unit,
      topic: input.topic,
      audience: input.audience,
      layout: input.layout,
      prerequisites: input.prerequisites,
      diagramIds: input.layout === 'split-vis' ? [`${input.lessonId}-diagram`] : [],
    },
    anchors: {
      unit: input.unit,
      learningOutcomes: [input.lo],
      assessmentCriteria: unique(input.acTexts),
      rangeItems: unique(input.rangeItems),
      examIntent: unique(input.acTexts).slice(0, 3).map((text) => `Apply: ${text}`),
      acAnchors: input.acAnchors,
    },
    scopeControl: {
      inScope: unique(input.inScopeTopics),
      outOfScope: input.outOfScopeTopics,
      assumptions: assumptionSeeds,
    },
    lessonOutcomes: [
      {
        id: `${input.lessonId}-LO1`,
        text: `Define key terms used in ${input.topic}.`,
        bloom: 'remember',
        acAnchors: input.acAnchors,
      },
      {
        id: `${input.lessonId}-LO2`,
        text: `Explain core principles in ${input.topic}.`,
        bloom: 'understand',
        acAnchors: input.acAnchors,
      },
      {
        id: `${input.lessonId}-LO3`,
        text: `Apply ${input.topic} to solve lesson problems.`,
        bloom: 'apply',
        acAnchors: input.acAnchors,
      },
    ],
    blockPlan: {
      entries,
      checksAfterExplanation: [
        { explanationId: `${input.lessonId}-explain-a`, checkId: `${input.lessonId}-check-1` },
        { explanationId: `${input.lessonId}-explain-b`, checkId: `${input.lessonId}-check-2` },
      ],
    },
    checksSpec: {
      understandingChecks: [
        {
          id: `${input.lessonId}-check-1`,
          recallCount: 3,
          connectionCount: 1,
          questionIds: [
            `${input.lessonId}-C1-L1-A`,
            `${input.lessonId}-C1-L1-B`,
            `${input.lessonId}-C1-L1-C`,
            `${input.lessonId}-C1-L2`,
          ],
        },
        {
          id: `${input.lessonId}-check-2`,
          recallCount: 3,
          connectionCount: 1,
          questionIds: [
            `${input.lessonId}-C2-L1-A`,
            `${input.lessonId}-C2-L1-B`,
            `${input.lessonId}-C2-L1-C`,
            `${input.lessonId}-C2-L2`,
          ],
        },
      ],
      integrative: {
        id: `${input.lessonId}-integrative`,
        connectionCount: 1,
        synthesisCount: 1,
        questionIds: [`${input.lessonId}-INT-1`, `${input.lessonId}-INT-2`],
      },
    },
    practiceSpec: {
      guidedPracticeRequired: includeWorked,
      practiceCounts: {
        recall: 3,
        apply: 2,
        scenario: 1,
        spotTheError: 0,
      },
    },
    misconceptions: [
      {
        wrongBelief: 'Any related term means the same thing in every context.',
        correctBelief: 'Terms in this lesson are distinct and must be used precisely.',
      },
      {
        wrongBelief: 'You can answer checks without using taught explanation content.',
        correctBelief: 'Checks must be answered from concepts taught in the explanation blocks.',
      },
    ],
    safetyRigRules: {
      required: safetyRequired,
      rules: safetyRequired
        ? ['Rig-safe only', 'No live work', 'Isolate and prove dead before task', 'Stop and fix unsafe conditions']
        : [],
    },
    masteryGate: {
      rule: 'Pass if at least 80% and integrative connection question is correct.',
      passCriteria: ['>=80% across lesson checks', 'Integrative question 1 correct'],
    },
    idConventions: {
      lessonIdPattern: '^UNIT-TOPICCODE$',
      blockIdPattern: `${input.lessonId}-[block-key]`,
      questionIdPattern: `${input.lessonId}-C{n}-L{1|2}(-{A|B|C})?`,
      integrativeIdPattern: `${input.lessonId}-INT-{n}`,
    },
  };
}

export function validateMasterLessonBlueprintContract(blueprint: MasterLessonBlueprint, parentBlueprintId: string): string[] {
  const errors: string[] = [];
  if (!blueprint.identity || blueprint.identity.lessonId !== parentBlueprintId) {
    errors.push('identity.lessonId must match blueprint.id');
  }
  if (!blueprint.anchors || blueprint.anchors.acAnchors.length === 0) {
    errors.push('anchors.acAnchors is required and cannot be empty');
  }
  if (!blueprint.scopeControl || blueprint.scopeControl.inScope.length === 0) {
    errors.push('scopeControl.inScope is required and cannot be empty');
  }
  if (!blueprint.lessonOutcomes || blueprint.lessonOutcomes.length < 2) {
    errors.push('lessonOutcomes must contain at least 2 outcomes');
  }
  if (!blueprint.blockPlan || blueprint.blockPlan.entries.length === 0) {
    errors.push('blockPlan.entries is required and cannot be empty');
  }
  if (!blueprint.checksSpec || blueprint.checksSpec.understandingChecks.length === 0) {
    errors.push('checksSpec.understandingChecks is required');
  }
  if (!blueprint.practiceSpec || !blueprint.practiceSpec.practiceCounts) {
    errors.push('practiceSpec.practiceCounts is required');
  }
  if (!blueprint.masteryGate || !blueprint.masteryGate.rule) {
    errors.push('masteryGate.rule is required');
  }
  if (!blueprint.idConventions || !blueprint.idConventions.questionIdPattern) {
    errors.push('idConventions.questionIdPattern is required');
  }

  const requiredBlockKeys = ['outcomes', 'vocab', 'explanation-a', 'check-a', 'practice', 'integrative', 'spaced-review'];
  const blockKeys = new Set(blueprint.blockPlan.entries.filter((entry) => entry.required).map((entry) => entry.key));
  for (const key of requiredBlockKeys) {
    if (!blockKeys.has(key)) {
      errors.push(`Required block "${key}" is missing from blockPlan.entries`);
    }
  }

  const sorted = blueprint.blockPlan.entries.slice().sort((a, b) => a.order - b.order);
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i].order <= sorted[i - 1].order) {
      errors.push('blockPlan.entries orders must be strictly increasing');
      break;
    }
  }
  for (const pair of blueprint.blockPlan.checksAfterExplanation) {
    const explanation = blueprint.blockPlan.entries.find((entry) => entry.id === pair.explanationId);
    const check = blueprint.blockPlan.entries.find((entry) => entry.id === pair.checkId);
    if (!explanation || !check) {
      errors.push(`checksAfterExplanation references missing ids: ${pair.explanationId} -> ${pair.checkId}`);
      continue;
    }
    if (Math.abs(check.order - explanation.order - 0.5) > 0.0001) {
      errors.push(`Check ${check.id} must be immediately after ${explanation.id} at order +0.5`);
    }
  }

  const invalidIds = blueprint.blockPlan.entries
    .map((entry) => entry.id)
    .filter((id) => !id.startsWith(`${parentBlueprintId}-`));
  if (invalidIds.length > 0) {
    errors.push(`Block IDs must start with ${parentBlueprintId}- (invalid: ${invalidIds.join(', ')})`);
  }

  return errors;
}

export function validateLessonAgainstMasterLessonBlueprint(
  lesson: Lesson,
  blueprint: MasterLessonBlueprint
): string[] {
  const errors: string[] = [];
  if (lesson.id !== blueprint.identity.lessonId) {
    errors.push(`Lesson id "${lesson.id}" does not match blueprint identity.lessonId "${blueprint.identity.lessonId}"`);
  }
  // Backward-compatible normalization:
  // - Older blueprints may over-require explain-b/check-b/explain-c/check-c
  // - Older blueprints may use outdated orders for practice/integrative/spaced-review
  const deprecatedOptionalKeys = new Set(['explanation-b', 'check-b', 'explanation-c', 'check-c']);
  const requiredEntries = blueprint.blockPlan.entries.filter(
    (entry) => entry.required && !deprecatedOptionalKeys.has(entry.key)
  );
  const blocksById = new Map(lesson.blocks.map((block) => [block.id, block]));
  const blockByTypeAndOrder = (type: string, order: number) =>
    lesson.blocks.find((block) => block.type === type && Math.abs(block.order - order) <= 0.0001);

  const expectedOrderForEntry = (entry: MasterBlockPlanEntry): number => {
    if (entry.key === 'practice') return 8;
    if (entry.key === 'integrative') return 9.5;
    if (entry.key === 'spaced-review') return 10;
    return entry.order;
  };

  for (const entry of requiredEntries) {
    const expectedOrder = expectedOrderForEntry(entry);
    const block = blocksById.get(entry.id) ?? blockByTypeAndOrder(entry.type, expectedOrder);
    if (!block) {
      errors.push(`Missing required block from blueprint: ${entry.id}`);
      continue;
    }
    if (block.type !== entry.type) {
      errors.push(`Block ${entry.id} must be type "${entry.type}" but got "${block.type}"`);
    }
    if (Math.abs(block.order - expectedOrder) > 0.0001) {
      errors.push(`Block ${entry.id} must have order ${expectedOrder} but got ${block.order}`);
    }
  }

  for (const pair of blueprint.blockPlan.checksAfterExplanation.slice(0, 2)) {
    const explanation =
      blocksById.get(pair.explanationId) ??
      (pair.explanationId.endsWith('-explain-a')
        ? blockByTypeAndOrder('explanation', 4)
        : blockByTypeAndOrder('explanation', 5));
    const check =
      blocksById.get(pair.checkId) ??
      (pair.checkId.endsWith('-check-1')
        ? blockByTypeAndOrder('practice', 4.5)
        : blockByTypeAndOrder('practice', 5.5));
    if (!explanation || !check) continue;
    if (Math.abs(check.order - explanation.order - 0.5) > 0.0001) {
      errors.push(`Generated lesson violates check placement: ${pair.checkId} must be +0.5 after ${pair.explanationId}`);
    }
  }

  return errors;
}
