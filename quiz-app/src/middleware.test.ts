import { describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

describe('middleware surface mode', () => {
  it('redirects root to /v2 when APP_SURFACE_MODE=v2', async () => {
    vi.resetModules();
    process.env.APP_SURFACE_MODE = 'v2';
    const { middleware } = await import('./middleware');

    const response = middleware(new NextRequest('http://localhost/'));
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost/v2');
  });

  it('blocks legacy routes when APP_SURFACE_MODE=v2', async () => {
    vi.resetModules();
    process.env.APP_SURFACE_MODE = 'v2';
    const { middleware } = await import('./middleware');

    const response = middleware(new NextRequest('http://localhost/learn'));
    expect(response.status).toBe(404);
  });

  it('allows v2 routes without legacy prefix redirects when APP_SURFACE_MODE=v2', async () => {
    vi.resetModules();
    process.env.APP_SURFACE_MODE = 'v2';
    const { middleware } = await import('./middleware');

    const response = middleware(new NextRequest('http://localhost/v2/learn'));
    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });
});
