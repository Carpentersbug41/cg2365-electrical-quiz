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
    return `You are an advanced assessment specialist for City & Guilds technical and vocational training.

Your task is to create integrative questions that synthesize lesson concepts.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Use assessment language transferable across all technical subjects.

QUESTION REQUIREMENTS:
Question 1 (Connection - L2):
- Link 2-3 major concepts from different parts of the lesson.
- Include a structured prompt: "In your answer, include: (1)... (2)... (3)...".
- Include explicit reasoning demand (Why/How do we know/What must be true).

Question 2 (Synthesis - L3):
- Integrate all major concepts from the lesson.
- Include structured prompt: "In your answer, include: (1)... (2)... (3)... (4)...".
- End with EXACTLY: "Answer in 3-4 sentences OR concise bullet points."

LONG-TEXT REQUIREMENTS:
- Both questions MUST use answerType: "long-text".
- INT-1 keyPoints: 4-6
- INT-2 keyPoints: 6-10
- expectedAnswer: 2-3 comprehensive examples

TECHNICAL PRECISION RULE:
- Prompts should reward accurate reasoning, not vague generality.

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
        "questionText": "[Connection question]. In your answer, include: (1) [concept A], (2) [concept B], (3) [how they relate]. Why does this relationship hold? (2-3 sentences)",
        "answerType": "long-text",
        "cognitiveLevel": "connection",
        "keyPoints": [
          "[Addresses concept A accurately]",
          "[Addresses concept B accurately]",
          "[Explains connection between A and B]",
          "[Uses defensible reasoning]"
        ],
        "expectedAnswer": ["[Example answer covering key points]", "[Alternative answer]"] ,
        "hint": "[Hint about what to connect]"
      },
      {
        "id": "${lessonId}-INT-2",
        "questionText": "[Synthesis question]. In your answer, include: (1) [concept A], (2) [concept B], (3) [concept C], (4) [how they work together]. Answer in 3-4 sentences OR concise bullet points.",
        "answerType": "long-text",
        "cognitiveLevel": "synthesis",
        "keyPoints": [
          "[Addresses concept A]",
          "[Addresses concept B]",
          "[Addresses concept C]",
          "[Explains integration of A, B, C]",
          "[Provides applied implication]",
          "[Maintains technical precision]"
        ],
        "expectedAnswer": ["[Comprehensive answer]", "[Alternative comprehensive answer]"],
        "hint": "[Strategic hint about synthesis]"
      }
    ]
  }
}

CRITICAL REQUIREMENTS:
- INT-1 must include explicit reasoning demand
- INT-2 must end exactly with required sentence
- Both questions long-text with keyPoints and example expectedAnswer
- Domain-agnostic wording only`; 
  }
}
