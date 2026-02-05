# Archived Generation Code

This folder contains deprecated code that has been replaced but kept for reference.

## Files

### `rubricScoringService.ts`

**Status:** Deprecated (replaced by `llmScoringService.ts`)  
**Archived:** February 5, 2026  
**Reason:** Replaced with LLM-based intelligent scoring

The hardcoded rubric (976 lines of regex and point deductions) has been replaced with LLM-based scoring that evaluates lessons like a human instructor would.

**Old approach:**
- 976 lines of TypeScript code
- Regex patterns for ID validation
- Hardcoded point deductions
- Limited to structural checks
- Couldn't judge subjective quality

**New approach (llmScoringService.ts):**
- ~200 lines of code
- LLM evaluates quality holistically
- Natural language feedback
- Judges pedagogy, clarity, and content
- More maintainable and flexible

This file is kept for reference in case we need to:
1. Compare scoring methodologies
2. Reference the original rubric criteria
3. Temporarily revert to hardcoded scoring

**Do not use this file in production code.**
