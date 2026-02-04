/**
 * Phase 3: Explanation
 * Generates comprehensive teaching content following 6-part structure
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

Your task is to write clear, comprehensive explanation content that teaches concepts effectively.

EXPLANATION STRUCTURE (REQUIRED 6 PARTS):
1. **What this is**: Define the concept/topic clearly
2. **Why it matters**: Practical importance and real-world relevance
3. **Key facts / rules**: Bullet list of essential facts (REQUIRED - use exactly this heading)
4. **[CONDITIONAL - see TASK MODE OVERRIDES]**: Context-dependent section
5. **Common mistakes**: What students often get wrong
6. **Quick recap**: Summary paragraph tying it together

TASK MODE OVERRIDES (CRITICAL - section 4 changes based on task mode):

If TASK_MODE includes "IDENTIFICATION" or "PURPOSE_ONLY":
  Section 4 = "When to choose it": Selection cues, scenarios where each item is appropriate, decision criteria
  BANNED VERBS: place, clamp, rotate, pull, turn, push, tighten, loosen, secure, insert, thread, break the chip, lubricate, half-turn, technique, method, step, process, operate
  Focus on: What it enables, Where it's used, What problem it solves, Selection criteria
  Example: "A conduit bender is selected when steel conduit runs must change direction..."
    NOT: "Place the conduit in the bender, position the guide, pull the lever..."

If TASK_MODE includes "PROCEDURE" (and NOT "PURPOSE_ONLY"):
  Section 4 = "How to use it": Practical application and procedures (step-by-step allowed)

If TASK_MODE includes "SELECTION" or "DIAGNOSIS":
  Section 4 = "How to apply it": Decision process, criteria, systematic approach (no physical steps)

If TASK_MODE includes "CALCULATION":
  Section 4 = "How to calculate it": Formula application, practical scenarios (procedural math steps allowed)

Default (no specific mode or GENERAL):
  Section 4 = "How to use it": Practical application and procedures

WRITING GUIDELINES:
- Write 400-600 words per explanation section
- Use **bold** for emphasis on key terms
- Use \\n\\n for paragraph breaks
- Use bullet lists for key facts/rules
- Write for Level 2 electrician students (practical, not overly academic)
- Use vocabulary terms consistently
- Include specific examples and scenarios

LEARNING OUTCOMES COVERAGE (CRITICAL):
- For each learning outcome, identify WHERE in your explanation you address it
- Make coverage explicit, not implied
- Use clear headings or sections that map to outcomes
- Teach using EXACT phrases that will appear in expectedAnswers
- If an outcome says "calculate using factor tables", explicitly teach where tables come from and how to use them

DIAGRAM ELEMENTS (if diagram needed):
If this lesson needs a diagram (plan.needsDiagram = true), identify:
1. Key visual elements (3-5 items) that should be labeled
2. How they relate to the explanation content
3. Labels that match vocabulary terms
4. Create a detailed placeholder description for rendering

DIAGRAM DESCRIPTION REQUIREMENTS (if diagram needed):
CRITICAL - Avoid common errors:
- For area-based concepts (e.g., "45% fill"), describe AREA shading, NOT linear dimensions
- WRONG: "dashed line at 45% height" - this confuses area with linear measurement
- RIGHT: "cables and insulation shaded to show 45% of total cross-sectional area"
- For cross-sections, specify "viewed end-on" to clarify perspective
- Use shading to show occupied vs unoccupied areas
- Include labels for key measurements and relationships
- Show arrows for flows (heat, current, force) where relevant

CONDUIT vs TRUNKING DISTINCTION (when relevant):
If the lesson covers both conduit and trunking (e.g., spacing factor, enclosure fill):

CRITICAL - These are DIFFERENT systems:
- TRUNKING: Uses the 45% rule (45% of cross-sectional AREA maximum)
- CONDUIT: Uses factor tables from IET On-Site Guide (depends on run length, bends, cable type)

In your explanation:
- Use a dedicated bullet point or paragraph for each
- State explicitly: "This rule applies to trunking ONLY" or "Conduit uses a different method"
- Never say "conduit uses the 45% rule" - this is incorrect
- Explain WHY they differ (trunking is rectangular/predictable, conduit capacity varies by length/bends)

In Key facts / rules section:
- Separate bullet: "Trunking: 45% cross-sectional area limit"
- Separate bullet: "Conduit: capacity via IET factor tables (not a fixed percentage)"
- Separate bullet: "IMPORTANT: Do not apply 45% rule to conduit"

TECHNICAL ACCURACY AND REALISM:

Conduit sizes:
- UK common sizes: 16mm, 20mm, 25mm, 32mm (depending on application)
- Phrase as: "Common UK conduit sizes include 16mm, 20mm, 25mm, and 32mm"
- Avoid: "typically 20mm or 25mm" (too narrow)

Earth continuity and threading:
- Correct: "Threaded joints contribute to electrical continuity of the metallic containment system"
- Correct: "When properly installed, the threaded metallic path can provide earth continuity"
- Avoid: "Conduit acts as CPC" (overstated without context)
- Avoid: "Threads guarantee earth continuity" (too absolute)

Regulation references:
- Only cite specific regulations if the lesson explicitly covers them
- Prefer: "Industry guidance recommends...", "IET On-Site Guide provides...", "Common practice is..."
- Avoid: "Legal requirement" unless the lesson topic is regulations/compliance

Equipment specificity:
- When describing "different materials may require different equipment":
  * Good: "Steel conduit requires a floor-standing bender, while plastic conduit uses different tooling"
  * Avoid: "Technique may differ" (implies procedure, not equipment selection)

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
${taskMode ? `
TASK MODE: ${taskMode}

CRITICAL REMINDERS based on task mode:
${taskMode.includes('PURPOSE_ONLY') ? '- Section 4 must be "When to choose it" (selection cues), NOT "How to use it"' : ''}
${taskMode.includes('PURPOSE_ONLY') ? '- BANNED VERBS: place, clamp, rotate, pull, turn, tighten, thread, lubricate, insert, secure, technique, method, step, process, operate' : ''}
${taskMode.includes('IDENTIFICATION') ? '- Focus on recognition, distinguishing features, selection scenarios' : ''}
${taskMode.includes('PROCEDURE') && !taskMode.includes('PURPOSE_ONLY') ? '- Section 4 is "How to use it" - step-by-step procedures are appropriate' : ''}
${taskMode.includes('CALCULATION') ? '- Section 4 is "How to calculate it" - show formula application' : ''}
${taskMode.includes('SELECTION') || taskMode.includes('DIAGNOSIS') ? '- Section 4 is "How to apply it" - decision process, not physical steps' : ''}
` : ''}

Write ${plan.explanationSections.length} explanation block(s) following the 6-part structure with CONDITIONAL section 4.

Return JSON in this exact format:
{
  "explanations": [
    {
      "id": "${lessonId}-explain-1",
      "order": ${plan.explanationSections[0]?.order || 4},
      "title": "[Section title]",
      "content": "[400-600 word explanation following 6-part structure]"
    }${plan.explanationSections.length > 1 ? `,
    {
      "id": "${lessonId}-explain-2",
      "order": ${plan.explanationSections[1]?.order || 5},
      "title": "[Section 2 title]",
      "content": "[400-600 word explanation following 6-part structure]"
    }` : ''}
  ]${plan.needsDiagram ? `,
  "diagramElements": {
    "elementIds": ["Element 1", "Element 2", "Element 3", ...],
    "placeholderDescription": "Detailed description of what the diagram should show, including layout and relationships between elements"
  }` : ''}
}

CRITICAL REQUIREMENTS:
- MUST include "**Key facts / rules**" section in each explanation (use exactly this heading)
- Address ALL learning outcomes across all explanations EXPLICITLY
  * For each LO, ensure there's a dedicated section or clear paragraph
  * Use key phrases from the LO in your explanation
  * Teach concepts using EXACT terms that will appear in questions
- Use vocabulary terms exactly as defined
- Include practical examples and scenarios
- Write at appropriate level for Level 2 electrician students
- Each explanation must be 400-600 words
- Use \\n\\n for paragraph breaks, **bold** for emphasis${plan.needsDiagram ? `
- If diagram needed: provide 3-5 elementIds matching vocabulary terms with detailed placeholder description` : ''}`;
  }
}
