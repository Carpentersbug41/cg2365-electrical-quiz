/**
 * Phase 6: Practice Questions
 * Generates independent practice questions ("You Do")
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { ExplanationBlock } from './Phase3_Explanation';
import { VocabularyOutput } from './Phase2_Vocabulary';

export interface PracticeInput {
  lessonId: string;
  explanations: ExplanationBlock[];
  vocabulary: VocabularyOutput;
  hasWorkedExample: boolean;
  teachingConstraints?: {
    excludeHowTo?: boolean;
    purposeOnly?: boolean;
    identificationOnly?: boolean;
    noCalculations?: boolean;
    specificScope?: string;
  };
  taskMode?: string; // Explicit task mode string
}

export interface PracticeQuestion {
  id: string;
  questionText: string;
  answerType: 'numeric' | 'short-text';
  expectedAnswer: string[];
  hint: string;
  units?: string;
}

export interface PracticeBlock {
  id: string;
  order: number;
  title: string;
  questions: PracticeQuestion[];
}

export interface PracticeOutput {
  practice: PracticeBlock;
}

export class Phase6_Practice extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 6: Practice';
  }

  protected buildSystemPrompt(): string {
    return `You are an assessment specialist for C&G 2365 Electrical Training.

Your task is to create independent practice questions that assess understanding of taught concepts.

QUESTION TYPES:
- If lesson has calculations: Include 2-3 numeric questions
- Include 2-3 short-text conceptual/application questions
- Mix of direct application and scenario-based questions

TEACHING CONSTRAINTS (if provided):
If teachingConstraints.excludeHowTo or purposeOnly OR TASK_MODE includes "PURPOSE_ONLY":
- Practice questions MUST test purpose/selection, NOT procedures
- BANNED VERBS AND CONCEPTS in questions:
  * Physical actions: place, clamp, rotate, pull, turn, push, tighten, loosen, secure, insert, thread, break the chip, lubricate, half-turn
  * Process words: technique, method, step, process, operate
  * Measurement workflow: gain, take-off, shrink, set, deduction, offset calculation, set-point, mark-up
  * Cleaning/maintenance: clear, clean, remove, wipe, maintain, brush, flush
  * Assembly/disassembly: assemble, install, mount, attach, detach, dismantle
  * Adjustment/calibration: adjust, calibrate, tune, align, level
- BANNED QUESTION PATTERNS:
  * "Describe the steps to..."
  * "How do you [verb]..."
  * "What is the process for..."
  * "Explain the technique..."
- ALLOWED PATTERNS:
  * "Which tool is appropriate for [scenario]?"
  * "State the purpose of [X]"
  * "Identify the equipment needed for [task]"
  * "Select the correct [item] for [material/situation]"
  * Matching exercises: scenario → equipment + purpose

If teachingConstraints.identificationOnly OR TASK_MODE includes "IDENTIFICATION":
- Questions should be matching, selection, or "what is used for..." format

ANSWER FORMAT RULES (CRITICAL):
- expectedAnswer: ALWAYS an array of strings
- For numeric answers: Include ONLY the number in expectedAnswer array (no units!)
- Units go in the "hint" field, not in expectedAnswer
- Examples:
  ✓ expectedAnswer: ["230"], hint: "UK mains voltage (V)"
  ✗ expectedAnswer: ["230V"] - WRONG! No units in expectedAnswer

NUMERIC QUESTION REQUIREMENTS:

Rounding instructions MUST be in questionText:
- For percentages: "(Round to 1 decimal place)" or "(Round to nearest whole number)"
- For areas/dimensions: "(Round to 1 decimal place)" or "(Round to nearest mm²)"
- For factors: "(Round to nearest whole number)"

expectedAnswer for numeric:
- Include both forms: ["40", "40.0"] or ["1125", "1125.0"]
- This handles students who include/exclude trailing zeros

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

  protected buildUserPrompt(input: PracticeInput): string {
    const { lessonId, explanations, vocabulary, hasWorkedExample, teachingConstraints, taskMode } = input;

    const explanationTexts = explanations.map(exp => `${exp.title}:\n${exp.content}`).join('\n\n---\n\n');
    const vocabTerms = vocabulary.terms.map(t => `- ${t.term}: ${t.definition}`).join('\n');

    return `Create independent practice questions for this lesson.

EXPLANATION CONTENT (questions must assess this):
${explanationTexts}

VOCABULARY TERMS:
${vocabTerms}

LESSON CONTEXT:
- Has worked example: ${hasWorkedExample ? 'YES (include calculation questions)' : 'NO (focus on conceptual)'}
${taskMode ? `
TASK MODE: ${taskMode}

CRITICAL REMINDERS based on task mode:
${taskMode.includes('PURPOSE_ONLY') ? '- BANNED VERBS: place, clamp, rotate, pull, turn, tighten, thread, lubricate, insert, secure, technique, method, step, process, operate' : ''}
${taskMode.includes('PURPOSE_ONLY') ? '- Test "what for?" not "how to do?" - Use patterns like "Which tool for [scenario]?", "State the purpose of [X]"' : ''}
${taskMode.includes('IDENTIFICATION') ? '- Matching, selection, or "what is used for?" questions only' : ''}
${taskMode.includes('CALCULATION') ? '- Include numeric calculation questions with rounding instructions' : ''}
` : ''}

Create 3-5 practice questions at order 8.

Return JSON in this exact format:
{
  "practice": {
    "id": "${lessonId}-practice",
    "order": 8,
    "title": "Your Turn (You Do)",
    "questions": [
      {
        "id": "${lessonId}-P1",
        "questionText": "[Practice question 1]",
        "answerType": "numeric|short-text",
        "expectedAnswer": ["[answer]", "[variation 1]", "[variation 2]"],
        "hint": "[Helpful hint]"
      },
      {
        "id": "${lessonId}-P2",
        "questionText": "[Practice question 2]",
        "answerType": "numeric|short-text",
        "expectedAnswer": ["[answer]", "[variation]"],
        "hint": "[Hint]"
      },
      {
        "id": "${lessonId}-P3",
        "questionText": "[Practice question 3]",
        "answerType": "numeric|short-text",
        "expectedAnswer": ["[answer]", "[variation]"],
        "hint": "[Hint]"
      }
    ]
  }
}

REQUIREMENTS:
- 3-5 questions total
- Mix difficulty levels (some straightforward, some applied)
- All answers must be derivable from explanation content
- For numeric questions:
  * answerType: "numeric"
  * expectedAnswer: Array with ONLY numbers (no units!) - include both forms: ["40", "40.0"]
  * MUST include rounding instruction in questionText: "(Round to 1 decimal place)" or "(Round to nearest whole number)"
  * hint: Include units and context
  * Example: expectedAnswer: ["5.5", "5.50"], hint: "Answer in millimetres (mm)"
- For short-text questions:
  * answerType: "short-text"
  * expectedAnswer: Array with 4-6 acceptable phrasings (minimum 2-4 for definitions)
  * For percentage/terminology: Include numeric, written, with/without articles
- Include realistic scenarios where appropriate
- If constraints present: Test PURPOSE and IDENTIFICATION, not step-by-step procedures`;
  }
}
