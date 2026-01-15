# Architecture & Implementation Answers

## A) Stack + Runtime Shape

**What's the stack: Next.js/React? Something else?**
- **Stack**: Next.js 15.5.6 with React 19.1.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **AI**: Google Gemini API (@google/generative-ai v0.24.1)

**Where does the tutor run (server route, edge, client)?**
- **Tutor runs on**: Server-side API route (`/api/tutor/route.ts`)
- **Runtime**: Next.js server route (Node.js runtime)
- **Not edge**: Standard server route, not edge runtime
- **Client-side**: TutorPanel component manages UI state and makes fetch calls to `/api/tutor`

**Where is course content stored: MD/MDX, database tables, JSON, CMS?**
- **Storage**: JSON files in `src/data/lessons/`
- **Format**: Structured JSON with TypeScript types (`Lesson` interface)
- **Examples**: `202-4A-series-circuits.json`, `202-4B-series-circuits-extended.json`
- **No database**: Currently file-based, no database tables
- **No CMS**: Static JSON files, no CMS integration
- **Question banks**: TypeScript files (`seriesCircuitsQuestions.ts`, `scienceQuestions.ts`, etc.)

**What's the deployment target (Vercel, self-host, Cloudflare, etc.)?**
- **Deployment**: Vercel (confirmed by `vercel.json`)
- **Region**: `lhr1` (London)
- **Build**: `npm run build` → `.next` output directory
- **Framework**: Next.js (detected by Vercel)

**Is the tutor streamed (SSE/WebSockets) or simple request/response?**
- **Communication**: Simple request/response (HTTP POST)
- **No streaming**: Uses `chat.sendMessage()` → waits for complete response
- **No SSE/WebSockets**: Standard fetch API calls from client
- **Response format**: JSON with complete `response` text field

---

## B) Content Model (Single Source of Truth)

**What is the canonical content unit: Module → Lesson → Page → Blocks?**
- **Hierarchy**: Lesson → Blocks (no Module/Page abstraction)
- **Canonical unit**: **Block** (with stable IDs)
- **Lesson structure**: `Lesson` contains array of `Block[]`
- **Block ID format**: `"lessonId-blockId"` (e.g., `"202-4A-outcomes"`, `"202-4A-explain-rules"`)

**Do blocks have stable IDs like your HTML examples (202-4A-explain-rules, etc.)?**
- **Yes**: Blocks have stable IDs in format `"lessonId-blockType"` or `"lessonId-descriptiveId"`
- **Examples from code**: `"202-4A-outcomes"`, `"202-4A-vocab"`, `"202-4A-diagram"`, `"202-4A-explain-rules"`, `"202-4A-worked-example"`, `"202-4A-guided"`, `"202-4A-practice"`, `"202-4A-spaced-review"`

**How do you represent:**
- **outcomes**: `OutcomesBlockContent` with `outcomes[]` array, each with `text` and `bloomLevel`
- **vocab**: `VocabBlockContent` with `terms[]` array, each with `term` and `definition`
- **explanations**: `ExplanationBlockContent` with `title`, `content` (markdown), optional `subsections[]`
- **worked examples**: `WorkedExampleBlockContent` with `title`, `given`, `steps[]` (stepNumber, description, formula, calculation, result), optional `notes`
- **practice items**: `PracticeBlockContent` with `title`, `questions[]` array (id, questionText, answerType, expectedAnswer, options, hint)
- **spaced review items**: `SpacedReviewBlockContent` with `title`, `questions[]` (string array), optional `notes`

**Are practice items authored as structured objects (answer type, marking rules, misconception tags), or free text?**
- **Structured objects**: Practice questions are fully structured
- **Fields**: `id`, `questionText`, `answerType` ('short-text' | 'numeric' | 'mcq'), `expectedAnswer` (string | string[]), `options?`, `correctOptionIndex?`, `hint?`
- **Marking rules**: Defined in `AnswerValidationConfig` (tolerance, unitsRequired, requiredKeywords, etc.)
- **Misconception tags**: Not directly on practice items, but misconception codes exist in question bank (`TaggedQuestion` has `misconceptionCodes` map)

**How do you map content to learning outcomes (e.g., 202-4A-LO1)?**
- **Lesson level**: `Lesson.learningOutcomes` is string array (e.g., `["State the three series rules...", "Explain why current..."]`)
- **Question level**: `TaggedQuestion.learningOutcomeId` field (format: `"lessonId-LOX"`)
- **Block level**: Outcomes blocks contain structured outcomes with Bloom levels, but no explicit LO IDs
- **Mapping**: Questions reference learning outcomes via `learningOutcomeId`, but blocks don't have explicit LO mapping

---

## C) Layout System (A/B/C) — Selection + Rendering

**How does a page choose layout A/B/C — frontmatter field, route convention, database column?**
- **Selection**: `Lesson.layout` field in JSON (type: `'split-vis' | 'linear-flow' | 'focus-mode'`)
- **Rendering**: `page.tsx` reads `lesson.layout` and selects component:
  ```typescript
  const LayoutComponent = lesson.layout === 'split-vis' ? LayoutA : LayoutB;
  ```
- **Layout C**: Used for quiz/assessment pages (separate component, not selected by lesson.layout)
- **No frontmatter**: JSON field, not frontmatter
- **No database**: File-based, no database column

**Is layout rendering purely UI (same content blocks, different shell), or do you author different content per layout?**
- **Same content blocks**: All layouts render the same `lesson.blocks` array
- **Different shell**: Layouts differ in UI structure:
  - **Layout A**: Split-vis (diagram left, content right)
  - **Layout B**: Linear flow (single column, floating tutor button)
  - **Layout C**: Focus mode (quiz interface, no tutor)
- **Content agnostic**: Blocks are rendered by type, layout only affects positioning/UI

**For Layout A: what is the diagram surface right now?**
- **Current state**: Placeholder with text description
- **Implementation**: `DiagramStage` component shows:
  - YouTube video embed (if `videoUrl` provided)
  - OR placeholder div with `placeholderText` and element ID badges
- **Element IDs**: Displayed as badges (e.g., "R1", "R2", "loop")
- **Not interactive SVG**: Placeholder text says "Future: Interactive SVG diagram will be implemented here"
- **Controls**: Has `controls[]` array for highlight/focus actions, but diagram itself is not interactive

