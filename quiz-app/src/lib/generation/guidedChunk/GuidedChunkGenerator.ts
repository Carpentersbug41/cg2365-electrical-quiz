import { generateGuidedChunkJson } from '@/lib/guidedChunk/llm';
import type { GuidedChunkFrame, GuidedChunkLo, GuidedChunkQuestion, GuidedChunkRepairTemplate, GuidedChunkMcqQuestion, GuidedChunkVocabItem } from '@/lib/guidedChunk/types';
import {
  buildGuidedChunkChunkPrompt,
  buildGuidedChunkLoAssessmentPrompt,
  buildGuidedChunkLoScaffoldPrompt,
  buildGuidedChunkPlanPrompt,
  buildGuidedChunkRefinePrompt,
} from '@/lib/generation/guidedChunk/prompts';
import { scoreGuidedChunkFrame } from '@/lib/generation/guidedChunk/score';
import type {
  GuidedChunkGenerationInput,
  GuidedChunkGenerationMemory,
  GuidedChunkGenerationPhaseArtifact,
  GuidedChunkGenerationResult,
  GuidedChunkGenerationValidation,
  GuidedChunkLoScaffold,
  GuidedChunkScaffoldChunk,
} from '@/lib/generation/guidedChunk/types';

type PlanChunk = {
  chunkId?: string;
  learningGoal?: string;
  keyPoints?: string[];
  misconceptionCodes?: string[];
  vocab?: Array<{ term: string; definition: string }>;
};

type PlanLo = {
  loId?: string;
  loTitle?: string;
  successCriteria?: string[];
  reviewHooks?: string[];
  chunks?: PlanChunk[];
  mcqFocus?: string[];
  shortAnswerFocus?: string[];
};

type PlanShape = {
  los?: PlanLo[];
};

type ChunkDraft = Partial<{
  chunkId: string;
  learningGoal: string;
  teachingCore: string;
  vocabPack: Array<{ term: string; definition: string }>;
  initialRecallQuestions: Array<{ id?: string; prompt?: string; expectedConcepts?: string[] | string }>;
  candidateFollowUpModes: string[];
  candidateDeeperQuestion: { id?: string; prompt?: string; expectedConcepts?: string[] | string } | null;
  misconceptionCodes: string[];
  repairTemplates: Array<GuidedChunkRepairTemplate | string>;
  assetInjection: null;
  microbreakAfter: null;
}>;

type LoAssessmentDraft = Partial<{
  loTestMcq: Partial<GuidedChunkLo['loTestMcq']>;
  loTestShortAnswer: Partial<GuidedChunkLo['loTestShortAnswer']>;
}>;

function extractTopicBullets(sourceText: string): string[] {
  const bullets: string[] = [];
  const push = (value: string) => {
    const normalized = normalizeWhitespace(value)
      .replace(/^[-*]\s*/, '')
      .replace(/^#+\s*/, '')
      .replace(/^(Unit|Learning outcome|Lesson|Topic focus):\s*/i, '')
      .trim();
    if (!normalized) return;
    if (/^203\b/i.test(normalized) || /^unit:\s*\d+/i.test(normalized)) return;
    if (/^(Assessment criteria in scope|Known misconceptions to handle|Grounded source excerpts|Range|AC)$/i.test(normalized)) return;
    if (/^(Wrong belief|Correct belief|Prerequisites|Must-have topics|Lesson split rationale|In-scope teaching anchors|Out-of-scope topics):/i.test(normalized)) return;
    if (!bullets.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
      bullets.push(normalized);
    }
  };

  for (const rawLine of sourceText.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (/^Excerpt\s+\d+\s+\([^)]+\):/i.test(line)) {
      const excerptLead = line.replace(/^Excerpt\s+\d+\s+\([^)]+\):\s*/i, '');
      if (!/^##\s*LO\d+/i.test(excerptLead)) {
        push(excerptLead);
      }
      continue;
    }
    if (/^##\s*LO\d+/i.test(line) || /^\*\*(AC|Range)\*\*$/i.test(line)) continue;
    if (/^\d+\.\d+\s+/.test(line)) {
      push(line.replace(/^\d+\.\d+\s+/, ''));
      continue;
    }
    if (/^-\s+/.test(line)) {
      const [, label, values] = line.match(/^-\s*([^:]+):\s*(.+)$/) ?? [];
      if (label && values) {
        for (const value of values.split(/\s*;\s*/)) {
          push(`${label.trim()}: ${value.trim()}`);
        }
      } else {
        push(line);
      }
      continue;
    }
    if (/^Topic focus:/i.test(line)) {
      push(line);
    }
  }

  if (bullets.length > 0) return bullets;

  const [topicBlock] = sourceText.split(/\n\s*\n/);
  return topicBlock
    .split(/[;\n]+/)
    .map((item) => normalizeWhitespace(item))
    .filter((item) => item.length > 0 && !/^unit:\s*\d+/i.test(item));
}

