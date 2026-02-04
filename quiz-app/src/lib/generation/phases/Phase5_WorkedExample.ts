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
  teachingConstraints?: {
    excludeHowTo?: boolean;
    purposeOnly?: boolean;
    identificationOnly?: boolean;
    noCalculations?: boolean;
    specificScope?: string;
  };
  taskMode?: string; // Explicit task mode string
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

GEOMETRY CALCULATION REQUIREMENTS (CRITICAL):
When learning outcomes mention "calculate using formulas" or "calculate percentage fill":

RULE: ALWAYS show geometric calculation FIRST, factor tables SECOND (if applicable)

For percentage/space factor calculations:
1. FIRST worked example: Use pure geometry
   - Calculate enclosure area (π×r² for conduit, width×height for trunking)
   - Calculate cable area (π×r² for each cable)
   - Show: Total Cable Area = Single Cable CSA × Quantity
   - Show: Percentage Fill = (Total Cable Area ÷ Enclosure Area) × 100
   - Show: Comparison to limit (e.g., ≤ 45%)

2. SECOND worked example (if applicable): Use factor tables
   - Show the simplified method using IET On-Site Guide factors
   - Explain that this achieves the same result as the geometry method

This ensures students understand the UNDERLYING MATH before using shortcuts.

Example topics requiring this: "spacing factor", "percentage fill", "enclosure fill"

SELECTION EXAMPLE FORMAT (when TASK_MODE includes IDENTIFICATION or PURPOSE_ONLY):

When the lesson is about choosing/identifying kit, tools, or equipment:

Structure the worked example as a SELECTION SCENARIO (not procedural steps):

{
  "title": "Worked Example: Equipment Selection",
  "given": "[Job scenario: material type, task requirements, constraints]",
  "steps": [
    {
      "stepNumber": 1,
      "description": "Identify the containment material and task requirement",
      "formula": null,
      "calculation": null,
      "result": "[e.g., 'Heavy-gauge steel conduit requiring bends']"
    },
    {
      "stepNumber": 2,
      "description": "Select appropriate tool",
      "formula": null,
      "calculation": null,
      "result": "[e.g., 'Conduit bender with 25mm former']"
    },
    {
      "stepNumber": 3,
      "description": "State the purpose (one line)",
      "formula": null,
      "calculation": null,
      "result": "[e.g., 'Creates smooth bends without collapsing the tube']"
    },
    {
      "stepNumber": 4,
      "description": "Common wrong choice and why",
      "formula": null,
      "calculation": null,
      "result": "[e.g., 'Using hand bending would kink and collapse the conduit']"
    }
  ],
  "notes": "Selection is based on material properties and task requirements, not personal preference."
}

NO physical operation steps (no "place", "rotate", "pull", "clamp").

TEACHING CONSTRAINTS (if provided):
If teachingConstraints.excludeHowTo or purposeOnly OR TASK_MODE includes "PURPOSE_ONLY":
- Worked examples should focus on SELECTION and IDENTIFICATION
- Example: "Given these requirements, which tool should be selected and why?"
- NOT: "Step-by-step procedure to operate the tool"

If teachingConstraints.noCalculations:
- Skip worked examples OR create selection-based scenarios
- Example: "Match the cable size to the appropriate former"

PROVENANCE AND CAVEATS (when using standard values):

When worked examples include values from standards (cable factors, enclosure factors, percentages):

In the "notes" field, ALWAYS add:
- "The factors used here are representative examples from IET On-Site Guide."
- "Always verify factors from your current edition of the On-Site Guide, as values may vary by cable type, insulation specification, and OSG edition."
- "Factor values shown are for illustration - consult the appropriate table for your specific installation."

This prevents students assuming fixed universal values and teaches them to verify sources.

Example notes:
"The cable factor of 12.6 for 2.5mm² stranded is from IET On-Site Guide Edition 8. Always verify factors from your current edition, as values may vary by cable type and insulation. If the total exceeded the enclosure factor, select larger containment."

GUIDED PRACTICE RULES:
- Mirror the worked example structure exactly
- Use similar problem with different values
- Each step should prompt student to apply what they learned
- Provide hints that guide without giving the answer

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: WorkedExampleInput): string {
    const { lessonId, topic, explanations, needsWorkedExample, teachingConstraints, taskMode } = input;

    // For identification/purpose-only tasks, ALWAYS create selection examples
    const isPurposeOnlyTask = taskMode?.includes('PURPOSE_ONLY') || taskMode?.includes('IDENTIFICATION');
    
    if (!needsWorkedExample && !isPurposeOnlyTask) {
      return `This lesson does not require worked examples.

Return:
{
  "workedExample": null,
  "guidedPractice": null
}`;
    }

    const explanationTexts = explanations.map(exp => `${exp.title}:\n${exp.content}`).join('\n\n---\n\n');

    // For identification/purpose tasks, guide toward selection format
    if (isPurposeOnlyTask) {
      return `Create a SELECTION worked example for this identification/purpose lesson.

LESSON TOPIC: ${topic}

EXPLANATION CONTENT (use as reference):
${explanationTexts}

TASK MODE: ${taskMode || 'IDENTIFICATION'}

CRITICAL: Use the SELECTION EXAMPLE FORMAT (not procedural steps):
- Step 1: Identify material/task requirement
- Step 2: Select appropriate tool/equipment
- Step 3: State the purpose (one line)
- Step 4: Common wrong choice and why

NO physical operation steps (no "place", "rotate", "pull", "clamp", "thread", "lubricate").

Create ONE selection worked example and ONE guided selection practice.`;
    }

    return `Create a worked example and guided practice for this calculation/procedure topic.

LESSON TOPIC: ${topic}

EXPLANATION CONTENT (use as reference):
${explanationTexts}
${taskMode ? `
TASK MODE: ${taskMode}

CRITICAL REMINDERS based on task mode:
${taskMode.includes('CALCULATION') ? '- Show GEOMETRY calculation FIRST, factor tables SECOND' : ''}
${taskMode.includes('PROCEDURE') ? '- Step-by-step procedures are appropriate for this task mode' : ''}
` : ''}

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
- Provide helpful hints for guided practice
- For percentage/factor calculations: GEOMETRY method BEFORE factor tables
- Always add provenance notes for standard values (e.g., "Values from IET On-Site Guide - verify current edition")
- If constraints present: Focus on selection/identification, not step-by-step procedures`;
  }
}
