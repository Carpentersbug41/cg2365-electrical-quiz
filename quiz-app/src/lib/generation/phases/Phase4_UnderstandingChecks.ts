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

ANCHOR FACT METHOD (REQUIRED):
For EACH explanation block:
1) Select EXACTLY 3 "Anchor Facts" from the explanation text.
   - Each Anchor Fact MUST be a short verbatim phrase/sentence copied from the explanation (6–20 words).
   - Each Anchor Fact MUST be important, specific, and gradeable (not vague).
2) Write Q1, Q2, Q3 as simple recall questions, each testing ONE Anchor Fact.
3) Write Q4 (L2) as a connection question that explicitly connects ALL THREE Anchor Facts.

IMPORTANT: Do NOT output the anchor facts as separate fields (no schema changes). Use them internally to generate questions and expected answers.

QUESTION STRUCTURE (for each check):
- Question 1 (L1-A): Simple recall - tests Anchor Fact 1
- Question 2 (L1-B): Simple recall - tests Anchor Fact 2 (builds on Q1)
- Question 3 (L1-C): Simple recall - tests Anchor Fact 3 (builds on Q1 and Q2)
- Question 4 (L2): Connection - MUST explicitly reference Q1, Q2, and Q3 facts by content and ask how they relate

COGNITIVE LEVELS:
- Recall (L1): "What is...", "Define...", "State..." - single factual target
- Connection (L2): "Using your answers..." - relationship between the 3 facts

L2 CONNECTION QUESTION REQUIREMENTS (CRITICAL):
- MUST begin with: "Using your answers to Q1 ([brief topic]), Q2 ([brief topic]), and Q3 ([brief topic])..."
- MUST explicitly reference all three L1 facts by their content (not just "Q1/Q2/Q3")
- MUST ask how they connect, relate, or work together

NO NEW TERMS (CRITICAL):
- Do NOT introduce new technical terms in questionText that do not appear in the explanation text.
- Do NOT introduce standards/regulation references unless they appear in the explanation text.

TEACHING CONSTRAINTS (if provided):
If teachingConstraints.excludeHowTo or teachingConstraints.purposeOnly OR TASK_MODE includes "PURPOSE_ONLY":
- Questions MUST test PURPOSE / IDENTIFICATION / SELECTION, NOT procedures
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
  * "Which tool/equipment should be selected when...?"
  * "State the purpose of [X]"
  * "Identify the equipment/component for [scenario]"
  * "What does [X] enable/achieve/solve?"

If teachingConstraints.identificationOnly OR TASK_MODE includes "IDENTIFICATION":
- Focus on recognition and selection cues
- Avoid procedural phrasing entirely

EXPECTED ANSWER RULES (CRITICAL - marking robustness):

⚠️ CRITICAL FORMAT REQUIREMENT:
expectedAnswer MUST ALWAYS be an array, NEVER a string.

WRONG:  "expectedAnswer": "5mm"           ❌
WRONG:  "expectedAnswer": "ring circuit"  ❌  
RIGHT:  "expectedAnswer": ["5mm"]         ✅
RIGHT:  "expectedAnswer": ["ring circuit"] ✅

Even for single-word answers, ALWAYS use array format: ["answer"]

L1 QUESTIONS (recall):
- expectedAnswer MUST contain EXACTLY 2–4 strings (ARRAY FORMAT)
- The FIRST string is the canonical answer and MUST be copied verbatim from the explanation text (exact substring)
- Example: "expectedAnswer": ["protective conductor", "earth conductor", "cpc"]
- Remaining variants MUST be tight normalization ONLY:
  * case changes
  * singular/plural
  * with/without "the"/"a"
  * symbol normalization (mm2 vs mm², % vs percent)
- NO broad paraphrases. NO "catch-all" variants.

L2 QUESTION (connection):
- expectedAnswer MUST contain EXACTLY 1–2 strings (ARRAY FORMAT)
- Canonical answer should be 1–2 sentences
- Example: "expectedAnswer": ["All three work together to ensure safe isolation"]
- Canonical answer MUST include the 3 Anchor Facts verbatim (you may embed them as clauses)
- Optional second variant may differ only by trivial punctuation/article changes
- Do NOT accept vague summaries

HINTS:
- Provide a short, helpful hint (one sentence). No new content.

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
${taskMode.includes('PURPOSE_ONLY') ? '- Test "what for / when to choose / identify", NOT "how to do". Avoid procedural verbs.' : ''}
${taskMode.includes('IDENTIFICATION') ? '- Focus on recognition and selection cues: identify/name/choose for scenario.' : ''}
` : ''}

Create ${explanations.length} understanding check block(s), one immediately after each explanation.

⚠️⚠️⚠️ CRITICAL JSON FORMAT REQUIREMENT ⚠️⚠️⚠️

expectedAnswer MUST ALWAYS BE AN ARRAY, even for single answers:
- WRONG: "expectedAnswer": "ring circuit"
- RIGHT: "expectedAnswer": ["ring circuit"]
- WRONG: "expectedAnswer": "to provide protection"  
- RIGHT: "expectedAnswer": ["to provide protection"]

Use ["answer"] format even for single values. This is NON-NEGOTIABLE.

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
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 1]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM canonical substring from explanation]", "[tight variant]", "[optional tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C1-L1-B",
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 1]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM canonical substring from explanation]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C1-L1-C",
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 1]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM canonical substring from explanation]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C1-L2",
          "questionText": "Using your answers to Q1 ([brief Q1 topic]), Q2 ([brief Q2 topic]), and Q3 ([brief Q3 topic]), explain how these three facts relate or work together.",
          "answerType": "short-text",
          "cognitiveLevel": "connection",
          "expectedAnswer": ["[1–2 sentences INCLUDING the 3 anchor phrases verbatim]", "[optional tight variant]"],
          "hint": "[one-sentence hint about connecting the three facts]"
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
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 2]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM canonical substring from explanation]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C2-L1-B",
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 2]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM canonical substring from explanation]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C2-L1-C",
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 2]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM canonical substring from explanation]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C2-L2",
          "questionText": "Using your answers to Q1 ([brief Q1 topic]), Q2 ([brief Q2 topic]), and Q3 ([brief Q3 topic]), explain how these three facts relate or work together.",
          "answerType": "short-text",
          "cognitiveLevel": "connection",
          "expectedAnswer": ["[1–2 sentences INCLUDING the 3 anchor phrases verbatim]", "[optional tight variant]"],
          "hint": "[one-sentence hint]"
        }
      ]
    }` : ''}
  ]
}

CRITICAL REQUIREMENTS:
- Generate ONE check block per explanation block.
- Block order MUST be explanation.order + 0.5.
- Q1–Q3 must each test ONE specific anchor fact from the explanation.
- L2 question MUST start with "Using your answers to Q1…, Q2…, and Q3…" and MUST reference all three facts by content.
- expectedAnswer arrays must be TIGHT:
  * L1: EXACTLY 2–4 strings, canonical FIRST, canonical MUST be verbatim substring from the explanation.
  * L2: EXACTLY 1–2 strings, and MUST include the 3 anchor phrases verbatim.
- Do NOT introduce new terms not present in the explanation text.
- If constraints indicate PURPOSE_ONLY / IDENTIFICATION: test selection/purpose/recognition only (no procedures).`;
  }
}
