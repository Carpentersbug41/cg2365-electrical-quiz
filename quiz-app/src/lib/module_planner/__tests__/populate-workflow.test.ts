import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getRunsHandler, POST as createRunHandler } from '@/app/api/admin/module/runs/route';
import { POST as populateSyllabusHandler } from '@/app/api/admin/module/syllabus/populate/route';
import { clearModulePlannerDbForTests } from '@/lib/module_planner/db';
import { createPlannerRun, listModulePlannerUnitLos, runM0Distill } from '@/lib/module_planner/planner';

describe('module planner populate workflow', () => {
  beforeEach(async () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('MODULE_PLANNER_ENABLED', 'true');
    vi.stubEnv('MODULE_PLANNER_DB_MODE', 'memory');
    vi.stubEnv('MODULE_PLANNER_ADMIN_TOKEN', '');
    await clearModulePlannerDbForTests();
  });

  it('shows empty syllabus versions before populate', async () => {
    const response = await getRunsHandler(new NextRequest('http://localhost/api/admin/module/runs'));
    const json = (await response.json()) as {
      success: boolean;
      syllabusVersions: Array<unknown>;
      units: Array<unknown>;
      latestIngestion: unknown;
    };

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.syllabusVersions).toEqual([]);
    expect(json.units).toEqual([]);
    expect(json.latestIngestion).toBeNull();
  });

  it('populate creates a syllabus version and exposes version-scoped units/LOs', async () => {
    const populateResponse = await populateSyllabusHandler(
      new NextRequest('http://localhost/api/admin/module/syllabus/populate', { method: 'POST' })
    );
    const populateJson = (await populateResponse.json()) as {
      success: boolean;
      state: string;
      syllabusVersionId: string;
    };

    expect(populateResponse.status).toBe(200);
    expect(populateJson.success).toBe(true);
    expect(populateJson.state).toBe('READY');
    expect(populateJson.syllabusVersionId).toBeTruthy();

    const afterPopulateResponse = await getRunsHandler(new NextRequest('http://localhost/api/admin/module/runs'));
    const afterPopulateJson = (await afterPopulateResponse.json()) as {
      success: boolean;
      syllabusVersions: Array<{ id: string }>;
      defaultSyllabusVersionId: string;
      units: string[];
      resolvedUnit: string;
      unitLos: string[];
      latestIngestion: { state: string } | null;
    };

    expect(afterPopulateResponse.status).toBe(200);
    expect(afterPopulateJson.success).toBe(true);
    expect(afterPopulateJson.syllabusVersions.length).toBeGreaterThan(0);
    expect(afterPopulateJson.defaultSyllabusVersionId).toBe(populateJson.syllabusVersionId);
    expect(afterPopulateJson.units.length).toBeGreaterThan(0);
    expect(afterPopulateJson.resolvedUnit).toBeTruthy();
    expect(afterPopulateJson.unitLos.length).toBeGreaterThan(0);
    expect(afterPopulateJson.latestIngestion?.state).toBe('READY');
  });

  it('anchors run to syllabusVersionId + unit and defaults M0 selectedLos to all unit LOs', async () => {
    const populateResponse = await populateSyllabusHandler(
      new NextRequest('http://localhost/api/admin/module/syllabus/populate', { method: 'POST' })
    );
    const populateJson = (await populateResponse.json()) as { syllabusVersionId: string };
    const syllabusVersionId = populateJson.syllabusVersionId;

    const scopedResponse = await getRunsHandler(
      new NextRequest(`http://localhost/api/admin/module/runs?syllabusVersionId=${syllabusVersionId}`)
    );
    const scopedJson = (await scopedResponse.json()) as { resolvedUnit: string };
    const unit = scopedJson.resolvedUnit;

    const createRunResponse = await createRunHandler(
      new Request('http://localhost/api/admin/module/runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          syllabusVersionId,
          unit,
          chatTranscript: 'Plan all default outcomes for this unit.',
        }),
      }) as never
    );
    const createRunJson = (await createRunResponse.json()) as {
      success: boolean;
      run: { id: string; syllabus_version_id: string; unit: string };
    };

    expect(createRunResponse.status).toBe(200);
    expect(createRunJson.success).toBe(true);
    expect(createRunJson.run.syllabus_version_id).toBe(syllabusVersionId);
    expect(createRunJson.run.unit).toBe(unit);

    const run = await createPlannerRun({
      syllabusVersionId,
      unit,
      chatTranscript: 'Use defaults',
    });
    const m0 = await runM0Distill(
      run.id,
      {
        syllabusVersionId,
        unit,
        selectedLos: [],
        chatTranscript: 'Use defaults',
      },
      { replayFromArtifacts: false }
    );
    const expectedLos = await listModulePlannerUnitLos(syllabusVersionId, unit);
    expect(m0.artifact.selectedLos).toEqual(expectedLos);
  });

  it('rejects run creation when syllabusVersionId is missing or unit is invalid', async () => {
    const missingVersionResponse = await createRunHandler(
      new Request('http://localhost/api/admin/module/runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          unit: '202',
          chatTranscript: 'invalid request',
        }),
      }) as never
    );
    const missingVersionJson = (await missingVersionResponse.json()) as { success: boolean; code?: string };
    expect(missingVersionResponse.status).toBe(400);
    expect(missingVersionJson.success).toBe(false);
    expect(missingVersionJson.code).toBe('JSON_SCHEMA_FAIL');

    const populateResponse = await populateSyllabusHandler(
      new NextRequest('http://localhost/api/admin/module/syllabus/populate', { method: 'POST' })
    );
    const populateJson = (await populateResponse.json()) as { syllabusVersionId: string };

    const invalidUnitResponse = await createRunHandler(
      new Request('http://localhost/api/admin/module/runs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          syllabusVersionId: populateJson.syllabusVersionId,
          unit: '9999',
          chatTranscript: 'invalid unit',
        }),
      }) as never
    );
    const invalidUnitJson = (await invalidUnitResponse.json()) as { success: boolean; code?: string };
    expect(invalidUnitResponse.status).toBe(400);
    expect(invalidUnitJson.success).toBe(false);
    expect(invalidUnitJson.code).toBe('RAG_EMPTY');
  });
});
