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
  // Remove ```json and ``` markers
  return text
    .replace(/```json\s*/g, '')
    .replace(/```typescript\s*/g, '')
    .replace(/```ts\s*/g, '')
    .replace(/```\s*/g, '')
    .trim();
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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:166',message:'EXTRACT ARRAY - INPUT',data:{inputLength:text.length,inputStart:text.substring(0,300),inputEnd:text.substring(Math.max(0,text.length-300))},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
  // #endregion
  
  const cleaned = cleanCodeBlocks(text);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:173',message:'EXTRACT ARRAY - AFTER CLEAN',data:{cleanedLength:cleaned.length,removedChars:text.length-cleaned.length,cleanedStart:cleaned.substring(0,300),cleanedEnd:cleaned.substring(Math.max(0,cleaned.length-300))},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'B,D'})}).catch(()=>{});
  // #endregion
  
  // If text starts with [ and ends with ], it's likely already a complete array
  const trimmed = cleaned.trim();
  const startsWithBracket = trimmed.startsWith('[');
  const endsWithBracket = trimmed.endsWith(']');
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:183',message:'EXTRACT ARRAY - BRACKET CHECK',data:{startsWithBracket:startsWithBracket,endsWithBracket:endsWithBracket,firstChar:trimmed[0],lastChar:trimmed[trimmed.length-1],trimmedLength:trimmed.length,first100:trimmed.substring(0,100),last100:trimmed.substring(Math.max(0,trimmed.length-100))},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D,E'})}).catch(()=>{});
  // #endregion
  
  if (startsWithBracket && endsWithBracket) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:190',message:'EXTRACT ARRAY - ALREADY BRACKETED (RETURNING AS-IS)',data:{length:trimmed.length},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return trimmed;
  }
  
  // Otherwise try to find array with regex (shouldn't happen if LLM follows instructions)
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:197',message:'EXTRACT ARRAY - USING REGEX FALLBACK',data:{reason:'not properly bracketed'},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D,E'})}).catch(()=>{});
  // #endregion
  const arrayMatch = cleaned.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:203',message:'EXTRACT ARRAY - REGEX MATCHED',data:{matchedLength:arrayMatch[0].length,matchStart:arrayMatch[0].substring(0,100),matchEnd:arrayMatch[0].substring(Math.max(0,arrayMatch[0].length-100))},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    return arrayMatch[0];
  }
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/95d04586-4afa-43d8-871a-85454b44a405',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'utils.ts:209',message:'EXTRACT ARRAY - NO MATCH (RETURNING CLEANED)',data:{cleanedSample:cleaned.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'initial',hypothesisId:'D,E'})}).catch(()=>{});
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
