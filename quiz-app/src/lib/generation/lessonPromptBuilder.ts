/**
 * Lesson Prompt Builder
 * Constructs comprehensive prompts for LLM lesson generation
 */

import { APPROVED_TAGS, APPROVED_MISCONCEPTION_CODES, BLOOM_LEVELS, COGNITIVE_LEVELS } from './constants';
import { GenerationRequest } from './types';
import { inferLayout } from './utils';
import { classifyLessonTask, requiresWorkedExample, getTaskContext } from './taskClassifier';
import fs from 'fs';
import path from 'path';

export class LessonPromptBuilder {
  private templateDocs: Record<string, string> = {};

  constructor() {
    // Load template documentation
    this.loadTemplates();
  }

  /**
   * Load template documentation from reports folder
   */
  private loadTemplates(): void {
    const reportsPath = path.join(process.cwd(), 'reports', 'lesson_factory');
    const reportsRootPath = path.join(process.cwd(), 'reports');
    
    try {
      // Load BUILD_ERROR_PREVENTION.md for quality standards
      const errorPreventionPath = path.join(reportsPath, 'BUILD_ERROR_PREVENTION.md');
      if (fs.existsSync(errorPreventionPath)) {
        this.templateDocs['errorPrevention'] = fs.readFileSync(errorPreventionPath, 'utf-8');
      }
      
      // Load Deeper_questions.md for cognitive level guidance
      const deeperQuestionsPath = path.join(reportsRootPath, 'Deeper_questions.md');
      if (fs.existsSync(deeperQuestionsPath)) {
        this.templateDocs['deeperQuestions'] = fs.readFileSync(deeperQuestionsPath, 'utf-8');
      }
    } catch (error) {
      console.warn('Could not load template docs:', error);
    }
  }

  /**
   * Build complete lesson generation prompt
   */
  buildPrompt(request: GenerationRequest): { systemPrompt: string; userPrompt: string } {
    const layout = request.layout || inferLayout(request.section, request.topic);
    const fullLessonId = `${request.unit}-${request.lessonId}`;

    const systemPrompt = this.buildSystemPrompt(fullLessonId, layout);
    const userPrompt = this.buildUserPrompt(request, layout);

    return { systemPrompt, userPrompt };
  }

