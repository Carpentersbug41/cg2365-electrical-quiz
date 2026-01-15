/**
 * Marking Service
 * Deterministic answer marking with misconception detection
 */

import { TaggedQuestion } from '@/data/questions/types';
import { MarkingResult, AnswerValidationConfig } from './types';
import { getMisconception } from './misconceptionCodes';

/**
 * Normalize answer for comparison
 */
function normalizeAnswer(answer: string): string {
  return answer.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Extract numeric value and units from answer
 */
function parseNumericAnswer(answer: string): { value: number | null; units: string | null } {
  // Match patterns like "12 Ω", "12Ω", "12 ohms", "12", etc.
  const match = answer.match(/^([-+]?[\d.]+)\s*([a-zA-ZΩ°]+)?$/);
  
  if (!match) {
    return { value: null, units: null };
  }

  const value = parseFloat(match[1]);
  const units = match[2] || null;

  return { value: isNaN(value) ? null : value, units };
}

/**
 * Check if numeric answer is within tolerance
 */
function isWithinTolerance(
  userValue: number,
  expectedValue: number,
  tolerance: number = 0.01,
  toleranceType: 'absolute' | 'percentage' = 'absolute'
): boolean {
  if (toleranceType === 'percentage') {
    const diff = Math.abs(userValue - expectedValue);
    const percentDiff = (diff / Math.abs(expectedValue)) * 100;
    return percentDiff <= tolerance;
  } else {
    return Math.abs(userValue - expectedValue) <= tolerance;
  }
}

/**
 * Mark MCQ answer
 */
export function markMCQ(
  question: TaggedQuestion,
  userAnswerIndex: number
): MarkingResult {
  const isCorrect = userAnswerIndex === question.correctAnswer;

  let misconceptionCode = undefined;
  if (!isCorrect && question.misconceptionCodes) {
    misconceptionCode = question.misconceptionCodes[userAnswerIndex];
  }

  const result: MarkingResult = {
    isCorrect,
    score: isCorrect ? 1 : 0,
    userAnswer: question.options[userAnswerIndex],
    expectedAnswer: question.options[question.correctAnswer],
    misconceptionCode,
    feedback: isCorrect
      ? '✓ Correct!'
      : `✗ Incorrect. The correct answer is: ${question.options[question.correctAnswer]}`,
    metadata: {
      markedAt: new Date(),
      markingStrategy: 'exact-match',
    },
  };

  if (!isCorrect && misconceptionCode) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'markingService.ts:81',message:'Attempting to get misconception',data:{misconceptionCode,questionId:question.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    try {
      const misconception = getMisconception(misconceptionCode);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'markingService.ts:84',message:'Misconception retrieved successfully',data:{misconceptionCode,hasDescription:!!misconception.description},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      result.detailedFeedback = {
        whatWasWrong: `You selected "${question.options[userAnswerIndex]}"`,
        whyItMatters: misconception.description,
        howToFix: misconception.fixPrompt,
      };
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'markingService.ts:91',message:'Error getting misconception',data:{misconceptionCode,error:error instanceof Error?error.message:String(error),questionId:question.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      throw error;
    }
  }

  return result;
}

/**
 * Mark numeric answer
 */
export function markNumeric(
  userAnswer: string,
  expectedAnswers: string[],
  config?: AnswerValidationConfig
): MarkingResult {
  const parsed = parseNumericAnswer(userAnswer);

  if (parsed.value === null) {
    return {
      isCorrect: false,
      score: 0,
      userAnswer,
      expectedAnswer: expectedAnswers,
      feedback: '✗ Invalid numeric answer format.',
      metadata: {
        markedAt: new Date(),
        markingStrategy: 'numeric-tolerance',
      },
    };
  }

  // Check each expected answer variation
  for (const expected of expectedAnswers) {
    const expectedParsed = parseNumericAnswer(expected);
    
    if (expectedParsed.value === null) continue;

    const valueMatch = isWithinTolerance(
      parsed.value,
      expectedParsed.value,
      config?.tolerance || 0.01,
      config?.toleranceType || 'absolute'
    );

    if (valueMatch) {
      // Value is correct, check units if required
      if (config?.unitsRequired && expectedParsed.units) {
        const unitsMatch = 
          parsed.units && 
          normalizeAnswer(parsed.units) === normalizeAnswer(expectedParsed.units);

        if (!unitsMatch) {
          return {
            isCorrect: false,
            score: 0.7, // Partial credit for correct value
            userAnswer,
            expectedAnswer: expectedAnswers,
            misconceptionCode: 'UNITS_MISSING',
            feedback: '⚠ Value is correct, but units are missing or incorrect.',
            partialCredit: {
              awarded: true,
              points: 0.7,
              reason: 'Correct numerical value, incorrect/missing units',
            },
            detailedFeedback: {
              whatWasWrong: 'Units missing or incorrect',
              whyItMatters: 'Units are essential in electrical calculations',
              howToFix: getMisconception('UNITS_MISSING').fixPrompt,
            },
            metadata: {
              markedAt: new Date(),
              markingStrategy: 'numeric-tolerance',
            },
          };
        }
      }

      // Fully correct
      return {
        isCorrect: true,
        score: 1,
        userAnswer,
        expectedAnswer: expectedAnswers,
        feedback: '✓ Correct!',
        metadata: {
          markedAt: new Date(),
          markingStrategy: 'numeric-tolerance',
        },
      };
    }
  }

  // Incorrect value
  return {
    isCorrect: false,
    score: 0,
    userAnswer,
    expectedAnswer: expectedAnswers,
    feedback: `✗ Incorrect. Expected: ${expectedAnswers.join(' or ')}`,
    metadata: {
      markedAt: new Date(),
      markingStrategy: 'numeric-tolerance',
    },
  };
}

/**
 * Mark short text answer
 */
export function markShortText(
  userAnswer: string,
  expectedAnswers: string[],
  config?: AnswerValidationConfig
): MarkingResult {
  const normalizedUser = normalizeAnswer(userAnswer);

  // Check for keyword matches
  if (config?.requiredKeywords) {
    const hasAllKeywords = config.requiredKeywords.every(keyword =>
      normalizedUser.includes(normalizeAnswer(keyword))
    );

    if (hasAllKeywords) {
      return {
        isCorrect: true,
        score: 1,
        userAnswer,
        expectedAnswer: expectedAnswers,
        feedback: '✓ Correct! Your answer contains the key concepts.',
        metadata: {
          markedAt: new Date(),
          markingStrategy: 'contains-keywords',
        },
      };
    }
  }

  // Check for exact/normalized matches
  for (const expected of expectedAnswers) {
    const normalizedExpected = normalizeAnswer(expected);
    
    if (normalizedUser.includes(normalizedExpected) || normalizedExpected.includes(normalizedUser)) {
      return {
        isCorrect: true,
        score: 1,
        userAnswer,
        expectedAnswer: expectedAnswers,
        feedback: '✓ Correct!',
        metadata: {
          markedAt: new Date(),
          markingStrategy: 'normalized-match',
        },
      };
    }
  }

  // Incorrect
  return {
    isCorrect: false,
    score: 0,
    userAnswer,
    expectedAnswer: expectedAnswers,
    feedback: `✗ Incorrect. Expected concepts: ${expectedAnswers.join(' or ')}`,
    metadata: {
      markedAt: new Date(),
      markingStrategy: 'normalized-match',
    },
  };
}

/**
 * Main marking function - routes to appropriate strategy
 */
export function markAnswer(
  question: TaggedQuestion,
  userAnswer: string | number,
  config?: AnswerValidationConfig
): MarkingResult {
  // MCQ
  if (question.answerType === 'mcq' || (!question.answerType && question.options)) {
    return markMCQ(question, typeof userAnswer === 'number' ? userAnswer : parseInt(userAnswer));
  }

  // Ensure we have string for text-based marking
  const userAnswerStr = typeof userAnswer === 'number' ? userAnswer.toString() : userAnswer;

  // Get expected answers
  const expectedAnswers = Array.isArray(question.correctAnswer)
    ? question.correctAnswer.map(String)
    : question.acceptableAnswers || [String(question.correctAnswer)];

  // Numeric
  if (question.answerType === 'numeric') {
    const numericConfig: AnswerValidationConfig = {
      strategy: config?.strategy || 'numeric-tolerance',
      unitsRequired: config?.unitsRequired !== false, // Default true
      tolerance: config?.tolerance || (question.tolerance || 0.01),
      unitsList: config?.unitsList || (question.requiredUnits ? [question.requiredUnits] : undefined),
      ...(config?.caseSensitive !== undefined && { caseSensitive: config.caseSensitive }),
      ...(config?.trimWhitespace !== undefined && { trimWhitespace: config.trimWhitespace }),
      ...(config?.acceptVariations !== undefined && { acceptVariations: config.acceptVariations }),
      ...(config?.requiredKeywords && { requiredKeywords: config.requiredKeywords }),
      ...(config?.forbiddenKeywords && { forbiddenKeywords: config.forbiddenKeywords }),
      ...(config?.toleranceType && { toleranceType: config.toleranceType }),
      ...(config?.regexPattern && { regexPattern: config.regexPattern }),
      ...(config?.partialCreditRules && { partialCreditRules: config.partialCreditRules }),
    };
    return markNumeric(userAnswerStr, expectedAnswers, numericConfig);
  }

  // Short text
  if (question.answerType === 'short-text') {
    return markShortText(userAnswerStr, expectedAnswers, config);
  }

  // Default: treat as short text
  return markShortText(userAnswerStr, expectedAnswers, config);
}





