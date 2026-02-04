/**
 * Phase 5: Worked Example & Guided Practice
 * Generates step-by-step examples for calculation/procedure topics (conditional)
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { ExplanationBlock } from './Phase3_Explanation';

export interface WorkedExampleInput {
  lessonId: string;
  topic: string;
  explanations: ExplanationBlock[];
  needsWorkedExample: boolean;
}

export interface WorkedExampleStep {
  stepNumber: number;
  description: string;
  formula: string | null;
  calculation: string | null;
  result: string | null;
}

export interface WorkedExampleBlock {
  id: string;
  order: number;
  title: string;
  given: string;
  steps: WorkedExampleStep[];
  notes: string;
}

export interface GuidedPracticeStep {
  stepNumber: number;
  prompt: string;
  expectedAnswer: string[];
  hint: string;
}

export interface GuidedPracticeBlock {
  id: string;
  order: number;
  title: string;
  problem: string;
  steps: GuidedPracticeStep[];
}

export interface WorkedExampleOutput {
  workedExample?: WorkedExampleBlock;
  guidedPractice?: GuidedPracticeBlock;
}

export class Phase5_WorkedExample extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 5: Worked Example';
  }

  protected buildSystemPrompt(): string {
    return `You are a practical training specialist for C&G 2365 Electrical Training.

Your task is to create worked examples and guided practice for calculation/procedure topics.

WORKED EXAMPLE RULES:
- Show complete step-by-step solution (3-5 steps)
- Include formulas where applicable
- Show calculations clearly
- Explain each step in plain language

GUIDED PRACTICE RULES:
- Mirror the worked example structure exactly
- Use similar problem with different values
- Each step should prompt student to apply what they learned
- Provide hints that guide without giving the answer

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: WorkedExampleInput): string {
    const { lessonId, topic, explanations, needsWorkedExample } = input;

    if (!needsWorkedExample) {
      return `This lesson does not require worked examples.

Return:
{
  "workedExample": null,
  "guidedPractice": null
}`;
    }

    const explanationTexts = explanations.map(exp => `${exp.title}:\n${exp.content}`).join('\n\n---\n\n');

    return `Create a worked example and guided practice for this calculation/procedure topic.

LESSON TOPIC: ${topic}

EXPLANATION CONTENT (use as reference):
${explanationTexts}

Create ONE worked example demonstrating the key calculation/procedure, and ONE guided practice problem that mirrors it.

Return JSON in this exact format:
{
  "workedExample": {
    "id": "${lessonId}-worked-example",
    "order": 6,
    "title": "Worked Example: [Problem Type]",
    "given": "[What information is provided in the problem]",
    "steps": [
      {
        "stepNumber": 1,
        "description": "[What to do in this step]",
        "formula": "[Formula if applicable, or null]",
        "calculation": "[Calculation if applicable, or null]",
        "result": "[Result if applicable, or null]"
      },
      {
        "stepNumber": 2,
        "description": "[Next step]",
        "formula": "[Formula or null]",
        "calculation": "[Calculation or null]",
        "result": "[Result or null]"
      }
    ],
    "notes": "[Additional tips or common mistakes to avoid]"
  },
  "guidedPractice": {
    "id": "${lessonId}-guided",
    "order": 7,
    "title": "Guided Practice (We Do)",
    "problem": "[Similar problem with different values]",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "[Guiding question for step 1]",
        "expectedAnswer": ["[Correct answer]", "[Alternative phrasing]"],
        "hint": "[Hint if student struggles]"
      },
      {
        "stepNumber": 2,
        "prompt": "[Guiding question for step 2]",
        "expectedAnswer": ["[Answer]", "[Alternative]"],
        "hint": "[Hint]"
      }
    ]
  }
}

REQUIREMENTS:
- Worked example should have 3-5 steps
- Guided practice should mirror worked example exactly (same number of steps)
- Include realistic values and scenarios
- Show all calculations clearly
- Provide helpful hints for guided practice`;
  }
}