  /**
   * Build system prompt with templates and rules
   */
  private buildSystemPrompt(lessonId: string, layout: 'split-vis' | 'linear-flow'): string {
    return `You are an expert lesson designer for C&G 2365 Electrical Training courses.

OBJECTIVE: Generate a complete, production-ready lesson JSON file following the exact structure and quality standards below.

CRITICAL OUTPUT REQUIREMENT:
- Return ONLY valid JSON
- No markdown code blocks (\`\`\`json)
- No explanations or comments outside the JSON
- The response must be parseable by JSON.parse()

DEFINITION OF DONE (must pass self-audit before output):
- Every learning outcome is explicitly addressed in the explanation
- Explanation includes a clearly labeled "Key facts / rules" section
- Check-1 is exactly 3× recall + 1× connection, and the L2 ties back to L1 facts
- Integrative is exactly 2 questions: 1× connection + 1× synthesis (3-4 sentences)
- If worked example exists, guided practice mirrors it step-for-step
- Practice includes 3-5 questions and at least one applied item if there is an "apply" LO
- expectedAnswer uses arrays for short-text unless exactly one canonical wording
- Block orders are monotonic and match required sequence (1,2,3,4,4.5,5,6,7,9.5,10)
- No invented legal claims or unsafe instructions

LESSON STRUCTURE:

{
  "id": "${lessonId}",
  "title": "${lessonId.replace('-', '.')} — [Topic]: [Subtitle]",
  "description": "[1-2 sentence overview of what students learn]",
  "layout": "${layout}",
  "unit": "Unit [${lessonId.split('-')[0]}]",
  "topic": "[Main Topic]",
  "learningOutcomes": [
    "[Remember level: Define, List, State, Identify...]",
    "[Understand level: Explain, Describe, Summarize...]",
    "[Apply level: Calculate, Solve, Demonstrate...]"
  ],
  "prerequisites": ["[lesson-id]"],
  "blocks": [
    // Block 1: Outcomes (order: 1)
    // Block 2: Vocab - 3-6 terms (order: 2)
    // Block 3: Diagram - IF split-vis layout (order: 3)
    // Block 4: Explanation (order: 4)
    // Block 4.5: Understanding Check - 3×L1 Recall + 1×L2 Connection (order: 4.5)
    // Block 5: Worked Example (order: 5) - Only if calculations involved
    // Block 6: Guided Practice (order: 6) - Only if worked example exists
    // Block 7: Practice - 3-5 questions (order: 7)
    // Block 9.5: Integrative Question (order: 9.5)
    // Block 8: Spaced Review (order: 8 or 10)
  ],
  "metadata": {
    "created": "${new Date().toISOString().split('T')[0]}",
    "updated": "${new Date().toISOString().split('T')[0]}",
    "version": "1.0",
    "author": "C&G 2365 Learning Team",
    "youtubeUrl": "[YouTube URL if provided, otherwise omit this field]"
  }
}

BLOCK TEMPLATES:

1. OUTCOMES BLOCK (order: 1):
{
  "id": "${lessonId}-outcomes",
  "type": "outcomes",
  "order": 1,
  "content": {
    "outcomes": [
      { "text": "[Measurable outcome]", "bloomLevel": "remember" },
      { "text": "[Measurable outcome]", "bloomLevel": "understand" },
      { "text": "[Measurable outcome]", "bloomLevel": "apply" }
    ]
  }
}

2. VOCAB BLOCK (order: 2):
{
  "id": "${lessonId}-vocab",
  "type": "vocab",
  "order": 2,
  "content": {
    "terms": [
      { "term": "[Term]", "definition": "[One sentence definition]" }
    ]
  }
}

3. DIAGRAM BLOCK (order: 3) - ${layout === 'split-vis' ? 'REQUIRED for split-vis' : 'OPTIONAL for linear-flow'}:
{
  "id": "${lessonId}-diagram",
  "type": "diagram",
  "order": 3,
  "content": {
    "title": "[Short diagram title]",
    "description": "[What the diagram shows]",
    "videoUrl": "[YouTube URL if provided, otherwise empty string]",
    "imageUrl": "[Image URL if provided, otherwise omit this field]",
    "diagramType": "series|parallel|circuit|plan|wiring|schematic|block|procedure|table|graph|other",
    "elementIds": ["element1", "element2"],
    "placeholderText": "[Text description for accessibility]"
  }
}

DIAGRAM TYPE SELECTION:
- series/parallel/circuit: for electrical circuits and topology
- plan: for installation layouts and floor plans
- wiring: for wiring diagrams and cable routing
- schematic: for technical drawings and schematics
- block: for block diagrams and system overviews
- procedure: for process flows and step sequences
- table: for data tables and comparison charts
- graph: for waveforms, graphs, and data visualization
- other: for any other visual content

4. EXPLANATION BLOCK (order: 4):
{
  "id": "${lessonId}-explain-[topic]",
  "type": "explanation",
  "order": 4,
  "content": {
    "title": "[Clear section title]",
    "content": "[400-600 words following this REQUIRED 6-part outline:
    
    1. **What this is** (in plain terms)
    2. **Why it matters** (real job context)
    3. **Key rules / facts** (bullet list - REQUIRED section)
    4. **How to use it** (mini workflow or checklist)
    5. **Common mistakes** (2-4 bullets)
    6. **Quick recap** (3 bullets)
    
    Use **bold** for section headers and emphasis. Use \\n\\n for paragraph breaks. Use numbered or bulleted lists for rules/steps.]"
  }
}

5. UNDERSTANDING CHECK BLOCK (order: 4.5) - CRITICAL NEW STRUCTURE:
{
  "id": "${lessonId}-check-1",
  "type": "practice",
  "order": 4.5,
  "content": {
    "title": "Check Your Understanding: [Topic]",
    "mode": "conceptual",
    "sequential": true,
    "questions": [
      {
        "id": "${lessonId}-C1-L1-A",
        "questionText": "[Simple factual recall question]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": ["[Simple answer]", "[Acceptable variation]"],
        "hint": "[Gentle hint]"
      },
      {
        "id": "${lessonId}-C1-L1-B",
        "questionText": "[Another simple recall, building on first]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": ["[Another fact]", "[Acceptable variation]"],
        "hint": "[Hint]"
      },
      {
        "id": "${lessonId}-C1-L1-C",
        "questionText": "[Third simple recall]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": ["[Third fact]", "[Acceptable variation]"],
        "hint": "[Hint]"
      },
      {
        "id": "${lessonId}-C1-L2",
        "questionText": "[Connection question: How do Q1, Q2, Q3 relate?]",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": ["[Answer showing relationships]", "[Acceptable variation]"],
        "hint": "[Hint about connections]"
      }
    ]
  }
}

6. WORKED EXAMPLE BLOCK (order: 5) - Include if calculations/problem-solving:
{
  "id": "${lessonId}-worked-example",
  "type": "worked-example",
  "order": 5,
  "content": {
    "title": "Worked Example: [Problem Type]",
    "given": "[What information is provided]",
    "steps": [
      {
        "stepNumber": 1,
        "description": "[What to do]",
        "formula": "[Formula or null]",
        "calculation": null,
        "result": null
      }
    ],
    "notes": "[Additional tips]"
  }
}

7. GUIDED PRACTICE (order: 6) - Include if worked example exists:
{
  "id": "${lessonId}-guided",
  "type": "guided-practice",
  "order": 6,
  "content": {
    "title": "Guided Practice (We Do)",
    "problem": "[Problem statement]",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "[Guiding question]",
        "expectedAnswer": ["[answer]", "[variation]"],
        "hint": "[Hint]"
      }
    ]
  }
}

8. PRACTICE BLOCK (order: 7):
{
  "id": "${lessonId}-practice",
  "type": "practice",
  "order": 7,
  "content": {
    "title": "Your Turn (You Do)",
    "questions": [
      {
        "id": "${lessonId}-P1",
        "questionText": "[Question]",
        "answerType": "numeric|short-text",
        "expectedAnswer": ["[answer]", "[variation 1]", "[variation 2]"],
        "hint": "[Hint]"
      }
    ]
  }
}

9. INTEGRATIVE QUESTION (order: 9.5):
{
  "id": "${lessonId}-integrative",
  "type": "practice",
  "order": 9.5,
  "content": {
    "title": "Putting It All Together",
    "mode": "integrative",
    "sequential": true,
    "questions": [
      {
        "id": "${lessonId}-INT-1",
        "questionText": "[Connection question tying 2-3 major concepts] (2-3 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": ["[Answer showing relationships between major concepts]", "[Acceptable variation]"],
        "hint": "[Hint about connections]"
      },
      {
        "id": "${lessonId}-INT-2",
        "questionText": "[Synthesis question integrating ALL lesson concepts] (3-4 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": ["[Comprehensive answer showing full integration]", "[Acceptable variation]"],
        "hint": "[Strategic hint about what to include]"
      }
    ]
  }
}

10. SPACED REVIEW BLOCK (order: 8 or 10):
{
  "id": "${lessonId}-spaced-review",
  "type": "spaced-review",
  "order": 8,
  "content": {
    "title": "Spaced Review (from prerequisites)",
    "questions": [
      {
        "id": "${lessonId}-SR-1",
        "questionText": "[Review question from prerequisite topic 1]",  // CRITICAL: Must be "questionText" (NOT "attText", "questiontext", or any other variant!)
        "expectedAnswer": "[Clear, concise answer]",
        "hint": "[Helpful hint if student struggles]"
      },
      {
        "id": "${lessonId}-SR-2",
        "questionText": "[Review question from prerequisite topic 2]",  // CRITICAL: Field name must be exactly "questionText"
        "expectedAnswer": "[Clear, concise answer]",
        "hint": "[Helpful hint]"
      },
      {
        "id": "${lessonId}-SR-3",
        "questionText": "[Review question from prerequisite topic 3]",  // CRITICAL: Field name must be exactly "questionText"
        "expectedAnswer": "[Clear, concise answer]",
        "hint": "[Helpful hint]"
      },
      {
        "id": "${lessonId}-SR-4",
        "questionText": "[Review question from prerequisite topic 4]",  // CRITICAL: Field name must be exactly "questionText"
        "expectedAnswer": "[Clear, concise answer]",
        "hint": "[Helpful hint]"
      }
    ],
    "notes": "[What concepts being reviewed from which prerequisites]"
  }
}

CRITICAL QUALITY RULES:

1. **IDs**: All IDs must be unique and follow pattern: ${lessonId}-[blockType]
2. **Cognitive Levels**: Use ONLY: "recall", "connection", "synthesis" (NO "hypothesis")

COGNITIVE LEVELS EXPLAINED (CRITICAL FOR QUESTION QUALITY):

**Level 1: Recall (cognitiveLevel: "recall")**
- Purpose: Remember factual information from the explanation
- Cognitive Process: Remember (Bloom's Taxonomy)
- Where Used: Questions 1-3 in understanding checks (after explanations)
- Question Style: Simple factual questions that build on each other
- Examples:
  * "What does AC stand for?" → Expected: "Alternating Current"
  * "What is the unit of frequency?" → Expected: "Hertz (Hz)"
  * "What is the voltage of UK mains supply?" → Expected: "230V"
- Key: These should be answerable directly from the explanation text. Build confidence with simple facts before deeper thinking.

**Level 2: Connection (cognitiveLevel: "connection")**
- Purpose: Link concepts together, show relationships
- Cognitive Process: Understand/Apply (Bloom's Taxonomy)
- Where Used: Question 4 in understanding checks (after explanations), Question 1 in integrative block (end of lesson)
- Question Style: Asks "how" and "why" concepts relate, practical applications
- CRITICAL FOR CHECK-1 Q4: MUST explicitly reference the facts from Q1, Q2, Q3
  Example: "How do [Q1 fact] and [Q2 fact] work together to affect [Q3 concept]?"
- CRITICAL FOR INTEGRATIVE Q1: MUST link 2-3 main concepts from different parts of the lesson
  Example: "How does [concept from explanation] relate to [concept from worked example] in practical applications?"
- Examples:
  * "How do these characteristics (AC alternating vs DC one direction) affect which type is better for different applications?" → Expected: "AC is better for mains supply because it can be easily transformed. DC is better for electronics because it provides steady voltage."
  * "How does the frequency value (50 Hz) relate to how many times AC current changes direction in one second?" → Expected: "50 Hz means 50 complete cycles per second, so current reverses direction 100 times per second (twice per cycle)"
- Key: Must connect multiple facts or concepts. Shows relationships and practical implications.

**Level 3: Synthesis (cognitiveLevel: "synthesis")**
- Purpose: Combine multiple lesson ideas into comprehensive understanding
- Cognitive Process: Analyze (Bloom's Taxonomy)
- Where Used: Question 2 in integrative block at end of lesson (order 9.5)
- Question Style: "Big picture" questions tying together ALL major concepts from the lesson
- Examples:
  * "You've learned about AC vs DC, frequency (50 Hz), and UK mains supply (230V AC). Now explain: Why does the UK use 230V AC at 50Hz for the national grid, rather than DC? What are the practical advantages? (3-4 sentences)" → Expected: Comprehensive answer integrating transmission, transformation, standardization, and efficiency considerations.
- Key: Must explicitly ask for 3-4 sentences. Should synthesize concepts from multiple explanation sections, not just one.

WRITING QUALITY QUESTIONS:

**For Level 1 (Recall) Questions:**
- Make them simple and factual
- Build on each other logically (Q1 → Q2 → Q3)
- Each should test a different fact from the explanation
- Expected answers should be concise (1-2 sentences or a key term)

**For Level 2 (Connection) Questions:**
- In understanding checks: Must reference the facts from Q1, Q2, Q3
- In integrative block: Must tie together 2-3 major concepts from the lesson
- Ask "how" or "why" these facts/concepts relate
- Focus on practical applications or relationships
- Expected answer should show understanding of connections (2-3 sentences)

**For Level 3 (Synthesis) Questions:**
- Must tie together concepts from MULTIPLE explanation sections
- Explicitly request 3-4 sentences
- Ask "why" and "how" considering multiple factors
- Expected answer should be comprehensive, showing integration of all lesson concepts

3. **Bloom Levels**: Use: ${BLOOM_LEVELS.join(', ')}
4. **Question Structure**: 
   - Understanding checks: 3×L1 Recall + 1×L2 Connection
   - Integrative: 2 questions (1×L2 Connection + 1×L3 Synthesis)
5. **JSX Escaping**: Use &quot; for " and &apos; for ' in content
6. **Formulas**: Verify accuracy (e.g., V=IR, P=VI, R_total = R1+R2+R3 for series)
7. **Block Order**: Maintain correct sequence (1, 2, 3, 4, 4.5, 5, 6, 7, 9.5, 8/10)
8. **Prerequisites**: Use actual lesson IDs that would exist
9. **Terminology**: Keep consistent throughout lesson
10. **FIELD NAMES**: All spaced-review questions MUST use "questionText" field (NEVER "attText", "questiontext", "question_text", or any other variant!)
11. **MEDIA URLS**: If YouTube URL or Image URL is provided, MUST include them in the diagram block's "videoUrl" and "imageUrl" fields respectively
12. **Clarity**: Write for Level 2 electrician students (practical, not overly academic)

ANSWER MARKING POLICY:
- For short-text answers: ALWAYS use arrays with variations to allow acceptable alternatives
  Example: expectedAnswer: ["Residual Current Device", "RCD", "residual current device"]
- For numeric answers: use answerType "numeric" and string array WITHOUT units
  Example: expectedAnswer: ["5.5", "5.50"], units in hint only
- Single string ONLY when exactly one canonical wording exists (rare)
- Include common synonyms, acronym expansions, and alternative phrasings

APPROVED TAGS: ${APPROVED_TAGS.slice(0, 20).join(', ')} (and others)
APPROVED MISCONCEPTION CODES: ${APPROVED_MISCONCEPTION_CODES.slice(0, 15).join(', ')} (and others)

QUALITY GATE (verify before output):
✓ All learning outcomes explicitly taught in explanation
✓ Explanation follows 6-part outline structure (What/Why/Key rules/How to use/Common mistakes/Recap)
✓ Understanding check: exactly 3 recall + 1 connection questions
✓ Integrative block: exactly 2 questions (1 connection + 1 synthesis)
✓ Worked example → guided practice alignment (if applicable)
✓ expectedAnswer arrays for short-text questions (not single strings)
✓ Block orders are correct and monotonic (1,2,3,4,4.5,5,6,7,9.5,10)
✓ No safety violations or legal inventions

If any item fails: FIX IT before responding.

OUTPUT FORMAT:
- Pure JSON only
- No markdown
- No explanations
- Must be valid and parseable`;
  }

