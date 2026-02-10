/**
 * Quiz Prompt Builder
 * Constructs prompts for LLM quiz generation (50 questions in batches)
 */

import { APPROVED_TAGS, APPROVED_MISCONCEPTION_CODES, DIFFICULTY_DISTRIBUTION } from './constants';
import { GenerationRequest } from './types';

export class QuizPromptBuilder {
  /**
   * Build prompt for a batch of quiz questions
   */
  buildBatchPrompt(
    request: GenerationRequest,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    startId: number
  ): { systemPrompt: string; userPrompt: string } {
    const fullLessonId = `${request.unit}-${request.lessonId}`;

    const systemPrompt = this.buildSystemPrompt(fullLessonId, difficulty);
    const userPrompt = this.buildUserPrompt(request, difficulty, count, startId);

    return { systemPrompt, userPrompt };
  }

  /**
   * Build system prompt for quiz generation
   */
  private buildSystemPrompt(lessonId: string, difficulty: 'easy' | 'medium' | 'hard'): string {
    const difficultyMap = {
      easy: '1-2 (basic recall, simple discrimination)',
      medium: '2-3 (application, multi-step, conceptual)',
      hard: '4-5 (complex scenarios, synthesis, novel applications)',
    };

    return `You are an expert question writer for C&G 2365 Electrical Training assessments.

OBJECTIVE: Generate high-quality multiple-choice questions with plausible distractors based on real student misconceptions.

CRITICAL OUTPUT REQUIREMENT:
- Return ONLY valid JSON array
- ALL property names MUST be in double quotes
- ALL string values MUST be in double quotes
- No trailing commas
- No markdown code blocks
- No explanations outside the array

CRITICAL: EACH QUESTION MUST HAVE EXACTLY 4 UNIQUE OPTIONS
- No more than 4 options
- No fewer than 4 options
- No duplicate options
- All options must be distinct and different from each other

QUESTION STRUCTURE (valid JSON format):

{
  "id": [unique number starting from given ID],
  "question": "[Clear, unambiguous question text]",
  "options": [
    "[Correct answer]",
    "[Wrong answer based on misconception 1]",
    "[Wrong answer based on misconception 2]",
    "[Wrong answer based on misconception 3]"
  ],
  "correctAnswer": 0,
  "misconceptionCodes": {
    "1": "VALID_MISCONCEPTION_CODE",
    "2": "VALID_MISCONCEPTION_CODE",
    "3": "VALID_MISCONCEPTION_CODE"
  },
  "section": "[Section name]",
  "category": "[Topic]",
  "tags": ["[tag1]", "[tag2]", "[tag3]"],
  "learningOutcomeId": "${lessonId}-LO1",
  "answerType": "mcq",
  "difficulty": ${difficulty === 'easy' ? 1 : difficulty === 'medium' ? 3 : 5},
  "estimatedTime": ${difficulty === 'easy' ? 45 : difficulty === 'medium' ? 75 : 120},
  "explanation": "[Brief explanation of why correct answer is right]"
}

DIFFICULTY LEVEL: ${difficulty.toUpperCase()} (${difficultyMap[difficulty]})

APPROVED MISCONCEPTION CODES:
${APPROVED_MISCONCEPTION_CODES.map(code => `- ${code}`).join('\n')}

APPROVED TAGS (use 2-4 per question):
${APPROVED_TAGS.slice(0, 30).map(tag => `- ${tag}`).join('\n')}

DISTRACTOR DESIGN PRINCIPLES:

1. **Systematic Error**: Result of applying wrong formula/method
   - Example: Using parallel formula in series context → USED_PARALLEL_RULE
   
2. **Calculation Error**: Arithmetic mistake
   - Example: Multiplying instead of adding → MULTIPLIED_INSTEAD
   
3. **Conceptual Confusion**: Misunderstanding core concept
   - Example: Thinking current divides in series → TOPOLOGY_CONFUSION
   
4. **Partial Understanding**: Right approach, wrong execution
   - Example: Forgetting reciprocal in parallel → RECIPROCAL_ERROR

QUESTION TYPES TO INCLUDE:

1. **Discrimination** (20%): Identify or classify concepts
   - "Which of these is a series circuit?"
   - "What type of current does a transformer use?"

2. **Conceptual** (20%): Understanding without calculation
   - "Why is current the same in series?"
   - "How does mutual induction work?"

3. **Calculation** (40%): Numerical problem-solving
   - "Calculate total resistance..."
   - "Find the voltage drop across..."

4. **Application** (20%): Real-world scenarios
   - "An electrician needs to wire Christmas lights..."
   - "Which cable type is suitable for..."

CRITICAL RULES:

1. **Options Array**: EXACTLY 4 UNIQUE options (no duplicates, no more, no fewer)
2. **IDs**: Must be unique, starting from provided start ID
3. **Correct Answer**: Must be at index specified by correctAnswer (typically 0)
4. **Misconception Codes**: Map EACH wrong answer to a valid code
5. **Tags**: Use 2-4 relevant tags from approved list
6. **Learning Outcomes**: Distribute across LO1, LO2, LO3
7. **Clarity**: Questions must be unambiguous
8. **Plausibility**: Distractors must be believable, not obviously wrong
9. **Explanation**: Clear and educational

QUALITY STANDARDS:

- Questions must be standalone (no "from the diagram above")
- All options should be parallel in structure and length
- Avoid "all of the above" or "none of the above"
- Include units where relevant
- Use UK terminology (earthing, not grounding; mains, not line)
- Write for Level 2 students (practical focus)

OUTPUT FORMAT:
- Pure JSON array syntax (RFC 8259 compliant)
- ALL property names in double quotes
- No trailing commas
- No markdown blocks
- No comments
- Must be valid JSON`;
  }

