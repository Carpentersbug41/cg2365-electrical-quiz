# Vercel Build Failure Plan (`NEXT_MISSING_LAMBDA`)

## Current State (reproduced locally)
- Command run: `npx vercel@latest build --prod`
- Build toolchain:
1. `npm install` succeeds.
2. `npm run build` succeeds (`next build && node scripts/ensureNestedRoutesManifest.cjs`).
3. Vercel packaging fails with `Error: Unable to find lambda for route: /admin/questions`.
- Error code: `NEXT_MISSING_LAMBDA`.
- Evidence file: `.vercel/output/builds.json` contains the same stack trace.
- Additional signal:
1. Vercel warns: `You should not upload the .next directory.`
2. Post-build script creates nested output at `quiz-app/.next` from `scripts/ensureNestedRoutesManifest.cjs`.

## Working Hypothesis
- Primary likely cause: the post-build copy step in `scripts/ensureNestedRoutesManifest.cjs` is creating a second `.next` tree (`quiz-app/.next`) that confuses `@vercel/next` route-to-lambda resolution during packaging.
- Secondary likely cause: root-directory assumptions are inconsistent across local/CI/project settings, and the copy script was introduced as a workaround that now conflicts with current Vercel builder behavior.
- Tertiary cause to validate only if needed: `@vercel/next` compatibility edge case with current Next.js version and static app routes.

## Implementation Plan (do not execute in this step)

### Phase 1: Remove the artifact-mutation workaround
1. Update `package.json` build script to stop mutating/copying `.next` after `next build`.
2. Keep `scripts/ensureNestedRoutesManifest.cjs` out of the production build path.
3. Optionally retain the script in repo temporarily, but decouple it from `build` until proven necessary.

### Phase 2: Align Vercel project root assumptions
1. Verify Vercel Project `Root Directory` in dashboard is the intended app directory.
2. If app is deployed from repository subfolder, explicitly set root to `quiz-app`; otherwise keep repo root and remove subfolder assumptions.
3. Keep `vercel.json` minimal and avoid settings that force custom output handling unless required.

### Phase 3: Rebuild and confirm route packaging
1. Clean previous build artifacts (`.next`, `.vercel/output`, and generated nested `quiz-app/.next` folder) before re-testing.
2. Run `npx vercel@latest build --prod`.
3. Confirm:
1. No `NEXT_MISSING_LAMBDA`.
2. `.vercel/output/functions` is populated.
3. `/admin/questions` is represented correctly as static output or mapped function according to builder output.

### Phase 4: Deployment verification
1. Run `npx vercel --prod` only after local `vercel build` passes.
2. Validate endpoint availability:
1. `/admin/questions`
2. `/admin/module`
3. `/admin/generate-games`
4. `/api/admin/questions/items`
5. `/api/admin/questions/duplicates`

### Phase 5: Hardening so issue does not regress
1. Add a CI pre-deploy check that runs `npx vercel build --prod` (or equivalent dry-run gate) for `main`.
2. Add a short note in deployment docs explaining why nested `.next` copies are prohibited.
3. Keep build scripts single-source-of-truth and avoid post-build filesystem rewrites of Next artifacts.

## Planned File Touches (when implementing)
- `package.json`
- `scripts/ensureNestedRoutesManifest.cjs` (optional: keep, deprecate, or delete)
- Deployment docs (`VERCEL_TROUBLESHOOTING.md` or similar)
- Optional CI workflow file (if adding gate)

## Acceptance Criteria
1. `npx vercel@latest build --prod` exits `0`.
2. No `NEXT_MISSING_LAMBDA` errors.
3. No warning path that indicates `.next` is being manually uploaded/mispackaged by custom script behavior.
4. Production deploy succeeds and `/admin/questions` loads correctly.

## Rollback Strategy
1. Revert build-script changes in one commit if deployment behavior worsens.
2. Re-run baseline failing command to confirm regression boundary.
3. If needed, pin/adjust Vercel CLI or builder versions only after confirming script removal is not sufficient.
