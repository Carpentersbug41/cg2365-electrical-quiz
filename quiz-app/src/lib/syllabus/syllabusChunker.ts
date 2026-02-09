/**
 * Syllabus Chunker
 * 
 * Parses the C&G 2365 Level 2 syllabus markdown into structured chunks
 * organized by Unit -> Learning Outcome -> Assessment Criteria
 */

import fs from 'fs';
import path from 'path';

export interface SyllabusChunk {
  id: string;                    // e.g., "202-LO5"
  unit: string;                  // e.g., "202"
  unitTitle: string;             // e.g., "Principles of Electrical Science"
  learningOutcome: string;       // e.g., "LO5"
  loTitle: string;               // e.g., "Magnetism and electricity relationship"
  assessmentCriteria: string[];  // Array of AC descriptions
  content: string;               // Full text of the LO section
  keywords: string[];            // Extracted keywords for BM25 search
}

/**
 * Parse the 2365 L2 syllabus markdown into chunks
 */
export async function chunkSyllabus(syllabusPath: string): Promise<SyllabusChunk[]> {
  const content = fs.readFileSync(syllabusPath, 'utf-8');
  const chunks: SyllabusChunk[] = [];
  
  console.log(`📖 Read ${content.length} characters from ${syllabusPath}`);
  
  const lines = content.split('\n').map(line => line.trim());
  console.log(`📄 Split into ${lines.length} lines`);
  
  let currentUnit: string | null = null;
  let currentUnitTitle: string | null = null;
  let currentLO: string | null = null;
  let currentLOTitle: string | null = null;
  let currentContent: string[] = [];
  let currentACs: string[] = [];
  let inACSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Match Unit headers: "# Unit 202 — Principles of Electrical Science"
    // Note: Uses em dash (—) \u2014 (char code 8212)
    const unitMatch = line.match(/^# Unit (\d+) \u2014 (.+)$/);
    if (unitMatch) {
      console.log(`  📦 Found Unit ${unitMatch[1]}: ${unitMatch[2]}`);
      // Save previous chunk if exists
      if (currentUnit && currentLO) {
        chunks.push(createChunk(
          currentUnit,
          currentUnitTitle || '',
          currentLO,
          currentLOTitle || '',
          currentACs,
          currentContent.join('\n')
        ));
      }
      
      currentUnit = unitMatch[1];
      currentUnitTitle = unitMatch[2].trim();
      currentLO = null;
      currentLOTitle = null;
      currentContent = [];
      currentACs = [];
      inACSection = false;
      continue;
    }
    
    // Match LO headers: "## LO1 — Understand how relevant legislation applies in the workplace"
    // Note: Uses em dash (—) \u2014 (char code 8212)
    const loMatch = line.match(/^## (LO\d+) \u2014 (.+)$/);
    if (loMatch) {
      console.log(`    📋 Found ${loMatch[1]}: ${loMatch[2]}`);
      // Save previous chunk if exists
      if (currentUnit && currentLO) {
        console.log(`      ✅ Saving chunk ${currentUnit}-${currentLO} with ${currentACs.length} ACs`);
        chunks.push(createChunk(
          currentUnit,
          currentUnitTitle || '',
          currentLO,
          currentLOTitle || '',
          currentACs,
          currentContent.join('\n')
        ));
      }
      
      currentLO = loMatch[1];
      currentLOTitle = loMatch[2].trim();
      currentContent = [line]; // Start new content with header
      currentACs = [];
      inACSection = false;
      continue;
    }
    
    // Detect Assessment Criteria section
    if (line.includes('**Assessment criteria**') || line.includes('**AC**')) {
      inACSection = true;
      if (currentLO) {
        currentContent.push(line);
      }
      continue;
    }
    
    // Detect Range section (end of AC section)
    if (line.includes('**Range')) {
      inACSection = false;
    }
    
    // Extract Assessment Criteria (numbered lists in AC section)
    if (currentLO && inACSection && line.match(/^\d+\./)) {
      const acText = line.replace(/^\d+\.\s*/, '').trim();
      if (acText) {
        currentACs.push(acText);
      }
    }
    
    // Accumulate content for current LO
    if (currentLO) {
      currentContent.push(line);
    }
  }
  
  // Save final chunk
  if (currentUnit && currentLO) {
    chunks.push(createChunk(
      currentUnit,
      currentUnitTitle || '',
      currentLO,
      currentLOTitle || '',
      currentACs,
      currentContent.join('\n')
    ));
  }
  
  console.log(`✅ Parsed ${chunks.length} syllabus chunks from ${syllabusPath}`);
  return chunks;
}

/**
 * Create a chunk with extracted keywords
 */
function createChunk(
  unit: string,
  unitTitle: string,
  lo: string,
  loTitle: string,
  acs: string[],
  content: string
): SyllabusChunk {
  const id = `${unit}-${lo}`;
  const keywords = extractKeywords(unitTitle, loTitle, acs, content);
  
  return {
    id,
    unit,
    unitTitle,
    learningOutcome: lo,
    loTitle,
    assessmentCriteria: acs,
    content,
    keywords,
  };
}

/**
 * Extract keywords for BM25 search
 */
function extractKeywords(
  unitTitle: string,
  loTitle: string,
  acs: string[],
  content: string
): string[] {
  const text = [unitTitle, loTitle, ...acs, content].join(' ');
  
  // Extract meaningful words (remove common stop words)
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'must', 'can', 'this',
    'that', 'these', 'those', 'it', 'its', 'they', 'them', 'their'
  ]);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ') // Remove punctuation except hyphens
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
  
  // Return unique keywords
  return [...new Set(words)];
}

/**
 * Generate chunks.json file (run once)
 */
export async function generateChunksFile(
  syllabusPath: string,
  outputPath: string
): Promise<void> {
  const chunks = await chunkSyllabus(syllabusPath);
  fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2), 'utf-8');
  console.log(`✅ Generated ${outputPath} with ${chunks.length} chunks`);
}
