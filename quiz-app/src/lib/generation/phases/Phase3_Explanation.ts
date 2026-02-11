/**
 * Phase 3: Explanation
 * Generates comprehensive teaching content following 9-part structure
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { PlanningOutput } from './Phase1_Planning';
import { VocabularyOutput } from './Phase2_Vocabulary';

export interface ExplanationInput {
  lessonId: string;
  topic: string;
  section: string;
  mustHaveTopics?: string;
  additionalInstructions?: string;
  plan: PlanningOutput;
  vocabulary: VocabularyOutput;
  taskMode: string; // Explicit task mode string (e.g., "IDENTIFICATION, PURPOSE_ONLY")
}

export interface ExplanationBlock {
  id: string;
  order: number;
  title: string;
  content: string;
}

export interface DiagramElements {
  elementIds: string[];
  placeholderDescription: string;
}

export interface TargetedMisconception {
  misconception: string;
  correction: string;
  relatedAC: string; // AC label like "AC1"
}

export interface ExplanationOutput {
  explanations: ExplanationBlock[];
  diagramElements?: DiagramElements;
  misconceptions?: TargetedMisconception[];
}

export class Phase3_Explanation extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 3: Explanation';
  }

  protected buildSystemPrompt(): string {
    return `You are an expert technical training content writer for City & Guilds courses.

Your task: write clear, accurate teaching explanations that match lesson scope and learning outcomes.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Do not assume any specific trade, science branch, or industry context.
- Use pedagogical patterns that transfer across all technical subject areas.

OUTPUT RULES
- Write 400-600 words per explanation block.
- Use \\n\\n for paragraph breaks.
- Use **bold** for key terms (especially vocabulary terms).
- Avoid unjustified absolutes. Prefer "typically", "commonly", "in many cases" unless a named source is provided.

UNIVERSAL TEACHING PRINCIPLES (CRITICAL):
- Concrete before abstract.
- Observable before symbolic.
- Concept before unit.
- Recall to reasoning to integration.

CONCRETE ANCHORING RULE (CRITICAL):
- After defining any technical concept formally, include at least one:
  * physical-world analogy, OR
  * sensory/observable comparison, OR
  * everyday contextual anchor.
- The anchor must clarify, remain technically defensible, and avoid introducing misconceptions.

MICRO WORKED SCENARIO RULE (CRITICAL):
- For concepts involving measurement, quantity, units, comparison, ratio, intensity, scale, or performance difference:
  * include a short micro-scenario (1-2 sentences),
  * use simple numbers or a concrete applied case,
  * force comparison or judgement.
- This is not a full worked example block.

TECHNICAL PRECISION TIGHTENING (CRITICAL):
- Simplify language without technical misrepresentation.
- Avoid "always" overclaims unless genuinely universal.
- Avoid ambiguous causal wording and imprecise terminology.

REQUIRED EXPLANATION STRUCTURE (EACH explanation block MUST include these headings in this order):
1) ### In this lesson
   - 1 sentence: what you're learning (goal)
   - 1 sentence: context of application
   - 3 bullet points: key takeaways
2) **What this is**
3) **Why it matters**
4) **Key facts / rules** (REQUIRED heading exactly; use 4-8 bullet points)
5) **[MODE SECTION]** (heading depends on TASK MODE below)
6) **Common mistakes**
7) **Key Points** (3-5 bullet summary)
8) **Quick recap** (1 short paragraph)
9) ### Coming Up Next (1-2 sentences)

CONTRAST REQUIREMENT (CRITICAL):
- In **Common mistakes**, include at least one explicit contrast:
  "Learners often confuse **X** with **Y**; **X** is ... whereas **Y** is ..."
- X and Y must both appear in the explanation (no invented terms).

MISCONCEPTIONS TARGETING (CRITICAL):
- In **Common mistakes**, include a compact structured list named "Misconceptions (targeted):"
- Include exactly 2-3 bullets:
  * "Misconception: [wrong idea] | Correction: [precise fix] | AC: [AC label]"
- Also output the same items in top-level JSON field "misconceptions" as objects:
  { "misconception": "...", "correction": "...", "relatedAC": "AC1" }
- Use AC labels "AC1", "AC2", etc.

TASK MODE OVERRIDES (CRITICAL)
- If TASK_MODE includes "PURPOSE_ONLY":
  heading: **When to choose it**
  content: selection cues, scenarios, decision criteria, problem solved
  no step-by-step operation instructions.
- If TASK_MODE includes "IDENTIFICATION" (and NOT PURPOSE_ONLY):
  heading: **How to recognise it**
  content: distinguishing features, comparisons, common confusions, where seen.
- If TASK_MODE includes "SELECTION" or "DIAGNOSIS":
  heading: **How to apply it**
  content: decision process and criteria (not physical operation steps).
- If TASK_MODE includes "CALCULATION":
  heading: **How to calculate it**
  content: formulas + worked reasoning in plain language.
- If TASK_MODE includes "PROCEDURE" (and NOT PURPOSE_ONLY):
  heading: **How to do it**
  content: procedures allowed, clear and safe.
- Default heading: **How to use it**.

SCOPE CONTROL (for PURPOSE_ONLY / IDENTIFICATION / SELECTION):
- Do NOT describe physical actions or step-by-step operation instructions.
- Avoid verification/certification workflows unless explicitly required by lesson scope.

STANDARDS/TABLE VALUES SAFETY (CRITICAL):
- Do NOT invent numeric values from standards, manuals, or tables.
- Include specific external values only if explicitly present in mustHaveTopics or additionalInstructions.
- If a lookup is needed, explain what to look up and state "(verify current edition/version)".

DIAGRAM ELEMENT ID FORMAT (CRITICAL):
If needsDiagram is true, diagramElements.elementIds MUST follow kebab-case:
- lowercase only
- hyphen-separated words
- no spaces, underscores, or capitals
- 3-5 element IDs total

DIAGRAM INTEGRATION (CRITICAL):
- If needsDiagram is true, include one sentence that "reads" the diagram.
- Do not introduce new terms not already in vocabulary/lesson content.

LEARNING OUTCOMES COVERAGE (CRITICAL):
- Every learning outcome must be explicitly taught somewhere in explanation text.
- Reuse key LO phrasing so downstream questions can align.

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: ExplanationInput): string {
    const { lessonId, topic, section, mustHaveTopics, additionalInstructions, plan, vocabulary, taskMode } = input;

    const vocabTerms = vocabulary.terms.map(t => `- ${t.term}: ${t.definition}`).join('\\n');

    return `Write explanation content for this lesson:

LESSON DETAILS:
- ID: ${lessonId}
- Topic: ${topic}
- Section: ${section}

TASK MODE: ${taskMode}

CRITICAL:
- Do NOT include specific numeric values from standards/tables unless they appear in the inputs above.
- If a lookup is needed, describe lookup procedure and state "verify current edition/version".
- Keep explanations domain-agnostic and transferable across technical subjects.

NEEDS DIAGRAM: ${plan.needsDiagram ? 'true' : 'false'}

VOCABULARY TO USE CONSISTENTLY:
${vocabTerms}

LEARNING OUTCOMES TO ADDRESS:
${plan.learningOutcomes.map((lo, i) => `${i + 1}. ${lo}`).join('\\n')}

EXPLANATION SECTIONS NEEDED:
${plan.explanationSections.map((s, i) => `Section ${i + 1} (order ${s.order}):
  Title: ${s.title}
  Topic: ${s.topic}`).join('\\n\\n')}
${mustHaveTopics ? `\\n\\nMUST COVER THESE TOPICS:\\n${mustHaveTopics}` : ''}
${additionalInstructions ? `\\n\\nADDITIONAL INSTRUCTIONS:\\n${additionalInstructions}` : ''}

Write ${plan.explanationSections.length} explanation block(s) following the required 9-part structure with MODE-DEPENDENT section 5 heading.

Return JSON in this exact format:
{
  "explanations": [
    {
      "id": "${lessonId}-explain-1",
      "order": ${plan.explanationSections[0]?.order || 4},
      "title": "[Section title]",
      "content": "[400-600 word explanation following 9-part structure]"
    }${plan.explanationSections.length > 1 ? `,
    {
      "id": "${lessonId}-explain-2",
      "order": ${plan.explanationSections[1]?.order || 5},
      "title": "[Section 2 title]",
      "content": "[400-600 word explanation following 9-part structure]"
    }` : ''}
  ],
  "misconceptions": [
    {
      "misconception": "[specific wrong idea learners commonly hold]",
      "correction": "[clear correction in beginner-safe language]",
      "relatedAC": "AC1"
    },
    {
      "misconception": "[second misconception]",
      "correction": "[second correction]",
      "relatedAC": "AC2"
    }
  ]${plan.needsDiagram ? `,
  "diagramElements": {
    "elementIds": ["core-component", "support-component", "measurement-point", "control-point"],
    "placeholderDescription": "Detailed description of what the diagram should show, including layout and relationships between elements. Element IDs MUST use kebab-case format (lowercase, hyphens only, no spaces)."
  }` : ''}
}

CRITICAL REQUIREMENTS:
- Each explanation MUST follow the required 9-part structure:
  1) ### In this lesson (with 3 bullet takeaways)
  2) **What this is**
  3) **Why it matters**
  4) **Key facts / rules** (REQUIRED heading exactly)
  5) [MODE SECTION] - heading based on TASK MODE rules:
     * PURPOSE_ONLY -> **When to choose it**
     * IDENTIFICATION -> **How to recognise it**
     * SELECTION/DIAGNOSIS -> **How to apply it**
     * CALCULATION -> **How to calculate it**
     * PROCEDURE (not PURPOSE_ONLY) -> **How to do it**
     * Default -> **How to use it**
  6) **Common mistakes** (must include "Misconceptions (targeted):" with 2-3 structured bullets)
  7) **Key Points** (3-5 bullet summary)
  8) **Quick recap**
  9) ### Coming Up Next
- For each major concept, provide formal definition + concrete anchor (analogy/observable/everyday)
- For measurable/quantitative/intensity concepts, include 1-2 sentence micro-scenario with simple numbers or clear applied comparison
- MUST include "**Key facts / rules**" section (use exactly this heading)
- Address ALL learning outcomes explicitly (use LO phrases in at least one sentence per LO)
- Use vocabulary terms exactly as defined
- Each explanation must be 400-600 words
- Simplify without technical distortion; avoid overclaims and imprecise causal language
- Include top-level "misconceptions" array with 2-3 items (misconception/correction/relatedAC)
- Use \\n\\n for paragraph breaks, **bold** for emphasis${plan.needsDiagram ? `
- If diagram needed: provide 3-5 elementIds matching vocabulary terms with detailed placeholder description` : ''}`;
  }
}

