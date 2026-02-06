/**
 * Phase 10 Root Cause Analyzer
 * 
 * Uses LLM to analyze why Phase 10 refinements fail or succeed.
 * Provides detailed insights into harmful patches, reasoning flaws, and patterns.
 */

import { Phase10DiagnosticData, Phase10Analysis } from '../generation/types';
import { createLLMClientWithFallback } from '../llm/client';
import { getGeminiModelWithDefault } from '@/lib/config/geminiConfig';
import { preprocessToValidJson, safeJsonParse } from '../generation/utils';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Format score breakdown for LLM readability
 */
function formatScoreBreakdown(score: any): string {
  if (!score || !score.details) {
    return 'No details available';
  }
  
  let formatted = `Total: ${score.total}/100 (${score.grade})\n\nBreakdown:\n`;
  
  for (const detail of score.details) {
    formatted += `\n${detail.section}: ${detail.score}/${detail.maxScore}\n`;
    if (detail.issues && detail.issues.length > 0) {
      formatted += `  Issues: ${detail.issues.join(', ')}\n`;
    }
    if (detail.suggestions && detail.suggestions.length > 0) {
      formatted += `  Suggestions: ${detail.suggestions.join(', ')}\n`;
    }
  }
  
  return formatted;
}

/**
 * Format patches for LLM readability
 */
function formatPatches(patches: any[]): string {
  if (!patches || patches.length === 0) {
    return 'No patches applied';
  }
  
  return patches.map((patch, idx) => {
    return `PATCH ${idx + 1}:
  Path: ${patch.path}
  Operation: ${patch.op}
  Reason: ${patch.reason || 'Not specified'}
  Old Value: ${JSON.stringify(patch.oldValue || patch.from)}
  New Value: ${JSON.stringify(patch.value || patch.newValue)}
  Expected Points Recovered: ${patch.pointsRecovered || 'Unknown'}`;
  }).join('\n\n');
}

/**
 * Analyze a failed Phase 10 refinement using LLM
 */
