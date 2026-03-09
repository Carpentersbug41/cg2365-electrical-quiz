import { describe, expect, it } from 'vitest';
import { getFallbackInterviewQuestion } from '@/lib/onboarding/interviewQuestions';

describe('getFallbackInterviewQuestion', () => {
  it('starts with the preferred-name question', () => {
    expect(getFallbackInterviewQuestion([])).toBe(
      'What name would you like your tutor to call you?'
    );
  });

  it('advances based on the number of learner responses', () => {
    const transcript = [
      { role: 'assistant' as const, content: 'What name would you like your tutor to call you?' },
      { role: 'user' as const, content: 'Sam' },
      { role: 'assistant' as const, content: 'Which age band fits you best?' },
      { role: 'user' as const, content: '16 to 17' },
    ];

    expect(getFallbackInterviewQuestion(transcript)).toBe(
      'What course, subject, or level are you studying right now?'
    );
  });
});

