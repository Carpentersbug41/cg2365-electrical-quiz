# Phase 10 Nested Folders Implementation Complete

## Summary

Successfully restructured the Phase 10 debug harness to:
1. ✅ Save each run in its own folder (instead of flat files with long prefixes)
2. ✅ Generate a single combined markdown file (`COMBINED.md`) with all run information

## Changes Made

### 1. Phase10RunRecorder.ts - Folder Structure

**File:** `quiz-app/src/lib/generation/Phase10RunRecorder.ts`

#### startRun() Method
- **Before:** Created flat directory and used runId prefixes on all files
- **After:** Creates nested folder structure `<outputPath>/<runId>/`

```typescript
// NEW: Each run gets its own folder
const baseDir = path.isAbsolute(config.outputPath)
  ? config.outputPath
  : path.join(process.cwd(), config.outputPath);

this.runDir = path.join(baseDir, this.runId);  // Nested folder
```

#### File Writing Methods
- Removed `runId` prefix from all filenames
- Files now saved directly with their simple names: `00_input_lesson.json`, `INDEX.json`, etc.
- Updated methods:
  - `writeJson()`
  - `writeText()`
  - `writeDiff()`
  - `recordScore()`
  - `recordValidation()`
  - `recordParseResult()`
  - `recordApplyResult()`
  - `finalize()`

### 2. Phase10RunRecorder.ts - Combined Markdown File

**Added new method:** `generateCombinedMarkdown()`

This method creates a comprehensive markdown file containing:

1. **Header Section:**
   - Run ID
   - Lesson ID
   - Strategy (rewrite/patch)
   - Timestamp
   - Status

2. **Summary Section:**
   - Score Before/After
   - Delta (improvement in points)
   - Validation status (✅ PASSED / ❌ FAILED)
   - Warning count
   - Failure details (if any)

3. **File Contents:**
   - INDEX.json (full manifest)
   - 01_score_before.json
   - 11_score_after.json
   - 02_prompt_rewrite.json
   - 03_output_rewrite.txt (raw model output)
   - 16_validation.json
   - 17_diff.txt

4. **Footer:**
   - Generation timestamp
   - Total file count

#### finalize() Method Updated
Now writes **both** `INDEX.json` and `COMBINED.md`:

```typescript
// Write INDEX.json
const indexPath = path.join(this.runDir, 'INDEX.json');
fs.writeFileSync(indexPath, JSON.stringify(this.indexData, null, 2), 'utf-8');

// Generate and write combined markdown file
const combined = this.generateCombinedMarkdown();
const combinedPath = path.join(this.runDir, 'COMBINED.md');
fs.writeFileSync(combinedPath, combined, 'utf-8');
```

### 3. Configuration Documentation

**File:** `quiz-app/src/lib/generation/config.ts`

Updated comment to reflect new structure:
```typescript
/**
 * Output path for Phase 10 run artifacts
 * Default: 'reports/phase10_runs'
 * Each run is saved in its own folder: <outputPath>/<runId>/
 * Example: reports/phase10_runs/203-3D__2026-02-07T10-32-18-123Z__rewrite__model/
 */
```

### 4. Documentation Update

**File:** `reports/phase10_runs/.gitkeep`

Completely rewritten to document:
- New folder structure
- Folder name format
- COMBINED.md purpose and benefits
- Configuration options
- Use cases

## New Folder Structure

### Before (Flat Files)
```
reports/phase10_runs/
  - 203-3A1__2026-02-07T12-42-04-044Z__rewrite__model__00_input_lesson.json
  - 203-3A1__2026-02-07T12-42-04-044Z__rewrite__model__01_score_before.json
  - 203-3A1__2026-02-07T12-42-04-044Z__rewrite__model__INDEX.json
  ... (10+ files with long prefixed names)
```

