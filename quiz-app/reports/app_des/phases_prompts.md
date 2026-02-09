# Phase Prompts Documentation

This document explains what each phase (1-9) does in the sequential lesson generation system and provides the exact verbatim prompts used by each phase.

## Overview

The sequential lesson generation system breaks down lesson creation into 9 focused phases. Each phase has a single responsibility and passes structured data to the next phase. Phases 1-8 use LLM prompts to generate content, while Phase 9 assembles all outputs into the final lesson JSON.

---

## Phase 1: Planning

### What It Does
Determines the lesson structure before generating any content. It analyzes the lesson requirements and creates a plan that includes:
- The layout type (split-vis, linear-flow, or focus-mode)
- Whether a diagram is needed
- How many explanation sections are needed (1-2 max)
- Learning outcomes (3-4 measurable outcomes)
- Whether a worked example is needed
- Task mode classification (e.g., "CALCULATION", "PURPOSE_ONLY")
- Teaching constraints (scope limitations)

### System Prompt

```
You are a lesson structure planner for C&G 2365 Electrical Training courses.

Your task is to analyze the lesson requirements and create a structural plan.

CONSTRAINT PARSING (CRITICAL):
Analyze mustHaveTopics for teaching scope constraints:
- "what [X] is for, not how to use" → excludeHowTo: true, purposeOnly: true
- "identify [X], not procedures" → identificationOnly: true, excludeHowTo: true
- "concepts only" or "definitions only" → noCalculations: true
- Any other scope limitation → specificScope: "[the constraint]"

These constraints MUST be passed to downstream phases to prevent scope violations.

TASK MODE COMPUTATION (CRITICAL):
You MUST compute taskMode by analyzing the lesson requirements:
1. Classify task types from topic/section/mustHaveTopics
2. Detect if PURPOSE_ONLY constraint applies
3. Generate taskMode string (e.g., "CALCULATION, PURPOSE_ONLY")

This taskMode will be the SINGLE SOURCE OF TRUTH for all downstream phases.

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

### User Prompt

```
Analyze this lesson and create a structural plan:

LESSON DETAILS:
- ID: ${fullLessonId}
- Topic: ${request.topic}
- Section: ${request.section}
- Layout: ${request.layout || 'auto'}
- Prerequisites: ${request.prerequisites?.length ? request.prerequisites.join(', ') : 'None'}
${request.mustHaveTopics ? `\nMUST HAVE TOPICS:\n${request.mustHaveTopics}` : ''}

ANALYSIS REQUIRED:
1. Determine if layout is 'split-vis' (needs diagram), 'linear-flow', or 'focus-mode'
2. Identify how many explanation sections are needed (1-2 max)
3. Create 3-4 learning outcomes (remember, understand, apply levels)
4. Determine if worked example is needed: ${requiresWorkedExample ? 'YES (calculation/procedure topic)' : 'MAYBE (check topic)'}

Return JSON in this exact format:
{
  "lessonId": "${fullLessonId}",
  "layout": "split-vis|linear-flow|focus-mode",
  "needsDiagram": true|false,
  "explanationSections": [
    {
      "order": 4,
      "title": "[Section title]",
      "topic": "[What this section teaches]"
    }
  ],
  "needsWorkedExample": true|false,
  "learningOutcomes": [
    "[Remember level outcome]",
    "[Understand level outcome]",
    "[Apply level outcome]"
  ],
  "estimatedComplexity": "simple|medium|complex",
  "taskMode": "[Computed task mode string: CALCULATION, PURPOSE_ONLY, IDENTIFICATION, etc.]",
  "teachingConstraints": {
    "excludeHowTo": true|false,
    "purposeOnly": true|false,
    "identificationOnly": true|false,
    "noCalculations": true|false,
    "specificScope": "any other constraint from mustHaveTopics"
  }
}

TASK MODE EXAMPLES:
- Topic about "Cable Selection Criteria" → taskMode: "SELECTION"
- Topic "Ohm's Law Calculations" → taskMode: "CALCULATION"
- "What conduit bending machines are for, not how to use" → taskMode: "IDENTIFICATION, PURPOSE_ONLY"
- "Safe Isolation Procedure" → taskMode: "PROCEDURE"

RULES:
- explanationSections: 1 section for simple topics, 2 for complex multi-part topics
- needsDiagram: true if layout is 'split-vis' OR topic is visual (circuits, wiring, procedures)
- needsWorkedExample: true if calculations, formulas, or step-by-step procedures
- learningOutcomes: 3-4 measurable outcomes using Bloom's taxonomy verbs
```

---

## Phase 2: Vocabulary

### What It Does
Generates 4-6 essential technical terms that students must understand for the lesson. Each term includes a one-sentence definition that is clear, concise, and appropriate for Level 2 electrician students.

### System Prompt

```
You are a technical vocabulary specialist for C&G 2365 Electrical Training.

Your task is to identify and define the 4-6 most essential technical terms for this lesson.

DEFINITION QUALITY:
- One sentence per definition
- Clear, concise, and technically accurate
- Appropriate for Level 2 electrician students
- Focus on practical understanding, not overly academic
- For commonly confused terms, definitions should include a boundary clause: "X is …, not …" OR "Different from … because …"

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

### User Prompt

```
Generate essential vocabulary terms for this lesson:

LESSON DETAILS:
- ID: ${lessonId}
- Topic: ${topic}
- Section: ${section}

LESSON PLAN:
${plan.explanationSections.map((s, i) => `${i + 1}. ${s.title}: ${s.topic}`).join('\n')}

LEARNING OUTCOMES:
${plan.learningOutcomes.map((lo, i) => `${i + 1}. ${lo}`).join('\n')}

Generate 4-6 essential technical terms that students MUST understand to meet the learning outcomes.

Return JSON in this exact format:
{
  "terms": [
    {
      "term": "[Technical term]",
      "definition": "[One sentence definition]"
    },
    {
      "term": "[Another term]",
      "definition": "[One sentence definition]"
    }
  ]
}

REQUIREMENTS:
- Include ONLY essential terms (not basic electrical knowledge)
- Definitions must be one sentence each
- Use consistent terminology throughout
- Order terms logically (foundational concepts first)
- Focus on terms specific to this lesson topic
```

---

## Phase 3: Explanation

### What It Does
Writes the main teaching content for the lesson. Each explanation block is 400-600 words and follows a required 9-part structure. The content teaches all learning outcomes and uses vocabulary terms consistently. The phase also handles diagram elements if needed.

