import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { setV2DefaultEnrollmentStatus } from '../src/lib/v2/enrollment';

const ROOT_DIR = process.cwd();

function loadEnvFile(fileName: string) {
  const filePath = path.join(ROOT_DIR, fileName);
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx < 1) continue;

    const key = line.slice(0, idx).trim();
    if (!key || process.env[key] !== undefined) continue;

    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

async function main() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  const email = (process.env.E2E_ONBOARDING_EMAIL || 'trial.v2.onboarding@example.com').trim().toLowerCase();
  const password = (process.env.E2E_ONBOARDING_PASSWORD || 'Trial-onboarding-123!').trim();

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  let foundUser: { id: string } | null = null;
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const users = data.users ?? [];
    const match = users.find((user) => (user.email ?? '').trim().toLowerCase() === email);
    if (match) {
      foundUser = { id: match.id };
      break;
    }
    if (users.length < 200) break;
  }

  let userId: string;
  if (foundUser) {
    const { data, error } = await adminClient.auth.admin.updateUserById(foundUser.id, {
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  } else {
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  }

  const { error: profileError } = await adminClient.from('profiles').upsert(
    {
      user_id: userId,
      role: 'student',
      display_name: 'V2 Onboarding Trial',
      tutor_profile_summary: null,
      tutor_profile_json: {},
    },
    { onConflict: 'user_id' }
  );
  if (profileError) throw profileError;

  const enrollment = await setV2DefaultEnrollmentStatus(adminClient, userId, 'active');
  if (!enrollment.ok) {
    throw new Error(enrollment.message);
  }

  console.log(
    JSON.stringify(
      {
        success: true,
        email,
        password,
        userId,
        enrollment: 'active',
        onboardingReset: true,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error('[setupOnboardingTrial] Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
