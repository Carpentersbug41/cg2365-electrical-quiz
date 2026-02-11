/**
 * Phase 4: Understanding Checks
 * Generates formative assessment questions aligned with explanations
 */

import { PhasePromptBuilder } from './PhasePromptBuilder';
import { ExplanationBlock } from './Phase3_Explanation';

export interface UnderstandingChecksInput {
  lessonId: string;
  explanations: ExplanationBlock[];
  taskMode: string; // Explicit task mode string
}

export interface UnderstandingQuestion {
  id: string;
  questionText: string;
  answerType: 'short-text' | 'long-text';
  cognitiveLevel: 'recall' | 'connection';
  expectedAnswer?: string[];  // Optional for long-text (examples)
  keyPoints?: string[];        // Required when answerType === 'long-text'
  hint: string;
}

export interface UnderstandingCheckBlock {
  id: string;
  order: number;
  title: string;
  mode: 'conceptual';
  sequential: true;
  questions: UnderstandingQuestion[];
}

export interface UnderstandingChecksOutput {
  checks: UnderstandingCheckBlock[];
}

export class Phase4_UnderstandingChecks extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase 4: Understanding Checks';
  }

  protected buildSystemPrompt(): string {
    return `You are an assessment specialist for City & Guilds technical and vocational training.

Your task is to create formative assessment questions that check understanding of taught concepts.

DOMAIN-AGNOSTIC RULE (NON-NEGOTIABLE):
- Do not assume any specific trade, science branch, equipment family, or regulation set.
- Use transferable assessment language across technical subjects.

ANCHOR FACT METHOD (REQUIRED):
For EACH explanation block:
1) Select EXACTLY 3 "Anchor Facts" from the explanation text.
   - Each Anchor Fact MUST be a short verbatim phrase/sentence copied from the explanation (6-20 words).
   - Copy plain text only (no markdown symbols, bullet prefixes, or trailing punctuation).
   - Each Anchor Fact MUST be important, specific, and gradeable.
2) Write Q1, Q2, Q3 as simple recall questions, each testing ONE Anchor Fact.
3) Write Q4 (L2) as a connection question that explicitly connects ALL THREE Anchor Facts.

IMPORTANT: Do NOT output anchor facts as separate fields. Use them internally.

ANCHOR FACT SELECTION RULE (CRITICAL):
- At least one of the 3 anchor facts MUST be a contrast/boundary statement when available.

PLAIN TEXT EXTRACTION RULES:
- Strip markdown formatting
- Remove bullet prefixes
- Remove trailing punctuation
- Normalize whitespace
- Keep technical terms and units intact

QUESTION STRUCTURE (for each check):
- Q1 (L1-A): recall, single fact
- Q2 (L1-B): recall, single fact
- Q3 (L1-C): recall, single fact
- Q4 (L2): connection across Q1-Q3 facts

COGNITIVE LEVELS:
- Recall (L1): factual target
- Connection (L2): relationship between facts

EARLY REASONING RULE (CRITICAL):
- Q4 MUST include an explicit reasoning stem, such as:
  * "Why..."
  * "How do we know..."
  * "What must be true if..."
  * "Explain why this cannot..."
- This ensures progression from Recall -> Understanding -> Early Reasoning before moving to the next major concept.

L2 CONNECTION QUESTION REQUIREMENTS:
- MUST begin with: "Using your answers to Q1 (...), Q2 (...), and Q3 (...)..."
- MUST reference all three L1 facts by content
- MUST ask how they connect, relate, or work together

NO NEW TERMS:
- Do NOT introduce technical terms in questionText that do not appear in the explanation text.

DIAGRAM QUESTION REQUIREMENT:
- If the explanation includes a sentence beginning with "On the diagram...", one of Q1-Q3 SHOULD test the related concept.
- Canonical expected answers should prioritize scientific/technical meaning, not visual styling words.
- Accept concept-equivalent phrasing when scientifically correct.

TEACHING CONSTRAINTS (if provided):
If TASK_MODE includes "PURPOSE_ONLY":
- Questions MUST test PURPOSE / IDENTIFICATION / SELECTION, NOT operation procedures.
- BANNED QUESTION PATTERNS:
  * "How do you [verb]..."
  * "What is the first step..."
  * "Describe the process..."
  * "How to [action]..."

If TASK_MODE includes "IDENTIFICATION":
- Focus on recognition and selection cues
- Avoid procedural phrasing entirely

EXPECTED ANSWER RULES (CRITICAL):
- expectedAnswer MUST ALWAYS be an array (never a string).

L1 QUESTIONS (recall):
- expectedAnswer MUST contain EXACTLY 2-4 strings
- Canonical answer (first string) should be concise and tightly grounded in taught wording
- Prefer 1-6 words for canonical where feasible
- Do NOT use full-sentence canonical answers
- Variants must be normalization only (case, singular/plural, article, symbol format)

L2 QUESTION (connection):
- answerType MUST be "long-text"
- MUST include keyPoints array with 3-5 checkable connection ideas
- expectedAnswer should include 2-3 example responses covering all keyPoints

HINTS:
- One sentence, helpful, no new untaught content

${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: UnderstandingChecksInput): string {
    const { lessonId, explanations, taskMode } = input;

    return `Create understanding check questions for this lesson's explanations.

${explanations.map((exp, idx) => `
EXPLANATION ${idx + 1} (Order ${exp.order}):
Title: ${exp.title}
Content:
${exp.content}

---`).join('\n')}

${taskMode ? `
TASK MODE: ${taskMode}

CRITICAL REMINDERS based on task mode:
${taskMode.includes('PURPOSE_ONLY') ? '- Test "what for / when to choose / identify", not operation procedure.' : ''}
${taskMode.includes('IDENTIFICATION') ? '- Focus on recognition and selection cues.' : ''}
` : ''}

Create ${explanations.length} understanding check block(s), one immediately after each explanation.

Return JSON in this exact format:
{
  "checks": [
    {
      "id": "${lessonId}-check-1",
      "order": ${explanations[0] ? explanations[0].order + 0.5 : 4.5},
      "title": "Check Your Understanding: ${explanations[0]?.title || '[Topic]'}",
      "mode": "conceptual",
      "sequential": true,
      "questions": [
        {
          "id": "${lessonId}-C1-L1-A",
          "questionText": "[Recall question testing one specific anchor fact]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[canonical phrase]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C1-L1-B",
          "questionText": "[Recall question testing one specific anchor fact]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[canonical phrase]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C1-L1-C",
          "questionText": "[Recall question testing one specific anchor fact]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[canonical phrase]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C1-L2",
          "questionText": "Using your answers to Q1 ([brief Q1 topic]), Q2 ([brief Q2 topic]), and Q3 ([brief Q3 topic]), explain how these facts connect. Why does this relationship matter?",
          "answerType": "long-text",
          "cognitiveLevel": "connection",
          "keyPoints": [
            "[Connection between fact 1 and fact 2]",
            "[How fact 3 links to the first two]",
            "[Reasoning statement using why/how-we-know/what-must-be-true]"
          ],
          "expectedAnswer": ["[Example response covering keyPoints]", "[Alternative response]"],
          "hint": "[one-sentence connection hint]"
        }
      ]
    }${explanations.length > 1 ? `,
    {
      "id": "${lessonId}-check-2",
      "order": ${explanations[1] ? explanations[1].order + 0.5 : 5.5},
      "title": "Check Your Understanding: ${explanations[1]?.title || '[Topic 2]'}",
      "mode": "conceptual",
      "sequential": true,
      "questions": [
        {
          "id": "${lessonId}-C2-L1-A",
          "questionText": "[Recall question testing one specific anchor fact]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[canonical phrase]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C2-L1-B",
          "questionText": "[Recall question testing one specific anchor fact]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[canonical phrase]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C2-L1-C",
          "questionText": "[Recall question testing one specific anchor fact]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[canonical phrase]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C2-L2",
          "questionText": "Using your answers to Q1 ([brief Q1 topic]), Q2 ([brief Q2 topic]), and Q3 ([brief Q3 topic]), explain how these facts connect. How do we know this connection is valid?",
          "answerType": "long-text",
          "cognitiveLevel": "connection",
          "keyPoints": [
            "[Connection between fact 1 and fact 2]",
            "[How fact 3 links to the first two]",
            "[Reasoning statement using why/how-we-know/what-must-be-true]"
          ],
          "expectedAnswer": ["[Example response covering keyPoints]", "[Alternative response]"],
          "hint": "[one-sentence connection hint]"
        }
      ]
    }` : ''}
  ]
}

CRITICAL REQUIREMENTS:
- One check block per explanation
- Block order = explanation.order + 0.5
- Q1-Q3 each test one anchor fact
- Q4 must be early reasoning, not recall restatement
- expectedAnswer arrays only (never string)
- L1: exactly 2-4 variants, concise canonical first
- L2: long-text + 3-5 keyPoints + 2-3 example expectedAnswer variants
- Do not introduce untaught terms`; 
  }
}
