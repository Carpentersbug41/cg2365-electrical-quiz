/**
 * Postmortem Analyzer for Phase 10 Refinement
 * 
 * Uses LLM to analyze a refinement run and identify:
 * - Root cause of score changes
 * - Which patches were harmful and why
 * - Reasoning flaws in patch generation
 * - Patterns across patches
 * - Recommendations for improvements
 */

import { GenerationDebugBundle, PostmortemAnalysis } from './types';
import { preprocessToValidJson, safeJsonParse } from './utils';

/**
 * Build system prompt for postmortem analysis
 */
function buildSystemPrompt(): string {
  return `You are an expert at diagnosing why automated lesson refinement attempts fail or succeed.

Your task is to analyze Phase 10 refinement runs and provide actionable insights.

ANALYSIS GOALS:
1. Identify the root cause of score change (improved/declined/no-change)
2. Identify which patches were harmful and why
3. Detect reasoning flaws in patch generation
4. Find patterns across patches (good and bad)
5. Provide concrete recommendations for improvement

OUTPUT FORMAT (JSON only, no markdown):
{
  "rootCause": "Brief explanation of why the score changed (or didn't)",
  "harmfulPatches": [
    {
      "patchIndex": 0,
      "why": "Explanation of why this patch was harmful",
      "pointsLost": -3
    }
  ],
  "reasoningFlaws": [
    "Flaw 1: Description of reasoning error",
    "Flaw 2: Description of another error"
  ],
  "patterns": [
    "Pattern 1: Observation about patches",
    "Pattern 2: Another observation"
  ],
  "recommendations": [
    "Recommendation 1: Specific prompt improvement",
    "Recommendation 2: Specific validation rule to add"
  ]
}

ANALYSIS PRINCIPLES:
- Focus on learning quality issues (beginner clarity, alignment, questions)
- Distinguish between mechanical issues (IDs, formatting) and pedagogical issues
- Identify if patches addressed the wrong problem
- Check if patches had unintended side effects
- Look for patches that conflicted with each other
- Note if isolation scores reveal interaction effects

Be specific and actionable in recommendations. Don't just say "improve prompts" - say exactly what to add or change.`;
}

/**
 * Build user prompt with debug bundle data
 */
