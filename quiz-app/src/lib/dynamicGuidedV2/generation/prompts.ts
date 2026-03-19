import type {
  DynamicApplyPhaseOutput,
  DynamicExplanationPhaseOutput,
  DynamicFixPlan,
  DynamicLessonGenerationInput,
  DynamicLessonStageDescriptor,
  DynamicPlanningPhaseOutput,
  DynamicSpacedReviewPhaseOutput,
  DynamicUnderstandingChecksPhaseOutput,
  DynamicVocabularyPhaseOutput,
  DynamicWorkedExamplePhaseOutput,
} from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import type { DynamicLessonGenerationScore } from '@/lib/dynamicGuidedV2/versionStore';

function describeStagePlan(stagePlan: DynamicLessonStageDescriptor[]): string {
  return stagePlan
    .map(
      (step, index) =>
        `${index + 1}. ${step.title} | role=${step.role} | stage=${step.stage} | completionMode=${step.completionMode} | progression=${step.progressionRule ?? 'none'} | objective=${step.objective}`
    )
    .join('\n');
}

function baseContext(input: DynamicLessonGenerationInput, stagePlan: DynamicLessonStageDescriptor[]): string {
  return [
    `Lesson code: ${input.lessonCode}`,
    `Lesson title: ${input.title}`,
    `Unit: ${input.unit}`,
    `Topic: ${input.topic}`,
    `Subject: ${input.subject}`,
    `Audience: ${input.audience}`,
    `Tone: ${input.tonePrompt}`,
    '',
    'Stage plan:',
    describeStagePlan(stagePlan),
    '',
    'Grounded source text:',
    input.sourceText,
  ].join('\n');
}

export function buildDynamicPlanningPrompt(
  input: DynamicLessonGenerationInput,
  stagePlan: DynamicLessonStageDescriptor[]
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 1 Planning for a 2365 dynamic lesson generator.',
      'Your job is to scope the lesson tightly before any teaching content is written.',
      'Keep the plan grounded in the supplied source only.',
      'Do not invent extra syllabus coverage.',
      'Treat this as a beginner-facing electrical lesson.',
      'Output strict JSON only.',
      'Lock the lesson to the current requested topic and stage plan.',
      'Decide the teach/check split, identify in-scope and out-of-scope ideas, and surface misconception targets.',
      'Do not write final teaching prose here.',
    ].join('\n'),
    user: [
      baseContext(input, stagePlan),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          lessonAim: 'string',
          taskMode: 'string',
          teachCheckCount: 2,
          teachChecks: [
            {
              key: 'teach-check-1',
              title: 'Teach/Check 1',
              objective: 'string',
              conceptFocus: 'string',
              whyItMatters: 'string',
              misconceptions: ['string'],
            },
          ],
          workedExampleObjective: 'string',
          guidedPracticeObjective: 'string',
          practiceObjective: 'string',
          integrativeObjective: 'string',
          spacedReviewObjective: 'string',
          inScope: ['string'],
          outOfScope: ['string'],
          constraints: ['string'],
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- teachCheckCount must equal the number of teach_check stages in the stage plan.',
      '- Each teach check must focus on one main idea only.',
      '- inScope and outOfScope must be concrete, not generic labels.',
      '- constraints should include teach-before-test and no-untaught-terms style rules if relevant.',
    ].join('\n'),
  };
}

export function buildDynamicVocabularyPrompt(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  stagePlan: DynamicLessonStageDescriptor[]
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 2 Vocabulary for a 2365 dynamic lesson generator.',
      'Extract only the terms that must be taught for this specific lesson.',
      'Use beginner-safe wording without losing technical correctness.',
      'Each term needs a plain definition, a concrete anchor, and any misconception risk.',
      'Output strict JSON only.',
    ].join('\n'),
    user: [
      baseContext(input, stagePlan),
      '',
      'Planning output:',
      JSON.stringify(planning, null, 2),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          terms: [
            {
              term: 'string',
              simpleDefinition: 'string',
              anchor: 'string',
              misconception: 'string',
            },
          ],
          anchorPhrases: ['string'],
          misconceptionTargets: ['string'],
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- Terms must be lesson-specific and grounded in the source.',
      '- Definitions must be short and technically defensible.',
      '- anchorPhrases should be reusable phrases that later phases can teach verbatim or near-verbatim.',
    ].join('\n'),
  };
}

