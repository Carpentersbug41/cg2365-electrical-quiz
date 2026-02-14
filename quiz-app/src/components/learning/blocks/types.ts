/**
 * Block Component Types
 */

import { Block } from '@/data/lessons/types';

export interface BlockProps {
  block: Block;
  lessonId?: string;
}

export interface PracticeBlockProps extends BlockProps {
  onAnswer?: (questionId: string, answer: string) => void;
  showFeedback?: boolean;
}






