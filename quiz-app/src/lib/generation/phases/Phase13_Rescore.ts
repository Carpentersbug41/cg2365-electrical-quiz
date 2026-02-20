/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/**
 * Phase 13: Rescore & Compare
 *
 * Independently rescores the candidate lesson and compares with original score.
 * Makes final accept/reject decision based on improvement plus pedagogical guardrails.
 */

import { Lesson } from '../types';
import { Phase10_Score, Phase10Score } from './Phase10_Score';
import { SyllabusContext } from '@/lib/syllabus/syllabusRAG';
import { debugLogger } from '../debugLogger';

export interface Phase13Result {
  accepted: boolean;
  originalScore: number;
  candidateScore: number;
  improvement: number;
  finalLesson: Lesson;
  reason: string;
  regressions: string[];
  originalScoreDetail?: Phase10Score;
  candidateScoreDetail?: Phase10Score;
}

export class Phase13_Rescore {
  private scorer: Phase10_Score;

  constructor() {
    this.scorer = new Phase10_Score();
  }

  /**
   * Rescore candidate and make accept/reject decision
   */
  async rescoreAndCompare(
    originalLesson: Lesson,
    candidateLesson: Lesson,
    originalScore: Phase10Score,
    syllabusContext: SyllabusContext | null,
    generateFn: Function,
    threshold: number = 95 // Kept for compatibility
  ): Promise<Phase13Result> {
    const stopTimer = debugLogger.startTimer('Phase 13: Rescore & Compare');

    console.log(`\n[Phase13_Rescore] Rescoring candidate lesson...`);
    console.log(`   - Original score: ${originalScore.total}/100`);
    console.log(`   - Threshold: ${threshold}/100`);

    debugLogger.phaseHeader('Phase 13: Rescore & Compare', originalLesson.id);

    debugLogger.logInput('Input', {
      'Original Score': `${originalScore.total}/100 (${originalScore.grade})`,
      'Threshold': `${threshold}/100`,
      'Original Block Count': originalLesson.blocks.length,
      'Candidate Block Count': candidateLesson.blocks.length,
      'Syllabus Context Available': syllabusContext ? 'yes' : 'no'
    });

    // Rescore the candidate using Phase 10 scorer
    console.log(`[Phase13_Rescore] Scoring candidate...`);
    debugLogger.logStep('\nRescoring candidate lesson with Phase 10...');

    if (process.env.DEBUG_PHASE10 === 'true') {
      console.log('\n\n>>> ENTERING PHASE 13: Rescore & Compare - Calling Phase 10 for rescore <<<\n');
    }

    const candidateScore = await this.scorer.scoreLesson(
      candidateLesson,
      generateFn,
      undefined // No additional instructions needed for rescoring
    );

    console.log(`[Phase13_Rescore] Candidate score: ${candidateScore.total}/100`);

    // Calculate improvement
    const improvement = candidateScore.total - originalScore.total;
    console.log(`   - Improvement: ${improvement > 0 ? '+' : ''}${improvement} points`);

    // Verbose: Show detailed comparison
    debugLogger.logComparison([
      {
        label: 'Beginner Clarity',
        before: `${originalScore.breakdown.beginnerClarity}/30`,
        after: `${candidateScore.breakdown.beginnerClarity}/30`,
        delta: `${candidateScore.breakdown.beginnerClarity >= originalScore.breakdown.beginnerClarity ? '+' : ''}${candidateScore.breakdown.beginnerClarity - originalScore.breakdown.beginnerClarity}`
      },
      {
        label: 'Teaching-Before-Testing',
        before: `${originalScore.breakdown.teachingBeforeTesting}/25`,
        after: `${candidateScore.breakdown.teachingBeforeTesting}/25`,
        delta: `${candidateScore.breakdown.teachingBeforeTesting >= originalScore.breakdown.teachingBeforeTesting ? '+' : ''}${candidateScore.breakdown.teachingBeforeTesting - originalScore.breakdown.teachingBeforeTesting}`
      },
      {
        label: 'Marking Robustness',
        before: `${originalScore.breakdown.markingRobustness}/20`,
        after: `${candidateScore.breakdown.markingRobustness}/20`,
        delta: `${candidateScore.breakdown.markingRobustness >= originalScore.breakdown.markingRobustness ? '+' : ''}${candidateScore.breakdown.markingRobustness - originalScore.breakdown.markingRobustness}`
      },
      {
        label: 'Alignment to LO',
        before: `${originalScore.breakdown.alignmentToLO}/15`,
        after: `${candidateScore.breakdown.alignmentToLO}/15`,
        delta: `${candidateScore.breakdown.alignmentToLO >= originalScore.breakdown.alignmentToLO ? '+' : ''}${candidateScore.breakdown.alignmentToLO - originalScore.breakdown.alignmentToLO}`
      },
      {
        label: 'Question Quality',
        before: `${originalScore.breakdown.questionQuality}/10`,
        after: `${candidateScore.breakdown.questionQuality}/10`,
        delta: `${candidateScore.breakdown.questionQuality >= originalScore.breakdown.questionQuality ? '+' : ''}${candidateScore.breakdown.questionQuality - originalScore.breakdown.questionQuality}`
      },
      {
        label: 'TOTAL',
        before: `${originalScore.total}/100`,
        after: `${candidateScore.total}/100`,
        delta: `${improvement >= 0 ? '+' : ''}${improvement}`
      }
    ]);

    // Decision logic:
    // Default policy is score-first (simpler and easier to reason about):
    // accept if candidate meets threshold and improves total score (or keeps score with fewer issues).
    // Optional strict mode can be enabled via PHASE13_STRICT_REGRESSIONS=true.
    const improves = candidateScore.total > originalScore.total;
    const sameScore = candidateScore.total === originalScore.total;
    const fewerIssuesAtSameScore = sameScore && candidateScore.issues.length < originalScore.issues.length;

    const domainRegressions: string[] = [];
    const pedagogyRegressions: string[] = [];
    if (candidateScore.breakdown.beginnerClarity < originalScore.breakdown.beginnerClarity) {
      const msg = `beginnerClarity ${originalScore.breakdown.beginnerClarity}->${candidateScore.breakdown.beginnerClarity}`;
      domainRegressions.push(msg);
      pedagogyRegressions.push(msg);
    }
    if (candidateScore.breakdown.teachingBeforeTesting < originalScore.breakdown.teachingBeforeTesting) {
      const msg =
        `teachingBeforeTesting ${originalScore.breakdown.teachingBeforeTesting}->${candidateScore.breakdown.teachingBeforeTesting}`;
      domainRegressions.push(msg);
      pedagogyRegressions.push(msg);
    }
    if (candidateScore.breakdown.markingRobustness < originalScore.breakdown.markingRobustness) {
      domainRegressions.push(
        `markingRobustness ${originalScore.breakdown.markingRobustness}->${candidateScore.breakdown.markingRobustness}`
      );
    }
    if (candidateScore.breakdown.alignmentToLO < originalScore.breakdown.alignmentToLO) {
      domainRegressions.push(
        `alignmentToLO ${originalScore.breakdown.alignmentToLO}->${candidateScore.breakdown.alignmentToLO}`
      );
    }
    if (candidateScore.breakdown.questionQuality < originalScore.breakdown.questionQuality) {
      domainRegressions.push(
        `questionQuality ${originalScore.breakdown.questionQuality}->${candidateScore.breakdown.questionQuality}`
      );
    }

    const meetsThreshold = candidateScore.total >= threshold;
    const hasNoDomainRegressions = domainRegressions.length === 0;
    const strictNoRegressionGate = process.env.PHASE13_STRICT_REGRESSIONS === 'true';
    const accepted = strictNoRegressionGate
      ? (meetsThreshold && hasNoDomainRegressions && (improves || fewerIssuesAtSameScore))
      : (meetsThreshold && (improves || fewerIssuesAtSameScore));

    let reason: string;
    if (!meetsThreshold) {
      reason = `Candidate score ${candidateScore.total} is below threshold ${threshold}`;
    } else if (strictNoRegressionGate && !hasNoDomainRegressions) {
      reason = `Candidate has domain regressions: ${domainRegressions.join(', ')}`;
    } else if (improves) {
      reason = strictNoRegressionGate
        ? `Candidate improves on original (${candidateScore.total} > ${originalScore.total}) with no domain regression`
        : `Candidate improves on original (${candidateScore.total} > ${originalScore.total}) and meets threshold`;
    } else if (fewerIssuesAtSameScore) {
      reason = `Candidate keeps score (${candidateScore.total}) and reduces issue count (${candidateScore.issues.length} < ${originalScore.issues.length})`;
    } else {
      reason = `Candidate does not improve score or issue count (${candidateScore.total}/${candidateScore.issues.length} vs ${originalScore.total}/${originalScore.issues.length})`;
    }

    if (domainRegressions.length > 0) {
      console.warn(`[Phase13_Rescore] Domain regressions detected: ${domainRegressions.join('; ')}`);
    }
    if (pedagogyRegressions.length > 0) {
      console.warn(`[Phase13_Rescore] Pedagogy regressions detected: ${pedagogyRegressions.join('; ')}`);
    }

    console.log(`[Phase13_Rescore] Decision: ${accepted ? 'ACCEPT' : 'REJECT'}`);
    console.log(`   - ${reason}`);

    // Verbose: Log decision details
    if (debugLogger.isEnabled()) {
      console.log('\nDecision Logic:');
      console.log(`  - Improves on original: ${improves ? 'YES' : 'NO'} (${candidateScore.total} ${improves ? '>' : '<='} ${originalScore.total})`);
      console.log(`  - Fewer issues at same score: ${fewerIssuesAtSameScore ? 'YES' : 'NO'}`);
      console.log(`  - Meets threshold: ${meetsThreshold ? 'YES' : 'NO'} (${candidateScore.total} ${meetsThreshold ? '>=' : '<'} ${threshold})`);
      console.log(`  - Strict regression gate: ${strictNoRegressionGate ? 'ON' : 'OFF'} (env PHASE13_STRICT_REGRESSIONS)`);
      console.log(`  - Domain regressions: ${domainRegressions.length === 0 ? 'NONE' : domainRegressions.join('; ')}`);
      console.log(`  - Pedagogy regressions: ${pedagogyRegressions.length === 0 ? 'NONE' : pedagogyRegressions.join('; ')}`);
      console.log(`  - Final Decision: ${accepted ? 'ACCEPT' : 'KEEP ORIGINAL'} (policy: ${strictNoRegressionGate ? 'strict no-regressions gate' : 'score-first gate'})`);
      console.log(`  - Reason: ${reason}`);
      console.log(`  - Final Lesson: ${accepted ? 'CANDIDATE' : 'ORIGINAL'} (best pedagogical outcome)`);
    }

    if (accepted) {
      debugLogger.logSuccess(`ACCEPTED: Candidate selected (${originalScore.total} -> ${candidateScore.total}, delta ${improvement >= 0 ? '+' : ''}${improvement})`);
    } else {
      debugLogger.logWarning(`REJECTED: ${reason}`);
    }

    stopTimer();

    return {
      accepted,
      originalScore: originalScore.total,
      candidateScore: candidateScore.total,
      improvement,
      finalLesson: accepted ? candidateLesson : originalLesson,
      reason,
      regressions: domainRegressions,
      originalScoreDetail: originalScore,
      candidateScoreDetail: candidateScore,
    };
  }
}