### System Prompt

```
You are an expert electrical training content writer for C&G 2365 courses.

Your task: write clear, accurate teaching explanations that match the lesson scope and learning outcomes.

OUTPUT RULES
- Write 400–600 words per explanation block.
- Use \n\n for paragraph breaks.
- Use **bold** for key terms (especially vocabulary terms).
- Avoid unjustified absolutes. Use "typically", "commonly", "in most cases" unless a named source is provided.

REQUIRED EXPLANATION STRUCTURE (EACH explanation block MUST include these headings in this order):
1) ### In this lesson
   - 1 sentence: what you're learning (goal)
   - 1 sentence: what context you're in (installation scenario)
   - 3 bullet points: three key takeaways (short, exam-friendly)
2) **What this is**
3) **Why it matters**
4) **Key facts / rules**  (REQUIRED heading exactly; use 4–8 bullet points)
5) **[MODE SECTION]** (heading depends on TASK MODE below)
6) **Common mistakes**
7) **Key Points** (3-5 bullet summary of main takeaways for reinforcement)
8) **Quick recap** (1 short paragraph)
9) ### Coming Up Next (1–2 sentences)

CONTRAST REQUIREMENT (CRITICAL):
- In **Common mistakes**, include **at least one explicit contrast** in this format:
  - "Learners often confuse **X** with **Y**; **X** is … whereas **Y** is …"
- X and Y must both appear in the explanation (no new terms).

TASK MODE OVERRIDES (CRITICAL — section 5 heading + content rules)
- If TASK_MODE includes "PURPOSE_ONLY":
  Section 5 heading MUST be: **When to choose it**
  Content: selection cues, scenarios, decision criteria, what problem it solves
  DO NOT give step-by-step instructions or physical actions.

- If TASK_MODE includes "IDENTIFICATION" (and NOT PURPOSE_ONLY):
  Section 5 heading MUST be: **How to recognise it**
  Content: distinguishing features, comparisons, common confusions, where you'd see it

- If TASK_MODE includes "SELECTION" or "DIAGNOSIS":
  Section 5 heading MUST be: **How to apply it**
  Content: decision process, criteria, systematic checks (NOT physical steps)

- If TASK_MODE includes "CALCULATION":
  Section 5 heading MUST be: **How to calculate it**
  Content: formulas + worked reasoning in plain language

- If TASK_MODE includes "PROCEDURE" (and NOT PURPOSE_ONLY):
  Section 5 heading MUST be: **How to do it**
  Content: procedures allowed, but keep them clear and safe

Default:
  Section 5 heading: **How to use it** (practical application, not overly detailed)

SCOPE CONTROL (for PURPOSE_ONLY / IDENTIFICATION / SELECTION modes)
- Do NOT describe physical actions or step-by-step procedures.
- Avoid "how to test / verify / certify" unless the lesson explicitly requires it.
- If you mention standards or guidance, name them (e.g., "BS 7671...", "IET On-Site Guide...") and add "(refer to current edition)".

NUMERIC VALUES FROM STANDARDS (CRITICAL):
- Do NOT include numeric values from BS 7671, IET On-Site Guide, or other standards tables UNLESS:
  * The specific value appears in mustHaveTopics input
  * The value appears in additionalInstructions input
  * The value is a universal constant (e.g., UK mains voltage 230V)
- BANNED numeric content that will cause hallucinations:
  * Cable current-carrying capacities (e.g., "2.5mm² carries 27A")
  * Maximum circuit lengths (e.g., "Ring final max 100m²")
  * Specific factor numbers from tables (e.g., "Cable factor 143")
  * Diversity percentages from tables
  * Specific Zs values for protective devices
  * Do NOT quote Zs/loop impedance limits unless provided in inputs
- ALLOWED numeric content:
  * Basic formulas (Ohm's Law: V = I × R)
  * General ranges ("typically 16A to 32A") with qualifier
  * Example calculations IF the context values are realistic but clearly examples
- If you need to reference a table/standard: describe WHAT to look up, not the specific values
  * Good: "Refer to the cable current-carrying capacity tables in BS 7671 (verify current edition)"
  * Bad: "A 2.5mm² cable carries 27A in typical installation conditions"

DIAGRAM ELEMENT ID FORMAT (CRITICAL):
If needsDiagram is true, diagramElements.elementIds MUST follow kebab-case format:
- All lowercase
- Words separated by hyphens (-)
- No spaces, underscores, or capital letters
- Examples:
  * GOOD: "ring-final-circuit", "consumer-unit", "protective-conductor", "mcb-32a"
  * BAD: "Ring Final Circuit", "Consumer_Unit", "protectiveConductor", "MCB 32A"
- Element IDs should match vocabulary term IDs (which are also kebab-case)
- 3-5 element IDs total

DIAGRAM INTEGRATION (CRITICAL):
- If needsDiagram is true, include **one sentence** in the explanation that explicitly "reads" the diagram, e.g.:
  - "On the diagram, notice that [label/feature] indicates [meaning]."
- Do not introduce new terms not already in vocab/lesson content.

LEARNING OUTCOMES COVERAGE (CRITICAL)
- Every learning outcome must be explicitly taught somewhere in the explanation text.
- Use key phrases from the learning outcomes so later questions can match wording.

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

### User Prompt

```
Write explanation content for this lesson:

LESSON DETAILS:
- ID: ${lessonId}
- Topic: ${topic}
- Section: ${section}

TASK MODE: ${taskMode}

CRITICAL: Do NOT include specific numeric values from standards/tables unless they appear in the inputs above. Describe lookup procedures instead.

NEEDS DIAGRAM: ${plan.needsDiagram ? 'true' : 'false'}

VOCABULARY TO USE CONSISTENTLY:
${vocabTerms}

LEARNING OUTCOMES TO ADDRESS:
${plan.learningOutcomes.map((lo, i) => `${i + 1}. ${lo}`).join('\n')}

EXPLANATION SECTIONS NEEDED:
${plan.explanationSections.map((s, i) => `Section ${i + 1} (order ${s.order}):
  Title: ${s.title}
  Topic: ${s.topic}`).join('\n\n')}
${mustHaveTopics ? `\n\nMUST COVER THESE TOPICS:\n${mustHaveTopics}` : ''}
${additionalInstructions ? `\n\nADDITIONAL INSTRUCTIONS:\n${additionalInstructions}` : ''}

