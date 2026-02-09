/**
 * Sequential Lesson Generator
 * Orchestrates 9 specialized phases to generate high-quality lessons
 */

import { GenerationRequest, Lesson, DebugInfo, GenerationDebugBundle } from './types';
import { preprocessToValidJson, safeJsonParse, validateLLMResponse, cleanCodeBlocks, debugLog } from './utils';
import { requiresWorkedExample, classifyLessonTask, isPurposeOnly, getTaskModeString } from './taskClassifier';
import { DebugBundleCollector, saveDebugBundle } from './debugBundle';
import { v4 as uuidv4 } from 'uuid';
import { lessonIndex } from '@/data/lessons/lessonIndex';

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
import { Phase10_Score, Phase10Score } from './phases/Phase10_Score';
import { Phase12_Refine } from './phases/Phase12_Refine';
import { Phase13_Rescore } from './phases/Phase13_Rescore';
import { getRefinementConfig } from './config';
import { normalizeLessonSchema } from './lessonNormalizer';

export interface PhaseProgress {
  phase: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  output?: string;
}

// Compatibility type for Phase 10-13 pipeline
export interface RefinementOutput {
  originalLesson: Lesson;
  refined: Lesson;
  patchesApplied: any[];
  originalScore: number;
  refinedScore: number;
  improvementSuccess: boolean;
}

export interface SequentialGeneratorResult {
  success: boolean;
  content: Lesson;
  originalLesson?: Lesson;  // For refinement comparison
  rejectedRefinedLesson?: Lesson;  // For debugging when patches are rejected
  error?: string;
  warnings?: string[];
  debugInfo?: DebugInfo;
  phases?: PhaseProgress[];
  refinementMetadata?: {
    wasRefined: boolean;
    originalScore: number;
    finalScore: number;
    patchesApplied: number;
    details: any[];
  };
  debugBundle?: GenerationDebugBundle;
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
  private phase10: Phase10_Score;

  // LLM caller function (injected from FileGenerator)
  private generateWithRetry: (
    systemPrompt: string,
    userPrompt: string,
    type: 'lesson' | 'quiz' | 'phase',
    maxRetries: number,
    attemptHigherLimit?: boolean,
    currentTokenLimit?: number,
    modelOverride?: string  // NEW: Allow caller to specify model (e.g., for Phase 10)
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
    this.phase10 = new Phase10_Score();
    
    this.generateWithRetry = generateWithRetryFn;
  }

