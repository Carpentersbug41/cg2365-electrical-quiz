/**
 * Phase 8: Spaced Review
 * Generates prerequisite review questions (spaced repetition)
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';

export interface SpacedReviewInput {
  lessonId: string;
  prerequisites: string[];
  prerequisiteAnchors?: string;
}

export interface SpacedReviewQuestion {
  id: string;
  questionText: string;
  expectedAnswer: string[];
  hint: string;
}

export interface SpacedReviewBlock {
  id: string;
  order: number;
  title: string;
  questions: SpacedReviewQuestion[];
  notes: string;
}

export interface SpacedReviewOutput {
  spacedReview: SpacedReviewBlock;
}

export class Phase8_SpacedReview extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 8: Spaced Review';
  }

  protected buildSystemPrompt(): string {
    return `You are a spaced repetition specialist for C&G 2365 Electrical Training.

Your task is to create review questions from PREREQUISITE lessons only.

CRITICAL RULES:
- Questions MUST review concepts from prerequisite lessons (provided as anchors)
- Do NOT test current lesson content
- Do NOT use generic fundamentals unless they appeared in prerequisites
- Questions should be simple recall (appropriate for quick review)
- Each question must be traceable to a specific prerequisite lesson

FIELD NAME: Use "questionText" (NOT "attText", "question_text", or any variant)

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: SpacedReviewInput): string {
    const { lessonId, prerequisites, prerequisiteAnchors } = input;

    if (!prerequisites || prerequisites.length === 0) {
      return `This lesson has no prerequisites.

Return:
{
  "spacedReview": {
    "id": "${lessonId}-spaced-review",
    "order": 10,
    "title": "Spaced Review (from prerequisites)",
    "questions": [],
    "notes": "No prerequisites for this foundational lesson"
  }
}`;
    }

    return `Create spaced review questions from prerequisite lessons.

PREREQUISITES: ${prerequisites.join(', ')}

${prerequisiteAnchors ? `PREREQUISITE ANCHORS (key facts to review):
${prerequisiteAnchors}

CRITICAL: Questions must derive from these anchors ONLY. Do not use random fundamentals.` : `PREREQUISITE IDS: ${prerequisites.join(', ')}
Create questions that review key concepts from these prerequisite lessons.`}

Create 4 review questions at order 10 (ALWAYS LAST).

Return JSON in this exact format:
{
  "spacedReview": {
    "id": "${lessonId}-spaced-review",
    "order": 10,
    "title": "Spaced Review (from prerequisites)",
    "questions": [
      {
        "id": "${lessonId}-SR-1",
        "questionText": "[Review question from prerequisite 1]",
        "expectedAnswer": ["[Concise answer]", "[Alternative phrasing]"],
        "hint": "[Helpful hint]"
      },
      {
        "id": "${lessonId}-SR-2",
        "questionText": "[Review question from prerequisite 2]",
        "expectedAnswer": ["[Concise answer]", "[Alternative]"],
        "hint": "[Hint]"
      },
      {
        "id": "${lessonId}-SR-3",
        "questionText": "[Review question from prerequisite 3]",
        "expectedAnswer": ["[Concise answer]", "[Alternative]"],
        "hint": "[Hint]"
      },
      {
        "id": "${lessonId}-SR-4",
        "questionText": "[Review question from prerequisite 4]",
        "expectedAnswer": ["[Concise answer]", "[Alternative]"],
        "hint": "[Hint]"
      }
    ],
    "notes": "SR-1 -> ${prerequisites[0] || '[prereqId]'} ([concept]); SR-2 -> ${prerequisites[1] || prerequisites[0] || '[prereqId]'} ([concept]); SR-3 -> ${prerequisites[2] || prerequisites[0] || '[prereqId]'} ([concept]); SR-4 -> ${prerequisites[3] || prerequisites[0] || '[prereqId]'} ([concept])"
  }
}

REQUIREMENTS:
- CRITICAL: Field name must be "questionText" (not "attText" or any other variant)
- Questions must review prerequisite content only (not current lesson)
- expectedAnswer: Array format with 1-3 acceptable answers
- Questions should be simple recall for quick review
- notes field must map each SR-N to specific prerequisite lesson ID and concept
- If anchors provided, questions must derive from those facts
- If no anchors, create questions about likely core concepts from those prerequisites`;
  }
}
