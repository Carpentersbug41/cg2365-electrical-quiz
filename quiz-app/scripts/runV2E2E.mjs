import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const rootDir = process.cwd();

function loadEnvFile(fileName) {
  const filePath = path.join(rootDir, fileName);
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

async function ensureUser(supabase, email, password, role) {
  const normalizedEmail = email.trim().toLowerCase();
  let foundUser = null;
  let page = 1;
  const perPage = 200;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const users = data?.users ?? [];
    foundUser = users.find((user) => String(user.email || '').trim().toLowerCase() === normalizedEmail) ?? null;
    if (foundUser || users.length < perPage) break;
    page += 1;
  }

  let userId;
  if (foundUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(foundUser.id, {
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
    });
    if (error) throw error;
    userId = data.user.id;
  }

  const { error: profileError } = await supabase.from('profiles').upsert(
    {
      user_id: userId,
      role,
      tutor_profile_summary: 'E2E profile summary',
    },
    { onConflict: 'user_id' }
  );
  if (profileError) throw profileError;

  return userId;
}

async function getDefaultV2CourseId(supabase) {
  const { data, error } = await supabase
    .from('v2_courses')
    .select('id')
    .eq('code', 'gcse-biology')
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data?.id) throw new Error('Default V2 course not found for E2E setup.');
  return data.id;
}

async function ensureV2Enrollment(supabase, userId, courseId) {
  const { error } = await supabase.from('v2_enrollments').upsert(
    {
      user_id: userId,
      course_id: courseId,
      status: 'active',
      completed_at: null,
    },
    { onConflict: 'user_id,course_id' }
  );
  if (error) throw error;
}

function runPlaywright(env) {
  const command =
    'npx playwright test tests/e2e/v2-learner-flow.spec.ts tests/e2e/v2-admin-flow.spec.ts tests/e2e/v2-role-management.spec.ts tests/e2e/v2-phase1-signoff.spec.ts';
  const cmd = process.platform === 'win32' ? 'cmd.exe' : 'sh';
  const args = process.platform === 'win32' ? ['/c', command] : ['-lc', command];
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: rootDir,
      stdio: 'inherit',
      env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Playwright exited with code ${code}`));
    });
  });
}

async function main() {
  loadEnvFile('.env.local');
  loadEnvFile('.env');

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  const explicitBaseUrl = (
    process.env.E2E_BASE_URL || 'https://quiz-app-v2-fl8ifeu7c-carpentersbugs-projects.vercel.app'
  ).trim();
  const learnerEmail = (process.env.E2E_USER_EMAIL || 'e2e.v2.learner@example.com').trim().toLowerCase();
  const learnerPassword = (process.env.E2E_USER_PASSWORD || 'E2E-pass-123!').trim();
  const adminEmail = (process.env.E2E_ADMIN_EMAIL || 'e2e.v2.admin@example.com').trim().toLowerCase();
  const adminPassword = (process.env.E2E_ADMIN_PASSWORD || 'E2E-admin-123!').trim();

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const courseId = await getDefaultV2CourseId(supabase);
  const learnerUserId = await ensureUser(supabase, learnerEmail, learnerPassword, 'student');
  const adminUserId = await ensureUser(supabase, adminEmail, adminPassword, 'admin');
  await ensureV2Enrollment(supabase, learnerUserId, courseId);
  await ensureV2Enrollment(supabase, adminUserId, courseId);

  const runnerEnv = {
    ...process.env,
    E2E_USER_EMAIL: learnerEmail,
    E2E_USER_PASSWORD: learnerPassword,
    E2E_ADMIN_EMAIL: adminEmail,
    E2E_ADMIN_PASSWORD: adminPassword,
  };
  if (explicitBaseUrl) {
    runnerEnv.E2E_BASE_URL = explicitBaseUrl;
  }

  await runPlaywright(runnerEnv);
}

main().catch((error) => {
  console.error('[runV2E2E] Failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
