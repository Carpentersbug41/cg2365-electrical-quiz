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
  lessonProfileInjection?: string;
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

  protected buildSystemPrompt(input: VocabularyInput): string {
    const profileBlock = input.lessonProfileInjection
      ? `\nLEARNER PROFILE INJECTION (MANDATORY STYLE/TONE):\n- ${input.lessonProfileInjection}\n- Apply this to word choice and definition clarity only.\n`
      : '';

    return `You are a technical vocabulary specialist for City & Guilds technical and vocational training.

Your task is to identify and define the 4-6 most essential technical terms for this lesson.
${profileBlock}

DEFINITION QUALITY:
- One sentence per definition
- Clear, concise, and technically accurate
- Appropriate for technical learners at the lesson's level
- Focus on practical understanding, not overly academic
- For commonly confused terms, definitions should include a boundary clause: "X is ..., not ..." OR "Different from ... because ..."

DOMAIN-AGNOSTIC RULE:
- Use wording that transfers across trades and technical subject areas.

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: VocabularyInput): string {
    const { lessonId, topic, section, plan, lessonProfileInjection } = input;
    const profileSection = lessonProfileInjection
      ? `\nLEARNER PROFILE INJECTION (MANDATORY STYLE/TONE):\n${lessonProfileInjection}\nUse this to keep definitions age/readability appropriate.`
      : '';

    return `Generate essential vocabulary terms for this lesson:

LESSON DETAILS:
- ID: ${lessonId}
- Topic: ${topic}
- Section: ${section}

LESSON PLAN:
${plan.explanationSections.map((s, i) => `${i + 1}. ${s.title}: ${s.topic}`).join('\n')}

LEARNING OUTCOMES:
${plan.learningOutcomes.map((lo, i) => `${i + 1}. ${lo}`).join('\n')}
${profileSection}

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
- Include ONLY essential terms (not generic filler knowledge)
- Definitions must be one sentence each
- Use consistent terminology throughout
- Order terms logically (foundational concepts first)
- Focus on terms specific to this lesson topic`;
  }
}

