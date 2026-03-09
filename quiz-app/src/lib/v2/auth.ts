import { isAdminOverrideEmail } from '@/lib/auth/adminOverrides';

export function isV2AdminOverrideEmail(email: string | null | undefined): boolean {
  return isAdminOverrideEmail(email);
}