function chunkArray<T>(values: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeWhitespace(text: string): string {
  return text
    .replace(/â€™|’/g, "'")
    .replace(/â€œ|â€|“|”/g, '"')
    .replace(/â€”|—/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text: string): string[] {
  return normalizeWhitespace(text)
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function stripMetaTeaching(text: string): string {
  const bannedStarts = [
    'focus on this idea',
    'this matters because',
    'keep the main relationship',
    'keep language',
    'before answering the checks',
    'this chunk is about',
    'link the structure or process directly',
    'this helps explain',
    'link each structure directly',
    'this idea matters because',
    'a strong answer links',
    'use gcse',
    'use a warm',
    'prefer concrete',
    'do not',
    'never write',
    'initial recall questions',
    'mcqs must',
    'repair templates must',
  ];

  const kept = splitSentences(text).filter((sentence) => {
    const lower = sentence.toLowerCase();
    if (lower.includes('chunking') || lower.includes('misconception-aware') || lower.includes('meta teaching language')) {
      return false;
    }
    return !bannedStarts.some((prefix) => lower.startsWith(prefix) || lower.includes(prefix));
  });

  return kept.join(' ').trim();
}

function removeRepeatedPhrases(text: string): string {
  let value = normalizeWhitespace(text);
  const dedupedSentences: string[] = [];
  for (const sentence of splitSentences(value)) {
    if (!dedupedSentences.some((existing) => existing.toLowerCase() === sentence.toLowerCase())) {
      dedupedSentences.push(sentence);
    }
  }
  value = dedupedSentences.join(' ');
  value = value.replace(/(This is important when explaining [^.]+\.)(?:\s+\1)+/gi, '$1');
  value = value.replace(/(Connect each named structure to what it does\.)(?:\s+\1)+/gi, '$1');
  value = value.replace(/(This chunk supports understanding of [^.]+\.)(?:\s+\1)+/gi, '$1');
  value = value.replace(/([A-Z][^.?!]+helps the cell function effectively as part of the whole system\.)(?:\s+\1)+/g, '$1');
  value = value.replace(/([A-Z][^.?!]+both help the cell carry out essential life processes\.)(?:\s+\1)+/g, '$1');
  return value;
}

function buildExpansionSentences(seedText: string): string[] {
  const sentences = splitSentences(seedText);
  const combined = sentences.join(' ').toLowerCase();
  const extras: string[] = [];

  if (combined.includes('nucleus')) {
    extras.push('Because the nucleus contains genetic material, it helps control growth, repair, and normal cell activity.');
  }
  if (combined.includes('cytoplasm')) {
    extras.push('Enzymes in the cytoplasm help the cell carry out many of the reactions needed to stay alive.');
  }
  if (combined.includes('cell membrane')) {
    extras.push('This is why the cell membrane is described as selectively permeable.');
  }
  if (combined.includes('mitochondria')) {
    extras.push('Cells that need lots of energy, such as muscle cells, often contain many mitochondria.');
  }
  if (combined.includes('ribosome')) {
    extras.push('Cells that make lots of proteins often need large numbers of ribosomes.');
  }
  if (combined.includes('chloroplast')) {
    extras.push('Chloroplasts allow plant cells to absorb light energy for photosynthesis.');
  }
  if (combined.includes('cell wall')) {
    extras.push('The cell wall supports the cell and helps it keep a more regular shape.');
  }
  if (combined.includes('vacuole')) {
    extras.push('A full vacuole can press outward on the cell wall and help keep the cell rigid.');
  }
  if (combined.includes('prokaryotic') || combined.includes('bacterial')) {
    extras.push('This makes bacterial cells simpler and usually smaller than animal or plant cells.');
  }
  if (combined.includes('plasmid')) {
    extras.push('Plasmids are separate from the main bacterial chromosome and can carry extra genes.');
  }
  return extras;
}

function expandTeachingCore(seedText: string): string {
  const sentences = splitSentences(seedText);
  const extras = buildExpansionSentences(seedText);
  const expanded = [...sentences];
  for (const extra of extras) {
    if (countWords(expanded.join(' ')) >= 85) break;
    expanded.push(extra);
  }

  return expanded.join(' ');
}

function clampTeachingCore(
  text: string
): { teachingCore: string; teachingWordCount: number } {
  const cleaned = stripMetaTeaching(text);
  const expandedText = countWords(cleaned) < 80 ? expandTeachingCore(cleaned) : cleaned;
  const words = expandedText.trim().split(/\s+/).filter(Boolean);
  const limited = removeRepeatedPhrases(words.slice(0, 150).join(' '));
  return {
    teachingCore: normalizeWhitespace(limited),
    teachingWordCount: countWords(limited),
  };
}

function extractSubjectPhrase(sentence: string): string {
  const match = normalizeWhitespace(sentence).match(/^(.{3,80}?)(?:\s+is|\s+are|\s+contains|\s+contain|\s+has|\s+have)\b/i);
  const subject = match?.[1]?.replace(/^the\s+/i, '').trim() || '';
  if (/^(it|they|these|this|those)\b/i.test(subject)) return '';
  return subject;
}

function extractFunctionPhrase(sentence: string): string {
  const match = normalizeWhitespace(sentence).match(/\b(?:is|are|contains?|has|have)\b\s+(.+)/i);
  return match?.[1]?.replace(/[.?!]+$/, '').trim() || normalizeWhitespace(sentence);
}

function buildQuestionFromSentence(questionId: string, sentence: string, fallbackPrompt: string): GuidedChunkQuestion {
  const normalizedSentence = normalizeWhitespace(sentence);
  const lower = normalizedSentence.toLowerCase();
  const subject = extractSubjectPhrase(normalizedSentence);
  const functionPhrase = extractFunctionPhrase(normalizedSentence);
  let prompt = fallbackPrompt;

  if (/\bwhere most .* reactions occur\b/i.test(normalizedSentence) && subject) {
    prompt = `Where do most chemical reactions happen in the cell?`;
  } else if (/\bcontrols what enters and leaves\b/i.test(lower) || /\bcontrols the movement of substances\b/i.test(lower)) {
    prompt = 'What does the cell membrane control?';
  } else if (/\bcontains genetic material\b/i.test(lower)) {
    prompt = 'What does the nucleus contain, and what does it control?';
  } else if (/\bsite of aerobic respiration\b/i.test(lower)) {
    prompt = 'Where does aerobic respiration happen in the cell?';
  } else if (/\bproteins are made\b/i.test(lower) || /\bprotein synthesis\b/i.test(lower)) {
    prompt = 'Where are proteins made in the cell?';
  } else if (/\bsite of photosynthesis\b/i.test(lower)) {
    prompt = 'Where does photosynthesis happen in a plant cell?';
  } else if (/\bcell sap\b/i.test(lower) || /\bhelps keep the cell rigid\b/i.test(lower)) {
    prompt = 'What is stored in the vacuole, and how does it help a plant cell?';
  } else if (/\bdo not have a nucleus\b/i.test(lower)) {
    prompt = 'What does it mean when a cell is described as prokaryotic?';
  } else if (/\bplasmids\b/i.test(lower)) {
    prompt = 'What are plasmids?';
  } else if (/\bdiffusion distance\b/i.test(lower)) {
    prompt = 'How does diffusion distance affect the rate of exchange?';
  } else if (/\bconcentration gradient\b/i.test(lower)) {
    prompt = 'What is a concentration gradient?';
  } else if (/\bpartially permeable membrane\b/i.test(lower)) {
    prompt = 'What does a partially permeable membrane allow to happen in osmosis?';
  } else if (/\bactive transport\b/i.test(lower)) {
    prompt = 'What is active transport, and how is it different from diffusion?';
  } else if (/\bgenes are sections of dna\b/i.test(lower)) {
    prompt = 'What is a gene?';
  } else if (/\bchromosomes carry genes\b/i.test(lower)) {
    prompt = 'What do chromosomes carry?';
  } else if (/\bnucleus contains chromosomes\b/i.test(lower)) {
    prompt = 'Where are chromosomes found in a eukaryotic cell?';
  } else if (/\bcontinuous variation\b/i.test(lower)) {
    prompt = 'What is continuous variation?';
  } else if (/\bdiscontinuous variation\b/i.test(lower)) {
    prompt = 'What is discontinuous variation?';
  } else if (/\bfound in both animal and plant cells\b/i.test(lower)) {
    prompt = `Which two types of cell contain ${subject ? subject.toLowerCase() : 'these organelles'}?`;
  } else if (/\bboth animal and plant cells require/i.test(lower)) {
    prompt = 'Why do both animal and plant cells need these organelles?';
  } else if (/\bgenetic material is found free in the cytoplasm\b/i.test(lower)) {
    prompt = 'Where is the genetic material found in a bacterial cell?';
  } else if (subject && functionPhrase && subject.length < 50) {
    prompt = `What is the role of ${subject.toLowerCase()}?`;
  }

  return {
    id: questionId,
    prompt,
    expectedConcepts: [normalizedSentence],
  };
}

function isGenericRecallPrompt(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return (
    lower.includes('what is the key fact in this chunk about') ||
    lower.includes('what is one correct fact about') ||
    lower.includes('main idea of this step') ||
    lower.includes('state one important point') ||
    lower.includes('what should you remember before moving on') ||
    lower.includes('in your own words')
  );
}

function isMalformedPrompt(prompt: string): boolean {
  const lower = normalizeWhitespace(prompt).toLowerCase();
  return (
    lower.length < 12 ||
    /what is the key fact in this chunk about /.test(lower) ||
    /what is one correct fact about /.test(lower) ||
    /what is the (role|function) of [^a-z]*(often|there|they|this|that)\b/.test(lower) ||
    /what else is important to know about /.test(lower) ||
    /what is the (role|function) of (diffusion distance|concentration gradient|partially permeable membrane)\b/.test(lower) ||
    /what is the (role|function) of prokaryotic\b/.test(lower) ||
    /,\s*(they|there|often)\??$/.test(lower)
  );
}

function isHeadingFragment(text: string): boolean {
  const normalized = normalizeWhitespace(text).replace(/[.?!]+$/, '');
  const lower = normalized.toLowerCase();
  if (!normalized || normalized.length > 90) return false;
  if (/\b(is|are|was|were|means|contains|contain|has|have|uses|use|provides|provide|connects|connect|carries|carry|keeps|keep|allows|allow|returns|return|operates|operate|separates|separate|shares|share|feeds|feed)\b/.test(lower)) {
    return false;
  }
  return normalized.split(/\s+/).length <= 8;
}

function buildCg2365RecallQuestions(
  chunkId: string,
  teachingCore: string,
  learningGoal: string,
  vocabPack: GuidedChunkVocabItem[]
): GuidedChunkQuestion[] {
  const lowerCore = teachingCore.toLowerCase();
  const lowerGoal = learningGoal.toLowerCase();
  const questions: GuidedChunkQuestion[] = [];

  if (/\btt\b/.test(lowerCore) && /\btn-s\b/.test(lowerCore) && /\btn-c-s\b/.test(lowerCore)) {
    questions.push({
      id: `${chunkId}-Q1`,
      prompt: 'Which three earthing system types are introduced in this chunk?',
      expectedConcepts: ['TT', 'TN-S', 'TN-C-S'],
    });
  }

  if (/\btn-s\b/.test(lowerCore) && (lowerCore.includes('separate') || lowerCore.includes('own earth path'))) {
    questions.push({
      id: `${chunkId}-Q${questions.length + 1}`,
      prompt: 'In a TN-S system, is the earth path separate from the neutral or shared with it?',
      expectedConcepts: ['The earth path is separate from the neutral in a TN-S system.'],
    });
  }

  if (/\btn-c-s\b/.test(lowerCore) && (lowerCore.includes('cutout') || lowerCore.includes('intake') || lowerCore.includes('separated'))) {
    questions.push({
      id: `${chunkId}-Q${questions.length + 1}`,
      prompt: 'At what point are earth and neutral separated in a TN-C-S system?',
      expectedConcepts: ['They are separated at the intake or cutout position of the installation.'],
    });
  }

  if (lowerGoal.includes('ads') && /protective device|fault path|disconnect/i.test(teachingCore)) {
    questions.push({
      id: `${chunkId}-Q${questions.length + 1}`,
      prompt: 'What two things does ADS need in order to clear a fault safely?',
      expectedConcepts: ['A complete fault path', 'A protective device that disconnects in time'],
    });
  }

  const fallbackQuestions = buildSpecificRecallQuestions(chunkId, teachingCore, vocabPack, learningGoal, undefined, true);
  const combined = [...questions, ...fallbackQuestions];
  const deduped: GuidedChunkQuestion[] = [];
  const seen = new Set<string>();

  for (const question of combined) {
    const key = question.prompt.toLowerCase();
    if (seen.has(key) || isGenericRecallPrompt(question.prompt) || isMalformedPrompt(question.prompt)) continue;
    seen.add(key);
    deduped.push({
      ...question,
      id: `${chunkId}-Q${deduped.length + 1}`,
    });
    if (deduped.length === 3) break;
  }

  return deduped.slice(0, 3);
}

function buildSpecificRecallQuestions(
  chunkId: string,
  teachingCore: string,
  vocabPack: GuidedChunkVocabItem[],
  learningGoal: string,
  curriculum?: GuidedChunkGenerationInput['curriculum'],
  suppressCg2365Branch = false
): GuidedChunkQuestion[] {
  if (curriculum === 'cg2365' && !suppressCg2365Branch) {
    return buildCg2365RecallQuestions(chunkId, teachingCore, learningGoal, vocabPack);
  }
  const sentences = splitSentences(teachingCore);
  const fallbackA = sentences[0] ?? learningGoal;
  const distinctSentence = (preferredIndex: number, exclude: string[]): string => {
    const candidates = [sentences[preferredIndex], ...sentences].filter(Boolean) as string[];
    return (
      candidates.find((candidate) => {
        const subject = extractSubjectPhrase(candidate).toLowerCase();
        return subject && !exclude.includes(subject);
      }) ??
      candidates.find((candidate) => !exclude.some((item) => candidate.toLowerCase().includes(item))) ??
      fallbackA
    );
  };
  const firstSubject = extractSubjectPhrase(fallbackA).toLowerCase();
  const fallbackB = distinctSentence(1, firstSubject ? [firstSubject] : []);
  const secondSubject = extractSubjectPhrase(fallbackB).toLowerCase();
  const fallbackC = distinctSentence(2, [firstSubject, secondSubject].filter(Boolean));
  const firstVocabQuestion =
    vocabPack[0]
      ? {
          id: `${chunkId}-Q1`,
          prompt: normalizeVocabQuestion(vocabPack[0].term),
          expectedConcepts: [vocabPack[0].definition],
        }
      : buildQuestionFromSentence(`${chunkId}-Q1`, fallbackA, `What is the key fact in this chunk about ${learningGoal.toLowerCase()}?`);
  const secondVocabQuestion =
    vocabPack[1]
      ? {
          id: `${chunkId}-Q2`,
          prompt: normalizeVocabQuestion(vocabPack[1].term),
          expectedConcepts: [vocabPack[1].definition],
        }
      : buildQuestionFromSentence(`${chunkId}-Q2`, fallbackB, `What is one correct fact about ${learningGoal.toLowerCase()}?`);

  const questions = [
    firstVocabQuestion,
    secondVocabQuestion,
    buildQuestionFromSentence(`${chunkId}-Q3`, fallbackC, `What else is important to know about ${learningGoal.toLowerCase()}?`),
  ];

  const seenPrompts = new Set<string>();
  return questions.map((question, index) => {
    const promptKey = question.prompt.toLowerCase();
    if (!seenPrompts.has(promptKey)) {
      seenPrompts.add(promptKey);
      return question;
    }
    const replacementSentence = distinctSentence(index + 1, Array.from(seenPrompts));
    const replacement = buildQuestionFromSentence(
      `${chunkId}-Q${index + 1}`,
      replacementSentence,
      `State one correct fact about ${learningGoal.toLowerCase()}.`
    );
    seenPrompts.add(replacement.prompt.toLowerCase());
    return replacement;
  });
}

function buildSpecificDeeperQuestion(chunkId: string, learningGoal: string, sentences: string[]): GuidedChunkQuestion {
  const normalizedGoal = learningGoal
    .toLowerCase()
    .replace(/\.$/, '')
    .replace(/^(understand|identify|explain|describe|connect|relate|using)\s+/i, '');
  const sentenceText = sentences.join(' ').toLowerCase();
  let prompt = `In one or two sentences, explain ${normalizedGoal}.`;
  if (sentenceText.includes('mitochondria')) {
    prompt = 'In one or two sentences, explain what would happen if a cell had too few mitochondria.';
  } else if (sentenceText.includes('animal and plant cells')) {
    prompt = 'In one or two sentences, explain why both animal and plant cells need these organelles.';
  } else if (sentenceText.includes('chloroplast')) {
    prompt = 'In one or two sentences, explain why chloroplasts are useful in a leaf cell but not in an animal cell.';
  } else if (sentenceText.includes('prokaryotic') || sentenceText.includes('bacterial')) {
    prompt = 'In one or two sentences, explain one important difference between a bacterial cell and an animal cell.';
  }
  return {
    id: `${chunkId}-D1`,
    prompt,
    expectedConcepts: sentences.slice(0, 3).map(normalizeWhitespace),
  };
}

function buildRepairTemplate(
  misconceptionCode: string,
  teachingCore: string,
  curriculum?: GuidedChunkGenerationInput['curriculum']
): GuidedChunkRepairTemplate {
  const primarySentence = splitSentences(teachingCore)[0] ?? 'Return to the core fact from this chunk.';
  const code = misconceptionCode.toLowerCase();

  if (curriculum === 'cg2365') {
    let safeConcept = 'mixing up conductor roles or the safety path';
    if (code.includes('bond')) {
      safeConcept = 'confusing bonding with earthing';
    } else if (code.includes('plastic')) {
      safeConcept = 'treating plastic services as if they need bonding';
    } else if (code.includes('radial') || code.includes('ring')) {
      safeConcept = 'mixing up radial and ring final circuit features';
    } else if (code.includes('ads') || code.includes('disconnect')) {
      safeConcept = 'confusing the fault path with the device that actually disconnects the supply';
    } else if (code.includes('r1') || code.includes('r2') || code.includes('ze') || code.includes('zs')) {
      safeConcept = 'mixing up conductor labels with the measured resistance or impedance values';
    } else if (code.includes('met')) {
      safeConcept = 'misunderstanding the role of the main earthing terminal';
    } else if (code.includes('line') || code.includes('phase')) {
      safeConcept = 'losing track of line and phase as the same conductor role';
    } else if (code.includes('extraneous') || code.includes('exposed')) {
      safeConcept = 'mixing up exposed-conductive-parts and extraneous-conductive-parts';
    }

    return {
      misconceptionCode,
      shortCorrection: `Close. A common mistake here is ${safeConcept}. The correct idea is that ${normalizeWhitespace(primarySentence).replace(/[.?!]+$/, '').toLowerCase()}.`,
      contrastPrompt: `Set the wrong idea against the correct electrical rule: ${normalizeWhitespace(primarySentence)}`,
      retryPrompt: 'Try again using the correct conductor, device, or safety term in one sentence.',
    };
  }

  let safeConcept = 'mixing up the key structures or processes';
  if (code.includes('mem') && code.includes('wall')) {
    safeConcept = 'confusing the cell membrane with the cell wall';
  } else if (code.includes('nuc')) {
    safeConcept = 'misunderstanding what the nucleus does';
  } else if (code.includes('mito')) {
    safeConcept = 'confusing mitochondria with breathing or saying they create energy by themselves';
  } else if (code.includes('pro') || code.includes('bact')) {
    safeConcept = 'mixing up bacterial cells with plant or animal cells';
  } else {
    const concept = misconceptionCode.replace(/[_-]+/g, ' ').replace(/^m\d+\s*:?\s*/i, '').toLowerCase();
    if (concept.trim()) safeConcept = concept.trim();
  }
  return {
    misconceptionCode,
    shortCorrection: `Close. A common mistake here is ${safeConcept}. The correct idea is that ${normalizeWhitespace(primarySentence).replace(/[.?!]+$/, '').toLowerCase()}.`,
    contrastPrompt: `Set the misconception against the correct idea: ${normalizeWhitespace(primarySentence)}`,
    retryPrompt: 'Try again with the correct biological relationship in one sentence.',
  };
}

function isGenericRepairTemplate(template: GuidedChunkRepairTemplate): boolean {
  const lower = `${template.shortCorrection} ${template.contrastPrompt} ${template.retryPrompt}`.toLowerCase();
  return lower.includes('tighten the core idea') || lower.includes('what is the clearest version');
}

function buildExpectedConceptsFromPrompt(prompt: string, fallbackPool: string[]): string[] {
  const normalizedPrompt = normalizeWhitespace(prompt)
    .replace(/^Explain this taught point in one or two sentences:\s*/i, '')
    .replace(/^Explain\s+/i, '');
  const lowerPrompt = normalizedPrompt.toLowerCase();
  if (lowerPrompt.includes('cytoplasm') && lowerPrompt.includes('cell membrane')) {
    return [
      'cytoplasm is where most chemical reactions happen',
      'cell membrane controls movement of substances into and out of the cell',
    ];
  }
  if (lowerPrompt.includes('dna') && (lowerPrompt.includes('bacteria') || lowerPrompt.includes('bacterial')) && (lowerPrompt.includes('animal') || lowerPrompt.includes('plant'))) {
    return [
      'animal and plant cells keep DNA inside a nucleus',
      'bacterial DNA is free in the cytoplasm',
      'bacteria may also contain plasmids',
    ];
  }
  if (lowerPrompt.includes('plasmid')) {
    return ['small ring of DNA', 'found in bacterial cells'];
  }
  if (lowerPrompt.includes('cell membrane')) {
    return ['controls movement of substances into and out of the cell', 'selectively permeable'];
  }
  if (lowerPrompt.includes('mitochondria')) {
    return ['site of aerobic respiration', 'releases energy for the cell'];
  }

  const keywords = normalizedPrompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3 && !['explain', 'difference', 'between', 'where', 'function', 'role', 'point'].includes(word));

  const matched = fallbackPool.filter((entry) => {
    const lower = entry.toLowerCase();
    return keywords.some((keyword) => lower.includes(keyword));
  });

  const result = (matched.length ? matched : fallbackPool)
    .slice(0, 3)
    .map(normalizeWhitespace)
    .map((entry) => {
      const sentences = splitSentences(entry);
      return sentences[0] ?? entry;
    })
    .filter((entry) => entry.length > 0 && entry.length < 160);
  return result.length > 0 ? result : [normalizedPrompt];
}

function normalizeVocabQuestion(term: string): string {
  const normalized = term.toLowerCase().trim();
  if (normalized === 'prokaryotic') {
    return 'What does the term prokaryotic mean?';
  }
  if (normalized === 'eukaryotic') {
    return 'What does the term eukaryotic mean?';
  }
  if (normalized === 'cellulose') {
    return 'What is cellulose in a plant cell?';
  }
  return `What is the function of ${normalized}?`;
}

function hasPlaceholderOptions(question: GuidedChunkMcqQuestion): boolean {
  return question.options.some((option) => {
    const lower = option.toLowerCase();
    return lower.includes('irrelevant option') || lower.includes('another distractor') || lower.startsWith('not ');
  });
}

function buildVocabMcqs(lo: GuidedChunkLo, globalVocabItems: GuidedChunkVocabItem[] = []): GuidedChunkMcqQuestion[] {
  const vocabItems = [...lo.chunkPlan.flatMap((chunk) => chunk.vocabPack), ...globalVocabItems].filter((item) => item.term && item.definition);
  const unique = new Map<string, GuidedChunkVocabItem>();
  for (const item of vocabItems) {
    if (!unique.has(item.term.toLowerCase())) {
      unique.set(item.term.toLowerCase(), item);
    }
  }
  const pool = Array.from(unique.values()).slice(0, 4);
  return pool.slice(0, 3).map((item, index) => {
    const distractors = pool.filter((candidate) => candidate.term !== item.term).map((candidate) => candidate.term).slice(0, 3);
    const fallbackDistractors = ['nucleus', 'cytoplasm', 'cell membrane', 'mitochondria', 'ribosome', 'chloroplast', 'cell wall', 'vacuole', 'plasmid']
      .filter((term) => term.toLowerCase() !== item.term.toLowerCase() && !distractors.some((existing) => existing.toLowerCase() === term.toLowerCase()));
    while (distractors.length < 3 && fallbackDistractors.length > 0) {
      distractors.push(fallbackDistractors.shift() as string);
    }
    const options = [item.term, ...distractors].slice(0, 4);
    return {
      id: `${lo.loId}-MCQ-${index + 1}`,
      prompt: `Which term best matches this definition: ${normalizeWhitespace(item.definition)}`,
      options,
      correctIndex: 0,
      explanation: `${item.term} matches this definition.`,
    };
  });
}

function enrichVocabPack(vocabPack: GuidedChunkVocabItem[], teachingCore: string): GuidedChunkVocabItem[] {
  const items = [...vocabPack];
  const addIfMissing = (term: string, definition: string) => {
    if (!items.some((item) => item.term.toLowerCase() === term.toLowerCase())) {
      items.push({ term, definition });
    }
  };
  const lower = teachingCore.toLowerCase();
  if (lower.includes('selectively permeable')) {
    addIfMissing('Selectively Permeable', 'Allows some substances to pass through while blocking others.');
  }
  if (lower.includes('aerobic respiration')) {
    addIfMissing('Aerobic Respiration', 'A process that uses oxygen to release energy from glucose.');
  }
  if (lower.includes('eukaryotic')) {
    addIfMissing('Eukaryotic', 'A cell type with genetic material enclosed inside a nucleus.');
  }
  return items.slice(0, 4);
}

function enrichCg2365VocabPack(vocabPack: GuidedChunkVocabItem[], teachingCore: string): GuidedChunkVocabItem[] {
  const items = [...vocabPack];
  const addIfMissing = (term: string, definition: string, confusionWith?: string) => {
    if (!items.some((item) => item.term.toLowerCase() === term.toLowerCase())) {
      items.push({ term, definition, confusionWith });
    }
  };
  const lower = teachingCore.toLowerCase();
  if (lower.includes('met')) {
    addIfMissing('MET', 'Main Earthing Terminal: the point where earthing and main protective bonding conductors are connected.', 'Main switch');
  }
  if (lower.includes('ads')) {
    addIfMissing('ADS', 'Automatic Disconnection of Supply: the protective measure that disconnects the circuit under fault conditions.', 'Earthing conductor');
  }
  if (lower.includes('line conductor') || lower.includes('phase conductor')) {
    addIfMissing('Line conductor', 'The live conductor that carries voltage from the supply. Older texts may call this the phase conductor.', 'Neutral');
  }
  if (lower.includes('cpc')) {
    addIfMissing('CPC', 'Circuit Protective Conductor: the protective conductor that provides the earth fault return path inside the installation.', 'Neutral');
  }
  if (/\br1\b/i.test(teachingCore)) {
    addIfMissing('R1', 'The resistance of the line conductor in the circuit being tested.', 'Line conductor itself');
  }
  if (/\br2\b/i.test(teachingCore)) {
    addIfMissing('R2', 'The resistance of the circuit protective conductor in the circuit being tested.', 'CPC itself');
  }
  if (/\bze\b/i.test(teachingCore)) {
    addIfMissing('Ze', 'External earth fault loop impedance, measured outside the installation wiring.', 'Zs');
  }
  if (/\bzs\b/i.test(teachingCore)) {
    addIfMissing('Zs', 'Total earth fault loop impedance for the complete fault path of the circuit.', 'Ze');
  }
  if (lower.includes('extraneous-conductive-part') || lower.includes('extraneous conductive part')) {
    addIfMissing('Extraneous-conductive-part', 'A conductive part not forming part of the electrical installation that can introduce earth potential, such as a metallic water service.', 'Exposed-conductive-part');
  }
  return items.slice(0, 5);
}

function ensureStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((entry) => normalizeWhitespace(String(entry))).filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(/(?<=[.!?])\s+|\s{2,}|(?<!\b[A-Z])\s(?=[A-Z][a-z])/)
      .map((entry) => normalizeWhitespace(entry))
      .filter(Boolean);
  }
  return [];
}

