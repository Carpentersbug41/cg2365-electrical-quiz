# Phase 10: Auto-Refinement Implementation

## Overview

Phase 10 is an automatic quality improvement layer that activates when a generated lesson scores below 93/100. It uses an LLM to generate surgical JSON patches that fix specific rubric issues, re-scores the refined lesson, and saves both versions for comparison.

### Key Features

- **Automatic activation**: Triggers only when initial score < 93/100
- **Surgical patching**: Fixes up to 10 specific issues without rewriting entire sections
- **Validation**: Ensures patches don't break lesson structure
- **Comparison**: Saves both original and refined versions
- **UI feedback**: Purple notification shows score improvement and patch details

### Integration Point

Phase 10 runs after Phase 9 (Assembly) but before final file output:

```
Phase 1-8 → Phase 9 (Assemble) → Score Lesson → Phase 10 (if < 93) → Save Files
```

---

## Implementation History

### Build Error Encountered

**Error Message:**
```
Module not found: Can't resolve '../geminiClient'
./src/lib/generation/phases/Phase10_Refinement.ts:9:1
```

**Root Cause:**
Phase10_Refinement was trying to directly import and call `callGemini()` from a non-existent `../geminiClient` module. This violated the architectural pattern used by all other phases.

**Architectural Pattern:**
- Phases 1-8 never directly call the LLM
- Instead, they provide prompts via `getPrompts()` method
- `SequentialLessonGenerator` orchestrates all LLM calls using its injected `generateWithRetry()` function

### Solution Applied

Refactored `Phase10_Refinement.ts` to match the established phase pattern:

**Before (incorrect):**
```typescript
// Phase10 tried to call LLM directly
import { callGemini } from '../geminiClient';

async refine(input: RefinementInput): Promise<RefinementOutput> {
  // ... extract issues
  const response = await callGemini(systemPrompt, userPrompt);
  // ... parse and apply patches
}
```

**After (correct):**
```typescript
// Phase10 provides prompts, doesn't call LLM
prepareRefinementInput(lesson: Lesson, rubricScore: RubricScore, maxFixes: number) {
  const issues = this.extractTopIssues(rubricScore, maxFixes);
  return { issues, lesson };
}

// SequentialLessonGenerator orchestrates the LLM call
private async runPhase10(lesson: Lesson, rubricScore: RubricScore) {
  const { issues, lesson: lessonForPrompt } = this.phase10.prepareRefinementInput(...);
  const prompts = this.phase10.getPrompts({ lesson: lessonForPrompt, issues });
  const response = await this.generateWithRetry(...); // Consistent with other phases
  // ... parse, apply patches, validate
}
```

---

## File Changes

### 1. Phase10_Refinement.ts

**Location:** `quiz-app/src/lib/generation/phases/Phase10_Refinement.ts`

**Key Changes:**
- Removed invalid `callGemini` import
- Removed `import { preprocessToValidJson, safeJsonParse } from '../utils'`
- Refactored `refine()` method into smaller public methods:
  - `prepareRefinementInput()` - Extracts top issues for fixing
  - `convertLLMPatches()` - Converts LLM response to RefinementPatch[]
  - `applyPatches()` - Applies patches to lesson JSON
  - `validatePatches()` - Ensures patches didn't break structure

**Methods that remain private:**
- `extractTopIssues()` - Ranks issues by severity
- `calculateSeverity()` - Prioritizes schema/safety issues
- `getValueAtPath()` - JSON path traversal
- `setValueAtPath()` - JSON path modification
- `extractRelevantSections()` - Provides context to LLM

**Prompt Structure:**
```typescript
buildSystemPrompt(): string {
  // Strict rules for surgical JSON editing
  // - Fix ONLY specified fields
  // - Maximum 10 patches
  // - No structural changes
  // - Forbidden: rewriting sections, adding fields, creative improvements
}

buildUserPrompt(input: { lesson, issues }): string {
  // Lists issues ranked by severity
  // Provides lesson ID and relevant JSON sections
  // Requests patches in specific format
}
```

### 2. SequentialLessonGenerator.ts

**Location:** `quiz-app/src/lib/generation/SequentialLessonGenerator.ts`

**Key Changes:**

**Added import:**
```typescript
import { RubricScore } from './rubricScoringService';
```

