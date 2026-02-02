import { MicrobreakTelemetry } from './types';

const TELEMETRY_KEY = 'microbreak-telemetry';

/**
 * Log microbreak telemetry data to localStorage
 */
export function logMicrobreakTelemetry(data: MicrobreakTelemetry): void {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = JSON.parse(localStorage.getItem(TELEMETRY_KEY) || '[]');
    existing.push(data);
    
    // Keep only last 1000 entries to prevent unbounded growth
    if (existing.length > 1000) {
      existing.shift();
    }
    
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(existing));
    
    // Log for debugging
    console.log('📊 Microbreak telemetry logged:', {
      lessonId: data.lessonId,
      breakType: data.breakType,
      gameType: data.gameType,
      skipped: data.skipped,
      accuracy: data.gameAccuracy
    });
  } catch (error) {
    console.error('Failed to log microbreak telemetry:', error);
  }
}

/**
 * Get all microbreak telemetry, optionally filtered by lesson ID
 */
export function getMicrobreakTelemetry(lessonId?: string): MicrobreakTelemetry[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = JSON.parse(localStorage.getItem(TELEMETRY_KEY) || '[]');
    return lessonId ? data.filter((t: MicrobreakTelemetry) => t.lessonId === lessonId) : data;
  } catch {
    return [];
  }
}

/**
 * Get microbreak statistics for a lesson
 */
export function getMicrobreakStats(lessonId?: string): {
  totalBreaks: number;
  completedBreaks: number;
  skippedBreaks: number;
  completionRate: number;
  averageAccuracy: number;
  gameTypeBreakdown: Record<string, number>;
} {
  const telemetry = getMicrobreakTelemetry(lessonId);
  
  const totalBreaks = telemetry.length;
  const completedBreaks = telemetry.filter(t => !t.skipped && t.completedAt).length;
  const skippedBreaks = telemetry.filter(t => t.skipped).length;
  const completionRate = totalBreaks > 0 ? (completedBreaks / totalBreaks) * 100 : 0;
  
  // Calculate average accuracy for completed games
  const gamesWithAccuracy = telemetry.filter(t => 
    !t.skipped && t.gameAccuracy !== undefined && t.gameAccuracy !== null
  );
  const averageAccuracy = gamesWithAccuracy.length > 0
    ? gamesWithAccuracy.reduce((sum, t) => sum + (t.gameAccuracy || 0), 0) / gamesWithAccuracy.length
    : 0;
  
  // Game type breakdown
  const gameTypeBreakdown: Record<string, number> = {};
  telemetry.forEach(t => {
    if (t.breakType === 'game' && t.gameType) {
      gameTypeBreakdown[t.gameType] = (gameTypeBreakdown[t.gameType] || 0) + 1;
    } else if (t.breakType === 'rest') {
      gameTypeBreakdown['rest'] = (gameTypeBreakdown['rest'] || 0) + 1;
    }
  });
  
  return {
    totalBreaks,
    completedBreaks,
    skippedBreaks,
    completionRate,
    averageAccuracy,
    gameTypeBreakdown
  };
}

/**
 * Clear all telemetry data (for testing/debugging)
 */
export function clearMicrobreakTelemetry(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TELEMETRY_KEY);
  console.log('🗑️ Microbreak telemetry cleared');
}

/**
 * Export telemetry as JSON (for analysis/debugging)
 */
export function exportMicrobreakTelemetry(): string {
  const telemetry = getMicrobreakTelemetry();
  return JSON.stringify(telemetry, null, 2);
}
