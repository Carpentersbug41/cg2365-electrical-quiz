import { GenerationRequest } from './types';

export interface CurriculumPromptProfile {
  key: 'cg2365' | 'gcse-physics';
  programLabel: string;
  learnerLabel: string;
  authorLabel: string;
  toneInstruction: string;
  audienceInstruction: string;
}

function hasGcsePhysicsSignal(text: string | undefined): boolean {
  if (!text) return false;
  const value = text.toLowerCase();
  return value.includes('gcse') && value.includes('physics');
}

export function getCurriculumPromptProfile(request: GenerationRequest): CurriculumPromptProfile {
  if (request.curriculum === 'gcse-science-physics') {
    return {
      key: 'gcse-physics',
      programLabel: 'GCSE Physics',
      learnerLabel: 'GCSE Physics learners',
      authorLabel: 'GCSE Science Learning Team',
      toneInstruction:
        'Use a fun, warm, engaging tone. Keep language age-appropriate and confidence-building for younger learners.',
      audienceInstruction:
        'Primary audience is a 12-year-old girl studying GCSE Physics. Explain clearly, use relatable examples, and avoid dense jargon.',
    };
  }

  const gcseSignals = [
    request.section,
    request.topic,
    request.additionalInstructions,
    request.mustHaveTopics,
  ];

  if (gcseSignals.some((value) => hasGcsePhysicsSignal(value))) {
    return {
      key: 'gcse-physics',
      programLabel: 'GCSE Physics',
      learnerLabel: 'GCSE Physics learners',
      authorLabel: 'GCSE Science Learning Team',
      toneInstruction:
        'Use a fun, warm, engaging tone. Keep language age-appropriate and confidence-building for younger learners.',
      audienceInstruction:
        'Primary audience is a 12-year-old girl studying GCSE Physics. Explain clearly, use relatable examples, and avoid dense jargon.',
    };
  }

  return {
    key: 'cg2365',
    programLabel: 'C&G 2365 Electrical Training',
    learnerLabel: 'C&G 2365 Electrical trainees',
    authorLabel: 'C&G 2365 Learning Team',
    toneInstruction:
      'Use a practical, professional training tone suitable for vocational electrical trainees.',
    audienceInstruction:
      'Audience is Level 2 electrical trainees; prioritize job-relevant clarity, safe practice language, and technical precision.',
  };
}
