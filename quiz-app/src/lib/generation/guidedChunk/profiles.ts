export type GuidedChunkCurriculumKey = 'cg2365' | 'gcse-biology' | 'gcse-physics';

export interface GuidedChunkCurriculumProfile {
  key: GuidedChunkCurriculumKey;
  label: string;
  audienceInstruction: string;
  toneInstruction: string;
  chunkInstruction: string;
  questionInstruction: string;
  scoringPriorities: string[];
}

const PROFILES: Record<GuidedChunkCurriculumKey, GuidedChunkCurriculumProfile> = {
  'cg2365': {
    key: 'cg2365',
    label: 'C&G 2365 Electrical',
    audienceInstruction:
      'Audience is vocational electrical trainees. Prioritize technical precision, safe terminology, and circuit reasoning.',
    toneInstruction:
      'Use a practical, direct, instructor-like tone. Use plain spoken electrical language, not textbook notes or etymology digressions. Avoid childish examples. Keep the learner moving.',
    chunkInstruction:
      'Teach one practical idea at a time in compact chunks that support circuit understanding, not wordy exposition, standards-note prose, or mnemonic-heavy explanation.',
    questionInstruction:
      'Use quick recall on conductor roles, sequence, safety logic, and diagnostic distinctions before moving deeper.',
    scoringPriorities: ['technical correctness', 'safety language', 'conductor role clarity', 'miswiring misconception repair'],
  },
  'gcse-biology': {
    key: 'gcse-biology',
    label: 'GCSE Biology',
    audienceInstruction:
      'Audience is GCSE Biology learners. Keep explanations accessible, concrete, and age-appropriate without dumbing down the science.',
    toneInstruction:
      'Use a warm, clear, confidence-building tutoring tone. Prefer concrete examples before abstract exam phrasing.',
    chunkInstruction:
      'Use short chunks that explain one biological process, structure, or relationship at a time. Clarify key terminology in context.',
    questionInstruction:
      'Use quick checks on core definitions, process steps, comparisons, and cause-effect reasoning before asking a deeper application question.',
    scoringPriorities: ['concept clarity', 'exam-language readiness', 'misconception separation', 'process explanation', 'term accuracy'],
  },
  'gcse-physics': {
    key: 'gcse-physics',
    label: 'GCSE Physics',
    audienceInstruction:
      'Audience is GCSE Physics learners. Explain clearly with concrete situations, avoiding algebraic overload too early.',
    toneInstruction:
      'Use a warm but precise tutoring tone. Build confidence while keeping cause-effect reasoning sharp.',
    chunkInstruction:
      'Keep chunks focused on one physical relationship, model, or calculation step at a time.',
    questionInstruction:
      'Use quick recall on definitions, units, and relationships before moving to explanation or calculation transfer.',
    scoringPriorities: ['model clarity', 'formula interpretation', 'unit awareness', 'common misconception separation'],
  },
};

export function getGuidedChunkCurriculumProfile(key?: string | null): GuidedChunkCurriculumProfile {
  if (key === 'gcse-science-biology' || key === 'gcse-biology') return PROFILES['gcse-biology'];
  if (key === 'gcse-science-physics' || key === 'gcse-physics') return PROFILES['gcse-physics'];
  return PROFILES.cg2365;
}
