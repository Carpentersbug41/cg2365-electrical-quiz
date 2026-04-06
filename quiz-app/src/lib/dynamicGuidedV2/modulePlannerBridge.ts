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

function titleCase(text: string): string {
  return normalizeWhitespace(text)
    .split(' ')
    .map((word) => (word ? `${word[0].toUpperCase()}${word.slice(1)}` : word))
    .join(' ');
}

function slugLike(text: string): string {
  return normalizeWhitespace(text).toLowerCase();
}

function pushChunk(
  chunks: Array<{ title: string; objective: string }>,
  title: string,
  objective: string
) {
  const normalizedTitle = normalizeWhitespace(title);
  const normalizedObjective = normalizeWhitespace(objective);
  if (!normalizedTitle || !normalizedObjective) return;
  if (chunks.some((item) => slugLike(item.title) === slugLike(normalizedTitle))) return;
  chunks.push({ title: normalizedTitle, objective: normalizedObjective });
}

function deriveChunkCandidates(blueprint: LessonBlueprint): Array<{ title: string; objective: string }> {
  const chunks: Array<{ title: string; objective: string }> = [];
  const topic = slugLike(blueprint.topic);
  const mustHave = blueprint.mustHaveTopics.map((item) => normalizeWhitespace(item)).filter(Boolean);
  const inScope = blueprint.masterBlueprint?.scopeControl?.inScope?.map((item) => normalizeWhitespace(item)).filter(Boolean) ?? [];

  if (topic.includes('electricity generation and transmission')) {
    pushChunk(chunks, 'Large-Scale Generation Methods', 'Identify the main large-scale generation methods used to supply the grid.');
    pushChunk(chunks, 'Renewable and Non-Renewable Sources', 'Distinguish renewable generation sources from non-renewable generation sources.');
    pushChunk(chunks, 'Micro-Generation and Local Supply', 'Explain what micro-generation is and how it differs from large-scale generation.');
    pushChunk(chunks, 'Photovoltaic and Local Generation', 'Identify photovoltaic generation as a local low-carbon generation method.');
    pushChunk(chunks, 'Why Transmission Uses High Voltage', 'Explain why electricity is transmitted at very high voltage over long distances.');
    pushChunk(chunks, 'UK Transmission Voltage Levels', 'Identify the three standard UK transmission voltages: 400 kV, 275 kV, and 132 kV.');
    pushChunk(chunks, 'Step-Up and Step-Down Transformers', 'Explain why transformers are used to raise and lower voltage through the supply system.');
    pushChunk(chunks, 'From Transmission to Distribution', 'Explain how electricity moves from transmission into lower-voltage local distribution.');
    return chunks;
  }

  if (topic.includes('earthing systems and ads components')) {
    pushChunk(chunks, 'TT Earthing Systems', 'Identify TT systems and explain the role of the local earth electrode.');
    pushChunk(chunks, 'TN-S and TN-C-S Systems', 'Distinguish between TN-S and TN-C-S arrangements using the code letters and supply path.');
    pushChunk(chunks, 'The Meaning of TT TN-S and TN-C-S', 'Explain what the code letters in earthing system names describe.');
    pushChunk(chunks, 'CPC and Earthing Conductor', 'Explain the difference between a CPC and an Earthing Conductor in ADS.');
    pushChunk(chunks, 'Main Earthing Terminal and Fault Path', 'Identify the MET and explain its place in the fault path.');
    pushChunk(chunks, 'Bonding and Protective Devices', 'Identify the bonding and protective-device parts that complete ADS.');
    pushChunk(chunks, 'Why TT Usually Needs an RCD', 'Explain why TT systems usually need RCD protection rather than relying only on overcurrent devices.');
    pushChunk(chunks, 'How ADS Becomes Safe', 'Explain how earthing, bonding, CPCs, and protective devices work together in ADS.');
    return chunks;
  }

  if (topic.includes('circuit types and wiring systems')) {
    pushChunk(chunks, 'Ring and Radial Circuits', 'Distinguish ring final circuits from radial circuits and explain how each operates.');
    pushChunk(chunks, 'Lighting and Socket Circuits', 'Identify typical uses of lighting circuits and socket circuits.');
    pushChunk(chunks, 'Control, Data, and Alarm Circuits', 'Identify the purpose of control, data, and alarm circuits.');
    pushChunk(chunks, 'Wiring Systems by Environment', 'Select suitable wiring systems for domestic, commercial, industrial, and hazardous environments.');
    pushChunk(chunks, 'Conduit Trunking and Tray', 'Distinguish common containment and support systems such as conduit, trunking, and cable tray.');
    pushChunk(chunks, 'Protection, Fire, and Mechanical Risk', 'Explain why systems like MICC, SWA, conduit, and trunking are chosen for specific risks.');
    pushChunk(chunks, 'Hazardous and High-Risk Locations', 'Identify why special wiring systems are used in hazardous or high-risk locations.');
    pushChunk(chunks, 'Choosing the Right Wiring System', 'Explain how the environment and risk affect wiring system selection.');
    return chunks;
  }

  const sourcePhrases = unique([
    ...mustHave,
    ...inScope,
    ...blueprint.acAnchors.map((item) => normalizeWhitespace(item)),
  ]);

  sourcePhrases.forEach((phrase) => {
    if (/;\s*/.test(phrase)) {
      phrase
        .split(/\s*;\s*/)
        .map((part) => normalizeWhitespace(part))
        .filter(Boolean)
        .forEach((part) => pushChunk(chunks, titleCase(part), `Teach the core idea: ${part}.`));
      return;
    }
    pushChunk(chunks, titleCase(phrase), `Teach the core idea: ${phrase}.`);
  });

  return chunks;
}

