import type {
  DynamicFixPlan,
  DynamicLessonGenerationInput,
  DynamicLessonStageDescriptor,
  DynamicPlanningPhaseOutput,
  DynamicSpacedReviewGroundingPacket,
  DynamicSpacedReviewPhaseOutput,
  DynamicVocabularyPhaseOutput,
} from '@/lib/dynamicGuidedV2/generation/types';
import type { DynamicGuidedV2Lesson } from '@/lib/dynamicGuidedV2/types';
import type { DynamicLessonGenerationScore, DynamicLessonGenerationValidation } from '@/lib/dynamicGuidedV2/versionStore';

function buildPhaseSystemPrompt(
  input: DynamicLessonGenerationInput,
  config: {
    phaseName: string;
    role: string;
    actions: string[];
    rules: string[];
  }
): string {
  return [
    'You are an expert in the City & Guilds 2365 Level 2 Electrical Installation course.',
    `You are writing ${config.phaseName.toLowerCase()} content for ${input.audience}.`,
    `Tone: ${input.tonePrompt}.`,
    '',
    `Your job in this phase: ${config.role}`,
    '',
    'Always follow these steps:',
    '1. Read the locked prior phase history and the current phase request.',
    '2. Complete only the current phase.',
    '3. Stay grounded in the locked lesson source.',
    '4. Return strict JSON only.',
    ...config.actions.map((action, index) => `${index + 5}. ${action}`),
    '',
    'Rules:',
    '- Do not rewrite earlier locked phases.',
    '- Do not output placeholder text.',
    '- Do not output commentary outside the JSON.',
    ...config.rules.map((rule) => `- ${rule}`),
  ].join('\n');
}

function describeStagePlan(stagePlan: DynamicLessonStageDescriptor[]): string {
  return stagePlan
    .map(
      (step, index) =>
        `${index + 1}. ${step.title} | role=${step.role} | stage=${step.stage} | completionMode=${step.completionMode} | progression=${step.progressionRule ?? 'none'} | objective=${step.objective}`
    )
    .join('\n');
}

function normalizeForPrompt(text: string | undefined | null): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function clampPromptText(text: string | undefined | null, maxChars: number): string {
  const normalized = normalizeForPrompt(text);
  if (normalized.length <= maxChars) return normalized;
  const truncated = normalized.slice(0, Math.max(0, maxChars - 3)).trim();
  return `${truncated}...`;
}

function selectRepairPromptEvidence(lines: string[] | undefined): string[] {
  return (lines ?? [])
    .map((line) => clampPromptText(line, 140))
    .filter(Boolean)
    .slice(0, 3);
}

function selectRepairPromptTerms(terms: string[] | undefined): string[] {
  return (terms ?? [])
    .map((term) => clampPromptText(term, 32))
    .filter(Boolean)
    .slice(0, 5);
}

function selectGroundingSourceLines(input: DynamicLessonGenerationInput, maxLines = 12, maxChars = 1600): string[] {
  const preferredText = normalizeForPrompt(input.sourceContext) || normalizeForPrompt(input.sourceText);
  const rawLines = preferredText
    .split(/\r?\n+/)
    .map((line) => normalizeForPrompt(line.replace(/^[�\-��]\s*/, '')))
    .filter(Boolean);

  const selected: string[] = [];
  let charCount = 0;
  for (const line of rawLines) {
    if (selected.length >= maxLines) break;
    if (charCount + line.length > maxChars && selected.length > 0) break;
    selected.push(line);
    charCount += line.length;
  }
  return selected;
}

function buildLessonReference(input: DynamicLessonGenerationInput): string {
  return [
    `Lesson code: ${input.lessonCode}`,
    `Lesson title: ${input.title}`,
    `Unit: ${input.unit}`,
    `Topic: ${input.topic}`,
    `Subject: ${input.subject}`,
  ].join('\n');
}

