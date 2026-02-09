# Phases 10-13: Lesson Improvement Prompts - Function Documentation

**Version**: 1.0  
**Date**: February 9, 2026  
**Purpose**: Comprehensive documentation describing how prompts 10-13 function to improve lesson quality

---

## Table of Contents

1. [Introduction](#introduction)
2. [Phase 10: Pedagogical Scoring](#phase-10-pedagogical-scoring)
3. [Phase 12: Full-Lesson Refinement](#phase-12-full-lesson-refinement)
4. [Phase 13: Rescore & Decision](#phase-13-rescore--decision)
5. [How Phases Work Together](#how-phases-work-together)
6. [Improvement Examples](#improvement-examples)
7. [Syllabus RAG Integration](#syllabus-rag-integration)
8. [Structure Preservation](#structure-preservation)
9. [Configuration & Thresholds](#configuration--thresholds)

---

## Introduction

### What Are Phases 10-13?

Phases 10-13 form an automated lesson improvement pipeline that runs after initial lesson generation (Phases 1-9). Unlike Phases 1-9 which create lessons from scratch, Phases 10-13 evaluate and refine existing lessons to improve their pedagogical quality.

### Why Do They Exist?

Even with careful prompt engineering in Phases 1-9, generated lessons may have:
- Undefined technical terms
- Questions testing untaught content
- Weak expectedAnswer arrays
- Misalignment with C&G 2365 syllabus requirements
- Unclear explanations for beginners

Phases 10-13 automatically identify and fix these issues, ensuring lessons meet high pedagogical standards.

### Pipeline Overview

```
Generated Lesson (Phases 1-9)
    ↓
Phase 10: Score lesson quality
    ↓ (if score < threshold)
Phase 12: Refine lesson content
    ↓
Phase 13: Validate improvements
    ↓
Final Lesson (original or improved)
```

**Note**: Phase 11 (patch-based suggestions) was replaced by Phase 12's holistic refinement approach. The current pipeline goes directly from Phase 10 to Phase 12.

---

## Phase 10: Pedagogical Scoring

### Function

Phase 10 evaluates lesson quality using pedagogical criteria anchored to the C&G 2365 syllabus. It acts as a diagnostic phase that identifies specific issues with precise locations.

### How It Works

#### 1. Syllabus Context Retrieval

**RAG (Retrieval Augmented Generation)**:
- Parses lesson ID to extract Unit and Learning Outcome
- Example: "203-3A12" → Unit 203, Learning Outcome LO3
- Retrieves relevant syllabus chunk containing:
  - Unit title and description
  - Learning Outcome title
  - All Assessment Criteria for that LO

**Why RAG Matters**:
- Ensures scoring is objective and syllabus-anchored
- Prevents subjective assessments
- Makes issues specific to qualification requirements
- Enables alignment gap identification

#### 2. Pedagogical Rubric Application

The prompt applies a 100-point rubric across 5 categories:

**A) Beginner Clarity (30 points)**
- Checks if technical terms are defined before use
- Evaluates language appropriateness for Level 2 apprentices
- Looks for concrete examples before abstractions
- Verifies common misconceptions are addressed

**B) Teaching-Before-Testing (25 points)**
- Ensures every question's answer is taught first
- Checks explanation → practice progression
- Identifies "cold" questions (testing untaught content)
- Validates clear learning progression

**C) Marking Robustness (20 points)**
- Evaluates expectedAnswer array comprehensiveness
- Checks if answers are gradeable by LLM
- Verifies answerType matches question complexity
- Ensures answer coverage matches question scope

**D) Alignment to LO/AC (15 points)**
- Checks if content addresses target Assessment Criteria
- Verifies examples match vocational context
- Ensures terminology matches syllabus wording
- Identifies missing AC coverage

**E) Question Quality (10 points)**
- Evaluates question clarity and unambiguity
- Checks cognitive level appropriateness
- Verifies smooth difficulty progression
- Identifies trick questions or gotchas

#### 3. Issue Identification

The prompt requires exactly 10 issues, each with:
- **ID**: Unique identifier (e.g., "ISSUE-1")
- **Category**: Which rubric category it violates
- **JSON Pointers**: RFC 6901 paths to exact locations (e.g., "/blocks/5/content/content")
- **Excerpt**: Relevant text snippet showing the problem
- **Problem**: Clear description of what's wrong
- **Why It Matters**: Pedagogical impact explanation
- **Alignment Gap**: How it violates LO/AC (if applicable)

**Why Exactly 10 Issues?**:
- Forces prioritization (most important issues first)
- Provides comprehensive coverage without overwhelming
- Enables systematic improvement
- Makes scoring consistent and comparable

### Prompt Structure

**System Prompt**:
- Defines role: "expert City & Guilds 2365 electrical installations assessor"
- Provides syllabus context (from RAG)
- Explains scoring rubric in detail
- Specifies output format requirements
- Enforces validation rules

**User Prompt**:
- Provides complete lesson JSON to score
- Includes additional user instructions (if any)
- Reminds about critical requirements
- Requests JSON-only output

### Output Format

```json
{
  "total": 67,
  "grade": "Usable",
  "syllabus": {
    "unit": "203",
    "unitTitle": "Wiring systems of electrical installations",
    "learningOutcome": "LO3",
    "loTitle": "Understand wiring systems...",
    "assessmentCriteria": ["3.1 ...", "3.2 ...", ...]
  },
  "breakdown": {
    "beginnerClarity": 22,
    "teachingBeforeTesting": 20,
    "markingRobustness": 12,
    "alignmentToLO": 6,
    "questionQuality": 7
  },
  "issues": [
    {
      "id": "ISSUE-1",
      "category": "alignmentToLO",
      "jsonPointers": ["/blocks/5/content/content"],
      "excerpt": "Missing AC 3.3 regarding current-carrying capacity",
      "problem": "Assessment Criterion 3.3 is completely omitted",
      "whyItMatters": "Students won't learn critical safety requirement",
      "alignmentGap": "Directly violates AC 3.3"
    },
    // ... 9 more issues
  ],
  "overallAssessment": "Lesson has good pedagogical flow but lacks syllabus alignment..."
}
```

### How It Improves Lessons

Phase 10 doesn't directly improve lessons - it diagnoses issues. However, it enables improvement by:
1. **Objective Assessment**: Syllabus-anchored scoring ensures lessons meet qualification requirements
2. **Precise Issue Location**: JSON Pointers enable targeted fixes
3. **Prioritization**: Top 10 issues focus improvement efforts
4. **Pedagogical Focus**: Issues address learning quality, not just structure

---

## Phase 12: Full-Lesson Refinement

### Function

Phase 12 generates a complete refined lesson JSON that addresses all pedagogical issues identified in Phase 10 while preserving structural integrity.

### How It Works

#### 1. Structure Signature Extraction

Before refinement, Phase 12 extracts immutable structure elements:
- Block count
- Block IDs (in order)
- Block types (in order)
- Block orders (in order)
- answerType fields (mapped by question ID)

**Why Extract Signature?**:
- Provides immutable constraints for LLM
- Enables validation after refinement
- Prevents accidental structural changes
- Maintains compatibility with progress tracking

#### 2. Holistic Refinement Prompt

The prompt instructs the LLM to:
- Output COMPLETE lesson JSON (not patches)
- Fix content within blocks to address issues
- Improve clarity, examples, explanations
- Enhance question wording and expectedAnswer arrays
- Preserve all structural elements exactly

**Key Prompt Elements**:

**Locked Structure Section**:
```
LOCKED STRUCTURE (IMMUTABLE - DO NOT CHANGE):
- Block count: 12 (MUST remain 12)
- Block IDs, types, and order values (MUST remain exactly as listed):
  1. ID: 202-4A#outcomes, Type: outcomes, Order: 1
  2. ID: 202-4A#vocab, Type: vocabulary, Order: 2
  ...
- answerType fields (MUST remain unchanged):
  - C1-L1-A: short-text
  - C1-L2: short-text
  ...
```

**Pedagogical Issues Section**:
```
PEDAGOGICAL ISSUES TO FIX:
Score: 67/100 (Usable)
Breakdown:
  - Beginner Clarity: 22/30
  - Teaching-Before-Testing: 20/25
  ...

Issues (10):
1. ISSUE-1 (alignmentToLO)
   Problem: Missing AC 3.3 regarding current-carrying capacity
   Why It Matters: Students won't learn critical safety requirement
   Alignment Gap: Directly violates AC 3.3
   ...
```

**Refinement Rules**:
- Output COMPLETE Lesson JSON
- Fix content within blocks
- Improve clarity, examples, explanations
- DO NOT change structure
- Preserve all schema fields

#### 3. Content Improvements Made

Phase 12 improves lessons by:

**Vocabulary Enhancements**:
- Adding definitions for undefined terms
- Clarifying technical jargon
- Adding boundary clauses for commonly confused terms

**Explanation Improvements**:
- Enhancing clarity for beginners
- Adding concrete examples
- Addressing common misconceptions
- Improving structure and flow

**Question Refinements**:
- Clarifying ambiguous wording
- Improving expectedAnswer arrays (more variants)
- Ensuring questions test taught content
- Better cognitive level alignment

**Syllabus Alignment**:
- Adding missing Assessment Criteria coverage
- Using syllabus terminology
- Matching vocational context
- Ensuring appropriate depth

#### 4. Structure Validation

After refinement, Phase 12 validates:
- Block count unchanged
- All block IDs preserved
- All block types preserved
- All block orders preserved
- All answerType fields unchanged

**Validation Failure Handling**:
- If validation fails, returns original lesson
- Logs specific validation errors
- Never ships structurally invalid lessons

### Prompt Structure

**System Prompt**:
- Defines role: "C&G 2365 pedagogical refinement expert"
- Provides syllabus context
- Lists locked structure (immutable constraints)
- Details pedagogical issues to fix
- Specifies refinement rules and priorities
- Requests complete JSON output

**User Prompt**:
- Provides original lesson JSON
- Includes additional user instructions (if any)
- Requests complete refined lesson output

### How It Improves Lessons

Phase 12 directly improves lessons by:
1. **Content Enhancement**: Better explanations, examples, vocabulary
2. **Question Quality**: Clearer wording, better expectedAnswer arrays
3. **Syllabus Alignment**: Addresses missing AC coverage
4. **Beginner-Friendliness**: More accessible language and examples
5. **Teaching-Before-Testing**: Ensures content is taught before questions

**Example Improvements**:

**Before (Phase 10 Issue)**:
```
ISSUE-2: Terms 'luminaires' and 'fused connection units' undefined
Location: /blocks/5/content/vocabulary
```

**After (Phase 12 Fix)**:
```json
{
  "vocabulary": "...\n\n**Luminaires**: Light fixtures including the bulb, shade, and housing.\n\n**Fused Connection Units (FCUs)**: Electrical outlets with built-in fuse protection for fixed appliances."
}
```

---

## Phase 13: Rescore & Decision

### Function

Phase 13 independently validates improvements by rescoring the candidate lesson and making a final accept/reject decision. It does not use LLM prompts - it uses Phase 10's scorer and applies deterministic decision logic.

### How It Works

#### 1. Independent Rescoring

Phase 13 uses Phase 10's scorer to independently evaluate the refined lesson:
- Same rubric
- Same syllabus context
- Same scoring criteria
- No bias from knowing it's a refinement

**Why Independent Rescoring?**:
- Validates improvements actually work
- Prevents confirmation bias
- Ensures objective assessment
- Provides comparable scores

#### 2. Score Comparison

Calculates improvement delta:
```typescript
improvement = candidateScore.total - originalScore.total
```

Provides detailed breakdown comparison:
```
                           Original    Candidate    Delta
  Beginner Clarity           22/30       28/30      +6
  Teaching-Before-Testing    20/25       24/25      +4
  Marking Robustness         12/20       18/20      +6
  Alignment to LO             6/15       12/15      +6
  Question Quality            7/10        9/10      +2
  ─────────────────────────────────────────────────────
  TOTAL                      67/100      91/100     +24
```

#### 3. Decision Logic

**Simple Rule**: Accept if candidate improves on original
```typescript
const improves = candidateScore.total > originalScore.total;
const accepted = improves;
```

**Conservative Approach**:
- Only accepts demonstrable improvements
- Prefers original over potentially broken improvements
- Never ships degraded content
- Returns best version (original or candidate)

**Decision Output**:
```typescript
{
  accepted: boolean;
  originalScore: number;
  candidateScore: number;
  improvement: number;
  finalLesson: Lesson;  // Original or candidate
  reason: string;
  originalScoreDetail?: Phase10Score;
  candidateScoreDetail?: Phase10Score;
}
```

### How It Improves Lessons

Phase 13 ensures improvements are validated:
1. **Quality Gate**: Only accepts demonstrably better lessons
2. **Objective Validation**: Independent rescoring prevents bias
3. **Conservative Safety**: Prefers original over risky improvements
4. **Detailed Feedback**: Score comparison shows what improved

---

## How Phases Work Together

### Complete Pipeline Flow

```
1. Lesson Generated (Phases 1-9)
   ↓
2. Phase 10: Score lesson
   - Retrieves syllabus context via RAG
   - Applies pedagogical rubric
   - Identifies 10 prioritized issues
   - Returns score + issues
   ↓
3. Check: Score < threshold? (default: 97)
   - If NO: Use original lesson
   - If YES: Continue to Phase 12
   ↓
4. Phase 12: Refine lesson
   - Extracts structure signature
   - Generates complete refined lesson JSON
   - Preserves all structural elements
   - Improves content quality
   - Validates structure preservation
   ↓
5. Phase 13: Rescore & decide
   - Independently rescores candidate
   - Compares with original score
   - Makes accept/reject decision
   - Returns best version
   ↓
6. Final Lesson
   - Original (if rejected or not improved)
   - Candidate (if accepted)
```

### Data Flow

**Phase 10 → Phase 12**:
- Phase 10 score and issues passed to Phase 12
- Syllabus context reused
- Issues guide refinement priorities

**Phase 12 → Phase 13**:
- Refined lesson JSON passed to Phase 13
- Original lesson also passed for comparison
- Phase 10 score reused for comparison

**Phase 13 → Final**:
- Decision (accept/reject) determines final lesson
- Detailed comparison provided for analysis
- Both score details available for debugging

### Error Handling

**Conservative Philosophy**: If anything goes wrong, keep original lesson

**Phase 10 Failure**:
- Pipeline doesn't start
- Original lesson used

**Phase 12 Failure**:
- Structure validation fails
- Original lesson used
- Errors logged for debugging

**Phase 13 Rejection**:
- Candidate doesn't improve
- Original lesson used
- Comparison logged for analysis

---

## Improvement Examples

### Example 1: Vocabulary Enhancement

**Phase 10 Issue**:
```json
{
  "id": "ISSUE-2",
  "category": "beginnerClarity",
  "jsonPointers": ["/blocks/2/content/vocabulary"],
  "excerpt": "Terms 'luminaires' and 'fused connection units' used but not defined",
  "problem": "Technical terms appear in explanation but not in vocabulary section",
  "whyItMatters": "Level 2 apprentices may not know these terms, causing confusion"
}
```

**Phase 12 Fix**:
```json
{
  "vocabulary": "...\n\n**Luminaires**: Light fixtures including the bulb, shade, and housing.\n\n**Fused Connection Units (FCUs)**: Electrical outlets with built-in fuse protection, commonly used for fixed appliances like boilers or extractor fans."
}
```

**Result**: Beginner Clarity score improves from 22/30 to 28/30 (+6 points)

### Example 2: Teaching-Before-Testing Fix

**Phase 10 Issue**:
```json
{
  "id": "ISSUE-3",
  "category": "teachingBeforeTesting",
  "jsonPointers": ["/blocks/8/content/questions/0/expectedAnswer"],
  "excerpt": "Acronym 'CPC' expected but never taught",
  "problem": "Question accepts 'CPC' as answer but term never introduced",
  "whyItMatters": "Students tested on untaught content, causing frustration"
}
```

**Phase 12 Fix**:
- Adds "CPC" definition to vocabulary block
- Expands explanation to introduce "Circuit Protective Conductor (CPC)"
- Updates expectedAnswer to include variants: ["CPC", "Circuit Protective Conductor", "protective conductor"]

**Result**: Teaching-Before-Testing score improves from 20/25 to 24/25 (+4 points)

### Example 3: Syllabus Alignment

**Phase 10 Issue**:
```json
{
  "id": "ISSUE-1",
  "category": "alignmentToLO",
  "jsonPointers": ["/blocks/5/content/content"],
  "excerpt": "Missing AC 3.3 regarding current-carrying capacity",
  "problem": "Assessment Criterion 3.3 is completely omitted",
  "whyItMatters": "Students won't learn critical safety requirement",
  "alignmentGap": "Directly violates AC 3.3: 'Determine minimum current-carrying capacity...'"
}
```

**Phase 12 Fix**:
- Adds new section to explanation covering current-carrying capacity
- Includes worked example calculating minimum capacity
- Adds practice question testing AC 3.3
- Uses syllabus terminology exactly

**Result**: Alignment to LO score improves from 6/15 to 12/15 (+6 points)

### Example 4: Marking Robustness

**Phase 10 Issue**:
```json
{
  "id": "ISSUE-4",
  "category": "markingRobustness",
  "jsonPointers": ["/blocks/8/content/questions/2/expectedAnswer"],
  "excerpt": "expectedAnswer has only 1 variant, too narrow",
  "problem": "Answer array too restrictive, may reject valid responses",
  "whyItMatters": "LLM marking may incorrectly mark correct answers"
}
```

**Phase 12 Fix**:
- Expands expectedAnswer from ["ring circuit"] to:
  - ["ring circuit", "ring final circuit", "ring final", "ring"]
- Adds normalization variants (with/without articles, pluralization)
- Keeps variants tight (no broad paraphrases)

**Result**: Marking Robustness score improves from 12/20 to 18/20 (+6 points)

---

## Syllabus RAG Integration

### How RAG Works

**Retrieval Augmented Generation** enhances Phase 10 scoring by providing relevant syllabus context:

1. **Lesson ID Parsing**:
   - "203-3A12" → Unit 203, Learning Outcome LO3
   - Extracts unit number and LO identifier

2. **Syllabus Chunk Retrieval**:
   - Tries exact match: Unit + LO
   - Falls back to BM25 search if no exact match
   - Returns most relevant syllabus chunk

3. **Context Injection**:
   - Injects syllabus context into Phase 10 prompt
   - Enables objective, syllabus-anchored assessment
   - Makes issues specific to qualification requirements

### Syllabus Context Structure

```typescript
{
  unit: "203",
  unitTitle: "Wiring systems of electrical installations",
  learningOutcome: "LO3",
  loTitle: "Understand wiring systems for different types of electrical installations",
  assessmentCriteria: [
    "3.1 State the types of wiring systems and their applications",
    "3.2 Identify wiring systems for different environments",
    "3.3 Determine minimum current-carrying capacity and voltage drop for wiring systems",
    "3.4 State applications of different types of protective devices",
    "3.5 Identify specialised equipment for installing wiring systems",
    "3.6 Calculate spacing factor of wiring enclosures"
  ]
}
```

### Why RAG Matters

**Without RAG**:
- Subjective assessments
- Inconsistent scoring
- No syllabus alignment
- Generic issues

**With RAG**:
- Objective, syllabus-anchored scoring
- Consistent across lessons
- Specific AC alignment checks
- Qualification-focused issues

---

## Structure Preservation

### Why Structure Must Be Preserved

Lesson structure is deeply integrated into the system:

1. **Progress Tracking**: User progress stored by block ID
2. **Quiz Generation**: Questions reference specific blocks
3. **Spaced Review**: Foundation checks reference prerequisite blocks
4. **UI Rendering**: Block types determine which component renders
5. **Marking System**: answerType affects validation logic

### Immutable Elements

**Block Count**:
- Must remain identical
- Changing count breaks progress tracking

**Block IDs**:
- Must remain unchanged
- Used as stable references throughout system

**Block Types**:
- Must remain unchanged
- Determine rendering and behavior

**Block Orders**:
- Must remain unchanged
- Define lesson sequence and flow

**answerType Fields**:
- Must remain unchanged
- Affect UI rendering and validation

### How Preservation Is Enforced

**Phase 12 Prompt**:
- Explicitly lists locked structure
- Warns against structural changes
- Provides structure signature

**Phase 12 Validation**:
- Extracts structure signature before refinement
- Validates after refinement
- Rejects if structure changed

**Error Handling**:
- If validation fails, returns original lesson
- Never ships structurally invalid lessons
- Logs specific validation errors

---

## Configuration & Thresholds

### Activation Threshold

**Default**: 97/100

**Configuration**:
```typescript
// src/lib/generation/config.ts
refinement: {
  enabled: true,
  scoreThreshold: 97,  // Activate if score < 97
  saveOriginal: true,
  autoApply: true
}
```

**Behavior**:
- If initial score >= threshold: Skip pipeline, use original
- If initial score < threshold: Run pipeline, attempt improvement

### Model Configuration

**Default**: Uses same model as generation (from `GEMINI_MODEL` env var)

**Phase-Specific**:
- Phase 10: Uses `getPhase10Model()` (defaults to `GEMINI_MODEL`)
- Phase 12: Uses `getPhase10Model()` (same as Phase 10)
- Phase 13: No LLM calls (uses Phase 10 scorer)

### Debug Artifacts

**When Enabled**:
- Saves complete pipeline artifacts
- Includes prompts, responses, scores, comparisons
- Useful for analyzing improvement effectiveness

**Configuration**:
```typescript
debugArtifacts: {
  enabled: true,
  outputPath: 'reports/phase10_runs',
  scoreStability: {
    enabled: false,
    runs: 3
  },
  issueTracking: {
    enabled: true,
    usePointers: true
  }
}
```

---

## Summary

### What Phases 10-13 Do

1. **Phase 10**: Diagnoses pedagogical issues with syllabus-anchored scoring
2. **Phase 12**: Generates improved lesson content while preserving structure
3. **Phase 13**: Validates improvements and makes final decision

### How They Improve Lessons

1. **Objective Assessment**: Syllabus RAG ensures qualification alignment
2. **Precise Issue Location**: JSON Pointers enable targeted fixes
3. **Holistic Refinement**: Complete lesson regeneration improves all aspects
4. **Structure Preservation**: Maintains compatibility with system integration
5. **Conservative Validation**: Only accepts demonstrable improvements

### Key Benefits

- **Automated Quality Assurance**: No manual editing needed
- **Syllabus Alignment**: Ensures C&G 2365 requirements met
- **Consistent Improvement**: Same rubric across all lessons
- **Safe Refinement**: Never ships degraded content
- **Full Observability**: Detailed logging and artifacts

### Success Metrics

Typical improvements:
- Beginner Clarity: +4 to +8 points
- Teaching-Before-Testing: +3 to +5 points
- Marking Robustness: +4 to +8 points
- Alignment to LO: +4 to +9 points
- Question Quality: +1 to +3 points
- **Total**: +15 to +30 point improvements common

---

**Document Version**: 1.0  
**Last Updated**: February 9, 2026  
**Related Documentation**:
- `phases_prompts.md` - Detailed prompt documentation
- `phase10_13.md` - Technical implementation details
- `app_des.md` - High-level overview
