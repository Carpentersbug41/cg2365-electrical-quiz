const DEFAULT_V2_GENERATION_QUEUE_CADENCE_MINUTES = 15;
const MIN_V2_GENERATION_QUEUE_CADENCE_MINUTES = 5;
const MAX_V2_GENERATION_QUEUE_CADENCE_MINUTES = 60;

function parsePositiveInteger(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return null;
  return parsed;
}

export function getV2GenerationQueueCadenceMinutes(): number {
  const configured = parsePositiveInteger(process.env.V2_GENERATION_QUEUE_CADENCE_MINUTES);
  if (configured == null) return DEFAULT_V2_GENERATION_QUEUE_CADENCE_MINUTES;
  return Math.max(
    MIN_V2_GENERATION_QUEUE_CADENCE_MINUTES,
    Math.min(MAX_V2_GENERATION_QUEUE_CADENCE_MINUTES, configured)
  );
}

export function getV2GenerationQueueStaleThresholdMinutes(cadenceMinutes = getV2GenerationQueueCadenceMinutes()): number {
  return Math.max(cadenceMinutes * 3, 45);
}