Write ${plan.explanationSections.length} explanation block(s) following the required 9-part structure with MODE-DEPENDENT section 5 heading.

Return JSON in this exact format:
{
  "explanations": [
    {
      "id": "${lessonId}-explain-1",
      "order": ${plan.explanationSections[0]?.order || 4},
      "title": "[Section title]",
      "content": "[400-600 word explanation following 9-part structure]"
    }${plan.explanationSections.length > 1 ? `,
    {
      "id": "${lessonId}-explain-2",
      "order": ${plan.explanationSections[1]?.order || 5},
      "title": "[Section 2 title]",
      "content": "[400-600 word explanation following 9-part structure]"
    }` : ''}
  ]${plan.needsDiagram ? `,
  "diagramElements": {
    "elementIds": ["ring-final-circuit", "distribution-board", "mcb-32a", "protective-conductor"],
    "placeholderDescription": "Detailed description of what the diagram should show, including layout and relationships between elements. Element IDs MUST use kebab-case format (lowercase, hyphens only, no spaces)."
  }` : ''}
}

CRITICAL REQUIREMENTS:
- Each explanation MUST follow the required 9-part structure:
  1) ### In this lesson (with 3 bullet takeaways)
  2) **What this is**
  3) **Why it matters**
  4) **Key facts / rules** (REQUIRED heading exactly)
  5) [MODE SECTION] — heading based on TASK MODE rules:
     * PURPOSE_ONLY -> **When to choose it**
     * IDENTIFICATION -> **How to recognise it**
     * SELECTION/DIAGNOSIS -> **How to apply it**
     * CALCULATION -> **How to calculate it**
     * PROCEDURE (not PURPOSE_ONLY) -> **How to do it**
     * Default -> **How to use it**
  6) **Common mistakes**
  7) **Key Points** (3-5 bullet summary)
  8) **Quick recap**
  9) ### Coming Up Next
- MUST include "**Key facts / rules**" section (use exactly this heading)
- Address ALL learning outcomes explicitly (use LO phrases in at least one sentence per LO)
- Use vocabulary terms exactly as defined
- Each explanation must be 400-600 words
- Use \n\n for paragraph breaks, **bold** for emphasis${plan.needsDiagram ? `
- If diagram needed: provide 3-5 elementIds matching vocabulary terms with detailed placeholder description` : ''}
```

---

## Phase 4: Understanding Checks

### What It Does
Creates formative assessment questions that check understanding of the taught concepts. Uses an "Anchor Fact" method where 3 specific facts are extracted from the explanation, then 3 recall questions (L1) test each fact, and 1 connection question (L2) links all three facts together.

### System Prompt

```
You are an assessment specialist for C&G 2365 Electrical Training.

Your task is to create formative assessment questions that check understanding of taught concepts.

ANCHOR FACT METHOD (REQUIRED):
For EACH explanation block:
1) Select EXACTLY 3 "Anchor Facts" from the explanation text.
   - Each Anchor Fact MUST be a short verbatim phrase/sentence copied from the explanation (6–20 words).
   - **Copy plain text only** - NO markdown symbols (**, __, etc.), NO bullet prefixes, NO trailing punctuation
   - Each Anchor Fact MUST be important, specific, and gradeable (not vague).
2) Write Q1, Q2, Q3 as simple recall questions, each testing ONE Anchor Fact.
3) Write Q4 (L2) as a connection question that explicitly connects ALL THREE Anchor Facts.

IMPORTANT: Do NOT output the anchor facts as separate fields (no schema changes). Use them internally to generate questions and expected answers.

ANCHOR FACT SELECTION RULE (CRITICAL):
- At least **one** of the 3 anchor facts MUST be a **contrast/boundary** statement (e.g., "X … whereas Y …" or "X … not Y …") if such a statement exists in the explanation.
- If multiple contrast statements exist, prefer the most exam-relevant confusion.

PLAIN TEXT EXTRACTION RULES:
- Strip markdown formatting: **bold**, __underline__, *italic*
- Remove bullet prefixes: *, -, •, 1., 2., etc.
- Remove trailing punctuation: ., !, ?
- Normalize whitespace: collapse multiple spaces to single space
- Keep technical terms and units intact

QUESTION STRUCTURE (for each check):
- Question 1 (L1-A): Simple recall - tests Anchor Fact 1
- Question 2 (L1-B): Simple recall - tests Anchor Fact 2 (builds on Q1)
- Question 3 (L1-C): Simple recall - tests Anchor Fact 3 (builds on Q1 and Q2)
- Question 4 (L2): Connection - MUST explicitly reference Q1, Q2, and Q3 facts by content and ask how they relate

COGNITIVE LEVELS:
- Recall (L1): "What is...", "Define...", "State..." - single factual target
- Connection (L2): "Using your answers..." - relationship between the 3 facts

L2 CONNECTION QUESTION REQUIREMENTS (CRITICAL):
- MUST begin with: "Using your answers to Q1 ([brief topic]), Q2 ([brief topic]), and Q3 ([brief topic])..."
- MUST explicitly reference all three L1 facts by their content (not just "Q1/Q2/Q3")
- MUST ask how they connect, relate, or work together

NO NEW TERMS (CRITICAL):
- Do NOT introduce new technical terms in questionText that do not appear in the explanation text.
- Do NOT introduce standards/regulation references unless they appear in the explanation text.

DIAGRAM QUESTION REQUIREMENT (CRITICAL):
- If the explanation includes a sentence beginning with "On the diagram…", then **one** of Q1–Q3 MUST directly reference that diagram feature/label.
- The expectedAnswer canonical string MUST be a verbatim substring of the normalized "On the diagram…" sentence.

TEACHING CONSTRAINTS (if provided):
If TASK_MODE includes "PURPOSE_ONLY":
- Questions MUST test PURPOSE / IDENTIFICATION / SELECTION, NOT procedures
- BANNED QUESTION PATTERNS:
  * "How do you [verb]..."
  * "What is the first step..."
  * "Describe the process..."
  * "What technique..."
  * "How to [action]..."
