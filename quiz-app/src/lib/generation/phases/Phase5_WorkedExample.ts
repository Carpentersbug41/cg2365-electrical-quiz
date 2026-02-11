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
  taskMode: string; // Explicit task mode string
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
    return `You are a practical training specialist for City & Guilds technical and vocational training.

Your task is to create a Worked Example (I Do) and a Guided Practice (We Do) that model and scaffold the SAME skill.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Do not assume any specific trade or subject domain.
- Use transferable pedagogical framing across technical disciplines.

WORKED EXAMPLE GENERATION POLICY (CRITICAL):
Generate BOTH workedExample AND guidedPractice when needed based on NEEDS_WORKED_EXAMPLE flag or task type.
If NEEDS_WORKED_EXAMPLE is false AND TASK_MODE is not PURPOSE_ONLY/IDENTIFICATION, return null for both.

Task-mode behavior:
- CALCULATION: formula + arithmetic steps
- PURPOSE_ONLY / IDENTIFICATION: selection/recognition format (no operation steps)
- SELECTION / DIAGNOSIS: decision-process format (criteria + reasoning)
- PROCEDURE (and not PURPOSE_ONLY): procedural format allowed
- Default: selection format

WORKED EXAMPLE RULES:
- 3-5 steps (except selection format fixed at 4 steps)
- Clear and scoped to taught explanation content
- Plain language appropriate to learner level
- Use realistic scenarios without domain lock-in

NO INVENTED TABLE/STANDARD VALUES (CRITICAL):
- Do NOT invent numeric values from external standards, manuals, or reference tables.
- Use such values only if explicitly present in explanation text or inputs.
- If lookup is needed, state lookup action in notes and add "verify current edition/version".

SELECTION EXAMPLE FORMAT (MANDATORY for PURPOSE_ONLY / IDENTIFICATION):
Use exactly 4 steps:
1) Identify context/constraints
2) Select appropriate option
3) State purpose/result
4) State common wrong choice and why

ABSOLUTE BAN for PURPOSE_ONLY / IDENTIFICATION:
- No physical operation instructions
- No step-by-step operation workflow language

GUIDED PRACTICE MIRRORING CONTRACT (CRITICAL):
Guided Practice MUST mirror Worked Example exactly:
- SAME number of steps
- SAME stepNumbers
- SAME decision points/process flow
- Scenario/details can change

GUIDED PRACTICE expectedAnswer RULES:
- expectedAnswer ALWAYS array of strings
- 1-2 variants per step
- canonical first
- normalization-only variants
- numeric answers: numbers only (no units)

HINTS:
- One sentence, guiding, not giving away full answer

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: WorkedExampleInput): string {
    const { lessonId, topic, explanations, needsWorkedExample, taskMode } = input;

    const isPurposeOnlyTask = taskMode?.includes('PURPOSE_ONLY') || taskMode?.includes('IDENTIFICATION');

    if (!needsWorkedExample && !isPurposeOnlyTask) {
      return `This lesson does not require worked examples.

Return:
{
  "workedExample": null,
  "guidedPractice": null
}`;
    }

    return `Create a worked example and guided practice for this lesson.

LESSON TOPIC: ${topic}

NEEDS WORKED EXAMPLE FLAG: ${needsWorkedExample ? 'true' : 'false'}

EXPLANATION CONTENT (use as the ONLY source of taught facts/terms):
${explanations.map(exp => `${exp.title}:\n${exp.content}`).join('\n\n---\n\n')}

TASK MODE: ${taskMode || 'GENERAL'}

If NEEDS WORKED EXAMPLE is false AND TASK MODE is not PURPOSE_ONLY/IDENTIFICATION:
Return:
{
  "workedExample": null,
  "guidedPractice": null
}

Otherwise, return JSON in this format:
{
  "workedExample": {
    "id": "${lessonId}-worked-example",
    "order": 6,
    "title": "Worked Example: [short descriptive title]",
    "given": "[scenario constraints]",
    "steps": [
      {
        "stepNumber": 1,
        "description": "[step description]",
        "formula": null,
        "calculation": null,
        "result": "[step result]"
      }
    ],
    "notes": "[provenance/caveats/common pitfalls]"
  },
  "guidedPractice": {
    "id": "${lessonId}-guided",
    "order": 7,
    "title": "Guided Practice (We Do)",
    "problem": "[similar scenario with changed details]",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "[question matching worked-example step 1]",
        "expectedAnswer": ["[canonical]", "[optional variant]"],
        "hint": "[one-sentence hint]"
      }
    ]
  }
}

CRITICAL REQUIREMENTS:
1) Mirroring: guidedPractice.steps must match workedExample.steps exactly
2) For PURPOSE_ONLY / IDENTIFICATION: use 4-step selection format, no operation procedure language
3) Do not introduce untaught facts or values
4) expectedAnswer arrays only, 1-2 variants per guided step
5) If lookup/reference values are mentioned, include "verify current edition/version" in notes`; 
  }
}