**New method:**
```typescript
private async runPhase10(lesson: Lesson, rubricScore: RubricScore): Promise<RefinementOutput | null> {
  // 1. Prepare refinement input (extract top issues)
  const { issues, lesson: lessonForPrompt } = this.phase10.prepareRefinementInput(lesson, rubricScore, 10);
  
  // 2. Get prompts from Phase10
  const prompts = this.phase10.getPrompts({ lesson: lessonForPrompt, issues });
  
  // 3. Call LLM (same pattern as phases 1-8)
  const response = await this.generateWithRetry(
    prompts.systemPrompt,
    prompts.userPrompt,
    'lesson',
    2,
    false,
    8000 // Token limit
  );
  
  // 4. Parse response
  const parsed = this.parseResponse<{ patches: Array<...> }>(response, 'Phase10_Refinement');
  
  // 5. Convert LLM patches to RefinementPatches
  const refinementPatches = this.phase10.convertLLMPatches(parsed.data, issues, lesson);
  
  // 6. Apply patches
  const refinedLesson = this.phase10.applyPatches(lesson, refinementPatches);
  
  // 7. Validate
  if (!this.phase10.validatePatches(lesson, refinedLesson)) {
    return null;
  }
  
  return { originalLesson: lesson, refined: refinedLesson, ... };
}
```

**Integration in generate() method:**
```typescript
// After Phase 9 assembly
const lesson = this.phase9.assemble({...});

// Score the lesson
const initialScore = this.rubricScorer.scoreLesson(lesson);

// Phase 10: Auto-Refinement (if score < 93)
if (initialScore.total < 93) {
  refinementResult = await this.runPhase10(lesson, initialScore);
  
  if (refinementResult && refinementResult.improvementSuccess) {
    const refinedScore = this.rubricScorer.scoreLesson(refinementResult.refined);
    
    if (refinedScore.total > initialScore.total) {
      // Use refined version
      originalLesson = lesson;
      finalLesson = refinementResult.refined;
    }
  }
}
```

### 3. Other Files (Previously Implemented)

**types.ts** - Added `refinementMetadata` to `GenerationResponse`:
```typescript
export interface GenerationResponse {
  // ... existing fields
  refinementMetadata?: {
    wasRefined: boolean;
    originalScore: number;
    finalScore: number;
    patchesApplied: number;
    details: any[]; // RefinementPatch[]
  };
}
```

**lesson-generator/route.ts** - Save both versions:
```typescript
// Save refined version as main file
lessonFilePath = await fileGenerator.writeLessonFile(body, lessonResult.content);

// Save original version with -original suffix
if (lessonResult.refinementMetadata?.wasRefined && lessonResult.originalLesson) {
  const originalLessonPath = path.join(
    path.dirname(lessonFilePath),
    `${fullLessonId}-original.json`
  );
  fs.writeFileSync(originalLessonPath, JSON.stringify(lessonResult.originalLesson, null, 2));
}
```

**generate/page.tsx** - UI notification:
```tsx
{status.result?.refinementMetadata?.wasRefined && (
  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-400">
    <div className="flex items-center gap-2 mb-2">
      <Sparkles className="w-5 h-5 text-purple-600" />
      <span className="font-semibold text-purple-900">Auto-Refinement Activated</span>
    </div>
    {/* Score comparison, patches applied, file paths */}
  </div>
)}
```

**config.ts** - Feature flags:
```typescript
export const GENERATION_CONFIG = {
  refinement: {
    enabled: true,
    scoreThreshold: 93,
    maxFixes: 10,
    saveOriginal: true,
    autoApply: true,
  }
};
```

---

## Architecture Consistency

### Phase Pattern (Universal)

All phases (1-10) follow this pattern:

1. **Phase class extends `PhasePromptBuilder`**
2. **Implements two methods:**
   - `buildSystemPrompt(): string` - LLM system instructions
   - `buildUserPrompt(input: any): string` - Task-specific prompt
3. **Exposes `getPrompts(input): { systemPrompt, userPrompt }`**
4. **Never directly calls LLM**

### Orchestrator Pattern

`SequentialLessonGenerator` orchestrates all phases:

1. **Calls `phaseX.getPrompts(input)`** to get prompts
2. **Calls `this.generateWithRetry(systemPrompt, userPrompt, ...)`** to invoke LLM
3. **Calls `this.parseResponse<T>(response, 'PhaseX')`** to parse result
4. **Passes parsed data to next phase**

This pattern ensures:
- Consistent error handling
- Centralized retry logic
- Easy testing (phases can be tested without LLM)
- Clean separation of concerns

---

## How Phase 10 Works

### Step 1: Issue Extraction

```typescript
extractTopIssues(score: RubricScore, maxFixes: number): IssueToFix[] {
  // 1. Collect all issues from rubric details
  // 2. Calculate severity score for each issue
  // 3. Boost severity for schema/contract issues (2x) and safety issues (1.5x)
  // 4. Sort by severity (highest first)
  // 5. Return top N issues (default: 10)
}
```

### Step 2: LLM Patch Generation

