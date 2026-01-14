/**
 * Variant Service
 * Generates deterministic question variants for Fix mode retesting
 * Supports both authored variants and parametric generation
 */

import { TaggedQuestion, QuestionVariantTemplate } from '@/data/questions/types';

/**
 * Seeded random number generator for deterministic variants
 * Uses a simple Linear Congruential Generator (LCG)
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  nextInRange(min: number, max: number, step: number = 1): number {
    const range = max - min;
    const steps = Math.floor(range / step);
    const randomStep = Math.floor(this.next() * (steps + 1));
    return min + randomStep * step;
  }

  nextChoice<T>(choices: T[]): T {
    const index = Math.floor(this.next() * choices.length);
    return choices[index];
  }
}

/**
 * Generate a variant from a parametric template
 */
export function generateVariantFromTemplate(
  template: QuestionVariantTemplate,
  seed: number
): {
  questionText: string;
  expectedAnswer: string;
  acceptableAnswers?: string[];
  parameters: Record<string, any>;
} {
  const rng = new SeededRandom(seed);
  const parameters: Record<string, any> = {};

  // Generate parameter values
  for (const [paramName, paramConfig] of Object.entries(template.parameters)) {
    if (paramConfig.type === 'number' && paramConfig.range) {
      parameters[paramName] = rng.nextInRange(
        paramConfig.range[0],
        paramConfig.range[1],
        paramConfig.step || 1
      );
    } else if (paramConfig.type === 'choice' && paramConfig.choices) {
      parameters[paramName] = rng.nextChoice(paramConfig.choices);
    }
  }

  // Replace placeholders in template
  let questionText = template.template;
  for (const [paramName, paramValue] of Object.entries(parameters)) {
    questionText = questionText.replace(new RegExp(`\\{${paramName}\\}`, 'g'), String(paramValue));
  }

  // Calculate expected answer
  let expectedAnswer: string;
  if (template.answerFormula) {
    try {
      // Safely evaluate formula with parameters
      const answerValue = evaluateFormula(template.answerFormula, parameters);
      expectedAnswer = String(answerValue);
    } catch (error) {
      console.error('Error evaluating answer formula:', error);
      expectedAnswer = '0';
    }
  } else {
    expectedAnswer = '0';
  }

  // Calculate acceptable answers
  let acceptableAnswers: string[] | undefined;
  if (template.acceptableAnswersFormula) {
    acceptableAnswers = template.acceptableAnswersFormula.map(formula => {
      try {
        const value = evaluateFormula(formula, parameters);
        return String(value);
      } catch (error) {
        console.error('Error evaluating acceptable answer formula:', error);
        return expectedAnswer;
      }
    });
  }

  return {
    questionText,
    expectedAnswer,
    acceptableAnswers,
    parameters,
  };
}

/**
 * Safely evaluate a formula with parameters
 * Uses a restricted evaluator to prevent code injection
 */
function evaluateFormula(formula: string, parameters: Record<string, any>): number {
  // Create a restricted context with only parameters and Math functions
  const context: Record<string, any> = { ...parameters, Math };

  // Replace parameter names in formula
  let evaluableFormula = formula;
  for (const paramName of Object.keys(parameters)) {
    evaluableFormula = evaluableFormula.replace(
      new RegExp(`\\b${paramName}\\b`, 'g'),
      `context.${paramName}`
    );
  }

  // Evaluate using Function constructor (safer than eval in this controlled context)
  try {
    const func = new Function('context', `return ${evaluableFormula}`);
    const result = func(context);
    
    // Round to 2 decimal places for consistency
    return Math.round(result * 100) / 100;
  } catch (error) {
    console.error('Formula evaluation error:', error);
    throw error;
  }
}

/**
 * Get a variant of a question for Fix mode retesting
 * Returns either an authored variant or a parametrically generated one
 */
export function getQuestionVariant(
  originalQuestion: TaggedQuestion,
  questionBank: TaggedQuestion[],
  attemptNumber: number = 1
): TaggedQuestion | null {
  // Strategy 1: Use authored variants if available
  if (originalQuestion.variantIds && originalQuestion.variantIds.length > 0) {
    // Cycle through variants based on attempt number
    const variantIndex = (attemptNumber - 1) % originalQuestion.variantIds.length;
    const variantId = originalQuestion.variantIds[variantIndex];
    
    const variant = questionBank.find(q => q.id.toString() === variantId.toString());
    if (variant) {
      console.log(`✓ Using authored variant ${variantId} for question ${originalQuestion.id}`);
      return variant;
    } else {
      console.warn(`⚠️  Authored variant ${variantId} not found in question bank`);
    }
  }

  // Strategy 2: Use parametric template if available
  if (originalQuestion.variantTemplate) {
    try {
      // Use question ID + attempt number as seed for deterministic generation
      const seed = parseInt(String(originalQuestion.id), 10) + attemptNumber;
      const generated = generateVariantFromTemplate(originalQuestion.variantTemplate, seed);

      // Create a new question object with generated values
      const variantQuestion: TaggedQuestion = {
        ...originalQuestion,
        id: `${originalQuestion.id}-var${attemptNumber}`,
        question: generated.questionText,
        correctAnswer: generated.expectedAnswer,
        acceptableAnswers: generated.acceptableAnswers || [generated.expectedAnswer],
      };

      console.log(`✓ Generated parametric variant for question ${originalQuestion.id}`, {
        parameters: generated.parameters,
        answer: generated.expectedAnswer,
      });

      return variantQuestion;
    } catch (error) {
      console.error('Error generating parametric variant:', error);
    }
  }

  // Strategy 3: No variants available
  console.warn(`⚠️  No variants available for question ${originalQuestion.id}`);
  return null;
}

/**
 * Check if a question has variants available
 */
export function hasVariants(question: TaggedQuestion): boolean {
  return !!(
    (question.variantIds && question.variantIds.length > 0) ||
    question.variantTemplate
  );
}

/**
 * Get variant metadata for a question
 */
export function getVariantMetadata(question: TaggedQuestion): {
  hasVariants: boolean;
  variantCount: number;
  variantType: 'authored' | 'parametric' | 'none';
} {
  if (question.variantIds && question.variantIds.length > 0) {
    return {
      hasVariants: true,
      variantCount: question.variantIds.length,
      variantType: 'authored',
    };
  }

  if (question.variantTemplate) {
    return {
      hasVariants: true,
      variantCount: Infinity, // Parametric can generate unlimited variants
      variantType: 'parametric',
    };
  }

  return {
    hasVariants: false,
    variantCount: 0,
    variantType: 'none',
  };
}


