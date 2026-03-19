import { describe, expect, it } from 'vitest';
import { getGcseBiologyPhase1TargetCodes } from '@/data/v2/gcse/biology/phase1Target';
import {
  getGcseBiologyPhase1LessonProfile,
  listGcseBiologyPhase1LessonProfiles,
} from '@/data/v2/gcse/biology/phase1LessonProfiles';

describe('phase1LessonProfiles', () => {
  it('covers every Phase 1 biology target lesson', () => {
    const profiles = listGcseBiologyPhase1LessonProfiles();
    expect(profiles.map((profile) => profile.lessonCode)).toEqual(getGcseBiologyPhase1TargetCodes());
  });

  it('returns a specific profile by lesson code', () => {
    const profile = getGcseBiologyPhase1LessonProfile('bio-104-1a');
    expect(profile?.topic).toBe('Enzymes and Factors Affecting Rate');
    expect(profile?.mustHaveTopics).toContain('denaturation');
  });
});
