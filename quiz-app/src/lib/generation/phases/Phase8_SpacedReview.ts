/**
 * Phase 8: Spaced Review
 * Generates prerequisite review questions (spaced repetition)
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';

export interface SpacedReviewInput {
  lessonId: string;
  title: string;
  learningOutcomes: string[];
  previousLessonTitles: string[]; // Up to 4 previous lesson titles
  prerequisiteAnchors?: string;
  foundationAnchors?: string;
}

export interface SpacedReviewQuestion {
  id: string;
  questionText: string;
  expectedAnswer: string[];
  hint: string;
  answerType: 'short-text'; // Force short-text only
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
    return `You are a foundation check specialist for City & Guilds technical and vocational training.

Your task: write 3 foundation check questions the learner should already know before starting this lesson.

DOMAIN-AGNOSTIC RULE:
- Questions must be transferable across technical subjects.

CRITICAL RULES:
- Generate EXACTLY 3 questions (no more, no fewer)
- Questions test prerequisite knowledge, NOT current lesson content
- Use previous lesson titles for context (if provided)
- If prerequisite anchors are provided, questions MUST derive from those anchors only
- If no previous lessons and no anchors: derive checks from terms already present in current title/learning outcomes only
- All questions use answerType: "short-text"
- Each expectedAnswer: array of 2-4 strings
- Do NOT introduce out-of-unit facts, regulations, numeric values, or equipment not present in provided context
- Never inject generic electrical facts (e.g., nominal voltages, formula values) unless explicitly present in prior context

FIELD NAME: Use "questionText" (NOT typo variants)

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: SpacedReviewInput): string {
    const { lessonId, title, learningOutcomes, previousLessonTitles, prerequisiteAnchors, foundationAnchors } = input;

    const contextSection = previousLessonTitles.length > 0
      ? `PREVIOUS LESSON TITLES (for context):
${previousLessonTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}`
      : `No previous lesson titles available. Keep checks strictly anchored to current lesson wording (title + learning outcomes).`;

    const anchorSection = prerequisiteAnchors && prerequisiteAnchors.trim()
      ? `PREREQUISITE ANCHORS (PRIMARY SOURCE - MUST USE):
${prerequisiteAnchors.trim()}`
      : foundationAnchors && foundationAnchors.trim()
        ? `FOUNDATION ANCHORS (SECONDARY SOURCE):
${foundationAnchors.trim()}`
        : `No explicit anchors provided. Use only terms already present in lesson title/learning outcomes.`;

    return `Create 3 foundation check questions for learners starting this lesson.

CURRENT LESSON:
- ID: ${lessonId}
- Title: ${title}
- Learning Outcomes:
${learningOutcomes.map((o, i) => `  ${i + 1}. ${o}`).join('\n')}

${contextSection}
${anchorSection}

Return JSON in this exact format:
{
  "spacedReview": {
    "id": "${lessonId}-spaced-review",
    "order": 10,
    "title": "Foundation Check",
    "questions": [
      {
        "id": "${lessonId}-SR-1",
        "questionText": "[Question testing prerequisite knowledge]",
        "expectedAnswer": ["[answer]", "[variant1]", "[variant2]"],
        "hint": "[Helpful hint]",
        "answerType": "short-text"
      },
      {
        "id": "${lessonId}-SR-2",
        "questionText": "[Question 2]",
        "expectedAnswer": ["[answer]", "[variant]"],
        "hint": "[Hint]",
        "answerType": "short-text"
      },
      {
        "id": "${lessonId}-SR-3",
        "questionText": "[Question 3]",
        "expectedAnswer": ["[answer]", "[variant]"],
        "hint": "[Hint]",
        "answerType": "short-text"
      }
    ],
    "notes": "Foundation check before starting ${title}"
  }
}

REQUIREMENTS:
- EXACTLY 3 questions
- All answerType = "short-text"
- expectedAnswer arrays only
- Questions review prerequisite knowledge before this lesson
- Use prior lesson context when available
- If anchors are provided, do not introduce any concepts outside those anchors
- Avoid out-of-unit content and random technical facts`; 
  }
}
