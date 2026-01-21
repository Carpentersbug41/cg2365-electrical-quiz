# Lesson JSON Migration Guide for LLM Marking

## Overview
All module questions now use LLM semantic evaluation. This guide documents the migration pattern for updating lesson JSON files.

## Completed Migrations
- ✅ 202-3A-series-circuits.json (COMPLETE)
- ✅ 202-4A-series-circuits-extended.json (COMPLETE)

## Remaining Lessons to Migrate
- 202-1A-electrical-quantities-units.json
- 202-2A-ohms-law.json
- 202-5A-power-energy.json
- 202-6A-magnetism-electromagnetism.json
- 202-7A-ac-principles.json
- 202-7B-how-ac-is-generated.json
- 202-7C-sine-wave-vocab.json
- 202-7D-transformers.json
- 201-1A-health-safety-legislation.json
- 203-1A-types-of-cables.json

## Migration Steps

### 1. Practice Blocks
**Remove these fields:**
- `answerType` - no longer needed
- `mode` - no longer needed (was 'conceptual', 'integrative', etc.)
- `marking` objects - not used by LLM
- `misconceptionMap` - not used by LLM
- `expectedKeywords` - deprecated
- `minimumKeywordMatch` - deprecated
- `options` and `correctOptionIndex` - MCQ not supported in practice blocks

**Update `expectedAnswer`:**
- Change from brief answer to comprehensive model answer
- Include explanation for calculations
- Example: `"12"` → `"12 Ω. Total resistance is 12 ohms because in series circuits, resistances add together: 5 + 7 = 12"`

**Keep these fields:**
- `id` - required
- `questionText` - required
- `expectedAnswer` - required (improved)
- `cognitiveLevel` - optional but useful
- `hint` - optional

### 2. Guided Practice Steps
**Remove these fields:**
- `marking` objects

**Keep:**
- All other fields remain the same
- `expectedAnswer` can be string or string array

### 3. Spaced Review Blocks
**Convert from string array to object array:**

Before:
```json
"questions": [
  "What is Ohm's Law?",
  "Calculate resistance..."
]
```

After:
```json
"questions": [
  {
    "id": "lesson-SR1",
    "questionText": "What is Ohm's Law?",
    "expectedAnswer": "Ohm's Law states V = I × R. Voltage equals current multiplied by resistance.",
    "hint": "Optional hint text"
  },
  {
    "id": "lesson-SR2",
    "questionText": "Calculate resistance...",
    "expectedAnswer": "Full answer with explanation"
  }
]
```

## TypeScript Type Enforcement

The updated types in `src/data/lessons/types.ts` will catch any remaining issues:

```typescript
// Practice Block Questions
questions: {
  id: string;
  questionText: string;
  expectedAnswer: string | string[];
  cognitiveLevel?: 'recall' | 'connection' | 'synthesis';
  hint?: string;
}[];

// Spaced Review Questions
questions: {
  id: string;
  questionText: string;
  expectedAnswer: string | string[];
  hint?: string;
}[];
```

## Benefits of Migration

1. **Simpler authoring** - Just write question and model answer
2. **Better evaluation** - LLM understands semantic meaning
3. **Consistent experience** - All questions marked the same way
4. **No keyword lists** - Natural language answers accepted
5. **Better feedback** - Contextual, educational responses

## Next Steps

1. Run TypeScript compiler to find remaining issues: `npm run type-check`
2. Update remaining lessons following the pattern above
3. Test each lesson after migration
4. Update any custom lesson authoring tools/scripts

## Notes

- Diagnostic Quiz questions remain MCQ (not affected by this migration)
- Multiple Choice Quiz questions remain MCQ (not affected)
- Only module lesson blocks (Practice, Guided Practice, Spaced Review) are affected
