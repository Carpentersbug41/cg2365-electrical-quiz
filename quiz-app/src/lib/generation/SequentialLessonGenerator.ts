/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Sequential Lesson Generator
 * Orchestrates 9 specialized phases to generate high-quality lessons
 */

import { GenerationRequest, Lesson, DebugInfo, GenerationDebugBundle } from './types';
import {
  preprocessToValidJson,
  repairMalformedJsonStrings,
  safeJsonParse,
  validateLLMResponse,
  cleanCodeBlocks,
  debugLog,
} from './utils';
import { requiresWorkedExample, classifyLessonTask, isPurposeOnly, getTaskModeString } from './taskClassifier';
import { DebugBundleCollector, saveDebugBundle } from './debugBundle';
import { v4 as uuidv4 } from 'uuid';
import { lessonIndex } from '@/data/lessons/lessonIndex';

// Phase imports
import { Phase1_Planning, PlanningOutput } from './phases/Phase1_Planning';
import { Phase2_Vocabulary, VocabularyOutput } from './phases/Phase2_Vocabulary';
import { Phase3_Explanation, ExplanationOutput } from './phases/Phase3_Explanation';
import { Phase4_UnderstandingChecks, UnderstandingChecksOutput } from './phases/Phase4_UnderstandingChecks';
import {
  Phase5_WorkedExample,
  WorkedExampleOutput,
  WorkedExampleBlock,
  GuidedPracticeBlock,
} from './phases/Phase5_WorkedExample';
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
  accepted: boolean;
  reason: string;
  regressions: string[];
  improvementSuccess: boolean;
  phase13OriginalScoreDetail?: Phase10Score;
  phase13CandidateScoreDetail?: Phase10Score;
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
    phase10Score?: Phase10Score;
    phase13?: {
      ran: boolean;
      accepted: boolean;
      reason: string;
      regressions: string[];
      originalScoreDetail?: Phase10Score;
      candidateScoreDetail?: Phase10Score;
    };
    report?: {
      status:
        | 'pass_no_refinement'
        | 'pass_after_refinement'
        | 'fail_below_threshold'
        | 'fail_regression'
        | 'fail_refinement_error';
      threshold: number;
      initialScore: number;
      finalScore: number;
      acceptedCandidate: boolean;
      reason: string;
      regressions?: string[];
    };
  };
  debugBundle?: GenerationDebugBundle;
}

interface BlueprintBlockPlanEntryLike {
  id?: unknown;
  key?: unknown;
  type?: unknown;
  order?: unknown;
  required?: unknown;
}