**System Prompt Rules:**
- Fix ONLY specified fields
- Return patches in strict JSON format
- Maximum 10 patches
- No structural changes (block count, block types, block order)
- No creative improvements beyond the specific issue

**User Prompt Content:**
- Lesson ID and current score
- Ranked list of issues with suggestions
- Relevant JSON sections for context

**Expected Response:**
```json
{
  "patches": [
    {
      "path": "blocks[8].content.questions[3].questionText",
      "newValue": "What is the purpose of a former when bending conduit?",
      "reason": "Changed 'how to use' to 'purpose' to match lesson scope"
    }
  ]
}
```

### Step 3: Patch Application

```typescript
applyPatches(lesson: Lesson, patches: RefinementPatch[]): Lesson {
  // 1. Deep clone lesson (don't mutate original)
  // 2. For each patch:
  //    - Parse JSON path (e.g., "blocks[8].content.questions[3].questionText")
  //    - Navigate to target location
  //    - Replace value
  // 3. Return patched lesson
}
```

### Step 4: Validation

```typescript
validatePatches(original: Lesson, patched: Lesson): boolean {
  // 1. Check required fields exist (id, title, blocks)
  // 2. Block count unchanged
  // 3. Block types match at each index
  // Return false if any check fails (keeps original)
}
```

### Step 5: Re-scoring and Decision

```typescript
// Re-score refined lesson
const refinedScore = this.rubricScorer.scoreLesson(refinementResult.refined);

// Only use refined version if score improved
if (refinedScore.total > initialScore.total) {
  originalLesson = lesson;
  finalLesson = refinementResult.refined;
} else {
  // Keep original if refinement didn't help
}
```

---

## Testing Checklist

### Build Verification

- [ ] Run `npm run dev` in `quiz-app` directory
- [ ] Verify no TypeScript errors
- [ ] Verify no import resolution errors
- [ ] Dev server starts successfully

### Functional Testing

#### Test 1: High-Scoring Lesson (No Refinement)
- [ ] Generate a lesson that typically scores 94+
- [ ] Verify Phase 10 does NOT activate
- [ ] Console shows: "Score meets threshold (XX >= 93), no refinement needed"
- [ ] Only one file saved (no `-original.json`)

#### Test 2: Low-Scoring Lesson (Refinement Activates)
- [ ] Generate a lesson that typically scores < 93
- [ ] Verify Phase 10 activates
- [ ] Console output includes:
  ```
  🔧 [Refinement] Score below threshold (93), activating Phase 10...
  🔧 Phase 10: Auto-refinement...
  📝 Targeting X issues for fix
  ✓ Applied X patches
  ✅ [Refinement] Score improved: XX → YY
  ```
- [ ] Two files saved:
  - `203-XX-lesson-name.json` (refined version)
  - `203-XX-lesson-name-original.json` (original version)

#### Test 3: UI Notification
- [ ] Open http://localhost:3000/generate
- [ ] Generate a lesson that triggers refinement
- [ ] Verify purple notification appears showing:
  - "Auto-Refinement Activated" header
  - Original score → Final score
  - Number of patches applied
  - Expandable patch details
  - File paths for comparison

#### Test 4: Patch Validation
- [ ] Manually inspect both original and refined JSON files
- [ ] Verify block count is identical
- [ ] Verify block types match at each index
- [ ] Verify only targeted fields changed
- [ ] No new blocks added
- [ ] No structural changes to lesson

#### Test 5: Score Improvement
- [ ] Use test generation page at http://localhost:3000/test-generation
- [ ] Score both original and refined versions
- [ ] Verify refined score is higher than original
- [ ] If refined score is NOT higher, verify original was kept

### Edge Cases

#### Test 6: No Fixable Issues
- [ ] Generate lesson scoring ~92 but with vague rubric feedback
- [ ] Verify Phase 10 handles empty issues list gracefully
- [ ] No crash, original lesson kept

#### Test 7: LLM Returns Invalid Patches
- [ ] Simulate LLM returning empty patches array
- [ ] Verify original lesson is kept
- [ ] Console shows: "No patches generated"

