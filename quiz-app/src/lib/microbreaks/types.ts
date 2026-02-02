/**
 * Session tracking for microbreak triggers
 */
export interface MicrobreakSession {
  lessonId: string;
  sessionStart: Date;
  lastBreakAt?: Date;
  questionsAnswered: number;
  responseTimes: number[]; // Track last 10 response times
  breaksTaken: number;
}

export interface MicrobreakTelemetry {
  lessonId: string;
  breakId: string;
  breakType: 'rest' | 'game';
  gameType?: string;
  startedAt: Date;
  completedAt?: Date;
  skipped: boolean;
  gameScore?: number; // For games with scoring
  gameAccuracy?: number; // Percentage correct
}