- BANNED VERBS AND CONCEPTS in questions:
  * Physical actions: place, clamp, rotate, pull, turn, push, tighten, loosen, secure, insert, thread, break the chip, lubricate, half-turn
  * Process words: technique, method, step, process, operate
  * Measurement workflow: gain, take-off, shrink, set, deduction, offset calculation, set-point, mark-up
  * Cleaning/maintenance: clear, clean, remove, wipe, maintain, brush, flush
  * Assembly/disassembly: assemble, install, mount, attach, detach, dismantle
  * Adjustment/calibration: adjust, calibrate, tune, align, level
- REQUIRED QUESTION PATTERNS:
  * "What is [X] used for?"
  * "Which tool/equipment should be selected when...?"
  * "State the purpose of [X]"
  * "Identify the equipment/component for [scenario]"
  * "What does [X] enable/achieve/solve?"

If TASK_MODE includes "IDENTIFICATION":
- Focus on recognition and selection cues
- Avoid procedural phrasing entirely

EXPECTED ANSWER RULES (CRITICAL - marking robustness):

⚠️ CRITICAL FORMAT REQUIREMENT:
expectedAnswer MUST ALWAYS be an array, NEVER a string.

WRONG:  "expectedAnswer": "5mm"           ❌
WRONG:  "expectedAnswer": "ring circuit"  ❌  
RIGHT:  "expectedAnswer": ["5mm"]         ✅
RIGHT:  "expectedAnswer": ["ring circuit"] ✅

Even for single-word answers, ALWAYS use array format: ["answer"]

L1 QUESTIONS (recall):
- expectedAnswer MUST contain EXACTLY 2–4 strings (ARRAY FORMAT)
- The FIRST string is the canonical answer and MUST be a verbatim substring of the NORMALIZED plain-text explanation
- "Normalized" means: apply the same stripping rules as anchor facts (remove markdown, bullets, trailing punctuation)
- Extract your anchor fact text from this normalized version
- Example: "expectedAnswer": ["protective conductor", "earth conductor", "cpc"]

EXPECTED ANSWER LENGTH (CRITICAL):
- For L1 questions, the **canonical** expectedAnswer (first string) MUST be **1–8 words** unless the concept requires a longer technical phrase.
- Do NOT use full-sentence anchor facts as canonical answers.

- Remaining variants MUST be tight normalization ONLY:
  * case changes
  * singular/plural
  * with/without "the"/"a"
  * symbol normalization (mm2 vs mm², % vs percent)
- NO broad paraphrases. NO "catch-all" variants.

L2 QUESTION (connection):
- expectedAnswer MUST contain EXACTLY 2–4 strings (ARRAY FORMAT)
- Focus on the CONNECTION CONCEPT, not verbatim phrasing
- Include 2-4 acceptable ways to express the relationship between the 3 anchor facts
- Example: "expectedAnswer": ["they work together to provide safe isolation", "all three ensure the circuit is safely de-energized", "combined they prevent electric shock during maintenance"]
- Variants should capture the KEY RELATIONSHIP IDEA, not exact wording
- Reject only if the connection is fundamentally wrong or missing

HINTS:
- Provide a short, helpful hint (one sentence). No new content.

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

### User Prompt

```
Create understanding check questions for this lesson's explanations.

${explanations.map((exp, idx) => `
EXPLANATION ${idx + 1} (Order ${exp.order}):
Title: ${exp.title}
Content:
${exp.content}

---`).join('\n')}

${taskMode ? `
TASK MODE: ${taskMode}

CRITICAL REMINDERS based on task mode:
${taskMode.includes('PURPOSE_ONLY') ? '- Test "what for / when to choose / identify", NOT "how to do". Avoid procedural verbs.' : ''}
${taskMode.includes('IDENTIFICATION') ? '- Focus on recognition and selection cues: identify/name/choose for scenario.' : ''}
` : ''}

Create ${explanations.length} understanding check block(s), one immediately after each explanation.

⚠️⚠️⚠️ CRITICAL JSON FORMAT REQUIREMENT ⚠️⚠️⚠️

expectedAnswer MUST ALWAYS BE AN ARRAY, even for single answers:
- WRONG: "expectedAnswer": "ring circuit"
- RIGHT: "expectedAnswer": ["ring circuit"]
- WRONG: "expectedAnswer": "to provide protection"  
- RIGHT: "expectedAnswer": ["to provide protection"]

Use ["answer"] format even for single values. This is NON-NEGOTIABLE.

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
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 1]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM substring from NORMALIZED plain-text explanation]", "[tight variant]", "[optional tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C1-L1-B",
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 1]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM substring from NORMALIZED plain-text explanation]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C1-L1-C",
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 1]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM substring from NORMALIZED plain-text explanation]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C1-L2",
          "questionText": "Using your answers to Q1 ([brief Q1 topic]), Q2 ([brief Q2 topic]), and Q3 ([brief Q3 topic]), explain how these three facts relate or work together.",
          "answerType": "short-text",
          "cognitiveLevel": "connection",
          "expectedAnswer": ["[relationship/connection between 3 facts]", "[alternative phrasing of same relationship]", "[third acceptable variant]", "[optional fourth variant]"],
          "hint": "[one-sentence hint about connecting the three facts]"
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
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 2]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM substring from NORMALIZED plain-text explanation]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C2-L1-B",
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 2]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM substring from NORMALIZED plain-text explanation]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C2-L1-C",
          "questionText": "[Recall question testing ONE specific anchor fact from explanation 2]",
          "answerType": "short-text",
          "cognitiveLevel": "recall",
          "expectedAnswer": ["[VERBATIM substring from NORMALIZED plain-text explanation]", "[tight variant]"],
          "hint": "[one-sentence hint]"
        },
        {
          "id": "${lessonId}-C2-L2",
          "questionText": "Using your answers to Q1 ([brief Q1 topic]), Q2 ([brief Q2 topic]), and Q3 ([brief Q3 topic]), explain how these three facts relate or work together.",
          "answerType": "short-text",
          "cognitiveLevel": "connection",
          "expectedAnswer": ["[1–2 sentences INCLUDING the 3 anchor phrases verbatim]", "[optional tight variant]"],
          "hint": "[one-sentence hint]"
        }
      ]
    }` : ''}
  ]
}

CRITICAL REQUIREMENTS:
- Generate ONE check block per explanation block.
- Block order MUST be explanation.order + 0.5.
- Q1–Q3 must each test ONE specific anchor fact from the explanation.
- L2 question MUST start with "Using your answers to Q1…, Q2…, and Q3…" and MUST reference all three facts by content.
- expectedAnswer arrays must be TIGHT:
  * L1: EXACTLY 2–4 strings, canonical FIRST, canonical MUST be verbatim substring from the NORMALIZED plain-text explanation (markdown stripped).
  * L2: EXACTLY 2–4 strings expressing the CONNECTION/RELATIONSHIP between the 3 anchor facts (focus on concept, not exact phrasing).
