import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('lesson mode UI smoke', () => {
  it('keeps lesson generator page wired to the existing generation flow', () => {
    const pagePath = path.join(process.cwd(), 'src', 'app', 'generate', 'page.tsx');
    const source = fs.readFileSync(pagePath, 'utf-8');

    expect(source).toContain('/api/lesson-generator');
    expect(source).toContain('handleSubmit');
    expect(source).toContain('onSubmit={handleSubmit}');
  });
});

