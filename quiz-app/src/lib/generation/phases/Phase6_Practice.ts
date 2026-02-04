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

ANSWER FORMAT RULES (CRITICAL):
- expectedAnswer: ALWAYS an array of strings
- For numeric answers: Include ONLY the number in expectedAnswer array (no units!)
- Units go in the "hint" field, not in expectedAnswer
- Examples:
  ✓ expectedAnswer: ["230"], hint: "UK mains voltage (V)"
  ✗ expectedAnswer: ["230V"] - WRONG! No units in expectedAnswer

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: PracticeInput): string {
    const { lessonId, explanations, vocabulary, hasWorkedExample } = input;

    const explanationTexts = explanations.map(exp => `${exp.title}:\n${exp.content}`).join('\n\n---\n\n');
    const vocabTerms = vocabulary.terms.map(t => `- ${t.term}: ${t.definition}`).join('\n');

    return `Create independent practice questions for this lesson.

EXPLANATION CONTENT (questions must assess this):
${explanationTexts}

VOCABULARY TERMS:
${vocabTerms}

LESSON CONTEXT:
- Has worked example: ${hasWorkedExample ? 'YES (include calculation questions)' : 'NO (focus on conceptual)'}

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
  * expectedAnswer: Array with ONLY numbers (no units!)
  * hint: Include units and context
  * Example: expectedAnswer: ["5.5"], hint: "Answer in millimetres (mm)"
- For short-text questions:
  * answerType: "short-text"
  * expectedAnswer: Array with 2-6 acceptable phrasings
- Include realistic scenarios where appropriate`;
  }
}
