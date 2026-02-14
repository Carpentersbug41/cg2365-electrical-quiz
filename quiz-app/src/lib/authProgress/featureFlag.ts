export function isAuthProgressEnabled(): boolean {
  return process.env.AUTH_PROGRESS_ENABLED?.toLowerCase() === 'true';
}

