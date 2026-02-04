/**
 * Sequential Lesson Generator
 * Orchestrates 9 specialized phases to generate high-quality lessons
 */

import { GenerationRequest, Lesson, DebugInfo } from './types';
import { preprocessToValidJson, safeJsonParse, validateLLMResponse, cleanCodeBlocks, debugLog } from './utils';
import { requiresWorkedExample } from './taskClassifier';

// Phase imports
import { Phase1_Planning, PlanningOutput } from './phases/Phase1_Planning';
import { Phase2_Vocabulary, VocabularyOutput } from './phases/Phase2_Vocabulary';
import { Phase3_Explanation, ExplanationOutput } from './phases/Phase3_Explanation';
import { Phase4_UnderstandingChecks, UnderstandingChecksOutput } from './phases/Phase4_UnderstandingChecks';
import { Phase5_WorkedExample, WorkedExampleOutput } from './phases/Phase5_WorkedExample';
import { Phase6_Practice, PracticeOutput } from './phases/Phase6_Practice';
import { Phase7_Integration, IntegrationOutput } from './phases/Phase7_Integration';
import { Phase8_SpacedReview, SpacedReviewOutput } from './phases/Phase8_SpacedReview';
import { Phase9_Assembler } from './phases/Phase9_Assembler';

export interface PhaseProgress {
  phase: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  output?: string;
}

export interface SequentialGeneratorResult {
  success: boolean;
  content: Lesson;
  error?: string;
  warnings?: string[];
  debugInfo?: DebugInfo;
  phases?: PhaseProgress[];
}

/**
 * Sequential Lesson Generator
 * Breaks monolithic prompt into 9 focused phases for better quality
 */
export class SequentialLessonGenerator {
  private phase1: Phase1_Planning;
  private phase2: Phase2_Vocabulary;
  private phase3: Phase3_Explanation;
  private phase4: Phase4_UnderstandingChecks;
  private phase5: Phase5_WorkedExample;
  private phase6: Phase6_Practice;
  private phase7: Phase7_Integration;
  private phase8: Phase8_SpacedReview;
  private phase9: Phase9_Assembler;

  // LLM caller function (injected from FileGenerator)
  private generateWithRetry: (
    systemPrompt: string,
    userPrompt: string,
    type: 'lesson' | 'quiz',
    maxRetries: number,
    attemptHigherLimit?: boolean,
    currentTokenLimit?: number
  ) => Promise<string>;

  constructor(generateWithRetryFn: any) {
    this.phase1 = new Phase1_Planning();
    this.phase2 = new Phase2_Vocabulary();
    this.phase3 = new Phase3_Explanation();
    this.phase4 = new Phase4_UnderstandingChecks();
    this.phase5 = new Phase5_WorkedExample();
    this.phase6 = new Phase6_Practice();
    this.phase7 = new Phase7_Integration();
    this.phase8 = new Phase8_SpacedReview();
    this.phase9 = new Phase9_Assembler();
    
    this.generateWithRetry = generateWithRetryFn;
  }

