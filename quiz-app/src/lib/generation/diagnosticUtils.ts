/**
 * Diagnostic Data Utilities for Phase 10 Analysis
 * 
 * Captures and saves diagnostic data when Phase 10 refinement runs.
 * This data is used for LLM-powered root cause analysis.
 */

import * as fs from 'fs';
import * as path from 'path';
import { Phase10DiagnosticData } from './types';
import { RubricScore } from './llmScoringService';
import { Lesson } from './types';
import { RefinementPatch } from './phases/Phase10_Refinement';

const DIAGNOSTICS_BASE_DIR = path.join(process.cwd(), 'quiz-app', 'src', 'data', 'diagnostics');

/**
 * Calculate section-level impacts from score details
 */
function calculateSectionImpacts(
  originalScore: RubricScore,
  refinedScore: RubricScore,
  patchesApplied: RefinementPatch[]
): Phase10DiagnosticData['sectionImpacts'] {
  const impacts: Phase10DiagnosticData['sectionImpacts'] = [];
  
  // Match original and refined sections
  for (let i = 0; i < originalScore.details.length; i++) {
    const origDetail = originalScore.details[i];
    const refDetail = refinedScore.details[i];
    
    if (refDetail) {
      const delta = refDetail.score - origDetail.score;
      
      // Try to identify which patches might have affected this section
      // (basic heuristic: if patch path mentions block index, associate it)
      const affectedByPatches = patchesApplied
        .filter(patch => {
          // Simple heuristic: check if patch path is relevant
          return true; // For now, include all patches (can refine later)
        })
        .map(patch => patch.path);
      
      impacts.push({
        section: origDetail.section,
        originalScore: origDetail.score,
        refinedScore: refDetail.score,
        delta,
        affectedByPatches
      });
    }
  }
  
  return impacts;
}

/**
 * Save diagnostic data to appropriate directory (successes or failures)
 */
export async function saveDiagnosticData(
  lessonId: string,
  originalScore: RubricScore,
  refinedScore: RubricScore,
  patchesApplied: RefinementPatch[],
  wasAccepted: boolean,
  originalLesson?: Lesson,
  refinedLesson?: Lesson
): Promise<void> {
  try {
    const scoreDelta = refinedScore.total - originalScore.total;
    const reason: 'improved' | 'declined' | 'no-change' = 
      scoreDelta > 0 ? 'improved' : 
      scoreDelta < 0 ? 'declined' : 
      'no-change';
    
    const sectionImpacts = calculateSectionImpacts(originalScore, refinedScore, patchesApplied);
    
    const diagnosticData: Phase10DiagnosticData = {
      lessonId,
      timestamp: new Date().toISOString(),
      originalScore,
      refinedScore,
      scoreDelta,
      patchesApplied,
      sectionImpacts,
      wasAccepted,
      reason,
      originalLesson,
      refinedLesson
    };
    
    // Determine directory based on outcome
    const subdir = wasAccepted ? 'successes' : 'failures';
    const diagnosticDir = path.join(DIAGNOSTICS_BASE_DIR, subdir);
    
    // Ensure directory exists
    if (!fs.existsSync(diagnosticDir)) {
      fs.mkdirSync(diagnosticDir, { recursive: true });
    }
    
    // Save diagnostic data
    const filename = `${lessonId}-${Date.now()}.json`;
    const filepath = path.join(diagnosticDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(diagnosticData, null, 2), 'utf-8');
    
    console.log(`💾 [Diagnostics] Saved ${subdir} data: ${filename}`);
    console.log(`💾 [Diagnostics] Score: ${originalScore.total} → ${refinedScore.total} (${scoreDelta > 0 ? '+' : ''}${scoreDelta})`);
    
  } catch (error) {
    console.error('❌ [Diagnostics] Error saving diagnostic data:', error);
    // Don't throw - diagnostic saving should not break generation
  }
}

/**
 * Load all diagnostic data files from a directory
 */
export function loadDiagnosticData(subdir: 'successes' | 'failures'): Phase10DiagnosticData[] {
  const diagnosticDir = path.join(DIAGNOSTICS_BASE_DIR, subdir);
  
  if (!fs.existsSync(diagnosticDir)) {
    return [];
  }
  
  const files = fs.readdirSync(diagnosticDir)
    .filter(f => f.endsWith('.json') && !f.startsWith('.'));
  
  const data: Phase10DiagnosticData[] = [];
  
  for (const file of files) {
    try {
      const filepath = path.join(diagnosticDir, file);
      const content = fs.readFileSync(filepath, 'utf-8');
      const parsed = JSON.parse(content);
      data.push(parsed);
    } catch (error) {
      console.error(`Error loading diagnostic file ${file}:`, error);
    }
  }
  
  return data;
}

/**
 * Load all diagnostic data (successes and failures)
 */
export function loadAllDiagnosticData(): {
  successes: Phase10DiagnosticData[];
  failures: Phase10DiagnosticData[];
} {
  return {
    successes: loadDiagnosticData('successes'),
    failures: loadDiagnosticData('failures')
  };
}
