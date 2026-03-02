const ADMIN_EMAIL_OVERRIDES = new Set<string>([
  'carpentersbug41@gmail.com',
]);

export function isAdminOverrideEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAIL_OVERRIDES.has(email.trim().toLowerCase());
}