interface BlueprintWorkedRequirement {
  requireWorkedExample: boolean;
  requireGuidedPractice: boolean;
  workedExampleId: string;
  guidedPracticeId: string;
  workedExampleOrder: number;
  guidedPracticeOrder: number;
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
    const refinementConfig = getRefinementConfig();
    const configuredMaxFixes = (refinementConfig as { maxFixes?: number }).maxFixes;
    
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
        phase10Threshold: refinementConfig.scoreThreshold,
        phase10MaxFixes: typeof configuredMaxFixes === 'number' ? configuredMaxFixes : 0,
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
        debugLog('SEQUENTIAL_PHASES_SUMMARY', { lessonId, phases, failedAt: 'Planning' });
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
        debugLog('SEQUENTIAL_PHASES_SUMMARY', { lessonId, phases, failedAt: 'Vocabulary' });
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
        debugLog('SEQUENTIAL_PHASES_SUMMARY', { lessonId, phases, failedAt: 'Explanation' });
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
        debugLog('SEQUENTIAL_PHASES_SUMMARY', { lessonId, phases, failedAt: 'Understanding Checks' });
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
        debugLog('SEQUENTIAL_PHASES_SUMMARY', { lessonId, phases, failedAt: 'Worked Example' });
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
        debugLog('SEQUENTIAL_PHASES_SUMMARY', { lessonId, phases, failedAt: 'Practice' });
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
        debugLog('SEQUENTIAL_PHASES_SUMMARY', { lessonId, phases, failedAt: 'Integration' });
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
        debugLog('SEQUENTIAL_PHASES_SUMMARY', { lessonId, phases, failedAt: 'Spaced Review' });
        return { ...this.errorResult('Phase 8 (Spaced Review) failed'), phases };
      }

      // Phase 9: Assembly
      phaseStart = Date.now();
      let lesson = this.phase9.assemble({
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

      console.log(`📊 [Scoring] Phase 10 Issues Detail (${initialScore.issues.length}):`);
      initialScore.issues.forEach((issue, idx) => {
        console.log(`   ${idx + 1}. [${issue.category}] ${issue.id}`);
        console.log(`      Problem: ${issue.problem}`);
        console.log(`      Why: ${issue.whyItMatters}`);
        if (issue.alignmentGap) {
          console.log(`      Alignment: ${issue.alignmentGap}`);
        }
      });
      debugLog('PHASE10_SCORE_FULL', {
        lessonId,
        total: initialScore.total,
        grade: initialScore.grade,
        breakdown: initialScore.breakdown,
        issueCount: initialScore.issues.length,
        issues: initialScore.issues,
      });

      let finalLesson = lesson;
      let originalLesson: Lesson | undefined = undefined;
      let rejectedRefinedLesson: Lesson | undefined = undefined;
      let refinementResult: RefinementOutput | null = null;
      let refinementReport: NonNullable<SequentialGeneratorResult['refinementMetadata']>['report'] = {
        status: 'pass_no_refinement',
        threshold: refinementConfig.scoreThreshold,
        initialScore: initialScore.total,
        finalScore: initialScore.total,
        acceptedCandidate: false,
        reason: 'Initial score meets threshold; refinement not required.',
        regressions: [],
      };

      // Record baseline in debug bundle (always)
      debugCollector.recordBaseline(lesson, initialScore as any, []);

      // Phase 10: Auto-Refinement (if score < threshold)
      const threshold = refinementConfig.scoreThreshold;
      if (initialScore.total < threshold) {
        console.log(`🔧 [Refinement] Score below threshold (${threshold}), activating Phase 10...`);
        console.log(`🔧 [Refinement] Threshold: ${threshold}, Actual: ${initialScore.total}, Gap: ${threshold - initialScore.total} points`);
        
        // Always save original before refinement attempt
        originalLesson = lesson;
        
        try {
          refinementResult = await this.runPhase10(lesson, initialScore, debugCollector, request, threshold);
          
          // Refinement result now includes refined score from isolation scoring
          if (refinementResult && refinementResult.improvementSuccess) {
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
              grade: refinementResult.refinedScore >= 95 ? 'Ship it' : 
                     refinementResult.refinedScore >= 90 ? 'Strong' :
                     refinementResult.refinedScore >= 85 ? 'Usable' : 'Needs rework'
            };
             
            // Verbose logging: Score comparison
            console.log(`\n📊 [Re-scoring] Detailed Score Comparison:`);
            console.log(`   Overall: ${initialScore.total} → ${refinedScore.total} (${refinedScore.total > initialScore.total ? '+' : ''}${refinedScore.total - initialScore.total})`);
            console.log(`   Grade: ${initialScore.grade} → ${refinedScore.grade}`);
            console.log('');
            
            // Only use refined version if score improved
            if (refinementResult.accepted) {
              const improvement = refinedScore.total - initialScore.total;
              console.log(`✅ [Refinement] Score IMPROVED by ${improvement} points: ${initialScore.total} → ${refinedScore.total}`);
              console.log(`✅ [Refinement] Keeping refined version`);
              console.log(`✅ [Refinement] Original lesson saved for comparison`);
              finalLesson = refinementResult.refined;
              
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
              
              phases.push({
                phase: 'Auto-Refinement',
                status: 'completed',
                duration: Date.now() - phaseStart,
                output: `No improvement (${initialScore.total} → ${refinedScore.total})`
              });
            }
          } else {
            phases.push({
              phase: 'Auto-Refinement',
              status: 'completed',
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
        console.log(`✅ [Scoring] Score meets threshold (${initialScore.total} >= ${threshold}), no refinement needed`);
        phases.push({
          phase: 'Auto-Refinement',
          status: 'completed',
          duration: 0,
          output: `Score meets threshold (${initialScore.total}/100 >= ${threshold})`
        });
      }
      if (initialScore.total >= threshold) {
        refinementReport = {
          status: 'pass_no_refinement',
          threshold,
          initialScore: initialScore.total,
          finalScore: initialScore.total,
          acceptedCandidate: false,
          reason: 'Initial score meets threshold; refinement not required.',
          regressions: [],
        };
      } else if (!refinementResult) {
        refinementReport = {
          status: 'fail_refinement_error',
          threshold,
          initialScore: initialScore.total,
          finalScore: initialScore.total,
          acceptedCandidate: false,
          reason: 'Refinement pipeline did not complete.',
          regressions: [],
        };
      } else if (refinementResult.accepted && refinementResult.refinedScore >= threshold) {
        refinementReport = {
          status: 'pass_after_refinement',
          threshold,
          initialScore: initialScore.total,
          finalScore: refinementResult.refinedScore,
          acceptedCandidate: true,
          reason: refinementResult.reason,
          regressions: refinementResult.regressions,
        };
      } else if (refinementResult.regressions.length > 0) {
        refinementReport = {
          status: 'fail_regression',
          threshold,
          initialScore: initialScore.total,
          finalScore: refinementResult.refinedScore,
          acceptedCandidate: false,
          reason: refinementResult.reason,
          regressions: refinementResult.regressions,
        };
      } else {
        refinementReport = {
          status: 'fail_below_threshold',
          threshold,
          initialScore: initialScore.total,
          finalScore: refinementResult.refinedScore,
          acceptedCandidate: false,
          reason: refinementResult.reason,
          regressions: refinementResult.regressions,
        };
      }
      debugLog('SEQUENTIAL_GEN_COMPLETE', { lessonId, finalScore: refinementResult?.refinedScore || initialScore.total });
      debugLog('SEQUENTIAL_PHASES_SUMMARY', { lessonId, phases });
      console.log(`✅ [Sequential] Generation complete for ${lessonId}`);

      // Always include score metadata
      const scoreMetadata = refinementResult && refinementResult.improvementSuccess ? {
        wasRefined: true,
        originalScore: initialScore.total,
        finalScore: refinementResult.refinedScore,
        patchesApplied: refinementResult.patchesApplied.length,
        details: refinementResult.patchesApplied,
        phase10Score: initialScore,
        phase13: {
          ran: true,
          accepted: refinementResult.accepted,
          reason: refinementResult.reason,
          regressions: refinementResult.regressions,
          originalScoreDetail: refinementResult.phase13OriginalScoreDetail,
          candidateScoreDetail: refinementResult.phase13CandidateScoreDetail,
        },
        report: refinementReport,
      } : {
        wasRefined: false,
        originalScore: initialScore.total,
        finalScore: initialScore.total,
        patchesApplied: 0,
        details: [],
        phase10Score: initialScore,
        phase13: refinementResult
          ? {
              ran: true,
              accepted: refinementResult.accepted,
              reason: refinementResult.reason,
              regressions: refinementResult.regressions,
              originalScoreDetail: refinementResult.phase13OriginalScoreDetail,
              candidateScoreDetail: refinementResult.phase13CandidateScoreDetail,
            }
          : {
              ran: false,
              accepted: false,
              reason: 'Phase 13 did not run (no refinement required or refinement failed).',
              regressions: [],
            },
        report: refinementReport,
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
      debugLog('SEQUENTIAL_PHASES_SUMMARY', { lessonId, phases, failedAt: 'Unhandled Exception' });
      return { ...this.errorResult(error instanceof Error ? error.message : 'Unknown error in sequential generation'), phases };
    }
  }

  /**
   * Phase 1: Planning
   */
  private async runPhase1(request: GenerationRequest): Promise<PlanningOutput | null> {
    console.log('  📋 Phase 1: Planning lesson structure...');
    debugLog('PHASE1_START', { lessonId: `${request.unit}-${request.lessonId}` });

    const taskTypes = classifyLessonTask(request.topic, request.section, request.mustHaveTopics);
    const computedTaskMode = getTaskModeString(taskTypes, isPurposeOnly(request.mustHaveTopics));
    const blueprintRequirement = this.getBlueprintWorkedRequirement(request);
    const needsWorkedExample = requiresWorkedExample(taskTypes) || blueprintRequirement.requireWorkedExample;

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

    const normalizedPlan: PlanningOutput = {
      ...parsed.data,
      taskMode: parsed.data.taskMode?.trim() ? parsed.data.taskMode : computedTaskMode,
      needsWorkedExample: parsed.data.needsWorkedExample || blueprintRequirement.requireWorkedExample,
    };

    if (!Array.isArray(normalizedPlan.explanationSections) || normalizedPlan.explanationSections.length === 0) {
      normalizedPlan.explanationSections = [
        {
          order: 4,
          title: request.topic,
          topic: request.topic,
        },
      ];
    }

    debugLog('PHASE1_COMPLETE', {
      layout: normalizedPlan.layout,
      explanationSections: normalizedPlan.explanationSections.length,
      needsWorkedExample: normalizedPlan.needsWorkedExample,
      taskMode: normalizedPlan.taskMode,
    });
    console.log(`    ✓ Layout: ${normalizedPlan.layout}, Sections: ${normalizedPlan.explanationSections.length}`);
    
    return normalizedPlan;
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
    const lessonId = `${request.unit}-${request.lessonId}`;
    debugLog('PHASE5_START', { lessonId });
    const blueprintRequirement = this.getBlueprintWorkedRequirement(request);
    const mustIncludeWorkedBlocks =
      blueprintRequirement.requireWorkedExample || blueprintRequirement.requireGuidedPractice;
    const shouldGenerateWorkedExample = plan.needsWorkedExample || mustIncludeWorkedBlocks;

    const input = {
      lessonId,
      topic: request.topic,
      explanations: explanations.explanations,
      needsWorkedExample: shouldGenerateWorkedExample,
      taskMode: plan.taskMode,
    };

    if (!shouldGenerateWorkedExample) {
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
      if (mustIncludeWorkedBlocks) {
        return this.createFallbackWorkedExampleOutput(
          lessonId,
          request.topic,
          explanations.explanations,
          blueprintRequirement
        );
      }
      return null;
    }

    const ensured = this.ensureRequiredWorkedExampleBlocks(
      parsed.data,
      lessonId,
      request.topic,
      explanations.explanations,
      blueprintRequirement
    );

    debugLog('PHASE5_COMPLETE', {
      hasWorkedExample: !!ensured.workedExample,
      hasGuidedPractice: !!ensured.guidedPractice
    });
    console.log(`    ✓ Generated worked example + guided practice`);
    
    return ensured;
  }

  private getBlueprintWorkedRequirement(request: GenerationRequest): BlueprintWorkedRequirement {
    const lessonId = `${request.unit}-${request.lessonId}`;
    const defaultRequirement: BlueprintWorkedRequirement = {
      requireWorkedExample: false,
      requireGuidedPractice: false,
      workedExampleId: `${lessonId}-worked-example`,
      guidedPracticeId: `${lessonId}-guided`,
      workedExampleOrder: 6,
      guidedPracticeOrder: 7,
    };

    if (!request.masterLessonBlueprint || typeof request.masterLessonBlueprint !== 'object') {
      return defaultRequirement;
    }

    const blueprint = request.masterLessonBlueprint as {
      blockPlan?: { entries?: unknown };
      practiceSpec?: { guidedPracticeRequired?: unknown };
    };
    const entries = Array.isArray(blueprint.blockPlan?.entries)
      ? (blueprint.blockPlan.entries as BlueprintBlockPlanEntryLike[])
      : [];

    const findRequiredEntry = (
      matcher: (entry: BlueprintBlockPlanEntryLike) => boolean
    ): BlueprintBlockPlanEntryLike | undefined =>
      entries.find((entry) => entry.required === true && matcher(entry));

    const workedEntry = findRequiredEntry(
      (entry) => entry.type === 'worked-example' || entry.key === 'worked-example'
    );
    const guidedEntry = findRequiredEntry(
      (entry) => entry.type === 'guided-practice' || entry.key === 'guided-practice'
    );
    const guidedPracticeRequiredBySpec = blueprint.practiceSpec?.guidedPracticeRequired === true;

    const requireGuidedPractice = Boolean(guidedEntry) || guidedPracticeRequiredBySpec;
    const requireWorkedExample = Boolean(workedEntry) || requireGuidedPractice;

    return {
      requireWorkedExample,
      requireGuidedPractice,
      workedExampleId:
        typeof workedEntry?.id === 'string' && workedEntry.id.trim().length > 0
          ? workedEntry.id
          : defaultRequirement.workedExampleId,
      guidedPracticeId:
        typeof guidedEntry?.id === 'string' && guidedEntry.id.trim().length > 0
          ? guidedEntry.id
          : defaultRequirement.guidedPracticeId,
      workedExampleOrder:
        typeof workedEntry?.order === 'number' ? workedEntry.order : defaultRequirement.workedExampleOrder,
      guidedPracticeOrder:
        typeof guidedEntry?.order === 'number' ? guidedEntry.order : defaultRequirement.guidedPracticeOrder,
    };
  }

  private ensureRequiredWorkedExampleBlocks(
    output: WorkedExampleOutput,
    lessonId: string,
    topic: string,
    explanations: ExplanationOutput['explanations'],
    requirement: BlueprintWorkedRequirement
  ): WorkedExampleOutput {
    let workedExample = output.workedExample;
    let guidedPractice = output.guidedPractice;

    if (requirement.requireWorkedExample && !workedExample) {
      workedExample = this.createFallbackWorkedExampleBlock(lessonId, topic, explanations);
    }

    if (requirement.requireGuidedPractice && !guidedPractice) {
      guidedPractice = this.createFallbackGuidedPracticeBlock(lessonId, topic, workedExample);
    }

    if (workedExample && requirement.requireWorkedExample) {
      workedExample = {
        ...workedExample,
        id: requirement.workedExampleId,
        order: requirement.workedExampleOrder,
      };
    }

    if (guidedPractice && requirement.requireGuidedPractice) {
      guidedPractice = {
        ...guidedPractice,
        id: requirement.guidedPracticeId,
        order: requirement.guidedPracticeOrder,
      };
    }

    return {
      workedExample,
      guidedPractice,
    };
  }

  private createFallbackWorkedExampleOutput(
    lessonId: string,
    topic: string,
    explanations: ExplanationOutput['explanations'],
    requirement: BlueprintWorkedRequirement
  ): WorkedExampleOutput {
    const workedExample = requirement.requireWorkedExample
      ? {
          ...this.createFallbackWorkedExampleBlock(lessonId, topic, explanations),
          id: requirement.workedExampleId,
          order: requirement.workedExampleOrder,
        }
      : undefined;

    const guidedPractice = requirement.requireGuidedPractice
      ? {
          ...this.createFallbackGuidedPracticeBlock(lessonId, topic, workedExample),
          id: requirement.guidedPracticeId,
          order: requirement.guidedPracticeOrder,
        }
      : undefined;

    return { workedExample, guidedPractice };
  }

  private createFallbackWorkedExampleBlock(
    lessonId: string,
    topic: string,
    explanations: ExplanationOutput['explanations']
  ): WorkedExampleBlock {
    const anchorTitle = explanations[0]?.title || topic;
    return {
      id: `${lessonId}-worked-example`,
      order: 6,
      title: `Worked Example: Applying ${anchorTitle}`,
      given: `A learner must apply ${topic} to a realistic workplace-style scenario using the lesson rules.`,
      steps: [
        {
          stepNumber: 1,
          description: `Identify the scenario context and the key requirement linked to ${anchorTitle}.`,
          formula: null,
          calculation: null,
          result: 'Key requirement identified.',
        },
        {
          stepNumber: 2,
          description: 'Select the relevant rule, criterion, or information source from the taught explanation content.',
          formula: null,
          calculation: null,
          result: 'Relevant rule selected.',
        },
        {
          stepNumber: 3,
          description: 'Apply the selected rule and justify why the chosen outcome is appropriate for the scenario.',
          formula: null,
          calculation: null,
          result: 'Outcome justified with taught reasoning.',
        },
      ],
      notes: 'Deterministic fallback: generated to satisfy required blueprint structure.',
    };
  }

  private createFallbackGuidedPracticeBlock(
    lessonId: string,
    topic: string,
    workedExample?: WorkedExampleBlock
  ): GuidedPracticeBlock {
    const steps = (workedExample?.steps ?? []).map((step) => ({
      stepNumber: step.stepNumber,
      prompt: `Step ${step.stepNumber}: ${step.description}`,
      expectedAnswer: [step.result || 'A justified response based on taught lesson content.'],
      hint: 'Use the same reasoning pattern as the worked example.',
    }));

    const fallbackSteps =
      steps.length > 0
        ? steps
        : [
            {
              stepNumber: 1,
              prompt: 'Identify the key requirement in the scenario.',
              expectedAnswer: ['Key requirement identified from scenario details.'],
              hint: 'Start by naming the requirement before choosing an action.',
            },
            {
              stepNumber: 2,
              prompt: 'Select the best matching rule or source of information.',
              expectedAnswer: ['Relevant rule or source selected.'],
              hint: 'Choose the rule that directly addresses the requirement.',
            },
            {
              stepNumber: 3,
              prompt: 'State and justify the final outcome for this scenario.',
              expectedAnswer: ['Outcome justified using taught lesson reasoning.'],
              hint: 'Explain why the outcome is appropriate, not just what it is.',
            },
          ];

    return {
      id: `${lessonId}-guided`,
      order: 7,
      title: 'Guided Practice (We Do)',
      problem: `Apply ${topic} to a similar scenario and justify each step.`,
      steps: fallbackSteps,
    };
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
    
    // Generate 3 foundation questions from learning outcomes (domain-agnostic fallback)
    const questions = learningOutcomes.slice(0, 3).map((outcome, idx) => ({
      id: `${lessonId}-SR-${idx + 1}`,
      questionText: `Which prerequisite concept from earlier lessons supports this outcome: "${outcome}"?`,
      expectedAnswer: [
        'prerequisite concept from earlier lessons',
        'key prior concept',
        'foundation knowledge'
      ],
      hint: 'Think about what you learned in earlier lessons',
      answerType: 'short-text' as const
    }));
    
    // If less than 3 outcomes, pad with generic questions
    while (questions.length < 3) {
      const idx = questions.length;
      questions.push({
        id: `${lessonId}-SR-${idx + 1}`,
        questionText: `Name one prerequisite idea you should review before starting "${title}".`,
        expectedAnswer: [
          'a key prior concept',
          'foundation knowledge',
          'prerequisite topic'
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
      previousLessonTitles: prevTitles,
      prerequisiteAnchors: request.prerequisiteAnchors,
      foundationAnchors: request.foundationAnchors,
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
  private async runPhase10(
    lesson: Lesson,
    phase10Score: Phase10Score,
    debugCollector: DebugBundleCollector,
    request: GenerationRequest,
    threshold: number
  ): Promise<RefinementOutput | null> {
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
        threshold
      );

      if (result.candidateScoreDetail) {
        const candidate = result.candidateScoreDetail;
        console.log(`  📊 Phase 13 Candidate Score: ${candidate.total}/100 (${candidate.grade})`);
        console.log(`     - Beginner Clarity: ${candidate.breakdown.beginnerClarity}/30`);
        console.log(`     - Teaching-Before-Testing: ${candidate.breakdown.teachingBeforeTesting}/25`);
        console.log(`     - Marking Robustness: ${candidate.breakdown.markingRobustness}/20`);
        console.log(`     - Alignment to LO: ${candidate.breakdown.alignmentToLO}/15`);
        console.log(`     - Question Quality: ${candidate.breakdown.questionQuality}/10`);
        console.log(`     - Issues: ${candidate.issues.length}`);
        if (candidate.issues.length > 0) {
          candidate.issues.forEach((issue, idx) => {
            console.log(`       ${idx + 1}. [${issue.category}] ${issue.id}: ${issue.problem}`);
          });
        }
      }
      debugLog('PHASE13_SCORE_FULL', {
        original: result.originalScoreDetail || null,
        candidate: result.candidateScoreDetail || null,
        accepted: result.accepted,
        reason: result.reason,
        improvement: result.improvement,
        regressions: result.regressions,
      });
      
      if (!result.accepted) {
        console.log(`  ⚠️  Phase 13: Candidate rejected - ${result.reason}`);
        console.log(`  ↩️  Keeping original lesson (original: ${result.originalScore}, candidate: ${result.candidateScore})`);
      } else {
        console.log(`  ✅ Phase 13: Accepted (${result.originalScore} → ${result.candidateScore}, +${result.improvement})`);
      }
      
      // Convert to RefinementOutput format for compatibility
      return {
        originalLesson: lesson,
        refined: refinement.refinedLesson,
        patchesApplied: [],  // New pipeline doesn't track patches this way
        originalScore: result.originalScore,
        refinedScore: result.candidateScore,
        accepted: result.accepted,
        reason: result.reason,
        regressions: result.regressions,
        improvementSuccess: result.accepted,
        phase13OriginalScoreDetail: result.originalScoreDetail,
        phase13CandidateScoreDetail: result.candidateScoreDetail,
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
        console.warn(`[${phaseName}] Initial JSON parse failed, attempting string repair...`);
        const repaired = repairMalformedJsonStrings(preprocessed);
        const repairedParsed = safeJsonParse<T>(repaired);
        if (repairedParsed.success && repairedParsed.data) {
          console.log(`[${phaseName}] Successfully parsed after string repair`);
          return {
            success: true,
            data: repairedParsed.data,
          };
        }

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