function buildTeachChecksFromBlueprint(blueprint: LessonBlueprint): Array<{ title: string; objective: string }> {
  const entries = Array.isArray(blueprint.masterBlueprint?.blockPlan?.entries)
    ? [...(blueprint.masterBlueprint?.blockPlan?.entries ?? [])].sort((a, b) => a.order - b.order)
    : [];
  const explanationEntries = entries.filter((entry) => entry.type === 'explanation');
  const chunks: Array<{ title: string; objective: string }> = [];

  explanationEntries.forEach((entry, index) => {
    pushChunk(
      chunks,
      entry.label || `Teach/Check ${index + 1}`,
      entry.label || `Teach concept ${index + 1} in ${blueprint.topic}.`
    );
  });

  deriveChunkCandidates(blueprint).forEach((item) => pushChunk(chunks, item.title, item.objective));

  if (chunks.length < 8) {
    const fallbackTitles = [
      `Core Concept 1: ${blueprint.topic}`,
      `Core Concept 2: ${blueprint.topic}`,
      `Core Concept 3: ${blueprint.topic}`,
      `Core Concept 4: ${blueprint.topic}`,
      `Core Concept 5: ${blueprint.topic}`,
      `Core Concept 6: ${blueprint.topic}`,
      `Core Concept 7: ${blueprint.topic}`,
      `Core Concept 8: ${blueprint.topic}`,
    ];
    fallbackTitles.forEach((title, index) =>
      pushChunk(chunks, title, `Teach the next distinct core idea needed before application in ${blueprint.topic} (${index + 1}).`)
    );
  }

  return chunks.slice(0, 8);
}

function buildStagePlanFromBlueprint(lessonCode: string, blueprint: LessonBlueprint): DynamicLessonStageDescriptor[] {
  const entries = Array.isArray(blueprint.masterBlueprint?.blockPlan?.entries)
    ? [...(blueprint.masterBlueprint?.blockPlan?.entries ?? [])].sort((a, b) => a.order - b.order)
    : [];
  const outcomesEntry = entries.find((entry) => entry.type === 'outcomes');
  const workedExampleEntry = entries.find((entry) => entry.type === 'worked-example');
  const guidedPracticeEntry = entries.find((entry) => entry.type === 'guided-practice');
  const practiceEntries = entries.filter((entry) => entry.type === 'practice' && entry.mode !== 'integrative');
  const integrativeEntry = entries.find((entry) => entry.type === 'practice' && entry.mode === 'integrative');
  const teachChecks = buildTeachChecksFromBlueprint(blueprint);

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
    ...teachChecks.map((entry, index) => ({
      key: `teach-check-${index + 1}`,
      title: entry.title || `Teach/Check ${index + 1}`,
      role: 'explanation' as const,
      stage: 'teach_check' as const,
      objective: entry.objective || `Teach/Check ${index + 1}`,
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
