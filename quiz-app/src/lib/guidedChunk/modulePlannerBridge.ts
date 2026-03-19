import { getGcseBiologyPhase1LessonProfile } from '@/data/v2/gcse/biology/phase1LessonProfiles';
import { getCg2365GuidedLessonProfile } from '@/data/guided-chunk/2365/lessonProfiles';
import { createGuidedLessonDraftVersion } from '@/lib/guidedChunk/versionStore';
import { saveGeneratedGuidedChunkFrame } from '@/lib/guidedChunk/generatedFrameStore';
import { generateGuidedChunkFrame } from '@/lib/generation/guidedChunk';
import { getPlannerRunSummary } from '@/lib/module_planner';
import { validateCoverageTargets, validateM4BlueprintArtifact, validateMinimalLessonPlan, validateUnitStructure } from '@/lib/module_planner/schemas';
import { getChunkById } from '@/lib/module_planner/syllabus';
import type { CoverageTargets, LessonBlueprint, MinimalLessonPlan, UnitStructure } from '@/lib/module_planner/types';

function normalizeWhitespace(text: string): string {
  return String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function inferGuidedCurriculum(value: string | null | undefined): 'cg2365' | 'gcse-science-biology' | 'gcse-science-physics' {
  if (value === 'gcse-science-biology') return 'gcse-science-biology';
  if (value === 'gcse-science-physics') return 'gcse-science-physics';
  return 'cg2365';
}

function buildProfileNotes(curriculum: 'cg2365' | 'gcse-science-biology' | 'gcse-science-physics', lessonCode: string): string | undefined {
  if (curriculum === 'cg2365') {
    return getCg2365GuidedLessonProfile(lessonCode)?.additionalInstructions;
  }
  if (curriculum === 'gcse-science-biology') {
    const profile = getGcseBiologyPhase1LessonProfile(lessonCode);
    if (!profile) return undefined;
    return [profile.additionalInstructions, `Must-have topics: ${profile.mustHaveTopics}.`].join('\n');
  }
  return undefined;
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
    coverageLo,
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
      text: text.length > 1200 ? `${text.slice(0, 1200).trim()}…` : text,
    });
  }
  return excerpts;
}

function buildGuidedSourceText(input: {
  unitTitle: string;
  blueprint: LessonBlueprint;
  loTitle?: string;
  targetedCoverage: Array<{ acKey: string; acText: string; range: string[] | string | null }>;
  plannedLessonTitle?: string | null;
  plannedWhySplit?: string | null;
  chunkExcerpts: Array<{ id: string; text: string }>;
}): string {
  const { unitTitle, blueprint, loTitle, targetedCoverage, plannedLessonTitle, plannedWhySplit, chunkExcerpts } = input;
  const fallbackAnchors = unique([
    blueprint.topic,
    ...blueprint.mustHaveTopics,
    ...targetedCoverage.map((item) => item.acText),
  ]);

  const sections: string[] = [
    `Unit: ${blueprint.unit}${unitTitle ? ` - ${unitTitle}` : ''}`,
    `Learning outcome: ${blueprint.lo}${loTitle ? ` - ${loTitle}` : ''}`,
    `Lesson: ${blueprint.id} - ${plannedLessonTitle ?? blueprint.topic}`,
    `Topic focus: ${blueprint.topic}`,
    blueprint.prerequisites.length > 0 ? `Prerequisites: ${blueprint.prerequisites.join('; ')}` : '',
    blueprint.mustHaveTopics.length > 0 ? `Must-have topics: ${blueprint.mustHaveTopics.join('; ')}` : '',
    fallbackAnchors.length > 0
      ? ['Guided fallback anchors:', ...fallbackAnchors.map((item) => `- ${item}`)].join('\n')
      : '',
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

export async function generateGuidedLessonFromModuleBlueprint(input: {
  runId: string;
  blueprintId: string;
  createdBy?: string | null;
}) {
  const summary = await getPlannerRunSummary(input.runId);
  const curriculum = inferGuidedCurriculum(summary.run.curriculum);
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
  const sourceText = buildGuidedSourceText({
    unitTitle: m1.unitTitle,
    blueprint,
    loTitle: loEntry?.title,
    targetedCoverage,
    plannedLessonTitle: plannedLesson?.title ?? null,
    plannedWhySplit: plannedLesson?.whySplit ?? null,
    chunkExcerpts,
  });

  const result = await generateGuidedChunkFrame({
    lessonCode: blueprint.id,
    title: plannedLesson?.title ?? blueprint.topic,
    unit: blueprint.unit,
    topic: blueprint.topic,
    sourceText,
    sourceRefs: [
      `module_run:${input.runId}`,
      `blueprint:${blueprint.id}`,
      ...chunkExcerpts.map((item) => `syllabus_chunk:${item.id}`),
    ],
    targetAudience: summary.run.constraints_json?.audience ?? 'beginner',
    curriculum,
    lessonProfileNotes: buildProfileNotes(curriculum, blueprint.id),
  });

  await saveGeneratedGuidedChunkFrame(result.frame, {
    curriculum,
    qualityScore: result.score?.total ?? null,
    grade: result.score?.grade ?? null,
  });

  const version = await createGuidedLessonDraftVersion({
    frame: result.frame,
    curriculum,
    qualityScore: result.score?.total ?? null,
    grade: result.score?.grade ?? null,
    report: result.score ?? null,
    validation: result.validation
      ? { passed: result.validation.passed, issues: result.validation.issues }
      : null,
    createdBy: input.createdBy ?? null,
    source: 'ai',
  });

  return {
    ...result,
    version,
    sourceText,
    blueprint,
  };
}
