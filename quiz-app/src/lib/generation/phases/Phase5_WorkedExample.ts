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

Your task is to create a Worked Example (I Do) and a Guided Practice (We Do) that model and scaffold the SAME skill.

WORKED EXAMPLE GENERATION POLICY (CRITICAL):
Generate BOTH workedExample AND guidedPractice when needed based on NEEDS_WORKED_EXAMPLE flag or task type.
If NEEDS_WORKED_EXAMPLE is false AND TASK_MODE is not PURPOSE_ONLY/IDENTIFICATION, return null for both.
Use task-appropriate format based on TASK_MODE:

- If TASK_MODE includes "CALCULATION":
  Output a CALCULATION worked example with formulas and arithmetic steps.
- If TASK_MODE includes "PURPOSE_ONLY" or "IDENTIFICATION":
  Output a SELECTION/IDENTIFICATION worked example (no procedural/operation steps).
  Section style: selection cues, what it's for, what problem it solves, common wrong choice.
- If TASK_MODE includes "SELECTION" or "DIAGNOSIS":
  Output a DECISION-PROCESS worked example (criteria and reasoning, not physical steps).
- If TASK_MODE includes "PROCEDURE" (and NOT PURPOSE_ONLY):
  Output a PROCEDURAL worked example (step-by-step allowed, but keep safe).
- Default: Use SELECTION format (4-step decision/selection example).

Worked examples provide scaffolding for all learning types, not just calculations.

WORKED EXAMPLE RULES:
- Worked example MUST have 3–5 steps (EXCEPT selection format which is fixed at 4 steps).
- Each step must be clear, specific, and scoped to the explanation content.
- Use plain language suitable for Level 2.
- Use realistic scenarios (domestic/commercial/industrial as appropriate).

GEOMETRY CALCULATION REQUIREMENTS (CRITICAL):
When the taught skill involves fill/space factor/percentage fill or similar:
- ALWAYS show geometry method FIRST.
- Only show factor-table method SECOND if applicable.

NO INVENTED TABLE VALUES (CRITICAL):
- Do NOT invent numeric values from standards/tables (e.g., IET On-Site Guide cable factors, enclosure factors, tables).
- You may only use specific factor numbers IF they appear in the provided explanation text.
- If factors are needed but not provided, describe the lookup step and put verification in notes:
  "Look up the cable/enclosure factor in the current IET On-Site Guide table (verify edition and cable type)."
- Geometry/arithmetic values you compute are allowed.

SELECTION EXAMPLE FORMAT (MANDATORY when TASK_MODE includes PURPOSE_ONLY or IDENTIFICATION):
Use exactly 4 steps:
1) Identify the job context (material/type/task constraint)
2) Select the correct tool/equipment OR circuit/topology OR device (as appropriate)
3) State the purpose (one line)
4) Common wrong choice and why (one line)

ABSOLUTE BAN for PURPOSE_ONLY / IDENTIFICATION:
- NO physical operation steps or "how-to" instructions.
- BANNED: place, clamp, rotate, pull, turn, push, tighten, loosen, secure, insert, thread, lubricate, half-turn
- BANNED: technique, method, step-by-step, process, operate
- BANNED procedural sequencing: "first", "next", "then", "finally" (when used to describe operation)
- BANNED "procedural implication" phrases: "do this by", "use it by", "operate it by"

PROVENANCE AND CAVEATS (when using standard values):
If you include any standards/guidance references in notes:
- Name the source (e.g., "IET On-Site Guide", "BS 7671") and include "(verify current edition)".
If you did NOT use numeric table values, say so explicitly in notes:
- "No fixed factor numbers are given here; verify the correct factors in your current tables."

GUIDED PRACTICE MIRRORING CONTRACT (CRITICAL):
Guided Practice MUST mirror the Worked Example exactly:
- SAME number of steps
- SAME stepNumbers
- SAME decision points / process flow
- Only the scenario/values change
- No extra steps, no missing steps

GUIDED PRACTICE expectedAnswer RULES (marking robustness):