export function buildDynamicExplanationPrompt(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput,
  stagePlan: DynamicLessonStageDescriptor[]
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 3 Explanation for a 2365 dynamic lesson generator.',
      'Write the teaching core for each teach/check section only.',
      'Do not write questions in this phase.',
      'Teach one clear main idea per section, using concrete before abstract.',
      'Every explanation must be factual, grounded, and beginner-readable.',
      'No placeholder filler. No prompt-like wording.',
      'Output strict JSON only.',
    ].join('\n'),
    user: [
      baseContext(input, stagePlan),
      '',
      'Planning output:',
      JSON.stringify(planning, null, 2),
      '',
      'Vocabulary output:',
      JSON.stringify(vocabulary, null, 2),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          teachChecks: [
            {
              title: 'Teach/Check 1',
              objective: 'string',
              retrievalTextLines: ['string'],
              hint: 'string',
            },
          ],
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- One explanation object per teach/check section.',
      '- Each explanation should be roughly 120-180 words when joined.',
      '- Teach before test: every later question must be answerable from this prose.',
      '- Use the vocabulary output naturally, not as a glossary dump.',
    ].join('\n'),
  };
}

export function buildDynamicUnderstandingChecksPrompt(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  explanations: DynamicExplanationPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput,
  stagePlan: DynamicLessonStageDescriptor[]
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 4 Understanding Checks for a 2365 dynamic lesson generator.',
      'Generate formative checks aligned tightly to the explanation text.',
      'Use the anchor-fact method.',
      'For each explanation, create exactly 3 short-answer recall questions and 1 deeper connection question.',
      'Do not introduce untaught terms.',
      'The deeper question must require reasoning, not recall restatement.',
      'Every question needs specific answer targets.',
      'Output strict JSON only.',
    ].join('\n'),
    user: [
      baseContext(input, stagePlan),
      '',
      'Planning output:',
      JSON.stringify(planning, null, 2),
      '',
      'Vocabulary output:',
      JSON.stringify(vocabulary, null, 2),
      '',
      'Explanation output:',
      JSON.stringify(explanations, null, 2),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          teachChecks: [
            {
              title: 'Teach/Check 1',
              basicQuestions: [
                {
                  questionText: 'string',
                  answerGuidance: ['string'],
                },
                {
                  questionText: 'string',
                  answerGuidance: ['string'],
                },
                {
                  questionText: 'string',
                  answerGuidance: ['string'],
                },
              ],
              deeperQuestionText: 'string',
              deeperAnswerGuidance: ['string'],
              hint: 'string',
            },
          ],
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- basicQuestions must contain exactly 3 items.',
      '- Each basic question must test one taught fact only.',
      '- Each basic question answerGuidance must contain 2-5 checkable phrases or ideas.',
      '- If a question asks for the specific term, name, or technical label, the first answerGuidance item must be the exact term from the lesson vocabulary.',
      '- Do not replace required technical terms with loose descriptive paraphrases in answerGuidance.',
      '- The deeper question must connect the explanation facts and ask why/how/what-must-be-true.',
      '- deeperAnswerGuidance must contain 3-6 checkable ideas.',
    ].join('\n'),
  };
}

export function buildDynamicWorkedExamplePrompt(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput,
  explanations: DynamicExplanationPhaseOutput,
  checks: DynamicUnderstandingChecksPhaseOutput,
  stagePlan: DynamicLessonStageDescriptor[]
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 5 Worked Example for a 2365 dynamic lesson generator.',
      'Write one complete worked example that models the reasoning the learner will need next.',
      'The worked example must include a concrete scenario, numbered steps, a final result, and a takeaway.',
      'Keep it practical and beginner-readable.',
      'Output strict JSON only.',
    ].join('\n'),
    user: [
      baseContext(input, stagePlan),
      '',
      'Planning output:',
      JSON.stringify(planning, null, 2),
      '',
      'Vocabulary output:',
      JSON.stringify(vocabulary, null, 2),
      '',
      'Explanation output:',
      JSON.stringify(explanations, null, 2),
      '',
      'Checks output:',
      JSON.stringify(checks, null, 2),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          title: 'Worked Example',
          objective: 'string',
          retrievalTextLines: ['string'],
          hint: 'string',
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- retrievalTextLines must contain the worked example prose only.',
      '- Include at least Step 1 and Step 2 explicitly.',
      '- Include an explicit Result or Final Result line.',
      '- Include an explicit Takeaway line.',
    ].join('\n'),
  };
}