  /**
   * Generate lesson using sequential pipeline
   */
  async generate(request: GenerationRequest): Promise<SequentialGeneratorResult> {
    const lessonId = `${request.unit}-${request.lessonId}`;
    const phases: PhaseProgress[] = [];
    
    // Create debug bundle collector
    const debugCollector = new DebugBundleCollector({
      runId: uuidv4(),
      timestampISO: new Date().toISOString(),
      lessonMeta: {
        id: lessonId,
        unit: request.unit,
        topic: request.topic,
        title: `${lessonId} — ${request.topic}`,
      },
      models: {
        generator: process.env.LLM_MODEL || 'gemini-2.0-flash-exp',
        scorer: process.env.LLM_MODEL || 'gemini-2.0-flash-exp',
        phase10: process.env.LLM_MODEL || 'gemini-2.0-flash-exp',
        postmortem: process.env.LLM_MODEL || 'gemini-2.0-flash-exp',
      },
      config: {
        phase10Threshold: getRefinementConfig().scoreThreshold,
        phase10MaxFixes: getRefinementConfig().maxFixes,
        environment: process.env.NODE_ENV || 'development',
      },
    });
    
    try {
      debugLog('SEQUENTIAL_GEN_START', { lessonId });
      console.log(`\n🔄 [Sequential] Starting sequential generation for ${lessonId}`);

      // Task mode will be computed in Phase 1 (single source of truth)
      console.log(`  🏷️  Task Mode: Will be determined by Phase 1 Planning`);

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
      const spacedReviewResult = await this.runPhase8(request, planResult);
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

      // Normalize lesson schema before scoring (fix deterministic issues)
      console.log(`\n📐 [Normalization] Checking for mechanical fixes...`);
      const { normalized: normalizedLesson, fixesApplied } = normalizeLessonSchema(lesson);
      
      if (fixesApplied.length > 0) {
        console.log(`📐 [Normalization] Applied ${fixesApplied.length} automatic fixes:`);
        fixesApplied.forEach(fix => console.log(`   ✓ ${fix}`));
        lesson = normalizedLesson; // Use normalized version going forward
      } else {
        console.log(`📐 [Normalization] No mechanical fixes needed - lesson already clean`);
      }

      // Score the normalized lesson with Phase10 pedagogical scorer
      phaseStart = Date.now();
      const initialScore = await this.phase10.scoreLesson(lesson, this.generateWithRetry);
      console.log(`\n📊 [Scoring] Initial score: ${initialScore.total}/100 (${initialScore.grade})`);
      
      // Verbose logging: Detailed score breakdown
      console.log(`\n📊 [Scoring] Detailed Initial Score Breakdown:`);
      console.log(`   Beginner Clarity: ${initialScore.breakdown.beginnerClarity}/30`);
      console.log(`   Teaching-Before-Testing: ${initialScore.breakdown.teachingBeforeTesting}/25`);
      console.log(`   Marking Robustness: ${initialScore.breakdown.markingRobustness}/20`);
      console.log(`   Alignment to LO: ${initialScore.breakdown.alignmentToLO}/15`);
      console.log(`   Question Quality: ${initialScore.breakdown.questionQuality}/10`);
      if (initialScore.issues && initialScore.issues.length > 0) {
        console.log(`   Issues: ${initialScore.issues.length}`);
      }
      console.log('');

      let finalLesson = lesson;
      let originalLesson: Lesson | undefined = undefined;
      let rejectedRefinedLesson: Lesson | undefined = undefined;
      let refinementResult: RefinementOutput | null = null;

      // Record baseline in debug bundle (always)
      debugCollector.recordBaseline(lesson, initialScore, []);

      // Phase 10: Auto-Refinement (if score < threshold)
      const threshold = getRefinementConfig().scoreThreshold;
      if (initialScore.total < threshold) {
        console.log(`🔧 [Refinement] Score below threshold (${threshold}), activating Phase 10...`);
        console.log(`🔧 [Refinement] Threshold: ${threshold}, Actual: ${initialScore.total}, Gap: ${threshold - initialScore.total} points`);
        
        // Always save original before refinement attempt
        originalLesson = lesson;
        
        try {
          refinementResult = await this.runPhase10(lesson, initialScore, debugCollector, request);
          
          // Refinement result now includes refined score from isolation scoring
          if (refinementResult && refinementResult.improvementSuccess) {
            // Audit refined lesson
            this.phase10.auditAllIDs(refinementResult.refined);
            
            // Verbose logging: Score already computed in runPhase10
            console.log(`\n📊 [Score Summary] Refined lesson scored during isolation phase`);
            console.log(`📊 [Score Summary] Refined lesson has ${refinementResult.refined.blocks.length} blocks`);
            console.log(`📊 [Score Summary] Applied ${refinementResult.patchesApplied.length} patches:`);
            refinementResult.patchesApplied.forEach((patch, idx) => {
              console.log(`   ${idx + 1}. ${patch.path}`);
              console.log(`      Issue: ${patch.issue || patch.reason}`);
              console.log(`      Fix: ${patch.oldValue} → ${patch.value}`);
            });
            console.log('');
            
            // Use the refined score from runPhase10 (already computed during isolation scoring)
            const refinedScore = {
              total: refinementResult.refinedScore,
              details: [],
              breakdown: {} as any,
              grade: refinementResult.refinedScore >= 95 ? 'Ship it' : 
                     refinementResult.refinedScore >= 90 ? 'Strong' :
                     refinementResult.refinedScore >= 85 ? 'Usable' : 'Needs rework'
            };
            
            // Verbose logging: Detailed score comparison
            console.log(`\n📊 [Re-scoring] Detailed Score Comparison:`);
            console.log(`   Overall: ${initialScore.total} → ${refinedScore.total} (${refinedScore.total > initialScore.total ? '+' : ''}${refinedScore.total - initialScore.total})`);
            console.log(`\n   By Section:`);
            initialScore.details.forEach((initDetail, idx) => {
              const refDetail = refinedScore.details[idx];
              if (refDetail) {
                const diff = refDetail.score - initDetail.score;
                console.log(`   ${initDetail.section}: ${initDetail.score} → ${refDetail.score} (${diff > 0 ? '+' : ''}${diff})`);
              }
            });
            console.log('');
            
            // Log detailed score comparison (keep existing method too)
            this.phase10.logScoreComparison(initialScore, refinedScore);
            
            // Only use refined version if score improved
            if (refinedScore.total > initialScore.total) {
              const improvement = refinedScore.total - initialScore.total;
              console.log(`✅ [Refinement] Score IMPROVED by ${improvement} points: ${initialScore.total} → ${refinedScore.total}`);
              console.log(`✅ [Refinement] Keeping refined version`);
              console.log(`✅ [Refinement] Original lesson saved for comparison`);
              finalLesson = refinementResult.refined;
              
              // Save diagnostic data for successful refinement
              await saveDiagnosticData(
                lesson.id,
                initialScore,
                refinedScore,
                refinementResult.patchesApplied,
                true, // wasAccepted
                refinementResult.originalLesson,
                refinementResult.refined
              );
              
              phases.push({
                phase: 'Auto-Refinement',
                status: 'completed',
                duration: Date.now() - phaseStart,
                output: `Applied ${refinementResult.patchesApplied.length} fixes, score: ${initialScore.total} → ${refinedScore.total}`
              });
            } else {
              const decline = initialScore.total - refinedScore.total;
              console.log(`⚠️  [Refinement] Score DECLINED by ${decline} points: ${initialScore.total} → ${refinedScore.total}`);
              console.log(`⚠️  [Refinement] Patches did not help - keeping original lesson`);
              console.log(`⚠️  [Refinement] This suggests patches were incorrect or harmful`);
              console.log(`💾 [Refinement] Both versions will be saved for debugging`);
              
              // Store rejected refined lesson for debugging
              rejectedRefinedLesson = refinementResult.refined;
              
              // Save diagnostic data for failed refinement
              await saveDiagnosticData(
                lesson.id,
                initialScore,
                refinedScore,
                refinementResult.patchesApplied,
                false, // wasAccepted
                refinementResult.originalLesson,
                refinementResult.refined
              );
              
              phases.push({
                phase: 'Auto-Refinement',
                status: 'skipped',
                duration: Date.now() - phaseStart,
                output: `No improvement (${initialScore.total} → ${refinedScore.total})`
              });
            }
          } else {
            phases.push({
              phase: 'Auto-Refinement',
              status: 'skipped',
              duration: Date.now() - phaseStart,
              output: 'No patches generated'
            });
          }
        } catch (error) {
          console.error('❌ [Refinement] Error during refinement:', error);
          phases.push({
            phase: 'Auto-Refinement',
            status: 'failed',
            duration: Date.now() - phaseStart,
            output: `Error: ${error instanceof Error ? error.message : 'Unknown'}`
          });
        }
      } else {
        console.log(`✅ [Scoring] Score meets threshold (${initialScore.total} >= 93), no refinement needed`);
        phases.push({
          phase: 'Auto-Refinement',
          status: 'skipped',
          duration: 0,
          output: `Score meets threshold (${initialScore.total}/100 >= ${threshold})`
        });
      }

      debugLog('SEQUENTIAL_GEN_COMPLETE', { lessonId, finalScore: refinementResult?.refinedScore || initialScore.total });
      console.log(`✅ [Sequential] Generation complete for ${lessonId}`);

      // Always include score metadata
      const scoreMetadata = refinementResult && refinementResult.improvementSuccess ? {
        wasRefined: true,
        originalScore: initialScore.total,
        finalScore: refinementResult.refinedScore,
        patchesApplied: refinementResult.patchesApplied.length,
        details: refinementResult.patchesApplied
      } : {
        wasRefined: false,
        originalScore: initialScore.total,
        finalScore: initialScore.total,
        patchesApplied: 0,
        details: []
      };

      return {
        success: true,
        content: finalLesson,
        originalLesson,
        rejectedRefinedLesson,
        phases,
        refinementMetadata: scoreMetadata,
        debugBundle: debugCollector.getBundle(),
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
      'phase',
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
      'phase',
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
      taskMode: plan.taskMode,
    };
    const prompts = this.phase3.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'phase',
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
      taskMode: plan.taskMode,
    };
    const prompts = this.phase4.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'phase',
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
      taskMode: plan.taskMode,
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
      'phase',
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
      taskMode: plan.taskMode,
    };
    const prompts = this.phase6.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'phase',
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
      'phase',
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
   * Get up to 4 previous lesson titles for Phase 8 context
   */
  private getPreviousLessonTitles(unitNumber: string, currentLessonId: string): string[] {
    const moduleLessons = lessonIndex
      .filter(l => l.unitNumber === unitNumber && l.available)
      .sort((a, b) => a.order - b.order);
    
    const currentIndex = moduleLessons.findIndex(l => l.id === currentLessonId);
    
    if (currentIndex <= 0) {
      return []; // First lesson or not found
    }
    
    // Get up to 4 previous lessons
    const startIndex = Math.max(0, currentIndex - 4);
    return moduleLessons
      .slice(startIndex, currentIndex)
      .map(l => l.title);
  }

