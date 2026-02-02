/**
 * IndexedDB Storage Service
 * Client-side persistence for quiz attempts and review tracking
 */

// Database configuration
const DB_NAME = 'quizTracking';
const DB_VERSION = 1;
const STORES = {
  ATTEMPTS: 'attempts',
  NEEDS_REVIEW: 'needsReview',
};

// Types
export interface QuizAttemptRecord {
  id?: number;
  questionId: string;
  lessonId: string;
  context: 'diagnostic' | 'lesson' | 'practice';
  userAnswer: number;
  correctAnswer: number;
  confidence: 'not-sure' | 'somewhat-sure' | 'very-sure';
  isCorrect: boolean;
  timestamp: Date;
  misconceptionCode?: string;
}

export interface NeedsReviewRecord {
  questionId: string;
  priority: number; // Higher = more urgent (1-10 scale)
  lastAttemptDate: Date;
  timesWrong: number;
  needsReviewReason: 'high-confidence-wrong' | 'repeated-wrong' | 'low-confidence-correct';
  context: string;
  lessonId: string;
}

// Initialize database
let dbPromise: Promise<IDBDatabase> | null = null;

function initDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not available'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open IndexedDB'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create attempts store
      if (!db.objectStoreNames.contains(STORES.ATTEMPTS)) {
        const attemptsStore = db.createObjectStore(STORES.ATTEMPTS, {
          keyPath: 'id',
          autoIncrement: true,
        });
        attemptsStore.createIndex('questionId', 'questionId', { unique: false });
        attemptsStore.createIndex('lessonId', 'lessonId', { unique: false });
        attemptsStore.createIndex('context', 'context', { unique: false });
        attemptsStore.createIndex('timestamp', 'timestamp', { unique: false });
        attemptsStore.createIndex('contextLesson', ['context', 'lessonId'], { unique: false });
      }

      // Create needsReview store
      if (!db.objectStoreNames.contains(STORES.NEEDS_REVIEW)) {
        const reviewStore = db.createObjectStore(STORES.NEEDS_REVIEW, {
          keyPath: 'questionId',
        });
        reviewStore.createIndex('priority', 'priority', { unique: false });
        reviewStore.createIndex('lastAttemptDate', 'lastAttemptDate', { unique: false });
      }
    };
  });

  return dbPromise;
}

/**
 * Save a quiz attempt
 */
export async function saveAttempt(attempt: Omit<QuizAttemptRecord, 'id'>): Promise<number> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORES.ATTEMPTS], 'readwrite');
    const store = transaction.objectStore(STORES.ATTEMPTS);

    return new Promise((resolve, reject) => {
      const request = store.add(attempt);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to save attempt:', error);
    throw error;
  }
}

/**
 * Get all attempts for a specific question
 */
export async function getQuestionHistory(questionId: string): Promise<QuizAttemptRecord[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORES.ATTEMPTS], 'readonly');
    const store = transaction.objectStore(STORES.ATTEMPTS);
    const index = store.index('questionId');

    return new Promise((resolve, reject) => {
      const request = index.getAll(questionId);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to get question history:', error);
    return [];
  }
}

/**
 * Update needs review queue based on performance
 */