export function buildDynamicPracticePrompt(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput,
  workedExample: DynamicWorkedExamplePhaseOutput,
  stagePlan: DynamicLessonStageDescriptor[]
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 6 Practice for a 2365 dynamic lesson generator.',
      'Generate guided practice and independent practice.',
      'Guided practice must mirror the worked example closely.',
      'Independent practice must be more independent and slightly less scaffolded.',
      'Each task needs clear answer targets.',
      'Output strict JSON only.',
    ].join('\n'),
    user: [
      baseContext(input, stagePlan),
      '',
      'Planning output:',
      JSON.stringify(planning, null, 2),
      '',
      'Vocabulary output:',
      JSON.stringify(vocabulary, null, 2),
      '',
      'Worked example output:',
      JSON.stringify(workedExample, null, 2),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          guidedPractice: {
            title: 'Guided Practice',
            objective: 'string',
            retrievalTextLines: ['string'],
            questionText: 'string',
            answerGuidance: ['string'],
            hint: 'string',
          },
          practice: {
            title: 'Practice',
            objective: 'string',
            retrievalTextLines: ['string'],
            questionText: 'string',
            answerGuidance: ['string'],
            hint: 'string',
          },
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- guidedPractice retrieval and task must clearly mirror the worked example pattern.',
      '- practice must be more independent than guidedPractice.',
      '- Prefer one current task per phase. Avoid bundling several unrelated sub-questions into a single response field.',
      '- If a task genuinely needs multiple parts, answerGuidance must map clearly to each required part.',
      '- answerGuidance arrays must be concrete and gradeable.',
    ].join('\n'),
  };
}

export function buildDynamicIntegrationPrompt(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput,
  explanations: DynamicExplanationPhaseOutput,
  practice: DynamicApplyPhaseOutput,
  stagePlan: DynamicLessonStageDescriptor[]
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 7 Integration for a 2365 dynamic lesson generator.',
      'Generate the final integrative task only.',
      'The task must make the learner pull the lesson ideas together, not repeat a recall question.',
      'Provide clear answer targets for later integrative feedback.',
      'Output strict JSON only.',
    ].join('\n'),
    user: [
      baseContext(input, stagePlan),
      '',
      'Planning output:',
      JSON.stringify(planning, null, 2),
      '',
      'Vocabulary output:',
      JSON.stringify(vocabulary, null, 2),
      '',
      'Explanation output:',
      JSON.stringify(explanations, null, 2),
      '',
      'Practice output:',
      JSON.stringify(practice, null, 2),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          integrative: {
            title: 'Integrative Close',
            objective: 'string',
            retrievalTextLines: ['string'],
            questionText: 'string',
            answerGuidance: ['string'],
            hint: 'string',
          },
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- Make the question synthesize the lesson ideas.',
      '- Prefer one integrative task with one coherent response target, not a loose list of mini-questions.',
      '- If the integrative task has multiple required parts, answerGuidance must name each part explicitly.',
      '- answerGuidance must contain the main points expected in a strong response.',
    ].join('\n'),
  };
}

export function buildDynamicSpacedReviewPrompt(
  input: DynamicLessonGenerationInput,
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput,
  stagePlan: DynamicLessonStageDescriptor[]
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 8 Spaced Review for a 2365 dynamic lesson generator.',
      'Generate a short prerequisite retrieval artifact for knowledge that should already be known.',
      'This artifact sits outside the live runtime arc.',
      'Output strict JSON only.',
    ].join('\n'),
    user: [
      baseContext(input, stagePlan),
      '',
      'Planning output:',
      JSON.stringify(planning, null, 2),
      '',
      'Vocabulary output:',
      JSON.stringify(vocabulary, null, 2),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          title: 'Spaced Review',
          objective: 'string',
          retrievalTextLines: ['string'],
          questionText: 'string',
          answerGuidance: ['string'],
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- Focus on prerequisite retrieval, not the new live lesson chunk.',
      '- Keep it short and concrete.',
    ].join('\n'),
  };
}