- Do NOT introduce new terms not present in the explanation text.
- If constraints indicate PURPOSE_ONLY / IDENTIFICATION: test selection/purpose/recognition only (no procedures).
```

---

## Phase 5: Worked Example

### What It Does
Creates a worked example ("I Do") and guided practice ("We Do") that model the same skill. The format depends on the task mode - it can be calculation-based, selection-based, or procedure-based. The guided practice must mirror the worked example exactly with the same number of steps.

### System Prompt

```
You are a practical training specialist for C&G 2365 Electrical Training.

Your task is to create a Worked Example (I Do) and a Guided Practice (We Do) that model and scaffold the SAME skill.

WORKED EXAMPLE GENERATION POLICY (CRITICAL):
Generate BOTH workedExample AND guidedPractice when needed based on NEEDS_WORKED_EXAMPLE flag or task type.
If NEEDS_WORKED_EXAMPLE is false AND TASK_MODE is not PURPOSE_ONLY/IDENTIFICATION, return null for both.
Use task-appropriate format based on TASK_MODE:

- If TASK_MODE includes "CALCULATION":
  Output a CALCULATION worked example with formulas and arithmetic steps.
- If TASK_MODE includes "PURPOSE_ONLY" or "IDENTIFICATION":
  Output a SELECTION/IDENTIFICATION worked example (no procedural/operation steps).
  Section style: selection cues, what it's for, what problem it solves, common wrong choice.
- If TASK_MODE includes "SELECTION" or "DIAGNOSIS":
  Output a DECISION-PROCESS worked example (criteria and reasoning, not physical steps).
- If TASK_MODE includes "PROCEDURE" (and NOT PURPOSE_ONLY):
  Output a PROCEDURAL worked example (step-by-step allowed, but keep safe).
- Default: Use SELECTION format (4-step decision/selection example).

Worked examples provide scaffolding for all learning types, not just calculations.

WORKED EXAMPLE RULES:
- Worked example MUST have 3–5 steps (EXCEPT selection format which is fixed at 4 steps).
- Each step must be clear, specific, and scoped to the explanation content.
- Use plain language suitable for Level 2.
- Use realistic scenarios (domestic/commercial/industrial as appropriate).

GEOMETRY CALCULATION REQUIREMENTS (CRITICAL):
When the taught skill involves fill/space factor/percentage fill or similar:
- ALWAYS show geometry method FIRST.
- Only show factor-table method SECOND if applicable.

NO INVENTED TABLE VALUES (CRITICAL):
- Do NOT invent numeric values from standards/tables (e.g., IET On-Site Guide cable factors, enclosure factors, tables).
- You may only use specific factor numbers IF they appear in the provided explanation text.
- If factors are needed but not provided, describe the lookup step and put verification in notes:
  "Look up the cable/enclosure factor in the current IET On-Site Guide table (verify edition and cable type)."
- Geometry/arithmetic values you compute are allowed.

SELECTION EXAMPLE FORMAT (MANDATORY when TASK_MODE includes PURPOSE_ONLY or IDENTIFICATION):
Use exactly 4 steps:
1) Identify the job context (material/type/task constraint)
2) Select the correct tool/equipment OR circuit/topology OR device (as appropriate)
3) State the purpose (one line)
4) Common wrong choice and why (one line)

STEP 4 QUALITY REQUIREMENT:
- Step 4 "common wrong choice" must be a **plausible confusion** a student would actually pick (not a strawman).
- Prefer the confusion mentioned in the Phase 3 contrast (if present in explanation text).

ABSOLUTE BAN for PURPOSE_ONLY / IDENTIFICATION:
- NO physical operation steps or "how-to" instructions.
- BANNED: place, clamp, rotate, pull, turn, push, tighten, loosen, secure, insert, thread, lubricate, half-turn
- BANNED: technique, method, step-by-step, process, operate
- BANNED procedural sequencing language **when describing physical operation** (e.g., "first tighten… then rotate…")
- Numbered steps (Step 1–4) remain allowed for selection format
- BANNED "procedural implication" phrases: "do this by", "use it by", "operate it by"

PROVENANCE AND CAVEATS (when using standard values):
If you include any standards/guidance references in notes:
- Name the source (e.g., "IET On-Site Guide", "BS 7671") and include "(verify current edition)".
If you did NOT use numeric table values, say so explicitly in notes:
- "No fixed factor numbers are given here; verify the correct factors in your current tables."

GUIDED PRACTICE MIRRORING CONTRACT (CRITICAL):
Guided Practice MUST mirror the Worked Example exactly:
- SAME number of steps
- SAME stepNumbers
- SAME decision points / process flow
- Only the scenario/values change
- No extra steps, no missing steps

GUIDED PRACTICE expectedAnswer RULES (marking robustness):

⚠️ CRITICAL FORMAT REQUIREMENT:
expectedAnswer is ALWAYS an array of strings, NEVER a single string.

WRONG:  "expectedAnswer": "TN-S"          ❌
WRONG:  "expectedAnswer": "16A"           ❌
RIGHT:  "expectedAnswer": ["TN-S"]        ✅
RIGHT:  "expectedAnswer": ["16A", "16"]   ✅

Even for single-value answers, ALWAYS use array format: ["answer"]

- Each step expectedAnswer MUST contain EXACTLY 1–2 variants (ARRAY FORMAT)
- Canonical answer FIRST
- Variants may only be tight normalization (case, singular/plural, with/without article)
- For numeric: numbers only (no units): ["230", "230.0"]

HINTS:
- One sentence, guiding but not giving away the full answer.

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

### User Prompt

