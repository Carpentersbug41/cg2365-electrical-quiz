/**
 * Phase 2: Vocabulary
 * Generates essential technical terms and definitions
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { PlanningOutput } from './Phase1_Planning';

export interface VocabularyInput {
  lessonId: string;
  topic: string;
  section: string;
  plan: PlanningOutput;
}

export interface VocabularyTerm {
  term: string;
  definition: string;
}

export interface VocabularyOutput {
  terms: VocabularyTerm[];
}

export class Phase2_Vocabulary extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 2: Vocabulary';
  }

  protected buildSystemPrompt(): string {
    return `You are a technical vocabulary specialist for C&G 2365 Electrical Training.

Your task is to identify and define the 4-6 most essential technical terms for this lesson.

DEFINITION QUALITY:
- One sentence per definition
- Clear, concise, and technically accurate
- Appropriate for Level 2 electrician students
- Focus on practical understanding, not overly academic

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: VocabularyInput): string {
    const { lessonId, topic, section, plan } = input;

    return `Generate essential vocabulary terms for this lesson:

LESSON DETAILS:
- ID: ${lessonId}
- Topic: ${topic}
- Section: ${section}

LESSON PLAN:
${plan.explanationSections.map((s, i) => `${i + 1}. ${s.title}: ${s.topic}`).join('\n')}

LEARNING OUTCOMES:
${plan.learningOutcomes.map((lo, i) => `${i + 1}. ${lo}`).join('\n')}

Generate 4-6 essential technical terms that students MUST understand to meet the learning outcomes.

Return JSON in this exact format:
{
  "terms": [
    {
      "term": "[Technical term]",
      "definition": "[One sentence definition]"
    },
    {
      "term": "[Another term]",
      "definition": "[One sentence definition]"
    }
  ]
}

REQUIREMENTS:
- Include ONLY essential terms (not basic electrical knowledge)
- Definitions must be one sentence each
- Use consistent terminology throughout
- Order terms logically (foundational concepts first)
- Focus on terms specific to this lesson topic`;
  }
}
