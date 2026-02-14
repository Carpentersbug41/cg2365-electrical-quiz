import crypto from 'crypto';

type JsonValue = null | boolean | number | string | JsonValue[] | { [k: string]: JsonValue };

function stableSerialize(value: JsonValue): string {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'null';
  if (typeof value === 'string') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(',')}]`;
  }
  const keys = Object.keys(value).sort();
  const parts = keys.map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`);
  return `{${parts.join(',')}}`;
}

function toJsonValue(value: unknown): JsonValue {
  if (value === null) return null;
  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((item) => toJsonValue(item));
  if (typeof value === 'object') {
    const out: { [k: string]: JsonValue } = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = toJsonValue(item);
    }
    return out;
  }
  return String(value);
}

export function stableHash(input: unknown): string {
  const serialized = stableSerialize(toJsonValue(input));
  return crypto.createHash('sha256').update(serialized, 'utf-8').digest('hex');
}