export async function updateNeedsReview(
  questionId: string,
  performance: {
    confidence: 'not-sure' | 'somewhat-sure' | 'very-sure';
    isCorrect: boolean;
    lessonId: string;
    context: string;
  }
): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORES.NEEDS_REVIEW, STORES.ATTEMPTS], 'readwrite');
    const reviewStore = transaction.objectStore(STORES.NEEDS_REVIEW);
    const attemptsStore = transaction.objectStore(STORES.ATTEMPTS);
    const attemptsIndex = attemptsStore.index('questionId');

    // Get existing record
    const getRequest = reviewStore.get(questionId);

    await new Promise<void>((resolve, reject) => {
      getRequest.onsuccess = async () => {
        const existing = getRequest.result as NeedsReviewRecord | undefined;

        // Get history to count wrong attempts
        const historyRequest = attemptsIndex.getAll(questionId);
        historyRequest.onsuccess = () => {
          const history = historyRequest.result as QuizAttemptRecord[];
          const timesWrong = history.filter(h => !h.isCorrect).length;

          // Determine action based on performance
          if (performance.confidence === 'very-sure' && performance.isCorrect) {
            // High confidence + correct = remove from review
            if (existing) {
              reviewStore.delete(questionId);
            }
            resolve();
          } else if (!performance.isCorrect && performance.confidence === 'very-sure') {
            // High confidence + wrong = highest priority (misconception)
            const record: NeedsReviewRecord = {
              questionId,
              priority: 10,
              lastAttemptDate: new Date(),
              timesWrong: timesWrong + 1,
              needsReviewReason: 'high-confidence-wrong',
              context: performance.context,
              lessonId: performance.lessonId,
            };
            reviewStore.put(record);
            resolve();
          } else if (!performance.isCorrect) {
            // Wrong answer = add to review
            const record: NeedsReviewRecord = {
              questionId,
              priority: existing ? Math.min(existing.priority + 2, 9) : 6,
              lastAttemptDate: new Date(),
              timesWrong: timesWrong + 1,
              needsReviewReason: 'repeated-wrong',
              context: performance.context,
              lessonId: performance.lessonId,
            };
            reviewStore.put(record);
            resolve();
          } else if (performance.isCorrect && performance.confidence !== 'very-sure') {
            // Low confidence + correct = fragile knowledge
            const record: NeedsReviewRecord = {
              questionId,
              priority: 4,
              lastAttemptDate: new Date(),
              timesWrong,
              needsReviewReason: 'low-confidence-correct',
              context: performance.context,
              lessonId: performance.lessonId,
            };
            reviewStore.put(record);
            resolve();
          } else {
            resolve();
          }
        };
        historyRequest.onerror = () => reject(historyRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  } catch (error) {
    console.error('Failed to update needs review:', error);
  }
}

/**
 * Remove question from review queue
 */
export async function removeFromReview(questionId: string): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORES.NEEDS_REVIEW], 'readwrite');
    const store = transaction.objectStore(STORES.NEEDS_REVIEW);

    return new Promise((resolve, reject) => {
      const request = store.delete(questionId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to remove from review:', error);
  }
}

/**
 * Get all questions needing review (sorted by priority)
 */
export async function getNeedsReview(): Promise<NeedsReviewRecord[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORES.NEEDS_REVIEW], 'readonly');
    const store = transaction.objectStore(STORES.NEEDS_REVIEW);
    const index = store.index('priority');

    return new Promise((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => {
        const results = request.result as NeedsReviewRecord[];
        // Sort by priority descending
        results.sort((a, b) => b.priority - a.priority);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to get needs review:', error);
    return [];
  }
}

/**
 * Get wrong answers for a specific context and lesson (for typed retry top-up)
 */
export async function getWrongAnswersForContext(
  context: string,
  lessonId: string
): Promise<QuizAttemptRecord[]> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORES.ATTEMPTS], 'readonly');
    const store = transaction.objectStore(STORES.ATTEMPTS);
    const index = store.index('contextLesson');

    return new Promise((resolve, reject) => {
      const request = index.getAll([context, lessonId]);
      request.onsuccess = () => {
        const results = request.result as QuizAttemptRecord[];
        // Filter to only wrong answers and sort by most recent
        const wrongAnswers = results
          .filter(r => !r.isCorrect)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(wrongAnswers);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to get wrong answers for context:', error);
    return [];
  }
}

/**
 * Clear all data (for testing/reset)
 */
export async function clearAllData(): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORES.ATTEMPTS, STORES.NEEDS_REVIEW], 'readwrite');

    return new Promise((resolve, reject) => {
      const attemptsRequest = transaction.objectStore(STORES.ATTEMPTS).clear();
      const reviewRequest = transaction.objectStore(STORES.NEEDS_REVIEW).clear();

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error('Failed to clear data:', error);
  }
}

/**
 * Check if IndexedDB is available
 */
export function isIndexedDBAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.indexedDB;
}
