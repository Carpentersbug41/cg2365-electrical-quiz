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
  taskMode: string; // Explicit task mode string
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
    return `You are an assessment specialist for City & Guilds technical and vocational training.

Your task is to create independent practice questions that assess understanding of taught concepts.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Do not assume a specific trade or subject domain.
- Keep question framing transferable across technical subjects.

QUESTION TYPES:
- If lesson has calculations: include 2-3 numeric questions
- Include 2-3 short-text conceptual/application questions
- Mix direct application and scenario-based prompts

TRANSFER REQUIREMENT (CRITICAL):
- At least one practice question must be a novel transfer scenario (same concept, new context).

EARLY REASONING REQUIREMENT (CRITICAL):
- Include at least one non-recall question using one of these stems:
  * Why...?
  * How do we know...?
  * What must be true if...?
  * Explain why this cannot...

TEACHING CONSTRAINTS (if provided):
If TASK_MODE includes "PURPOSE_ONLY":
- Practice questions test purpose/selection/identification, not operation procedures.
- Avoid procedural phrasing (e.g., "describe the steps", "how do you operate...").

If TASK_MODE includes "IDENTIFICATION":
- Prefer matching, selection, and recognition formats.

EXPECTED ANSWER FORMAT RULES (CRITICAL):
- expectedAnswer MUST ALWAYS be an array, never a single string.
- Numeric expectedAnswer values must contain numbers only (no units/symbols).
- Units/context belong in hint field.

NUMERIC QUESTION REQUIREMENTS:
- Rounding instruction is CONDITIONAL:
  * include only when mathematically needed,
  * omit for exact-integer fact questions.
- Numeric expectedAnswer variants: 1-2 only (e.g., ["40", "40.0"]).

SHORT-TEXT REQUIREMENTS:
- expectedAnswer variants: EXACTLY 2-4
- canonical first
- variants should be tight normalization (case/article/plural/hyphen)
- avoid broad paraphrases that over-accept weak understanding

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: PracticeInput): string {
    const { lessonId, explanations, vocabulary, hasWorkedExample, taskMode } = input;

    const explanationTexts = explanations.map(exp => `${exp.title}:\n${exp.content}`).join('\n\n---\n\n');
    const vocabTerms = vocabulary.terms.map(t => `- ${t.term}: ${t.definition}`).join('\n');

    return `Create independent practice questions for this lesson.

EXPLANATION CONTENT (questions must assess this):
${explanationTexts}

VOCABULARY TERMS:
${vocabTerms}

LESSON CONTEXT:
- Has worked example: ${hasWorkedExample ? 'YES (include suitable numeric/application questions)' : 'NO (focus conceptual/application)'}
${taskMode ? `
TASK MODE: ${taskMode}

CRITICAL REMINDERS based on task mode:
${taskMode.includes('PURPOSE_ONLY') ? '- Test "what for / when to choose", not operation procedures.' : ''}
${taskMode.includes('IDENTIFICATION') ? '- Focus on recognition/selection cues.' : ''}
${taskMode.includes('CALCULATION') ? '- Include numeric questions where taught content supports them.' : ''}
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
        "expectedAnswer": ["[answer]", "[variation]"] ,
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
- Mix difficulty and application depth
- All answers must be derivable from explanation content
- Include at least one early reasoning question (Why/How do we know/What must be true/Explain why this cannot)
- For numeric questions:
  * answerType: "numeric"
  * expectedAnswer numbers only
  * include rounding instruction only when mathematically needed
  * include units/context in hint
- For short-text:
  * answerType: "short-text"
  * expectedAnswer: 2-4 tight variants
- Keep language domain-agnostic and technically defensible`; 
  }
}
