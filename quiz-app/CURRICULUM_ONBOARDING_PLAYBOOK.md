# Curriculum Onboarding Playbook

Use this playbook whenever adding a new curriculum (for example `gcse-science-chemistry`) so onboarding is repeatable and safe.

## 0) Define the curriculum contract first

Before any code changes, write down:

1. `coursePrefix`: URL namespace, e.g. `/gcse/science/chemistry`
2. `scopeKey`: internal key, e.g. `gcse-science-chemistry`
3. `unitPrefix`: unit/lesson ID prefix, e.g. `CHE-`
4. `displayName`: UI label, e.g. `GCSE Science Chemistry`
5. `learnerLabel`: prompt/system label, e.g. `GCSE Chemistry learners`

If these are not fixed up front, mistakes spread across routing, DB, and prompts.

## 1) Database must allow the new `scopeKey`

Most common failure: upload succeeds in parsing but insert fails due DB `CHECK` constraints.

Example error:

`new row for relation "syllabus_versions" violates check constraint "syllabus_versions_curriculum_check"`

### Required DB update

Create a new Supabase migration that updates all curriculum checks to include the new key:

- `syllabus_versions_curriculum_check`
- `module_runs_curriculum_check`
- `question_generation_runs_curriculum_check`
- `question_items_curriculum_check`

Reference existing migration:
[202602260001_curriculum_partitioning.sql](C:\Users\carpe\Desktop\hs_quiz\quiz-app\supabase\migrations\202602260001_curriculum_partitioning.sql)

Also update backfill logic that infers curriculum from unit prefixes (`^PHY-`, `^BIO-`, etc.) to include the new prefix.

## 2) Routing and scope mapping

Update route + scope mapping in one pass:

1. Add prefix in [curricula.ts](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\lib\routing\curricula.ts)
2. Add scope mapping in [curriculumScope.ts](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\lib\routing\curriculumScope.ts)
3. Add middleware matcher in [middleware.ts](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\middleware.ts)
4. Add `isUnitAllowedForScope` and `isLessonIdAllowedForScope` regex for new prefix

Do not rely on hardcoded `/.../physics` checks; use scope helpers.

## 3) API input validation and scope enforcement

Ensure all APIs that accept or derive curriculum include the new key:

- [lesson-generator route](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\app\api\lesson-generator\route.ts)
- [syllabus upload route](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\app\api\syllabus\upload\route.ts)
- module planner utilities and routes under `src/app/api/admin/module/`
- question admin utilities under `src/app/api/admin/questions/`

If scope is derived from `referer`, verify your new route maps correctly to new scope.

## 4) Module planner and DB normalization layer

Add new key to all unions/normalizers:

- [module planner DB layer](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\lib\module_planner\db.ts)
- [module planner types](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\lib\module_planner\types.ts)
- [module planner adapter](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\lib\module_planner\adapter.ts)

Update unit-prefix inference (`inferCurriculumFromUnit`) to map new prefix to new scope.

## 5) Question bank and generation pipelines

Update all curriculum unions and inference logic:

- [question types](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\lib\questions\types.ts)
- [question bank repo](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\lib\questions\bankRepo.ts)
- generation types/profile/game generator files in `src/lib/generation/`

Add a curriculum prompt profile so generated content gets correct subject framing.

## 6) Frontend pages and labels

Update page entrypoints and any text labels:

- [home page](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\app\page.tsx)
- [learn index](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\app\learn\page.tsx)
- [lesson page metadata](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\app\learn\[lessonId]\page.tsx)
- [quiz builder](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\app\quiz\page.tsx)
- [generate](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\app\generate\page.tsx)
- [generate-quiz](C:\Users\carpe\Desktop\hs_quiz\quiz-app\src\app\generate-quiz\page.tsx)

Use scope-derived labels (`isGcsePhysics`, `isGcseBiology`, etc.) instead of duplicated string checks.

## 7) Syllabus import format contract

For `.txt/.csv/.tsv` imports that use `tryParseStructuredTable`, headers must include:

- `curriculum`
- `unit_code`
- `unit_title` (optional but recommended)
- `lo_code`
- `lo_title` (optional but recommended)
- `ac_code`
- `ac_text`

Rows where `curriculum` != current page scope are ignored.

## 8) Validation checklist (must pass before merge)

### A. Static grep check

Run and review:

```powershell
rg -n "gcse-science-physics|gcse-science-biology|cg2365|CurriculumScope|SUPPORTED_COURSE_PREFIXES" -S src supabase
```

Confirm all intended files include your new scope where required.

### B. Build/type check

```powershell
npx tsc --noEmit --incremental false
```

If unrelated workspace errors exist, note them explicitly in PR.

### C. API smoke tests

1. Upload from the new route referer:

```powershell
curl.exe -i -X POST ^
  -H "referer: http://localhost:3000/<coursePrefix>/admin/module" ^
  -F "file=@resources/<your_file>.txt;type=text/plain" ^
  http://localhost:3000/api/syllabus/upload
```

2. Check metadata and scope filtering:

```powershell
curl.exe -i -H "referer: http://localhost:3000/<coursePrefix>/admin/module" ^
  http://localhost:3000/api/syllabus/metadata
```

Expect uploaded version to appear only in matching scope.

### D. UI route checks

Verify these pages load and show scope-correct data:

1. `<coursePrefix>/learn`
2. `<coursePrefix>/quiz`
3. `<coursePrefix>/generate`
4. `<coursePrefix>/generate-quiz`
5. `<coursePrefix>/admin/module`

## 9) Rollout order (recommended)

1. Add code support (routing/scope/unions/inference)
2. Add DB migration allowing new scope key
3. Apply migration to DB
4. Upload syllabus and confirm metadata scope
5. Run planner pipeline and generate first lesson
6. Run quiz generation and scope-specific catalog checks

## 10) Regression guardrails

When adding a curriculum, do not break existing ones:

1. Confirm `/2365` still filters to 2365-only units/lessons
2. Confirm existing GCSE routes still work
3. Confirm DB uniqueness/index behavior still uses `(curriculum, hash)` patterns

---

## Quick post-change sanity query

After migration + first import, verify stored curriculum values are exactly what you expect:

```sql
select curriculum, count(*) from syllabus_versions group by curriculum order by curriculum;
select curriculum, count(*) from module_runs group by curriculum order by curriculum;
select curriculum, count(*) from question_generation_runs group by curriculum order by curriculum;
select curriculum, count(*) from question_items group by curriculum order by curriculum;
```

