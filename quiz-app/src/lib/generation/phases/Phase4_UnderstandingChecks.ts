/**
 * Phase 4: Understanding Checks
 * Generates formative assessment questions aligned with explanations
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { ExplanationBlock } from './Phase3_Explanation';

export interface UnderstandingChecksInput {
  lessonId: string;
  explanations: ExplanationBlock[];
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
- Question 4 (L2): Connection - ask how Q1, Q2, Q3 facts relate to each other

COGNITIVE LEVELS:
- Recall (L1): "What is...", "Define...", "State..." - simple factual questions
- Connection (L2): "How do X and Y relate?", "Why does X affect Y?" - relationship questions

ANSWER FORMAT:
- expectedAnswer: ALWAYS an array of strings (2-6 acceptable variations)
- Include synonyms, alternative phrasings, and common variations
- At least ONE variant must match explanation wording closely

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: UnderstandingChecksInput): string {
    const { lessonId, explanations } = input;

    return `Create understanding check questions for this lesson's explanations.

${explanations.map((exp, idx) => `
EXPLANATION ${idx + 1} (Order ${exp.order}):
Title: ${exp.title}
Content:
${exp.content}

---`).join('\n')}

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
          "questionText": "[Connection question: How do the facts from Q1, Q2, Q3 relate?]",
          "answerType": "short-text",
          "cognitiveLevel": "connection",
          "expectedAnswer": ["[Answer showing relationships]", "[Alternative phrasing]"],
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
          "questionText": "[Connection for explanation 2]",
          "answerType": "short-text",
          "cognitiveLevel": "connection",
          "expectedAnswer": ["[Answer]", "[Alternative]"],
          "hint": "[Hint]"
        }
      ]
    }` : ''}
  ]
}

CRITICAL REQUIREMENTS:
- Every expectedAnswer must come from the explanation text (quote or paraphrase)
- Connection questions (L2) must explicitly reference facts from Q1, Q2, Q3
- Include 2-6 acceptable answer variations in expectedAnswer arrays
- Questions must build logically (Q1 → Q2 → Q3 → Q4 connects them all)`;
  }
}