  /**
   * Build user prompt for specific batch
   */
  private buildUserPrompt(
    request: GenerationRequest,
    difficulty: 'easy' | 'medium' | 'hard',
    count: number,
    startId: number
  ): string {
    const fullLessonId = `${request.unit}-${request.lessonId}`;

    const difficultyGuidance = {
      easy: 'Focus on basic recall and simple discrimination. Questions should test foundational knowledge.',
      medium: 'Include application and multi-step thinking. Questions should require understanding and problem-solving.',
      hard: 'Create complex scenarios and synthesis questions. Test deeper understanding and novel applications.',
    };

    const mustHaveSection = request.mustHaveTopics
      ? `\n\nLESSON STRUCTURE TO TEST:\n${request.mustHaveTopics}\n\nDistribute questions across all sections of this lesson structure. Ensure each major section has 2-3 questions testing understanding of that area. Questions should test both specific knowledge within each section and connections between sections.`
      : '';

    const additionalInstructionsSection = request.additionalInstructions
      ? `\n\nADDITIONAL INSTRUCTIONS:\n${request.additionalInstructions}\n\nApply these custom instructions when creating quiz questions. Adjust difficulty, style, and focus accordingly.`
      : '';

    return `Generate ${count} ${difficulty} difficulty questions for:

LESSON: ${fullLessonId}
TOPIC: ${request.topic}
SECTION: ${request.section}
START ID: ${startId}

GUIDANCE:
${difficultyGuidance[difficulty]}

DISTRIBUTION FOR THIS BATCH:
${this.getBatchDistribution(request.topic, difficulty, count)}

TOPIC CONTEXT:
${this.getTopicContext(request.topic, request.section)}${mustHaveSection}${additionalInstructionsSection}

Generate ${count} questions now. Return as JSON array (with quoted property names):

[
  { "id": ${startId}, "question": "...", ... },
  { "id": ${startId + 1}, "question": "...", ... }
]`;
  }

  /**
   * Get topic-specific context
   */
  private getTopicContext(topic: string, section: string): string {
    const topicLower = topic.toLowerCase();

    if (topicLower.includes('circuit')) {
      return 'Cover circuit rules, current/voltage/resistance behavior, topology identification, and calculations. Use realistic values. Map errors to circuit-specific misconceptions.';
    }

    if (topicLower.includes('safety')) {
      return 'Cover regulations, responsibilities, procedures, and PPE. Use workplace scenarios. Focus on practical compliance and risk management.';
    }

    if (topicLower.includes('cable') || topicLower.includes('installation')) {
      return 'Cover cable types, construction, selection criteria, and applications. Include environmental factors and identification standards.';
    }

    if (topicLower.includes('calculation') || topicLower.includes('ohm')) {
      return 'Focus on numerical problem-solving. Include formula rearrangement, unit conversion, and practical applications. Ensure arithmetic is correct.';
    }

    if (topicLower.includes('ac') || topicLower.includes('alternating')) {
      return 'Cover AC vs DC, frequency, waveforms, RMS values, and UK mains characteristics. Include practical applications like transformers.';
    }

    if (topicLower.includes('magnet') || topicLower.includes('transformer')) {
      return 'Cover magnetic fields, induction, and electromagnetic devices. Connect to practical applications like motors, relays, and transformers.';
    }

    return `Questions should cover ${topic} with practical focus for ${section}. Use realistic scenarios and values.`;
  }

  /**
   * Get distribution guidance for batch
   */
  private getBatchDistribution(topic: string, difficulty: string, count: number): string {
    const topicLower = topic.toLowerCase();
    const hasCalculations = topicLower.includes('circuit') || 
                           topicLower.includes('calculation') || 
                           topicLower.includes('ohm') ||
                           topicLower.includes('power') ||
                           topicLower.includes('resistance');

    if (hasCalculations) {
      return `- Calculation questions: ~${Math.ceil(count * 0.5)}
- Conceptual questions: ~${Math.ceil(count * 0.3)}
- Application questions: ~${Math.floor(count * 0.2)}`;
    } else {
      return `- Conceptual questions: ~${Math.ceil(count * 0.4)}
- Discrimination questions: ~${Math.ceil(count * 0.3)}
- Application questions: ~${Math.floor(count * 0.3)}`;
    }
  }
}
