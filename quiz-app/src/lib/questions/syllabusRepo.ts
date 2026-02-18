import { listSyllabusStructuresByVersion, listSyllabusVersions } from '@/lib/module_planner/db';
import { CanonicalLo } from '@/lib/module_planner/types';
import { SyllabusAssessmentCriteria, SyllabusLearningOutcome, SyllabusUnit } from './types';

function normalizeLoCode(value: string): string {
  const trimmed = String(value ?? '').trim().toUpperCase();
  return trimmed.startsWith('LO') ? trimmed : `LO${trimmed}`;
}

function acCodeFromAcNumber(value: string): string {
  return String(value ?? '').trim().replace(/^AC\s*/i, '');
}

function acTextFromCanonical(ac: { text?: string; acNumber: string }): string {
  const text = String(ac.text ?? '').trim();
  if (text.length > 0) return text;
  return `Assessment criteria ${ac.acNumber}`;
}

function toLos(unitCode: string, los: CanonicalLo[]): SyllabusLearningOutcome[] {
  return los.map((lo) => ({
    unit_code: unitCode,
    lo_code: normalizeLoCode(lo.loNumber),
    lo_title: lo.title ?? null,
    lo_text: lo.title?.trim() ? lo.title : `Learning outcome ${normalizeLoCode(lo.loNumber)}`,
    assessment_criteria: lo.acs.map((ac): SyllabusAssessmentCriteria => ({
      unit_code: unitCode,
      lo_code: normalizeLoCode(lo.loNumber),
      ac_code: acCodeFromAcNumber(ac.acNumber),
      ac_text: acTextFromCanonical(ac),
      range_notes: Array.isArray(ac.range) ? ac.range.join(' | ') : (ac.range ?? null),
    })),
  }));
}

export async function getLatestSyllabusUnits(): Promise<SyllabusUnit[]> {
  const versions = await listSyllabusVersions();
  const latest = versions[0];
  if (!latest) return [];
  const structures = await listSyllabusStructuresByVersion(latest.id);

  return structures.map((row) => {
    const unitCode = String(row.unit);
    const los = toLos(unitCode, row.structure_json.los ?? []);
    return {
      unit_code: unitCode,
      unit_title: row.structure_json.unitTitle ?? `Unit ${unitCode}`,
      level_min: 2,
      level_max: 3,
      active: true,
      learning_outcomes: los,
    };
  });
}

export async function getSyllabusUnit(unitCode: string): Promise<SyllabusUnit | null> {
  const units = await getLatestSyllabusUnits();
  return units.find((unit) => unit.unit_code === unitCode) ?? null;
}
