/**
 * Layout Component Types
 */

import { Lesson } from '@/data/lessons/types';

export interface LayoutProps {
  lesson: Lesson;
}

export interface DiagramControlAction {
  action: 'highlight' | 'focus' | 'clear';
  elementIds?: string[];
}