export async function analyzeFailure(diagnosticData: Phase10DiagnosticData): Promise<Phase10Analysis> {
  const startTime = Date.now();
  
  console.log(`\n🔍 [Analyzer] Starting root cause analysis for lesson ${diagnosticData.lessonId}`);
  console.log(`🔍 [Analyzer] Score change: ${diagnosticData.originalScore.total} → ${diagnosticData.refinedScore.total} (${diagnosticData.scoreDelta})`);
  
  // Build detailed prompt for LLM
  const prompt = `You are an expert at analyzing educational content quality and refinement failures.

A Phase 10 refinement attempt has just FAILED - the score DECLINED instead of improving.

Your task is to analyze WHY this happened and provide actionable insights.

# SCORES

ORIGINAL SCORE: ${diagnosticData.originalScore.total}/100
REFINED SCORE: ${diagnosticData.refinedScore.total}/100
SCORE CHANGE: ${diagnosticData.scoreDelta} points (DECLINED)

# SCORE BREAKDOWNS

## Original Score Details:
${formatScoreBreakdown(diagnosticData.originalScore)}

## Refined Score Details:
${formatScoreBreakdown(diagnosticData.refinedScore)}

# PATCHES APPLIED

${formatPatches(diagnosticData.patchesApplied)}

# SECTION-LEVEL IMPACTS

${diagnosticData.sectionImpacts.map(impact => 
  `${impact.section}: ${impact.originalScore} → ${impact.refinedScore} (${impact.delta > 0 ? '+' : ''}${impact.delta})`
).join('\n')}

# YOUR ANALYSIS TASK

Analyze this failure comprehensively and provide:

1. **Root Cause**: A clear, concise explanation of why the score declined
2. **Harmful Patches**: Identify which specific patches caused harm and explain why
3. **Reasoning Flaws**: What was wrong with Phase 10's reasoning when it generated these patches?
4. **Patterns**: What patterns do you see that could help prevent similar failures?
5. **Recommendations**: Specific, actionable recommendations for preventing this type of failure

CRITICAL: Be specific. Reference exact patch numbers, score sections, and point changes.

Respond ONLY with valid JSON matching this structure (no markdown code blocks):

{
  "rootCause": "string - clear explanation of why score declined",
  "harmfulPatches": [
    {
      "patchIndex": number,
      "path": "string - JSON path",
      "intendedFix": "string - what Phase 10 was trying to fix",
      "actualEffect": "string - what actually happened",
      "whyHarmful": "string - why this made things worse",
      "pointsLost": number
    }
  ],
  "reasoningFlaws": [
    "string - flaw 1 in Phase 10's reasoning",
    "string - flaw 2 in Phase 10's reasoning"
  ],
  "patterns": [
    "string - pattern 1 observed",
    "string - pattern 2 observed"
  ],
  "recommendations": [
    "string - specific recommendation 1",
    "string - specific recommendation 2"
  ]
}`;

  try {
    // Get LLM client
    const client = await createLLMClientWithFallback();
    const model = client.getGenerativeModel({
      model: getGeminiModelWithDefault(),
      generationConfig: {
        temperature: 0.0, // Deterministic analysis
        maxOutputTokens: 8000,
      },
    });
    
    // Generate analysis
    console.log(`🔍 [Analyzer] Calling LLM for analysis...`);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    console.log(`🔍 [Analyzer] LLM response received (${responseText.length} chars)`);
    
    // Parse response
    let cleaned = responseText.trim();
    
    // Remove markdown code blocks if present
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const preprocessed = preprocessToValidJson(cleaned);
    const parsed = safeJsonParse(preprocessed);
    
    if (!parsed.success || !parsed.data) {
      throw new Error(`Failed to parse LLM analysis response: ${parsed.error || 'Unknown error'}`);
    }
    
    const analysisData = parsed.data as any;
    
    // Validate required fields
    if (!analysisData.rootCause || typeof analysisData.rootCause !== 'string') {
      throw new Error('Analysis missing required field: rootCause');
    }
    
    const analysis: Phase10Analysis = {
      lessonId: diagnosticData.lessonId,
      timestamp: new Date().toISOString(),
      diagnosticData,
      rootCause: analysisData.rootCause,
      harmfulPatches: analysisData.harmfulPatches || [],
      reasoningFlaws: analysisData.reasoningFlaws || [],
      patterns: analysisData.patterns || [],
      recommendations: analysisData.recommendations || [],
      analysisModel: getGeminiModelWithDefault(),
      analysisDuration: Date.now() - startTime,
    };
    
    console.log(`✅ [Analyzer] Analysis complete (${analysis.analysisDuration}ms)`);
    console.log(`✅ [Analyzer] Root cause: ${analysis.rootCause.substring(0, 100)}...`);
    console.log(`✅ [Analyzer] Found ${analysis.harmfulPatches.length} harmful patches`);
    console.log(`✅ [Analyzer] Identified ${analysis.reasoningFlaws.length} reasoning flaws`);
    
    return analysis;
    
  } catch (error) {
    console.error(`❌ [Analyzer] Analysis failed:`, error);
    
    // Return a basic analysis on error
    return {
      lessonId: diagnosticData.lessonId,
      timestamp: new Date().toISOString(),
      diagnosticData,
      rootCause: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      harmfulPatches: [],
      reasoningFlaws: ['LLM analysis failed'],
      patterns: [],
      recommendations: ['Review diagnostic data manually'],
      analysisModel: getGeminiModelWithDefault(),
      analysisDuration: Date.now() - startTime,
    };
  }
}

/**
 * Analyze a successful Phase 10 refinement (for pattern identification)
 */