**How do elements get IDs (R1, loop, etc.)?**
- **Source**: `DiagramBlockContent.elementIds` array (e.g., `["R1", "R2", "loop", "supply", "wire"]`)
- **Authored**: Defined in lesson JSON under diagram block's `content.elementIds`
- **Usage**: Used for highlighting/referencing, displayed as badges in placeholder

**For Layout B: does the tutor bottom-sheet actually exist? or placeholder only?**
- **Exists**: Fully implemented bottom sheet
- **Implementation**: `LayoutB.tsx` has:
  - Floating button (bottom-right)
  - Backdrop overlay
  - Bottom sheet div (70vh height, slides up)
  - `TutorPanel` component rendered inside sheet
- **State**: `tutorOpen` state controls visibility
- **Not placeholder**: Functional implementation with open/close animations

**For Layout C: how do you enforce "no lesson navigation + tutor locked"?**
- **UI-only enforcement**: 
  - Tutor panel not rendered in Layout C
  - Shows locked notice: "Tutor is locked during assessment"
  - No navigation buttons (only "Exit" button)
- **No backend enforcement**: No server-side checks preventing tutor calls
- **Client-side only**: Purely UI hiding, no API-level restrictions
- **Assessment integrity**: Relies on UI/UX, not backend policy gates

---

## D) Tutor Architecture

**How do you implement tutor "modes" (Teach/Check/Fix)?**
- **System prompts**: Separate prompts per mode (`TEACH_MODE_PROMPT`, `CHECK_MODE_PROMPT`, `FIX_MODE_PROMPT`)
- **One prompt with mode variable**: `getPromptForMode(mode)` returns appropriate prompt
- **Single endpoint**: `/api/tutor` handles all modes
- **Mode selection**: Client sends `mode` field in request body
- **Temperature**: Different per mode (teach: 0.7, check: 0.3, fix: 0.5)

**Where is mode state stored: URL, client state, server session, DB?**
- **Client state**: `TutorPanel` component uses `useState<TutorMode>`
- **Default**: `initialMode` prop (defaults to `'teach'`)
- **Mode switching**: `ModeSwitcher` component allows user to change mode
- **No URL**: Mode not in URL params
- **No server session**: Stateless API, no session storage
- **No DB**: No database persistence

**What prevents mode bleed (Teach coaching during Check)?**
- **Prompt-only enforcement**: Relies entirely on system prompt instructions
- **No server-side policy gate**: No code-level enforcement
- **Prompt rules**: CHECK_MODE_PROMPT explicitly states "Minimal help during attempts", "Do not provide coaching"
- **No automated tests**: Golden Set scenarios exist but not automated (see section I)
- **Risk**: Mode bleed possible if LLM ignores prompt

**Do you have an explicit "attempt required" rule before giving a full solution? How is it enforced?**
- **Prompt rule**: TEACH_MODE_PROMPT states: "NEVER give full solutions before an attempt"
- **Enforcement**: Prompt-only, no code-level enforcement
- **User progress tracking**: `userProgress` object sent to API includes `attemptsOnCurrentQuestion`, but not used to block answers
- **No guardrail**: No server-side check preventing answer before attempt

---

## E) RAG + Grounding

**What do you retrieve from: page blocks only, plus question bank, plus glossary?**
- **Retrieval**: Page blocks only (lesson blocks)
- **Source**: `createLessonContext()` formats all blocks from lesson
- **Question bank**: Not retrieved for grounding (only used in marking API)
- **Glossary**: Vocab blocks are included as regular blocks
- **No vector DB**: Direct block injection, no semantic search

**What's the chunking strategy: block-per-chunk using block IDs?**
- **Chunking**: One block = one chunk
- **Format**: Each block formatted as `[block-id]\ncontent...`
- **Function**: `formatBlockForContext()` formats each block type differently
- **Block IDs**: Used as chunk identifiers in format `[block-id]`

