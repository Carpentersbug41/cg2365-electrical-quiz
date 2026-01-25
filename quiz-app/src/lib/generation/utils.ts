/**
 * Helper utilities for lesson generation
 */

import { SECTIONS } from './constants';

/**
 * Infer layout based on section and topic
 */
export function inferLayout(section: string, topic: string): 'split-vis' | 'linear-flow' {
  // Linear-flow indicators
  const linearIndicators = [
    'Health & Safety',
    'Theory',
    'Regulations',
    'Procedures',
    'Calculations',
    'Formulas',
    'Definitions',
    'Units',
    'Measurements',
    'PPE',
    'Risk Assessment',
  ];

  // Split-vis indicators
  const splitVisIndicators = [
    'Circuit',
    'Series',
    'Parallel',
    'Diagram',
    'Layout',
    'Topology',
    'Wiring',
  ];

  const sectionLower = section.toLowerCase();
  const topicLower = topic.toLowerCase();

  // Check for split-vis indicators
  if (
    sectionLower.includes('science') ||
    splitVisIndicators.some(indicator => topicLower.includes(indicator.toLowerCase()))
  ) {
    return 'split-vis';
  }

  // Check for linear-flow indicators
  if (
    linearIndicators.some(
      indicator =>
        sectionLower.includes(indicator.toLowerCase()) ||
        topicLower.includes(indicator.toLowerCase())
    )
  ) {
    return 'linear-flow';
  }

  // Default to linear-flow for safety/theory content
  return 'linear-flow';
}

/**
 * Generate filename slug from topic
 */
export function generateSlug(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate full lesson ID
 */
export function generateLessonId(unit: number, lessonId: string): string {
  return `${unit}-${lessonId}`;
}

/**
 * Generate lesson filename
 */
export function generateLessonFilename(unit: number, lessonId: string, topic: string): string {
  const fullId = generateLessonId(unit, lessonId);
  const slug = generateSlug(topic);
  return `${fullId}-${slug}.json`;
}

/**
 * Generate quiz filename
 */
export function generateQuizFilename(topic: string): string {
  const slug = generateSlug(topic);
  const camelCase = slug
    .split('-')
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
  return `${camelCase}Questions.ts`;
}

/**
 * Get current timestamp in ISO format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get git timestamp for branch names
 */
export function getGitTimestamp(): string {
  return Date.now().toString();
}

/**
 * Generate variable name from lesson ID
 */
export function generateVariableName(unit: number, lessonId: string): string {
  return `lesson${unit}_${lessonId.replace('-', '_')}`;
}

/**
 * Parse JSON safely with error handling
 */
export function safeJsonParse<T>(json: string): { success: boolean; data?: T; error?: string } {
  try {
    const data = JSON.parse(json) as T;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}

/**
 * Clean markdown code blocks from LLM response
 */
export function cleanCodeBlocks(text: string): string {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:137',message:'cleanCodeBlocks called',data:{inputLength:text.length,hasJsonMarker:text.includes('```json'),hasTsMarker:text.includes('```typescript')||text.includes('```ts'),hasGenericMarker:text.includes('```')},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  // Remove ```json and ``` markers
  const result = text
    .replace(/```json\s*/g, '')
    .replace(/```typescript\s*/g, '')
    .replace(/```ts\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:147',message:'cleanCodeBlocks result',data:{outputLength:result.length,removedChars:text.length-result.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  return result;
}

/**
 * Extract JSON from mixed content
 */
export function extractJson(text: string): string {
  const cleaned = cleanCodeBlocks(text);
  
  // Try to find JSON object
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  
  return cleaned;
}

/**
 * Extract TypeScript array from mixed content
 */
export function extractTypeScriptArray(text: string): string {
  const cleaned = cleanCodeBlocks(text);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:166',message:'extractTypeScriptArray after cleanCodeBlocks',data:{cleanedLength:cleaned.length,startsWithBracket:cleaned[0]==='[',cleanedStart:cleaned.substring(0,100),cleanedEnd:cleaned.substring(cleaned.length-200)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  // If text starts with [ and ends with ], it's likely already a complete array
  const trimmed = cleaned.trim();
  const endsWithBracket = trimmed.endsWith(']');
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:173',message:'Checking bracket conditions',data:{startsWithBracket:trimmed.startsWith('['),endsWithBracket:endsWithBracket,lastChar:trimmed[trimmed.length-1],last50:trimmed.substring(trimmed.length-50)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D,E'})}).catch(()=>{});
  // #endregion
  if (trimmed.startsWith('[') && endsWithBracket) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:179',message:'Text is already bracketed array',data:{length:trimmed.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return trimmed;
  }
  
  // Otherwise try to find array with regex (shouldn't happen if LLM follows instructions)
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:186',message:'Array regex matched',data:{matchedLength:arrayMatch[0].length,matchStart:arrayMatch[0].substring(0,100)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return arrayMatch[0];
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:193',message:'No array match, returning cleaned text',data:{cleanedSample:cleaned.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D,E'})}).catch(()=>{});
  // #endregion
  
  return cleaned;
}

/**
 * Validate section name
 */
export function isValidSection(section: string): boolean {
  return SECTIONS.some(s => s === section);
}

/**
 * Get unit number from lesson ID
 */
export function getUnitFromLessonId(lessonId: string): string {
  return lessonId.split('-')[0];
}

/**
 * Sleep utility for retry delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Calculate next question ID
 */
export function getNextQuestionId(existingIds: number[]): number {
  if (existingIds.length === 0) return 3000;
  return Math.max(...existingIds) + 1;
}