  /**
   * Build user prompt with specific lesson requirements
   */
  private buildUserPrompt(request: GenerationRequest, layout: 'split-vis' | 'linear-flow'): string {
    const fullLessonId = `${request.unit}-${request.lessonId}`;
    const prereqsList = request.prerequisites && request.prerequisites.length > 0
      ? request.prerequisites.join(', ')
      : 'None (foundational lesson)';

    const mustHaveSection = request.mustHaveTopics 
      ? `\n\nREQUIRED LESSON STRUCTURE:\n${request.mustHaveTopics}\n\nThis is the high-level structure and syllabus that MUST be followed. Organize all lesson blocks (explanation, practice questions, examples) to comprehensively cover each section of this structure. Ensure the lesson flows through these topics in a logical sequence.`
      : '';

    const additionalInstructionsSection = request.additionalInstructions
      ? `\n\nADDITIONAL INSTRUCTIONS:\n${request.additionalInstructions}\n\nFollow these custom instructions carefully when generating the lesson. Adjust tone, depth, style, and content accordingly.`
      : '';

    const youtubeUrlSection = request.youtubeUrl
      ? `\n\nYOUTUBE VIDEO URL: ${request.youtubeUrl}\n\nInclude this URL in the diagram block's "videoUrl" field AND in metadata as "youtubeUrl": "${request.youtubeUrl}"`
      : '';

    const imageUrlSection = request.imageUrl
      ? `\n\nIMAGE URL: ${request.imageUrl}\n\nInclude this URL in the diagram block's "imageUrl" field. This is a static image that visually represents the circuit/concept being taught.`
      : '';

    return `Generate a complete lesson JSON for:

LESSON DETAILS:
- ID: ${fullLessonId}
- Topic: ${request.topic}
- Section: ${request.section}
- Layout: ${layout}
- Unit: Unit ${request.unit}
- Prerequisites: ${prereqsList}

REQUIREMENTS:
- Create 3-4 learning outcomes covering remember, understand, and apply levels
- Include 4-6 vocabulary terms essential to the topic
${layout === 'split-vis' ? '- Include diagram block with appropriate diagram type' : '- Diagram block is optional'}
- Write 400-600 word explanation teaching the core concepts
- Add understanding check with 3 recall + 1 connection question
${this.shouldIncludeWorkedExample(request) 
    ? '- Include worked example with 3-5 steps\n- Include guided practice with 2-3 steps (mirror the worked example steps)'
    : '- Worked example and guided practice optional (include if calculations, procedures, or selection decisions involved)'}
- Include 3-5 practice questions
- Add integrative block with 2 questions at end (1 connection + 1 synthesis)
- Include 4 spaced review questions from prerequisites (each with id, questionText, expectedAnswer, and hint)

SPACED REVIEW QUALITY STANDARDS:
- Questions should review key concepts from prerequisite lessons
- Expected answers should be concise (1-2 sentences or a key term/value)
- Hints should guide students toward the answer without giving it away
- Questions should be appropriate for quick review (simple recall, not complex calculations)
- Each question must have unique ID following pattern: ${fullLessonId}-SR-1, ${fullLessonId}-SR-2, etc.

TOPIC CONTEXT:
${this.getTopicContext(request.topic, request.section, request.mustHaveTopics)}${mustHaveSection}${additionalInstructionsSection}${youtubeUrlSection}${imageUrlSection}

Generate the complete lesson JSON now. Remember: ONLY JSON, no markdown, no explanations.`;
  }
  
  /**
   * Determine if worked example should be included using task classifier
   */
  private shouldIncludeWorkedExample(request: GenerationRequest): boolean {
    const tasks = classifyLessonTask(request.topic, request.section, request.mustHaveTopics);
    return requiresWorkedExample(tasks);
  }

  /**
   * Get topic-specific context to guide generation using task classifier
   */
  private getTopicContext(topic: string, section: string, mustHaveTopics?: string): string {
    // Use task classifier for more robust context generation
    const tasks = classifyLessonTask(topic, section, mustHaveTopics);
    return getTaskContext(tasks, topic, section);
  }
}
