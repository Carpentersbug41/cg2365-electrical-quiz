/**
 * Phase 8: Spaced Review
 * Generates prerequisite review questions (spaced repetition)
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';

export interface SpacedReviewInput {
  lessonId: string;
  prerequisites: string[];
  prerequisiteAnchors?: string;
  foundationAnchors?: string; // Baseline knowledge for lessons with no prerequisites
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

Your task is to create review questions from prerequisite lessons or foundation knowledge.

CRITICAL RULES:
- If prerequisites exist: Questions MUST review concepts from prerequisite lessons (provided as prerequisiteAnchors)
- If no prerequisites but foundationAnchors provided: Questions review baseline electrical knowledge
- Do NOT test current lesson content
- Questions should be simple recall (appropriate for quick review)
- Each question must be traceable to a specific prerequisite or foundation concept

FIELD NAME: Use "questionText" (NOT "attText", "question_text", or any variant)

EXPECTED ANSWER REQUIREMENTS:
- EXACTLY 2-4 variants total per question (simple recall questions)
- Variants ONLY for normalization: case, pluralization, articles (a/an/the), hyphenation
- NO broad paraphrases or synonyms that change meaning
- Spaced review tests retention, so answers should be specific

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: SpacedReviewInput): string {
    const { lessonId, prerequisites, prerequisiteAnchors, foundationAnchors } = input;

    // If no prerequisites AND no foundation anchors, return empty
    if ((!prerequisites || prerequisites.length === 0) && !foundationAnchors) {
      return `This lesson has no prerequisites or foundation anchors.

Return:
{
  "spacedReview": {
    "id": "${lessonId}-spaced-review",
    "order": 10,
    "title": "Spaced Review",
    "questions": [],
    "notes": "No prerequisites or foundation anchors for this lesson"
  }
}`;
    }

    // If no prerequisites BUT foundation anchors provided, use them
    if ((!prerequisites || prerequisites.length === 0) && foundationAnchors) {
      return `This lesson has no prerequisites, but foundational electrical knowledge should be reviewed.

FOUNDATION ANCHORS (baseline electrical knowledge):
${foundationAnchors}

Create 3-4 spaced review questions from these foundational concepts.
Each question should use "notes" field to indicate "FOUNDATION" as source.

Return JSON in this exact format:
{
  "spacedReview": {
    "id": "${lessonId}-spaced-review",
    "order": 10,
    "title": "Spaced Review (foundational concepts)",
    "questions": [
      {
        "id": "${lessonId}-SR-1",
        "questionText": "[Review question from foundation knowledge]",
        "expectedAnswer": ["[Concise answer]", "[Alternative 1]", "[Alternative 2]"],
        "hint": "[Helpful hint]"
      }
    ],
    "notes": "FOUNDATION"
  }
}

CRITICAL: Questions must derive from the foundation anchors provided. Each answer should have 2-4 variants for normalization only.`;
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
        "expectedAnswer": ["[Concise answer]", "[Alternative 1]", "[Alternative 2]"],
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