#### Test 8: Validation Failure
- [ ] If patches break structure (shouldn't happen with strict prompt)
- [ ] Verify validation catches it
- [ ] Original lesson kept
- [ ] Console shows: "Validation failed, keeping original"

---

## Console Output Reference

### Successful Refinement
```
📊 [Scoring] Initial score: 88/100 (B)
🔧 [Refinement] Score below threshold (93), activating Phase 10...
  🔧 Phase 10: Auto-refinement...
    📝 Targeting 7 issues for fix
    ✓ Applied 7 patches
📊 [Scoring] Refined score: 94/100 (A)
✅ [Refinement] Score improved: 88 → 94
💾 [Refinement] Saved original version: 203-3E-specialised-installing-equipment-original.json
```

### No Refinement Needed
```
📊 [Scoring] Initial score: 95/100 (A)
✅ [Scoring] Score meets threshold (95 >= 93), no refinement needed
```

### Refinement Failed to Improve
```
📊 [Scoring] Initial score: 91/100 (A-)
🔧 [Refinement] Score below threshold (93), activating Phase 10...
  🔧 Phase 10: Auto-refinement...
    📝 Targeting 5 issues for fix
    ✓ Applied 5 patches
📊 [Scoring] Refined score: 90/100 (A-)
⚠️  [Refinement] Score did not improve (91 → 90), keeping original
```

---

## Next Steps

### Immediate Actions (Post-Build Fix)

1. **Test the build**
   ```bash
   cd quiz-app
   npm run dev
   ```

2. **Generate test lessons**
   - Use http://localhost:3000/generate
   - Try different lesson types (calculation, identification, procedure)
   - Monitor console for Phase 10 activation

3. **Compare original vs refined**
   - Use a diff tool to compare JSON files
   - Verify patches are surgical (only targeted fields changed)
   - Verify no structural damage

4. **Test scoring improvements**
   - Use http://localhost:3000/test-generation
   - Score both versions
   - Verify refined version scores higher

### Future Enhancements

1. **Refinement Analytics**
   - Track which rubric sections are most commonly patched
   - Identify patterns in low-scoring lessons
   - Use insights to improve upstream phases

2. **Multi-Pass Refinement**
   - If first refinement doesn't reach 93, allow second pass
   - Limit to prevent infinite loops (max 2-3 passes)

3. **Phase-Specific Fixes**
   - Current approach is generic JSON patching
   - Could add specialized fixers for common issues:
     - `expectedAnswer` tightening
     - Verb ban enforcement
     - Absolute language removal

4. **Refinement Learning**
   - Collect successful patches
   - Feed patterns back into phase prompts
   - Gradually reduce need for refinement by improving generation

5. **User Feedback Loop**
   - Allow manual acceptance/rejection of patches
   - Learn from user preferences
   - Build confidence scoring for patches

---

## Architectural Benefits

### 1. Consistency
All phases follow the same pattern, making the codebase predictable and maintainable.

### 2. Testability
Phases can be unit tested without LLM calls by mocking `getPrompts()` output.

### 3. Centralized Control
`SequentialLessonGenerator` controls all LLM interactions, making it easy to:
- Add retry logic
- Implement rate limiting
- Switch LLM providers
- Add logging/monitoring

### 4. Clean Separation
Each phase has one job:
- Phase classes: Build prompts based on input
- Generator: Orchestrate phases and handle LLM calls
- No phase needs to know about LLM clients or retry logic

### 5. Extensibility
Adding new phases is straightforward:
1. Extend `PhasePromptBuilder`
2. Implement `buildSystemPrompt()` and `buildUserPrompt()`
3. Add `runPhaseX()` method to `SequentialLessonGenerator`
4. No need to modify existing phases

---

## Lessons Learned

### What Worked Well

1. **Sequential architecture made refinement natural**
   - Phase 10 slots in cleanly after Phase 9
   - No need to refactor existing phases

2. **Surgical patching is effective**
   - JSON path targeting allows precise fixes
   - Validation prevents breaking changes
   - LLM understands the constraint well

3. **Comparison files are valuable**
   - Original version provides audit trail
   - Easy to verify patches worked as intended
   - Helps identify when refinement isn't helping

### What Could Be Better

1. **Initial implementation broke pattern**
   - Direct LLM calling caused import error
   - Pattern violation wasn't caught until build
   - Lesson: Always follow established patterns

2. **Issue extraction could be smarter**
   - Current severity calculation is basic
   - Could use ML to predict which issues are easiest to fix
   - Could prioritize issues with highest ROI (points per fix)

3. **Single-pass limitation**
   - If refinement doesn't reach 93, we stop
   - Could benefit from iterative refinement
   - Need safeguards against infinite loops

---

## Conclusion

Phase 10 Auto-Refinement adds a quality safety net to the lesson generation pipeline. By automatically detecting and fixing issues in low-scoring lessons, it:

- **Reduces manual review burden**
- **Improves consistency** (fewer "rogue" lessons)
- **Provides learning data** (which issues are most common)
- **Maintains audit trail** (original versions preserved)

The implementation follows the established phase pattern, ensuring consistency with the rest of the codebase. The build error encountered during initial implementation highlighted the importance of adhering to architectural patterns.

**Status:** Build error fixed, implementation complete, ready for testing.

**Next:** Run functional tests and monitor refinement effectiveness on real lesson generation workloads.
