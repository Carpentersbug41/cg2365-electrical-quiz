export type GcseBiologyPhase1TargetLesson = {
  lessonCode: string;
  title: string;
  unitCode: string;
  orderIndex: number;
};

export const GCSE_BIOLOGY_PHASE1_TARGET: GcseBiologyPhase1TargetLesson[] = [
  {
    lessonCode: 'BIO-101-1A',
    title: 'Cell Structure Basics',
    unitCode: 'BIO-101',
    orderIndex: 1,
  },
  {
    lessonCode: 'BIO-101-1B',
    title: 'Microscopy and Magnification',
    unitCode: 'BIO-101',
    orderIndex: 2,
  },
  {
    lessonCode: 'BIO-102-1A',
    title: 'Diffusion and Osmosis',
    unitCode: 'BIO-102',
    orderIndex: 3,
  },
  {
    lessonCode: 'BIO-102-1B',
    title: 'Active Transport and Exchange Surfaces',
    unitCode: 'BIO-102',
    orderIndex: 4,
  },
  {
    lessonCode: 'BIO-103-1A',
    title: 'DNA, Genes, and Chromosomes',
    unitCode: 'BIO-103',
    orderIndex: 5,
  },
  {
    lessonCode: 'BIO-103-1B',
    title: 'Variation and Inheritance',
    unitCode: 'BIO-103',
    orderIndex: 6,
  },
  {
    lessonCode: 'BIO-104-1A',
    title: 'Enzymes and Factors Affecting Rate',
    unitCode: 'BIO-104',
    orderIndex: 7,
  },
];

export function getGcseBiologyPhase1TargetCodes(): string[] {
  return GCSE_BIOLOGY_PHASE1_TARGET.map((lesson) => lesson.lessonCode);
}
