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
- Question text MUST include: "In your answer, include: (1) [specific concept A], (2) [specific concept B], (3) [specific concept C]"
- Expected answer: 2-3 sentences covering all specified concepts
- Shows understanding of relationships

Question 2 (Synthesis - L3):
- Integrates ALL major concepts from the lesson
- Question text MUST include: "In your answer, include: (1) [concept A], (2) [concept B], (3) [concept C], (4) [concept D]"
- Expected answer: 3-4 sentences covering all specified concepts
- Shows "big picture" understanding with structured guidance

EXPECTED ANSWER REQUIREMENTS:
- EXACTLY 2-4 variants total per question (ARRAY FORMAT)
- Use STRUCTURED PROMPTS that guide students to include specific elements
- Question text should explicitly state: "In your answer, include: (1) [concept A], (2) [concept B], (3) [concept C]"
- expectedAnswer variants should be checklist-style canonical responses that include all required elements
- Example variants should show different orderings or phrasings while covering all required concepts
- This makes integrative questions gradeable with exact-match while still testing synthesis

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
        "questionText": "[Connection question]. In your answer, include: (1) [specific concept A], (2) [specific concept B], (3) [how they relate]. (2-3 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": ["[Answer covering concepts A, B, and relationship]", "[Alternative phrasing covering all 3 elements]", "[Third variant with different ordering]"],
        "hint": "[Hint about which concepts to connect]"
      },
      {
        "id": "${lessonId}-INT-2",
        "questionText": "[Synthesis question]. In your answer, include: (1) [concept A], (2) [concept B], (3) [concept C], (4) [how they work together]. Answer in 3-4 sentences OR concise bullet points.",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": ["[Comprehensive answer covering all 4 elements]", "[Alternative phrasing covering all 4 elements]", "[Third variant with different structure]"],
        "hint": "[Strategic hint about what to include]"
      }
    ]
  }
}

CRITICAL REQUIREMENTS:
- Question 1 (Connection): Must link 2-3 different major concepts, request 2-3 sentences
- Question 2 (Synthesis): Must integrate ALL concepts, end questionText with EXACTLY: "Answer in 3-4 sentences OR concise bullet points."
- Both questions should require students to go beyond recall and show deep understanding
- Expected answers should model comprehensive responses
- Hints should guide strategic thinking, not give away answers`;
  }
}
