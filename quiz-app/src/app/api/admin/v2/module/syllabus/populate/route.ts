import { NextRequest, NextResponse } from 'next/server';
import { getV2ModulePlannerScope, guardV2ModulePlannerAccess } from '../../_utils';
import {
  createV2SyllabusIngestion,
  listV2SyllabusVersions,
  seedLegacyV2SyllabusChunksIfNeeded,
  updateV2SyllabusIngestion,
} from '@/lib/v2/modulePlanner/service';

export async function POST(request: NextRequest) {
  const denied = await guardV2ModulePlannerAccess(request);
  if (denied) return denied;

  const scope = getV2ModulePlannerScope(request);
  if (scope !== 'cg2365') {
    return NextResponse.json(
      {
        success: false,
        code: 'JSON_SCHEMA_FAIL',
        message: 'Legacy syllabus populate is only available for 2365 scope. Upload GCSE syllabus directly.',
      },
      { status: 400 }
    );
  }

  let ingestionId = '';
  try {
    const ingestion = await createV2SyllabusIngestion({
      source: 'legacy-seed',
      state: 'RUNNING',
      metaJson: { action: 'populate-button' },
    });
    ingestionId = ingestion.id;

    const existing = await listV2SyllabusVersions();
    const syllabusVersionId = await seedLegacyV2SyllabusChunksIfNeeded();
    if (!syllabusVersionId) {
      throw new Error('Failed to populate syllabus version from legacy source.');
    }

    const created = existing.length === 0;
    await updateV2SyllabusIngestion(ingestionId, {
      state: 'READY',
      syllabus_version_id: syllabusVersionId,
      error_message: null,
      meta_json: {
        action: 'populate-button',
        created,
      },
    });
    return NextResponse.json({
      success: true,
      state: 'READY',
      created,
      ingestionId,
      syllabusVersionId,
      message: created
        ? 'Syllabus version populated from legacy source.'
        : 'Syllabus versions already exist. Using current latest version.',
    });
  } catch (error) {
    if (ingestionId) {
      await updateV2SyllabusIngestion(ingestionId, {
        state: 'FAILED',
        error_message: error instanceof Error ? error.message : 'Failed to populate syllabus.',
      }).catch(() => undefined);
    }
    return NextResponse.json(
      {
        success: false,
        state: 'FAILED',
        code: 'INTERNAL_ERROR',
        ingestionId: ingestionId || null,
        message: error instanceof Error ? error.message : 'Failed to populate syllabus.',
      },
      { status: 500 }
    );
  }
}