  /**
   * Generate deterministic fallback for Phase 8 when LLM fails
   */
  private generateFallbackSpacedReview(
    lessonId: string,
    title: string,
    learningOutcomes: string[]
  ): SpacedReviewOutput {
    console.log(`   🔧 Generating deterministic fallback spaced review...`);
    
    // Generate 3 foundation questions from learning outcomes
    const questions = learningOutcomes.slice(0, 3).map((outcome, idx) => ({
      id: `${lessonId}-SR-${idx + 1}`,
      questionText: `What foundational concept is needed to understand: "${outcome}"?`,
      expectedAnswer: [
        'basic electrical principles',
        'electrical fundamentals',
        'prerequisite knowledge'
      ],
      hint: 'Think about what you learned in earlier lessons',
      answerType: 'short-text' as const
    }));
    
    // If less than 3 outcomes, pad with generic questions
    while (questions.length < 3) {
      const idx = questions.length;
      questions.push({
        id: `${lessonId}-SR-${idx + 1}`,
        questionText: 'What basic electrical concept should you review before this lesson?',
        expectedAnswer: [
          'electrical safety',
          'basic circuit theory',
          'fundamental principles'
        ],
        hint: 'Review your earlier learning',
        answerType: 'short-text' as const
      });
    }
    
    return {
      spacedReview: {
        id: `${lessonId}-spaced-review`,
        order: 10,
        title: 'Foundation Check',
        questions: questions.slice(0, 3), // Ensure exactly 3
        notes: `Deterministic fallback - generated from learning outcomes`
      }
    };
  }