### After (Nested Folders)
```
reports/phase10_runs/
  - 203-3A1__2026-02-07T12-42-04-044Z__rewrite__gemini-2-5-flash/
    - 00_input_lesson.json
    - 01_score_before.json
    - 02_prompt_rewrite.json
    - 03_output_rewrite.txt
    - 10_output_lesson.json
    - 11_score_after.json
    - 14_patches_parsed.json
    - 16_validation.json
    - 17_diff.txt
    - INDEX.json
    - COMBINED.md  ← NEW: All data in one file
```

## Benefits

### 1. Better Organization
- Each run isolated in its own folder
- Easy to browse, archive, or delete specific runs
- Clear folder hierarchy

### 2. Clean Filenames
- No more long prefixed names
- Simple numbered files: `00_`, `01_`, `10_`, etc.
- Easy to find and open specific files

### 3. Single-File Access (COMBINED.md)
- **Everything in one file** for quick review
- Can copy/paste entire run for sharing
- Searchable with Ctrl+F
- Markdown formatting for readability
- Opens in any editor or GitHub

### 4. Easy Sharing
- Copy one folder → share entire run
- Or copy just `COMBINED.md` → share complete analysis
- Archive runs by zipping folders

## Usage

### View a Run
1. Navigate to `reports/phase10_runs/`
2. Find your run folder (sorted by timestamp)
3. Open `COMBINED.md` for quick overview
4. Or open individual files for deep dive

### Share a Run
**Option 1 (Complete):**
```bash
# Copy entire folder
cp -r "203-3A1__2026-02-07T12-42-04-044Z__rewrite__model" /shared/location/
```

**Option 2 (Quick):**
```bash
# Copy just COMBINED.md
cp "203-3A1__2026-02-07T12-42-04-044Z__rewrite__model/COMBINED.md" ./analysis.md
```

### Search Across Runs
```bash
# Find all runs with validation failures
grep -r "FAILED" reports/phase10_runs/*/COMBINED.md

# Find runs with score improvements > 10 points
grep -r "Delta: +[1-9][0-9]" reports/phase10_runs/*/COMBINED.md
```

## Testing

The dev server is now running at http://localhost:3000

To test:
1. Navigate to the Improve Lesson page
2. Select a lesson (e.g., 203-3D)
3. Click "Improve Lesson"
4. Watch console for recorder logs
5. Check `reports/phase10_runs/` for new folder
6. Open `COMBINED.md` to see the complete report

Expected console output:
```
📁 [Phase10Recorder] Run artifacts will be saved to: C:\Users\carpe\Desktop\hs_quiz\reports\phase10_runs\203-3D__2026-02-07T...
   ✓ Wrote 00_input_lesson.json
   ✓ Wrote 01_score_before.json
   ✓ Wrote 02_prompt_rewrite.json
   ✓ Wrote 03_output_rewrite.txt
   ✓ Wrote 10_output_lesson.json
   ✓ Wrote 11_score_after.json
   ✓ Wrote 16_validation.json
   ✓ Wrote 17_diff.txt
   ✓ Wrote INDEX.json
   ✓ Wrote COMBINED.md

📦 [Phase10Recorder] Finalized: 11 files written
📁 [Phase10Recorder] Folder: C:\Users\carpe\Desktop\hs_quiz\reports\phase10_runs\203-3D__2026-02-07T...
```

## Files Modified

1. ✅ `quiz-app/src/lib/generation/Phase10RunRecorder.ts`
   - Reverted to folder-per-run structure
   - Removed filename prefixes
   - Added `generateCombinedMarkdown()` method
   - Updated `finalize()` to write COMBINED.md

2. ✅ `quiz-app/src/lib/generation/config.ts`
   - Updated comment to reflect folder structure

3. ✅ `reports/phase10_runs/.gitkeep`
   - Completely rewritten documentation

## Implementation Complete ✅

All tasks from the plan have been completed:
- ✅ Revert to folder-per-run structure
- ✅ Add generateCombinedMarkdown method
- ✅ Write COMBINED.md in finalize()
- ✅ Update documentation

The Phase 10 debug harness now provides:
- Clean folder-based organization
- Comprehensive single-file reporting
- Easy sharing and archiving
- Better developer experience
