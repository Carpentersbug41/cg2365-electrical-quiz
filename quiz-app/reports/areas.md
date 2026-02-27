# Adding A New Subject Area (Step-by-Step)

This guide explains how to add a new subject route like `/gcse/science/physics` without interfering with existing areas like `/2365`.

## 1. Choose the route and scope rules

1. Pick the public URL prefix, for example:
   - `/gcse/science/physics`
2. Pick a unique unit-code namespace for that subject:
   - Example used now: `PHY-*`
3. Add/confirm scope mapping in:
   - `src/lib/routing/curricula.ts`
   - `src/lib/routing/curriculumScope.ts`
4. Ensure scope helpers enforce separation:
   - `isUnitAllowedForScope(...)`
   - `isLessonIdAllowedForScope(...)`

## 2. Add homepage entry

1. Update `src/app/page.tsx`.
2. Add a card/link pointing to the new route’s learn page:
   - Example: `/gcse/science/physics/learn`

## 3. Ensure learn pages are scope-filtered

1. Update `src/app/learn/page.tsx`:
   - Filter lessons by `isLessonIdAllowedForScope(...)`
   - Do not show all lessons by default.
2. Update `src/app/learn/[lessonId]/page.tsx`:
   - Add server-side guard; cross-scope lessons should return `404`.
3. Verify:
   - `/2365/learn` shows only 2365 lessons.
   - New subject route shows only its own lessons.

## 4. Scope admin routes and APIs

1. Reuse referer/path-based scope resolution in admin APIs:
   - `getCurriculumScopeFromReferer(...)`
2. Ensure module/question APIs reject out-of-scope IDs.
3. Confirm admin URLs work under subject route:
   - Example: `/gcse/science/physics/admin/module`

## 5. Upload and parse syllabus for the new area

1. Upload from scoped admin page (not 2365 admin).
2. Confirm upload response indicates correct curriculum scope.
3. Populate and verify:
   - Units detected
   - LO counts
   - AC counts
4. If parsing fails, fix parser patterns before generating lessons.

## 6. Make lesson generation subject-aware

1. In module planner adapter, infer/send curriculum from unit prefix.
2. Support string unit codes (e.g. `PHY-4`) end-to-end.
3. Remove numeric-only assumptions in adapter/generation utilities.
4. Ensure `section` defaults are curriculum-appropriate.

## 7. Keep shared functionality, separate content

1. Shared code should stay shared:
   - upload flow
   - planner pipeline
   - generate/regenerate/delete actions
2. Content/prompts/data must be scoped by curriculum:
   - syllabus versions
   - unit/LO/AC structures
   - lesson lists
   - question runs

## 8. Add admin controls needed for iteration

1. Per lesson row in module matrix:
   - `Generate Lesson`
   - `Regenerate` (failed rows)
   - `Delete Lesson` (run-level lesson state)
2. Keep run-level delete separate from lesson-level delete.

## 9. Test matrix (must pass before using)

1. Route separation:
   - `/2365/learn` excludes `PHY-*`
   - new route excludes 2365 units
2. Direct URL guard:
   - `/2365/learn/PHY-...` returns `404`
3. Admin scope:
   - uploads/runs visible only in current scope
4. Generation:
   - new subject lesson can generate successfully
   - regenerate works after failure
5. Type safety:
   - run `npx tsc --noEmit --incremental false`

## 10. Recommended conventions for future subjects

1. Keep unit prefixes short and unique:
   - `PHY-*`, `BIO-*`, `CHEM-*`, etc.
2. Never reuse 2365 numeric unit IDs for GCSE subjects.
3. Always enforce scope in both:
   - UI filtering
   - API/backend authorization/validation

## Quick checklist

1. Route prefix created
2. Scope helpers updated
3. Learn pages filtered + guarded
4. Admin APIs scoped
5. Syllabus upload/parsing validated
6. Generation handles string units
7. Regenerate/delete controls present
8. Cross-scope tests passed
