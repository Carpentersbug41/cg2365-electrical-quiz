/**
 * Lesson Prompt Builder
 * Constructs comprehensive prompts for LLM lesson generation
 */

import { APPROVED_TAGS, APPROVED_MISCONCEPTION_CODES, BLOOM_LEVELS, COGNITIVE_LEVELS } from './constants';
import { GenerationRequest } from './types';
import { inferLayout } from './utils';
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
    
    try {
      // Load BUILD_ERROR_PREVENTION.md for quality standards
      const errorPreventionPath = path.join(reportsPath, 'BUILD_ERROR_PREVENTION.md');
      if (fs.existsSync(errorPreventionPath)) {
        this.templateDocs['errorPrevention'] = fs.readFileSync(errorPreventionPath, 'utf-8');
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
    "diagramType": "series|parallel|circuit|other",
    "elementIds": ["element1", "element2"],
    "placeholderText": "[Text description for accessibility]"
  }
}

4. EXPLANATION BLOCK (order: 4):
{
  "id": "${lessonId}-explain-[topic]",
  "type": "explanation",
  "order": 4,
  "content": {
    "title": "[Clear section title]",
    "content": "[400-600 words with **bold** for emphasis and \\n\\n for paragraph breaks. Use numbered lists for rules/steps.]"
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
        "expectedAnswer": "[Simple answer]",
        "hint": "[Gentle hint]"
      },
      {
        "id": "${lessonId}-C1-L1-B",
        "questionText": "[Another simple recall, building on first]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "[Another fact]",
        "hint": "[Hint]"
      },
      {
        "id": "${lessonId}-C1-L1-C",
        "questionText": "[Third simple recall]",
        "answerType": "short-text",
        "cognitiveLevel": "recall",
        "expectedAnswer": "[Third fact]",
        "hint": "[Hint]"
      },
      {
        "id": "${lessonId}-C1-L2",
        "questionText": "[Connection question: How do Q1, Q2, Q3 relate?]",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": "[Answer showing relationships]",
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
        "expectedAnswer": ["[answer]", "[variations]"],
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
    "questions": [
      {
        "id": "${lessonId}-INT-1",
        "questionText": "[2-3 sentence question tying all concepts] (3-4 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": "[Comprehensive answer]",
        "hint": "[Strategic hint]"
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
      "[Question 1]",
      "[Question 2]",
      "[Question 3]",
      "[Question 4]"
    ],
    "notes": "[What concepts being reviewed]"
  }
}

CRITICAL QUALITY RULES:

1. **IDs**: All IDs must be unique and follow pattern: ${lessonId}-[blockType]
2. **Cognitive Levels**: Use ONLY: "recall", "connection", "synthesis" (NO "hypothesis")
3. **Bloom Levels**: Use: ${BLOOM_LEVELS.join(', ')}
4. **Question Structure**: 
   - Understanding checks: 3×L1 Recall + 1×L2 Connection
   - Integrative: 1×L2/L3 Synthesis at end
5. **JSX Escaping**: Use &quot; for " and &apos; for ' in content
6. **Formulas**: Verify accuracy (e.g., V=IR, P=VI, R_total = R1+R2+R3 for series)
7. **Block Order**: Maintain correct sequence (1, 2, 3, 4, 4.5, 5, 6, 7, 9.5, 8/10)
8. **Prerequisites**: Use actual lesson IDs that would exist
9. **Terminology**: Keep consistent throughout lesson
10. **Clarity**: Write for Level 2 electrician students (practical, not overly academic)

APPROVED TAGS: ${APPROVED_TAGS.slice(0, 20).join(', ')} (and others)
APPROVED MISCONCEPTION CODES: ${APPROVED_MISCONCEPTION_CODES.slice(0, 15).join(', ')} (and others)

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
      ? `\n\nMUST-HAVE TOPICS (ensure these are covered in the lesson content):\n${request.mustHaveTopics}\n\nThese specific subtopics MUST be included in the explanation and practice blocks. Ensure each topic is thoroughly explained and has corresponding practice questions.`
      : '';

    const additionalInstructionsSection = request.additionalInstructions
      ? `\n\nADDITIONAL INSTRUCTIONS:\n${request.additionalInstructions}\n\nFollow these custom instructions carefully when generating the lesson. Adjust tone, depth, style, and content accordingly.`
      : '';

    const youtubeUrlSection = request.youtubeUrl
      ? `\n\nYOUTUBE VIDEO URL: ${request.youtubeUrl}\n\nInclude this URL in the diagram block's "videoUrl" field AND in metadata as "youtubeUrl": "${request.youtubeUrl}"`
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
${request.section.includes('Science') || request.topic.toLowerCase().includes('circuit') || request.topic.toLowerCase().includes('calculation') || request.topic.toLowerCase().includes("ohm's law")
    ? '- Include worked example with 3-5 steps\n- Include guided practice with 2-3 steps'
    : '- Worked example and guided practice optional (include if calculations involved)'}
- Include 3-5 practice questions
- Add 1 integrative question at end
- Include 4 spaced review questions from prerequisites

TOPIC CONTEXT:
${this.getTopicContext(request.topic, request.section)}${mustHaveSection}${additionalInstructionsSection}${youtubeUrlSection}

Generate the complete lesson JSON now. Remember: ONLY JSON, no markdown, no explanations.`;
  }

  /**
   * Get topic-specific context to guide generation
   */
  private getTopicContext(topic: string, section: string): string {
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('circuit')) {
      return 'This is a circuit theory lesson. Include clear explanations of current, voltage, and resistance behavior. Use water analogies where helpful. Include circuit rules and calculations.';
    }

    if (topicLower.includes('safety') || topicLower.includes('ppe') || topicLower.includes('regulation')) {
      return 'This is a health and safety lesson. Focus on practical workplace applications. Include specific regulations and real-world examples. Emphasize responsibilities and procedures.';
    }

    if (topicLower.includes('cable') || topicLower.includes('wiring') || topicLower.includes('installation')) {
      return 'This is an installation technology lesson. Focus on practical selection criteria, identification, and applications. Include real cable types and specifications.';
    }

    if (topicLower.includes('ohm') || topicLower.includes('calculation') || topicLower.includes('formula')) {
      return 'This lesson involves calculations. Include worked examples with clear step-by-step solutions. Show formula rearrangements. Emphasize practical problem-solving.';
    }

    if (topicLower.includes('ac') || topicLower.includes('alternating')) {
      return 'This is about alternating current. Explain how AC differs from DC. Cover frequency, waveforms, and UK mains supply characteristics. Use practical examples.';
    }

    if (topicLower.includes('magnet') || topicLower.includes('transformer') || topicLower.includes('relay')) {
      return 'This is about electromagnetism. Explain magnetic fields and induction. Connect to practical devices like transformers, relays, and motors. Use clear diagrams.';
    }

    return `This lesson covers ${topic} in the context of ${section}. Provide clear explanations suitable for Level 2 electrical installation students with practical applications.`;
  }
}
