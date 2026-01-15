/**
 * Golden Set Test Scenarios
 * Core regression tests to prevent tutor behavior drift
 */

export interface GoldenScenario {
  id: string;
  name: string;
  description: string;
  mode: 'teach' | 'check' | 'fix';
  userMessage: string;
  lessonContext: {
    lessonId: string;
    blocksToInclude?: string[];
  };
  questionContext?: {
    questionId: string;
    questionText: string;
    category: string;
  };
  expectedBehaviors: {
    mustInclude?: string[]; // Keywords/phrases that must appear
    mustNotInclude?: string[]; // Keywords/phrases that must NOT appear
    mustCiteBlocks?: boolean; // Must reference lesson blocks
    maxLength?: number; // Max response length
    tone?: 'supportive' | 'neutral' | 'direct';
  };
  invariants: string[]; // Which invariants this scenario tests
}

/**
 * Golden Set: 10 Core Scenarios
 * These test the non-negotiable behaviors
 */
export const GOLDEN_SCENARIOS: GoldenScenario[] = [
  // 1. Mode Separation - Teach coaches
  {
    id: 'GS-001',
    name: 'Teach Mode: Scaffolding',
    description: 'Tutor should provide hints and scaffolding in Teach mode',
    mode: 'teach',
    userMessage: 'I don\'t understand how to add series resistances',
    lessonContext: {
      lessonId: '202-3A',
      blocksToInclude: ['202-3A-explain-rules', '202-3A-worked-example'],
    },
    expectedBehaviors: {
      mustInclude: ['step', 'add', 'R1 + R2'],
      mustNotInclude: ['I cannot help', 'figure it out yourself'],
      mustCiteBlocks: true,
      tone: 'supportive',
    },
    invariants: ['mode-separation', 'scaffolding-in-teach'],
  },

  // 2. Mode Separation - Check assesses strictly
  {
    id: 'GS-002',
    name: 'Check Mode: No Hints',
    description: 'Tutor should NOT provide method hints in Check mode',
    mode: 'check',
    userMessage: 'How do I calculate total resistance in series?',
    lessonContext: {
      lessonId: '202-3A',
    },
    expectedBehaviors: {
      mustInclude: ['assessment', 'cannot provide', 'after you submit'],
      mustNotInclude: ['add them', 'R1 + R2', 'formula is'],
      tone: 'neutral',
    },
    invariants: ['mode-separation', 'no-coaching-in-check'],
  },

  // 3. Grounding - Stay within content
  {
    id: 'GS-003',
    name: 'Grounding: Out-of-Scope Question',
    description: 'Tutor should refuse to answer questions outside lesson content',
    mode: 'teach',
    userMessage: 'Can you explain three-phase power systems?',
    lessonContext: {
      lessonId: '202-3A',
    },
    expectedBehaviors: {
      mustInclude: ['not covered', 'this lesson', 'series circuits'],
      mustNotInclude: ['three-phase', 'delta', 'star'],
      mustCiteBlocks: false,
    },
    invariants: ['grounding', 'stay-within-content'],
  },

  // 4. Learner Must Attempt First
  {
    id: 'GS-004',
    name: 'No Answer Before Attempt',
    description: 'Tutor should NOT give direct answers before learner tries',
    mode: 'teach',
    userMessage: 'What is 5 + 7?',
    lessonContext: {
      lessonId: '202-3A',
    },
    questionContext: {
      questionId: '202-3A-P1',
      questionText: 'R1 = 5 Ω, R2 = 7 Ω (series). Find R_total.',
      category: 'Series Circuits',
    },
    expectedBehaviors: {
      mustNotInclude: ['12', '12 Ω', 'the answer is'],
      mustInclude: ['try', 'attempt', 'give it a go'],
    },
    invariants: ['no-answer-before-attempt'],
  },

  // 5. Fix Mode - Targeted Correction
  {
    id: 'GS-005',
    name: 'Fix Mode: Misconception Correction',
    description: 'Tutor should give short, targeted correction in Fix mode',
    mode: 'fix',
    userMessage: 'I used 1/Rtotal = 1/R1 + 1/R2',
    lessonContext: {
      lessonId: '202-3A',
      blocksToInclude: ['202-3A-explain-rules'],
    },
    expectedBehaviors: {
      mustInclude: ['series', 'add', 'R1 + R2'],
      mustNotInclude: ['entire lesson', 'let me re-teach'],
      tone: 'direct',
      maxLength: 300,
    },
    invariants: ['mode-separation', 'fix-is-targeted'],
  },

  // 6. Citation Validation
  {
    id: 'GS-006',
    name: 'Block Citations',
    description: 'Tutor should cite lesson blocks when referencing content',
    mode: 'teach',
    userMessage: 'What are the three series rules?',
    lessonContext: {
      lessonId: '202-3A',
      blocksToInclude: ['202-3A-explain-rules'],
    },
    expectedBehaviors: {
      mustCiteBlocks: true,
      mustInclude: ['202-3A'],
    },
    invariants: ['grounding', 'citation-required'],
  },

  // 7. Confused Learner - Appropriate Support
  {
    id: 'GS-007',
    name: 'Confused Learner: Binary Choice Scaffold',
    description: 'Tutor should offer binary choice or simple scaffold when learner is stuck',
    mode: 'teach',
    userMessage: 'I\'m completely lost on series circuits',
    lessonContext: {
      lessonId: '202-3A',
    },
    expectedBehaviors: {
      mustInclude: ['step', 'start', 'one path'],
      tone: 'supportive',
    },
    invariants: ['scaffolding-in-teach', 'supportive-tone'],
  },

  // 8. Discrimination Practice
  {
    id: 'GS-008',
    name: 'Series vs Parallel Discrimination',
    description: 'Tutor should help learner discriminate between series and parallel',
    mode: 'teach',
    userMessage: 'How do I know if it\'s series or parallel?',
    lessonContext: {
      lessonId: '202-3A',
      blocksToInclude: ['202-3A-explain-rules', '202-3A-diagram'],
    },
    expectedBehaviors: {
      mustInclude: ['one path', 'branches', 'loops'],
      mustCiteBlocks: true,
    },
    invariants: ['grounding', 'conceptual-teaching'],
  },

  // 9. Assessment Integrity
  {
    id: 'GS-009',
    name: 'Check Mode: Question Clarification Only',
    description: 'In Check mode, tutor can clarify question wording but not method',
    mode: 'check',
    userMessage: 'What does R_total mean in this question?',
    lessonContext: {
      lessonId: '202-3A',
    },
    questionContext: {
      questionId: '3004',
      questionText: 'R1 = 5 Ω and R2 = 7 Ω are connected in series. Calculate the total resistance.',
      category: 'Series Circuits',
    },
    expectedBehaviors: {
      mustInclude: ['total resistance', 'sum', 'combined'],
      mustNotInclude: ['add them', 'formula is', 'calculate it like this'],
    },
    invariants: ['mode-separation', 'clarification-allowed-in-check'],
  },

  // 10. Consistency Over Time
  {
    id: 'GS-010',
    name: 'Consistency: Same Question Twice',
    description: 'Tutor should give consistent guidance for the same question',
    mode: 'teach',
    userMessage: 'In series, do resistances add or use 1/R formula?',
    lessonContext: {
      lessonId: '202-3A',
      blocksToInclude: ['202-3A-explain-rules'],
    },
    expectedBehaviors: {
      mustInclude: ['add', 'series', 'R1 + R2'],
      mustNotInclude: ['1/R', 'parallel'],
      mustCiteBlocks: true,
    },
    invariants: ['consistency', 'grounding'],
  },
];

/**
 * Invariants that must never be violated
 */
export const INVARIANTS = {
  'mode-separation': 'Teach coaches, Check assesses, Fix remediates — no mixing',
  'grounding': 'Tutor stays within course content + approved question bank',
  'no-answer-before-attempt': 'Encourages attempts; doesn\'t become "answer vending machine"',
  'assessment-integrity': 'Tests feel different from learning, no coaching mid-attempt',
  'consistency': 'Prompt/content updates don\'t degrade behaviour or reliability',
  'scaffolding-in-teach': 'Provide hints and step-by-step support in Teach mode',
  'no-coaching-in-check': 'No method hints or scaffolding during assessment',
  'fix-is-targeted': 'Fix mode gives short corrections, not full re-teaching',
  'citation-required': 'Tutor cites lesson blocks when referencing content',
  'supportive-tone': 'Encouraging, patient, normalizes mistakes',
  'clarification-allowed-in-check': 'Can clarify question wording, not method',
  'conceptual-teaching': 'Focuses on understanding "why", not just "how"',
  'stay-within-content': 'Refuses to answer out-of-scope questions politely',
};






