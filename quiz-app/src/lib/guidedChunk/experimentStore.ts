import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export type GuidedChunkExperimentStatus = 'draft' | 'active' | 'completed' | 'rolled_back' | 'cancelled';
export type GuidedChunkExperimentChangeType = 'prompt' | 'ui' | 'runtime' | 'telemetry' | 'content';

export interface GuidedChunkExperiment {
  id: string;
  name: string;
  status: GuidedChunkExperimentStatus;
  changeType: GuidedChunkExperimentChangeType;
  hypothesis: string;
  baselineVariantId?: string | null;
  targetVariantId: string;
  runtimeVersion?: string | null;
  sourceContext: string;
  metricsToWatch: string[];
  notes?: string | null;
  startedAt?: string | null;
  endedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GuidedChunkExperimentChange {
  id: string;
  experimentId: string;
  lessonCode?: string | null;
  lessonVersionId?: string | null;
  changeType: GuidedChunkExperimentChangeType;
  runtimeVersion?: string | null;
  variantId: string;
  baselineVariantId?: string | null;
  sourceContext: string;
  description: string;
  expectedEffect: Record<string, unknown>;
  status: 'active' | 'completed' | 'rolled_back' | 'cancelled';
  result: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GuidedChunkExperimentResult {
  classification?: 'win' | 'loss' | 'mixed' | 'inconclusive' | null;
  summary?: string | null;
  metrics?: Record<string, unknown>;
}

type ExperimentRow = {
  id: string;
  name: string;
  status: GuidedChunkExperimentStatus;
  change_type: GuidedChunkExperimentChangeType;
  hypothesis: string;
  baseline_variant_id: string | null;
  target_variant_id: string;
  runtime_version: string | null;
  source_context: string;
  metrics_to_watch: unknown;
  notes: string | null;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  updated_at: string;
};

type ExperimentChangeRow = {
  id: string;
  experiment_id: string;
  lesson_code: string | null;
  lesson_version_id: string | null;
  change_type: GuidedChunkExperimentChangeType;
  runtime_version: string | null;
  variant_id: string;
  baseline_variant_id: string | null;
  source_context: string;
  description: string;
  expected_effect_json: Record<string, unknown> | null;
  status: 'active' | 'completed' | 'rolled_back' | 'cancelled';
  result_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

function mapExperiment(row: ExperimentRow): GuidedChunkExperiment {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    changeType: row.change_type,
    hypothesis: row.hypothesis,
    baselineVariantId: row.baseline_variant_id,
    targetVariantId: row.target_variant_id,
    runtimeVersion: row.runtime_version,
    sourceContext: row.source_context,
    metricsToWatch: Array.isArray(row.metrics_to_watch) ? row.metrics_to_watch.filter((value): value is string => typeof value === 'string') : [],
    notes: row.notes,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapExperimentChange(row: ExperimentChangeRow): GuidedChunkExperimentChange {
  return {
    id: row.id,
    experimentId: row.experiment_id,
    lessonCode: row.lesson_code,
    lessonVersionId: row.lesson_version_id,
    changeType: row.change_type,
    runtimeVersion: row.runtime_version,
    variantId: row.variant_id,
    baselineVariantId: row.baseline_variant_id,
    sourceContext: row.source_context,
    description: row.description,
    expectedEffect: row.expected_effect_json ?? {},
    status: row.status,
    result: row.result_json ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function listGuidedChunkExperiments(): Promise<{
  experiments: GuidedChunkExperiment[];
  changes: GuidedChunkExperimentChange[];
}> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    return { experiments: [], changes: [] };
  }

  const [experimentsResult, changesResult] = await Promise.all([
    adminClient.from('gc_experiments').select('*').order('updated_at', { ascending: false }),
    adminClient.from('gc_experiment_changes').select('*').order('updated_at', { ascending: false }),
  ]);

  return {
    experiments: experimentsResult.error ? [] : (experimentsResult.data ?? []).map((row) => mapExperiment(row as ExperimentRow)),
    changes: changesResult.error ? [] : (changesResult.data ?? []).map((row) => mapExperimentChange(row as ExperimentChangeRow)),
  };
}

export async function createGuidedChunkExperiment(input: {
  name: string;
  status?: GuidedChunkExperimentStatus;
  changeType: GuidedChunkExperimentChangeType;
  hypothesis: string;
  baselineVariantId?: string | null;
  targetVariantId: string;
  runtimeVersion?: string | null;
  sourceContext?: string;
  metricsToWatch?: string[];
  notes?: string | null;
  actorUserId?: string | null;
  changes?: Array<{
    lessonCode?: string | null;
    lessonVersionId?: string | null;
    changeType?: GuidedChunkExperimentChangeType;
    runtimeVersion?: string | null;
    variantId?: string;
    baselineVariantId?: string | null;
    sourceContext?: string;
    description: string;
    expectedEffect?: Record<string, unknown>;
  }>;
}): Promise<GuidedChunkExperiment> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new Error('Supabase admin client required for experiment tracking.');
  }

  const { data, error } = await adminClient
    .from('gc_experiments')
    .insert({
      name: input.name,
      status: input.status ?? 'draft',
      change_type: input.changeType,
      hypothesis: input.hypothesis,
      baseline_variant_id: input.baselineVariantId ?? null,
      target_variant_id: input.targetVariantId,
      runtime_version: input.runtimeVersion ?? null,
      source_context: input.sourceContext ?? 'guided_chunk_runtime',
      metrics_to_watch: input.metricsToWatch ?? [],
      notes: input.notes ?? null,
      created_by: input.actorUserId ?? null,
      started_at: input.status === 'active' ? new Date().toISOString() : null,
    })
    .select('*')
    .single<ExperimentRow>();

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create guided experiment.');
  }

  if ((input.changes ?? []).length > 0) {
    const { error: changeError } = await adminClient.from('gc_experiment_changes').insert(
      (input.changes ?? []).map((change) => ({
        experiment_id: data.id,
        lesson_code: change.lessonCode ?? null,
        lesson_version_id: change.lessonVersionId ?? null,
        change_type: change.changeType ?? input.changeType,
        runtime_version: change.runtimeVersion ?? input.runtimeVersion ?? null,
        variant_id: change.variantId ?? input.targetVariantId,
        baseline_variant_id: change.baselineVariantId ?? input.baselineVariantId ?? null,
        source_context: change.sourceContext ?? input.sourceContext ?? 'guided_chunk_runtime',
        description: change.description,
        expected_effect_json: change.expectedEffect ?? {},
      }))
    );
    if (changeError) {
      throw new Error(changeError.message);
    }
  }

  return mapExperiment(data);
}

export async function updateGuidedChunkExperiment(input: {
  experimentId: string;
  status?: GuidedChunkExperimentStatus;
  notes?: string | null;
  result?: GuidedChunkExperimentResult | null;
}): Promise<GuidedChunkExperiment> {
  const adminClient = createSupabaseAdminClient();
  if (!adminClient) {
    throw new Error('Supabase admin client required for experiment tracking.');
  }

  const patch: Record<string, unknown> = {};
  if (input.status) {
    patch.status = input.status;
    if (input.status === 'active') patch.started_at = new Date().toISOString();
    if (input.status === 'completed' || input.status === 'rolled_back' || input.status === 'cancelled') {
      patch.ended_at = new Date().toISOString();
    }
  }
  if (typeof input.notes === 'string') {
    patch.notes = input.notes.trim() || null;
  }

  if (Object.keys(patch).length > 0) {
    const { data, error } = await adminClient
      .from('gc_experiments')
      .update(patch)
      .eq('id', input.experimentId)
      .select('*')
      .single<ExperimentRow>();
    if (error || !data) {
      throw new Error(error?.message ?? 'Failed to update guided experiment.');
    }

    if (input.result) {
      const { error: changesError } = await adminClient
        .from('gc_experiment_changes')
        .update({
          status:
            input.status === 'rolled_back' || input.status === 'cancelled'
              ? input.status
              : input.status === 'completed'
                ? 'completed'
                : 'active',
          result_json: input.result,
        })
        .eq('experiment_id', input.experimentId);
      if (changesError) {
        throw new Error(changesError.message);
      }
    }

    return mapExperiment(data);
  }

  const { data, error } = await adminClient.from('gc_experiments').select('*').eq('id', input.experimentId).single<ExperimentRow>();
  if (error || !data) {
    throw new Error(error?.message ?? 'Experiment not found.');
  }
  return mapExperiment(data);
}
