import { getPlannerRunSummary } from '@/lib/module_planner';
import { getChunkById } from '@/lib/module_planner/syllabus';
import {
  validateCoverageTargets,
  validateM4BlueprintArtifact,
  validateMinimalLessonPlan,
  validateUnitStructure,
} from '@/lib/module_planner/schemas';
import type {
  CoverageTargets,
  LessonBlueprint,
  MinimalLessonPlan,
  UnitStructure,
} from '@/lib/module_planner/types';
import type { DynamicLessonGenerationInput, DynamicLessonStageDescriptor } from '@/lib/dynamicGuidedV2/generation/types';
import { generateAndStoreDynamicLessonDraft } from '@/lib/dynamicGuidedV2/generation/service';

function normalizeWhitespace(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function artifactForStage<T>(
  artifacts: Array<{ stage: string; artifact_json: unknown }>,
  stage: string,
  validator: (value: unknown) => value is T
): T {
  const artifact = artifacts.find((item) => item.stage === stage)?.artifact_json;
  if (!validator(artifact)) {
    throw new Error(`Module planner artifact ${stage} is missing or invalid.`);
  }
  return artifact;
}

function findBlueprint(m4: { blueprints: LessonBlueprint[] }, blueprintId: string): LessonBlueprint {
  const blueprint = m4.blueprints.find((item) => item.id === blueprintId);
  if (!blueprint) {
    throw new Error(`Blueprint not found: ${blueprintId}`);
  }
  return blueprint;
}

function getPlannerContext(input: {
  m1: UnitStructure;
  m2: CoverageTargets;
  m3: MinimalLessonPlan;
  blueprint: LessonBlueprint;
}) {
  const { m1, m2, m3, blueprint } = input;
  const loEntry = m1.los.find((item) => item.lo === blueprint.lo);
  const coverageLo = m2.los.find((item) => item.lo === blueprint.lo);
  const plannedLo = m3.los.find((item) => item.lo === blueprint.lo);
  const plannedLesson =
    plannedLo?.lessons.find((lesson) => blueprint.id.endsWith(`-${lesson.topicCode}`)) ??
    plannedLo?.lessons.find((lesson) => lesson.title === blueprint.topic) ??
    null;
  const targetedCoverage =
    coverageLo?.coverageTargets.filter((target) => blueprint.acAnchors.includes(target.acKey)) ?? [];

  return {
    loEntry,
    targetedCoverage,
    plannedLesson,
  };
}

async function buildGroundedChunkExcerpts(
  syllabusVersionId: string,
  chunkIds: string[]
): Promise<Array<{ id: string; text: string }>> {
  const excerpts: Array<{ id: string; text: string }> = [];
  for (const chunkId of unique(chunkIds).slice(0, 8)) {
    const chunk = await getChunkById(syllabusVersionId, chunkId);
    if (!chunk) continue;
    const text = normalizeWhitespace(chunk.text);
    if (!text) continue;
    excerpts.push({
      id: chunkId,
      text: text.length > 1200 ? `${text.slice(0, 1200).trim()}...` : text,
    });
  }
  return excerpts;
}

function buildDynamicSourceText(input: {
  unitTitle: string;
  blueprint: LessonBlueprint;
  loTitle?: string;
  targetedCoverage: Array<{ acKey: string; acText: string; range: string[] | string | null }>;
  plannedLessonTitle?: string | null;
  plannedWhySplit?: string | null;
  chunkExcerpts: Array<{ id: string; text: string }>;
}): string {
  const { unitTitle, blueprint, loTitle, targetedCoverage, plannedLessonTitle, plannedWhySplit, chunkExcerpts } = input;
  const sections: string[] = [
    `Unit: ${blueprint.unit}${unitTitle ? ` - ${unitTitle}` : ''}`,
    `Learning outcome: ${blueprint.lo}${loTitle ? ` - ${loTitle}` : ''}`,
    `Lesson: ${blueprint.id} - ${plannedLessonTitle ?? blueprint.topic}`,
    `Topic focus: ${blueprint.topic}`,
    blueprint.prerequisites.length > 0 ? `Prerequisites: ${blueprint.prerequisites.join('; ')}` : '',
    blueprint.mustHaveTopics.length > 0 ? `Must-have topics: ${blueprint.mustHaveTopics.join('; ')}` : '',
    targetedCoverage.length > 0
      ? ['Assessment criteria in scope:', ...targetedCoverage.map((item) => `- ${item.acKey}: ${item.acText}`)].join('\n')
      : '',
    plannedWhySplit ? `Lesson split rationale: ${plannedWhySplit}` : '',
    blueprint.masterBlueprint?.scopeControl?.inScope?.length
      ? `In-scope teaching anchors: ${blueprint.masterBlueprint.scopeControl.inScope.join('; ')}`
      : '',
    blueprint.masterBlueprint?.scopeControl?.outOfScope?.length
      ? `Out-of-scope topics: ${blueprint.masterBlueprint.scopeControl.outOfScope.map((item) => item.topic).join('; ')}`
      : '',
    blueprint.masterBlueprint?.misconceptions?.length
      ? [
          'Known misconceptions to handle:',
          ...blueprint.masterBlueprint.misconceptions.map(
            (item) => `- Wrong belief: ${item.wrongBelief} | Correct belief: ${item.correctBelief}`
          ),
        ].join('\n')
      : '',
    chunkExcerpts.length > 0
      ? [
          'Grounded source excerpts:',
          ...chunkExcerpts.map((item, index) => `Excerpt ${index + 1} (${item.id}): ${item.text}`),
        ].join('\n\n')
      : '',
  ].filter(Boolean);

  return sections.join('\n\n');
}

function buildStagePlanFromBlueprint(lessonCode: string, blueprint: LessonBlueprint): DynamicLessonStageDescriptor[] {
  const entries = Array.isArray(blueprint.masterBlueprint?.blockPlan?.entries)
    ? [...(blueprint.masterBlueprint?.blockPlan?.entries ?? [])].sort((a, b) => a.order - b.order)
    : [];
  const outcomesEntry = entries.find((entry) => entry.type === 'outcomes');
  const explanationEntries = entries.filter((entry) => entry.type === 'explanation');
  const workedExampleEntry = entries.find((entry) => entry.type === 'worked-example');
  const guidedPracticeEntry = entries.find((entry) => entry.type === 'guided-practice');
  const practiceEntries = entries.filter((entry) => entry.type === 'practice' && entry.mode !== 'integrative');
  const integrativeEntry = entries.find((entry) => entry.type === 'practice' && entry.mode === 'integrative');

  const stagePlan: DynamicLessonStageDescriptor[] = [
    {
      key: 'intro',
      title: 'Intro',
      role: 'outcomes',
      stage: 'intro',
      objective: outcomesEntry?.label || 'Orient the learner to the lesson.',
      progressionRule: 'auto',
      completionMode: 'continue',
    },
    ...explanationEntries.map((entry, index) => ({
      key: `teach-check-${index + 1}`,
      title: entry.label || `Teach/Check ${index + 1}`,
      role: 'explanation' as const,
      stage: 'teach_check' as const,
      objective: entry.label || `Teach/Check ${index + 1}`,
      progressionRule: 'feedback_deeper' as const,
      completionMode: 'respond' as const,
    })),
    {
      key: 'worked-example-1',
      title: 'Worked Example',
      role: 'worked_example',
      stage: 'worked_example',
      objective: workedExampleEntry?.label || 'Show one worked example.',
      progressionRule: 'worked_example_feedback',
      completionMode: 'respond',
    },
    {
      key: 'guided-practice-1',
      title: 'Guided Practice',
      role: 'guided_practice',
      stage: 'guided_practice',
      objective: guidedPracticeEntry?.label || workedExampleEntry?.label || 'Guide the learner through a supported task.',
      progressionRule: 'auto',
      completionMode: 'respond',
    },
    {
      key: 'practice-1',
      title: 'Practice',
      role: 'practice',
      stage: 'practice',
      objective: practiceEntries[0]?.label || 'Check independent understanding.',
      progressionRule: 'auto',
      completionMode: 'respond',
    },
    {
      key: 'integrative-1',
      title: 'Integrative Close',
      role: 'integrative',
      stage: 'integrative',
      objective: integrativeEntry?.label || practiceEntries[1]?.label || 'Pull the lesson together.',
      progressionRule: 'integrative_feedback',
      completionMode: 'respond',
    },
  ];

  return stagePlan.map((step) => ({
    ...step,
    key: `${lessonCode.toLowerCase()}-${step.key}`,
  }));
}

export async function generateDynamicLessonFromModuleBlueprint(input: {
  runId: string;
  blueprintId: string;
  createdBy?: string | null;
}) {
  const summary = await getPlannerRunSummary(input.runId);
  const m1 = artifactForStage(summary.artifacts, 'M1', validateUnitStructure);
  const m2 = artifactForStage(summary.artifacts, 'M2', validateCoverageTargets);
  const m3 = artifactForStage(summary.artifacts, 'M3', validateMinimalLessonPlan);
  const m4 = artifactForStage(summary.artifacts, 'M4', validateM4BlueprintArtifact);
  const blueprint = findBlueprint(m4, input.blueprintId);
  const { loEntry, targetedCoverage, plannedLesson } = getPlannerContext({
    m1,
    m2,
    m3,
    blueprint,
  });

  const chunkIds = unique([
    ...(loEntry?.sourceChunkIds ?? []),
    ...targetedCoverage.flatMap((item) => item.sourceChunkIds),
  ]);
  const chunkExcerpts = await buildGroundedChunkExcerpts(summary.run.syllabus_version_id, chunkIds);
  const sourceText = buildDynamicSourceText({
    unitTitle: m1.unitTitle,
    blueprint,
    loTitle: loEntry?.title,
    targetedCoverage,
    plannedLessonTitle: plannedLesson?.title ?? null,
    plannedWhySplit: plannedLesson?.whySplit ?? null,
    chunkExcerpts,
  });

  const stagePlan = buildStagePlanFromBlueprint(blueprint.id, blueprint);

  const generationInput: DynamicLessonGenerationInput = {
    lessonCode: blueprint.id,
    title: plannedLesson?.title ?? blueprint.topic,
    unit: blueprint.unit,
    topic: blueprint.topic,
    subject: summary.run.curriculum === 'gcse-science-biology' ? 'GCSE Biology' : 'C&G 2365',
    audience: summary.run.constraints_json?.audience ?? blueprint.level ?? 'beginner',
    tonePrompt:
      summary.run.curriculum === 'gcse-science-biology'
        ? 'Teach like a strong science tutor: clear, concise, accurate, and beginner-friendly.'
        : 'Teach like a strong electrical tutor: practical, direct, technically precise, concise, and natural.',
    sourceText,
    sourceRefs: [
      `module_run:${input.runId}`,
      `blueprint:${blueprint.id}`,
      ...chunkExcerpts.map((item) => `syllabus_chunk:${item.id}`),
    ],
    stagePlan,
    sourceContext: 'dynamic_module_planner_blueprint',
  };

  const result = await generateAndStoreDynamicLessonDraft({
    generationInput,
    createdBy: input.createdBy ?? null,
    sourceContext: 'dynamic_module_planner_blueprint',
  });

  return {
    ...result,
    sourceText,
    blueprint,
  };
}
