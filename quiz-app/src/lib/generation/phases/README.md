# Sequential Lesson Generation Phases

This directory contains the 9 specialized phases that make up the sequential lesson generation pipeline.

## Overview

Instead of one monolithic 700-line prompt, we break lesson generation into focused phases:

```
Planning → Vocabulary → Explanation → Checks → Worked Example 
→ Practice → Integration → Spaced Review → Assembler
```

Each phase:
- Has a single responsibility
- Returns structured JSON
- Validates its own output
- Passes data to the next phase

## Phase Files

### Base Class
- **PhasePromptBuilder.ts** - Abstract base class with shared utilities

### Phase Implementations

1. **Phase1_Planning.ts** - Determines lesson structure, layout, learning outcomes
2. **Phase2_Vocabulary.ts** - Generates 4-6 essential technical terms
3. **Phase3_Explanation.ts** - Writes 400-600 word teaching content
4. **Phase4_UnderstandingChecks.ts** - Creates formative assessment questions
5. **Phase5_WorkedExample.ts** - Generates worked examples (conditional)
6. **Phase6_Practice.ts** - Creates independent practice questions
7. **Phase7_Integration.ts** - Generates synthesis questions
8. **Phase8_SpacedReview.ts** - Creates prerequisite review questions
9. **Phase9_Assembler.ts** - Assembles all outputs into complete lesson JSON

### Exports
- **index.ts** - Exports all phases for easy importing

## Usage

### In the Orchestrator

```typescript
import { SequentialLessonGenerator } from './SequentialLessonGenerator';

// The orchestrator runs all phases in sequence
const generator = new SequentialLessonGenerator(generateWithRetryFn);
const result = await generator.generate(request);
```

### Creating a New Phase

1. **Extend the base class:**

```typescript
import { PhasePromptBuilder } from './PhasePromptBuilder';

export class PhaseX_NewFeature extends PhasePromptBuilder {
  getPhaseName(): string {
    return 'Phase X: New Feature';
  }

  protected buildSystemPrompt(): string {
    return `You are a specialist for [feature].
    
${this.getJsonOutputInstructions()}`;
  }

  protected buildUserPrompt(input: any): string {
    return `Generate [feature] for this lesson:
    
[Input details]

Return JSON: {...}`;
  }
}
```

2. **Add to orchestrator** (`SequentialLessonGenerator.ts`)
3. **Update assembler** if needed (`Phase9_Assembler.ts`)
4. **Export** from `index.ts`

## Key Design Principles

### 1. Single Responsibility
Each phase does ONE thing well. Don't try to make a phase do multiple tasks.

### 2. Explicit Dependencies
If Phase B needs Phase A's output, pass it explicitly as input:

```typescript
// Phase 4 receives Phase 3's explanation as input
const checksResult = await this.runPhase4(lessonId, explanationResult);
```

This ensures teach-before-test enforcement.

### 3. Validation Gates
Each phase validates its output before passing to the next phase:

```typescript
const parsed = this.parseResponse<OutputType>(response, 'PhaseName');
if (!parsed.success || !parsed.data) {
  return null; // Fail fast
}
return parsed.data;
```

### 4. Reuse Existing Infrastructure
All phases use the existing parsing/validation pipeline:

- `validateLLMResponse()` - Check for API errors
- `cleanCodeBlocks()` - Remove markdown
- `preprocessToValidJson()` - Fix LLM quirks
- `safeJsonParse()` - Parse JSON safely

**Never create new parsing logic!**

### 5. Debug Logging
Every phase logs start/complete/failure:

```typescript
debugLog('PHASE_START', { lessonId, inputData });
debugLog('PHASE_COMPLETE', { outputData });
debugLog('PHASE_FAILED', { error });
```

## Modifying Phases

### Safe to Modify

✅ Prompt text (keep JSON output requirements)  
✅ Token limits (in orchestrator)  
✅ Input/output interfaces (add optional fields)  
✅ Validation checks (add more, don't remove)

### DO NOT Modify

❌ Parsing pipeline order  
❌ Validation infrastructure  
❌ Base class utilities  
❌ JSON output format requirements  

## Testing Phases

### Unit Test (Individual Phase)

```typescript
describe('Phase3_Explanation', () => {
  it('generates explanation with Key facts section', async () => {
    const phase = new Phase3_Explanation();
    const input = { /* mock input */ };
    const prompts = phase.getPrompts(input);
    
    // Test prompts are well-formed
    expect(prompts.systemPrompt).toContain('6-part structure');
    expect(prompts.userPrompt).toContain('400-600 words');
  });
});
```

### Integration Test (Full Pipeline)

```typescript
describe('Sequential Pipeline', () => {
  it('generates complete lesson', async () => {
    const generator = new SequentialLessonGenerator(mockRetryFn);
    const result = await generator.generate(mockRequest);
    
    expect(result.success).toBe(true);
    expect(result.content.blocks.length).toBeGreaterThan(5);
  });
});
```

## Common Tasks

### Adjust Token Limits

In `SequentialLessonGenerator.ts`, each phase call specifies limit:

```typescript
const response = await this.generateWithRetry(
  prompts.systemPrompt,
  prompts.userPrompt,
  'lesson',
  2,
  false,
  6000  // ← Adjust per phase needs
);
```

### Make Phase Conditional

In the orchestrator:

```typescript
if (plan.needsWorkedExample) {
  const result = await this.runPhase5(...);
} else {
  // Skip phase
  const result = { workedExample: undefined };
}
```

### Change Prompt Style

In the phase file:

```typescript
protected buildSystemPrompt(): string {
  return `You are a [role] for [audience].

Your task is [objective].

RULES:
- Rule 1
- Rule 2

${this.getJsonOutputInstructions()}`;
}
```

## Debug Output

When running, you'll see:

```
🔄 [Sequential] Starting sequential generation
  📋 Phase 1: Planning... ✓
  📚 Phase 2: Vocabulary... ✓
  📝 Phase 3: Explanations... ✓
  ...
```

Check `.cursor/debug.log` for detailed phase execution logs.

## Related Files

- **Orchestrator:** `../SequentialLessonGenerator.ts`
- **Integration:** `../fileGenerator.ts`
- **Utilities:** `../utils.ts`
- **Types:** `../types.ts`

## Documentation

- **Quick Start:** `/reports/improvements/SEQUENTIAL_QUICKSTART.md`
- **Full Architecture:** `/reports/improvements/sequential_generation_architecture.md`
- **Constraints:** `/reports/bulk_tasks/don't_touch.md`

## Questions?

Before modifying phases:

1. Read `sequential_generation_architecture.md`
2. Check `don't_touch.md` for constraints
3. Review git history for context
4. Test with actual generation

---

**Remember:** Each phase is a focused specialist. Keep them simple, single-purpose, and well-tested.