  /**
   * Phase 8: Spaced Review (Foundation Check)
   */
  private async runPhase8(request: GenerationRequest, planResult: PlanningOutput): Promise<SpacedReviewOutput | null> {
    console.log('  🔄 Phase 8: Foundation check (spaced review)...');
    const lessonId = `${request.unit}-${request.lessonId}`;
    debugLog('PHASE8_START', { lessonId });

    // Get up to 4 previous lesson titles for context
    const prevTitles = this.getPreviousLessonTitles(request.unit.toString(), lessonId);
    
    // Extract learning outcomes from Phase 1
    const learningOutcomes = planResult.learningOutcomes || [];
    
    if (learningOutcomes.length === 0) {
      console.warn('   ⚠️  No learning outcomes available from Phase 1 - using fallback');
      return this.generateFallbackSpacedReview(lessonId, request.topic, ['Basic electrical knowledge', 'Safety principles', 'Circuit fundamentals']);
    }

    const input = {
      lessonId,
      title: request.topic,
      learningOutcomes,
      previousLessonTitles: prevTitles
    };
    const prompts = this.phase8.getPrompts(input);

    const response = await this.generateWithRetry(
      prompts.systemPrompt,
      prompts.userPrompt,
      'phase',
      2,
      false,
      4000
    );

    const parsed = this.parseResponse<SpacedReviewOutput>(response, 'Phase8_SpacedReview');
    if (!parsed.success || !parsed.data) {
      console.warn('   ⚠️  Phase 8 parsing failed - using fallback');
      debugLog('PHASE8_FAILED', { error: parsed.error });
      return this.generateFallbackSpacedReview(lessonId, request.topic, learningOutcomes);
    }

    // STRICT VALIDATION: Must have exactly 3 questions
    const questions = parsed.data.spacedReview.questions;
    if (questions.length !== 3) {
      console.warn(`   ⚠️  Phase 8 returned ${questions.length} questions, expected 3`);
      
      // Retry once
      console.log(`   🔄 Retrying Phase 8 (attempt 2/2)...`);
      const retryResponse = await this.generateWithRetry(
        prompts.systemPrompt,
        prompts.userPrompt,
        'phase',
        1,
        false,
        5000
      );
      
      const retryParsed = this.parseResponse<SpacedReviewOutput>(retryResponse, 'Phase8_SpacedReview');
      if (retryParsed.success && retryParsed.data?.spacedReview.questions.length === 3) {
        console.log(`   ✓ Retry successful - got 3 questions`);
        // Continue validation with retry result
        const retryQuestions = retryParsed.data.spacedReview.questions;
        
        // Validate and correct each question
        for (let i = 0; i < retryQuestions.length; i++) {
          const q = retryQuestions[i];
          if (!q.questionText || !q.expectedAnswer || !Array.isArray(q.expectedAnswer)) {
            console.warn(`   ⚠️  Retry question ${i + 1} has invalid format - using fallback`);
            return this.generateFallbackSpacedReview(lessonId, request.topic, learningOutcomes);
          }
          
          // Force answerType to short-text if not set correctly
          if (q.answerType !== 'short-text') {
            console.log(`   ⚠️  Correcting retry question ${i + 1} answerType to short-text`);
            q.answerType = 'short-text';
          }
        }
        
        debugLog('PHASE8_COMPLETE', { questionCount: 3, retriedOnce: true });
        console.log(`    ✓ Generated 3 foundation check questions (after retry)`);
        return retryParsed.data;
      }
      
      // Still wrong - use fallback
      console.warn(`   ⚠️  Retry failed (got ${retryParsed.data?.spacedReview.questions.length || 0} questions) - generating deterministic fallback`);
      return this.generateFallbackSpacedReview(lessonId, request.topic, learningOutcomes);
    }

    // Validate all questions have required fields and correct answerType
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionText || !q.expectedAnswer || !Array.isArray(q.expectedAnswer)) {
        console.warn(`   ⚠️  Question ${i + 1} has invalid format - using fallback`);
        return this.generateFallbackSpacedReview(lessonId, request.topic, learningOutcomes);
      }
      
