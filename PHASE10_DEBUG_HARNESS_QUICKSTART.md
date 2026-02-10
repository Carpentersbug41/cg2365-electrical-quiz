# Phase 10 Debug Harness - Quick Reference

## Enable/Disable

### Enable (Default in Development)
```bash
# In .env
PHASE10_DEBUG_ARTIFACTS=1
```

### Disable
```bash
# In .env
PHASE10_DEBUG_ARTIFACTS=0
```

## Artifact Location

```
reports/phase10_runs/<lessonId>/<runId>/
```

Example:
```
reports/phase10_runs/203-3D/2026-02-07T10-32-18-123Z__rewrite__gemini-2-0-flash-exp/
```

## File Manifest

| File | Description |
|------|-------------|
| `INDEX.json` | Master manifest with metadata, scores, status |
| `00_input_lesson.json` | Original lesson before Phase 10 |
| `01_score_before.json` | Scoring breakdown before refinement |
| `02_prompt_rewrite.json` | Prompt sent to model (v2) |
| `03_output_rewrite.txt` | Raw model output (unparsed) |
| `10_output_lesson.json` | Final lesson after Phase 10 |
| `11_score_after.json` | Scoring breakdown after refinement |
| `14_patches_parsed.json` | Parsed patches (if any) |
| `16_validation.json` | Per-validator results |
| `17_diff.txt` | Human-readable before/after diff |

## Common Debug Workflows

### 1. Why did Phase 10 fail?

```bash
# Check INDEX.json for status
cat INDEX.json | grep -A5 "status\|failure"

# If parse error, check:
cat 03_output_rewrite.txt  # Raw model output
cat 14_patches_parse_error.json  # Parse error details

# If validation error, check:
cat 16_validation.json  # Which validator failed

# If score gate error, check:
cat 01_score_before.json | grep "total"
cat 11_score_after.json | grep "total"
```

### 2. Is the prompt good?

```bash
# Read prompt
cat 02_prompt_rewrite.json

# Check score feedback in prompt
jq '.user' 02_prompt_rewrite.json | grep -A10 "Issues by Section"
```

### 3. What did the model actually return?

```bash
# Raw output (exactly what model returned)
cat 03_output_rewrite.txt

# Check for malformed JSON, extra text, etc.
head -20 03_output_rewrite.txt
tail -20 03_output_rewrite.txt
```

### 4. What actually changed?

```bash
# Human-readable diff
cat 17_diff.txt

# Or compare JSONs directly
diff -u 00_input_lesson.json 10_output_lesson.json
```

### 5. Did scoring work correctly?

```bash
# Compare section-by-section
jq '.details[] | {section, score, maxScore, issues}' 01_score_before.json
jq '.details[] | {section, score, maxScore, issues}' 11_score_after.json
```

## Debugging Commands

### Find all failed runs
```bash
find reports/phase10_runs -name "INDEX.json" -exec grep -l '"status": "failed"' {} \;
```

### Count runs by lesson
```bash
ls -d reports/phase10_runs/*/ | wc -l
```

### Find runs with score regression
```bash
find reports/phase10_runs -name "INDEX.json" -exec jq 'select(.scoreAfter.total < .scoreBefore.total) | .runId' {} \;
```

### Check for API key leaks (should return nothing)
```bash
grep -r "AIza" reports/phase10_runs/
```

## Troubleshooting

### Artifacts not being created?

Check:
1. Is `PHASE10_DEBUG_ARTIFACTS=1` in `.env`?
2. Is `NODE_ENV=development`?
3. Does `reports/phase10_runs/` directory exist?
4. Check console for recorder errors

### Recorder throwing errors?

Check console output:
```
📁 [Phase10Recorder] Run artifacts will be saved to: ...
✓ Wrote 00_input_lesson.json
✓ Wrote 01_score_before.json
...
```

If you see errors, check:
- Disk space
- Write permissions on `reports/` directory
- Valid lesson JSON (not corrupted)

### Missing files in run directory?

Some files are conditional:
- `14_patches_parse_error.json` only on parse failure
- `11_score_after.json` only if Phase 10 completed scoring
- `17_diff.txt` only if refinement succeeded

## Performance Impact

- **Enabled:** ~50-100ms overhead per run (file I/O)
- **Disabled:** 0ms overhead (code path skipped entirely)

## Security

All artifacts are automatically redacted:
- API keys (pattern: `AIza...`)
- Authorization headers
- Tokens and secrets

Safe to share for debugging without exposing credentials.

## Support

See full implementation details in:
`PHASE10_DEBUG_HARNESS_COMPLETE.md`
