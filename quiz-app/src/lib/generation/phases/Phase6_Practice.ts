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
If teachingConstraints.excludeHowTo or purposeOnly:
- Practice questions MUST test purpose/selection, NOT procedures
- WRONG: "Describe the steps to thread conduit"
- RIGHT: "Which tool is used to create threads on steel conduit ends?"
- Focus on: identification, selection, purpose, reasoning
- Avoid: step-by-step procedures, sequential operations

If teachingConstraints.identificationOnly:
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

ANSWER VARIANT REQUIREMENTS (CRITICAL for robust marking):

For percentage/number-based answers (e.g., "45% rule"), include ALL these forms:
- Full phrase: "45% Rule", "45 percent rule"
- With article: "The 45% Rule", "the 45% rule"
- Numeric only: "45%", "45", "45 percent"
- Written form: "forty-five percent", "forty five percent"
Minimum 4-6 variants for any percentage/rule answer.

For terminology (e.g., "Cable Factor"):
- Singular and plural: "Cable Factor", "Cable Factors"
- With/without articles: "the Cable Factor", "Cable Factor", "a Cable Factor"
- Common variations: "factor for the cable", "cable's factor"
Minimum 3-4 variants for terminology.

For definitions/concepts:
- Include paraphrased versions
- Include shortened versions
- Include alternative wordings from the explanation
Minimum 2-4 variants.

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: PracticeInput): string {
    const { lessonId, explanations, vocabulary, hasWorkedExample, teachingConstraints } = input;

    const explanationTexts = explanations.map(exp => `${exp.title}:\n${exp.content}`).join('\n\n---\n\n');
    const vocabTerms = vocabulary.terms.map(t => `- ${t.term}: ${t.definition}`).join('\n');

    return `Create independent practice questions for this lesson.

EXPLANATION CONTENT (questions must assess this):
${explanationTexts}

VOCABULARY TERMS:
${vocabTerms}

LESSON CONTEXT:
- Has worked example: ${hasWorkedExample ? 'YES (include calculation questions)' : 'NO (focus on conceptual)'}
${teachingConstraints ? `
TEACHING CONSTRAINTS (CRITICAL - MUST FOLLOW):
${teachingConstraints.excludeHowTo ? '- EXCLUDE procedural questions - test PURPOSE and SELECTION only' : ''}
${teachingConstraints.purposeOnly ? '- PURPOSE ONLY: Test "what for?" not "how to do?"' : ''}
${teachingConstraints.identificationOnly ? '- IDENTIFICATION ONLY: Matching, selection, or "what is used for?" questions' : ''}
${teachingConstraints.noCalculations ? '- NO CALCULATION questions' : ''}
${teachingConstraints.specificScope ? `- SPECIFIC SCOPE: ${teachingConstraints.specificScope}` : ''}
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
