'use client';

import { useState } from 'react';
import type { Block } from '@/data/lessons/types';
import OutcomesBlock from '@/components/learning/blocks/OutcomesBlock';
import VocabBlock from '@/components/learning/blocks/VocabBlock';
import ExplanationBlock from '@/components/learning/blocks/ExplanationBlock';
import WorkedExampleBlock from '@/components/learning/blocks/WorkedExampleBlock';
import GuidedPracticeBlock from '@/components/learning/blocks/GuidedPracticeBlock';
import PracticeBlock from '@/components/learning/blocks/PracticeBlock';
import SpacedReviewBlock from '@/components/learning/blocks/SpacedReviewBlock';
import SocraticVoiceBlock from '@/components/learning/blocks/SocraticVoiceBlock';
import DiagramStage from '@/components/learning/diagram/DiagramStage';
import MicrobreakBlock from '@/components/learning/microbreaks/MicrobreakBlock';

interface Props {
  block: Block;
  lessonId: string;
}

export default function LessonBlockPreview({ block, lessonId }: Props) {
  const [highlightedElements, setHighlightedElements] = useState<string[]>([]);
  const [diagramExpanded, setDiagramExpanded] = useState(false);

  const handleDiagramAction = (
    action: 'highlight' | 'focus' | 'clear' | 'jumpToTimestamp',
    elementIds?: string[]
  ) => {
    if (action === 'clear') {
      setHighlightedElements([]);
      return;
    }
    if (action === 'jumpToTimestamp') return;
    if (elementIds) setHighlightedElements(elementIds);
  };

  switch (block.type) {
    case 'outcomes':
      return <OutcomesBlock block={block} lessonId={lessonId} />;
    case 'vocab':
      return <VocabBlock block={block} lessonId={lessonId} />;
    case 'explanation':
      return <ExplanationBlock block={block} lessonId={lessonId} />;
    case 'worked-example':
      return <WorkedExampleBlock block={block} lessonId={lessonId} />;
    case 'guided-practice':
      return <GuidedPracticeBlock block={block} lessonId={lessonId} />;
    case 'practice':
      return <PracticeBlock block={block} lessonId={lessonId} />;
    case 'spaced-review':
      return <SpacedReviewBlock block={block} lessonId={lessonId} />;
    case 'socratic':
      return <SocraticVoiceBlock block={block} lessonId={lessonId} />;
    case 'microbreak':
      return <MicrobreakBlock block={block} lessonId={lessonId} />;
    case 'diagram':
      return (
        <DiagramStage
          block={block}
          highlightedElements={highlightedElements}
          onAction={handleDiagramAction}
          isExpanded={diagramExpanded}
          onToggleExpand={() => setDiagramExpanded((prev) => !prev)}
        />
      );
    default:
      return null;
  }
}
