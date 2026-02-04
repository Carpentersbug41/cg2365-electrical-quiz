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
   * Build prerequisite anchors from prerequisite lesson files
   * Extracts 4-10 key facts from each prerequisite lesson for spaced review
   */
  private buildPrerequisiteAnchors(prerequisites: string[]): string {
    if (!prerequisites || prerequisites.length === 0) {
      return '';
    }

    const anchors: string[] = [];
    const lessonsPath = path.join(process.cwd(), 'src', 'data', 'lessons');

    for (const prereqId of prerequisites) {
      try {
        // Find the lesson file by ID
        const files = fs.readdirSync(lessonsPath);
        const lessonFile = files.find(f => f.startsWith(prereqId) && f.endsWith('.json'));
        
        if (!lessonFile) {
          console.warn(`Prerequisite lesson file not found for ${prereqId}`);
          continue;
        }

        const lessonPath = path.join(lessonsPath, lessonFile);
        const lessonData = JSON.parse(fs.readFileSync(lessonPath, 'utf-8'));
        const facts: string[] = [];

        // Extract vocab terms (limit to 4-6 most important)
        const vocabBlock = lessonData.blocks?.find((b: { type: string }) => b.type === 'vocab');
        if (vocabBlock?.content?.terms) {
          const terms = vocabBlock.content.terms.slice(0, 6);
          for (const term of terms) {
            if (term.term && term.definition) {
              // Create compact fact: "term = definition"
              const compactDef = term.definition.split('.')[0]; // Take first sentence only
              facts.push(`${term.term} = ${compactDef}`);
            }
          }
        }

        // Extract key facts from explanation blocks
        const explanationBlocks = lessonData.blocks?.filter((b: { type: string }) => b.type === 'explanation') || [];
        for (const expBlock of explanationBlocks.slice(0, 2)) { // Max 2 explanation blocks
          if (expBlock?.content?.content) {
            const content = expBlock.content.content;
            
            // Look for "Key rules" or "Key facts" section with flexible formatting
            // Supports both bold (**Key rules**) and markdown headings (### Key Rules)
            const keyRulesMatch = content.match(
              /(?:\*\*|#{2,3}\s*)Key\s*(?:rules?|facts?)(?:\s*[\/\-]\s*facts?)?(?:\s*[\/\-]\s*rules?)?[:\s]*(?:\*\*)?([^]*?)(?=\n\n|#{2,3}\s|\*\*[A-Z]|$)/i
            );
            if (keyRulesMatch) {
              const rulesText = keyRulesMatch[1];
              // Extract bullet points
              const bullets = rulesText.match(/[-•]\s*([^\n]+)/g);
              if (bullets) {
                bullets.slice(0, 3).forEach((bullet: string) => {
                  const cleaned = bullet.replace(/^[-•]\s*/, '').trim().split('.')[0];
                  if (cleaned.length > 10 && cleaned.length < 150) {
                    facts.push(cleaned);
                  }
                });
              }
            }
          }
        }

        // Create anchor string for this prerequisite (limit to 10 facts max)
        if (facts.length > 0) {
          const anchorFacts = facts.slice(0, 10).join('; ');
          anchors.push(`${prereqId}: ${anchorFacts}`);
        }

      } catch (error) {
        console.warn(`Could not load prerequisite lesson ${prereqId}:`, error);
      }
    }

    return anchors.join('\n\n');
  }

  /**
   * Build complete lesson generation prompt
   */
  buildPrompt(request: GenerationRequest): { systemPrompt: string; userPrompt: string } {
    const layout = request.layout || inferLayout(request.section, request.topic);
    const fullLessonId = `${request.unit}-${request.lessonId}`;

    // Auto-generate prerequisite anchors if not provided
    if (!request.prerequisiteAnchors && request.prerequisites && request.prerequisites.length > 0) {
      request.prerequisiteAnchors = this.buildPrerequisiteAnchors(request.prerequisites);
    }

    const systemPrompt = this.buildSystemPrompt(fullLessonId, layout);
    const userPrompt = this.buildUserPrompt(request, layout);

    return { systemPrompt, userPrompt };
  }

  /**
   * Build system prompt with templates and rules
   */
  private buildSystemPrompt(lessonId: string, layout: 'split-vis' | 'linear-flow' | 'focus-mode'): string {
    return `You are an expert lesson designer for C&G 2365 Electrical Training courses.

OBJECTIVE: Generate complete, production-ready lesson JSON following the structure below.

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Block orders monotonic: 1,2,3,4,4.5,5,5.5,6,7,8,9.5,10 (optional blocks: diagram=3, explanation-2=5, check-2=5.5, worked=6, guided=7)

CRITICAL RULES:
1. TEACHING BEFORE TESTING: Explanations teach concepts → questions assess them. Never reverse this order.
2. ANSWER COVERAGE: Every expectedAnswer must exist verbatim/paraphrased in a prior explanation block.
3. STAGING: Questions assess ONLY what's been explicitly taught. No untaught terms/symbols/procedures.
4. UNDERSTANDING CHECKS: Exactly 3 recall (L1-A,B,C) + 1 connection (L2) per check, placed at order X.5 after explanation at order X.
5. INTEGRATIVE: Exactly 2 questions at order 9.5 - one connection, one synthesis (3-4 sentences each).

QUALITY CHECKLIST:
✓ Every learning outcome addressed in explanation
✓ Explanation has "Key facts / rules" section
✓ Practice has 3-5 questions including one applied if "apply" LO exists
✓ Worked example (order 6) → guided practice (order 7) mirrors it step-for-step
✓ expectedAnswer uses arrays for short-text (multiple acceptable phrasings)

LESSON STRUCTURE:

CRITICAL: Top-level "learningOutcomes" field MUST be a simple string array. Do NOT use objects with text/bloomLevel properties here - that format is ONLY for the outcomes BLOCK below.

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
    // BLOCK ORDER CONTRACT (NON-NEGOTIABLE):
    // Every block MUST have a UNIQUE numeric order value. Use this spacing:
    // - outcomes: 1 (required)
    // - vocab: 2 (required)
    // - diagram: 3 (optional - required for split-vis layout)
    // - explanation-1: 4 (required)
    //   - optional microbreak after: 4.2
    //   - understanding check-1: 4.5 (required)
    //   - optional microbreak after: 4.7
    // - explanation-2: 5 (optional - only if multi-section topic)
    //   - optional microbreak after: 5.2
    //   - understanding check-2: 5.5 (required if explanation-2 exists)
    //   - optional microbreak after: 5.7
    // - worked example: 6 (optional - only if calculation/procedure task)
    //   - optional microbreak after: 6.2
    // - guided practice: 7 (optional - only if worked example exists)
    //   - optional microbreak after: 7.2
    // - practice: 8 (required)
    //   - optional microbreak after: 8.2
    // - integrative: 9.5 (required)
    // - spaced review: 10 (required - ALWAYS LAST)
    //
    // CRITICAL ORDER RULES:
    // 1. Never reuse the same order value for two blocks
    // 2. Microbreaks use .2 or .7 decimal positions between major blocks
    // 3. Understanding checks use .5 decimal positions
    // 4. Orders must be strictly increasing (monotonic)
    // 5. If unsure, use integers and skip numbers (4, 6, 8, 10, 12, 14)
    //
    // CRITICAL: NO questions (checks/practice) before ALL relevant explanation blocks are complete
    // CRITICAL: Understanding checks must appear IMMEDIATELY AFTER the explanation they assess
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
    "diagramType": "series|parallel|circuit|plan|wiring|schematic|block|procedure|table|graph|concept|other",
    "elementIds": ["element1", "element2"],
    "placeholderText": "[Text description for accessibility]"
  }
}

DIAGRAM TYPES: circuit/plan/wiring/schematic/block/procedure/table/graph/concept/other
DIAGRAM RULE: Diagrams show visually, explanations teach textually. Diagram elements must be taught in explanation before assessment.

4. EXPLANATION BLOCK (order: 4):
{
  "id": "${lessonId}-explain-[topic]",
  "type": "explanation",
  "order": 4,
  "content": {
    "title": "[Clear section title]",
    "content": "[400-600 words with: 1) What this is, 2) Why it matters, 3) **Key rules / facts** (required bullet list), 4) How to use it, 5) Common mistakes, 6) Quick recap. Use **bold**, \\n\\n breaks, lists.]"
  }
}

5. UNDERSTANDING CHECK BLOCK (order: 4.5, 5.5, 6.5... immediately after corresponding explanation) - CRITICAL PLACEMENT:

CHECK PLACEMENT: Understanding checks at X.5 immediately after explanation at X. No checks before first explanation.

QUESTION IDS: ${lessonId}-C1-L1-A/B/C (recall), ${lessonId}-C1-L2 (connection), ${lessonId}-P1/P2 (practice), ${lessonId}-INT-1/2 (integrative), ${lessonId}-SR-1/2/3/4 (spaced review)

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

6. WORKED EXAMPLE BLOCK (order: 6) - Include if calculations/problem-solving:
{
  "id": "${lessonId}-worked-example",
  "type": "worked-example",
  "order": 6,
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

7. GUIDED PRACTICE (order: 7) - Include if worked example exists:
{
  "id": "${lessonId}-guided",
  "type": "guided-practice",
  "order": 7,
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

8. PRACTICE BLOCK (order: 8):
{
  "id": "${lessonId}-practice",
  "type": "practice",
  "order": 8,
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

10. SPACED REVIEW BLOCK (order: 10 - ALWAYS LAST):

CRITICAL: All spaced review questions MUST use field name "questionText" (NOT "attText", "questiontext", "question_text", or any other variant).

{
  "id": "${lessonId}-spaced-review",
  "type": "spaced-review",
  "order": 10,
  "content": {
    "title": "Spaced Review (from prerequisites)",
    "questions": [
      {
        "id": "${lessonId}-SR-1",
        "questionText": "[Review question from prerequisite topic 1]",
        "expectedAnswer": ["[Clear, concise answer]"],
        "hint": "[Helpful hint if student struggles]"
      },
      {
        "id": "${lessonId}-SR-2",
        "questionText": "[Review question from prerequisite topic 2]",
        "expectedAnswer": ["[Clear, concise answer]"],
        "hint": "[Helpful hint]"
      },
      {
        "id": "${lessonId}-SR-3",
        "questionText": "[Review question from prerequisite topic 3]",
        "expectedAnswer": ["[Clear, concise answer]"],
        "hint": "[Helpful hint]"
      },
      {
        "id": "${lessonId}-SR-4",
        "questionText": "[Review question from prerequisite topic 4]",
        "expectedAnswer": ["[Clear, concise answer]"],
        "hint": "[Helpful hint]"
      }
    ],
    "notes": "SR-1 -> [prereqId] ([concept reviewed]); SR-2 -> [prereqId] ([concept reviewed]); SR-3 -> [prereqId] ([concept reviewed]); SR-4 -> [prereqId] ([concept reviewed])"
  }
}

MICROBREAK PLACEMENT RULE (CRITICAL):
- Microbreaks are engagement activities that may test knowledge
- Microbreaks can ONLY appear:
  - AFTER an explanation block that teaches the concepts being tested, OR
  - AFTER a practice/check block (as a palate cleanser)
- Microbreaks must NOT introduce new facts or test concepts not yet taught
- Microbreak placement examples:
  ✓ GOOD: explanation(4) → microbreak(4.2) → check(4.5)
  ✓ GOOD: check(4.5) → microbreak(4.7) → explanation(5)
  ✗ BAD: vocab(2) → microbreak(2.5) → explanation(4) [tests before teaching]
- If microbreak uses matching/sorting/questions, those terms MUST exist in:
  - vocab definitions (for simple term recall), AND
  - explanation content (for concept understanding)
- Order placement: microbreaks should use decimal orders between major blocks (use .2 or .7)

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

EXPECTED ANSWER ALIGNMENT RULE (CRITICAL FOR MARKING):
- Every expectedAnswer MUST be derived from the lesson's explanation wording (use same terminology)
- Provide 2-6 acceptable variants in the array, but AT LEAST ONE variant must closely match the phrasing taught in the explanation
- Do NOT invent answer phrasings that never appeared in the lesson
- Students should be able to quote/paraphrase directly from the explanation to answer correctly

EXAMPLE:
If explanation says: "BS 7671 is the UK wiring regulations standard"
✓ GOOD expectedAnswer: ["BS 7671", "UK wiring regulations", "wiring regulations standard"]
✗ BAD expectedAnswer: ["British Standard 7671:2018", "IET Wiring Regulations"] (not taught in lesson)

3. **Bloom Levels**: Use: ${BLOOM_LEVELS.join(', ')}
4. **Question Structure**: 
   - Understanding checks: 3×L1 Recall + 1×L2 Connection
   - Integrative: 2 questions (1×L2 Connection + 1×L3 Synthesis)
5. **JSX Escaping**: Use &quot; for " and &apos; for ' in content
6. **Formulas**: Verify accuracy (e.g., V=IR, P=VI, R_total = R1+R2+R3 for series)
7. **Block Order**: Maintain correct sequence (1, 2, 3, 4, 4.5, 5, 6, 7, 8, 9.5, 10)
8. **Prerequisites**: Use actual lesson IDs that would exist
9. **Terminology**: Keep consistent throughout lesson
10. **FIELD NAMES**: All spaced-review questions MUST use "questionText" field (NEVER "attText", "questiontext", "question_text", or any other variant!)
11. **LEARNING OUTCOMES FORMAT**: The top-level "learningOutcomes" field MUST be an array of plain strings (NOT objects). Only the outcomes BLOCK content uses objects with "text" and "bloomLevel" fields. These are two different structures - do not confuse them!
12. **MEDIA URLS**: If YouTube URL or Image URL is provided, MUST include them in the diagram block's "videoUrl" and "imageUrl" fields respectively
13. **Clarity**: Write for Level 2 electrician students (practical, not overly academic)

ANSWER MARKING POLICY (MANDATORY):
- expectedAnswer MUST ALWAYS be an array of strings for ALL question types:
  ✓ CORRECT: expectedAnswer: ["5.5"]
  ✓ CORRECT: expectedAnswer: ["Residual Current Device", "RCD"]
  ✗ INCORRECT: expectedAnswer: "5.5" (single string - NOT allowed)
  ✗ INCORRECT: expectedAnswer: 5.5 (number - NOT allowed)
  
- For short-text answers: Use arrays with 2-6 variations
  Example: expectedAnswer: ["Residual Current Device", "RCD", "residual current device"]
  
- For numeric answers: Use answerType "numeric" and string array WITHOUT units
  Example: expectedAnswer: ["5.5", "5.50"], units in hint only
  
- Single-item arrays when only one canonical wording exists:
  Example: expectedAnswer: ["BS 7671"]
  
- Include common synonyms, acronym expansions, and alternative phrasings
  
- CRITICAL: NEVER use single string values anywhere in the lesson
- CRITICAL: Spaced review questions MUST also use array format

NUMERIC ANSWER FORMAT (CRITICAL - MARKING WILL FAIL OTHERWISE):
This is a common LLM mistake that breaks marking functionality. Pay close attention:

- When answerType is "numeric", expectedAnswer MUST be a string array WITHOUT any units or symbols
- Units and symbols go in the "hint" field ONLY, not in expectedAnswer
- This rule is NON-NEGOTIABLE - marking will fail if violated

Examples of CORRECT numeric answers:
  ✓ expectedAnswer: ["15"], hint: "Answer as a percentage (unit: %)"
  ✓ expectedAnswer: ["5.5"], hint: "Answer in millimetres (mm)"
  ✓ expectedAnswer: ["230"], hint: "UK mains voltage (V)"
  ✓ expectedAnswer: ["0.72"], hint: "Multiply Ca × Cg"

Examples of INCORRECT numeric answers (WILL CAUSE MARKING FAILURES):
  ✗ expectedAnswer: ["15%"] - NO! Remove % symbol
  ✗ expectedAnswer: ["5.5mm"] - NO! Remove mm unit
  ✗ expectedAnswer: ["230V"] - NO! Remove V unit
  ✗ expectedAnswer: ["15 %"] - NO! No units even with space
  ✗ expectedAnswer: ["5.5 millimetres"] - NO! No spelled-out units

The numeric answer should contain ONLY the number (digits, decimal point, minus sign if negative).
All context about units goes in the hint field where students can see it but it won't break marking.

LESSON GENERATION ALGORITHM (FOLLOW THIS SEQUENCE):
To ensure proper staging and coverage, generate the lesson in this order:

STEP 1: PLAN
- Draft lesson outline from topic + mustHaveTopics
- Identify which concepts need explanation blocks
- Identify which concepts are calculation/procedure tasks (need worked examples)

STEP 2: TEACH (explanation blocks)
- Write explanation section(s) that FULLY teach the outline
- Ensure explanations cover ALL concepts that will be assessed
- Include ALL terms, symbols, procedures, facts that questions will reference
- Use the required 6-part structure: What/Why/Key rules/How to use/Common mistakes/Recap

STEP 3: CHECK (understanding checks)
- ONLY NOW write understanding check blocks
- Place each check IMMEDIATELY AFTER the explanation it assesses
- Verify every question's expectedAnswer exists in the preceding explanation
- Use recall questions (L1) that quote facts from the explanation
- Use connection question (L2) that ties together facts from Q1, Q2, Q3

STEP 4: APPLY (worked example + guided practice if needed)
- IF task type is calculation/procedure/selection: add worked example
- Add guided practice that mirrors worked example steps

STEP 5: PRACTICE (independent practice)
- Add 3-5 practice questions that apply taught concepts
- Ensure all practice questions reference concepts from earlier explanations

STEP 6: INTEGRATE (integrative block)
- Add 2 questions synthesizing concepts from MULTIPLE earlier explanations
- Q1 (connection): link 2-3 major concepts
- Q2 (synthesis): integrate ALL lesson concepts (3-4 sentences)

STEP 7: REVIEW (spaced review)
- Add 4 questions reviewing PREREQUISITE lessons only
- Do NOT assess current lesson content in spaced review

This sequence prevents questions appearing before content is taught.

APPROVED TAGS: ${APPROVED_TAGS.slice(0, 20).join(', ')} (and others)
APPROVED MISCONCEPTION CODES: ${APPROVED_MISCONCEPTION_CODES.slice(0, 15).join(', ')} (and others)

SELF-AUDIT CHECKLIST (VERIFY BEFORE OUTPUT):
Before outputting the lesson JSON, you MUST verify:

STAGING & ORDERING:
✓ No question-like blocks appear before the first relevant explanation
✓ Every block has a unique order value (no duplicates)
✓ Orders are strictly increasing (monotonic: 1, 2, 3, 4, 4.5, 5...)
✓ Microbreaks appear AFTER explanations (never before first teaching)
✓ Understanding checks appear immediately after explanations (use .5 orders)

CONTENT COVERAGE:
✓ Every expectedAnswer can be found (verbatim or paraphrased) in explanation text
✓ All learning outcomes explicitly taught in explanation blocks
✓ Explanation follows 6-part structure (What/Why/Key rules/How/Mistakes/Recap)

QUESTION QUALITY:
✓ Understanding checks: exactly 3 recall + 1 connection questions
✓ Integrative block: exactly 2 questions (1 connection + 1 synthesis)
✓ All question IDs follow required patterns (C1-L1-A, INT-1, P1, SR-1)
✓ Connection questions explicitly reference facts from Q1, Q2, Q3

ANSWER FORMAT:
✓ All expectedAnswer fields use arrays (NEVER single strings)
✓ Numeric answers are string arrays without units
✓ Short-text answers include 2-6 acceptable variations

SCHEMA COMPLIANCE:
✓ diagramType uses approved enum values
✓ Worked example → guided practice alignment (if applicable)
✓ All spaced review questions use "questionText" field (not "attText")
✓ Top-level learningOutcomes are plain strings (not objects)
✓ Block orders match required sequence

SAFETY & ACCURACY:
✓ No invented legal claims or unsafe instructions
✓ Formulas are accurate (V=IR, P=VI, series adds, parallel inverts)
✓ Terminology consistent throughout lesson

If ANY check fails: FIX IT before responding.
CRITICAL: Do not output JSON until ALL checks pass.



OUTPUT FORMAT:
- Pure JSON only
- No markdown
- No explanations
- Must be valid and parseable`;
  }

  /**
   * Build user prompt with specific lesson requirements
   */
  private buildUserPrompt(request: GenerationRequest, layout: 'split-vis' | 'linear-flow' | 'focus-mode'): string {
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

    // Build prerequisite anchors section for spaced review
    const prerequisiteAnchorsSection = request.prerequisiteAnchors
      ? `\n\nPREREQUISITE ANCHORS (SPACED REVIEW MUST ONLY USE THESE):
${request.prerequisiteAnchors}

CRITICAL SPACED REVIEW RULES:
- Spaced review questions MUST derive from the anchors above ONLY
- Do NOT use random fundamentals (Ohm's law, basic safety, fuses, etc.) unless they appear in anchors
- Each question's notes field must include provenance mapping: "SR-1 -> [prereqId] ([concept reviewed])"
- Questions should test specific facts from prerequisite lessons, not generic electrical knowledge
- If prerequisite anchors are missing/empty, generate SR questions ONLY from the stated prerequisites list
- Questions should prompt return to prerequisite lessons (e.g., "Define [term from prereq]", "What is [concept from prereq]?")
- Do NOT invent generic fundamentals (Ohm's law, safety rules) unless they exist in the prerequisites
- Each question must be traceable to a specific prerequisite lesson ID`
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
- Questions should review key concepts from prerequisite lessons (see PREREQUISITE ANCHORS section below)
- Expected answers should be concise (1-2 sentences or a key term/value)
- Hints should guide students toward the answer without giving it away
- Questions should be appropriate for quick review (simple recall, not complex calculations)
- Each question must have unique ID following pattern: ${fullLessonId}-SR-1, ${fullLessonId}-SR-2, etc.
- Notes field MUST include provenance mapping: "SR-1 -> [prereqId] ([concept]); SR-2 -> [prereqId] ([concept]); SR-3 -> [prereqId] ([concept]); SR-4 -> [prereqId] ([concept])"

TOPIC CONTEXT:
${this.getTopicContext(request.topic, request.section, request.mustHaveTopics)}${mustHaveSection}${additionalInstructionsSection}${youtubeUrlSection}${imageUrlSection}${prerequisiteAnchorsSection}

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
