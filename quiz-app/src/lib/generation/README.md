# Lesson Generator System

Automated lesson generation using Gemini AI to create complete lessons and quizzes following the lesson factory templates.

## Overview

This system automates the creation of:
- Complete lesson JSON files (8-10 blocks)
- Quiz TypeScript files (50 questions with misconception mapping)
- Automatic integration into 7 codebase files
- Git branch creation and auto-commit

## Quick Start

### Access the Generator

Navigate to `/generate` in your browser to access the web UI.

### Generate a Lesson

1. Fill in the form:
   - Unit Number (201, 202, 203, etc.)
   - Lesson ID (e.g., "7E")
   - Topic (e.g., "Capacitors in AC Circuits")
   - Section (Science 2365 Level 2, etc.)
   - Layout (auto, split-vis, or linear-flow)
   - Prerequisites (optional, comma-separated)

2. Click "Generate Lesson"

3. Wait 2-5 minutes for generation

4. Review the created git branch before merging

## Architecture

```
User Form → API Route → Pipeline:
  1. Generate Lesson (LLM)
  2. Validate Lesson
  3. Generate Quiz (LLM, 50 questions in batches)
  4. Validate Quiz
  5. Write Files
  6. Integrate (update 7 files)
  7. Git Commit & Push
```

## Files Created Per Lesson

### New Files (2)
1. `src/data/lessons/{unit}-{id}-{topic}.json` - Lesson content
2. `src/data/questions/{topic}Questions.ts` - 50 quiz questions

### Auto-Updated Files (7)
1. `src/data/questions/index.ts` - Import and export
2. `src/data/questions.ts` - Add to main array
3. `src/data/lessons/lessonIndex.ts` - Register lesson
4. `src/app/learn/[lessonId]/page.tsx` - Import and registry
5. `src/app/learn/page.tsx` - Import and array
6. `src/data/questions/types.ts` - New tags (if any)
7. `src/lib/marking/misconceptionCodes.ts` - New codes (if any)

## Environment Variables

Add to `.env`:

```bash
# Lesson Generator (optional, defaults shown)
LESSON_GENERATOR_ENABLED=true
LESSON_GENERATOR_AUTO_COMMIT=true
LESSON_GENERATOR_AUTO_PUSH=true
```

## Rate Limiting

- **Limit**: 5 generations per hour per IP
- **Reason**: Prevent API abuse and manage costs
- **Reset**: Headers include `X-RateLimit-Reset` timestamp

## Validation

The system validates:
- JSON structure correctness
- Required blocks present (outcomes, vocab, etc.)
- Question IDs are unique
- Misconception codes are valid
- Tags are from approved list
- Basic formula correctness
- Difficulty distribution (~30/50/20)

## Error Handling

On error, the system:
1. Deletes generated files
2. Reverts integration changes (warns about manual review)
3. Rolls back git branch
4. Returns detailed error message

## Quality Standards

Generated lessons must meet:
- 8-10 blocks in correct order
- 3-4 learning outcomes (Bloom's taxonomy)
- 4-6 vocabulary terms
- 400-600 word explanations
- Understanding checks (3×L1 Recall + 1×L2 Connection)
- 3-5 practice questions
- 1 integrative question
- 4 spaced review questions
- 50 quiz questions (15 easy, 25 medium, 10 hard)

## Troubleshooting

### Generation Fails
- Check GEMINI_API_KEY is set in .env
- Check rate limit (wait 1 hour)
- Check API logs in terminal

### Files Not Integrated
- Check git status for uncommitted changes
- Manually review the 7 integration files
- Run `npm run build` to check for errors

### Git Push Fails
- Check git remote is configured
- Check you have push permissions
- Files are still generated locally

### Lesson Doesn't Appear
- Restart dev server: `npm run dev`
- Check `learn/page.tsx` has the import
- Check `learn/[lessonId]/page.tsx` has the import

## Testing Checklist

After generating a lesson:

1. ✅ Restart dev server
2. ✅ Navigate to `/learn`
3. ✅ Verify lesson appears in list
4. ✅ Click lesson, check all blocks render
5. ✅ Complete lesson, verify quiz button
6. ✅ Take quiz, verify 50 questions
7. ✅ Test cumulative quiz button
8. ✅ Check git branch on GitHub
9. ✅ Review commit message
10. ✅ Merge branch if quality approved

## API Endpoint

### POST /api/lesson-generator

**Request:**
```json
{
  "unit": 202,
  "lessonId": "7E",
  "topic": "Capacitors in AC Circuits",
  "section": "Science 2365 Level 2",
  "layout": "split-vis",
  "prerequisites": ["202-7A", "202-7B"]
}
```

**Response:**
```json
{
  "success": true,
  "lessonFile": "202-7E-capacitors-ac-circuits.json",
  "quizFile": "capacitorsAcCircuitsQuestions.ts",
  "branchName": "feat/lesson-202-7E-1234567890",
  "branchUrl": "https://github.com/user/repo/tree/feat/lesson-202-7E-1234567890",
  "warnings": []
}
```

## Future Enhancements

- Diagram generation (currently placeholder)
- Batch generation (multiple lessons)
- Template customization UI
- Quality scoring
- A/B testing of prompts
- Automated deployment

## Support

For issues or questions, check:
- `/reports/lesson_factory/` - Template documentation
- `/reports/lesson_guide/` - Complete lesson guide
- API logs in terminal
- Generated git branch for review

## Version

**Version**: 1.0.0  
**Last Updated**: 2026-01-22  
**Status**: Production Ready