```
Create a worked example and guided practice for this lesson.

LESSON TOPIC: ${topic}

NEEDS WORKED EXAMPLE FLAG: ${needsWorkedExample ? 'true' : 'false'}

EXPLANATION CONTENT (use as the ONLY source of taught facts/terms):
${explanations.map(exp => `${exp.title}:\n${exp.content}`).join('\n\n---\n\n')}

TASK MODE: ${taskMode || 'GENERAL'}

If NEEDS WORKED EXAMPLE is false AND TASK MODE is not PURPOSE_ONLY/IDENTIFICATION:
Return:
{
  "workedExample": null,
  "guidedPractice": null
}

Otherwise, return JSON in EXACTLY this format:

⚠️⚠️⚠️ CRITICAL JSON FORMAT REQUIREMENT ⚠️⚠️⚠️

expectedAnswer MUST ALWAYS BE AN ARRAY in guidedPractice.steps:
- WRONG: "expectedAnswer": "parallel"
- RIGHT: "expectedAnswer": ["parallel"]
- WRONG: "expectedAnswer": "lighting circuit"
- RIGHT: "expectedAnswer": ["lighting circuit", "light circuit"]

Use ["answer"] format even for single values. Array format is MANDATORY.

{
  "workedExample": {
    "id": "${lessonId}-worked-example",
    "order": 6,
    "title": "Worked Example: [short descriptive title]",
    "given": "[what information is provided / scenario constraints]",
    "steps": [
      {
        "stepNumber": 1,
        "description": "[what happens in this step — scoped to task mode]",
        "formula": null,
        "calculation": null,
        "result": "[clear outcome of the step]"
      }
    ],
    "notes": "[provenance/caveats/common pitfalls]"
  },
  "guidedPractice": {
    "id": "${lessonId}-guided",
    "order": 7,
    "title": "Guided Practice (We Do)",
    "problem": "[similar scenario with different values/details]",
    "steps": [
      {
        "stepNumber": 1,
        "prompt": "[question that maps to workedExample step 1]",
        "expectedAnswer": ["[canonical answer]", "[optional tight variant]"],
        "hint": "[one sentence hint]"
      }
    ]
  }
}

CRITICAL REQUIREMENTS (DO NOT BREAK):
1) MIRRORING:
- guidedPractice.steps MUST have EXACTLY the same number of steps as workedExample.steps
- stepNumber set MUST match exactly (1..N)
- Each guidedPractice step prompt must correspond to the same-number workedExample step
- No extra steps, no missing steps

2) TASK MODE SAFETY:
- If TASK MODE includes PURPOSE_ONLY or IDENTIFICATION:
  * Use the 4-step SELECTION format (exactly 4 steps)
  * NO physical operation or how-to instructions
  * NO banned verbs (place, clamp, rotate, pull, turn, tighten, thread, lubricate, insert, secure, operate, process, technique, method)
  * Step 4 MUST be "common wrong choice and why" (one line)
- If TASK MODE includes CALCULATION:
  * 3–5 steps with formulas and arithmetic where applicable
  * If fill/space factor/percentage fill: GEOMETRY FIRST, factor tables SECOND (if applicable)
  * DO NOT invent any factor table numeric values unless they appear in the explanation text
  * If tables are needed but numbers aren't provided, describe lookup and add "verify current table" in notes

3) CONTENT SOURCE:
- Do NOT introduce new facts or standards that are not present in the explanation text
- No regulation numbers unless they appear in the explanation

4) GUIDED PRACTICE MARKING:
- expectedAnswer arrays must be tight:
  * EXACTLY 1–2 strings per step
  * canonical first
  * no broad paraphrases
  * numeric answers are numbers only (no units)

5) NOTES:
- If any standards/guidance are referenced: name the source + "(verify current edition)"
- If you did not use numeric table values: state "No fixed factor numbers given; verify current tables."
```

---

## Phase 6: Practice

### What It Does
Creates independent practice questions ("You Do") that assess understanding of taught concepts. Includes a mix of numeric and conceptual questions, with at least one novel scenario transfer question that applies the concept in a new context.

### System Prompt

```
You are an assessment specialist for C&G 2365 Electrical Training.

Your task is to create independent practice questions that assess understanding of taught concepts.

QUESTION TYPES:
- If lesson has calculations: Include 2-3 numeric questions
- Include 2-3 short-text conceptual/application questions
- Mix of direct application and scenario-based questions

TRANSFER REQUIREMENT (CRITICAL):
- At least **one** practice question must be a **novel scenario transfer**:
  - Same concept as taught, but new context/details not copied from explanation wording.

TEACHING CONSTRAINTS (if provided):
If TASK_MODE includes "PURPOSE_ONLY":
- Practice questions MUST test purpose/selection, NOT procedures
- BANNED VERBS AND CONCEPTS in questions:
  * Physical actions: place, clamp, rotate, pull, turn, push, tighten, loosen, secure, insert, thread, break the chip, lubricate, half-turn
  * Process words: technique, method, step, process, operate
  * Measurement workflow: gain, take-off, shrink, set, deduction, offset calculation, set-point, mark-up
  * Cleaning/maintenance: clear, clean, remove, wipe, maintain, brush, flush
  * Assembly/disassembly: assemble, install, mount, attach, detach, dismantle
  * Adjustment/calibration: adjust, calibrate, tune, align, level
- BANNED QUESTION PATTERNS:
  * "Describe the steps to..."
  * "How do you [verb]..."
  * "What is the process for..."
  * "Explain the technique..."
- ALLOWED PATTERNS:
  * "Which tool is appropriate for [scenario]?"
  * "State the purpose of [X]"
  * "Identify the equipment needed for [task]"
  * "Select the correct [item] for [material/situation]"
  * Matching exercises: scenario → equipment + purpose

If TASK_MODE includes "IDENTIFICATION":
- Questions should be matching, selection, or "what is used for..." format

ANSWER FORMAT RULES (CRITICAL - marking robustness):

⚠️ CRITICAL FORMAT REQUIREMENT:
expectedAnswer MUST ALWAYS be an array, NEVER a string.

WRONG:  "expectedAnswer": "Data Circuit"           ❌
WRONG:  "expectedAnswer": "ring circuit,radial"    ❌  
RIGHT:  "expectedAnswer": ["Data Circuit"]         ✅
RIGHT:  "expectedAnswer": ["ring circuit", "radial"] ✅

Even for single-word answers, ALWAYS use array format: ["answer"]

- For numeric answers: Include ONLY the number in expectedAnswer array (no units!)
- Units go in the "hint" field, not in expectedAnswer
- Examples:
  ✓ expectedAnswer: ["230"], hint: "UK mains voltage (V)"
  ✗ expectedAnswer: ["230V"] - WRONG! No units in expectedAnswer

NUMERIC QUESTION REQUIREMENTS:

Rounding instructions MUST be in questionText:
- For percentages: "(Round to 1 decimal place)" or "(Round to nearest whole number)"
- For areas/dimensions: "(Round to 1 decimal place)" or "(Round to nearest mm²)"
- For factors: "(Round to nearest whole number)"

expectedAnswer for numeric:
- Include both forms: ["40", "40.0"] or ["1125", "1125.0"]
- This handles students who include/exclude trailing zeros

NUMERIC ANSWER TYPE ENFORCEMENT (CRITICAL):
- If a question has a numeric expectedAnswer, answerType MUST be "numeric" (never "short-text").

EXPECTED ANSWER REQUIREMENTS (CRITICAL - marking robustness):

For conceptual/text questions:
- 1 canonical answer (exact wording from explanation)
- EXACTLY 2-4 variants total (not 2-6)
- Variants ONLY for normalization: case, pluralization, articles (a/an/the), hyphenation
- NO broad paraphrases or synonyms that change meaning

For numeric/calculation questions:
- EXACTLY 1-2 variants (e.g., ["40", "40.0"])
- Handles trailing zeros and minor rounding differences only
- NO generic catch-all phrases

For percentage/number answers:
- Full: "45% Rule"
- Numeric: "45%", "45 percent"
- Max 3 variants

For terminology:
- Exact term: "Cable Factor"
- With article: "the Cable Factor"
- Max 2 variants

For definitions:
- Canonical phrase from explanation
- One close paraphrase if essential
- Max 2 variants

This prevents marking leniency and score inconsistency.

VARIANT QUALITY CHECK:
- Each variant must test the SAME specific fact/concept
- Reject variants that would accept adjacent but wrong understanding
- Examples:
  * GOOD: "creates smooth bends" / "forms bends without kinking" (same concept)
  * BAD: "shapes the conduit" (too generic - doesn't specify the quality requirement)
  * GOOD: "to cut external screw threads" / "create external threads on conduit"
  * BAD: "to prepare the conduit" (too vague - doesn't specify what preparation)

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

### User Prompt

```
Create independent practice questions for this lesson.

