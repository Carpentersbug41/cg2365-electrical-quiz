import { NextRequest, NextResponse } from 'next/server';
import { getCurriculumScopeFromHeaderOrReferer, type CurriculumScope } from '@/lib/routing/curriculumScope';
import { guardV2AdminAccess } from '@/lib/v2/admin/api';
import {
  ModulePlannerError,
  getV2PlannerRunSummary,
  isV2ModulePlannerEnabled,
  listV2SyllabusVersions,
  type SyllabusVersionRow,
} from '@/lib/v2/modulePlanner/service';

export function modulePlannerDisabledResponse(): NextResponse {
  return NextResponse.json(
    {
      success: false,
      code: 'MODULE_PLANNER_DISABLED',
      message: 'Module planner is disabled by MODULE_PLANNER_ENABLED.',
    },
    { status: 403 }
  );
}

export async function guardV2ModulePlannerAccess(request: NextRequest | Request): Promise<NextResponse | null> {
  if (!isV2ModulePlannerEnabled()) {
    return modulePlannerDisabledResponse();
  }
  return guardV2AdminAccess(request, 'content_operator');
}

export function toV2ModulePlannerError(error: unknown): NextResponse {
  if (error instanceof ModulePlannerError) {
    return NextResponse.json(
      {
        success: false,
        stage: error.stage,
        code: error.code,
        message: error.message,
        meta: error.meta ?? null,
      },
      { status: error.status }
    );
  }

  return NextResponse.json(
    {
      success: false,
      code: 'INTERNAL_ERROR',
      message: error instanceof Error ? error.message : 'Unknown V2 module planner error',
    },
    { status: 500 }
  );
}

export function getV2ModulePlannerScope(request: NextRequest | Request): CurriculumScope {
  return getCurriculumScopeFromHeaderOrReferer(
    request.headers.get('x-course-prefix'),
    request.headers.get('referer')
  );
}

export function isSyllabusVersionInScope(version: SyllabusVersionRow, scope: CurriculumScope): boolean {
  const tagged = version.meta_json && typeof version.meta_json === 'object'
    ? (version.meta_json as Record<string, unknown>).curriculum
    : null;
  if (scope === 'gcse-science-physics') return tagged === 'gcse-science-physics';
  if (scope === 'gcse-science-biology') return tagged === 'gcse-science-biology';
  return tagged === 'cg2365' || tagged == null;
}

export async function assertV2ModuleRunInScope(
  request: NextRequest | Request,
  runId: string
): Promise<NextResponse | null> {
  const scope = getV2ModulePlannerScope(request);
  const summary = await getV2PlannerRunSummary(runId);
  const versions = await listV2SyllabusVersions();
  const version = versions.find((item) => item.id === summary.run.syllabus_version_id);
  if (!version || !isSyllabusVersionInScope(version, scope)) {
    return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'Run not found' }, { status: 404 });
  }
  return null;
}
