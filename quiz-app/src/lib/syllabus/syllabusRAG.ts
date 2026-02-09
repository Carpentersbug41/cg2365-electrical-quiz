/**
 * Syllabus RAG (Retrieval Augmented Generation)
 * 
 * BM25-based search to retrieve relevant Learning Outcomes and Assessment Criteria
 * from the C&G 2365 syllabus for a given lesson.
 */

import chunksData from './chunks.json';
import { SyllabusChunk } from './syllabusChunker';

const chunks = chunksData as SyllabusChunk[];

// Simple debug flag check (separate from main debugLogger to avoid circular deps)
const DEBUG_RAG = process.env.DEBUG_PHASE10 === 'true';

export interface SyllabusContext {
  unit: string;
  unitTitle: string;
  learningOutcome: string;
  loTitle: string;
  assessmentCriteria: string[];
  content: string;
}

/**
 * Retrieve syllabus context for a lesson
 * 
 * Strategy:
 * 1. Extract unit from lesson ID (e.g., "202-5A" → unit "202")
 * 2. Try to extract LO number from lesson ID (e.g., "5A" → "LO5")
 * 3. If exact match found, return it
 * 4. Otherwise, use BM25 search on lesson title/description
 */
export async function retrieveSyllabusContext(
  lessonId: string,
  lessonTitle: string,
  lessonDescription?: string
): Promise<SyllabusContext | null> {
  if (DEBUG_RAG) {
    console.log('\n📚 Syllabus RAG Retrieval');
    console.log('\n📝 Input:');
    console.log(`  - Lesson ID: ${lessonId}`);
    console.log(`  - Title: ${lessonTitle}`);
    console.log(`  - Description: ${lessonDescription ? lessonDescription.substring(0, 60) + '...' : '(none)'}`);
  }
  
  // Step 1: Parse lesson ID for unit and LO
  const parsed = parseLessonId(lessonId);
  
  if (!parsed) {
    console.warn(`[SyllabusRAG] Could not parse lesson ID: ${lessonId}`);
    if (DEBUG_RAG) {
      console.log('\n❌ Failed to parse lesson ID');
    }
    return null;
  }
  
  if (DEBUG_RAG) {
    console.log('\n🔍 Parsing ID:');
    console.log(`  - Unit: ${parsed.unit}`);
    console.log(`  - LO: ${parsed.lo || '(not extracted)'}`);
  }
  
  // Step 2: Try exact match on unit + LO
  if (parsed.lo) {
    if (DEBUG_RAG) {
      console.log(`\n🎯 Exact Match Attempt:`);
      console.log(`  - Looking for: ${parsed.unit}-${parsed.lo}`);
    }
    
    const exactMatch = chunks.find(
      chunk => chunk.unit === parsed.unit && chunk.learningOutcome === parsed.lo
    );
    
    if (exactMatch) {
      console.log(`[SyllabusRAG] Exact match: ${exactMatch.id}`);
      
      if (DEBUG_RAG) {
        console.log(`  - ✅ Found: ${exactMatch.id}`);
        console.log(`\n📊 Match Details:`);
        console.log(`  - Unit: ${exactMatch.unit} - ${exactMatch.unitTitle}`);
        console.log(`  - LO: ${exactMatch.learningOutcome} - ${exactMatch.loTitle}`);
        console.log(`  - Assessment Criteria (${exactMatch.assessmentCriteria.length}):`);
        exactMatch.assessmentCriteria.forEach((ac, i) => {
          console.log(`    ${i + 1}. ${ac}`);
        });
      }
      
      return chunkToContext(exactMatch);
    }
    
    if (DEBUG_RAG) {
      console.log(`  - ❌ No exact match found`);
    }
  }
  
  // Step 3: Fallback to BM25 search
  if (DEBUG_RAG) {
    console.log(`\n🔎 BM25 Search (fallback):`);
  }
  
  const query = [lessonTitle, lessonDescription].filter(Boolean).join(' ');
  const unitChunks = chunks.filter(chunk => chunk.unit === parsed.unit);
  
  if (unitChunks.length === 0) {
    console.warn(`[SyllabusRAG] No chunks found for unit ${parsed.unit}`);
    if (DEBUG_RAG) {
      console.log(`  - ❌ No chunks found for unit ${parsed.unit}`);
    }
    return null;
  }
  
  if (DEBUG_RAG) {
    console.log(`  - Query: "${query.substring(0, 80)}${query.length > 80 ? '...' : ''}"`);
    console.log(`  - Searching ${unitChunks.length} chunks in unit ${parsed.unit}`);
  }
  
  const scored = unitChunks.map(chunk => ({
    chunk,
    score: bm25Score(query, chunk.keywords)
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  if (DEBUG_RAG) {
    console.log(`\n  Top 3 matches:`);
    scored.slice(0, 3).forEach((item, i) => {
      console.log(`    ${i + 1}. ${item.chunk.id} - ${item.chunk.loTitle} (score: ${item.score.toFixed(2)})`);
    });
  }
  
  const best = scored[0];
  console.log(`[SyllabusRAG] BM25 match: ${best.chunk.id} (score: ${best.score.toFixed(2)})`);
  
  if (DEBUG_RAG) {
    console.log(`\n  Selected: ${best.chunk.id}`);
    console.log(`\n📊 Match Details:`);
    console.log(`  - Unit: ${best.chunk.unit} - ${best.chunk.unitTitle}`);
    console.log(`  - LO: ${best.chunk.learningOutcome} - ${best.chunk.loTitle}`);
    console.log(`  - Assessment Criteria (${best.chunk.assessmentCriteria.length}):`);
    best.chunk.assessmentCriteria.forEach((ac, i) => {
      console.log(`    ${i + 1}. ${ac}`);
    });
  }
  
  return chunkToContext(best.chunk);
}

/**
 * Parse lesson ID to extract unit and LO
 * 
 * Examples:
 * - "202-5A-magnetism-basics" → { unit: "202", lo: "LO5" }
 * - "203-3B-wiring-systems" → { unit: "203", lo: "LO3" }
 * - "201-1A" → { unit: "201", lo: "LO1" }
 */
function parseLessonId(lessonId: string): { unit: string; lo: string | null } | null {
  const parts = lessonId.split('-');
  
  if (parts.length < 2) {
    return null;
  }
  
  const unit = parts[0];
  const topic = parts[1];
  
  // Extract LO number from topic (e.g., "5A" → "LO5", "3B" → "LO3")
  const loMatch = topic.match(/^(\d+)[A-Z]?/);
  const lo = loMatch ? `LO${loMatch[1]}` : null;
  
  return { unit, lo };
}

/**
 * BM25 scoring algorithm
 * 
 * Simplified implementation:
 * - No document frequency (all chunks treated equally)
 * - Just term frequency with length normalization
 */
function bm25Score(query: string, keywords: string[]): number {
  const queryTerms = query
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2);
  
  if (queryTerms.length === 0) {
    return 0;
  }
  
  // Term frequency in document (keywords)
  const termFreq = new Map<string, number>();
  for (const kw of keywords) {
    termFreq.set(kw, (termFreq.get(kw) || 0) + 1);
  }
  
  // BM25 parameters
  const k1 = 1.5;
  const b = 0.75;
  const avgDocLength = 50; // Approximate average keyword count
  const docLength = keywords.length;
  
  let score = 0;
  
  for (const term of queryTerms) {
    const tf = termFreq.get(term) || 0;
    
    if (tf > 0) {
      // BM25 formula (simplified, without IDF)
      const numerator = tf * (k1 + 1);
      const denominator = tf + k1 * (1 - b + b * (docLength / avgDocLength));
      score += numerator / denominator;
    }
  }
  
  return score;
}

/**
 * Convert chunk to context object
 */
function chunkToContext(chunk: SyllabusChunk): SyllabusContext {
  return {
    unit: chunk.unit,
    unitTitle: chunk.unitTitle,
    learningOutcome: chunk.learningOutcome,
    loTitle: chunk.loTitle,
    assessmentCriteria: chunk.assessmentCriteria,
    content: chunk.content,
  };
}

/**
 * Get all units available in the syllabus
 */
export function getAvailableUnits(): string[] {
  const units = [...new Set(chunks.map(c => c.unit))];
  return units.sort();
}

/**
 * Get all LOs for a specific unit
 */
export function getUnitLearningOutcomes(unit: string): SyllabusChunk[] {
  return chunks.filter(c => c.unit === unit);
}