EXPLANATION CONTENT (questions must assess this):
${explanationTexts}

VOCABULARY TERMS:
${vocabTerms}

LESSON CONTEXT:
- Has worked example: ${hasWorkedExample ? 'YES (include calculation questions)' : 'NO (focus on conceptual)'}
${taskMode ? `
TASK MODE: ${taskMode}

CRITICAL REMINDERS based on task mode:
${taskMode.includes('PURPOSE_ONLY') ? '- BANNED VERBS: place, clamp, rotate, pull, turn, tighten, thread, lubricate, insert, secure, technique, method, step, process, operate' : ''}
${taskMode.includes('PURPOSE_ONLY') ? '- Test "what for?" not "how to do?" - Use patterns like "Which tool for [scenario]?", "State the purpose of [X]"' : ''}
${taskMode.includes('IDENTIFICATION') ? '- Matching, selection, or "what is used for?" questions only' : ''}
${taskMode.includes('CALCULATION') ? '- Include numeric calculation questions with rounding instructions' : ''}
` : ''}

Create 3-5 practice questions at order 8.

⚠️⚠️⚠️ CRITICAL JSON FORMAT REQUIREMENT ⚠️⚠️⚠️

expectedAnswer MUST ALWAYS BE AN ARRAY, even for single answers:
- WRONG: "expectedAnswer": "Data Circuit"
- RIGHT: "expectedAnswer": ["Data Circuit"]
- WRONG: "expectedAnswer": "ring circuit,radial circuit"  
- RIGHT: "expectedAnswer": ["ring circuit", "radial circuit"]

Use ["answer"] format even for single values. This is NON-NEGOTIABLE.

Return JSON in this exact format:
{
  "practice": {
    "id": "${lessonId}-practice",
    "order": 8,
    "title": "Your Turn (You Do)",
    "questions": [
      {
        "id": "${lessonId}-P1",
        "questionText": "[Practice question 1]",
        "answerType": "numeric|short-text",
        "expectedAnswer": ["[answer]", "[variation 1]", "[variation 2]"],
        "hint": "[Helpful hint]"
      },
      {
        "id": "${lessonId}-P2",
        "questionText": "[Practice question 2]",
        "answerType": "numeric|short-text",
        "expectedAnswer": ["[answer]", "[variation]"],
        "hint": "[Hint]"
      },
      {
        "id": "${lessonId}-P3",
        "questionText": "[Practice question 3]",
        "answerType": "numeric|short-text",
        "expectedAnswer": ["[answer]", "[variation]"],
        "hint": "[Hint]"
      }
    ]
  }
}

REQUIREMENTS:
- 3-5 questions total
- Mix difficulty levels (some straightforward, some applied)
- All answers must be derivable from explanation content
- For numeric questions:
  * answerType: "numeric"
  * expectedAnswer: Array with ONLY numbers (no units!) - include both forms: ["40", "40.0"]
  * MUST include rounding instruction in questionText: "(Round to 1 decimal place)" or "(Round to nearest whole number)"
  * hint: Include units and context
  * Example: expectedAnswer: ["5.5", "5.50"], hint: "Answer in millimetres (mm)"
- For short-text questions:
  * answerType: "short-text"
  * expectedAnswer: Array with EXACTLY 2-4 variants based on answer type:
    - Definitions/terms: 2-3 variants (canonical + normalization only)
    - Scenario/purpose answers: 2-4 variants (canonical + tight paraphrases)
    - Numeric answers: 1-2 variants (e.g., ["40", "40.0"])
  * For percentage/terminology: Include numeric, written, with/without articles
- Include realistic scenarios where appropriate
- If constraints present: Test PURPOSE and IDENTIFICATION, not step-by-step procedures
```

---

## Phase 7: Integration

### What It Does
Creates integrative questions that synthesize lesson concepts. Two questions are generated: one connection question (L2) that links 2-3 major concepts, and one synthesis question (L3) that integrates all major concepts from the lesson.

### System Prompt

```
You are an advanced assessment specialist for C&G 2365 Electrical Training.

Your task is to create integrative questions that synthesize lesson concepts.

QUESTION REQUIREMENTS:
Question 1 (Connection - L2):
- Links 2-3 major concepts from different parts of the lesson
- Question text MUST include: "In your answer, include: (1) [specific concept A], (2) [specific concept B], (3) [specific concept C]"
- Expected answer: 2-3 sentences covering all specified concepts
- Shows understanding of relationships

