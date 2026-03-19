import type { GuidedChunkFrame, GuidedChunkQuestion } from '@/lib/guidedChunk/types';
import { generateGuidedChunkJson } from '@/lib/guidedChunk/llm';
import { getGuidedChunkCurriculumProfile } from '@/lib/generation/guidedChunk/profiles';
import { buildGuidedChunkScorePrompt } from '@/lib/generation/guidedChunk/prompts';
import type { GuidedChunkGenerationInput, GuidedChunkGenerationIssue, GuidedChunkGenerationScore } from '@/lib/generation/guidedChunk/types';

function countWordBandScore(wordCount: number): number {
  if (wordCount >= 80 && wordCount <= 150) return 1;
  if (wordCount >= 60 && wordCount <= 170) return 0.75;
  if (wordCount >= 40 && wordCount <= 190) return 0.45;
  return 0.15;
}

function hasExpectedConcepts(question: GuidedChunkQuestion): boolean {
  return Array.isArray(question.expectedConcepts) && question.expectedConcepts.length > 0;
}

function gradeFromTotal(total: number): GuidedChunkGenerationScore['grade'] {
  if (total >= 85) return 'ship';
  if (total >= 72) return 'strong';
  if (total >= 58) return 'usable';
  return 'rework';
}

function detectGenericFallbackFrame(frame: GuidedChunkFrame): GuidedChunkGenerationIssue[] {
  const issues: GuidedChunkGenerationIssue[] = [];
  const chunks = frame.loSequence.flatMap((lo) => lo.chunkPlan);
  const serialized = JSON.stringify(frame).toLowerCase();
  const lowerTitle = frame.title.toLowerCase();

  if (
    /key idea in this lesson/.test(serialized) ||
    /this helps explain how the cell, organism, or process works in a real biological context/.test(serialized) ||
    /a common error here is not secure yet/.test(serialized) ||
    /this chunk focuses on unit:/.test(serialized)
  ) {
    issues.push({
      category: 'beginnerClarity',
      problem: 'The frame contains generic fallback teaching language rather than real learner-facing subject content.',
      suggestion: 'Reject this frame and regenerate from grounded LO/chunk content before allowing scoring or publication.',
    });
  }

  if (chunks.some((chunk) => /^what is the role of unit:/i.test(chunk.initialRecallQuestions[0]?.prompt ?? ''))) {
    issues.push({
      category: 'questionQuality',
      problem: 'The frame contains generic fallback recall questions built from the lesson title rather than the taught concept.',
      suggestion: 'Rebuild recall questions from actual chunk content and block publication if title-driven fallback prompts remain.',
    });
  }

  if (frame.loSequence.length === 1 && chunks.length === 1 && frame.loSequence[0]?.successCriteria?.[0]?.toLowerCase().includes(lowerTitle)) {
    issues.push({
      category: 'alignmentToLO',
      problem: 'The lesson collapsed into a single generic LO/chunk instead of a real multi-step guided lesson.',
      suggestion: 'Treat single generic LO/chunk output as generator failure unless the lesson is explicitly designed as a one-chunk micro-lesson.',
    });
  }

  return issues;
}

function hasCg2365PoorDelivery(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    /\bterre\b|\bs[ée]par[ée]\b|\bcombin[ée]\b/.test(lower) ||
    lower.startsWith('earthing systems are defined by how') ||
    lower.includes('denoted as') ||
    lower.includes('french etymology') ||
    lower.includes('this chunk focuses on') ||
    /(?:^|[.?!]\s+)[a-z0-9][a-z0-9\-&/ ]{2,45}\.\s*[a-z0-9][a-z0-9\-&/ ]{2,45}\.$/.test(lower)
  );
}

function hasCg2365PoorRecallPrompt(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return (
    lower.includes('what is the key fact in this chunk about') ||
    lower.includes('what is one correct fact about') ||
    lower.includes('what else is important to know about')
  );
}

