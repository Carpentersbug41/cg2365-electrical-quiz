import { describe, expect, it } from 'vitest';
import { isAuthProgressEnabled } from '../featureFlag';

describe('auth progress feature flag', () => {
  it('treats trimmed true values as enabled', () => {
    process.env.AUTH_PROGRESS_ENABLED = ' true ';

    expect(isAuthProgressEnabled()).toBe(true);
  });
});