function buildFullLessonContext(input: DynamicLessonGenerationInput, stagePlan: DynamicLessonStageDescriptor[]): string {
  return [
    buildLessonReference(input),
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

function buildPlanningContext(input: DynamicLessonGenerationInput, stagePlan: DynamicLessonStageDescriptor[]): string {
  return [
    buildLessonReference(input),
    '',
    'Stage plan:',
    describeStagePlan(stagePlan),
    '',
    'Locked grounding packet:',
    ...selectGroundingSourceLines(input).map((line, index) => `${index + 1}. ${line}`),
  ].join('\n');
}

function buildPhaseUserContext(input: DynamicLessonGenerationInput): string {
  return [
    buildLessonReference(input),
    '',
    'Use the locked grounding packet and locked prior phase history already in the conversation.',
    'Return only the current phase JSON.',
  ].join('\n');
}

function buildSpacedReviewUserContext(
  input: DynamicLessonGenerationInput,
  grounding: DynamicSpacedReviewGroundingPacket
): string {
  return [
    buildLessonReference(input),
    '',
    `Spaced review source mode: ${grounding.sourceMode}`,
    'Use the spaced review grounding packet and locked prior phase history already in the conversation.',
    'Return only the current phase JSON.',
    '',
    'Spaced review grounding packet:',
    JSON.stringify(grounding, null, 2),
  ].join('\n');
}

export function buildGenerationGroundingPacket(
  input: DynamicLessonGenerationInput,
  stagePlan: DynamicLessonStageDescriptor[]
): string {
  return [
    'Locked lesson grounding packet.',
    buildLessonReference(input),
    '',
    'Stage plan:',
    describeStagePlan(stagePlan),
    '',
    'Relevant source lines:',
    ...selectGroundingSourceLines(input).map((line, index) => `${index + 1}. ${line}`),
    '',
    'Rules:',
    '- Treat this grounding packet as immutable source context for phases 1-8.',
    '- Do not restate it in later phase outputs.',
    '- Stay inside this lesson scope only.',
  ].join('\n');
}

export function buildDynamicPlanningPrompt(
  input: DynamicLessonGenerationInput,
  stagePlan: DynamicLessonStageDescriptor[]
): { system: string; user: string } {
  return {
    system: buildPhaseSystemPrompt(input, {
      phaseName: 'Phase 1 Planning',
      role: 'plan the lesson structure before any teaching text or learner tasks are written.',
      actions: [
        'Lock the lesson to the requested topic and stage plan.',
        'Choose one clear main idea for each teach/check section.',
        'Plan a clean chunk-first lesson with teaching, recall, and deeper questioning.',
      ],
      rules: [
        'Keep the plan grounded in the supplied source only.',
        'Do not invent extra syllabus coverage.',
        'Do not write final teaching prose or final learner questions in this phase.',
      ],
    }),
    user: [
      buildPlanningContext(input, stagePlan),
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
          inScope: ['string'],
          outOfScope: ['string'],
          constraints: ['string'],
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- teachCheckCount must match the number of teach_check stages.',
      '- Each teach check must focus on one main idea.',
      '- Each teach check must include at least one misconception.',
      '- inScope and outOfScope must both be concrete.',
      '- Plan for chunk teaching first: explanation, 3 recall questions, then 1 deeper question.',
    ].join('\n'),
  };
}

export function buildDynamicVocabularyPrompt(input: DynamicLessonGenerationInput): { system: string; user: string } {
  return {
    system: buildPhaseSystemPrompt(input, {
      phaseName: 'Phase 2 Vocabulary',
      role: 'extract only the technical terms that the learner must know for this lesson.',
      actions: [
        'Select lesson-specific technical terms only.',
        'Give each term a plain definition and a concrete anchor.',
      ],
      rules: [
        'Use beginner-safe wording without losing technical correctness.',
        'Do not turn this into a broad glossary.',
      ],
    }),
    user: [
      buildPhaseUserContext(input),
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
      '- anchorPhrases should be phrases that later phases can teach directly.',
    ].join('\n'),
  };
}

export function buildDynamicExplanationPrompt(input: DynamicLessonGenerationInput): { system: string; user: string } {
  return {
    system: buildPhaseSystemPrompt(input, {
      phaseName: 'Phase 3 Explanation',
      role: 'write the teaching text the learner reads before the teach/check questions.',
      actions: [
        'Teach one clear main idea per section.',
        'Write factual explanation lines that later questions can be answered from.',
      ],
      rules: [
        'Do not write questions in this phase.',
        'Do not use placeholder filler or prompt-like wording.',
      ],
    }),
    user: [
      buildPhaseUserContext(input),
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
      '- Write one explanation for each teach/check section.',
      '- Give 3-6 short teaching points for each section.',
      '- Use the exact terms needed for this chunk only.',
      '- Make sure the later questions can be answered from this explanation.',
      '- Do not use placeholder titles, objectives, or teaching text.',
    ].join('\n'),
  };
}

export function buildDynamicBasicChecksPrompt(
  input: DynamicLessonGenerationInput
): { system: string; user: string } {
  return {
    system: buildPhaseSystemPrompt(input, {
      phaseName: 'Phase 4 Basic Checks',
      role: 'write the three short direct questions for each teach/check section.',
      actions: [
        'Choose a question form for each basic check.',
        'Write the final learner question from that form.',
      ],
      rules: [
        'Do not write the deeper reasoning question in this phase.',
        'Do not write answers in this phase.',
      ],
    }),
    user: [
      buildPhaseUserContext(input),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          teachChecks: [
            {
              title: 'Teach/Check 1',
              basicQuestions: [
                {
                  questionForm: 'exact_term',
                  questionText: 'string',
                },
                {
                  questionForm: 'definition_to_name',
                  questionText: 'string',
                },
                {
                  questionForm: 'unit',
                  questionText: 'string',
                },
              ],
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
      '- Each basicQuestions item must include questionForm and questionText.',
      '- Each question must test one taught idea only.',
      '- Name the exact concept, quantity, status, system, or method being checked.',
      '- Use only words and ideas already taught in the lesson.',
    ].join('\n'),
  };
}

export function buildDynamicDeeperChecksPrompt(
  input: DynamicLessonGenerationInput
): { system: string; user: string } {
  return {
    system: buildPhaseSystemPrompt(input, {
      phaseName: 'Phase 4.1 Deeper Checks',
      role: 'write one deeper reasoning question for each teach/check section.',
      actions: [
        'Use the locked explanation and locked basic checks already in history.',
        'Write one deeper reasoning question for each section.',
      ],
      rules: [
        'Do not rewrite the basic questions from Phase 4.',
        'Make the deeper question ask why, how, or what must be true.',
      ],
    }),
    user: [
      buildPhaseUserContext(input),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          teachChecks: [
            {
              title: 'Teach/Check 1',
              deeperQuestionText: 'string',
              deeperSourceTeachingPointIds: ['tp1'],
              hint: 'string',
            },
          ],
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- Write one deeper question for each teach/check section.',
      '- Every teach/check section must return a non-empty deeperQuestionText.',
      '- The deeper question must join taught points from that section.',
      '- Use only words and ideas already taught in the lesson.',
      '- Do not repeat or rewrite the basic questions.',
      '- Make each deeper question distinct from the deeper questions in other chunks.',
    ].join('\n'),
  };
}

export function buildDynamicWorkedExamplePrompt(
  input: DynamicLessonGenerationInput
): { system: string; user: string } {
  return {
    system: buildPhaseSystemPrompt(input, {
      phaseName: 'Phase 5 Worked Example',
      role: 'write one worked example that models the exact kind of task the learner will do next.',
      actions: [
        'Write one practical worked example only.',
        'Show the method clearly with steps, a result, and a takeaway.',
      ],
      rules: [
        'Do not turn this into guided practice.',
        'Keep it practical and beginner-readable.',
      ],
    }),
    user: [
      buildPhaseUserContext(input),
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
  input: DynamicLessonGenerationInput
): { system: string; user: string } {
  return {
    system: buildPhaseSystemPrompt(input, {
      phaseName: 'Phase 6 Practice',
      role: 'write guided practice and independent practice as direct learner tasks.',
      actions: [
        'Write one guided practice task and one practice task.',
        'Keep guided practice close to the worked example and make practice more independent.',
        'Write direct subject questions, not teaching commentary.',
      ],
      rules: [
        'Do not write meta-instructions or placeholders.',
        'Do not write answers in this phase.',
      ],
    }),
    user: [
      buildPhaseUserContext(input),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          guidedPractice: {
            title: 'Guided Practice',
            objective: 'string',
            retrievalTextLines: ['string'],
            questionText: 'string',
            hint: 'string',
          },
          practice: {
            title: 'Practice',
            objective: 'string',
            retrievalTextLines: ['string'],
            questionText: 'string',
            hint: 'string',
          },
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- Guided practice must follow the worked example.',
      '- Practice must be more independent than guided practice.',
      '- Write one clear learner question for each task.',
      '- Name the exact concept, instrument, status, system, method, value, or quantity the learner must answer.',
      '- Ask the learner to identify, state, explain, or calculate something explicit.',
      '- Use a concrete scenario and never use meta wording like \"single best technical answer\".',
      '- Do not use placeholders or write answers in this phase.',
    ].join('\n'),
  };
}

export function buildDynamicIntegrationPrompt(
  input: DynamicLessonGenerationInput
): { system: string; user: string } {
  return {
    system: buildPhaseSystemPrompt(input, {
      phaseName: 'Phase 7 Integration',
      role: 'write the final integrative task as one clear synthesis question.',
      actions: [
        'Write one integrative task only.',
        'Make the learner pull the lesson ideas together in one applied response.',
      ],
      rules: [
        'Do not repeat a simple recall question.',
        'Do not write answers in this phase.',
      ],
    }),
    user: [
      buildPhaseUserContext(input),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          integrative: {
            title: 'Integrative Close',
            objective: 'string',
            retrievalTextLines: ['string'],
            questionText: 'string',
            hint: 'string',
          },
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- Write one clear integrative task only.',
      '- Use a new applied scenario, not the worked-example scenario again.',
      '- Name the relationship, process, or result the learner must explain or apply.',
      '- Do not bundle several tasks into one response.',
      '- Stay inside the ideas already taught in the lesson.',
      '- Do not write answers in this phase.',
    ].join('\n'),
  };
}

export function buildDynamicSpacedReviewPrompt(
  input: DynamicLessonGenerationInput,
  grounding: DynamicSpacedReviewGroundingPacket
): { system: string; user: string } {
  return {
    system: buildPhaseSystemPrompt(input, {
      phaseName: 'Phase 8 Spaced Review',
      role: 'write short spaced review questions from earlier knowledge in the same 2365 unit.',
      actions: [
        'Step 1: output the source LO coverage you are using from the grounding packet.',
        'Step 2: write 8 spaced review questions from that coverage.',
      ],
      rules: [
        'Use the same unit only.',
        'Spread the 8 questions as evenly as possible across the source LO groups.',
      ],
    }),
    user: [
      buildSpacedReviewUserContext(input, grounding),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          title: 'Spaced Review',
          objective: 'string',
          retrievalTextLines: ['string'],
          coveragePlan: [
            {
              sourceLo: 'LO1',
              lessonCodes: ['203-1A'],
              anchorSummary: 'string',
            },
          ],
          questions: [
            {
              sourceLo: 'LO1',
              questionText: 'string',
              hint: 'string',
            },
          ],
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- Write exactly 8 spaced review questions.',
      '- Use the same unit only and stay inside the grounding packet.',
      '- Spread the questions evenly across the source LO groups when possible.',
      '- Keep the questions short, direct, and recall-focused.',
      '- Do not write answers in this phase.',
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
      'You are an expert in the City & Guilds 2365 Level 2 Electrical Installation course who scores lesson quality rigorously.',
      'Score the lesson quality using the weighted rubric below.',
      'Score what the lesson actually asks the learner to do.',
      'Judge the lesson against the generation contract for each stage, not against hidden stricter style rules.',
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
      '- For question-only dynamic lessons, treat awkward or indirect wording as a soft deduction when the task is still single-focus, objective-aligned, and clear enough to use.',
      '- For question-only dynamic lessons, only treat apply-task wording as a major defect when the task is generic, placeholder-like, bundled, or unclear about what the learner must do.',
      '- Penalize bundled or multi-part tasks when the answer guidance does not map clearly to each required part.',
      '- Penalize bundled tasks most strongly when one response field mixes different output types, multiple scenarios, or several labeled requirements that would be hard to mark independently.',
      '- Do not over-penalize simple same-type recall lists if the answer guidance maps cleanly; focus on genuinely hard-to-mark mixed-output tasks.',
      '- If a task bundles Scenario A and Scenario B with different labels or answer types into one answer box, prioritise that bundled-task defect above secondary wording issues.',
      '- Penalize open-ended wording that is hard to mark reliably from learner phrasing.',
      '- Penalize any drift into out-of-scope content, even if the lesson is otherwise strong.',
      '- Apply answer-guidance penalties only when the lesson actually contains answer guidance for that step.',
      '- For teach_check steps, treat basicQuestions as the authoritative question structure. Do not penalize the derived combined questionText field if the underlying basicQuestions are sound.',
      '- If the candidate differs by one exact semantic patch only, judge that patch locally against the affected field and chunk before broadening the deduction to other rubric domains.',
      '- Do not reduce teachingBeforeTesting for an exact factual correction unless the patch genuinely makes the chunk thinner, less grounded, or less teachable.',
      '- Exact term, concept, and anchor-fact fixes should mainly affect alignmentToLO and, where relevant, beginnerClarity.',
      '- phaseFeedback must cover every lesson step exactly once, in lesson order.',
      '- Every phaseFeedback item must include at least one concrete strength or one concrete issue.',
      '- If total is below 95, issues must include at least 1 concrete residual defect that explains the lost points.',
      '- If total is below 90, issues must include at least 2 concrete residual defects.',
      '- Every residual defect should include a jsonPointer when one can be named from the lesson JSON.',
      '- Every issue must include a concrete solution that tells the repair system the smallest useful field-level fix.',
      '- Do not return a low score with an empty or purely generic issues list.',
      '- summary must be 2-3 sentences maximum.',
    ].join('\n'),
    user: [
      `Lesson context:\n${buildFullLessonContext(input, lesson.steps.map((step) => ({
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
              solution: 'string',
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
      '- The runtime still needs concrete learner tasks, but question-only dynamic lessons do not need stored answer keys.',
      '- Penalize what would confuse or misdirect the learner, not just wording that is not stylistically ideal.',
      '- Multi-part apply tasks should be penalized mainly when the learner task itself is bundled or unclear.',
      '- A sub-95 score must be justified by concrete issues; do not leave issues empty.',
      '- A sub-90 score must explain at least five remaining defects or improvement points.',
      '- solution must be more concrete than the diagnosis: say exactly what field-level rewrite or replacement is needed.',
      '- Perfect lessons should be exceptional, not normal.',
    ].join('\n'),
  };
}

export function buildDynamicFixPlanPrompt(
  lesson: DynamicGuidedV2Lesson,
  score: DynamicLessonGenerationScore,
  validation: DynamicLessonGenerationValidation
): { system: string; user: string } {
  return {
    system: [
      'You are an expert in the City & Guilds 2365 Level 2 Electrical Installation course who writes precise lesson repair plans.',
      'Turn the score issues into a concrete repair plan.',
      'Each fix must target one real lesson field and explain the smallest useful change.',
      'Output strict JSON only.',
    ].join('\n'),
    user: [
      'Lesson JSON:',
      JSON.stringify(lesson, null, 2),
      '',
      'Score report:',
      JSON.stringify(score, null, 2),
      '',
      'Validation issues:',
      JSON.stringify(validation.issues, null, 2),
      '',
      'Return JSON in this shape:',
      JSON.stringify(
        {
          summary: 'string',
          fixes: [
            {
              fieldType: 'basic_question',
              repairClass: 'exact_replace',
              repairMode: 'exact_replace',
              phaseKey: 'step-1',
              priority: 'high',
              severity: 'critical',
              category: 'beginnerClarity',
              targetPointer: '/steps/1/retrievalText',
              problem: 'string',
              currentValue: 'string',
              whyCurrentValueFails: 'string',
              mustPreserve: 'string',
              requiredFix: 'string',
              allowedTerms: ['string'],
              forbiddenTerms: ['string'],
              sourceEvidence: ['string'],
              replacementTarget: 'string',
              badSpan: 'string',
            },
          ],
        },
        null,
        2
      ),
      '',
      'Critical rules:',
      '- Use one targetPointer per fix.',
      '- Use the jsonPointers from the score where possible.',
      '- Do not invent fake fields.',
      '- Use exact_replace only when the problem provides a clear badSpan and replacementTarget.',
      '- Use basic_question_rewrite for recall/apply wording problems in a basic question field.',
      '- Use deeper_question_rewrite for weak, duplicate, meta, or generic deeper questions.',
      '- Use teaching_field_rewrite for anchor facts, key ideas, key terms, retrieval text, hints, or objectives.',
      '- Focus on the smallest set of changes that could materially improve the score.',
    ].join('\n'),
  };
}

function buildRepairPromptBody(
  _input: DynamicLessonGenerationInput,
  _lesson: DynamicGuidedV2Lesson,
  _score: DynamicLessonGenerationScore,
  _fixPlan: DynamicFixPlan,
  fix: DynamicFixPlan['fixes'][number],
  _stagePlan: DynamicLessonStageDescriptor[],
  role: string,
  rules: string[],
  previousRejection?: { code?: string | null; detail?: string | null }
): { system: string; user: string } {
  const evidenceLines = selectRepairPromptEvidence(fix.sourceEvidence);
  const allowedTerms = selectRepairPromptTerms(fix.allowedTerms);
  const forbiddenTerms = selectRepairPromptTerms(fix.forbiddenTerms);
  const currentValue = clampPromptText(fix.currentValue, 220);
  const requiredFix = clampPromptText(fix.requiredFix, 180);
  const mustPreserve = clampPromptText(fix.mustPreserve, 140);
  const previousRejectionLine =
    previousRejection?.code || previousRejection?.detail
      ? clampPromptText(
          `${normalizeForPrompt(previousRejection?.code)}${previousRejection?.detail ? `: ${normalizeForPrompt(previousRejection.detail)}` : ''}`,
          160
        )
      : '';
  return {
    system: [
      'Repair one lesson field.',
      role,
      'Change only the listed jsonPointer.',
      'Return only the replacement text for that field.',
      'Do not return JSON, labels, or commentary.',
    ].join('\n'),
    user: [
      `Target: ${fix.targetPointer}`,
      `Current: ${JSON.stringify(currentValue)}`,
      `Fix: ${requiredFix}`,
      `Preserve: ${mustPreserve}`,
      ...evidenceLines.map((line, index) => `Evidence ${index + 1}: ${line}`),
      ...(allowedTerms.length > 0 ? [`Allowed: ${allowedTerms.join(', ')}`] : []),
      ...(forbiddenTerms.length > 0 ? [`Avoid: ${forbiddenTerms.join(', ')}`] : []),
      ...(previousRejectionLine ? [`Previous rejection: ${previousRejectionLine}`] : []),
      'Return only the replacement text for the target field.',
      '',
      'Critical rules:',
      `- The only field you are rewriting is ${fix.targetPointer}.`,
      '- Return the replacement text only.',
      '- Do not wrap the answer in JSON, quotes, bullets, or labels.',
      '- Solve the stated defect directly.',
      '- Preserve the stated meaning.',
      ...rules.map((rule) => `- ${rule}`),
    ].join('\n'),
  };
}

export function buildDynamicRepairPrompt(
  input: DynamicLessonGenerationInput,
  lesson: DynamicGuidedV2Lesson,
  score: DynamicLessonGenerationScore,
  fixPlan: DynamicFixPlan,
  fix: DynamicFixPlan['fixes'][number],
  stagePlan: DynamicLessonStageDescriptor[],
  mode: 'specific' | 'general_fallback' = 'specific',
  previousRejection?: { code?: string | null; detail?: string | null }
): { system: string; user: string } {
  if (mode === 'general_fallback') {
    return buildRepairPromptBody(
      input,
      lesson,
      score,
      fixPlan,
      fix,
      stagePlan,
      'Repair one failed lesson field using a general source-grounded fallback when the specific repair prompt did not produce a usable patch.',
      [
        'Rewrite only the targeted field.',
        'Keep the patch minimal and preserve the meaning of the chunk.',
        'Use the source evidence and the chunk objective as the authority.',
        'Fix the exact problem named in the repair target, even if it is an edge case not covered by a more specific prompt.',
        'Do not rewrite neighbouring fields or lesson structure.',
      ],
      previousRejection
    );
  }

  switch (fix.repairClass) {
    case 'exact_replace':
      return buildRepairPromptBody(input, lesson, score, fixPlan, fix, stagePlan, 'Repair one field by replacing the wrong term or concept with the correct source-grounded replacement.', [
        'Replace the wrong span only.',
        'Keep the rest of the field unchanged unless a minimal wording cleanup is needed for grammar.',
        `Remove the bad span ${JSON.stringify(fix.badSpan ?? '')} from the final field.`,
        `Use the replacement target ${JSON.stringify(fix.replacementTarget ?? '')} in the final field.`,
        'Do not broaden, explain, or re-author the lesson around the change.',
      ]);
    case 'basic_question_rewrite':
      return buildRepairPromptBody(input, lesson, score, fixPlan, fix, stagePlan, 'Repair one short basic question so it asks one thing only and names the exact concept.', [
        'Write one short question only.',
        'Make it single-focus and direct.',
        'Name the exact concept, term, system, instrument, method, status, or quantity.',
        'Do not turn it into a multi-part or open-ended task.',
      ]);
    case 'deeper_question_rewrite':
      return buildRepairPromptBody(input, lesson, score, fixPlan, fix, stagePlan, 'Repair one deeper question so it asks for reasoning tied to the chunk objective.', [
        'Ask one why, how, or what-must-be-true question.',
        'Keep it tied to the current chunk objective.',
        'Do not make it vague or generic.',
        'Do not ask for several different outputs.',
      ]);
    case 'teaching_field_rewrite':
    default:
      return buildRepairPromptBody(input, lesson, score, fixPlan, fix, stagePlan, 'Repair one weak teaching text field without changing the lesson structure.', [
        'Replace placeholder or thin text with concrete lesson wording.',
        'Keep the field grounded in the lesson topic and objective.',
        'Do not write a question unless the target field is itself a question field.',
        'Use one replacement value only.',
      ]);
  }
}

