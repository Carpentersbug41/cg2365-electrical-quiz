# TypeScript Errors Found During Vercel Deployment

## Date: January 29, 2026

### Build-Blocking Errors

#### 1. `quiz-app/src/app/learn/page.tsx` - Line 44

**Error Type:** `@typescript-eslint/no-explicit-any`

**Location:** `sortLessonsByIdNaturally` function parameters

**Original Code:**
```typescript
function sortLessonsByIdNaturally(a: any, b: any) {
```

**Error Messages:**
- Line 44:38 - Error: Unexpected any. Specify a different type.
- Line 44:46 - Error: Unexpected any. Specify a different type.

**Fix Applied:**
```typescript
function sortLessonsByIdNaturally(a: { id: string }, b: { id: string }) {
```

**Explanation:**
The function only uses the `id` property from the lesson objects, so we can type the parameters as objects with an `id` string property instead of using `any`. This maintains type safety while being specific about what properties are actually needed.

**Status:** ✅ Fixed and deployed

---

## Notes

- These were the only **errors** that blocked the build
- There were many **warnings** (unused variables, etc.) but these don't prevent deployment
- The build now passes successfully after fixing the `any` types
- All changes have been committed and pushed to `main` branch
- Vercel deployment completed successfully after the fix