**Do tutor responses cite block IDs internally (even if you don't show citations to learners yet)?**
- **Yes**: Tutor is instructed to cite blocks using `[block-id]` format
- **Extraction**: `extractBlockReferences()` extracts block IDs from response using regex `/\[([^\]]+)\]/g`
- **Storage**: `blockReferences` array stored in `TutorResponse`
- **Display**: Block references stored but not currently displayed to learners (future feature)

**What's your "not in course notes" behaviour and where is it enforced (prompt vs server guardrail)?**
- **Prompt instruction**: TEACH_MODE_PROMPT says: "If the learner asks about something not in the blocks, respond: 'That's not covered in this lesson...'"
- **Validation**: `validateGrounding()` checks if referenced blocks exist in allowed list
- **Enforcement**: Warning logged if invalid references, but response still returned (non-blocking)
- **No server guardrail**: No code-level rejection of out-of-scope responses

---

## F) Questions + Marking

**How is question data stored: a tagged TS question bank (like your TaggedQuestion[]), database, both?**
- **Storage**: TypeScript files with `TaggedQuestion[]` arrays
- **Files**: `seriesCircuitsQuestions.ts`, `scienceQuestions.ts`, `communicationQuestions.ts`, `healthAndSafetyQuestions.ts`
- **No database**: File-based only
- **Type**: `TaggedQuestion` extends base `Question` with tags, learningOutcomeId, misconceptionCodes, etc.

**For MCQ: is marking trivial index match?**
- **Yes**: `markMCQ()` compares `userAnswerIndex === question.correctAnswer`
- **Simple**: Exact index match, no tolerance or fuzzy matching
- **Misconception**: If wrong, looks up `misconceptionCodes[userAnswerIndex]`

**For numeric/free-text answers:**
- **Units parsing**: `parseNumericAnswer()` extracts value and units using regex
- **Tolerance**: `isWithinTolerance()` checks ±0.01 (default) or percentage tolerance
- **Whitespace**: `normalizeAnswer()` trims and lowercases
- **Equivalent forms**: Accepts variations like "12", "12 Ω", "12Ω", "12 ohms"
- **Unit matching**: Can require units (`unitsRequired: true`) or be lenient

**Do you support "working shown" marking or just final answer?**
- **Final answer only**: No step-by-step validation
- **Types**: `StepValidation` interface exists but not implemented
- **Guided practice**: Has step-by-step prompts, but marking is per-step, not "working shown"

**How are misconception codes generated:**
- **Rule-based**: Predefined taxonomy in `misconceptionCodes.ts`
- **Mapping**: MCQ questions have `misconceptionCodes` object mapping wrong answer index → code
- **Not model-classified**: No LLM classification of misconceptions
- **Hybrid**: Marking API uses LLM for feedback, but misconception codes are rule-based

**How does Fix Mode choose the remediation item (near-identical variant) and how do you generate variants?**
- **Not implemented**: Fix mode prompt mentions "retest immediately with a near-identical question", but no variant generation exists
- **Misconception codes**: Fix mode receives `misconceptionCode` and uses `getMisconception(code).fixPrompt`
- **No variant generation**: No code to generate question variants
- **Manual**: Would require authoring variant questions manually

---

## G) Attempt Flow + States

**What's the state machine?**
- **Teach mode**: No formal state machine, conversational flow
- **Check mode**: `LayoutC` has local state:
  - `selectedAnswers[]` (per-question answers)
  - `currentQuestion` (index)
  - `showResults` (boolean)
- **Flow**: attempting → submitted → results (no formal state enum)
- **Fix mode**: Not implemented in UI (prompt exists, but no UI flow)

**Where do you store per-question attempt history?**
- **Storage**: `localStorage` via `progressService.ts`
- **Structure**: `LessonProgress.practiceAttempts[]` array
- **Fields**: `questionId`, `attemptNumber`, `isCorrect`, `userAnswer`, `timestamp`
- **No server storage**: Client-side only

**Do you prevent "spam submit" / brute force (especially in Check)?**
- **Rate limiting**: API has rate limiting (30 requests/minute per IP)
- **No per-question limits**: Rate limit is global, not per-question
- **No attempt throttling**: Can submit same question multiple times quickly
- **Client-side**: No debouncing or throttling in UI

---

## H) Progress Tracking + Mastery + Spaced Review

**What do you track right now (MVP): completions, attempts, pass/fail thresholds?**
- **Lesson progress**: `LessonProgress` tracks:
  - `status`: 'not-started' | 'in-progress' | 'completed'
  - `blocksCompleted[]`: Array of block IDs
  - `practiceAttempts[]`: Per-question attempts
  - `timeSpent`: Number (seconds)
- **Quiz progress**: `QuizProgress` tracks:
  - `attempts[]`: Full quiz attempts
  - `bestScore`, `bestPercentage`
  - `masteryAchieved`: Boolean (if >= 80%)
- **Pass threshold**: Hardcoded 80% in `saveQuizAttempt()`

**How is "mastery requires delayed confirmation" implemented?**
- **Not implemented**: No delayed confirmation logic
- **Current**: Mastery achieved immediately if score >= 80%
- **No scheduling**: No review queue or scheduled reminders
- **No spaced review**: Spaced review blocks exist in content, but no automated scheduling

**What counts as a pass (score threshold + no critical misconceptions)?**
- **Pass threshold**: 80% (`attempt.passed` set if `percentage >= 80`)
- **Misconceptions**: Not checked for pass/fail (only tracked)
- **Critical misconceptions**: `MisconceptionDefinition.severity` exists ('minor' | 'moderate' | 'critical'), but not used in pass logic

**Do you interleave discrimination items after basics? How is that scheduled/selected?**
- **Not implemented**: No interleaving logic
- **Tagging**: Questions have `tags[]` including 'discrimination', but no selection logic
- **Manual**: Would require manual question selection

---

## I) QA: Golden Set + Invariants

**Do you have Golden Set scenarios implemented as:**
- **Defined**: `GOLDEN_SCENARIOS[]` array in `scenarios.ts` (10 scenarios)
- **Not automated**: Scenarios are TypeScript objects, not automated tests
- **No test runner**: No code to execute scenarios against API
- **Manual checklist**: Would need manual verification

**What invariants are enforced automatically (mode separation, grounding, "attempt first", assessment integrity)?**
- **None automatically enforced**: All invariants are prompt-based only
- **Validation**: `validateGrounding()` checks block references but only logs warnings
- **No blocking**: Invalid responses still returned
- **No tests**: No automated invariant checks

**What fails a build/deploy?**
- **Build**: Standard Next.js build (`npm run build`)
- **Type errors**: TypeScript compilation errors would fail build
- **No test suite**: No test failures (no tests exist)
- **No linting**: ESLint configured but not enforced in build

---

## J) Security + Cost + Abuse

**How do you prevent prompt injection from lesson content or user input?**
- **No explicit prevention**: No sanitization of user input or lesson content
- **Risk**: User input and lesson blocks injected directly into prompt
- **Mitigation**: Relies on LLM's built-in safety filters
- **No validation**: No regex/whitelist filtering of user input

**Do you log tutor conversations? If yes, do you scrub personal data?**
- **No logging**: No conversation logging implemented
- **Console logs**: Only error logging to console
- **No persistence**: No database or file logging
- **No scrubbing**: No PII scrubbing (no logging exists)

**Any rate limiting / auth / per-user quotas?**
- **Rate limiting**: Yes, in-memory rate limiting (30 requests/minute per IP)
- **IP-based**: Uses `x-forwarded-for` or `x-real-ip` header
- **No auth**: No authentication system
- **No per-user quotas**: Rate limit is per-IP, not per-user
- **In-memory**: Rate limit store resets on server restart (not persistent)

---

## Detailed Technical Questions

### 1) Tutor Request/Response Contract

**What is the exact request body your client sends to /api/tutor?**

**Request Body** (`TutorRequest` interface):
```typescript
{
  message: string;                    // User's question/message
  mode: 'teach' | 'check' | 'fix';    // Tutor mode
  lessonContext?: {                   // Optional lesson context
    lessonId: string;
    lessonTitle: string;
    learningOutcomes: string[];
    blocks: Array<{
      id: string;
      type: string;
      content: string;                // Pre-formatted block content
    }>;
  };
  questionContext?: {                 // Optional current question context
    questionId: string;
    questionText: string;
    category: string;
    section: string;
    options?: string[];
    answerType?: string;
    tags?: string[];
  };
  history: Array<{                    // Conversation history (last 10 messages)
    role: 'user' | 'assistant';
    content: string;
  }>;
  userProgress?: {                    // Optional user progress
    attemptsOnCurrentQuestion: number;
    lastAttemptWasCorrect?: boolean;
    identifiedMisconceptions?: string[];
  };
}
```

**Example Request**:
```json
{
  "message": "How do I calculate total resistance in series?",
  "mode": "teach",
  "lessonContext": {
    "lessonId": "202-4A",
    "lessonTitle": "Series Circuits: Rules and Calculations",
    "learningOutcomes": ["State the three series rules..."],
    "blocks": [
      {
        "id": "202-4A-explain-rules",
        "type": "explanation",
        "content": "[202-4A-explain-rules]\nThe 3 Series Rules\n**Rule 1 (Current):** Current is the same everywhere..."
      }
    ]
  },
  "history": [
    { "role": "user", "content": "What are series circuits?" },
    { "role": "assistant", "content": "Series circuits have components connected in a single path..." }
  ],
  "userProgress": {
    "attemptsOnCurrentQuestion": 0
  }
}
```

**What is the exact response shape returned to the client?**

**Response Body** (`TutorResponse` interface):
```typescript
{
  response: string;                   // Tutor's text response
  blockReferences?: string[];         // Extracted block IDs cited in response
  suggestedAction?: 'retry' | 'next' | 'review' | 'scaffold' | 'fix';
  metadata?: {
    model: string;                    // Model name used (e.g., "gemini-1.5-flash")
    tokensUsed?: number;              // Not currently populated
    responseTime?: number;             // Response time in milliseconds
  };
}
```

**Example Response**:
```json
{
  "response": "In series circuits, resistances simply add together. The formula is R_total = R1 + R2. See [202-4A-explain-rules] for more details.",
  "blockReferences": ["202-4A-explain-rules"],
  "metadata": {
    "model": "gemini-1.5-flash",
    "responseTime": 1234
  }
}
```

**Note**: `suggestedAction` is defined in types but not currently populated in the API response.

---

### 2) Conversation Memory

**Do you send full conversation history to Gemini each call, or just the latest user message + lesson context?**

- **History sent**: Last 10 messages (truncated from client-side `messages` array)
- **Truncation logic**: `messages.slice(-10)` in `TutorPanel.tsx` (line 95)
- **Filtering**: Removes initial assistant greeting if no user messages exist yet (finds first user message index)
- **Format**: History converted to Gemini format: `{ role: 'user' | 'model', parts: [{ text: content }] }`

**How do you truncate it (token cap)? What gets dropped first?**

- **No token-based truncation**: Fixed window of last 10 messages
- **Drops oldest messages**: `slice(-10)` keeps most recent 10, drops older ones
- **No token counting**: No calculation of token usage before sending
- **Risk**: Long conversations may exceed Gemini context window (no guardrail)

**Is the lesson context injected every call (all blocks), or only once at the start?**

- **Injected every call**: `lessonContext` is sent with every request
- **All blocks**: All blocks from lesson are formatted and included in `lessonContext`
- **No caching**: Context rebuilt on client side each time (via `createLessonContext()`)
- **Formatting**: Blocks formatted via `formatBlockForContext()` → `formatLessonContextForLLM()` → appended to system prompt

**Why this matters**: With long history + full lesson context every call, the system prompt can become very large, potentially diluting the mode-specific instructions.

---

### 3) Lesson Context Construction

**Paste createLessonContext() and formatBlockForContext()**

**`createLessonContext()`** (from `groundingService.ts`):
```typescript
export function createLessonContext(lesson: Lesson, blockIds?: string[]): LessonContext {
  const blocksToInclude = blockIds
    ? lesson.blocks.filter(b => blockIds.includes(b.id))
    : lesson.blocks;

  return {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    learningOutcomes: lesson.learningOutcomes,
    blocks: blocksToInclude
      .sort((a, b) => a.order - b.order)
      .map(block => ({
        id: block.id,
        type: block.type,
        content: formatBlockForContext(block),  // Formats each block
      })),
  };
}
```

**`formatBlockForContext()`** (from `groundingService.ts`):
```typescript
function formatBlockForContext(block: Block): string {
  const content = block.content as any;
  
  switch (block.type) {
    case 'outcomes':
      return `[${block.id}]\nLearning Outcomes:\n${content.outcomes.map((o: any, i: number) => `${i + 1}. ${o.text} (${o.bloomLevel})`).join('\n')}`;
    
    case 'vocab':
      return `[${block.id}]\nKey Vocabulary:\n${content.terms.map((t: any) => `- **${t.term}**: ${t.definition}`).join('\n')}`;
    
    case 'explanation':
      return `[${block.id}]\n${content.title}\n${content.content}\n${content.subsections ? content.subsections.map((s: any) => `\n**${s.title}**\n${s.content}`).join('\n') : ''}`;
    
    case 'worked-example':
      return `[${block.id}]\nWorked Example: ${content.title}\nGiven: ${content.given}\n${content.steps.map((step: any) => {
        let stepText = `Step ${step.stepNumber}: ${step.description}`;
        if (step.formula) stepText += `\n  Formula: ${step.formula}`;
        if (step.calculation) stepText += `\n  Calculation: ${step.calculation}`;
        if (step.result) stepText += `\n  Result: ${step.result}`;
        return stepText;
      }).join('\n')}\n${content.notes ? `\nNote: ${content.notes}` : ''}`;
    
    case 'diagram':
      return `[${block.id}]\nDiagram: ${content.title}\nDescription: ${content.description}\nType: ${content.diagramType}\nElements: ${content.elementIds.join(', ')}\n${content.placeholderText ? `Diagram shows: ${content.placeholderText}` : ''}`;
    
    // ... other block types
  }
}
```

**`formatLessonContextForLLM()`** (final formatting):
```typescript
export function formatLessonContextForLLM(context: LessonContext): string {
  return `# Lesson: ${context.lessonTitle} (${context.lessonId})

## Learning Outcomes
${context.learningOutcomes.map((outcome, i) => `${i + 1}. ${outcome}`).join('\n')}

## Lesson Content Blocks

${context.blocks.map(block => block.content).join('\n\n---\n\n')}

---
IMPORTANT: Reference blocks using [block-id] format. Stay within this content. If asked about topics not covered here, redirect to what IS covered.`;
}
```

**For markdown fields inside blocks: do you pass them raw, or do you strip/normalize?**

- **Raw markdown**: Markdown in `content.content` (explanation blocks) is passed as-is
- **No stripping**: No markdown normalization or sanitization
- **Example**: `content.content` from `ExplanationBlockContent` is inserted directly into formatted string
- **Risk**: Markdown syntax could potentially confuse LLM or be used for injection

**Do you include the diagram block (even though it's placeholder)? If yes, what exactly is injected?**

- **Yes, included**: Diagram blocks are formatted and included in context
- **Format**: `[block-id]\nDiagram: {title}\nDescription: {description}\nType: {diagramType}\nElements: {elementIds.join(', ')}\nDiagram shows: {placeholderText}`
- **Example**: `[202-4A-diagram]\nDiagram: Simple Series Circuit\nDescription: Two resistors (R1 and R2) connected in series...\nType: series\nElements: R1, R2, loop, supply, wire\nDiagram shows: Series circuit diagram showing R1 = 6 Ω and R2 = 3 Ω...`
- **No SVG/visual data**: Only text description and element IDs

---

### 4) Block Reference Mechanism

**What happens if Gemini returns zero [block-id] references?**

- **Allowed**: Response is returned as-is
- **No validation**: `extractBlockReferences()` returns empty array `[]`
- **No blocking**: `blockReferences` is set to `undefined` if empty, but response still sent
- **No retry**: No code to re-prompt Gemini to include citations
- **Risk**: Tutor can answer without grounding, violating "stay within content" rule

**What happens if Gemini cites a block id that exists but is irrelevant?**

- **No relevance check**: Only validates that block ID exists in `allowedBlockIds`
- **Validation**: `validateGrounding()` checks `allowedBlockIds.includes(id)` but doesn't check relevance
- **Warning only**: Invalid references logged to console, but response still returned
- **No blocking**: Irrelevant but valid block IDs are allowed

**Do you ever show the learner "source: [block-id]" yet, or is it internal only?**

- **Internal only**: Block references stored in `TutorMessage.blockReferences` but not displayed
- **Storage**: References extracted and stored in message object
- **No UI display**: `TutorMessageComponent` doesn't render block references
- **Future feature**: References are tracked but not shown to learners

**Why this matters**: You're one step away from a hard grounding guardrail. Currently, zero citations = no enforcement. Adding a check for `blockReferences.length === 0` could trigger a refusal or re-prompt.

---

### 5) Assessment Integrity (Layout C)

**During Layout C, can a user open DevTools and call /api/tutor anyway?**

- **Yes**: No server-side prevention
- **API accessible**: `/api/tutor` endpoint has no `assessmentActive` flag check
- **Client-side only**: Layout C doesn't render TutorPanel, but API is still callable
- **No session tracking**: No server-side session to track assessment state
- **Vulnerability**: User can manually call `/api/tutor` with `mode: 'teach'` during assessment

**Does /api/tutor receive any context telling it "assessment is active"?**

- **No**: `TutorRequest` interface has no `assessmentActive` field
- **No quiz context**: No `quizId` or `quizAttemptId` in request
- **No mode lock**: Mode can be set to 'teach' or 'fix' even during assessment
- **Missing**: Would need `assessmentActive: boolean` or `quizAttemptId: string` in request

**Do quiz pages have a quizAttemptId or similar identifier?**

- **Yes**: `LayoutC` receives `quizId` prop
- **No attempt ID**: Quiz has ID but no per-attempt identifier
- **State**: Quiz state managed client-side (`selectedAnswers[]`, `currentQuestion`, `showResults`)
- **No server tracking**: No server-side attempt tracking or session

**Why this matters**: Without server-side policy, "tutor locked" is cosmetic. Adding `assessmentActive: true` to request and checking it server-side would prevent Teach/Fix modes during assessment.

---

### 6) Marking + Tolerance Edge Cases

**For numeric parsing: do you support scientific notation (1.2e-3), fractions (1/2), "comma decimals" (1,5)?**

**Current `parseNumericAnswer()` regex**: `/^([-+]?[\d.]+)\s*([a-zA-ZΩ°]+)?$/`

- **Scientific notation**: ❌ Not supported (regex doesn't match `e` or `E`)
- **Fractions**: ❌ Not supported (regex doesn't match `/`)
- **Comma decimals**: ❌ Not supported (only matches `.` as decimal separator)
- **Supported**: Integers, decimals with `.`, optional sign, optional units

**Units: do you normalize common variants?**

**Current normalization**: `normalizeAnswer()` does `trim().toLowerCase().replace(/\s+/g, ' ')`

- **Basic variants**: ✅ "ohm", "Ω", "ohms" → all normalized to lowercase
- **Prefixes**: ❌ **Not normalized**: "kΩ", "MΩ", "mA", "µA" compared as-is
- **Unit matching**: Uses `normalizeAnswer(parsed.units) === normalizeAnswer(expectedParsed.units)`
- **Example**: "kΩ" vs "KΩ" would match (case-insensitive), but "kΩ" vs "1000Ω" would not
- **Missing**: No unit conversion (e.g., "1000Ω" = "1kΩ")

**Do you check significant figures anywhere, or just tolerance?**

- **Tolerance only**: `isWithinTolerance()` checks absolute or percentage difference
- **No sig figs**: No significant figure validation
- **Default tolerance**: ±0.01 (absolute) or percentage-based
- **Example**: "12.000" vs "12.001" within tolerance, but no sig fig enforcement

**What does AnswerValidationConfig look like per question—are you actually using it for lesson practice blocks and tagged question bank, or only one?**

**`AnswerValidationConfig` interface**:
```typescript
{
  strategy?: MarkingStrategy;
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  acceptVariations?: boolean;
  requiredKeywords?: string[];
  forbiddenKeywords?: string[];
  unitsRequired?: boolean;
  unitsList?: string[];
  tolerance?: number;
  toleranceType?: 'absolute' | 'percentage';
  regexPattern?: string;
  partialCreditRules?: Array<{ condition: string; points: number }>;
}
```

**Usage**:
- **Marking API**: `MarkingRequest` includes optional `validationConfig`
- **Practice blocks**: Practice questions in lessons have `answerType` and `expectedAnswer`, but no `validationConfig` passed
- **Question bank**: `TaggedQuestion` has `tolerance`, `requiredUnits`, but no full `AnswerValidationConfig`
- **Partial usage**: Config exists but not fully utilized for all question types

**Why this matters**: Electrical learners constantly mix prefixes/units. You'll want deterministic, generous parsing (supporting "kΩ", "1000Ω", "1kΩ" as equivalent) with strict concept marking.

---

### 7) Progress + Persistence

**How do you key progress in localStorage?**

**Storage key**: `'cg2365-learning-progress'` (single key for all progress)

**Structure**:
```typescript
{
  version: '1.0',
  learningPaths: [{
    pathId: 'unit-202',              // Hardcoded default
    lessonsProgress: [{
      lessonId: '202-4A',            // Keyed by lessonId
      blocksCompleted: ['202-4A-outcomes', ...],  // Array of block IDs
      practiceAttempts: [{ questionId: '...', ... }]
    }],
    quizzesProgress: [{
      quizId: '...',                  // Keyed by quizId
      attempts: [...]
    }]
  }]
}
```

**Per user?**: No user ID (no auth), so progress is per-browser/device
**Per lessonId**: Yes, lessons keyed by `lessonId` within learning path

**What happens on a different browser/device?**

- **Lost**: Progress stored in localStorage, so different browser = fresh start
- **No sync**: No server-side storage or sync mechanism
- **No export**: `exportProgress()` exists but not exposed in UI
- **No import**: `importProgress()` exists but not exposed in UI

**Any migration/versioning for JSON lesson changes (block IDs changing between builds)?**

- **Version field**: `STORAGE_VERSION = '1.0'` exists
- **Warning only**: If version mismatch, logs warning but doesn't migrate
- **No migration**: No migration logic for block ID changes
- **Risk**: If block ID changes (e.g., `"202-4A-outcomes"` → `"202-4A-learning-outcomes"`), `blocksCompleted` array becomes stale
- **No validation**: No check that completed block IDs still exist in lesson

**Why this matters**: If you change a block ID, you silently break "completed blocks" and block refs. Need migration or validation.

---

### 8) Rate Limiting and Gemini Cost Control

**Your in-memory IP limiter: do you deploy on Vercel serverless functions? If yes, are you aware it may not persist reliably across instances?**

- **Vercel serverless**: Yes, Next.js API routes run as serverless functions
- **In-memory store**: `rateLimitStore = new Map()` (line 27 in `route.ts`)
- **Problem**: Serverless functions are stateless; each invocation may be a new instance
- **Not persistent**: Rate limit resets between cold starts or instance changes
- **Risk**: Rate limiting unreliable across function invocations

**Do you have any "max lesson context size" guard (to prevent token explosion when lessons grow)?**

- **No guard**: No check on lesson context size before sending
- **All blocks sent**: All blocks from lesson included every call
- **No token counting**: No calculation of prompt size
- **Risk**: Large lessons (many blocks) could exceed Gemini context window or hit token limits

**Do you log model errors and timeouts anywhere useful (Sentry, Vercel logs, etc.)?**

- **Console only**: `console.error()` and `console.warn()` for errors
- **No external logging**: No Sentry, no structured logging service
- **Vercel logs**: Console logs visible in Vercel dashboard, but not structured
- **Error handling**: Catches errors and returns JSON error responses, but doesn't log to external service
- **No monitoring**: No error tracking or alerting

**Why this matters**: This affects reliability more than people expect. Rate limiting may not work, token costs can spike, and errors aren't tracked.

---

## The 3 Highest-Leverage Code Changes (No Big Rewrite)

### 1. Hard Grounding Gate (Server-Side)

**Current**: Zero block references = response allowed
**Fix**: If `blockReferences.length === 0` and response is substantive, either:
- Re-prompt Gemini: "You must cite at least 1 block-id from the lesson content"
- OR return: `{ error: "Not in course notes — pick a block/topic.", requiresBlockSelection: true }`

**Location**: `/api/tutor/route.ts` after `extractBlockReferences()` (line 144)

**Code change**:
```typescript
const blockReferences = lessonContext 
  ? extractBlockReferences(response)
  : [];

// NEW: Hard grounding gate
if (lessonContext && blockReferences.length === 0 && response.length > 50) {
  // Re-prompt or refuse
  return NextResponse.json({
    error: "Please reference specific lesson content. Which block are you asking about?",
    requiresBlockSelection: true
  }, { status: 400 });
}
```

---

### 2. Assessment Lock (Server-Side)

**Current**: Layout C hides tutor UI, but API still accepts Teach/Fix modes
**Fix**: Add `assessmentActive: boolean` to `TutorRequest`, refuse Teach/Fix if true

**Location**: `/api/tutor/route.ts` validation section (after line 87)

**Code change**:
```typescript
const { message, mode, lessonContext, questionContext, history, userProgress, assessmentActive } = body;

// NEW: Assessment lock
if (assessmentActive && (mode === 'teach' || mode === 'fix')) {
  return NextResponse.json({
    error: 'Tutor is locked during assessment. Only Check mode is available.'
  }, { status: 403 });
}
```

**Client change**: Layout C should send `assessmentActive: true` when calling tutor (if it calls at all).

---

### 3. Attempt-First Enforcement (Server-Side, Lightweight)

**Current**: `userProgress.attemptsOnCurrentQuestion` sent but not used
**Fix**: If `attemptsOnCurrentQuestion === 0` and message asks for answer, return forced prompt

**Location**: `/api/tutor/route.ts` before Gemini call (after line 116)

**Code change**:
```typescript
// NEW: Attempt-first enforcement
if (userProgress?.attemptsOnCurrentQuestion === 0 && 
    (message.toLowerCase().includes('what is') || 
     message.toLowerCase().includes('what\'s the answer') ||
     message.toLowerCase().includes('tell me the answer'))) {
  
  return NextResponse.json({
    response: "Have a go first! Give me your attempt, and I'll help you from there.",
    blockReferences: [],
    metadata: { model: modelName, responseTime: Date.now() - startTime }
  });
}
```

**Why these three**: They turn your system from "prompt-powered demo" into "product that can't drift". All three are server-side, lightweight, and don't require UI changes.
---

## Final Missing Questions

### 1) /api/tutor/route.ts Actual Prompt Assembly

**How do you combine mode system prompt, lesson context, questionContext, userProgress, and conversation history?**

**Exact Assembly Order** (from `route.ts` lines 91-116):

```typescript
// Step 1: Start with mode-specific system prompt
let contextualPrompt = systemPrompt;  // e.g., TEACH_MODE_PROMPT

// Step 2: Append lesson context (if provided)
if (lessonContext) {
  const lessonContextFormatted = formatLessonContextForLLM(lessonContext);
  contextualPrompt += `\n\n${lessonContextFormatted}`;
}

// Step 3: Append question context (if provided)
if (questionContext) {
  contextualPrompt += `\n\nCURRENT QUESTION CONTEXT:
Question ID: ${questionContext.questionId}
Question: ${questionContext.questionText}
...`;
}

// Step 4: Append user progress (if provided)
if (userProgress) {
  contextualPrompt += `\n\nLEARNER PROGRESS:
Attempts on current question: ${userProgress.attemptsOnCurrentQuestion}
...`;
}

// Step 5: Set as systemInstruction (NOT user message)
const model = genAI.getGenerativeModel({
  model: modelName,
  systemInstruction: contextualPrompt,  // ← All context goes here
});

// Step 6: Build chat history (conversation history)
const formattedHistory = history?.map(msg => ({
  role: msg.role === 'user' ? 'user' : 'model',
  parts: [{ text: msg.content }],
})) || [];

// Step 7: Start chat with history
const chat = model.startChat({
  history: formattedHistory,  // ← Conversation history
  generationConfig: {
    temperature: modeConfig.temperature,
    maxOutputTokens: 1000,
  },
});

// Step 8: Send current user message
const result = await chat.sendMessage(message);  // ← Current user input
```

**Key Points**:
- **Lesson context appended to system prompt**: All context (lesson blocks, question context, user progress) is concatenated and set as `systemInstruction`
- **User input comes AFTER**: Current `message` is sent via `chat.sendMessage()`, which comes after history
- **History is separate**: Conversation history is passed to `startChat({ history })`, not appended to system prompt
- **Order matters**: System prompt (with all context) → Chat history → Current message

**Why this matters**: With Gemini's `systemInstruction`, the mode rules + lesson context stay "system-level" and persist across the conversation. However, if history grows long, the system instruction can get diluted. The exact ordering ensures mode rules are in systemInstruction (persistent) not history (can be truncated).

---

### 2) The Gemini API Call Shape

**Are you using `model.startChat({ history })` then `chat.sendMessage(message)`, or `model.generateContent([...parts])`?**

**Current Implementation**: `model.startChat({ history })` + `chat.sendMessage(message)`

**Exact Code** (from `route.ts` lines 120-141):
```typescript
const model = genAI.getGenerativeModel({
  model: modelName,
  systemInstruction: contextualPrompt,  // System-level instruction
});

const formattedHistory = history?.map(msg => ({
  role: msg.role === 'user' ? 'user' : 'model',
  parts: [{ text: msg.content }],
})) || [];

const chat = model.startChat({
  history: formattedHistory,
  generationConfig: {
    temperature: modeConfig.temperature,
    maxOutputTokens: 1000,
  },
});

const result = await chat.sendMessage(message);
const response = result.response.text();
```

**Safety Settings / Max Output Tokens**:
- **Max output tokens**: `maxOutputTokens: 1000` (hardcoded)
- **Temperature**: Mode-specific (`teach: 0.7`, `check: 0.3`, `fix: 0.5`)
- **No safety settings**: No explicit `safetySettings` parameter passed
- **No topK/topP**: Only temperature and maxOutputTokens configured

**Comparison with other endpoints**:
- **`/api/chat`**: Uses `model.generateContent(message)` (no chat history)
- **`/api/marking`**: Uses `model.generateContent(prompt)` (single-shot, no history)

**Why this matters**: `startChat` with `systemInstruction` is the right choice for conversational context. However, `systemInstruction` behavior can differ from appending to first user message. With Gemini, `systemInstruction` is persistent and doesn't count against token limits the same way, which is good for keeping mode rules intact.

---

### 3) Block Rendering ↔ Tutor Linking

**When you eventually show sources: do you have a canonical URL/anchor for blocks?**

**Current State**: Blocks have DOM `id` attributes, but no URL structure yet

**Block Rendering** (all block components):
```typescript
// Example from ExplanationBlock.tsx
<div className="..." id={block.id}>
  {/* Block content */}
</div>
```

**Block IDs in DOM**: All blocks render with `id={block.id}` (e.g., `id="202-4A-explain-rules"`)

**URL Structure**: 
- **Lesson pages**: `/learn/[lessonId]` (e.g., `/learn/202-4A`)
- **No hash anchors**: No current URL structure like `/learn/202-4A#202-4A-explain-rules`
- **No scroll-to-block**: No code to scroll to block when clicking citation

**What Exists**:
- ✅ Block IDs are stable (`"202-4A-explain-rules"`)
- ✅ Blocks have DOM `id` attributes
- ✅ Block references extracted from tutor responses (`blockReferences: string[]`)

**What's Missing**:
- ❌ No URL hash structure (`#block-id`)
- ❌ No scroll-to-block functionality
- ❌ No clickable citations in UI
- ❌ No `href` links from tutor messages to blocks

**Canonical URL Format** (would be):
```
/learn/202-4A#202-4A-explain-rules
```

**Why this matters**: Without clickable citations, block references are "dead metadata". To make citations useful, you'd need:
1. Add hash to URL when clicking citation: `window.location.hash = blockId`
2. Scroll to block on page load if hash present: `useEffect(() => { if (hash) document.getElementById(hash)?.scrollIntoView() })`
3. Render citations as clickable links in `TutorMessageComponent`

---

### 4) Practice Marking vs Tutor "Checking"

**Right now, do you have two systems that can "check answers": the deterministic marker (markMCQ, numeric parsing) vs the tutor in Check mode (LLM)?**

**Answer**: **Yes, but they serve different purposes**

**System 1: Deterministic Marking Service** (`markingService.ts`):
- **Functions**: `markMCQ()`, `markNumeric()`, `markShortText()`, `markAnswer()`
- **Location**: `src/lib/marking/markingService.ts`
- **Used by**: Not directly used by any API endpoint currently
- **Purpose**: Rule-based, deterministic marking with misconception codes

**System 2: LLM Marking** (`/api/marking`):
- **Function**: `markWithLLM()` (always used)
- **Location**: `src/app/api/marking/route.ts`
- **Used by**: All practice blocks (`PracticeBlock`, `GuidedPracticeBlock`)
- **Purpose**: AI-assisted marking with contextual feedback

**Current Reality**: 
- **`/api/marking` ALWAYS uses LLM**: Line 191-205 shows `markWithLLM()` is always called
- **Deterministic service exists but unused**: `markingService.ts` functions exist but are never called from `/api/marking`
- **No fallback**: No code path that uses deterministic marking if LLM fails

**Code Evidence** (`/api/marking/route.ts` line 191):
```typescript
// Always use LLM marking for better accuracy and contextual feedback
if (!genAI) {
  return NextResponse.json({ error: 'AI marking service is not configured...' }, { status: 503 });
}

const result = await markWithLLM(...);  // ← Always LLM, never deterministic
```

**Tutor Check Mode**:
- **Purpose**: Assessment mode for tutor conversations (not answer marking)
- **Not used for marking**: Tutor Check mode is for conversation, not for marking practice questions
- **Separate system**: Tutor doesn't mark answers; `/api/marking` does

**Which is Authoritative?**
- **Current**: LLM marking (`/api/marking`) is the only system actually used
- **Intended**: Deterministic marking should be authoritative (but not implemented)
- **Problem**: Two systems exist, but only LLM is used → no inconsistency risk yet, but deterministic service is dead code

**Why this matters**: If you ever switch to deterministic marking or use both, learners will find inconsistencies. The deterministic service exists but is orphaned code. Recommendation: Either remove it or make it the primary marking system with LLM as fallback for edge cases.

---

### 5) Golden Set Location and Intended Runner

**Where is GOLDEN_SCENARIOS[] intended to run from?**

**Current Location**: `src/tests/golden-set/scenarios.ts`

**Current State**:
- ✅ Scenarios defined: `GOLDEN_SCENARIOS[]` array with 10 scenarios
- ✅ Types defined: `GoldenScenario` interface
- ✅ README exists: `src/tests/golden-set/README.md` with manual testing instructions
- ❌ **No test runner**: No test framework (no Jest, Vitest, Playwright)
- ❌ **No npm script**: `package.json` has no `test:golden-set` script
- ❌ **No automation**: Scenarios are TypeScript objects, not executable tests

**Intended Runner** (from README.md):
```bash
npm run test:golden-set  # ← Documented but doesn't exist
```

**Manual Testing Instructions** (from README):
1. Navigate to `/api/tutor`
2. Send requests matching each scenario
3. Verify expected behaviors
4. Record pass/fail manually

**What's Missing**:
- No test framework setup (Jest/Vitest/Playwright)
- No test file that imports `GOLDEN_SCENARIOS` and executes them
- No CI/CD integration
- No automated pass/fail checking

**Recommended Implementation** (for "invariants that break builds"):

**Option A: Node Script** (simplest):
```typescript
// scripts/test-golden-set.ts
import { GOLDEN_SCENARIOS } from '../src/tests/golden-set/scenarios';
import fetch from 'node-fetch';

async function runGoldenSet() {
  for (const scenario of GOLDEN_SCENARIOS) {
    const response = await fetch('http://localhost:3000/api/tutor', {
      method: 'POST',
      body: JSON.stringify({ ...scenario }),
    });
    // Check expectedBehaviors...
  }
}
```

**Option B: Vitest** (better for CI):
```typescript
// src/tests/golden-set/golden-set.test.ts
import { describe, it, expect } from 'vitest';
import { GOLDEN_SCENARIOS } from './scenarios';

describe('Golden Set', () => {
  GOLDEN_SCENARIOS.forEach(scenario => {
    it(scenario.name, async () => {
      // Test scenario...
    });
  });
});
```

**Option C: Playwright** (if testing deployed endpoint):
```typescript
// e2e/golden-set.spec.ts
import { test } from '@playwright/test';
import { GOLDEN_SCENARIOS } from '../src/tests/golden-set/scenarios';

test('Golden Set', async ({ request }) => {
  for (const scenario of GOLDEN_SCENARIOS) {
    const response = await request.post('/api/tutor', { data: scenario });
    // Assert expectedBehaviors...
  }
});
```

**Why this matters**: Without automation, Golden Set is "documentation that might be tested manually". To make invariants "break builds", you need:
1. Test runner (Vitest recommended for Next.js)
2. Test file that executes scenarios
3. `npm run test:golden-set` script
4. CI check: `npm run test:golden-set` in build pipeline

**Current Risk**: Scenarios exist but aren't enforced. Prompt changes could violate invariants without detection.

---

## Implementation Hardening Plan (No Database, No Vector DB Required)

Based on all answers above, here's a tight hardening plan that matches your current structure:

### Phase 1: Server-Side Guardrails (3 changes, ~50 lines)

1. **Hard Grounding Gate** (`/api/tutor/route.ts` line 144):
   - Check `blockReferences.length === 0` → refuse or re-prompt
   - Prevents ungrounded responses

2. **Assessment Lock** (`/api/tutor/route.ts` line 87):
   - Add `assessmentActive: boolean` to `TutorRequest`
   - Refuse Teach/Fix if `assessmentActive === true`

3. **Attempt-First Enforcement** (`/api/tutor/route.ts` line 116):
   - Check `userProgress.attemptsOnCurrentQuestion === 0` + answer-seeking patterns
   - Return forced prompt: "Have a go first!"

### Phase 2: Marking Consistency (1 change)

4. **Use Deterministic Marking** (`/api/marking/route.ts`):
   - Replace `markWithLLM()` with `markAnswer()` from `markingService.ts`
   - Use LLM only for feedback generation, not correctness
   - Ensures consistent marking across all question types

### Phase 3: Citation UX (2 changes)

5. **Block Anchor Links** (`LayoutA.tsx`, `LayoutB.tsx`):
   - Add `useEffect` to scroll to block on hash change
   - Update URL hash when block referenced

6. **Clickable Citations** (`TutorMessageComponent.tsx`):
   - Render `blockReferences` as clickable links
   - Format: `[202-4A-explain-rules]` → `<a href="#202-4A-explain-rules">...</a>`

### Phase 4: Golden Set Automation (1 setup)

7. **Test Runner** (`vitest.config.ts` + `golden-set.test.ts`):
   - Add Vitest to `devDependencies`
   - Create test file that executes `GOLDEN_SCENARIOS`
   - Add `npm run test:golden-set` script
   - Fail build if < 95% pass rate

### Phase 5: Rate Limiting Fix (1 change)

8. **Persistent Rate Limiting** (`/api/tutor/route.ts`):
   - Use Vercel KV or similar for rate limit store
   - OR accept in-memory limitation and document it

**Total**: 8 focused changes, no database, no vector DB, no major rewrites. All leverage existing structure.

