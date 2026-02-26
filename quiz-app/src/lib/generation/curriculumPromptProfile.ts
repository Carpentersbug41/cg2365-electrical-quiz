import { GenerationRequest } from './types';

export interface CurriculumPromptProfile {
  key: 'cg2365' | 'gcse-physics';
  programLabel: string;
  learnerLabel: string;
  authorLabel: string;
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
    };
  }

  return {
    key: 'cg2365',
    programLabel: 'C&G 2365 Electrical Training',
    learnerLabel: 'C&G 2365 Electrical trainees',
    authorLabel: 'C&G 2365 Learning Team',
  };
}