function isWeakQuestionPrompt(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return (
    hasCg2365PoorRecallPrompt(prompt) ||
    lower.startsWith('what is one correct fact about ') ||
    lower.startsWith('what else is important to know about ') ||
    lower.startsWith('what is the key fact in this chunk about ') ||
    lower.startsWith('state one correct fact about ')
  );
}

function scoreGuidedChunkFrameHeuristic(
  frame: GuidedChunkFrame,
  input: Pick<GuidedChunkGenerationInput, 'curriculum' | 'lessonProfileNotes'>
): GuidedChunkGenerationScore {
  const issues: GuidedChunkGenerationIssue[] = [];
  const profile = getGuidedChunkCurriculumProfile(input.curriculum);
  const chunks = frame.loSequence.flatMap((lo) => lo.chunkPlan);
  const mcqs = frame.loSequence.flatMap((lo) => lo.loTestMcq.mcqs);
  const shortAnswers = frame.loSequence.flatMap((lo) => lo.loTestShortAnswer.shortAnswers);

  const beginnerClarityRaw =
    chunks.reduce((sum, chunk) => {
      let value = countWordBandScore(chunk.teachingWordCount);
      if (!chunk.vocabPack.length) value -= 0.1;
      if (chunk.repairTemplates.length === 0) value -= 0.2;
      if (/this step links|you need to identify|the focus here is/i.test(chunk.teachingCore)) value -= 0.2;
      if (profile.key === 'cg2365' && hasCg2365PoorDelivery(chunk.teachingCore)) value -= 0.35;
      if (profile.key === 'cg2365' && chunk.chunkIndex === 0 && chunk.teachingWordCount > 125) value -= 0.2;
      return sum + Math.max(0, value);
    }, 0) / Math.max(1, chunks.length);
  const beginnerClarity = Math.round(beginnerClarityRaw * 30);

  const teachingBeforeTestingRaw =
    chunks.reduce((sum, chunk) => {
      let value = 1;
      if (chunk.initialRecallQuestions.length !== 3) value -= 0.35;
      if (!chunk.candidateDeeperQuestion) value -= 0.2;
      if (chunk.initialRecallQuestions.some((question) => !hasExpectedConcepts(question))) value -= 0.2;
      if (chunk.initialRecallQuestions.some((question) => hasCg2365PoorRecallPrompt(question.prompt))) value -= 0.35;
      return sum + Math.max(0, value);
    }, 0) / Math.max(1, chunks.length);
  const teachingBeforeTesting = Math.round(teachingBeforeTestingRaw * 25);

  const markingRobustnessRaw =
    (
      chunks.filter(
        (chunk) =>
          chunk.initialRecallQuestions.every((question) => hasExpectedConcepts(question)) &&
          (!!chunk.candidateDeeperQuestion && hasExpectedConcepts(chunk.candidateDeeperQuestion)) &&
          chunk.repairTemplates.length > 0
      ).length +
      shortAnswers.filter((question) => Array.isArray(question.expectedConcepts) && question.expectedConcepts.length > 0).length /
        Math.max(1, frame.loSequence.length)
    ) /
    (chunks.length + 1);
  const markingRobustness = Math.max(0, Math.min(20, Math.round(markingRobustnessRaw * 20)));

  let alignmentToLoBase = 0.8;
  if (profile.key === 'gcse-biology') {
    const biologySignals = ['process', 'structure', 'cell', 'enzyme', 'osmosis', 'diffusion', 'variation', 'gene'];
    const content = JSON.stringify(frame).toLowerCase();
    const hits = biologySignals.filter((signal) => content.includes(signal)).length;
    alignmentToLoBase = Math.min(1, 0.45 + hits / biologySignals.length);
  }
  if (detectGenericFallbackFrame(frame).length > 0) {
    alignmentToLoBase = Math.min(alignmentToLoBase, 0.15);
  }
  const alignmentToLO = Math.round(alignmentToLoBase * 15);

  const questionQualityRaw =
    chunks.reduce((sum, chunk) => {
      let value = 1;
      if (chunk.initialRecallQuestions.some((question) => isWeakQuestionPrompt(question.prompt))) value -= 0.35;
      if (chunk.candidateDeeperQuestion && isWeakQuestionPrompt(chunk.candidateDeeperQuestion.prompt)) value -= 0.2;
      return sum + Math.max(0, value);
    }, 0) / Math.max(1, chunks.length);
  const questionQuality = Math.max(0, Math.min(10, Math.round(questionQualityRaw * 10)));

  for (const chunk of chunks) {
    if (chunk.teachingWordCount < 60 || chunk.teachingWordCount > 170) {
      issues.push({
        category: 'beginnerClarity',
        problem: `${chunk.chunkId} has a weak teaching length band (${chunk.teachingWordCount} words).`,
        suggestion: 'Keep guided chunks near 80-150 words so teaching stays compact but meaningful.',
      });
    }
    if (chunk.initialRecallQuestions.length !== 3) {
      issues.push({
        category: 'teachingBeforeTesting',
        problem: `${chunk.chunkId} does not have exactly 3 initial recall questions.`,
        suggestion: 'Keep the runtime rhythm stable with three short recall checks per chunk.',
      });
    }
    if (!chunk.candidateDeeperQuestion) {
      issues.push({
        category: 'teachingBeforeTesting',
        problem: `${chunk.chunkId} has no deeper question.`,
        suggestion: 'Add one deeper question so each chunk can end with a small transfer or explanation check.',
      });
    }
    if (chunk.initialRecallQuestions.some((question) => !hasExpectedConcepts(question))) {
      issues.push({
        category: 'markingRobustness',
        problem: `${chunk.chunkId} has recall questions without expected concepts.`,
        suggestion: 'Every question needs expected concept coverage for evaluation and repair.',
      });
    }
    if (chunk.misconceptionCodes.length === 0 || chunk.repairTemplates.length === 0) {
      issues.push({
        category: 'markingRobustness',
        problem: `${chunk.chunkId} is missing misconception coverage or repair templates.`,
        suggestion: 'Add at least one misconception code and matching repair template for every chunk.',
      });
    }
    if (profile.key === 'cg2365' && hasCg2365PoorDelivery(chunk.teachingCore)) {
      issues.push({
        category: 'beginnerClarity',
        problem: `${chunk.chunkId} reads like note-style electrical commentary rather than a clean tutor explanation.`,
        suggestion: 'Remove etymology or mnemonic commentary from the main teaching text and rewrite the chunk in direct spoken electrical language.',
      });
    }
    if (profile.key === 'cg2365' && chunk.initialRecallQuestions.some((question) => hasCg2365PoorRecallPrompt(question.prompt))) {
      issues.push({
        category: 'questionQuality',
        problem: `${chunk.chunkId} still uses generic placeholder recall wording rather than a concrete electrical check.`,
        suggestion: 'Rewrite the recall prompts so they ask directly about the earthing, ADS, loop-path, or conductor distinction taught in the chunk.',
      });
    }
    if (profile.key === 'cg2365' && chunk.chunkIndex === 0 && chunk.teachingWordCount > 125) {
      issues.push({
        category: 'beginnerClarity',
        problem: `${chunk.chunkId} is too dense for the first visible tutor turn.`,
        suggestion: 'Trim the opening chunk to roughly 90-120 words and keep the first distinction easy to scan before the quick check.',
      });
    }
  }

  if (mcqs.length === 0 || shortAnswers.length === 0) {
    issues.push({
      category: 'markingRobustness',
      problem: 'The LO-end assessment is incomplete.',
      suggestion: 'Provide both MCQs and short answers for each LO-end check.',
    });
  }

  issues.push(...detectGenericFallbackFrame(frame));

  const fallbackPenalty = detectGenericFallbackFrame(frame).length > 0 ? 40 : 0;
  const total = Math.max(0, beginnerClarity + teachingBeforeTesting + markingRobustness + alignmentToLO + questionQuality - fallbackPenalty);

  return {
    total,
    grade: gradeFromTotal(total),
    breakdown: {
      beginnerClarity,
      teachingBeforeTesting,
      markingRobustness,
      alignmentToLO,
      questionQuality,
    },
    issues: issues.slice(0, 12),
    summary:
      total >= 72
        ? `The guided frame is usable for ${profile.label}, but it still needs strong learner-facing teaching, clear staging, and concrete questioning to ship well.`
        : `The guided frame is not yet strong enough for ${profile.label}; improve clarity, staging, and question quality before shipping.`,
    scoringMode: 'heuristic',
    refinementNotes: [],
  };
}

