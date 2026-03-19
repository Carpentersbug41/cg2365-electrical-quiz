import rawLesson from '@/data/lessons/2365/204-11B-proving-your-tester-works.json';

export type ConceptVariant = 'identity' | 'readiness';

type LessonIdentity = {
  id: string;
  title: string;
  description: string;
  layout: string;
  unit: string;
  topic: string;
  learningOutcomes: string[];
  prerequisites: string[];
};

function repairText(value: string): string {
  return value
    .replaceAll('â€”', '—')
    .replaceAll('â†’', '→')
    .replaceAll('Î©', 'Ω')
    .replaceAll('â€™', '’')
    .replaceAll('â€œ', '“')
    .replaceAll('â€', '”');
}

export const lesson20411B: LessonIdentity = {
  id: rawLesson.id,
  title: repairText(rawLesson.title),
  description: repairText(rawLesson.description),
  layout: rawLesson.layout,
  unit: rawLesson.unit,
  topic: rawLesson.topic,
  learningOutcomes: rawLesson.learningOutcomes.map(repairText),
  prerequisites: rawLesson.prerequisites.map(repairText),
};

export const conceptIdeas = [
  {
    title: 'Vocabulary Wall',
    description:
      'Turn the vocab block into a tactile glossary gallery with oversized terms, flipping definition cards, and callout wiring labels.',
  },
  {
    title: 'Prove → Test → Re-prove',
    description:
      'Build a single-scroll ritual page that treats the proving routine like a professional workflow rather than lesson text.',
  },
  {
    title: 'Fault Diagnosis Stories',
    description:
      'Use the practice questions as scenario cards with instrument states, expected readings, and reveal-on-hover decisions.',
  },
  {
    title: 'Bench Simulation Briefing',
    description:
      'Frame the spaced review and prerequisites as a pre-lab readiness board with rig status, tools, and safety checks.',
  },
];
