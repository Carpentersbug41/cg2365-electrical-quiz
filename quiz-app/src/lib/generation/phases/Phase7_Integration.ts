/**
 * Phase 7: Integration Questions
 * Generates "Putting It All Together" questions that synthesize lesson concepts
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { ExplanationBlock } from './Phase3_Explanation';
import { PlanningOutput } from './Phase1_Planning';

export interface IntegrationInput {
  lessonId: string;
  plan: PlanningOutput;
  explanations: ExplanationBlock[];
}

export interface IntegrativeQuestion {
  id: string;
  questionText: string;
  answerType: 'short-text';
  cognitiveLevel: 'connection' | 'synthesis';
  expectedAnswer: string[];
  hint: string;
}

export interface IntegrativeBlock {
  id: string;
  order: number;
  title: string;
  mode: 'integrative';
  sequential: true;
  questions: IntegrativeQuestion[];
}

export interface IntegrationOutput {
  integrative: IntegrativeBlock;
}

export class Phase7_Integration extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 7: Integration';
  }

  protected buildSystemPrompt(): string {
    return `You are an advanced assessment specialist for C&G 2365 Electrical Training.

Your task is to create integrative questions that synthesize lesson concepts.

QUESTION REQUIREMENTS:
Question 1 (Connection - L2):
- Links 2-3 major concepts from different parts of the lesson
- Asks "how" or "why" these concepts relate
- Expected answer: 2-3 sentences
- Shows understanding of relationships

Question 2 (Synthesis - L3):
- Integrates ALL major concepts from the lesson
- Asks for comprehensive explanation showing full understanding
- Explicitly request 3-4 sentences in the question
- Expected answer: 3-4 sentences
- Shows "big picture" understanding

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: IntegrationInput): string {
    const { lessonId, plan, explanations } = input;

    const learningOutcomes = plan.learningOutcomes.map((lo, i) => `${i + 1}. ${lo}`).join('\n');
    const majorConcepts = explanations.map(exp => `- ${exp.title}`).join('\n');
    const explanationTexts = explanations.map(exp => `${exp.title}:\n${exp.content.substring(0, 500)}...`).join('\n\n---\n\n');

    return `Create integrative questions that synthesize this lesson's concepts.

LEARNING OUTCOMES:
${learningOutcomes}

MAJOR CONCEPTS COVERED:
${majorConcepts}

EXPLANATION SUMMARIES:
${explanationTexts}

Create 2 integrative questions at order 9.5.

Return JSON in this exact format:
{
  "integrative": {
    "id": "${lessonId}-integrative",
    "order": 9.5,
    "title": "Putting It All Together",
    "mode": "integrative",
    "sequential": true,
    "questions": [
      {
        "id": "${lessonId}-INT-1",
        "questionText": "[Connection question linking 2-3 major concepts] (2-3 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": ["[Answer showing relationships between concepts]", "[Alternative phrasing]"],
        "hint": "[Hint about which concepts to connect]"
      },
      {
        "id": "${lessonId}-INT-2",
        "questionText": "[Synthesis question integrating ALL lesson concepts] (3-4 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": ["[Comprehensive answer showing full integration]", "[Alternative phrasing]"],
        "hint": "[Strategic hint about what to include]"
      }
    ]
  }
}

CRITICAL REQUIREMENTS:
- Question 1 (Connection): Must link 2-3 different major concepts, request 2-3 sentences
- Question 2 (Synthesis): Must integrate ALL concepts, request 3-4 sentences explicitly
- Both questions should require students to go beyond recall and show deep understanding
- Expected answers should model comprehensive responses
- Hints should guide strategic thinking, not give away answers`;
  }
}
