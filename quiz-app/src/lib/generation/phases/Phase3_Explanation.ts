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
  teachingConstraints?: PlanningOutput['teachingConstraints'];
  taskMode?: string; // Explicit task mode string (e.g., "IDENTIFICATION, PURPOSE_ONLY")
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

export interface ExplanationOutput {
  explanations: ExplanationBlock[];
  diagramElements?: DiagramElements;
}

export class Phase3_Explanation extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 3: Explanation';
  }

  protected buildSystemPrompt(): string {
    return `You are an expert electrical training content writer for C&G 2365 courses.

Your task: write clear, accurate teaching explanations that match the lesson scope and learning outcomes.

OUTPUT RULES
- Write 400–600 words per explanation block.
- Use \\n\\n for paragraph breaks.
- Use **bold** for key terms (especially vocabulary terms).
- Avoid unjustified absolutes. Use "typically", "commonly", "in most cases" unless a named source is provided.

REQUIRED EXPLANATION STRUCTURE (EACH explanation block MUST include these headings in this order):
1) ### In this lesson
   - 1 sentence: what you're learning (goal)
   - 1 sentence: what context you're in (installation scenario)
   - 3 bullet points: three key takeaways (short, exam-friendly)
2) **What this is**
3) **Why it matters**
4) **Key facts / rules**  (REQUIRED heading exactly; use 4–8 bullet points)
5) **[MODE SECTION]** (heading depends on TASK MODE below)
6) **Common mistakes**
7) **Key Points** (3-5 bullet summary of main takeaways for reinforcement)
8) **Quick recap** (1 short paragraph)
9) ### Coming Up Next (1–2 sentences)

TASK MODE OVERRIDES (CRITICAL — section 5 heading + content rules)
- If TASK_MODE includes "PURPOSE_ONLY":
  Section 5 heading MUST be: **When to choose it**
  Content: selection cues, scenarios, decision criteria, what problem it solves
  DO NOT give step-by-step instructions or physical actions.

- If TASK_MODE includes "IDENTIFICATION" (and NOT PURPOSE_ONLY):
  Section 5 heading MUST be: **How to recognise it**
  Content: distinguishing features, comparisons, common confusions, where you'd see it

- If TASK_MODE includes "SELECTION" or "DIAGNOSIS":
  Section 5 heading MUST be: **How to apply it**
  Content: decision process, criteria, systematic checks (NOT physical steps)

- If TASK_MODE includes "CALCULATION":
  Section 5 heading MUST be: **How to calculate it**
  Content: formulas + worked reasoning in plain language

- If TASK_MODE includes "PROCEDURE" (and NOT PURPOSE_ONLY):
  Section 5 heading MUST be: **How to do it**
  Content: procedures allowed, but keep them clear and safe

Default:
  Section 5 heading: **How to use it** (practical application, not overly detailed)

SCOPE CONTROL (for PURPOSE_ONLY / IDENTIFICATION / SELECTION modes)
- Do NOT describe physical actions or step-by-step procedures.
- Avoid "how to test / verify / certify" unless the lesson explicitly requires it.
- If you mention standards or guidance, name them (e.g., "BS 7671...", "IET On-Site Guide...") and add "(refer to current edition)".

NUMERIC VALUES FROM STANDARDS (CRITICAL):
- Do NOT include numeric values from BS 7671, IET On-Site Guide, or other standards tables UNLESS:
  * The specific value appears in mustHaveTopics input
  * The value appears in additionalInstructions input
  * The value is a universal constant (e.g., UK mains voltage 230V, Earth fault loop impedance limit)
- BANNED numeric content that will cause hallucinations:
  * Cable current-carrying capacities (e.g., "2.5mm² carries 27A")
  * Maximum circuit lengths (e.g., "Ring final max 100m²")
  * Specific factor numbers from tables (e.g., "Cable factor 143")
  * Diversity percentages from tables
  * Specific Zs values for protective devices
- ALLOWED numeric content:
  * Basic formulas (Ohm's Law: V = I × R)
  * General ranges ("typically 16A to 32A") with qualifier
  * Example calculations IF the context values are realistic but clearly examples
- If you need to reference a table/standard: describe WHAT to look up, not the specific values
  * Good: "Refer to the cable current-carrying capacity tables in BS 7671 (verify current edition)"
  * Bad: "A 2.5mm² cable carries 27A in typical installation conditions"

LEARNING OUTCOMES COVERAGE (CRITICAL)
- Every learning outcome must be explicitly taught somewhere in the explanation text.
- Use key phrases from the learning outcomes so later questions can match wording.

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: ExplanationInput): string {
    const { lessonId, topic, section, mustHaveTopics, additionalInstructions, plan, vocabulary, teachingConstraints, taskMode } = input;

    const vocabTerms = vocabulary.terms.map(t => `- ${t.term}: ${t.definition}`).join('\n');

    return `Write explanation content for this lesson:

LESSON DETAILS:
- ID: ${lessonId}
- Topic: ${topic}
- Section: ${section}

TASK MODE: ${taskMode || 'GENERAL'}

TEACHING CONSTRAINTS (must obey):
${teachingConstraints ? JSON.stringify(teachingConstraints, null, 2) : 'None provided'}

CRITICAL: Do NOT include specific numeric values from standards/tables unless they appear in the inputs above. Describe lookup procedures instead.

NEEDS DIAGRAM: ${plan.needsDiagram ? 'true' : 'false'}

VOCABULARY TO USE CONSISTENTLY:
${vocabTerms}

LEARNING OUTCOMES TO ADDRESS:
${plan.learningOutcomes.map((lo, i) => `${i + 1}. ${lo}`).join('\n')}

EXPLANATION SECTIONS NEEDED:
${plan.explanationSections.map((s, i) => `Section ${i + 1} (order ${s.order}):
  Title: ${s.title}
  Topic: ${s.topic}`).join('\n\n')}
${mustHaveTopics ? `\n\nMUST COVER THESE TOPICS:\n${mustHaveTopics}` : ''}
${additionalInstructions ? `\n\nADDITIONAL INSTRUCTIONS:\n${additionalInstructions}` : ''}

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
  ]${plan.needsDiagram ? `,
  "diagramElements": {
    "elementIds": ["ring-final", "distribution-board", "mcb", ...],
    "placeholderDescription": "Detailed description of what the diagram should show, including layout and relationships between elements. Element IDs should match vocabulary term IDs or use kebab-case descriptive slugs."
  }` : ''}
}

