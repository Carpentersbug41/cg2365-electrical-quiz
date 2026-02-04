/**
 * Phase 1: Planning
 * Determines lesson structure, required blocks, and organization
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { GenerationRequest } from '../types';

export interface PlanningInput {
  request: GenerationRequest;
  requiresWorkedExample: boolean;
}

export interface PlanningOutput {
  lessonId: string;
  layout: 'split-vis' | 'linear-flow' | 'focus-mode';
  needsDiagram: boolean;
  explanationSections: Array<{
    order: number;
    title: string;
    topic: string;
  }>;
  needsWorkedExample: boolean;
  learningOutcomes: string[];
  estimatedComplexity: 'simple' | 'medium' | 'complex';
}

export class Phase1_Planning extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 1: Planning';
  }

  protected buildSystemPrompt(): string {
    return `You are a lesson structure planner for C&G 2365 Electrical Training courses.

Your task is to analyze the lesson requirements and create a structural plan.

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: PlanningInput): string {
    const { request, requiresWorkedExample } = input;
    const fullLessonId = `${request.unit}-${request.lessonId}`;

    return `Analyze this lesson and create a structural plan:

LESSON DETAILS:
- ID: ${fullLessonId}
- Topic: ${request.topic}
- Section: ${request.section}
- Layout: ${request.layout || 'auto'}
- Prerequisites: ${request.prerequisites?.length ? request.prerequisites.join(', ') : 'None'}
${request.mustHaveTopics ? `\nMUST HAVE TOPICS:\n${request.mustHaveTopics}` : ''}

ANALYSIS REQUIRED:
1. Determine if layout is 'split-vis' (needs diagram), 'linear-flow', or 'focus-mode'
2. Identify how many explanation sections are needed (1-2 max)
3. Create 3-4 learning outcomes (remember, understand, apply levels)
4. Determine if worked example is needed: ${requiresWorkedExample ? 'YES (calculation/procedure topic)' : 'MAYBE (check topic)'}

Return JSON in this exact format:
{
  "lessonId": "${fullLessonId}",
  "layout": "split-vis|linear-flow|focus-mode",
  "needsDiagram": true|false,
  "explanationSections": [
    {
      "order": 4,
      "title": "[Section title]",
      "topic": "[What this section teaches]"
    }
  ],
  "needsWorkedExample": true|false,
  "learningOutcomes": [
    "[Remember level outcome]",
    "[Understand level outcome]",
    "[Apply level outcome]"
  ],
  "estimatedComplexity": "simple|medium|complex"
}

RULES:
- explanationSections: 1 section for simple topics, 2 for complex multi-part topics
- needsDiagram: true if layout is 'split-vis' OR topic is visual (circuits, wiring, procedures)
- needsWorkedExample: true if calculations, formulas, or step-by-step procedures
- learningOutcomes: 3-4 measurable outcomes using Bloom's taxonomy verbs`;
  }
}