  /**
   * Generate lesson using sequential pipeline
   */
  async generate(request: GenerationRequest): Promise<SequentialGeneratorResult> {
    const lessonId = `${request.unit}-${request.lessonId}`;
    const phases: PhaseProgress[] = [];
    
    try {
      debugLog('SEQUENTIAL_GEN_START', { lessonId });
      console.log(`\n🔄 [Sequential] Starting sequential generation for ${lessonId}`);

      // Phase 1: Planning
      let phaseStart = Date.now();
      const planResult = await this.runPhase1(request);
      phases.push({
        phase: 'Planning',
        status: planResult ? 'completed' : 'failed',
        duration: Date.now() - phaseStart,
        output: planResult ? `Layout: ${planResult.layout}, ${planResult.explanationSections.length} sections` : 'Failed',
      });
      if (!planResult) {
        return { ...this.errorResult('Phase 1 (Planning) failed'), phases };
      }

      // Phase 2: Vocabulary
      phaseStart = Date.now();
      const vocabResult = await this.runPhase2(request, planResult);
      phases.push({
        phase: 'Vocabulary',
        status: vocabResult ? 'completed' : 'failed',
        duration: Date.now() - phaseStart,
        output: vocabResult ? `Generated ${vocabResult.terms.length} terms` : 'Failed',
      });
      if (!vocabResult) {
        return { ...this.errorResult('Phase 2 (Vocabulary) failed'), phases };
      }

      // Phase 3: Explanation
      phaseStart = Date.now();
      const explanationResult = await this.runPhase3(request, planResult, vocabResult);
      phases.push({
        phase: 'Explanation',
        status: explanationResult ? 'completed' : 'failed',
        duration: Date.now() - phaseStart,
        output: explanationResult ? `Generated ${explanationResult.explanations.length} explanation(s)` : 'Failed',
      });
      if (!explanationResult) {
        return { ...this.errorResult('Phase 3 (Explanation) failed'), phases };
      }

      // Phase 4: Understanding Checks
      phaseStart = Date.now();
      const checksResult = await this.runPhase4(lessonId, planResult, explanationResult);
      phases.push({
        phase: 'Understanding Checks',
        status: checksResult ? 'completed' : 'failed',
        duration: Date.now() - phaseStart,
        output: checksResult ? `Generated ${checksResult.checks.length} check block(s)` : 'Failed',
      });
      if (!checksResult) {
        return { ...this.errorResult('Phase 4 (Understanding Checks) failed'), phases };
      }

      // Phase 5: Worked Example (conditional)
      phaseStart = Date.now();
      const workedExampleResult = await this.runPhase5(request, planResult, explanationResult);
      phases.push({
        phase: 'Worked Example',
        status: workedExampleResult ? 'completed' : 'failed',
        duration: Date.now() - phaseStart,
        output: workedExampleResult ? (workedExampleResult.workedExample ? 'Generated worked example' : 'Skipped (not needed)') : 'Failed',
      });
      if (!workedExampleResult) {
        return { ...this.errorResult('Phase 5 (Worked Example) failed'), phases };
      }

      // Phase 6: Practice
      phaseStart = Date.now();
      const practiceResult = await this.runPhase6(lessonId, planResult, explanationResult, vocabResult, workedExampleResult);
      phases.push({
        phase: 'Practice',
        status: practiceResult ? 'completed' : 'failed',
        duration: Date.now() - phaseStart,
        output: practiceResult ? `Generated ${practiceResult.practice.questions.length} questions` : 'Failed',
      });
      if (!practiceResult) {
        return { ...this.errorResult('Phase 6 (Practice) failed'), phases };
      }

      // Phase 7: Integration
      phaseStart = Date.now();
      const integrationResult = await this.runPhase7(lessonId, planResult, explanationResult);
      phases.push({
        phase: 'Integration',
        status: integrationResult ? 'completed' : 'failed',
        duration: Date.now() - phaseStart,
        output: integrationResult ? `Generated ${integrationResult.integrative.questions.length} integrative questions` : 'Failed',
      });
      if (!integrationResult) {
        return { ...this.errorResult('Phase 7 (Integration) failed'), phases };
      }

      // Phase 8: Spaced Review
      phaseStart = Date.now();
      const spacedReviewResult = await this.runPhase8(request);
      phases.push({
        phase: 'Spaced Review',
        status: spacedReviewResult ? 'completed' : 'failed',
        duration: Date.now() - phaseStart,
        output: spacedReviewResult ? `Generated ${spacedReviewResult.spacedReview.questions.length} review questions` : 'Failed',
      });
      if (!spacedReviewResult) {
        return { ...this.errorResult('Phase 8 (Spaced Review) failed'), phases };
      }

      // Phase 9: Assembly
      phaseStart = Date.now();
      const lesson = this.phase9.assemble({
        lessonId,
        title: `${lessonId.replace('-', '.')} — ${request.topic}`,
        description: `Learn about ${request.topic} in ${request.section}`,
        topic: request.topic,
        unit: `Unit ${request.unit}`,
        prerequisites: request.prerequisites,
        youtubeUrl: request.youtubeUrl,
        imageUrl: request.imageUrl,
        plan: planResult,
        vocabulary: vocabResult,
        explanations: explanationResult,
        checks: checksResult,
        workedExample: workedExampleResult,
        practice: practiceResult,
        integration: integrationResult,
        spacedReview: spacedReviewResult,
      });
      phases.push({
        phase: 'Assembly',
        status: 'completed',
        duration: Date.now() - phaseStart,
        output: `Assembled ${lesson.blocks.length} blocks`,
      });

      debugLog('SEQUENTIAL_GEN_COMPLETE', { lessonId });
      console.log(`✅ [Sequential] Generation complete for ${lessonId}`);

      return {
        success: true,
        content: lesson,
        phases,
      };

    } catch (error) {
      debugLog('SEQUENTIAL_GEN_ERROR', { lessonId, error: error instanceof Error ? error.message : 'unknown' });
      return { ...this.errorResult(error instanceof Error ? error.message : 'Unknown error in sequential generation'), phases };
    }
  }