⚠️ CRITICAL FORMAT REQUIREMENT:
expectedAnswer is ALWAYS an array of strings, NEVER a single string.

WRONG:  "expectedAnswer": "TN-S"          ❌
WRONG:  "expectedAnswer": "16A"           ❌
RIGHT:  "expectedAnswer": ["TN-S"]        ✅
RIGHT:  "expectedAnswer": ["16A", "16"]   ✅

Even for single-value answers, ALWAYS use array format: ["answer"]

- Each step expectedAnswer MUST contain EXACTLY 1–2 variants (ARRAY FORMAT)
- Canonical answer FIRST
- Variants may only be tight normalization (case, singular/plural, with/without article)
- For numeric: numbers only (no units): ["230", "230.0"]

HINTS:
- One sentence, guiding but not giving away the full answer.

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: WorkedExampleInput): string {
    const { lessonId, topic, explanations, needsWorkedExample, taskMode } = input;

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

Otherwise, return JSON in EXACTLY this format:

⚠️⚠️⚠️ CRITICAL JSON FORMAT REQUIREMENT ⚠️⚠️⚠️

expectedAnswer MUST ALWAYS BE AN ARRAY in guidedPractice.steps:
- WRONG: "expectedAnswer": "parallel"
- RIGHT: "expectedAnswer": ["parallel"]
- WRONG: "expectedAnswer": "lighting circuit"
- RIGHT: "expectedAnswer": ["lighting circuit", "light circuit"]

Use ["answer"] format even for single values. Array format is MANDATORY.

{
  "workedExample": {
    "id": "${lessonId}-worked-example",
    "order": 6,
    "title": "Worked Example: [short descriptive title]",
    "given": "[what information is provided / scenario constraints]",
    "steps": [
      {
        "stepNumber": 1,
        "description": "[what happens in this step — scoped to task mode]",
        "formula": null,
        "calculation": null,
        "result": "[clear outcome of the step]"
      }
    ],
    "notes": "[provenance/caveats/common pitfalls]"
  },
  "guidedPractice": {
    "id": "${lessonId}-guided",
    "order": 7,
    "title": "Guided Practice (We Do)",
    "problem": "[similar scenario with different values/details]",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "[question that maps to workedExample step 1]",
        "expectedAnswer": ["[canonical answer]", "[optional tight variant]"],
        "hint": "[one sentence hint]"
      }
    ]
  }
}

CRITICAL REQUIREMENTS (DO NOT BREAK):
1) MIRRORING:
- guidedPractice.steps MUST have EXACTLY the same number of steps as workedExample.steps
- stepNumber set MUST match exactly (1..N)
- Each guidedPractice step prompt must correspond to the same-number workedExample step
- No extra steps, no missing steps

2) TASK MODE SAFETY:
- If TASK MODE includes PURPOSE_ONLY or IDENTIFICATION:
  * Use the 4-step SELECTION format (exactly 4 steps)
  * NO physical operation or how-to instructions
  * NO banned verbs (place, clamp, rotate, pull, turn, tighten, thread, lubricate, insert, secure, operate, process, technique, method)
  * Step 4 MUST be "common wrong choice and why" (one line)
- If TASK MODE includes CALCULATION:
  * 3–5 steps with formulas and arithmetic where applicable
  * If fill/space factor/percentage fill: GEOMETRY FIRST, factor tables SECOND (if applicable)
  * DO NOT invent any factor table numeric values unless they appear in the explanation text
  * If tables are needed but numbers aren't provided, describe lookup and add "verify current table" in notes

3) CONTENT SOURCE:
- Do NOT introduce new facts or standards that are not present in the explanation text
- No regulation numbers unless they appear in the explanation

4) GUIDED PRACTICE MARKING:
- expectedAnswer arrays must be tight:
  * EXACTLY 1–2 strings per step
  * canonical first
  * no broad paraphrases
  * numeric answers are numbers only (no units)

5) NOTES:
- If any standards/guidance are referenced: name the source + "(verify current edition)"
- If you did not use numeric table values: state "No fixed factor numbers given; verify current tables."
`;
  }
}
