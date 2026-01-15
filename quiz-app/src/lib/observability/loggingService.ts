/**
 * Structured Logging Service
 * Provides observability for tutor, marking, and progress events
 * Structured logs make it easy to grep and analyze patterns
 */

/**
 * Log level
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log event types
 */
export type LogEventType =
  | 'tutor-request'
  | 'tutor-response'
  | 'tutor-error'
  | 'grounding-failure'
  | 'grounding-retry'
  | 'marking-request'
  | 'marking-response'
  | 'marking-error'
  | 'golden-set-result'
  | 'context-budget-applied'
  | 'security-injection-detected'
  | 'variant-generated'
  | 'mastery-pending'
  | 'mastery-confirmed'
  | 'migration-applied'
  | 'rate-limit-exceeded';

/**
 * Structured log entry
 */
export interface LogEntry {
  timestamp: string; // ISO 8601
  level: LogLevel;
  eventType: LogEventType;
  message: string;
  metadata?: Record<string, unknown>;
  duration?: number; // milliseconds
  error?: {
    message: string;
    stack?: string;
  };
}

/**
 * Log storage (in-memory for now, could be sent to server)
 */
class LogStore {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs

  add(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Trim old logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console with structured format
    this.logToConsole(entry);
  }

  private logToConsole(entry: LogEntry): void {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.eventType}]`;
    const message = entry.message;
    const metadata = entry.metadata ? JSON.stringify(entry.metadata) : '';

    const fullMessage = metadata ? `${prefix} ${message} | ${metadata}` : `${prefix} ${message}`;

    switch (entry.level) {
      case 'error':
        console.error(fullMessage, entry.error);
        break;
      case 'warn':
        console.warn(fullMessage);
        break;
      case 'debug':
        console.debug(fullMessage);
        break;
      default:
        console.log(fullMessage);
    }
  }

  getLogs(filters?: {
    eventType?: LogEventType;
    level?: LogLevel;
    since?: Date;
  }): LogEntry[] {
    let filtered = this.logs;

    if (filters?.eventType) {
      filtered = filtered.filter(log => log.eventType === filters.eventType);
    }

    if (filters?.level) {
      filtered = filtered.filter(log => log.level === filters.level);
    }

    if (filters?.since) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= filters.since!);
    }

    return filtered;
  }

  clear(): void {
    this.logs = [];
  }

  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Global log store
const logStore = new LogStore();

/**
 * Create a structured log entry
 */
function createLogEntry(
  level: LogLevel,
  eventType: LogEventType,
  message: string,
  metadata?: Record<string, unknown>,
  duration?: number,
  error?: Error
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    eventType,
    message,
  };

  if (metadata) {
    entry.metadata = metadata;
  }

  if (duration !== undefined) {
    entry.duration = duration;
  }

  if (error) {
    entry.error = {
      message: error.message,
      stack: error.stack,
    };
  }

  return entry;
}

/**
 * Log tutor request
 */
export function logTutorRequest(
  mode: string,
  lessonId?: string,
  blockIds?: string[],
  metadata?: Record<string, unknown>
): void {
  const entry = createLogEntry('info', 'tutor-request', `Tutor request: ${mode}`, {
    mode,
    lessonId,
    blockIdsCount: blockIds?.length,
    ...metadata,
  });
  logStore.add(entry);
}

/**
 * Log tutor response
 */
export function logTutorResponse(
  mode: string,
  responseTime: number,
  blockReferences?: string[],
  metadata?: Record<string, unknown>
): void {
  const entry = createLogEntry('info', 'tutor-response', `Tutor response: ${mode}`, {
    mode,
    blockReferencesCount: blockReferences?.length,
    ...metadata,
  }, responseTime);
  logStore.add(entry);
}

/**
 * Log tutor error
 */
export function logTutorError(
  mode: string,
  error: Error,
  metadata?: Record<string, unknown>
): void {
  const entry = createLogEntry('error', 'tutor-error', `Tutor error: ${mode}`, {
    mode,
    ...metadata,
  }, undefined, error);
  logStore.add(entry);
}

/**
 * Log grounding failure
 */
export function logGroundingFailure(
  lessonId: string,
  reason: string,
  retryAttempt?: number
): void {
  const entry = createLogEntry(
    'warn',
    retryAttempt ? 'grounding-retry' : 'grounding-failure',
    `Grounding ${retryAttempt ? 'retry' : 'failure'}: ${reason}`,
    { lessonId, retryAttempt }
  );
  logStore.add(entry);
}

/**
 * Log marking request
 */
export function logMarkingRequest(
  questionId: string,
  answerType: string,
  metadata?: Record<string, unknown>
): void {
  const entry = createLogEntry('info', 'marking-request', `Marking request: ${questionId}`, {
    questionId,
    answerType,
    ...metadata,
  });
  logStore.add(entry);
}

/**
 * Log marking response
 */
export function logMarkingResponse(
  questionId: string,
  isCorrect: boolean,
  misconceptionCode?: string,
  metadata?: Record<string, unknown>
): void {
  const entry = createLogEntry('info', 'marking-response', `Marking result: ${isCorrect ? 'correct' : 'incorrect'}`, {
    questionId,
    isCorrect,
    misconceptionCode,
    ...metadata,
  });
  logStore.add(entry);
}

/**
 * Log marking error
 */
export function logMarkingError(
  questionId: string,
  error: Error,
  metadata?: Record<string, unknown>
): void {
  const entry = createLogEntry('error', 'marking-error', `Marking error: ${questionId}`, {
    questionId,
    ...metadata,
  }, undefined, error);
  logStore.add(entry);
}

/**
 * Log golden set test result
 */
export function logGoldenSetResult(
  testName: string,
  passed: boolean,
  details?: Record<string, unknown>
): void {
  const entry = createLogEntry(
    passed ? 'info' : 'error',
    'golden-set-result',
    `Golden set: ${testName} ${passed ? 'passed' : 'failed'}`,
    { testName, passed, ...details }
  );
  logStore.add(entry);
}

/**
 * Log context budget application
 */
export function logContextBudgetApplied(
  lessonId: string,
  totalBlocks: number,
  includedBlocks: number,
  excludedBlocks: number,
  reason?: string
): void {
  const entry = createLogEntry('info', 'context-budget-applied', `Context budget applied: ${lessonId}`, {
    lessonId,
    totalBlocks,
    includedBlocks,
    excludedBlocks,
    reason,
  });
  logStore.add(entry);
}

/**
 * Log security injection detection
 */
export function logSecurityInjection(
  context: string,
  matches: Array<{ pattern: string; match: string }>
): void {
  const entry = createLogEntry('error', 'security-injection-detected', `Prompt injection detected: ${context}`, {
    context,
    matchCount: matches.length,
    matches,
  });
  logStore.add(entry);
}

/**
 * Log variant generation
 */
export function logVariantGenerated(
  originalQuestionId: string,
  variantType: 'authored' | 'parametric',
  attemptNumber: number
): void {
  const entry = createLogEntry('info', 'variant-generated', `Variant generated: ${variantType}`, {
    originalQuestionId,
    variantType,
    attemptNumber,
  });
  logStore.add(entry);
}

/**
 * Log mastery pending
 */
export function logMasteryPending(
  itemId: string,
  itemType: 'lesson' | 'quiz',
  nextReviewAt: Date
): void {
  const entry = createLogEntry('info', 'mastery-pending', `Mastery pending: ${itemId}`, {
    itemId,
    itemType,
    nextReviewAt: nextReviewAt.toISOString(),
  });
  logStore.add(entry);
}

/**
 * Log mastery confirmed
 */
export function logMasteryConfirmed(
  itemId: string,
  itemType: 'lesson' | 'quiz'
): void {
  const entry = createLogEntry('info', 'mastery-confirmed', `Mastery confirmed: ${itemId}`, {
    itemId,
    itemType,
  });
  logStore.add(entry);
}

/**
 * Log migration applied
 */
export function logMigrationApplied(
  fromVersion: number,
  toVersion: number,
  changesApplied: string[]
): void {
  const entry = createLogEntry('info', 'migration-applied', `Migration: v${fromVersion} → v${toVersion}`, {
    fromVersion,
    toVersion,
    changesCount: changesApplied.length,
    changes: changesApplied,
  });
  logStore.add(entry);
}

/**
 * Log rate limit exceeded
 */
export function logRateLimitExceeded(
  identifier: string,
  endpoint: string
): void {
  const entry = createLogEntry('warn', 'rate-limit-exceeded', `Rate limit exceeded: ${endpoint}`, {
    identifier,
    endpoint,
  });
  logStore.add(entry);
}

/**
 * Get all logs (with optional filters)
 */
export function getLogs(filters?: {
  eventType?: LogEventType;
  level?: LogLevel;
  since?: Date;
}): LogEntry[] {
  return logStore.getLogs(filters);
}

/**
 * Export logs as JSON
 */
export function exportLogs(): string {
  return logStore.export();
}

/**
 * Clear all logs
 */
export function clearLogs(): void {
  logStore.clear();
}

/**
 * Get log statistics
 */
export function getLogStats(): {
  total: number;
  byLevel: Record<LogLevel, number>;
  byEventType: Record<string, number>;
} {
  const logs = logStore.getLogs();
  const byLevel: Record<LogLevel, number> = {
    debug: 0,
    info: 0,
    warn: 0,
    error: 0,
  };
  const byEventType: Record<string, number> = {};

  for (const log of logs) {
    byLevel[log.level]++;
    byEventType[log.eventType] = (byEventType[log.eventType] || 0) + 1;
  }

  return {
    total: logs.length,
    byLevel,
    byEventType,
  };
}


