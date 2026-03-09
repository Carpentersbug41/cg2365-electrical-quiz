export function isV2AdminOverrideEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return normalized === 'carpentersbug41@gmail.com';
}
