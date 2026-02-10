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
  answerType: 'short-text' | 'long-text';
  cognitiveLevel: 'connection' | 'synthesis';
  expectedAnswer?: string[];  // Optional for long-text (examples)
  keyPoints?: string[];        // Required when answerType === 'long-text'
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

LONG-TEXT ANSWER TYPE REQUIREMENTS:
- Both INT-1 and INT-2 MUST use answerType: "long-text"
- MUST include keyPoints array:
  * INT-1: 4-6 keyPoints (connection level)
  * INT-2: 6-10 keyPoints (synthesis level)
- Each keyPoint should be a specific, checkable idea
- expectedAnswer: Include 2-3 comprehensive example answers
- keyPoints should match the "include: (1)...(2)...(3)..." structure in questionText

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
        "answerType": "long-text",
        "cognitiveLevel": "connection",
        "keyPoints": [
          "[Addresses concept A accurately]",
          "[Addresses concept B accurately]",
          "[Explains relationship between A and B]",
          "[Uses lesson terminology/examples]"
        ],
        "expectedAnswer": ["[Example answer covering all 4 keyPoints]", "[Alternative comprehensive answer]"],
        "hint": "[Hint about which concepts to connect]"
      },
      {
        "id": "${lessonId}-INT-2",
        "questionText": "[Synthesis question]. In your answer, include: (1) [concept A], (2) [concept B], (3) [concept C], (4) [how they work together]. Answer in 3-4 sentences OR concise bullet points.",
        "answerType": "long-text",
        "cognitiveLevel": "synthesis",
        "keyPoints": [
          "[Addresses concept A from section 1]",
          "[Addresses concept B from section 2]",
          "[Addresses concept C from section 3]",
          "[Explains integration of A, B, C]",
          "[Provides practical application/example]",
          "[Demonstrates big-picture understanding]"
        ],
        "expectedAnswer": ["[Comprehensive answer covering all 6 keyPoints]", "[Alternative comprehensive answer]"],
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
- Hints should guide strategic thinking, not give away answers

⚠️ INTEGRATIVE QUESTION FORMAT:
- Both questions: answerType MUST be "long-text"
- INT-1: 4-6 keyPoints (connection level)
- INT-2: 6-10 keyPoints (synthesis level)
- expectedAnswer: 2-3 comprehensive examples (show different structures)`;
  }
}
