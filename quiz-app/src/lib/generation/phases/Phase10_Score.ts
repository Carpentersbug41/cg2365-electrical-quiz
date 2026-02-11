/**
 * Phase 10: Pedagogical Scoring
 * 
 * Scores lesson quality anchored to syllabus Learning Outcomes and Assessment Criteria.
 * Uses RAG to retrieve relevant syllabus context for accurate assessment.
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { Lesson } from '../types';
import { retrieveSyllabusContext, SyllabusContext } from '@/lib/syllabus/syllabusRAG';
import { preprocessToValidJson, safeJsonParse } from '../utils';
import { debugLogger } from '@/lib/generation/debugLogger';

export interface Phase10Score {
  total: number;  // 0-100
  grade: 'Ship it' | 'Strong' | 'Usable' | 'Needs rework';
  syllabus: {
    unit: string;
    unitTitle: string;
    learningOutcome: string;
    loTitle: string;
    assessmentCriteria: string[];
  };
  breakdown: {
    beginnerClarity: number;          // 30 points
    teachingBeforeTesting: number;    // 25 points
    markingRobustness: number;        // 20 points
    alignmentToLO: number;            // 15 points
    questionQuality: number;          // 10 points
  };
  issues: Phase10Issue[];  // 0-10 issues max
  overallAssessment?: string;  // 2-3 sentence summary
}

export interface Phase10Issue {
  id: string;
  category: 'beginnerClarity' | 'teachingBeforeTesting' | 'markingRobustness' | 'alignmentToLO' | 'questionQuality';
  jsonPointers: string[];
  excerpt: string;
  problem: string;
  whyItMatters: string;
  alignmentGap?: string;  // How it fails LO/AC
}

export class Phase10_Score extends PhasePromptBuilder {
  public lastPrompts: { system: string; user: string } = { system: '', user: '' };
  public lastRawResponse: string = '';
  public lastSyllabusContext: SyllabusContext | null = null;
  
  getPhaseName(): string {
    return 'Phase 10: Pedagogical Scoring';
  }
  
  /**
   * Score a lesson with syllabus anchoring
   */
  async scoreLesson(
    lesson: Lesson,
    generateFn: Function,
    additionalInstructions?: string
  ): Promise<Phase10Score> {
    const stopTimer = debugLogger.startTimer('Phase 10: Pedagogical Scoring');
    
    console.log(`\n📊 [Phase10_Score] Scoring lesson ${lesson.id}...`);
    debugLogger.phaseHeader('Phase 10: Pedagogical Scoring', lesson.id);
    
    // Verbose: Log input details
    debugLogger.logInput('Input', {
      'Lesson ID': lesson.id,
      'Title': lesson.title,
      'Blocks': lesson.blocks.length,
      'Unit': lesson.unit,
      'Topic': lesson.topic,
      'Additional Instructions': additionalInstructions || '(none)'
    });
    
    // Step 1: Retrieve syllabus context via RAG
    console.log(`📚 [Phase10_Score] Retrieving syllabus context...`);
    debugLogger.logStep('\n📚 Retrieving syllabus context via RAG...');
    
    const syllabusContext = await retrieveSyllabusContext(
      lesson.id,
      lesson.title,
      lesson.description
    );
    
    if (!syllabusContext) {
      console.warn(`⚠️ [Phase10_Score] No syllabus context found for lesson ${lesson.id}`);
      debugLogger.logWarning(`No syllabus context found for lesson ${lesson.id}`);
    } else {
      console.log(`  ✅ Found: Unit ${syllabusContext.unit} - ${syllabusContext.loTitle}`);
      this.lastSyllabusContext = syllabusContext;
      
      // Verbose: Log syllabus context details
      debugLogger.logOutput('Syllabus Context Retrieved', {
        'Unit': `${syllabusContext.unit} - ${syllabusContext.unitTitle}`,
        'Learning Outcome': `${syllabusContext.learningOutcome} - ${syllabusContext.loTitle}`,
        'Assessment Criteria': `${syllabusContext.assessmentCriteria.length} criteria`
      });
      
      if (debugLogger.isEnabled()) {
        console.log(`${syllabusContext.assessmentCriteria.map((ac, i) => `    ${i + 1}. ${ac}`).join('\n')}`);
      }
    }
    
    // Step 2: Build prompts with syllabus context
    debugLogger.logStep('\n🔨 Building prompts...');
    const input = { lesson, syllabusContext, additionalInstructions };
    const prompts = this.getPrompts(input);
    
    this.lastPrompts = { system: prompts.systemPrompt, user: prompts.userPrompt };
    
    // Verbose: Log prompts
    debugLogger.logPrompt('system', prompts.systemPrompt);
    debugLogger.logPrompt('user', prompts.userPrompt);
    
    // Step 3: Call LLM for scoring
    const { getPhase10Model } = await import('@/lib/config/geminiConfig');
    const phase10Model = getPhase10Model();
    
    console.log(`📊 [Phase10_Score] Calling LLM for pedagogical assessment...`);
    debugLogger.logLLMCall(phase10Model);

    if (process.env.DEBUG_PHASE10 === 'true') {
      console.log('\n\n>>> ENTERING PHASE 10: Pedagogical Scoring - LLM CALL <<<\n');
    }

    const llmStartTime = Date.now();
    try {
      const response = await generateFn(
        prompts.systemPrompt,
        prompts.userPrompt,
        'score',
        2,       // maxRetries
        false,   // attemptHigherLimit
        12000,   // tokenLimit - scoring needs more space for issues
        phase10Model
      );
      
      const llmDuration = Date.now() - llmStartTime;
      this.lastRawResponse = response;
      
      // Verbose: Log LLM response
      debugLogger.logLLMResponse(response, llmDuration);
      
      // Step 4: Parse response
      console.log(`📊 [Phase10_Score] Parsing score response (${response.length} chars)...`);
      debugLogger.logStep('\n🔍 Parsing score response...');
      
      const score = this.parseScoreResponse(response);
      
      console.log(`✅ [Phase10_Score] Score: ${score.total}/100 (${score.grade})`);
      console.log(`   - Beginner Clarity: ${score.breakdown.beginnerClarity}/30`);
      console.log(`   - Teaching-Before-Testing: ${score.breakdown.teachingBeforeTesting}/25`);
      console.log(`   - Marking Robustness: ${score.breakdown.markingRobustness}/20`);
      console.log(`   - Alignment to LO: ${score.breakdown.alignmentToLO}/15`);
      console.log(`   - Question Quality: ${score.breakdown.questionQuality}/10`);
      console.log(`   - Issues: ${score.issues.length}`);
      
      // Verbose: Log detailed score breakdown
      debugLogger.logOutput('Parsed Score', {
        'Total': `${score.total}/100`,
        'Grade': score.grade,
        'Breakdown': score.breakdown
      });
      
      if (score.overallAssessment) {
        debugLogger.logStep(`\n📝 Overall Assessment: ${score.overallAssessment}`);
      }
      
      // Verbose: Log all issues in detail
      debugLogger.logIssues(score.issues);
      
      stopTimer();
      return score;
      
    } catch (error) {
      console.error(`❌ [Phase10_Score] Error during scoring:`, error);
      debugLogger.logError(`Error during scoring: ${error}`);
      stopTimer();
      throw error;
    }
  }
  
  /**
   * Parse LLM score response
   */
  private parseScoreResponse(response: string): Phase10Score {
    try {
      // Clean response
      let cleaned = response.trim();
      
      // Remove markdown code blocks if present
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }
      
      // Preprocess and parse
      const preprocessed = preprocessToValidJson(cleaned);
      const parsed = safeJsonParse(preprocessed);
      
      if (!parsed.success || !parsed.data) {
        throw new Error(`Failed to parse score response: ${parsed.error || 'Unknown error'}`);
      }
      
      const data = parsed.data as any;
      
      // Validate required fields
      if (typeof data.total !== 'number') {
        throw new Error('Score response missing required field: total');
      }
      if (!data.breakdown || typeof data.breakdown !== 'object') {
        throw new Error('Score response missing required field: breakdown');
      }
      if (!data.grade || typeof data.grade !== 'string') {
        throw new Error('Score response missing required field: grade');
      }
      if (!Array.isArray(data.issues)) {
        throw new Error('Score response missing required field: issues array');
      }
      
      // Enforce max 10 issues requirement
      if (data.issues.length > 10) {
        throw new Error(`Phase 10 must return at most 10 issues, got ${data.issues.length}`);
      }
      
      // Return typed score
      return data as Phase10Score;
      
    } catch (error) {
      console.error(`❌ [Phase10_Score] Exception during parsing:`, error);
      throw error;
    }
  }
  
  /**
   * Build system prompt for pedagogical scoring
   */
  protected buildSystemPrompt(input: any): string {
    const { lesson, syllabusContext } = input;
    
    // Determine which ACs to check
    const targetACs = lesson.targetAssessmentCriteria 
      || (syllabusContext ? syllabusContext.assessmentCriteria : []);
    
    const acScopeNote = lesson.targetAssessmentCriteria 
      ? `\nNOTE: This lesson is scoped to cover only the following Assessment Criteria:\n${lesson.targetAssessmentCriteria.map((ac: string, i: number) => `  ${i + 1}. ${ac}`).join('\n')}\n\nDo NOT penalize the lesson for not covering other ACs from this Learning Outcome.`
      : '';
    
    const syllabusSection = syllabusContext ? `
SYLLABUS CONTEXT (retrieved from syllabus specification):
Unit: ${syllabusContext.unit} - ${syllabusContext.unitTitle}
Learning Outcome: ${syllabusContext.learningOutcome} - ${syllabusContext.loTitle}
Assessment Criteria (full LO):
${syllabusContext.assessmentCriteria.map((ac: string, i: number) => `  ${i + 1}. ${ac}`).join('\n')}
${acScopeNote}

This lesson must align with the TARGET Assessment Criteria listed ${lesson.targetAssessmentCriteria ? 'above' : '(all ACs from the LO)'}.
` : `
SYLLABUS CONTEXT: Not available (lesson ID could not be mapped to syllabus).
Score based on general pedagogical quality without specific LO alignment.
`;
    
    return `You are an expert pedagogical quality assessor for City & Guilds technical and vocational lessons.

GOAL: Score this lesson's PEDAGOGICAL QUALITY anchored to syllabus outcomes and criteria.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Do not assume any specific trade, science branch, equipment family, or regulation set.
- Evaluate pedagogy using patterns that transfer across technical subjects.

UNIVERSAL PEDAGOGICAL STANDARDS:
- Concrete before abstract.
- Observable before symbolic.
- Concept before unit.
- Definition + concrete anchor + micro-scenario.
- Recall -> reasoning -> integration.
- Simplified but technically defensible language.

${syllabusSection}

SCORING RUBRIC (100 points total):

A) Beginner Clarity (30 points):
   - Definitions of technical terms provided
   - Plain language explanations (avoid jargon or define it)
   - Includes concrete anchors after formal definitions (analogy, observable comparison, or everyday anchor)
   - Includes micro-scenarios where concepts involve measurement/quantity/units/comparison/ratio/intensity/scale/performance differences
   - Common misconceptions addressed
   - Simplified wording remains technically defensible (no misleading overclaims)
   - Readable, well-structured content

B) Teaching-Before-Testing (25 points):
   - Every question has its answer taught BEFORE the question appears
   - Explanations precede practice questions
   - No "cold" questions where content hasn't been taught yet
   - Clear progression from teaching to assessment
   - Includes at least one early reasoning check after recall before moving to the next major concept

C) Marking Robustness (20 points):
   - expectedAnswer arrays are gradeable by an LLM
   - Answer coverage matches question scope
   - For short-text: specific phrases/keywords
   - For long-text: key-point checklists (4-8 points to check)
   - answerType matches question complexity

D) Alignment to LO/AC (15 points):
   - Content addresses the TARGET Assessment Criteria for this lesson
   - If lesson.targetAssessmentCriteria is specified, check only those ACs
   - If not specified, check all ACs from the syllabus context
   - DO NOT penalize for missing ACs outside the lesson's target scope
   - Prefer explicit scope declarations in lesson metadata (syllabus anchors + covered/out-of-scope AC list)
   - If scope declarations are missing, raise a clear alignment issue
   - Examples and scenarios match vocational context
   - Terminology matches syllabus wording

E) Question Quality (10 points):
   - Clear, unambiguous wording
   - Appropriate cognitive level (Bloom's)
   - Smooth difficulty progression
   - Meaningful reasoning prompts, not recall restatements
   - No trick questions or gotchas

CRITICAL REQUIREMENTS:
- Return 0-10 issues (no more than 10). If fewer than 10 real issues exist, return fewer. Never invent filler issues to reach 10. Sort issues by severity/impact (most important first).
- Where syllabus context exists, each issue should reference a relevant AC when applicable. If the issue is cross-cutting (clarity/teaching-before-testing/marking robustness/question quality), set alignmentGap to 'GENERAL PEDAGOGY' rather than forcing an AC.
- Use AC labels in alignmentGap as AC1/AC2/AC3 indexed to the listed Assessment Criteria.
- Focus on CONTENT quality, not structure (validators handle that)
- For each issue: category, jsonPointers, excerpt, problem, whyItMatters, alignmentGap
- If lesson omits explicit syllabus anchors/scope or a structured misconceptions target block, treat that as a valid pedagogical issue when it affects alignment/clarity.

OUTPUT FORMAT (JSON only, no markdown):
{
  "total": 0-100,
  "grade": "Ship it|Strong|Usable|Needs rework",
  "syllabus": { 
    "unit": "...",
    "unitTitle": "...",
    "learningOutcome": "...",
    "loTitle": "...",
    "assessmentCriteria": ["..."]
  },
  "breakdown": {
    "beginnerClarity": 0-30,
    "teachingBeforeTesting": 0-25,
    "markingRobustness": 0-20,
    "alignmentToLO": 0-15,
    "questionQuality": 0-10
  },
  "issues": [ /* 0-10 */ ],
  "overallAssessment": "2-3 sentence summary of main pedagogical patterns"
}

VALIDATION RULES:
- issues array length MUST be <= 10
- total MUST equal sum of breakdown values
- Each issue MUST have: id, category, jsonPointers, excerpt, problem, whyItMatters
- overallAssessment MUST be 2-3 sentences maximum

${this.getJsonOutputInstructions()}`;
  }
  
  /**
   * Build user prompt with lesson to score
   */
  protected buildUserPrompt(input: any): string {
    const { lesson, additionalInstructions } = input;
    
    // Create clean JSON representation
    const lessonJson = JSON.stringify(lesson, null, 2);
    
    let prompt = '';
    
    // Add additional instructions if provided
    if (additionalInstructions && additionalInstructions.trim()) {
      prompt += `ADDITIONAL CONTEXT FROM USER:\n${additionalInstructions.trim()}\n\n`;
      prompt += `ASSISTANT ACKNOWLEDGMENT: I will consider this context when scoring and identifying issues.\n\n`;
    }
    
    prompt += `Score this lesson using the pedagogical rubric.

LESSON TO SCORE:
${lessonJson}

CRITICAL REMINDERS:
1. Return 0-10 issues (no more than 10). If the lesson is strong, return fewer issues.
2. Each issue must include: excerpt, problem, whyItMatters, alignmentGap
3. Ensure total score equals sum of breakdown scores
4. Focus on PEDAGOGICAL QUALITY - structure already validated
5. Reference specific Assessment Criteria in issues when applicable
6. Use AC labels like AC1/AC2 (mapped to listed criteria), not free-form AC numbering styles

Return ONLY the JSON scoring object. No markdown, no additional text.`;
    
    return prompt;
  }
}


