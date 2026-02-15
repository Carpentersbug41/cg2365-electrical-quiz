import { describe, expect, it } from 'vitest';
import {
  buildMasterLessonBlueprint,
  validateLessonAgainstMasterLessonBlueprint,
  validateMasterLessonBlueprintContract,
} from '@/lib/module_planner/masterLessonBlueprint';
import type { Lesson } from '@/lib/generation/types';

describe('master lesson blueprint contract', () => {
  it('uses generator-compatible block order and required set', () => {
    const blueprint = buildMasterLessonBlueprint({
      lessonId: '210-210-1A1',
      unit: '210',
      lo: 'LO1',
      topic: 'Identify key site roles',
      layout: 'linear-flow',
      audience: 'beginner',
      prerequisites: [],
      acAnchors: ['210.LO1.AC1.1'],
      acTexts: ['Identify key roles of the site management team'],
      rangeItems: [],
      inScopeTopics: ['site roles'],
      outOfScopeTopics: [],
    });

    expect(validateMasterLessonBlueprintContract(blueprint, '210-210-1A1')).toEqual([]);
    expect(blueprint.blockPlan.entries.some((entry) => entry.id.endsWith('-check-3'))).toBe(false);

    const practice = blueprint.blockPlan.entries.find((entry) => entry.id.endsWith('-practice'));
    const integrative = blueprint.blockPlan.entries.find((entry) => entry.id.endsWith('-integrative'));
    const spaced = blueprint.blockPlan.entries.find((entry) => entry.id.endsWith('-spaced-review'));

    expect(practice?.order).toBe(8);
    expect(integrative?.order).toBe(9.5);
    expect(spaced?.order).toBe(10);
  });

  it('accepts lesson output that follows required blueprint blocks', () => {
    const blueprint = buildMasterLessonBlueprint({
      lessonId: '210-210-1A1',
      unit: '210',
      lo: 'LO1',
      topic: 'Identify key site roles',
      layout: 'linear-flow',
      audience: 'beginner',
      prerequisites: [],
      acAnchors: ['210.LO1.AC1.1'],
      acTexts: ['Identify key roles of the site management team'],
      rangeItems: [],
      inScopeTopics: ['site roles'],
      outOfScopeTopics: [],
    });

    const requiredBlocks = blueprint.blockPlan.entries
      .filter((entry) => entry.required)
      .map((entry) => ({
        id: entry.id,
        type: entry.type,
        order: entry.order,
        content: {},
      }));

    const lesson: Lesson = {
      id: blueprint.identity.lessonId,
      title: `${blueprint.identity.lessonId} ${blueprint.identity.topic}`,
      description: 'Test lesson',
      layout: blueprint.identity.layout,
      unit: blueprint.identity.unit,
      topic: blueprint.identity.topic,
      learningOutcomes: ['Remember', 'Understand', 'Apply'],
      prerequisites: [],
      blocks: requiredBlocks,
      metadata: {
        created: '2026-02-15',
        updated: '2026-02-15',
        version: '1.0',
        author: 'test',
      },
    };

    expect(validateLessonAgainstMasterLessonBlueprint(lesson, blueprint)).toEqual([]);
  });
});

