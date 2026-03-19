export function buildDynamicModulePlannerPrompt(input: {
  moduleTitle: string;
  subject: string;
  audience: string;
  requestedLessonCount: number;
  sourceText: string;
}): string {
  return [
    'You are designing lesson blueprints for the City & Guilds 2365 electrical course.',
    'Return strict JSON only.',
    'Stay grounded in the supplied source text.',
    'Do not invent biology or unrelated curriculum content.',
    'Produce a dynamic lesson plan suitable for the dynamic-guided-v2 runtime.',
    'Each blueprint must be self-contained and scoped to one lesson.',
    'Each blueprint must include 1 to 3 teach/check sections, then worked example, guided practice, practice, and integrative close.',
    'Guided practice must mirror the reasoning pattern used in the worked example.',
    'Keep focusText concise, factual, and scoped only to that lesson.',
    '',
    `Module title: ${input.moduleTitle}`,
    `Subject: ${input.subject}`,
    `Audience: ${input.audience}`,
    `Requested lesson count: ${input.requestedLessonCount}`,
    '',
    'Return JSON in this exact shape:',
    JSON.stringify(
      {
        moduleTitle: input.moduleTitle,
        blueprints: [
          {
            lessonCode: '203-4A',
            title: '203-4A - Earthing Systems and ADS Components',
            unit: 'Unit 203',
            topic: 'Earthing systems and ADS components',
            objectiveSummary: 'Explain the main earthing arrangements and how ADS components make a fault safe.',
            focusText: 'Scoped grounded text for this lesson only.',
            sourceRefs: ['section 1'],
            teachChecks: [
              {
                title: 'Teach/Check 1',
                objective: 'Teach the first core concept.',
              },
              {
                title: 'Teach/Check 2',
                objective: 'Teach the second core concept.',
              },
            ],
            workedExampleObjective: 'Walk through one worked example that uses the same reasoning pattern needed later.',
            guidedPracticeObjective: 'Set one supported task that mirrors the worked example.',
            practiceObjective: 'Set one more independent application task.',
            integrativeObjective: 'Ask the learner to pull the lesson together in one explanation.',
          },
        ],
      },
      null,
      2
    ),
    '',
    'Grounded source text:',
    input.sourceText,
  ].join('\n');
}
