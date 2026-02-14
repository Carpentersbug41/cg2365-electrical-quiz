import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('auth/progress migration RLS policies', () => {
  const migrationPath = path.join(
    process.cwd(),
    'supabase',
    'migrations',
    '202602120001_auth_progress_v1.sql'
  );

  it('enables RLS on all new tables', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    expect(sql).toMatch(/alter table public\.profiles enable row level security/i);
    expect(sql).toMatch(/alter table public\.lesson_progress enable row level security/i);
    expect(sql).toMatch(/alter table public\.question_attempts enable row level security/i);
  });

  it('contains own-row policies using auth.uid()', () => {
    const sql = fs.readFileSync(migrationPath, 'utf-8');

    expect(sql).toMatch(/create policy "profiles_insert_own"/i);
    expect(sql).toMatch(/create policy "lesson_progress_insert_own"/i);
    expect(sql).toMatch(/create policy "question_attempts_insert_own"/i);
    expect(sql).toMatch(/auth\.uid\(\)\s*=\s*user_id/i);
  });
});