export function buildDynamicScorePrompt(
  input: DynamicLessonGenerationInput,
  lesson: DynamicGuidedV2Lesson,
  validationIssues: string[],
  planning: DynamicPlanningPhaseOutput,
  vocabulary: DynamicVocabularyPhaseOutput,
  spacedReview: DynamicSpacedReviewPhaseOutput | null
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 10 Pedagogical Scoring for a 2365 dynamic lesson generator.',
      'Score the lesson quality using the weighted rubric below.',
      'This is an electrical lesson, but score pedagogy first: clarity, teaching-before-testing, marking robustness, alignment, and question quality.',
      'Return 0-10 issues only, sorted by impact.',
      'Be strict, fair, and concrete. Do not hand out perfect scores casually.',
      'Each issue must include id, category, jsonPointers, excerpt, problem, whyItMatters, alignmentGap, and suggestion.',
      'You must also return phase-by-phase feedback for every lesson step.',
      'If validation issues are present, the lesson cannot score above rework level.',
      'Output strict JSON only.',
      '',
      'Rubric:',
      '- beginnerClarity: 0-30',
      '- teachingBeforeTesting: 0-25',
      '- markingRobustness: 0-20',
      '- alignmentToLO: 0-15',
      '- questionQuality: 0-10',
      '',
      'Strict rules:',
      '- total must equal the breakdown sum.',
      '- If content is generic, placeholder-like, or structurally weak, score harshly.',
      '- If validationIssues is non-empty, grade must be rework.',
      '- A score of 100 is extremely rare and should only be used if there are genuinely no meaningful pedagogical weaknesses.',
      '- If you can name even one real weakness, do not return 100 and do not return an empty issues array.',
      '- Penalize bundled or multi-part tasks when the answer guidance does not map clearly to each required part.',
      '- Penalize bundled tasks most strongly when one response field mixes different output types, multiple scenarios, or several labeled requirements that would be hard to mark independently.',
      '- Do not over-penalize simple same-type recall lists if the answer guidance maps cleanly; focus on genuinely hard-to-mark mixed-output tasks.',
      '- If a task bundles Scenario A and Scenario B with different labels or answer types into one answer box, prioritise that bundled-task defect above secondary wording issues.',
      '- Penalize open-ended wording that is hard to mark reliably from learner phrasing.',
      '- Penalize any drift into out-of-scope content, even if the lesson is otherwise strong.',
      '- If a task expects a specific technical term, penalize answer guidance that accepts vague generic wording.',
      '- Penalize answer guidance that includes factually wrong answers, category labels instead of the asked term, or answers that belong to a different question in the same step.',
      '- Treat contaminated answer guidance as a high-impact markingRobustness problem, especially when a single-question answer list contains material copied from neighbouring questions.',
      '- If a question asks for one code letter, one abbreviation expansion, one exact term, or one named item, the guidance should prioritise only that target rather than nearby concepts or topic labels.',
      '- For teach_check steps, treat basicQuestions as the authoritative question structure. Do not penalize the derived combined questionText field if the underlying basicQuestions are sound.',
      '- phaseFeedback must cover every lesson step exactly once, in lesson order.',
      '- Every phaseFeedback item must include at least one concrete strength or one concrete issue.',
      '- summary must be 2-3 sentences maximum.',
    ].join('\n'),
    user: [
      `Lesson context:\n${baseContext(input, lesson.steps.map((step) => ({
        key: step.id,
        title: step.title,
        role: step.role as DynamicLessonStageDescriptor['role'],
        stage: step.stage as DynamicLessonStageDescriptor['stage'],
        objective: step.objective,
        progressionRule: step.progressionRule,
        completionMode: step.completionMode,
      })))} `,
      '',
      'Planning output:',
      JSON.stringify(planning, null, 2),
      '',
      'Vocabulary output:',
      JSON.stringify(vocabulary, null, 2),
      '',
      'Validation issues:',
      JSON.stringify(validationIssues, null, 2),
      '',
      'Spaced review artifact:',
      JSON.stringify(spacedReview, null, 2),
      '',
      'Lesson JSON to score:',
      JSON.stringify(lesson, null, 2),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          total: 0,
          grade: 'ship',
          breakdown: {
            beginnerClarity: 0,
            teachingBeforeTesting: 0,
            markingRobustness: 0,
            alignmentToLO: 0,
            questionQuality: 0,
          },
          issues: [
            {
              id: 'ISSUE-1',
              category: 'beginnerClarity',
              jsonPointers: ['/steps/1/retrievalText'],
              excerpt: 'string',
              problem: 'string',
              whyItMatters: 'string',
              alignmentGap: 'GENERAL PEDAGOGY',
              suggestion: 'string',
            },
          ],
          phaseFeedback: [
            {
              phaseKey: 'step-1',
              phaseTitle: 'Teach/Check 1',
              stage: 'teach_check',
              status: 'mixed',
              strengths: ['string'],
              issues: ['string'],
              suggestedFixes: ['string'],
            },
          ],
          summary: 'string',
        },
        null,
        2
      ),
      '',
      'Important scoring reminders:',
      '- The runtime can only give reliable feedback when tasks are concretely markable.',
      '- Multi-part apply tasks often look good pedagogically but still deserve deductions if the marking guidance is too coarse.',
      '- Perfect lessons should be exceptional, not normal.',
    ].join('\n'),
  };
}