type LlmScoreOverlay = {
  breakdown?: Partial<GuidedChunkGenerationScore['breakdown']>;
  summary?: string;
  issues?: GuidedChunkGenerationIssue[];
  refinementNotes?: string[];
};

function clampSectionScore(value: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(max, Math.round(value)));
}

function blendSectionScore(heuristic: number, overlay: number | undefined, max: number): number {
  if (!Number.isFinite(overlay)) {
    return heuristic;
  }
  const target = clampSectionScore(overlay, max);
  const delta = target - heuristic;
  const bounded = heuristic + Math.max(-3, Math.min(3, delta));
  return clampSectionScore(bounded, max);
}

export async function scoreGuidedChunkFrame(
  frame: GuidedChunkFrame,
  input: Pick<GuidedChunkGenerationInput, 'curriculum' | 'lessonProfileNotes' | 'sourceText'>
): Promise<GuidedChunkGenerationScore> {
  const heuristic = scoreGuidedChunkFrameHeuristic(frame, input);
  const fallbackIssues = detectGenericFallbackFrame(frame);
  if (fallbackIssues.length > 0) {
    return {
      ...heuristic,
      issues: [...fallbackIssues, ...heuristic.issues].slice(0, 12),
      total: Math.min(heuristic.total, 45),
      grade: 'rework',
      summary: 'The frame has collapsed into generic fallback content and must be regenerated before it can be reviewed or published.',
      scoringMode: 'heuristic',
    };
  }

  const overlay = await generateGuidedChunkJson<LlmScoreOverlay>(
    'You are an expert pedagogical quality assessor for guided AI tutoring lesson frames. Return JSON only.',
    buildGuidedChunkScorePrompt(input, frame),
    'generation_score_overlay'
  );

  if (!overlay?.breakdown) {
    return heuristic;
  }

  const issues = (overlay.issues?.length ? overlay.issues : heuristic.issues).slice(0, 12);
  const issuePenalty = Math.min(20, issues.length * 3);

  const breakdown = {
    beginnerClarity: blendSectionScore(heuristic.breakdown.beginnerClarity, overlay.breakdown.beginnerClarity, 30),
    teachingBeforeTesting: blendSectionScore(heuristic.breakdown.teachingBeforeTesting, overlay.breakdown.teachingBeforeTesting, 25),
    markingRobustness: blendSectionScore(heuristic.breakdown.markingRobustness, overlay.breakdown.markingRobustness, 20),
    alignmentToLO: blendSectionScore(heuristic.breakdown.alignmentToLO, overlay.breakdown.alignmentToLO, 15),
    questionQuality: blendSectionScore(heuristic.breakdown.questionQuality, overlay.breakdown.questionQuality, 10),
  };

  const rawTotal =
    breakdown.beginnerClarity +
    breakdown.teachingBeforeTesting +
    breakdown.markingRobustness +
    breakdown.alignmentToLO +
    breakdown.questionQuality;
  const total = Math.max(0, rawTotal - issuePenalty);

  return {
    total,
    grade: gradeFromTotal(total),
    breakdown,
    issues,
    summary: overlay.summary?.trim() || heuristic.summary,
    scoringMode: 'heuristic_plus_llm',
    refinementNotes: overlay.refinementNotes?.filter(Boolean).slice(0, 8) ?? [],
  };
}
