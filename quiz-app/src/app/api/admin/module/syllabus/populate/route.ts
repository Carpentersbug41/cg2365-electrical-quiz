import { NextRequest, NextResponse } from 'next/server';
import { guardModulePlannerAccess } from '../../_utils';
import { listSyllabusVersions, seedLegacyChunksAsDefaultVersionIfNeeded } from '@/lib/module_planner/syllabus';
import { createSyllabusIngestion, updateSyllabusIngestion } from '@/lib/module_planner/db';

export async function POST(request: NextRequest) {
  const denied = guardModulePlannerAccess(request);
  if (denied) return denied;

  let ingestionId = '';

  try {
    const ingestion = await createSyllabusIngestion({
      source: 'legacy-seed',
      state: 'RUNNING',
      metaJson: { action: 'populate-button' },
    });
    ingestionId = ingestion.id;

    const existing = await listSyllabusVersions();
    const syllabusVersionId = await seedLegacyChunksAsDefaultVersionIfNeeded();
    if (!syllabusVersionId) {
      throw new Error('Failed to populate syllabus version from legacy source.');
    }

    const created = existing.length === 0;
    await updateSyllabusIngestion(ingestionId, {
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
      await updateSyllabusIngestion(ingestionId, {
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