export async function analyzeSuccess(diagnosticData: Phase10DiagnosticData): Promise<Phase10Analysis> {
  const startTime = Date.now();
  
  console.log(`\n✅ [Analyzer] Analyzing successful refinement for lesson ${diagnosticData.lessonId}`);
  console.log(`✅ [Analyzer] Score improvement: ${diagnosticData.originalScore.total} → ${diagnosticData.refinedScore.total} (+${diagnosticData.scoreDelta})`);
  
  const prompt = `You are an expert at analyzing educational content quality improvements.

A Phase 10 refinement attempt has just SUCCEEDED - the score improved.

Your task is to analyze what worked well so we can replicate this success.

# SCORES

ORIGINAL SCORE: ${diagnosticData.originalScore.total}/100
REFINED SCORE: ${diagnosticData.refinedScore.total}/100
SCORE IMPROVEMENT: +${diagnosticData.scoreDelta} points

# SCORE BREAKDOWNS

## Original Score Details:
${formatScoreBreakdown(diagnosticData.originalScore)}

## Refined Score Details:
${formatScoreBreakdown(diagnosticData.refinedScore)}

# PATCHES APPLIED (SUCCESSFUL)

${formatPatches(diagnosticData.patchesApplied)}

# SECTION-LEVEL IMPACTS

${diagnosticData.sectionImpacts.map(impact => 
  `${impact.section}: ${impact.originalScore} → ${impact.refinedScore} (${impact.delta > 0 ? '+' : ''}${impact.delta})`
).join('\n')}

# YOUR ANALYSIS TASK

Analyze this success and identify:

1. **Root Cause**: Why did these patches work?
2. **Effective Patterns**: What patterns in the patches led to improvement?
3. **Key Insights**: What can we learn from this success?
4. **Recommendations**: How can we replicate this success in future refinements?

Respond ONLY with valid JSON matching this structure (no markdown code blocks):

{
  "rootCause": "string - why these patches worked",
  "harmfulPatches": [],
  "reasoningFlaws": [],
  "patterns": [
    "string - effective pattern 1",
    "string - effective pattern 2"
  ],
  "recommendations": [
    "string - recommendation 1 based on this success",
    "string - recommendation 2 based on this success"
  ]
}`;

  try {
    const client = await createLLMClientWithFallback();
    const model = client.getGenerativeModel({
      model: getGeminiModelWithDefault(),
      generationConfig: {
        temperature: 0.0,
        maxOutputTokens: 6000,
      },
    });
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    let cleaned = responseText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    
    const preprocessed = preprocessToValidJson(cleaned);
    const parsed = safeJsonParse(preprocessed);
    
    if (!parsed.success || !parsed.data) {
      throw new Error(`Failed to parse analysis: ${parsed.error}`);
    }
    
    const analysisData = parsed.data as any;
    
    return {
      lessonId: diagnosticData.lessonId,
      timestamp: new Date().toISOString(),
      diagnosticData,
      rootCause: analysisData.rootCause || 'Success analysis completed',
      harmfulPatches: [],
      reasoningFlaws: [],
      patterns: analysisData.patterns || [],
      recommendations: analysisData.recommendations || [],
      analysisModel: getGeminiModelWithDefault(),
      analysisDuration: Date.now() - startTime,
    };
    
  } catch (error) {
    console.error(`❌ [Analyzer] Success analysis failed:`, error);
    return {
      lessonId: diagnosticData.lessonId,
      timestamp: new Date().toISOString(),
      diagnosticData,
      rootCause: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      harmfulPatches: [],
      reasoningFlaws: [],
      patterns: [],
      recommendations: [],
      analysisModel: getGeminiModelWithDefault(),
      analysisDuration: Date.now() - startTime,
    };
  }
}

/**
 * Save analysis to file
 */
export function saveAnalysis(analysis: Phase10Analysis): void {
  try {
    const reportsDir = path.join(process.cwd(), 'quiz-app', 'reports', 'phase10-analysis');
    
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const filename = `${analysis.lessonId}-${Date.now()}.json`;
    const filepath = path.join(reportsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(analysis, null, 2), 'utf-8');
    
    console.log(`💾 [Analyzer] Analysis saved: ${filename}`);
    
  } catch (error) {
    console.error(`❌ [Analyzer] Failed to save analysis:`, error);
  }
}