function ensureQuestion(question: GuidedChunkQuestion, fallbackId: string): GuidedChunkQuestion {
  return {
    ...question,
    id: question.id || fallbackId,
    prompt: normalizeWhitespace(String(question.prompt ?? '')),
    expectedConcepts: ensureStringArray(question.expectedConcepts),
  };
}

function ensureRepairTemplate(template: GuidedChunkRepairTemplate | string, fallbackCode: string): GuidedChunkRepairTemplate {
  if (typeof template !== 'string') {
    return {
      ...template,
      misconceptionCode: template.misconceptionCode || fallbackCode,
      shortCorrection: normalizeWhitespace(String(template.shortCorrection ?? '')),
      contrastPrompt: normalizeWhitespace(String(template.contrastPrompt ?? '')),
      retryPrompt: normalizeWhitespace(String(template.retryPrompt ?? '')),
    };
  }

  const codeMatch = template.match(/misconceptionCode=([^;}\]]+)/i);
  const shortMatch = template.match(/shortCorrection=([^;}\]]+)/i);
  const contrastMatch = template.match(/contrastPrompt=([^;}\]]+)/i);
  const retryMatch = template.match(/retryPrompt=([^;}\]]+)/i);

  return {
    misconceptionCode: normalizeWhitespace(codeMatch?.[1] ?? fallbackCode),
    shortCorrection: normalizeWhitespace(shortMatch?.[1] ?? ''),
    contrastPrompt: normalizeWhitespace(contrastMatch?.[1] ?? ''),
    retryPrompt: normalizeWhitespace(retryMatch?.[1] ?? ''),
  };
}

function formatCg2365TeachingCore(teachingCore: string): string {
  const sentences = splitSentences(teachingCore);
  if (sentences.length <= 2) return teachingCore;
  const paragraphs: string[] = [];
  for (let index = 0; index < sentences.length; index += 2) {
    paragraphs.push(sentences.slice(index, index + 2).join(' '));
  }
  return paragraphs.join('\n\n');
}

function normalizeParagraphSpacing(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => normalizeWhitespace(paragraph))
    .filter(Boolean)
    .join('\n\n');
}

function stripCg2365Etymology(text: string): string {
  return text
    .replace(/\bearth\s*\(\s*terre\s*\)/gi, 'earth')
    .replace(/\bneutral\s*\(\s*neutre\s*\)/gi, 'neutral')
    .replace(/\bseparate\s*\(\s*s[ée]par[ée]\s*\)/gi, 'separate')
    .replace(/\bcombined\s*\(\s*combin[ée]\s*\)/gi, 'combined')
    .replace(/\bthe earth and neutral are separate all the way from the transformer to the installation\b/gi, 'the earth and neutral stay separate from the source to the installation')
    .replace(/\bthe earth and neutral are combined into a single pen conductor\b/gi, 'the earth and neutral are combined into one PEN conductor in the supplier network');
}

function rewriteCg2365TutorVoice(text: string): string {
  return normalizeWhitespace(text)
    .replace(/^Earthing systems are defined by how the supplier provides the earth connection\./i, 'The key difference between earthing systems is how the supply gives you the earth path.')
    .replace(
      /^This step links the earthing arrangement to the ADS parts that make fault protection work properly\./i,
      'The earth path and the ADS parts have to work together so a fault current can return safely and the protective device can disconnect in time.'
    )
    .replace(
      /^You need to identify the main earthing system types used in installations, especially TT, TN-S, and TN-C-S\./i,
      'The main earthing system types are TT, TN-S, and TN-C-S, and the practical difference is how each one provides the earth path.'
    )
    .replace(/^A radial circuit is a single-path wiring arrangement/i, 'A radial circuit has one path from the protective device to the final point on the circuit')
    .replace(/\bThink of it as\b/gi, 'You can think of it as')
    .replace(/\bThis layout is the standard choice\b/gi, 'This layout is commonly used')
    .replace(/\bdenoted as\b/gi, 'called');
}

