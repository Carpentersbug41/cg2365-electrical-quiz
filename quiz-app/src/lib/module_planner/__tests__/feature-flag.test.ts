import { describe, expect, it } from 'vitest';
import { POST as createRunHandler } from '@/app/api/admin/module/runs/route';

describe('module planner feature flag', () => {
  it('blocks module routes when MODULE_PLANNER_ENABLED is false', async () => {
    process.env.MODULE_PLANNER_ENABLED = 'false';

    const request = new Request('http://localhost:3000/api/admin/module/runs', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ unit: '202', chatTranscript: 'test' }),
    });

    const response = await createRunHandler(request as never);
    const json = (await response.json()) as { code?: string };

    expect(response.status).toBe(403);
    expect(json.code).toBe('MODULE_PLANNER_DISABLED');
  });
});

