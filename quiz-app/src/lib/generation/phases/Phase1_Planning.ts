/**
 * Phase 1: Planning
 * Determines lesson structure, required blocks, and organization
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { GenerationRequest } from '../types';
import { classifyLessonTask, isPurposeOnly, getTaskModeString } from '../taskClassifier';

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
  taskMode: string; // AUTHORITATIVE task mode (e.g., "CALCULATION, PURPOSE_ONLY")
  syllabusAnchors?: {
    unit: string;
    learningOutcome: string;
    coveredAC: string[];     // In-scope AC labels (e.g., ["AC1", "AC2"])
    outOfScopeAC: string[];  // Explicitly out-of-scope AC labels
  };
  scope?: {
    inScope: string;
    outOfScope: string;
    rationale: string;
  };
  teachingConstraints?: {
    excludeHowTo?: boolean;        // "not how to use"
    purposeOnly?: boolean;          // "what for, not procedures"
    identificationOnly?: boolean;   // "identify only"
    noCalculations?: boolean;       // "concepts only, no math"
    specificScope?: string;         // Any other scoping constraint
  };
}

export class Phase1_Planning extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 1: Planning';
  }

  protected buildSystemPrompt(): string {
    return `You are a lesson structure planner for C&G 2365 Electrical Training courses.

Your task is to analyze the lesson requirements and create a structural plan.

CONSTRAINT PARSING (CRITICAL):
Analyze mustHaveTopics for teaching scope constraints:
- "what [X] is for, not how to use" → excludeHowTo: true, purposeOnly: true
- "identify [X], not procedures" → identificationOnly: true, excludeHowTo: true
- "concepts only" or "definitions only" → noCalculations: true
- Any other scope limitation → specificScope: "[the constraint]"

These constraints MUST be passed to downstream phases to prevent scope violations.

TASK MODE COMPUTATION (CRITICAL):
You MUST compute taskMode by analyzing the lesson requirements:
1. Classify task types from topic/section/mustHaveTopics
2. Detect if PURPOSE_ONLY constraint applies
3. Generate taskMode string (e.g., "CALCULATION, PURPOSE_ONLY")

This taskMode will be the SINGLE SOURCE OF TRUTH for all downstream phases.

SYLLABUS SCOPE ANCHORING (CRITICAL):
You MUST output explicit syllabus anchors and scope control fields:
- syllabusAnchors.unit
- syllabusAnchors.learningOutcome
- syllabusAnchors.coveredAC (in-scope AC labels only)
- syllabusAnchors.outOfScopeAC (explicitly excluded AC labels)
- scope.inScope, scope.outOfScope, scope.rationale

AC LABEL FORMAT:
- Use AC labels as "AC1", "AC2", "AC3" (not "AC 5.1" style).
- coveredAC and outOfScopeAC must be disjoint (no overlap).

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
5. Define syllabus scope anchors (covered ACs vs out-of-scope ACs) for this lesson

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
  "estimatedComplexity": "simple|medium|complex",
  "taskMode": "[Computed task mode string: CALCULATION, PURPOSE_ONLY, IDENTIFICATION, etc.]",
  "syllabusAnchors": {
    "unit": "${request.unit}",
    "learningOutcome": "[LO number, e.g., LO5]",
    "coveredAC": ["AC1", "AC2"],
    "outOfScopeAC": ["AC3", "AC4", "AC5"]
  },
  "scope": {
    "inScope": "[One-line statement of what this lesson covers]",
    "outOfScope": "[One-line statement of what this lesson intentionally does not cover]",
    "rationale": "[One sentence explaining why this scope split is pedagogically correct]"
  },
  "teachingConstraints": {
    "excludeHowTo": true|false,
    "purposeOnly": true|false,
    "identificationOnly": true|false,
    "noCalculations": true|false,
    "specificScope": "any other constraint from mustHaveTopics"
  }
}

TASK MODE EXAMPLES:
- Topic about "Cable Selection Criteria" → taskMode: "SELECTION"
- Topic "Ohm's Law Calculations" → taskMode: "CALCULATION"
- "What conduit bending machines are for, not how to use" → taskMode: "IDENTIFICATION, PURPOSE_ONLY"
- "Safe Isolation Procedure" → taskMode: "PROCEDURE"

RULES:
- explanationSections: 1 section for simple topics, 2 for complex multi-part topics
- needsDiagram: true if layout is 'split-vis' OR topic is visual (circuits, wiring, procedures)
- needsWorkedExample: true if calculations, formulas, or step-by-step procedures
- learningOutcomes: 3-4 measurable outcomes using Bloom's taxonomy verbs
- coveredAC/outOfScopeAC: use AC labels only, no overlap`;
  }
}