function buildUserPrompt(bundle: GenerationDebugBundle): string {
  const lines: string[] = [];

  lines.push('REFINEMENT RUN TO ANALYZE:\n');

  // Basic info
  lines.push(`Lesson: ${bundle.lessonMeta.id} - ${bundle.lessonMeta.title || 'N/A'}`);
  lines.push(`Timestamp: ${bundle.timestampISO}`);
  lines.push(`\n`);

  // Scores
  const baselineScore = bundle.baseline.score?.total || 0;
  const refinedScore = bundle.phase10?.refined?.score?.total || 0;
  const delta = refinedScore - baselineScore;

  lines.push(`OUTCOME:`);
  lines.push(`Baseline Score: ${baselineScore}/100`);
  lines.push(`Refined Score: ${refinedScore}/100`);
  lines.push(`Delta: ${delta > 0 ? '+' : ''}${delta} points`);
  lines.push(`Accepted: ${bundle.phase10?.accepted ? 'Yes' : 'No'}`);
  lines.push(`\n`);

  // Section-level score changes
  if (bundle.baseline.score?.details && bundle.phase10?.refined?.score?.details) {
    lines.push(`SECTION SCORE CHANGES:`);
    const baseDetails = bundle.baseline.score.details;
    const refDetails = bundle.phase10.refined.score.details;

    for (let i = 0; i < baseDetails.length; i++) {
      const base = baseDetails[i];
      const ref = refDetails[i];
      if (ref) {
        const sectionDelta = ref.score - base.score;
        if (sectionDelta !== 0) {
          lines.push(`  ${base.section}: ${base.score} → ${ref.score} (${sectionDelta > 0 ? '+' : ''}${sectionDelta})`);
        }
      }
    }
    lines.push(`\n`);
  }

  // Issues targeted
  if (bundle.phase10?.extractedIssues && bundle.phase10.extractedIssues.length > 0) {
    lines.push(`ISSUES TARGETED BY PHASE 10:`);
    bundle.phase10.extractedIssues.forEach((issue, idx) => {
      lines.push(`  ${idx + 1}. [${issue.section}] ${issue.issue}`);
      lines.push(`     Suggestion: ${issue.suggestion}`);
      lines.push(`     Points lost: ${issue.pointsLost}, Severity: ${issue.severity.toFixed(1)}`);
    });
    lines.push(`\n`);
  }

  // Patches with isolation results
  if (bundle.phase10?.patches && bundle.phase10.patches.length > 0) {
    lines.push(`PATCHES APPLIED (with isolation scores):`);
    bundle.phase10.patches.forEach((patch, idx) => {
      lines.push(`  Patch ${idx + 1}:`);
      lines.push(`    Status: ${patch.applyStatus}`);
      lines.push(`    Op: ${patch.op}`);
      lines.push(`    Path: ${patch.path}`);
      lines.push(`    Reason: ${patch.reason || 'N/A'}`);

      // Validation issues
      if (patch.validation.reasons.length > 0) {
        lines.push(`    Validation issues: ${patch.validation.reasons.join('; ')}`);
      }

      // Isolation scores
      if (patch.scoreDeltaSequential !== undefined) {
        lines.push(`    Sequential impact: ${patch.scoreDeltaSequential > 0 ? '+' : ''}${patch.scoreDeltaSequential} points`);
        if (patch.sectionDeltasSequential && Object.keys(patch.sectionDeltasSequential).length > 0) {
          const sections = Object.entries(patch.sectionDeltasSequential)
            .map(([s, d]) => `${s}: ${d > 0 ? '+' : ''}${d}`)
            .join(', ');
          lines.push(`      Sections: ${sections}`);
        }
      }

      if (patch.scoreDeltaIndependent !== undefined) {
        lines.push(`    Independent impact: ${patch.scoreDeltaIndependent > 0 ? '+' : ''}${patch.scoreDeltaIndependent} points`);
      }

      // Flag harmful patches
      if ((patch.scoreDeltaSequential || 0) <= -2) {
        lines.push(`    ⚠️ HARMFUL PATCH (sequential impact: ${patch.scoreDeltaSequential})`);
      }
      if ((patch.scoreDeltaIndependent || 0) <= -2) {
        lines.push(`    ⚠️ HARMFUL PATCH (independent impact: ${patch.scoreDeltaIndependent})`);
      }

      lines.push('');
    });
  }

  // Changed paths
  if (bundle.diffs.changedPaths.length > 0) {
    lines.push(`CHANGED PATHS: ${bundle.diffs.changedPaths.length} total`);
    lines.push(`  ${bundle.diffs.changedPaths.slice(0, 10).join(', ')}${bundle.diffs.changedPaths.length > 10 ? ', ...' : ''}`);
    lines.push(`\n`);
  }

  // ID audit issues
  if (bundle.diffs.idAudit.invalidIds.length > 0 || bundle.diffs.idAudit.duplicateIds.length > 0) {
    lines.push(`ID AUDIT ISSUES:`);
    if (bundle.diffs.idAudit.invalidIds.length > 0) {
      lines.push(`  Invalid IDs: ${bundle.diffs.idAudit.invalidIds.slice(0, 5).join(', ')}`);
    }
    if (bundle.diffs.idAudit.duplicateIds.length > 0) {
      lines.push(`  Duplicate IDs: ${bundle.diffs.idAudit.duplicateIds.slice(0, 5).join(', ')}`);
    }
    lines.push(`\n`);
  }

  lines.push(`\nProvide your analysis in the JSON format specified above. Be specific and actionable.`);

  return lines.join('\n');
}

/**
 * Analyze a refinement run using LLM
 */
export async function analyzeRefinementRun(
  bundle: GenerationDebugBundle,
  generateWithRetry: (
    systemPrompt: string,
    userPrompt: string,
    type: 'lesson' | 'quiz' | 'phase',
    maxRetries: number,
    attemptHigherLimit?: boolean,
    tokenLimit?: number
  ) => Promise<string>
): Promise<PostmortemAnalysis> {
  console.log(`\n🔍 [Postmortem] Running postmortem analysis...`);

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(bundle);

  try {
    // Call LLM for analysis
    const response = await generateWithRetry(
      systemPrompt,
      userPrompt,
      'phase',
      2,
      false,
      8000 // High token limit for detailed analysis
    );

    // Parse response
    let cleaned = response.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    const preprocessed = preprocessToValidJson(cleaned);
    const parsed = safeJsonParse(preprocessed);

    if (!parsed.success || !parsed.data) {
      throw new Error(`Failed to parse postmortem response: ${parsed.error}`);
    }

    const data = parsed.data as any;

    // Validate and structure the result
    const analysis: PostmortemAnalysis = {
      rootCause: data.rootCause || 'Unable to determine root cause',
      harmfulPatches: data.harmfulPatches || [],
      reasoningFlaws: data.reasoningFlaws || [],
      patterns: data.patterns || [],
      recommendations: data.recommendations || [],
    };

    console.log(`✅ [Postmortem] Analysis complete!`);
    console.log(`   Root cause: ${analysis.rootCause}`);
    console.log(`   Harmful patches: ${analysis.harmfulPatches.length}`);
    console.log(`   Recommendations: ${analysis.recommendations.length}`);

    return analysis;
  } catch (error) {
    console.error('❌ [Postmortem] Error during postmortem analysis:', error);

    // Return a default analysis on error
    return {
      rootCause: `Postmortem analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      harmfulPatches: [],
      reasoningFlaws: [`Analysis error: ${error instanceof Error ? error.message : 'Unknown error'}`],
      patterns: [],
      recommendations: ['Fix postmortem analysis system', 'Check LLM availability'],
    };
  }
}