  /**
   * Phase 1: Planning
   */
  private async runPhase1(request: GenerationRequest): Promise<PlanningOutput | null> {
    console.log('  📋 Phase 1: Planning lesson structure...');
    debugLog('PHASE1_START', { lessonId: `${request.unit}-${request.lessonId}` });

    const needsWorkedExample = requiresWorkedExample([
      { type: 'calculation', confidence: 0.8 }
    ]);

    const input = { request, requiresWorkedExample: needsWorkedExample };
    const prompts = this.phase1.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'lesson',
      2,
      false,
      4000 // Low token limit for planning
    );

    const parsed = this.parseResponse<PlanningOutput>(response, 'Phase1_Planning');
    if (!parsed.success || !parsed.data) {
      debugLog('PHASE1_FAILED', { error: parsed.error });
      return null;
    }

    debugLog('PHASE1_COMPLETE', { 
      layout: parsed.data.layout, 
      explanationSections: parsed.data.explanationSections.length 
    });
    console.log(`    ✓ Layout: ${parsed.data.layout}, Sections: ${parsed.data.explanationSections.length}`);
    
    return parsed.data;
  }

  /**
   * Phase 2: Vocabulary
   */
  private async runPhase2(request: GenerationRequest, plan: PlanningOutput): Promise<VocabularyOutput | null> {
    console.log('  📚 Phase 2: Generating vocabulary...');
    debugLog('PHASE2_START', { lessonId: `${request.unit}-${request.lessonId}` });

    const input = {
      lessonId: `${request.unit}-${request.lessonId}`,
      topic: request.topic,
      section: request.section,
      plan,
    };
    const prompts = this.phase2.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'lesson',
      2,
      false,
      3000 // Low token limit for vocabulary
    );

    const parsed = this.parseResponse<VocabularyOutput>(response, 'Phase2_Vocabulary');
    if (!parsed.success || !parsed.data) {
      debugLog('PHASE2_FAILED', { error: parsed.error });
      return null;
    }

    debugLog('PHASE2_COMPLETE', { termCount: parsed.data.terms.length });
    console.log(`    ✓ Generated ${parsed.data.terms.length} terms`);
    
    return parsed.data;
  }

  /**
   * Phase 3: Explanation
   */
  private async runPhase3(
    request: GenerationRequest,
    plan: PlanningOutput,
    vocabulary: VocabularyOutput
  ): Promise<ExplanationOutput | null> {
    console.log('  📝 Phase 3: Writing explanations...');
    debugLog('PHASE3_START', { lessonId: `${request.unit}-${request.lessonId}` });

    const input = {
      lessonId: `${request.unit}-${request.lessonId}`,
      topic: request.topic,
      section: request.section,
      mustHaveTopics: request.mustHaveTopics,
      additionalInstructions: request.additionalInstructions,
      plan,
      vocabulary,
      teachingConstraints: plan.teachingConstraints,
    };
    const prompts = this.phase3.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'lesson',
      2,
      false,
      8000 // Higher token limit for explanations
    );

    const parsed = this.parseResponse<ExplanationOutput>(response, 'Phase3_Explanation');
    if (!parsed.success || !parsed.data) {
      debugLog('PHASE3_FAILED', { error: parsed.error });
      return null;
    }

    debugLog('PHASE3_COMPLETE', { explanationCount: parsed.data.explanations.length });
    console.log(`    ✓ Generated ${parsed.data.explanations.length} explanation(s)`);
    
    return parsed.data;
  }

  /**
   * Phase 4: Understanding Checks
   */
  private async runPhase4(
    lessonId: string,
    plan: PlanningOutput,
    explanations: ExplanationOutput
  ): Promise<UnderstandingChecksOutput | null> {
    console.log('  ✅ Phase 4: Creating understanding checks...');
    debugLog('PHASE4_START', { lessonId });

    const input = {
      lessonId,
      explanations: explanations.explanations,
      teachingConstraints: plan.teachingConstraints,
    };
    const prompts = this.phase4.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'lesson',
      2,
      false,
      6000
    );

    const parsed = this.parseResponse<UnderstandingChecksOutput>(response, 'Phase4_UnderstandingChecks');
    if (!parsed.success || !parsed.data) {
      debugLog('PHASE4_FAILED', { error: parsed.error });
      return null;
    }

    debugLog('PHASE4_COMPLETE', { checkCount: parsed.data.checks.length });
    console.log(`    ✓ Generated ${parsed.data.checks.length} check(s)`);
    
    return parsed.data;
  }

  /**
   * Phase 5: Worked Example
   */
  private async runPhase5(
    request: GenerationRequest,
    plan: PlanningOutput,
    explanations: ExplanationOutput
  ): Promise<WorkedExampleOutput | null> {
    console.log('  🔢 Phase 5: Worked example...');
    debugLog('PHASE5_START', { lessonId: `${request.unit}-${request.lessonId}` });

    const input = {
      lessonId: `${request.unit}-${request.lessonId}`,
      topic: request.topic,
      explanations: explanations.explanations,
      needsWorkedExample: plan.needsWorkedExample,
      teachingConstraints: plan.teachingConstraints,
    };

    if (!plan.needsWorkedExample) {
      console.log(`    ⊘ Skipped (not needed)`);
      return {
        workedExample: undefined,
        guidedPractice: undefined,
      };
    }

    const prompts = this.phase5.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'lesson',
      2,
      false,
      6000
    );

    const parsed = this.parseResponse<WorkedExampleOutput>(response, 'Phase5_WorkedExample');
    if (!parsed.success || !parsed.data) {
      debugLog('PHASE5_FAILED', { error: parsed.error });
      return null;
    }

    debugLog('PHASE5_COMPLETE', { 
      hasWorkedExample: !!parsed.data.workedExample,
      hasGuidedPractice: !!parsed.data.guidedPractice
    });
    console.log(`    ✓ Generated worked example + guided practice`);
    
    return parsed.data;
  }

  /**
   * Phase 6: Practice
   */
  private async runPhase6(
    lessonId: string,
    plan: PlanningOutput,
    explanations: ExplanationOutput,
    vocabulary: VocabularyOutput,
    workedExample: WorkedExampleOutput
  ): Promise<PracticeOutput | null> {
    console.log('  💪 Phase 6: Practice questions...');
    debugLog('PHASE6_START', { lessonId });

    const input = {
      lessonId,
      explanations: explanations.explanations,
      vocabulary,
      hasWorkedExample: !!workedExample.workedExample,
      teachingConstraints: plan.teachingConstraints,
    };
    const prompts = this.phase6.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'lesson',
      2,
      false,
      5000
    );

    const parsed = this.parseResponse<PracticeOutput>(response, 'Phase6_Practice');
    if (!parsed.success || !parsed.data) {
      debugLog('PHASE6_FAILED', { error: parsed.error });
      return null;
    }

    debugLog('PHASE6_COMPLETE', { questionCount: parsed.data.practice.questions.length });
    console.log(`    ✓ Generated ${parsed.data.practice.questions.length} practice questions`);
    
    return parsed.data;
  }

  /**
   * Phase 7: Integration
   */
  private async runPhase7(
    lessonId: string,
    plan: PlanningOutput,
    explanations: ExplanationOutput
  ): Promise<IntegrationOutput | null> {
    console.log('  🔗 Phase 7: Integration questions...');
    debugLog('PHASE7_START', { lessonId });

    const input = {
      lessonId,
      plan,
      explanations: explanations.explanations,
    };
    const prompts = this.phase7.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'lesson',
      2,
      false,
      5000
    );

    const parsed = this.parseResponse<IntegrationOutput>(response, 'Phase7_Integration');
    if (!parsed.success || !parsed.data) {
      debugLog('PHASE7_FAILED', { error: parsed.error });
      return null;
    }

    debugLog('PHASE7_COMPLETE', { questionCount: parsed.data.integrative.questions.length });
    console.log(`    ✓ Generated ${parsed.data.integrative.questions.length} integrative questions`);
    
    return parsed.data;
  }

  /**
   * Phase 8: Spaced Review
   */
  private async runPhase8(request: GenerationRequest): Promise<SpacedReviewOutput | null> {
    console.log('  🔄 Phase 8: Spaced review...');
    debugLog('PHASE8_START', { lessonId: `${request.unit}-${request.lessonId}` });

    const input = {
      lessonId: `${request.unit}-${request.lessonId}`,
      prerequisites: request.prerequisites || [],
      prerequisiteAnchors: request.prerequisiteAnchors,
    };
    const prompts = this.phase8.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'lesson',
      2,
      false,
      4000
    );

    const parsed = this.parseResponse<SpacedReviewOutput>(response, 'Phase8_SpacedReview');
    if (!parsed.success || !parsed.data) {
      debugLog('PHASE8_FAILED', { error: parsed.error });
      return null;
    }

    debugLog('PHASE8_COMPLETE', { questionCount: parsed.data.spacedReview.questions.length });
    console.log(`    ✓ Generated ${parsed.data.spacedReview.questions.length} review questions`);
    
    return parsed.data;
  }

  /**
   * Parse LLM response using existing infrastructure
   */
  private parseResponse<T>(response: string, phaseName: string): { success: boolean; data?: T; error?: string } {
    try {
      // CRITICAL: Follow the validation pipeline order from don't_touch.md
      // 1. Validate (checks for error messages)
      const validation = validateLLMResponse(response);
      if (!validation.valid) {
        return {
          success: false,
          error: `${phaseName}: ${validation.error || 'Invalid response from LLM'}`,
        };
      }

      // 2. Clean code blocks (removes ```json markers)
      const cleaned = cleanCodeBlocks(response);

      // 3. Preprocess (removes trailing commas, comments, etc)
      const preprocessed = preprocessToValidJson(cleaned);

      // 4. Parse (RFC 8259 JSON only)
      const parsed = safeJsonParse<T>(preprocessed);
      if (!parsed.success || !parsed.data) {
        return {
          success: false,
          error: `${phaseName}: Failed to parse JSON - ${parsed.error}`,
        };
      }

      return {
        success: true,
        data: parsed.data,
      };
    } catch (error) {
      return {
        success: false,
        error: `${phaseName}: ${error instanceof Error ? error.message : 'Unknown parsing error'}`,
      };
    }
  }

  /**
   * Create error result
   */
  private errorResult(error: string): SequentialGeneratorResult {
    return {
      success: false,
      content: {} as Lesson,
      error,
    };
  }
}
