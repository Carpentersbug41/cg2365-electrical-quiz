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
4. **How to use it**: Practical application and procedures
5. **Common mistakes**: What students often get wrong
6. **Quick recap**: Summary paragraph tying it together

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

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: ExplanationInput): string {
    const { lessonId, topic, section, mustHaveTopics, additionalInstructions, plan, vocabulary } = input;

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

Write ${plan.explanationSections.length} explanation block(s) following the 6-part structure.

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