export function buildDynamicFixPlanPrompt(
  lesson: DynamicGuidedV2Lesson,
  score: DynamicLessonGenerationScore
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 11 Suggest Fixes for a 2365 dynamic lesson generator.',
      'Turn the score issues into a concrete repair plan.',
      'Each fix must target real lesson fields and explain what to change.',
      'Output strict JSON only.',
    ].join('\n'),
    user: [
      'Lesson JSON:',
      JSON.stringify(lesson, null, 2),
      '',
      'Score report:',
      JSON.stringify(score, null, 2),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          summary: 'string',
          fixes: [
            {
              priority: 'high',
              category: 'beginnerClarity',
              targetPointers: ['/steps/1/retrievalText'],
              problem: 'string',
              repairInstruction: 'string',
            },
          ],
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- Use the jsonPointers from the score where possible.',
      '- Do not invent fake fields.',
      '- Focus on the smallest set of changes that could materially improve the score.',
    ].join('\n'),
  };
}

export function buildDynamicRefinePrompt(
  input: DynamicLessonGenerationInput,
  lesson: DynamicGuidedV2Lesson,
  score: DynamicLessonGenerationScore,
  fixPlan: DynamicFixPlan,
  stagePlan: DynamicLessonStageDescriptor[]
): { system: string; user: string } {
  return {
    system: [
      'You are Phase 12 Refine for a 2365 dynamic lesson generator.',
      'Rewrite the complete dynamic lesson JSON to fix the issues while preserving the exact step structure.',
      'Do not add, remove, or reorder steps.',
      'Do not change step ids, stages, roles, progression rules, nextStepId values, or completionMode values.',
      'This is an improvement-stage rewrite. Do not regress any scoring domain from the baseline score.',
      'Beginner clarity and teaching-before-testing are priority domains.',
      'Output strict JSON only.',
    ].join('\n'),
    user: [
      baseContext(input, stagePlan),
      '',
      'Original lesson JSON:',
      JSON.stringify(lesson, null, 2),
      '',
      'Baseline score:',
      JSON.stringify(score, null, 2),
      '',
      'Fix plan:',
      JSON.stringify(fixPlan, null, 2),
      '',
      'Critical rules:',
      '- Preserve step order and step ids exactly.',
      '- Keep exactly 3 basic questions in every teach_check step.',
      '- Preserve progression metadata exactly.',
      '- If a question asks for a specific technical term, ensure the exact term appears first in answerGuidance.',
      '- Improve content quality without adding placeholder filler.',
      '- Return the complete refined lesson JSON only.',
    ].join('\n'),
  };
}