CRITICAL REQUIREMENTS:
- Each explanation MUST follow the required 9-part structure:
  1) ### In this lesson (with 3 bullet takeaways)
  2) **What this is**
  3) **Why it matters**
  4) **Key facts / rules** (REQUIRED heading exactly)
  5) [MODE SECTION] — heading based on TASK MODE rules:
     * PURPOSE_ONLY -> **When to choose it**
     * IDENTIFICATION -> **How to recognise it**
     * SELECTION/DIAGNOSIS -> **How to apply it**
     * CALCULATION -> **How to calculate it**
     * PROCEDURE (not PURPOSE_ONLY) -> **How to do it**
     * Default -> **How to use it**
  6) **Common mistakes**
  7) **Key Points** (3-5 bullet summary)
  8) **Quick recap**
  9) ### Coming Up Next
- MUST include "**Key facts / rules**" section (use exactly this heading)
- Address ALL learning outcomes explicitly (use LO phrases in at least one sentence per LO)
- Use vocabulary terms exactly as defined
- Each explanation must be 400-600 words
- Use \\n\\n for paragraph breaks, **bold** for emphasis${plan.needsDiagram ? `
- If diagram needed: provide 3-5 elementIds matching vocabulary terms with detailed placeholder description` : ''}`;
  }
}
