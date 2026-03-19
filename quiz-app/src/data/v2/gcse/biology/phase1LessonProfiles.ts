import { getGcseBiologyPhase1TargetCodes } from './phase1Target';

export type GcseBiologyPhase1LessonProfile = {
  lessonCode: string;
  topic: string;
  mustHaveTopics: string;
  additionalInstructions: string;
};

const phase1LessonProfiles: Record<string, GcseBiologyPhase1LessonProfile> = {
  'BIO-101-1A': {
    lessonCode: 'BIO-101-1A',
    topic: 'Cell Structure Basics',
    mustHaveTopics: 'eukaryotic cell structure; nucleus; cytoplasm; cell membrane; mitochondria; ribosomes; plant cell structures; animal vs plant cell comparison',
    additionalInstructions: 'Generate a rich GCSE biology lesson for the first cell structure lesson in the Phase 1 sequence.\nTeach the purpose of each organelle clearly before checking recall.\nInclude explicit plant vs animal comparison and a strong spaced-review finish.',
  },
  'BIO-101-1B': {
    lessonCode: 'BIO-101-1B',
    topic: 'Microscopy and Magnification',
    mustHaveTopics: 'light microscope parts; eyepiece lens; objective lens; total magnification calculation; image size; actual size; specimen preparation; microscope practical accuracy',
    additionalInstructions: 'Build directly on cell structure knowledge from BIO-101-1A.\nTeach the microscope method step by step and include magnification calculations with worked examples.\nInclude at least one check or practice sequence that uses the magnification equation in GCSE style.',
  },
  'BIO-102-1A': {
    lessonCode: 'BIO-102-1A',
    topic: 'Diffusion and Osmosis',
    mustHaveTopics: 'diffusion definition; osmosis definition; concentration gradient; partially permeable membrane; movement of particles; movement of water; examples in cells; required practical interpretation',
    additionalInstructions: 'Teach diffusion and osmosis as related but distinct transport processes.\nUse clear particle-language explanations before abstract exam wording.\nInclude practical examples such as perfume diffusion, gas exchange, and osmosis in cells.',
  },
  'BIO-102-1B': {
    lessonCode: 'BIO-102-1B',
    topic: 'Active Transport and Exchange Surfaces',
    mustHaveTopics: 'active transport definition; movement against concentration gradient; energy from respiration; root hair cells; small intestine absorption; exchange surface adaptations; surface area; thin membrane and blood supply',
    additionalInstructions: 'Build on BIO-102-1A by contrasting active transport with diffusion and osmosis.\nMake exchange surface adaptation a major explanatory thread, not a short list.\nInclude exam-style reasoning about why an adaptation increases diffusion or transport rate.',
  },
  'BIO-103-1A': {
    lessonCode: 'BIO-103-1A',
    topic: 'DNA, Genes, and Chromosomes',
    mustHaveTopics: 'DNA; genes; chromosomes; nucleus; inheritance of characteristics; protein instructions; genome; cell division context',
    additionalInstructions: 'Keep the explanation GCSE-simple and definition-led before moving to relationships between DNA, genes, and chromosomes.\nUse clean hierarchy explanations: nucleus contains chromosomes, chromosomes carry genes, genes are sections of DNA.\nInclude misconception checks that separate gene, genome, and chromosome meanings.',
  },
  'BIO-103-1B': {
    lessonCode: 'BIO-103-1B',
    topic: 'Variation and Inheritance',
    mustHaveTopics: 'variation; genetic factors; environmental factors; inherited characteristics; continuous variation; discontinuous variation; sexual reproduction link; examples of traits',
    additionalInstructions: 'Build from BIO-103-1A and keep inheritance tied to observable variation in populations.\nInclude clear comparison of continuous and discontinuous variation with named examples.\nUse practical everyday examples alongside exam phrasing to keep the lesson grounded.',
  },
  'BIO-104-1A': {
    lessonCode: 'BIO-104-1A',
    topic: 'Enzymes and Factors Affecting Rate',
    mustHaveTopics: 'enzymes as biological catalysts; active site; substrate; lock and key model; temperature effects; pH effects; denaturation; rate of reaction interpretation',
    additionalInstructions: 'Teach enzymes as proteins with specific active sites, then connect this to temperature and pH.\nInclude a worked explanation of denaturation and why enzyme activity falls after the optimum.\nMake at least one practice task interpret a rate graph or practical result set.',
  },
};

export function getGcseBiologyPhase1LessonProfile(lessonCode: string): GcseBiologyPhase1LessonProfile | null {
  return phase1LessonProfiles[lessonCode.trim().toUpperCase()] ?? null;
}

export function listGcseBiologyPhase1LessonProfiles(): GcseBiologyPhase1LessonProfile[] {
  return getGcseBiologyPhase1TargetCodes()
    .map((lessonCode) => phase1LessonProfiles[lessonCode])
    .filter((profile): profile is GcseBiologyPhase1LessonProfile => Boolean(profile));
}
