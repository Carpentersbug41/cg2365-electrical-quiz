import { describe, expect, it } from 'vitest';
import {
  buildTutorProfile,
  extractJsonObjectFromText,
  parseModelProfileOutput,
  sanitizeInterviewTranscript,
} from '@/lib/onboarding/profileBuilder';

describe('sanitizeInterviewTranscript', () => {
  it('keeps only valid assistant/user turns and trims content', () => {
    const transcript = sanitizeInterviewTranscript([
      { role: 'assistant', content: '  Hello there  ' },
      { role: 'system', content: 'ignored' },
      { role: 'user', content: '\nI like physics and football\t' },
      { role: 'user', content: 123 },
    ]);

    expect(transcript).toEqual([
      { role: 'assistant', content: 'Hello there' },
      { role: 'user', content: 'I like physics and football' },
    ]);
  });
});

describe('parseModelProfileOutput', () => {
  it('parses direct JSON output', () => {
    const parsed = parseModelProfileOutput('{"profile_summary":"test"}');
    expect(parsed?.profile_summary).toBe('test');
  });

  it('extracts JSON object from wrapped text', () => {
    const parsed = parseModelProfileOutput('Here you go:\n{"profile_summary":"ok"}\nThanks');
    expect(parsed?.profile_summary).toBe('ok');
  });

  it('returns null when no parseable object exists', () => {
    const parsed = parseModelProfileOutput('not json');
    expect(parsed).toBeNull();
  });
});

describe('extractJsonObjectFromText', () => {
  it('handles nested braces and quoted braces', () => {
    const text = 'prefix {"a":"{not nested}","b":{"c":1}} suffix';
    expect(extractJsonObjectFromText(text)).toBe('{"a":"{not nested}","b":{"c":1}}');
  });
});

describe('buildTutorProfile', () => {
  it('normalizes arrays and caps summary to three sentences', () => {
    const transcript = [
      { role: 'assistant' as const, content: 'Question one?' },
      { role: 'user' as const, content: 'I like football and coding.' },
    ];
    const output = {
      preferred_name: 'Sam',
      age_band: '16_17',
      current_course_level: 'GCSE Physics + 2365 Level 2',
      goal: 'top_grade',
      study_time_minutes_per_week: '60',
      teaching_style: 'mixed',
      feedback_strictness: 'normal',
      detail_level: 'medium',
      example_themes: ['sport', 'gaming'],
      learning_goals: ['pass exams', 'pass exams', 'understand concepts'],
      hobbies: ['football', 'Football'],
      interests: ['coding'],
      communication_style: 'supportive',
      preferred_pace: 'slow',
      profile_summary:
        'Sentence one. Sentence two! Sentence three? Sentence four should be trimmed.',
    };

    const built = buildTutorProfile(output, transcript);

    expect(built.profileJson.learning_goals).toEqual(['pass exams', 'understand concepts']);
    expect(built.profileJson.hobbies).toEqual(['football']);
    expect(built.profileJson.preferred_name).toBe('Sam');
    expect(built.profileJson.goal).toBe('top_grade');
    expect(built.profileJson.example_themes).toEqual(['sport', 'gaming']);
    expect(built.profileSummary).toBe('Sentence one. Sentence two! Sentence three?');
  });

  it('builds a fallback summary when model summary is missing', () => {
    const built = buildTutorProfile(
      {
        communication_style: 'direct',
        preferred_pace: 'fast',
        learning_goals: ['exam success'],
        hobbies: ['basketball'],
      },
      []
    );

    expect(built.profileSummary.length).toBeGreaterThan(10);
    expect(built.profileSummary.split(/(?<=[.!?])\s+/).length).toBeLessThanOrEqual(3);
  });
});
