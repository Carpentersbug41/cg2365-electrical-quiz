import { NextRequest, NextResponse } from 'next/server';
import { ModulePlannerError, getPlannerRunSummary, isModulePlannerEnabled } from '@/lib/module_planner';
import { getCurriculumScopeFromReferer, type CurriculumScope } from '@/lib/routing/curriculumScope';
import { SyllabusVersionRow } from '@/lib/module_planner/types';
import { listSyllabusVersions } from '@/lib/module_planner/syllabus';

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

export function guardModulePlannerEnabled(): NextResponse | null {
  if (!isModulePlannerEnabled()) {
    return modulePlannerDisabledResponse();
  }
  return null;
}

function getProvidedAdminToken(request: NextRequest | Request): string | null {
  const direct = request.headers.get('x-module-admin-token');
  if (direct && direct.trim().length > 0) return direct.trim();
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice('Bearer '.length).trim();
    if (token.length > 0) return token;
  }
  return null;
}

export function guardModulePlannerAccess(request: NextRequest | Request): NextResponse | null {
  const disabled = guardModulePlannerEnabled();
  if (disabled) return disabled;

  const expectedToken = process.env.MODULE_PLANNER_ADMIN_TOKEN;
  if (!expectedToken || expectedToken.trim().length === 0) {
    return null;
  }
  const provided = getProvidedAdminToken(request);
  if (provided !== expectedToken.trim()) {
    return NextResponse.json(
      {
        success: false,
        code: 'UNAUTHORIZED',
        message: 'Missing or invalid module admin token.',
      },
      { status: 401 }
    );
  }
  return null;
}

export function toErrorResponse(error: unknown): NextResponse {
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
      message: error instanceof Error ? error.message : 'Unknown module planner error',
    },
    { status: 500 }
  );
}

export function getModulePlannerScope(request: NextRequest | Request): CurriculumScope {
  return getCurriculumScopeFromReferer(request.headers.get('referer'));
}

export function isSyllabusVersionInScope(version: SyllabusVersionRow, scope: CurriculumScope): boolean {
  const tagged = version.meta_json && typeof version.meta_json === 'object'
    ? (version.meta_json as Record<string, unknown>).curriculum
    : null;
  if (scope === 'gcse-science-physics') {
    return tagged === 'gcse-science-physics';
  }
  return tagged === 'cg2365' || tagged == null;
}

export async function assertModuleRunInScope(
  request: NextRequest | Request,
  runId: string
): Promise<NextResponse | null> {
  const scope = getModulePlannerScope(request);
  const summary = await getPlannerRunSummary(runId);
  const versions = await listSyllabusVersions();
  const version = versions.find((item) => item.id === summary.run.syllabus_version_id);
  if (!version || !isSyllabusVersionInScope(version, scope)) {
    return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'Run not found' }, { status: 404 });
  }
  return null;
}
