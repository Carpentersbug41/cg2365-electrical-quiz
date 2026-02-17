'use client';

import { BlockProps } from '../blocks/types';
import { MicrobreakContent } from '@/data/lessons/types';
import { logMicrobreakTelemetry } from '@/lib/microbreaks/telemetryService';
import RestMicrobreak from './RestMicrobreak';
import MatchingGame from './games/MatchingGame';
import SortingGame from './games/SortingGame';
import SpotTheErrorGame from './games/SpotTheErrorGame';
import TapToLabelGame from './games/TapToLabelGame';
import QuickWinSprintGame from './games/QuickWinSprintGame';
import AdvancedTextGame from './games/AdvancedTextGame';

export default function MicrobreakBlock({ block }: BlockProps) {
  const content = block.content as MicrobreakContent;
  const startTime = new Date();

  const handleComplete = (score?: number, accuracy?: number) => {
    logMicrobreakTelemetry({
      lessonId: block.id.split('-')[0], // Extract lesson ID from block ID
      breakId: block.id,
      breakType: content.breakType,
      gameType: content.breakType === 'game' ? content.gameType : undefined,
      startedAt: startTime,
      completedAt: new Date(),
      skipped: false,
      gameScore: score,
      gameAccuracy: accuracy,
    });
  };

  const handleSkip = () => {
    logMicrobreakTelemetry({
      lessonId: block.id.split('-')[0],
      breakId: block.id,
      breakType: content.breakType,
      gameType: content.breakType === 'game' ? content.gameType : undefined,
      startedAt: startTime,
      skipped: true,
    });
  };

  if (content.breakType === 'rest') {
    return <RestMicrobreak content={content} onComplete={handleComplete} onSkip={handleSkip} />;
  }

  // Game microbreaks
  switch (content.gameType) {
    case 'matching':
      return <MatchingGame content={content} onComplete={handleComplete} onSkip={handleSkip} />;
    case 'sorting':
      return <SortingGame content={content} onComplete={handleComplete} onSkip={handleSkip} />;
    case 'spot-error':
      return <SpotTheErrorGame content={content} onComplete={handleComplete} onSkip={handleSkip} />;
    case 'tap-label':
      return <TapToLabelGame content={content} onComplete={handleComplete} onSkip={handleSkip} />;
    case 'quick-win':
      return <QuickWinSprintGame content={content} onComplete={handleComplete} onSkip={handleSkip} />;
    case 'sequencing':
    case 'fill-gap':
    case 'is-correct-why':
    case 'diagnosis-ranked':
    case 'classify-two-bins':
    case 'scenario-match':
    case 'formula-build':
    case 'tap-the-line':
    case 'tap-the-word':
    case 'elimination':
      return <AdvancedTextGame content={content} onComplete={handleComplete} onSkip={handleSkip} />;
    default:
      return null;
  }
}
