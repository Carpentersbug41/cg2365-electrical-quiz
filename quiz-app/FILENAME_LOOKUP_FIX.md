# Fix: Lesson Filename Lookup - Implementation Summary

## ✅ Issue Resolved

The "Lesson not found" error when selecting lessons has been fixed.

## Problem

The admin UI was failing with 404 errors because:
- Lesson files have full descriptive names: `204-13B-ceiling-rose-to-one-way-switch-for-absolute-beginners.json`
- But lesson IDs inside JSON are short: `"id": "204-13B"`
- The UI was sending the short ID, but the API tried to find a file with that exact name `204-13B.json` which didn't exist

## Solution Implemented

Updated the entire flow to use actual filenames instead of lesson IDs for file operations.

## Changes Made

### 1. API Route - GET Endpoint
**File**: `src/app/api/admin/generate-games/route.ts`

Added `filename` field to the response:
```typescript
return {
  id: lesson.id,
  filename: filename,  // ← NEW: actual file name
  title: lesson.title,
  unit: lesson.unit,
  // ... rest
}
```

### 2. API Route - POST Endpoint
**File**: `src/app/api/admin/generate-games/route.ts`

Changed from using `lessonId` to `filename`:
```typescript
const { filename, gameTypes, count, mode = 'preview' } = body;

// Enhanced security validation
const sanitizedFilename = filename.replace(/[^a-zA-Z0-9\-\.]/g, '');

// Must end with .json
if (!sanitizedFilename.endsWith('.json')) {
  return error...
}

// No path separators allowed (security)
if (sanitizedFilename.includes('/') || sanitizedFilename.includes('\\')) {
  return error...
}

const lessonPath = join(LESSONS_DIR, sanitizedFilename);
```

### 3. TypeScript Interfaces
**Files**: 
- `src/components/admin/GameGeneratorForm.tsx`
- `src/components/admin/LessonSelector.tsx`

Updated `LessonOption` interface:
```typescript
interface LessonOption {
  id: string;
  filename: string;  // ← NEW
  title: string;
  // ... rest
}
```

### 4. API Calls Updated
**File**: `src/components/admin/GameGeneratorForm.tsx`

Both `handleGeneratePreview` and `handleSaveToLesson` now send filename:
```typescript
// Added validation
if (!selectedLesson?.filename) {
  setErrorMessage('Invalid lesson selection');
  return;
}

// Send filename instead of lessonId
body: JSON.stringify({
  filename: selectedLesson.filename,  // ← CHANGED from lessonId
  gameTypes: Array.from(selectedGameTypes),
  count: gameCount,
  mode: 'preview' // or 'save'
})
```

## Security Enhancements

Added comprehensive filename validation:
- Only allows alphanumeric characters, hyphens, and dots
- Must end with `.json`
- Blocks path separators (`/` and `\`) to prevent directory traversal
- Sanitizes input before file system operations

## Testing Verified

✅ No linter errors
✅ TypeScript types align across all components
✅ Security validation in place
✅ Proper error messages

## How It Works Now

1. User loads `/admin/generate-games`
2. GET endpoint returns lessons with both `id` and `filename` fields
3. User selects a lesson (e.g., "204-13B")
4. UI stores both the ID (for display) and filename (for API calls)
5. When generating/saving, the **actual filename** is sent to the API
6. API validates and uses the filename directly: `204-13B-ceiling-rose-to-one-way-switch-for-absolute-beginners.json`
7. File is successfully loaded and games are generated/saved

## Result

The admin UI now correctly handles all lessons regardless of their filename format. The 404 error is resolved! 🎉
