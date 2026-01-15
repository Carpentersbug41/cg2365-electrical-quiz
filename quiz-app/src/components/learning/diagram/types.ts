/**
 * Diagram Component Types
 */

import { Block } from '@/data/lessons/types';

export interface DiagramStageProps {
  block: Block;
  highlightedElements: string[];
  onAction: (action: 'highlight' | 'focus' | 'clear' | 'jumpToTimestamp', elementIds?: string[]) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}






