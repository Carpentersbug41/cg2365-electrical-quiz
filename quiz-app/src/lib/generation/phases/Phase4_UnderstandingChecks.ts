/**
 * Phase 4: Understanding Checks
 * Generates formative assessment questions aligned with explanations
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { ExplanationBlock } from './Phase3_Explanation';

export interface UnderstandingChecksInput {
  lessonId: string;
  explanations: ExplanationBlock[];
  teachingConstraints?: {
    excludeHowTo?: boolean;
    purposeOnly?: boolean;
    identificationOnly?: boolean;
    noCalculations?: boolean;
    specificScope?: string;
  };
  taskMode?: string; // Explicit task mode string
}

export interface UnderstandingQuestion {
  id: string;
  questionText: string;
  answerType: 'short-text';
  cognitiveLevel: 'recall' | 'connection';
  expectedAnswer: string[];
  hint: string;
}

export interface UnderstandingCheckBlock {
  id: string;
  order: number;
  title: string;
  mode: 'conceptual';
  sequential: true;
  questions: UnderstandingQuestion[];
}

export interface UnderstandingChecksOutput {
  checks: UnderstandingCheckBlock[];
}

export class Phase4_UnderstandingChecks extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 4: Understanding Checks';
  }

  protected buildSystemPrompt(): string {
    return `You are an assessment specialist for C&G 2365 Electrical Training.

Your task is to create formative assessment questions that check understanding of taught concepts.

CRITICAL RULE: Every expectedAnswer MUST exist verbatim or paraphrased in the explanation text provided.

QUESTION STRUCTURE (for each check):
- Question 1 (L1-A): Simple recall - test one specific fact from explanation
- Question 2 (L1-B): Simple recall - test another fact, building on Q1
- Question 3 (L1-C): Simple recall - test a third fact, building on Q1 and Q2
- Question 4 (L2): Connection - MUST explicitly reference Q1, Q2, and Q3 facts by name/content

COGNITIVE LEVELS:
- Recall (L1): "What is...", "Define...", "State..." - simple factual questions
- Connection (L2): "How do X and Y relate?", "Why does X affect Y?" - relationship questions

L2 CONNECTION QUESTION REQUIREMENTS (CRITICAL):
- MUST begin with: "Using your answers to Q1 ([brief topic]), Q2 ([brief topic]), and Q3 ([brief topic])..."
- MUST explicitly reference all three L1 facts by their content
- MUST ask how they connect or relate to each other
- Example: "Using your answers to Q1 (definition), Q2 (purpose), and Q3 (key components), explain how these three aspects work together..."

TEACHING CONSTRAINTS (if provided):
If teachingConstraints.excludeHowTo or purposeOnly OR TASK_MODE includes "PURPOSE_ONLY":
- L1 questions MUST test PURPOSE and IDENTIFICATION, NOT procedures
- BANNED QUESTION PATTERNS:
  * "How do you [verb]..."
  * "What is the first step..."
  * "Describe the process..."
  * "What technique..."
  * "How to [action]..."
- BANNED VERBS AND CONCEPTS in questions:
  * Physical actions: place, clamp, rotate, pull, turn, push, tighten, loosen, secure, insert, thread, break the chip, lubricate, half-turn
  * Process words: technique, method, step, process, operate
  * Measurement workflow: gain, take-off, shrink, set, deduction, offset calculation, set-point, mark-up
  * Cleaning/maintenance: clear, clean, remove, wipe, maintain, brush, flush
  * Assembly/disassembly: assemble, install, mount, attach, detach, dismantle
  * Adjustment/calibration: adjust, calibrate, tune, align, level
- REQUIRED QUESTION PATTERNS:
  * "What is [X] used for?"
  * "Which tool should be selected when..."
  * "State the purpose of [X]"
  * "Identify the equipment for [scenario]"
  * "What does [X] enable/achieve/solve?"

If teachingConstraints.identificationOnly OR TASK_MODE includes "IDENTIFICATION":
- Focus L1 questions on: "Name the tool that...", "Identify the component...", "State what [X] is used for..."
- Avoid procedural questions entirely

ANSWER FORMAT:
- expectedAnswer: ALWAYS an array of strings (2-6 acceptable variations)
- Include synonyms, alternative phrasings, and common variations
- At least ONE variant must match explanation wording closely

EXPECTED ANSWER REQUIREMENTS (CRITICAL - marking robustness):

For ALL questions:
- 1 canonical answer (exact wording from explanation)
- Maximum 2-3 variants (case/singular/plural/acronym only)
- NO broad paraphrases that accept incorrect understanding
- NO generic catch-all phrases

For percentage/number answers:
- Full: "45% Rule"
- Numeric: "45%", "45 percent"
- Max 3 variants

For terminology:
- Exact term: "Cable Factor"
- With article: "the Cable Factor"
- Max 2 variants

For definitions:
- Canonical phrase from explanation
- One close paraphrase if essential
- Max 2 variants

This prevents marking leniency and score inconsistency.

VARIANT QUALITY CHECK:
- Each variant must test the SAME specific fact/concept
- Reject variants that would accept adjacent but wrong understanding
- Examples:
  * GOOD: "creates smooth bends" / "forms bends without kinking" (same concept)
  * BAD: "shapes the conduit" (too generic - doesn't specify the quality requirement)
  * GOOD: "to cut external screw threads" / "create external threads on conduit"
  * BAD: "to prepare the conduit" (too vague - doesn't specify what preparation)

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: UnderstandingChecksInput): string {
    const { lessonId, explanations, teachingConstraints, taskMode } = input;

    return `Create understanding check questions for this lesson's explanations.

${explanations.map((exp, idx) => `
EXPLANATION ${idx + 1} (Order ${exp.order}):
Title: ${exp.title}
Content:
${exp.content}

---`).join('\n')}
${taskMode ? `
TASK MODE: ${taskMode}

CRITICAL REMINDERS based on task mode:
${taskMode.includes('PURPOSE_ONLY') ? '- BANNED VERBS in questions: place, clamp, rotate, pull, turn, tighten, thread, lubricate, insert, secure, technique, method, step, process, operate' : ''}
${taskMode.includes('PURPOSE_ONLY') ? '- REQUIRED: Test "what for?" not "how to do?" - Use patterns like "What is [X] used for?", "State the purpose of [X]"' : ''}
${taskMode.includes('IDENTIFICATION') ? '- Focus on: "Name the tool that...", "Identify the component...", "Which equipment for [scenario]?"' : ''}
` : ''}

Create ${explanations.length} understanding check block(s), one immediately after each explanation.

Return JSON in this exact format:
{
  "checks": [
    {
      "id": "${lessonId}-check-1",
      "order": ${explanations[0] ? explanations[0].order + 0.5 : 4.5},
      "title": "Check Your Understanding: ${explanations[0]?.title || '[Topic]'}",
      "mode": "conceptual",
      "sequential": true,
      "questions": [
        {
          "id": "${lessonId}-C1-L1-A",
          "questionText": "[Simple recall question about a specific fact from explanation 1]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[Answer from explanation]", "[Alternative phrasing]"],
          "hint": "[Gentle hint]"
        },
        {
          "id": "${lessonId}-C1-L1-B",
          "questionText": "[Another recall question, building on Q1]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[Another fact from explanation]", "[Alternative]"],
          "hint": "[Hint]"
        },
        {
          "id": "${lessonId}-C1-L1-C",
          "questionText": "[Third recall question]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[Third fact from explanation]", "[Alternative]"],
          "hint": "[Hint]"
        },
        {
          "id": "${lessonId}-C1-L2",
          "questionText": "Using your answers to Q1 ([brief Q1 topic]), Q2 ([brief Q2 topic]), and Q3 ([brief Q3 topic]), explain [how they relate/work together/connect].",
          "answerType": "short-text",
          "cognitiveLevel": "connection",
          "expectedAnswer": ["[Answer showing relationships between all 3 facts]", "[Alternative phrasing]"],
          "hint": "[Hint about connections]"
        }
      ]
    }${explanations.length > 1 ? `,
    {
      "id": "${lessonId}-check-2",
      "order": ${explanations[1] ? explanations[1].order + 0.5 : 5.5},
      "title": "Check Your Understanding: ${explanations[1]?.title || '[Topic 2]'}",
      "mode": "conceptual",
      "sequential": true,
      "questions": [
        {
          "id": "${lessonId}-C2-L1-A",
          "questionText": "[Recall from explanation 2]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[Answer]", "[Alternative]"],
          "hint": "[Hint]"
        },
        {
          "id": "${lessonId}-C2-L1-B",
          "questionText": "[Recall from explanation 2]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[Answer]", "[Alternative]"],
          "hint": "[Hint]"
        },
        {
          "id": "${lessonId}-C2-L1-C",
          "questionText": "[Recall from explanation 2]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[Answer]", "[Alternative]"],
          "hint": "[Hint]"
        },
        {
          "id": "${lessonId}-C2-L2",
          "questionText": "Using your answers to Q1 ([brief Q1 topic]), Q2 ([brief Q2 topic]), and Q3 ([brief Q3 topic]), explain [how they relate/work together/connect].",
          "answerType": "short-text",
          "cognitiveLevel": "connection",
          "expectedAnswer": ["[Answer showing relationships between all 3 facts]", "[Alternative]"],
          "hint": "[Hint]"
        }
      ]
    }` : ''}
  ]
}

CRITICAL REQUIREMENTS:
- Every expectedAnswer must come from the explanation text (quote or paraphrase)
- Connection questions (L2) MUST begin with "Using your answers to Q1, Q2, and Q3..." and explicitly reference all three facts by their content
- Include 4-6 acceptable answer variations in expectedAnswer arrays (minimum 2-4 for definitions)
- For percentage/terminology answers, include multiple forms (numeric, written, with/without articles)
- Questions must build logically (Q1 → Q2 → Q3 → Q4 connects them all)
- L2 questions must tie all three L1 facts together into a cohesive explanation
- If constraints present: Test PURPOSE and IDENTIFICATION, not procedural steps`;
  }
}