function trimCg2365FirstChunk(text: string, chunkId: string): string {
  if (!/[-_]C1$/i.test(chunkId)) return text;
  const sentences = splitSentences(text);
  if (countWords(text) <= 120 && sentences.length <= 4) return text;
  const trimmed = sentences.slice(0, 4).join(' ');
  return normalizeWhitespace(trimmed);
}

function hasCg2365PoorDelivery(text: string): boolean {
  const lower = normalizeWhitespace(text).toLowerCase();
  return (
    /\bterre\b|\bs[??e]par[??e]\b|\bcombin[??e]\b/.test(lower) ||
    lower.startsWith('earthing systems are defined by how') ||
    lower.includes('denoted as') ||
    lower.includes('the french etymology') ||
    lower.includes('you can think of it as a') ||
    lower.includes('this chunk focuses on') ||
    lower.includes('what is the key fact in this chunk about')
  );
}

function sanitizeCg2365PromptSubject(subject: string): string {
  return normalizeWhitespace(subject)
    .replace(/[*_`]/g, '')
    .replace(/^(crucially|finally|however|therefore|because|without|within|beyond)\b[\s,]*/i, '')
    .replace(/\b(typically|usually|mainly|often|specifically)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function refineCg2365TeachingCore(
  teachingCore: string,
  learningGoal: string,
  chunkId: string
): string {
  const cleanedCore = rewriteCg2365TutorVoice(stripCg2365Etymology(teachingCore));
  const lowerGoal = learningGoal.toLowerCase();
  const lowerCore = cleanedCore.toLowerCase();
  const sentences = splitSentences(cleanedCore).filter((sentence) => {
    const normalized = normalizeWhitespace(sentence).replace(/[.?!]+$/, '');
    if (!normalized || /^unit:\s*\d+/i.test(normalized)) return false;
    if (isHeadingFragment(normalized)) {
      const lowerSentence = normalized.toLowerCase();
      if (lowerGoal.includes(lowerSentence) || lowerSentence.includes(lowerGoal)) return false;
      if (!/\b(tt|tn-s|tn-c-s|met|ads|cpc|bonding|earthing|fault|loop)\b/.test(lowerSentence)) return false;
    }
    return true;
  });
  const extras: string[] = [];

  if ((/\bzs\b/i.test(teachingCore) || lowerGoal.includes('earth loop')) && !lowerCore.includes('automatic disconnection of supply')) {
    extras.push('This matters because a low enough Zs allows Automatic Disconnection of Supply (ADS) to operate within the required time.');
  }

  if (lowerGoal.includes('bonding') && lowerCore.includes('supplementary bonding') && !lowerCore.includes('rcd')) {
    extras.push('In many modern installations, supplementary bonding may be omitted where effective main bonding and suitable RCD protection are already in place.');
  }

  if (lowerGoal.includes('bonding') && lowerCore.includes('pipe') && !lowerCore.includes('extraneous-conductive-part')) {
    extras.push('Those incoming metallic services are classed as extraneous-conductive-parts because they can introduce earth potential from outside the electrical installation.');
  }

  if (lowerGoal.includes('earthing conductor') && !lowerCore.includes('serves the entire installation')) {
    extras.push('There is usually one main earthing conductor serving the whole installation, whereas each circuit has its own CPC.');
  }

  const merged = [...sentences, ...extras].join(' ');
  let formatted = formatCg2365TeachingCore(merged);
  formatted = trimCg2365FirstChunk(formatted, chunkId);

  if ((/\bsource\b/i.test(formatted) || /\btransformer\b/i.test(formatted)) && /\bmet\b/i.test(formatted) && (/\br1\b/i.test(formatted) || /\br2\b/i.test(formatted) || /\bze\b/i.test(formatted))) {
    const numbered = [
      'The loop sequence is: source -> line path -> fault -> CPC return -> MET -> supplier earth return path -> source.',
    ];
    if (!formatted.toLowerCase().includes('loop sequence is:')) {
      formatted = `${formatted}\n\n${numbered[0]}`;
    }
  }

  return chunkId ? normalizeParagraphSpacing(formatted).replace(/\. (?=Quick check:)/g, '.\n\n') : normalizeWhitespace(merged);
}

function buildCg2365QuestionPrompt(
  question: GuidedChunkQuestion,
  chunk: GuidedChunkLo['chunkPlan'][number],
  questionIndex: number
): string {
  const prompt = normalizeWhitespace(question.prompt);
  const lower = prompt.toLowerCase();
  const expected = ensureStringArray(question.expectedConcepts).join(' | ').toLowerCase();
  const learningGoal = chunk.learningGoal;
  const lowerGoal = learningGoal.toLowerCase();

  if (lower.startsWith('does the earthing conductor') && lower.includes('disconnect')) {
    return 'Which component in the ADS sequence actually disconnects the supply when a fault occurs?';
  }
  if (lower.startsWith('is the pen conductor') || (lower.includes('pen conductor') && lower.includes('supplier'))) {
    return 'On which side of the intake is the PEN conductor provided: the supplier network or the consumer installation?';
  }
  if ((lower.startsWith('is ') || lower.startsWith('does ')) && lower.includes('radial')) {
    return 'Why can a circuit with several outlets still be classed as a radial?';
  }
  if ((lower.startsWith('is ') || lower.startsWith('does ')) && lower.includes('bond')) {
    return 'Which parts need bonding here, and what job does bonding actually do?';
  }
  if ((lower.startsWith('is ') || lower.startsWith('does ')) && lower.includes('phase')) {
    return 'What conductor role is being described here, and which older field term is often used for it?';
  }
  if (lower.startsWith('what is the function of met')) {
    return 'What is the role of the MET in the earthing and bonding arrangement?';
  }
  if (lower.startsWith('what is the function of main protective bonding')) {
    return 'What is the primary purpose of main protective bonding?';
  }
  if (lower.startsWith('what is the function of supplementary bonding')) {
    return 'Where is supplementary bonding used, and what problem is it trying to prevent?';
  }
  if (lower.startsWith('what is the function of protective device')) {
    return 'Which protective devices can automatically disconnect a circuit during a fault?';
  }
  if (lower.startsWith('what is the function of ads')) {
    return 'What does ADS actually achieve during a fault?';
  }
  if (lower.includes('without the electrode') || (lower.includes('earth electrode') && lower.includes('without'))) {
    return 'What happens to fault protection in a TT system if the earth electrode is missing or ineffective?';
  }
  if (lower.startsWith('what is the function of earthing conductor') || lower.startsWith('what is the role of earthing conductor')) {
    return 'What does the earthing conductor connect, and why is it different from a CPC?';
  }
  if (lower.startsWith('what is the function of line conductor')) {
    return 'What is the job of the line conductor, also called the phase conductor in older usage?';
  }
  if (lower.startsWith('what is the function of r1')) {
    return 'What does R1 represent when you are measuring a circuit?';
  }
  if (lower.startsWith('what is the function of r2')) {
    return 'What does R2 represent when you are measuring a circuit?';
  }
  if (lower.startsWith('what is the function of ze')) {
    return 'What does Ze tell you about the earth fault loop path?';
  }
  if (lower.startsWith('what is the function of zs')) {
    return 'What does Zs tell you about the complete earth fault loop path?';
  }
  if (lower.includes('what is the role of') || lower.includes('what is the function of')) {
    const subject = sanitizeCg2365PromptSubject(
      prompt.replace(/^what is the (role|function) of\s*/i, '').replace(/\?+$/, '')
    );
    if (subject) {
      if (subject.toLowerCase().includes('bond')) {
        return 'What is bonding trying to prevent, and how is that different from earthing?';
      }
      if (subject.toLowerCase().includes('earthing conductor')) {
        return 'What does the earthing conductor connect, and why is there usually only one for the installation?';
      }
      if (subject.toLowerCase().includes('protective device')) {
        return 'Which part of the fault protection system actually interrupts the circuit when a fault current is high enough?';
      }
      return `What is the role of ${subject}?`;
    }
  }

  if (lowerGoal.includes('bonding') && questionIndex === 2) {
    return 'Why is bonding about equalizing voltage, rather than carrying the normal fault-return current of a circuit?';
  }
  if ((lowerGoal.includes('earth loop') || /\bzs\b/i.test(chunk.teachingCore)) && questionIndex === 0) {
    return 'Why do we add Ze, R1, and R2 together when calculating Zs?';
  }
  if ((/\br1\b/i.test(chunk.teachingCore) || /\br2\b/i.test(chunk.teachingCore)) && questionIndex === 2) {
    return 'Why are R1 and R2 treated as one continuous series path during a line-to-earth fault?';
  }
  if (expected.includes('met') && questionIndex === 1) {
    return 'What does the MET connect together in the earthing arrangement?';
  }

  return prompt || `Explain ${learningGoal.toLowerCase().replace(/\.$/, '')}.`;
}

function buildCg2365DeeperQuestionPrompt(chunk: GuidedChunkLo['chunkPlan'][number]): string {
  const lowerGoal = chunk.learningGoal.toLowerCase();
  const teaching = chunk.teachingCore.toLowerCase();
  if (lowerGoal.includes('bonding')) {
    return 'In one or two sentences, explain why bonding reduces shock risk even though it is not the device that disconnects the circuit.';
  }
  if (lowerGoal.includes('earthing conductor') || (teaching.includes('cpc') && teaching.includes('earthing conductor'))) {
    return 'In one or two sentences, explain the difference between the earthing conductor and a CPC in terms of what each one connects.';
  }
  if (lowerGoal.includes('earth loop') || /\bzs\b/i.test(chunk.teachingCore)) {
    return 'In one or two sentences, explain why a high Zs value can stop ADS from operating quickly enough.';
  }
  if (lowerGoal.includes('tt system') || teaching.includes('earth electrode')) {
    return 'In one or two sentences, explain why a TT system usually relies on an RCD rather than fault current alone.';
  }
  return chunk.candidateDeeperQuestion?.prompt ?? `In one or two sentences, explain ${lowerGoal.replace(/\.$/, '')}.`;
}

function buildAlternateCg2365RecallPrompt(
  chunk: GuidedChunkLo['chunkPlan'][number],
  questionIndex: number
): string {
  const lowerGoal = chunk.learningGoal.toLowerCase();
  const teaching = chunk.teachingCore.toLowerCase();

  if (lowerGoal.includes('earthing conductor') || (teaching.includes('earthing conductor') && teaching.includes('cpc'))) {
    if (questionIndex === 2) {
      return 'Why is there usually one main earthing conductor for the installation, but many CPCs across different circuits?';
    }
    return 'Where does the earthing conductor terminate at the origin of the installation?';
  }

  if (lowerGoal.includes('bonding')) {
    if (questionIndex === 2) {
      return 'Why would a metallic incoming pipe need bonding when a plastic service would not?';
    }
    return 'What dangerous condition is bonding trying to reduce between exposed metal parts?';
  }

  if (lowerGoal.includes('earth loop') || /\bzs\b/i.test(chunk.teachingCore)) {
    if (questionIndex === 2) {
      return 'If the line path or external path were ignored, why would the calculated Zs value be wrong?';
    }
    return 'Why do we treat the earth fault loop as one complete series path rather than separate unrelated parts?';
  }

  if (lowerGoal.includes('tt system') || teaching.includes('earth electrode')) {
    return 'Why might a TT system fail to disconnect safely if its electrode or RCD arrangement is poor?';
  }

  return `What is one practical reason ${lowerGoal.replace(/\.$/, '')} matters for fault protection?`;
}

function inferCg2365Misconceptions(teachingCore: string, existingCodes: string[]): string[] {
  const codes = [...existingCodes];
  const add = (code: string) => {
    if (!codes.includes(code)) codes.push(code);
  };
  const lower = teachingCore.toLowerCase();
  if (lower.includes('bond') && lower.includes('earth')) add('bonding_vs_earthing');
  if (lower.includes('plastic')) add('plastic_services_do_not_need_bonding');
  if (lower.includes('radial') && lower.includes('ring')) add('radial_vs_ring_mixup');
  if (lower.includes('ads') || lower.includes('disconnects the supply')) add('fault_path_vs_device_disconnect');
  if (/\br1\b/i.test(teachingCore) || /\br2\b/i.test(teachingCore) || /\bze\b/i.test(teachingCore) || /\bzs\b/i.test(teachingCore)) {
    add('measurement_labels_vs_conductor_roles');
  }
  if (lower.includes('exposed-conductive-part') || lower.includes('extraneous-conductive-part')) {
    add('exposed_vs_extraneous_mixup');
  }
  return codes.length > 0 ? codes : ['conductor_role_mixup'];
}

function chooseCg2365AssetInjection(chunk: GuidedChunkLo['chunkPlan'][number], frame: GuidedChunkFrame): GuidedChunkLo['chunkPlan'][number]['assetInjection'] {
  if (chunk.assetInjection) return chunk.assetInjection;
  const lower = `${frame.topic} ${chunk.learningGoal} ${chunk.teachingCore}`.toLowerCase();
  if (lower.includes('ceiling rose') || lower.includes('loop-in')) {
    return {
      kind: 'image',
      assetId: `${frame.lessonCode}-${chunk.chunkId}-ceiling-rose`,
      title: '3-plate ceiling rose wiring diagram',
      description: 'Diagram showing neutral, permanent live loop, and switched live groups.',
      imageUrl: '/images/lessons/1769620003359-ceiling_rose_end_newcolours.png',
      alt: 'Three-plate ceiling rose diagram showing neutral, permanent live loop, and switched live groups.',
    };
  }
  if (lower.includes('lighting circuit') || lower.includes('radial circuit') || lower.includes('ring final')) {
    return {
      kind: 'image',
      assetId: `${frame.lessonCode}-${chunk.chunkId}-lighting-circuit`,
      title: 'Lighting and circuit arrangement overview',
      description: 'Simple diagram showing common lighting and circuit arrangements.',
      imageUrl: '/images/lessons/203-LC1A-lighting-circuits.svg',
      alt: 'Diagram showing common lighting and circuit arrangements.',
    };
  }
  if (lower.includes('earth loop') || /\bzs\b/.test(lower) || /\bze\b/.test(lower) || (/\br1\b/.test(lower) && /\br2\b/.test(lower))) {
    return {
      kind: 'image',
      assetId: `${frame.lessonCode}-${chunk.chunkId}-earth-loop`,
      title: 'Earth fault loop path',
      description: 'Diagram showing the path from source to fault and back through the protective path.',
      imageUrl: '/images/lessons/203-LC1A-lighting-circuits.svg',
      alt: 'Simplified diagram showing a complete earth fault loop path from source to fault and back.',
    };
  }
  return null;
}

function applyCg2365Refinement(frame: GuidedChunkFrame, input: GuidedChunkGenerationInput): GuidedChunkFrame {
  return {
    ...frame,
    loSequence: frame.loSequence.map((lo) => {
      const introducedTerms = new Set<string>();
      return {
        ...lo,
        chunkPlan: lo.chunkPlan.map((chunk) => {
        const teachingCore = refineCg2365TeachingCore(chunk.teachingCore, chunk.learningGoal, chunk.chunkId);
        let vocabPack = enrichCg2365VocabPack(chunk.vocabPack, teachingCore);
        vocabPack = vocabPack.filter((item, index) => {
          const key = item.term.toLowerCase();
          const isFirstUse = !introducedTerms.has(key);
          const isCoreThisChunk =
            chunk.learningGoal.toLowerCase().includes(key) ||
            splitSentences(teachingCore).slice(0, 1).some((sentence) => sentence.toLowerCase().includes(key));
          const allowRepeat =
            isFirstUse ||
            index < 2 ||
            (isCoreThisChunk && !['met', 'cpc', 'line conductor', 'r1', 'r2', 'ze', 'zs'].includes(key));
          if (allowRepeat) {
            introducedTerms.add(key);
            return true;
          }
          return false;
        });
        const misconceptionCodes = inferCg2365Misconceptions(chunk.teachingCore, chunk.misconceptionCodes ?? []);
        const recallQuestions = chunk.initialRecallQuestions.map((question, questionIndex) => ({
          ...question,
          prompt: buildCg2365QuestionPrompt(question, { ...chunk, teachingCore }, questionIndex),
        }));
        const dedupedPrompts = new Set<string>();
        const normalizedRecallQuestions = recallQuestions.map((question, questionIndex) => {
          const promptKey = normalizeWhitespace(question.prompt).toLowerCase();
          if (!dedupedPrompts.has(promptKey)) {
            dedupedPrompts.add(promptKey);
            return question;
          }
          const fallbackPrompt = buildAlternateCg2365RecallPrompt({ ...chunk, teachingCore }, questionIndex);
          dedupedPrompts.add(normalizeWhitespace(fallbackPrompt).toLowerCase());
          return { ...question, prompt: fallbackPrompt };
        });
        return {
          ...chunk,
          teachingCore,
          vocabPack,
          initialRecallQuestions: normalizedRecallQuestions,
          candidateDeeperQuestion: chunk.candidateDeeperQuestion
            ? {
                ...chunk.candidateDeeperQuestion,
                prompt: buildCg2365DeeperQuestionPrompt({ ...chunk, teachingCore }),
              }
            : chunk.candidateDeeperQuestion,
          misconceptionCodes,
          repairTemplates: misconceptionCodes.map((code) => {
            const existing = chunk.repairTemplates.find((template) => template.misconceptionCode === code);
            const normalizedExisting = existing ? ensureRepairTemplate(existing, code) : null;
            if (code === 'measurement_labels_vs_conductor_roles') {
              return {
                misconceptionCode: code,
                shortCorrection: 'Close. Do not mix up the conductor itself with the measurement label taken from that conductor.',
                contrastPrompt: 'For example, R2 is the resistance value you measure; the CPC is the physical protective conductor carrying the fault current back.',
                retryPrompt: 'Try again by naming the physical conductor first, then the measurement label if needed.',
              };
            }
            if (code === 'bonding_vs_earthing') {
              return {
                misconceptionCode: code,
                shortCorrection: 'Close. Earthing provides the fault-return path. Bonding reduces dangerous voltage differences between metal parts.',
                contrastPrompt: 'If two metal parts could rise to different voltages, do you need a fault-return path or equalized potential between those parts?',
                retryPrompt: 'Try again by stating the job of bonding and the separate job of earthing.',
              };
            }
            if (code === 'fault_path_vs_device_disconnect') {
              return {
                misconceptionCode: code,
                shortCorrection: 'Close. Conductors provide the path. The protective device is the part that actually opens the circuit.',
                contrastPrompt: 'Which part carries the fault current, and which part senses or responds so the supply is disconnected?',
                retryPrompt: 'Try again by naming the path first and the disconnecting device second.',
              };
            }
            if (code === 'plastic_services_do_not_need_bonding') {
              return {
                misconceptionCode: code,
                shortCorrection: 'Plastic services do not introduce earth potential in the way metallic services do, so they are not bonded like metal pipes.',
                contrastPrompt: 'Would a plastic water service bring in an external earth potential the same way a metallic pipe can?',
                retryPrompt: 'Try again by focusing on conductivity and whether the service can introduce earth potential.',
              };
            }
            return normalizedExisting && !isGenericRepairTemplate(normalizedExisting)
              ? normalizedExisting
              : buildRepairTemplate(code, teachingCore, input.curriculum);
          }),
        };
      }).map((chunk) => ({
        ...chunk,
        assetInjection: chooseCg2365AssetInjection(chunk, frame),
      })),
    };
    }),
  };
}

function normalizeLo(lo: GuidedChunkLo, input: GuidedChunkGenerationInput, globalVocabItems: GuidedChunkVocabItem[] = []): GuidedChunkLo {
  const normalizedChunkPlan = lo.chunkPlan.map((chunk, chunkIndex) => {
    const normalizedTeaching = clampTeachingCore(chunk.teachingCore);
    const sanitizedTeaching = normalizedTeaching.teachingCore;
    const enrichedVocabPack = enrichVocabPack(chunk.vocabPack, sanitizedTeaching);
    const sentences = splitSentences(sanitizedTeaching);
    const recallQuestions =
      chunk.initialRecallQuestions.length === 3 &&
      !chunk.initialRecallQuestions.some((question) => isGenericRecallPrompt(question.prompt) || isMalformedPrompt(question.prompt))
        ? chunk.initialRecallQuestions.slice(0, 3).map((question, questionIndex) => ensureQuestion(question, `${chunk.chunkId}-Q${questionIndex + 1}`))
        : buildSpecificRecallQuestions(chunk.chunkId, sanitizedTeaching, enrichedVocabPack, chunk.learningGoal, input.curriculum);

    const misconceptionCodes = chunk.misconceptionCodes?.length ? chunk.misconceptionCodes : ['not_secure_yet'];
    const repairTemplates =
      chunk.repairTemplates?.length
        ? misconceptionCodes.map((code) => {
            const existing = chunk.repairTemplates.find((template) => template.misconceptionCode === code);
            return existing
              ? isGenericRepairTemplate(existing)
                ? buildRepairTemplate(code, sanitizedTeaching, input.curriculum)
                : ensureRepairTemplate(existing, code)
              : buildRepairTemplate(code, sanitizedTeaching, input.curriculum);
          })
        : misconceptionCodes.map((code) => buildRepairTemplate(code, sanitizedTeaching, input.curriculum));

    const deeperQuestion =
      chunk.candidateDeeperQuestion && !isGenericRecallPrompt(chunk.candidateDeeperQuestion.prompt)
        ? ensureQuestion(chunk.candidateDeeperQuestion, `${chunk.chunkId}-D1`)
        : buildSpecificDeeperQuestion(chunk.chunkId, chunk.learningGoal, sentences);

    return {
      ...chunk,
      chunkIndex,
      teachingCore: sanitizedTeaching,
      teachingWordCount: normalizedTeaching.teachingWordCount,
      vocabPack: enrichedVocabPack,
      initialRecallQuestions: recallQuestions,
      candidateDeeperQuestion: deeperQuestion,
      misconceptionCodes,
      repairTemplates,
      microbreakAfter: chunk.microbreakAfter ?? null,
      assetInjection: chunk.assetInjection ?? null,
    };
  });

  const mcqs =
    lo.loTestMcq.mcqs.length > 0 && !lo.loTestMcq.mcqs.some(hasPlaceholderOptions)
      ? lo.loTestMcq.mcqs
      : buildVocabMcqs({ ...lo, chunkPlan: normalizedChunkPlan }, globalVocabItems);
  const loConceptPool = normalizedChunkPlan.flatMap((chunk) => [
    chunk.teachingCore,
    ...chunk.initialRecallQuestions.flatMap((recall) => recall.expectedConcepts),
  ]);

  return {
    ...lo,
    chunkPlan: normalizedChunkPlan,
    loTestMcq: {
      ...lo.loTestMcq,
      intro: normalizeWhitespace(lo.loTestMcq.intro),
      mcqs: mcqs.map((question, index) => ({
        ...question,
        id: question.id || `${lo.loId}-MCQ-${index + 1}`,
        prompt: normalizeWhitespace(String(question.prompt ?? '')),
        options: ensureStringArray((question as unknown as { options: unknown }).options).slice(0, 4),
        explanation: normalizeWhitespace(String(question.explanation ?? '')),
      })),
    },
    loTestShortAnswer: {
      ...lo.loTestShortAnswer,
      intro: normalizeWhitespace(lo.loTestShortAnswer.intro),
      shortAnswers: lo.loTestShortAnswer.shortAnswers.map((question, index) => ({
        ...question,
        id: question.id || `${lo.loId}-SA-${index + 1}`,
        prompt: normalizeWhitespace(question.prompt),
        expectedConcepts:
          ensureStringArray(question.expectedConcepts).length > 0 &&
          !ensureStringArray(question.expectedConcepts).every((concept) => {
            const normalizedConcept = normalizeWhitespace(concept);
            const normalizedPrompt = normalizeWhitespace(question.prompt);
            const strippedPrompt = normalizedPrompt.replace(/^Explain this taught point in one or two sentences:\s*/i, '');
            return normalizedConcept === normalizedPrompt || normalizedConcept === strippedPrompt || strippedPrompt.includes(normalizedConcept);
          })
            ? ensureStringArray(question.expectedConcepts)
            : buildExpectedConceptsFromPrompt(
                question.prompt,
                loConceptPool
              ),
      })),
    },
  };
}

function normalizeFrame(frame: GuidedChunkFrame, input: GuidedChunkGenerationInput): GuidedChunkFrame {
  const globalVocabItems = frame.loSequence.flatMap((lo) => lo.chunkPlan.flatMap((chunk) => chunk.vocabPack ?? []));
  const normalized = {
    ...frame,
    lessonCode: input.lessonCode,
    title: frame.title || input.title,
    unit: frame.unit || input.unit,
    topic: frame.topic || input.topic,
    runtimeVersion: 'guided_chunk_v1',
    variantId: frame.variantId || `${input.lessonCode}-generated`,
    sourceRefs: frame.sourceRefs?.length ? frame.sourceRefs : input.sourceRefs ?? ['guided_chunk_generator'],
    metadata: {
      created: frame.metadata?.created ?? new Date().toISOString(),
      updated: new Date().toISOString(),
      author: 'guided_chunk_generator',
    },
    loSequence: frame.loSequence.map((lo) => normalizeLo(lo, input, globalVocabItems)),
  };
  return input.curriculum === 'cg2365' ? applyCg2365Refinement(normalized, input) : normalized;
}

function validateGuidedChunkFrame(frame: GuidedChunkFrame): GuidedChunkGenerationValidation {
  const issues: string[] = [];
  const serialized = JSON.stringify(frame).toLowerCase();

  if (
    serialized.includes('key idea in this lesson') ||
    serialized.includes('this helps explain how the cell, organism, or process works in a real biological context') ||
    serialized.includes('a common error here is not secure yet')
  ) {
    issues.push('frame: generic fallback teaching language detected.');
  }

  for (const lo of frame.loSequence) {
    const vocabUsage = new Map<string, number>();
    if (
      lo.successCriteria.length === 1 &&
      lo.chunkPlan.length === 1 &&
      normalizeWhitespace(lo.successCriteria[0]).toLowerCase().startsWith('explain unit:')
    ) {
      issues.push(`${lo.loId}: generic fallback LO structure detected.`);
    }
    for (const chunk of lo.chunkPlan) {
      const teaching = normalizeWhitespace(chunk.teachingCore).toLowerCase();
      if (/this chunk supports understanding|this idea matters because|a strong answer links/.test(teaching)) {
        issues.push(`${chunk.chunkId}: teachingCore contains learner-visible meta-talk.`);
      }
      if (/key idea in this lesson|a common error here is not secure yet|real biological context/.test(teaching)) {
        issues.push(`${chunk.chunkId}: teachingCore contains generic fallback language.`);
      }
      if (hasCg2365PoorDelivery(chunk.teachingCore)) {
        issues.push(`${chunk.chunkId}: teachingCore uses poor learner-facing 2365 delivery (mnemonic, note voice, or overloaded opening phrasing).`);
      }
      if (chunk.teachingWordCount < 60 || chunk.teachingWordCount > 160) {
        issues.push(`${chunk.chunkId}: teaching word count is outside the target band.`);
      }
      for (const question of chunk.initialRecallQuestions) {
        const prompt = normalizeWhitespace(question.prompt).toLowerCase();
        if (/main idea of this step|state one important point|what should you remember/.test(prompt)) {
          issues.push(`${chunk.chunkId}:${question.id}: generic recall prompt.`);
        }
        if (/what is the role of (crucially|without|however|therefore)\b/.test(prompt)) {
          issues.push(`${chunk.chunkId}:${question.id}: malformed electrical recall prompt.`);
        }
        if (/^does\b.+\?$/.test(prompt) && /disconnect|bond|radial/.test(prompt)) {
          issues.push(`${chunk.chunkId}:${question.id}: leading yes-no prompt.`);
        }
        if (/what is the role of unit:|what is the role of a common error here/.test(prompt)) {
          issues.push(`${chunk.chunkId}:${question.id}: title-driven fallback recall prompt.`);
        }
      }
      const promptKeys = new Set<string>();
      for (const question of chunk.initialRecallQuestions) {
        const key = normalizeWhitespace(question.prompt).toLowerCase();
        if (promptKeys.has(key)) {
          issues.push(`${chunk.chunkId}: duplicate recall prompts within chunk.`);
          break;
        }
        promptKeys.add(key);
      }
      if (chunk.candidateDeeperQuestion) {
        const prompt = normalizeWhitespace(chunk.candidateDeeperQuestion.prompt).toLowerCase();
        if (/explain the key idea behind understand|explain the key idea behind identify|explain the key idea behind describe/.test(prompt)) {
          issues.push(`${chunk.chunkId}:${chunk.candidateDeeperQuestion.id}: malformed deeper prompt.`);
        }
      }
      for (const template of chunk.repairTemplates) {
        if (/common mistake here is \./i.test(template.shortCorrection)) {
          issues.push(`${chunk.chunkId}:${template.misconceptionCode}: empty repair explanation.`);
        }
      }
      for (const vocabItem of chunk.vocabPack) {
        const key = normalizeWhitespace(vocabItem.term).toLowerCase();
        vocabUsage.set(key, (vocabUsage.get(key) ?? 0) + 1);
      }
    }

    for (const [term, count] of vocabUsage.entries()) {
      if (
        count >= 3 &&
        !['met', 'cpc', 'line conductor', 'r1', 'r2', 'ze', 'zs', 'ads', 'extraneous-conductive-part', 'exposed-conductive-part'].includes(term)
      ) {
        issues.push(`${lo.loId}: vocab term "${term}" is repeated across too many chunks.`);
      }
    }

    for (const question of lo.loTestShortAnswer.shortAnswers) {
      const prompt = normalizeWhitespace(question.prompt);
      if (
        question.expectedConcepts.length === 0 ||
        question.expectedConcepts.every((concept) => {
          const normalizedConcept = normalizeWhitespace(concept);
          return normalizedConcept === prompt || prompt.includes(normalizedConcept);
        })
      ) {
        issues.push(`${lo.loId}:${question.id}: short-answer expected concepts are not evaluable.`);
      }
    }

    for (const mcq of lo.loTestMcq.mcqs) {
      if (mcq.options.some((option) => /^alternative \d+$/i.test(normalizeWhitespace(option)))) {
        issues.push(`${lo.loId}:${mcq.id}: MCQ still contains filler distractors.`);
      }
    }
  }

  return {
    passed: issues.length === 0,
    issues,
  };
}

function splitSourceIntoLos(sourceText: string): Array<{ title: string; body: string }> {
  const parts = sourceText
    .split(/\bLO\d+\s*:\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    return [{ title: 'Learning outcome 1', body: sourceText.trim() }];
  }

  return parts.map((part, index) => {
    const [firstSentence, ...rest] = part.split(/(?<=[.!?])\s+/);
    return {
      title: firstSentence || `Learning outcome ${index + 1}`,
      body: [firstSentence, ...rest].join(' ').trim(),
    };
  });
}

function buildFallbackPlanLos(input: GuidedChunkGenerationInput): PlanLo[] {
  const topicBullets = extractTopicBullets(input.sourceText);
  const groupedTopics = chunkArray(topicBullets.length ? topicBullets : [input.topic], 2);

  return [
    {
      loId: 'LO1',
      loTitle: input.topic,
      successCriteria: groupedTopics.map((group) => `Explain ${group.join(' and ')}.`),
      reviewHooks: groupedTopics.slice(0, 2).map((group) => `Recall ${group[0]}.`),
      chunks: groupedTopics.map((group, index) => ({
        chunkId: `LO1-C${index + 1}`,
        learningGoal: group.join(' and '),
        keyPoints: group,
        misconceptionCodes: ['not_secure_yet'],
        vocab: [],
      })),
      mcqFocus: topicBullets.slice(0, 6),
      shortAnswerFocus: groupedTopics.map((group) => `Explain ${group.join(' and ')}.`),
    },
  ];
}

function buildFallbackLoScaffold(lo: PlanLo, loIndex: number): GuidedChunkLoScaffold {
  const loId = lo.loId ?? `LO${loIndex + 1}`;
  const loTitle = lo.loTitle ?? `Learning outcome ${loIndex + 1}`;
  return {
    loId,
    loTitle,
    successCriteria: lo.successCriteria?.length ? lo.successCriteria : [loTitle],
    reviewHooks: lo.reviewHooks?.length ? lo.reviewHooks : [loTitle],
    chunkBlueprints: (lo.chunks ?? []).map((chunk, chunkIndex) => ({
      chunkId: chunk.chunkId ?? `${loId}-C${chunkIndex + 1}`,
      learningGoal: chunk.learningGoal ?? `${loTitle} chunk ${chunkIndex + 1}`,
      mustTeach: chunk.keyPoints?.length ? chunk.keyPoints : [chunk.learningGoal ?? loTitle],
      mustNotRepeat: [],
      vocab: (chunk.vocab ?? []).slice(0, 3),
      misconceptions: chunk.misconceptionCodes?.length ? chunk.misconceptionCodes : ['not_secure_yet'],
      deeperQuestionFocus: chunk.learningGoal ?? loTitle,
      assessmentTargets: chunk.keyPoints?.slice(0, 2) ?? [chunk.learningGoal ?? loTitle],
      assetSuggestion: chunk.assetSuggestion === 'image' ? 'image' : 'none',
      microbreakSuggestion: chunk.microbreakSuggestion === 'classify-two-bins' ? 'classify-two-bins' : 'none',
    })),
    endAssessmentFocus: [...(lo.mcqFocus ?? []), ...(lo.shortAnswerFocus ?? [])].filter(Boolean),
  };
}

async function buildLoScaffold(
  input: GuidedChunkGenerationInput,
  lo: PlanLo,
  loIndex: number
): Promise<GuidedChunkLoScaffold> {
  const scaffold = await generateGuidedChunkJson<GuidedChunkLoScaffold>(
    'You are the LO scaffold phase of a guided-chunk lesson generator. Return JSON only.',
    buildGuidedChunkLoScaffoldPrompt(input, lo),
    `generation_lo_scaffold_${lo.loId ?? `LO${loIndex + 1}`}`
  );

  if (!scaffold || !Array.isArray(scaffold.chunkBlueprints) || scaffold.chunkBlueprints.length === 0) {
    return buildFallbackLoScaffold(lo, loIndex);
  }

  const fallback = buildFallbackLoScaffold(lo, loIndex);
  return {
    loId: scaffold.loId || fallback.loId,
    loTitle: scaffold.loTitle || fallback.loTitle,
    successCriteria: scaffold.successCriteria?.length ? scaffold.successCriteria : fallback.successCriteria,
    reviewHooks: scaffold.reviewHooks?.length ? scaffold.reviewHooks : fallback.reviewHooks,
    chunkBlueprints: scaffold.chunkBlueprints.map((chunk, chunkIndex) => ({
      chunkId: chunk.chunkId || fallback.chunkBlueprints[chunkIndex]?.chunkId || `${fallback.loId}-C${chunkIndex + 1}`,
      learningGoal: chunk.learningGoal || fallback.chunkBlueprints[chunkIndex]?.learningGoal || `${fallback.loTitle} chunk ${chunkIndex + 1}`,
      mustTeach: chunk.mustTeach?.length ? chunk.mustTeach : fallback.chunkBlueprints[chunkIndex]?.mustTeach ?? [],
      mustNotRepeat: chunk.mustNotRepeat?.length ? chunk.mustNotRepeat : fallback.chunkBlueprints[chunkIndex]?.mustNotRepeat ?? [],
      vocab: chunk.vocab?.length ? chunk.vocab : fallback.chunkBlueprints[chunkIndex]?.vocab ?? [],
      misconceptions: chunk.misconceptions?.length ? chunk.misconceptions : fallback.chunkBlueprints[chunkIndex]?.misconceptions ?? ['not_secure_yet'],
      deeperQuestionFocus: chunk.deeperQuestionFocus || fallback.chunkBlueprints[chunkIndex]?.deeperQuestionFocus,
      assessmentTargets: chunk.assessmentTargets?.length ? chunk.assessmentTargets : fallback.chunkBlueprints[chunkIndex]?.assessmentTargets ?? [],
      assetSuggestion: chunk.assetSuggestion === 'image' ? 'image' : 'none',
      microbreakSuggestion: chunk.microbreakSuggestion === 'classify-two-bins' ? 'classify-two-bins' : 'none',
    })),
    endAssessmentFocus: scaffold.endAssessmentFocus?.length ? scaffold.endAssessmentFocus : fallback.endAssessmentFocus,
  };
}

function createGenerationMemory(): GuidedChunkGenerationMemory {
  return {
    coveredConcepts: [],
    introducedVocab: [],
    handledMisconceptions: [],
    chunkSummaries: [],
  };
}

function pushUnique(target: string[], values: string[]): void {
  for (const value of values.map(normalizeWhitespace).filter(Boolean)) {
    if (!target.some((existing) => existing.toLowerCase() === value.toLowerCase())) {
      target.push(value);
    }
  }
}

function updateGenerationMemory(
  memory: GuidedChunkGenerationMemory,
  blueprint: GuidedChunkScaffoldChunk,
  teachingCore: string,
  vocabPack: GuidedChunkVocabItem[],
  misconceptionCodes: string[]
): GuidedChunkGenerationMemory {
  pushUnique(memory.coveredConcepts, [...blueprint.mustTeach, teachingCore]);
  pushUnique(memory.introducedVocab, vocabPack.map((item) => item.term));
  pushUnique(memory.handledMisconceptions, misconceptionCodes);
  pushUnique(memory.chunkSummaries, [splitSentences(teachingCore).slice(0, 2).join(' ')]);
  return memory;
}

async function buildChunkFromScaffold(
  input: GuidedChunkGenerationInput,
  scaffold: GuidedChunkLoScaffold,
  blueprint: GuidedChunkScaffoldChunk,
  memory: GuidedChunkGenerationMemory,
  priorChunkTexts: string[]
): Promise<ChunkDraft> {
  const draft = await generateGuidedChunkJson<ChunkDraft>(
    'You are the chunk generation phase of a guided-chunk lesson generator. Return JSON only.',
    buildGuidedChunkChunkPrompt(input, scaffold, blueprint, memory, priorChunkTexts),
    `generation_chunk_${blueprint.chunkId}`
  );

  if (!draft?.teachingCore || countWords(String(draft.teachingCore)) < 35) {
    return buildFallbackChunkDraft(blueprint, input.curriculum);
  }

  return draft;
}

async function buildLoAssessments(
  input: GuidedChunkGenerationInput,
  scaffold: GuidedChunkLoScaffold,
  chunkTexts: string[]
): Promise<LoAssessmentDraft> {
  const draft = await generateGuidedChunkJson<LoAssessmentDraft>(
    'You are the LO assessment phase of a guided-chunk lesson generator. Return JSON only.',
    buildGuidedChunkLoAssessmentPrompt(input, scaffold, chunkTexts),
    `generation_lo_assessment_${scaffold.loId}`
  );

  return draft ?? {};
}

function buildFallbackLoAssessments(scaffold: GuidedChunkLoScaffold): LoAssessmentDraft {
  const focus = scaffold.endAssessmentFocus.length
    ? scaffold.endAssessmentFocus
    : scaffold.chunkBlueprints.flatMap((chunk) => chunk.assessmentTargets ?? chunk.mustTeach).slice(0, 6);
  const vocabPool = scaffold.chunkBlueprints.flatMap((chunk) => chunk.vocab).slice(0, 6);
  const mcqs = (vocabPool.length ? vocabPool : focus.map((item) => ({ term: item, definition: `${item} is part of this lesson.` })))
    .slice(0, 4)
    .map((item, index, arr) => ({
      id: `${scaffold.loId}-MCQ-${index + 1}`,
      prompt: `Which term best matches this definition: ${normalizeWhitespace(item.definition)}`,
      options: [
        item.term,
        ...arr.filter((candidate) => candidate.term !== item.term).map((candidate) => candidate.term).slice(0, 3),
      ],
      correctIndex: 0,
      explanation: `${item.term} matches this definition.`,
    }));

  const shortAnswers = focus.slice(0, 3).map((item, index) => ({
    id: `${scaffold.loId}-S${index + 1}`,
    prompt: `Explain ${item} in one or two sentences.`,
    expectedConcepts: [item],
  }));

  return {
    loTestMcq: {
      intro: `Quick multiple-choice check for ${scaffold.loTitle}.`,
      mcqs,
      shortAnswers: [],
    },
    loTestShortAnswer: {
      intro: `Finish ${scaffold.loTitle} with one short written answer.`,
      mcqs: [],
      shortAnswers,
    },
  };
}

function buildCg2365FallbackSentence(point: string): string {
  const normalized = normalizeWhitespace(point).replace(/[.?!]+$/, '');
  const lower = normalized.toLowerCase();
  if (lower.includes('earthing systems and ads components')) {
    return 'The earth path and the ADS parts work together: the fault current must have a complete route, and the protective device must disconnect in time.';
  }
  if (lower.includes('earthing system types')) {
    return 'The first distinction is how the installation gets its earth path: TT uses an earth electrode, TN-S uses a separate supplier earth, and TN-C-S separates earth and neutral at the intake position.';
  }
  if (lower.includes('ads component parts')) {
    return 'The main ADS parts are the CPC, earthing conductor, bonding, the protective device, and where relevant the earth electrode.';
  }
  if (lower.includes('exposed and extraneous conductive parts')) {
    return 'Start by separating metalwork that belongs to electrical equipment from metalwork that only brings earth potential in from outside the installation.';
  }
  if (lower.includes('exposed conductive parts')) {
    return 'An exposed-conductive-part is metalwork that forms part of electrical equipment and could become live if a fault occurs, such as a metal enclosure or metal trunking.';
  }
  if (lower.includes('extraneous conductive parts')) {
    return 'An extraneous-conductive-part is a conductive item not forming part of the electrical installation that can introduce earth potential, such as a metallic water or gas service.';
  }
  if (lower.includes('earth loop impedance path')) {
    return 'Earth fault loop impedance is the total impedance of the fault path from the source to the fault and back to the source again.';
  }
  if (lower.startsWith('identify ')) {
    return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)} in practical circuit terms, not just as a definition.`;
  }
  if (lower.includes('bonding')) {
    return 'Bonding is about keeping metal parts at a similar potential so touch voltage is reduced during a fault.';
  }
  return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}.`;
}

function buildCg2365FallbackSupport(learningGoal: string): string[] {
  const lower = learningGoal.toLowerCase();
  const extras: string[] = [];
  if (lower.includes('earthing system')) {
    extras.push('The first check is how the earth path is provided, because that affects testing, fault current, and the protective arrangement for the whole installation.');
  }
  if (lower.includes('ads')) {
    extras.push('ADS depends on both a complete fault path and a device that will disconnect within the required time.');
  }
  if (lower.includes('earth loop')) {
    extras.push('That is why the full loop path matters: every part of the route contributes to whether the fault current will be high enough to operate the device.');
  }
  if (lower.includes('tn-s') || lower.includes('tn-c-s') || lower.includes('tt')) {
    extras.push('If you identify the wrong earthing system, you can misread the expected test results and the safety arrangement of the installation.');
  }
  return extras;
}

function buildFallbackTeachingFromBlueprint(
  blueprint: GuidedChunkScaffoldChunk,
  curriculum?: GuidedChunkGenerationInput['curriculum']
): string {
  const sentences = blueprint.mustTeach.map((point) => {
    const trimmed = normalizeWhitespace(point).replace(/[;,.]+$/, '');
    if (/[.?!]$/.test(trimmed)) return trimmed;
    return `${trimmed}.`;
  });
  const curriculumSentences =
    curriculum === 'cg2365'
      ? blueprint.mustTeach.slice(0, 3).map((point) => buildCg2365FallbackSentence(point))
      : [];
  const usableSentences = sentences.filter((sentence) => {
    const normalized = normalizeWhitespace(sentence).replace(/[.?!]+$/, '');
    if (/^unit:\s*\d+/i.test(normalized)) return false;
    if (curriculum === 'cg2365' && isHeadingFragment(normalized)) return false;
    return true;
  });
  const vocabSentences = blueprint.vocab
    .slice(0, 2)
    .filter((item) => !/is a key idea in this lesson/i.test(item.definition))
    .map((item) => `${item.term} means ${normalizeWhitespace(item.definition).replace(/[.?!]+$/, '')}.`);
  const supportSentences =
    curriculum === 'cg2365' ? buildCg2365FallbackSupport(blueprint.learningGoal) : [];
  let teaching = [...curriculumSentences, ...usableSentences, ...vocabSentences].filter(Boolean).join(' ');
  if (curriculum === 'cg2365' && countWords(teaching) < 80) {
    for (const sentence of supportSentences) {
      if (countWords(teaching) >= 85) break;
      teaching = [teaching, sentence].filter(Boolean).join(' ');
    }
  }
  if (teaching) return teaching;
  return `The key point here is ${normalizeWhitespace(blueprint.learningGoal).replace(/[.?!]+$/, '').toLowerCase()}.`;
}

function buildFallbackChunkDraft(
  blueprint: GuidedChunkScaffoldChunk,
  curriculum?: GuidedChunkGenerationInput['curriculum']
): ChunkDraft {
  const teachingCore = buildFallbackTeachingFromBlueprint(blueprint, curriculum);
  return {
    chunkId: blueprint.chunkId,
    learningGoal: blueprint.learningGoal,
    teachingCore,
    vocabPack: blueprint.vocab,
    initialRecallQuestions: buildSpecificRecallQuestions(
      blueprint.chunkId,
      teachingCore,
      blueprint.vocab,
      blueprint.learningGoal,
      curriculum
    ),
    candidateFollowUpModes: ['probe', 'repair'],
    candidateDeeperQuestion: {
      id: `${blueprint.chunkId}-D1`,
      prompt: `In one or two sentences, explain ${blueprint.learningGoal.toLowerCase().replace(/\.$/, '')}.`,
      expectedConcepts: blueprint.assessmentTargets?.length ? blueprint.assessmentTargets : blueprint.mustTeach.slice(0, 3),
    },
    misconceptionCodes: blueprint.misconceptions,
    repairTemplates: blueprint.misconceptions.slice(0, 2).map((code) => ({
      misconceptionCode: code,
      shortCorrection: `Close. Re-focus on ${blueprint.learningGoal.toLowerCase().replace(/\.$/, '')}.`,
      contrastPrompt: `Set the misconception against this correct idea: ${normalizeWhitespace(blueprint.mustTeach[0] ?? blueprint.learningGoal)}.`,
      retryPrompt: 'Try again in one clear sentence.',
    })),
    assetInjection: null,
    microbreakAfter: null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildFallbackFrameFromPlan(input: GuidedChunkGenerationInput, plan: PlanShape | null): GuidedChunkFrame {
  const losFromPlan = Array.isArray(plan?.los) && plan?.los.length ? plan.los : null;
  const sourceLos = splitSourceIntoLos(input.sourceText);

  return {
    lessonId: `gc-${input.lessonCode}`,
    lessonCode: input.lessonCode,
    title: input.title,
    runtimeVersion: 'guided_chunk_v1',
    variantId: `${input.lessonCode}-generated`,
    unit: input.unit,
    topic: input.topic,
    sourceRefs: input.sourceRefs ?? ['guided_chunk_generator'],
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      author: 'guided_chunk_generator',
    },
    loSequence: (losFromPlan ?? sourceLos.map((entry, index) => ({
      loId: `LO${index + 1}`,
      loTitle: entry.title,
      successCriteria: [entry.title],
      reviewHooks: [entry.title],
      chunks: [
        {
          chunkId: `LO${index + 1}-C1`,
          learningGoal: entry.title,
          keyPoints: entry.body.split(/(?<=[.!?])\s+/).slice(0, 3),
          misconceptionCodes: ['not_secure_yet'],
          vocab: [],
        },
      ],
      mcqFocus: [entry.title],
      shortAnswerFocus: [entry.title],
    } as PlanLo))).map((lo, loIndex) => ({
      loId: lo.loId ?? `LO${loIndex + 1}`,
      loTitle: lo.loTitle ?? `Learning outcome ${loIndex + 1}`,
      successCriteria: lo.successCriteria?.length ? lo.successCriteria : [lo.loTitle ?? `Learning outcome ${loIndex + 1}`],
      reviewHooks: lo.reviewHooks?.length ? lo.reviewHooks : [lo.loTitle ?? `Learning outcome ${loIndex + 1}`],
      chunkPlan: (lo.chunks?.length ? lo.chunks : [{
        chunkId: `${lo.loId ?? `LO${loIndex + 1}`}-C1`,
        learningGoal: lo.loTitle ?? `Learning outcome ${loIndex + 1}`,
        keyPoints: sourceLos[loIndex]?.body.split(/(?<=[.!?])\s+/).slice(0, 3) ?? [input.sourceText],
        misconceptionCodes: ['not_secure_yet'],
        vocab: [],
      }]).map((chunk, chunkIndex) => {
        const teachingCoreSource = (chunk.keyPoints?.length ? chunk.keyPoints : [chunk.learningGoal ?? lo.loTitle ?? input.topic]).join(' ');
        const normalizedTeaching = clampTeachingCore(teachingCoreSource);
        return {
          chunkId: chunk.chunkId ?? `${lo.loId ?? `LO${loIndex + 1}`}-C${chunkIndex + 1}`,
          chunkIndex,
          learningGoal: chunk.learningGoal ?? `Chunk ${chunkIndex + 1}`,
          teachingCore: normalizedTeaching.teachingCore,
          teachingWordCount: normalizedTeaching.teachingWordCount,
          vocabPack: (chunk.vocab ?? []).slice(0, 3),
          initialRecallQuestions: [
            {
              id: `${lo.loId ?? `LO${loIndex + 1}`}-C${chunkIndex + 1}-Q1`,
              prompt: `What is the main idea of this step about ${chunk.learningGoal ?? lo.loTitle ?? input.topic}?`,
              expectedConcepts: (chunk.keyPoints ?? [chunk.learningGoal ?? lo.loTitle ?? input.topic]).slice(0, 2),
            },
            {
              id: `${lo.loId ?? `LO${loIndex + 1}`}-C${chunkIndex + 1}-Q2`,
              prompt: `State one important point from this chunk.`,
              expectedConcepts: (chunk.keyPoints ?? [chunk.learningGoal ?? lo.loTitle ?? input.topic]).slice(0, 2),
            },
            {
              id: `${lo.loId ?? `LO${loIndex + 1}`}-C${chunkIndex + 1}-Q3`,
              prompt: `What should you remember before moving on?`,
              expectedConcepts: (chunk.keyPoints ?? [chunk.learningGoal ?? lo.loTitle ?? input.topic]).slice(0, 2),
            },
          ],
          candidateFollowUpModes: ['probe', 'repair'],
          candidateDeeperQuestion: {
            id: `${lo.loId ?? `LO${loIndex + 1}`}-C${chunkIndex + 1}-D1`,
            prompt: `Explain this idea in one or two sentences in your own words.`,
            expectedConcepts: (chunk.keyPoints ?? [chunk.learningGoal ?? lo.loTitle ?? input.topic]).slice(0, 3),
          },
          misconceptionCodes: chunk.misconceptionCodes?.length ? chunk.misconceptionCodes : ['not_secure_yet'],
          repairTemplates: [
            {
              misconceptionCode: chunk.misconceptionCodes?.[0] ?? 'not_secure_yet',
              shortCorrection: 'Close. Tighten the core idea before moving on.',
              contrastPrompt: 'What is the clearest version of the key point here?',
              retryPrompt: 'Try again in one short sentence.',
            },
          ],
          assetInjection: null,
          microbreakAfter: null,
          advanceRule: {
            minAcceptedRecallAnswers: 2,
            maxRepairLoops: 1,
            allowAdvanceOnFlaggedWeakness: true,
          },
        };
      }),
      loTestMcq: {
        intro: `Quick multiple-choice check for ${lo.loTitle ?? `LO ${loIndex + 1}`}.`,
        mcqs: (lo.mcqFocus?.length ? lo.mcqFocus : [lo.loTitle ?? `LO ${loIndex + 1}`]).slice(0, 3).map((focus, index) => ({
          id: `${lo.loId ?? `LO${loIndex + 1}`}-M${index + 1}`,
          prompt: `Which option best matches this taught point: ${focus}?`,
          options: [focus, `Not ${focus}`, 'Irrelevant option', 'Another distractor'],
          correctIndex: 0,
          explanation: `This matches the taught point: ${focus}.`,
        })),
        shortAnswers: [],
      },
      loTestShortAnswer: {
        intro: `Finish ${lo.loTitle ?? `LO ${loIndex + 1}`} with one short written answer.`,
        mcqs: [],
        shortAnswers: (lo.shortAnswerFocus?.length ? lo.shortAnswerFocus : [lo.loTitle ?? `LO ${loIndex + 1}`]).slice(0, 2).map((focus, index) => ({
          id: `${lo.loId ?? `LO${loIndex + 1}`}-S${index + 1}`,
          prompt: `Explain this taught point in one or two sentences: ${focus}.`,
          expectedConcepts: [focus],
        })),
      },
    })),
  };
}

export async function generateGuidedChunkFrame(
  input: GuidedChunkGenerationInput
): Promise<GuidedChunkGenerationResult> {
  const artifacts: GuidedChunkGenerationPhaseArtifact[] = [];

  const plan = await generateGuidedChunkJson<PlanShape>(
    'You are phase 1 to 6 of a guided-chunk lesson generator. Return JSON only.',
    buildGuidedChunkPlanPrompt(input),
    'generation_plan'
  );
  artifacts.push({ phase: 6, name: 'plan', output: plan });

  const planLos = Array.isArray(plan?.los) && plan.los.length ? plan.los : buildFallbackPlanLos(input);

  const loSequence: GuidedChunkLo[] = [];

  for (const [loIndex, planLo] of planLos.entries()) {
    const scaffold = await buildLoScaffold(input, planLo as PlanLo, loIndex);
    artifacts.push({ phase: 7 + loIndex, name: `lo_scaffold_${scaffold.loId}`, output: scaffold });

    const memory = createGenerationMemory();
    const priorChunkTexts: string[] = [];
    const chunkPlan = [];

    for (const [chunkIndex, blueprint] of scaffold.chunkBlueprints.entries()) {
      const chunkDraft = await buildChunkFromScaffold(input, scaffold, blueprint, memory, priorChunkTexts);
      artifacts.push({ phase: 20 + loIndex * 10 + chunkIndex, name: `chunk_draft_${blueprint.chunkId}`, output: chunkDraft });

      const teachingCore = normalizeWhitespace(String(chunkDraft.teachingCore ?? blueprint.mustTeach.join(' ')));
      const vocabPack = (chunkDraft.vocabPack ?? blueprint.vocab ?? []).slice(0, 4);
      const misconceptionCodes = chunkDraft.misconceptionCodes?.length ? chunkDraft.misconceptionCodes : blueprint.misconceptions;

      chunkPlan.push({
        chunkId: chunkDraft.chunkId ?? blueprint.chunkId,
        chunkIndex,
        learningGoal: chunkDraft.learningGoal ?? blueprint.learningGoal,
        teachingCore,
        teachingWordCount: countWords(teachingCore),
        vocabPack,
        initialRecallQuestions: (chunkDraft.initialRecallQuestions ?? []).map((question, questionIdx) => ({
          id: question.id ?? `${blueprint.chunkId}-Q${questionIdx + 1}`,
          prompt: String(question.prompt ?? ''),
          expectedConcepts: ensureStringArray(question.expectedConcepts),
        })),
        candidateFollowUpModes: chunkDraft.candidateFollowUpModes?.length ? chunkDraft.candidateFollowUpModes : ['probe', 'repair'],
        candidateDeeperQuestion: chunkDraft.candidateDeeperQuestion
          ? {
              id: chunkDraft.candidateDeeperQuestion.id ?? `${blueprint.chunkId}-D1`,
              prompt: String(chunkDraft.candidateDeeperQuestion.prompt ?? ''),
              expectedConcepts: ensureStringArray(chunkDraft.candidateDeeperQuestion.expectedConcepts),
            }
          : null,
        misconceptionCodes,
        repairTemplates: (chunkDraft.repairTemplates ?? []).map((template, templateIdx) =>
          ensureRepairTemplate(template, misconceptionCodes[templateIdx] ?? misconceptionCodes[0] ?? 'not_secure_yet')
        ),
        assetInjection: null,
        microbreakAfter: null,
        advanceRule: {
          minAcceptedRecallAnswers: 2,
          maxRepairLoops: 1,
          allowAdvanceOnFlaggedWeakness: true,
        },
      });

      priorChunkTexts.push(teachingCore);
      updateGenerationMemory(memory, blueprint, teachingCore, vocabPack, misconceptionCodes);
    }

    const loAssessmentsDraft = await buildLoAssessments(input, scaffold, priorChunkTexts);
    const loAssessments =
      loAssessmentsDraft.loTestMcq?.mcqs?.length || loAssessmentsDraft.loTestShortAnswer?.shortAnswers?.length
        ? loAssessmentsDraft
        : buildFallbackLoAssessments(scaffold);
    artifacts.push({ phase: 30 + loIndex, name: `lo_assessment_${scaffold.loId}`, output: loAssessments });

    loSequence.push({
      loId: scaffold.loId,
      loTitle: scaffold.loTitle,
      successCriteria: scaffold.successCriteria,
      reviewHooks: scaffold.reviewHooks,
      chunkPlan,
      loTestMcq: {
        intro: String(loAssessments.loTestMcq?.intro ?? `Quick multiple-choice check for ${scaffold.loTitle}.`),
        mcqs: (loAssessments.loTestMcq?.mcqs ?? []).map((mcq, index) => ({
          id: mcq.id ?? `${scaffold.loId}-MCQ-${index + 1}`,
          prompt: String(mcq.prompt ?? ''),
          options: ensureStringArray(mcq.options).slice(0, 4),
          correctIndex: typeof mcq.correctIndex === 'number' ? mcq.correctIndex : 0,
          explanation: String(mcq.explanation ?? ''),
        })),
        shortAnswers: [],
      },
      loTestShortAnswer: {
        intro: String(loAssessments.loTestShortAnswer?.intro ?? `Finish ${scaffold.loTitle} with one short written answer.`),
        mcqs: [],
        shortAnswers: (loAssessments.loTestShortAnswer?.shortAnswers ?? []).map((question, index) => ({
          id: question.id ?? `${scaffold.loId}-S${index + 1}`,
          prompt: String(question.prompt ?? ''),
          expectedConcepts: ensureStringArray(question.expectedConcepts),
        })),
      },
    });
  }

  const baseFrame: GuidedChunkFrame = {
    lessonId: `gc-${input.lessonCode}`,
    lessonCode: input.lessonCode,
    title: input.title,
    runtimeVersion: 'guided_chunk_v1',
    variantId: `${input.lessonCode}-generated`,
    unit: input.unit,
    topic: input.topic,
    sourceRefs: input.sourceRefs ?? ['guided_chunk_generator'],
    metadata: {
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      author: 'guided_chunk_generator',
    },
    loSequence,
  };

  let frame = normalizeFrame(baseFrame, input);
  let score = await scoreGuidedChunkFrame(frame, input);
  let validation = validateGuidedChunkFrame(frame);
  artifacts.push({ phase: 13, name: 'frame', output: frame });
  artifacts.push({ phase: 14, name: 'score', output: score });
  artifacts.push({ phase: 15, name: 'validation', output: validation });

  const shouldRefine = score.total < 85 || !validation.passed;
  if (shouldRefine) {
    const refinedRaw = await generateGuidedChunkJson<GuidedChunkFrame>(
      'You are phase 14 refinement for a guided-chunk lesson generator. Return JSON only.',
      buildGuidedChunkRefinePrompt(input, frame, {
        summary: score.summary,
        issues: score.issues,
      }),
      'generation_refine'
    );

    if (refinedRaw && Array.isArray(refinedRaw.loSequence) && refinedRaw.loSequence.length > 0) {
      const refinedFrame = normalizeFrame(
        {
          ...refinedRaw,
          lessonId: refinedRaw.lessonId || frame.lessonId,
        },
        input
      );
      const refinedScore = await scoreGuidedChunkFrame(refinedFrame, input);
      const refinedValidation = validateGuidedChunkFrame(refinedFrame);
      artifacts.push({ phase: 16, name: 'refined_frame', output: refinedFrame });
      artifacts.push({ phase: 17, name: 'refined_score', output: refinedScore });
      artifacts.push({ phase: 18, name: 'refined_validation', output: refinedValidation });

      const improvedEnough =
        refinedValidation.passed &&
        (refinedScore.total > score.total || (refinedScore.total === score.total && refinedScore.grade === 'ship'));

      if (improvedEnough) {
        frame = refinedFrame;
        score = refinedScore;
        validation = refinedValidation;
      }
    }
  }

  return { frame, artifacts, score, validation };
}