      // Force answerType to short-text if not set correctly
      if (q.answerType !== 'short-text') {
        console.log(`   ⚠️  Correcting question ${i + 1} answerType to short-text`);
        q.answerType = 'short-text';
      }
    }

    debugLog('PHASE8_COMPLETE', { questionCount: 3 });
    console.log(`    ✓ Generated 3 foundation check questions`);
    
    return parsed.data;
  }

  /**
   * Phase 10-13: Pedagogical Improvement Pipeline
   * 
   * Runs the new pipeline: Score → Suggest → Implement → Rescore
   */
  private async runPhase10(lesson: Lesson, phase10Score: Phase10Score, debugCollector: DebugBundleCollector, request: GenerationRequest): Promise<RefinementOutput | null> {
    console.log('  🔧 Phase 10-13: Pedagogical Improvement Pipeline...');
    
    try {
      // Phase 10 score already computed - reuse it to avoid double scoring
      console.log(`  📊 Phase 10 Score (reused): ${phase10Score.total}/100 (${phase10Score.grade})`);
      
      // Phase 12: Refine lesson (full-lesson output, replaces Phase11+Phase12 patching)
      const refiner = new Phase12_Refine();
      const refinement = await refiner.refineLesson(
        {
          originalLesson: lesson,
          phase10Score,
          syllabusContext: this.phase10.lastSyllabusContext,
          additionalInstructions: request.additionalInstructions
        },
        this.generateWithRetry
      );
      
      if (!refinement.success) {
        console.log(`  ❌ Phase 12 failed: ${refinement.error}`);
        if (refinement.validationErrors && refinement.validationErrors.length > 0) {
          refinement.validationErrors.forEach(err => console.log(`     - ${err}`));
        }
        return null;
      }
      
      console.log(`  ✅ Phase 12: Refinement complete`);
      
      // Phase 13: Rescore and compare
      const rescorer = new Phase13_Rescore();
      const result = await rescorer.rescoreAndCompare(
        lesson,
        refinement.refinedLesson,
        phase10Score,
        this.phase10.lastSyllabusContext,
        this.generateWithRetry,
        96  // threshold
      );
      
      if (!result.accepted) {
        console.log(`  ⚠️  Phase 13: Candidate did not improve - ${result.reason}`);
        console.log(`  ↩️  Keeping original lesson (best score: ${result.originalScore})`);
      } else {
        console.log(`  ✅ Phase 13: Accepted (${result.originalScore} → ${result.candidateScore}, +${result.improvement})`);
      }
      
      // Convert to RefinementOutput format for compatibility
      return {
        originalLesson: lesson,
        refined: result.finalLesson,
        patchesApplied: [],  // New pipeline doesn't track patches this way
        originalScore: result.originalScore,
        refinedScore: result.candidateScore,
        improvementSuccess: true
      };
      
    } catch (error) {
      console.error(`❌ Phase 10-13 pipeline error:`, error);
      return null;
    }
  }

  /**
   * Parse LLM response using existing infrastructure
   */
  private parseResponse<T>(response: string, phaseName: string): { success: boolean; data?: T; error?: string } {
    try {
      // Log raw response preview for debugging
      console.log(`\n🔍 [${phaseName}] Parsing response (${response.length} chars)`);
      console.log(`   First 200 chars: ${response.substring(0, 200)}`);
      console.log(`   Last 200 chars: ${response.slice(-200)}`);
      
      // CRITICAL: Follow the validation pipeline order from don't_touch.md
      // 1. Validate (checks for error messages)
      const validation = validateLLMResponse(response);
      if (!validation.valid) {
        console.error(`❌ [${phaseName}] Validation failed:`, validation.error);
        console.error(`❌ [${phaseName}] Response preview:`, response.substring(0, 500));
        
        return {
          success: false,
          error: `${phaseName}: ${validation.error || 'Invalid response from LLM'}`,
        };
      }

      // 2. Clean code blocks (removes ```json markers)
      const cleaned = cleanCodeBlocks(response);

      // 3. Preprocess (removes trailing commas, comments, etc)
      const preprocessed = preprocessToValidJson(cleaned);
      console.log(`   After preprocessing: ${preprocessed.length} chars`);

      // 4. Parse (RFC 8259 JSON only)
      const parsed = safeJsonParse<T>(preprocessed);
      if (!parsed.success || !parsed.data) {
        console.error(`❌ [${phaseName}] JSON parse failed:`, parsed.error);
        console.error(`❌ [${phaseName}] Preprocessed content (first 500):`, preprocessed.substring(0, 500));
        console.error(`❌ [${phaseName}] Preprocessed content (last 500):`, preprocessed.slice(-500));
        
        return {
          success: false,
          error: `${phaseName}: Failed to parse JSON - ${parsed.error}`,
        };
      }

      console.log(`✅ [${phaseName}] Successfully parsed response`);
      return {
        success: true,
        data: parsed.data,
      };
    } catch (error) {
      console.error(`❌ [${phaseName}] Exception during parsing:`, error);
      console.error(`❌ [${phaseName}] Stack trace:`, error instanceof Error ? error.stack : 'no stack');
      
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