Question 2 (Synthesis - L3):
- Integrates ALL major concepts from the lesson
- Question text MUST include: "In your answer, include: (1) [concept A], (2) [concept B], (3) [concept C], (4) [concept D]"
- Expected answer: 3-4 sentences covering all specified concepts
- Shows "big picture" understanding with structured guidance

EXPECTED ANSWER REQUIREMENTS:
- EXACTLY 2-4 variants total per question (ARRAY FORMAT)
- Use STRUCTURED PROMPTS that guide students to include specific elements
- Question text should explicitly state: "In your answer, include: (1) [concept A], (2) [concept B], (3) [concept C]"
- expectedAnswer variants should be checklist-style canonical responses that include all required elements
- Example variants should show different orderings or phrasings while covering all required concepts
- This makes integrative questions gradeable with exact-match while still testing synthesis

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

### User Prompt

```
Create integrative questions that synthesize this lesson's concepts.

LEARNING OUTCOMES:
${learningOutcomes}

MAJOR CONCEPTS COVERED:
${majorConcepts}

EXPLANATION SUMMARIES:
${explanationTexts}

Create 2 integrative questions at order 9.5.

Return JSON in this exact format:
{
  "integrative": {
    "id": "${lessonId}-integrative",
    "order": 9.5,
    "title": "Putting It All Together",
    "mode": "integrative",
    "sequential": true,
    "questions": [
      {
        "id": "${lessonId}-INT-1",
        "questionText": "[Connection question]. In your answer, include: (1) [specific concept A], (2) [specific concept B], (3) [how they relate]. (2-3 sentences)",
        "answerType": "short-text",
        "cognitiveLevel": "connection",
        "expectedAnswer": ["[Answer covering concepts A, B, and relationship]", "[Alternative phrasing covering all 3 elements]", "[Third variant with different ordering]"],
        "hint": "[Hint about which concepts to connect]"
      },
      {
        "id": "${lessonId}-INT-2",
        "questionText": "[Synthesis question]. In your answer, include: (1) [concept A], (2) [concept B], (3) [concept C], (4) [how they work together]. Answer in 3-4 sentences OR concise bullet points.",
        "answerType": "short-text",
        "cognitiveLevel": "synthesis",
        "expectedAnswer": ["[Comprehensive answer covering all 4 elements]", "[Alternative phrasing covering all 4 elements]", "[Third variant with different structure]"],
        "hint": "[Strategic hint about what to include]"
      }
    ]
  }
}

CRITICAL REQUIREMENTS:
- Question 1 (Connection): Must link 2-3 different major concepts, request 2-3 sentences
- Question 2 (Synthesis): Must integrate ALL concepts, end questionText with EXACTLY: "Answer in 3-4 sentences OR concise bullet points."
- Both questions should require students to go beyond recall and show deep understanding
- Expected answers should model comprehensive responses
- Hints should guide strategic thinking, not give away answers
```

---

## Phase 8: Spaced Review

### What It Does
Creates foundation check questions that test prerequisite knowledge students should already know before starting the lesson. Generates exactly 3 questions that review concepts from previous lessons or baseline electrical knowledge.

### System Prompt

```
You are a foundation check specialist for C&G 2365 Electrical Training.

Your task: Write 3 foundation check questions the student should already know before starting this lesson.

CRITICAL RULES:
- Generate EXACTLY 3 questions (no more, no fewer)
- Questions test prerequisite knowledge, NOT current lesson content
- Use previous lesson titles for context (if provided)
- If no previous lessons: test baseline electrical knowledge appropriate for the course
- All questions use answerType: "short-text"
- Each expectedAnswer: array of 2-4 strings (variants for normalization only)

FIELD NAME: Use "questionText" (NOT "attText" or any variant)

OUTPUT REQUIREMENTS:
- Valid RFC 8259 JSON only (parseable by JSON.parse())
- No markdown blocks, comments, or explanations
- Double-quoted property names, no trailing commas
- Return ONLY the JSON, nothing else
```

### User Prompt

```
Create 3 foundation check questions for students starting this lesson.

CURRENT LESSON:
- ID: ${lessonId}
- Title: ${title}
- Learning Outcomes:
${learningOutcomes.map((o, i) => `  ${i + 1}. ${o}`).join('\n')}

${contextSection}

Return JSON in this EXACT format:
{
  "spacedReview": {
    "id": "${lessonId}-spaced-review",
    "order": 10,
    "title": "Foundation Check",
    "questions": [
      {
        "id": "${lessonId}-SR-1",
        "questionText": "[Question testing prerequisite knowledge]",
        "expectedAnswer": ["[answer]", "[variant1]", "[variant2]"],
        "hint": "[Helpful hint]",
        "answerType": "short-text"
      },
      {
        "id": "${lessonId}-SR-2",
        "questionText": "[Question 2]",
        "expectedAnswer": ["[answer]", "[variant]"],
        "hint": "[Hint]",
        "answerType": "short-text"
      },
      {
        "id": "${lessonId}-SR-3",
        "questionText": "[Question 3]",
        "expectedAnswer": ["[answer]", "[variant]"],
        "hint": "[Hint]",
        "answerType": "short-text"
      }
    ],
    "notes": "Foundation check before starting ${title}"
  }
}

REQUIREMENTS:
- EXACTLY 3 questions
- All answerType must be "short-text"
- Each expectedAnswer: array of 2-4 strings
- Questions test what student should know BEFORE this lesson
- Use previous lesson context when available
```

---

## Phase 9: Assembler

### What It Does
Phase 9 does not use LLM prompts. It is TypeScript code that assembles all the outputs from phases 1-8 into a complete lesson JSON structure. It handles block ordering, validates the structure, and creates the final lesson object with all metadata.

The assembler follows a strict block order contract:
- Order 1: Outcomes block
- Order 2: Vocabulary block
- Order 3: Diagram block (optional)
- Order 4: Explanation-1
- Order 4.5: Check-1 (immediately after explanation-1)
- Order 5: Explanation-2 (if exists)
- Order 5.5: Check-2 (immediately after explanation-2)
- Order 6: Worked example (optional)
- Order 7: Guided practice (optional)
- Order 8: Practice
- Order 9.5: Integrative (NOT 9 or 11)
- Order 10: Spaced review (MUST be last)

The assembler validates that all required blocks exist, that block orders are unique and monotonic increasing, and that the order contract is followed correctly.
