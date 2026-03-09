import type { InterviewTurn } from '@/lib/onboarding/profileBuilder';

const FALLBACK_QUESTIONS = [
  'What name would you like your tutor to call you?',
  'Which age band fits you best: under 13, 13 to 15, 16 to 17, or 18 plus?',
  'What course, subject, or level are you studying right now?',
  'What is your main goal: pass, top grade, or solid understanding?',
  'Do you prefer mostly Socratic questions, a mixed style, or mostly direct teaching first?',
  'How strict should feedback be: gentle hints, normal, or tough minimal hints?',
  'Should explanations stay simple, balanced, or more technical?',
  'What themes, hobbies, or interests should the tutor use in examples?',
] as const;

export function getFallbackInterviewQuestion(transcript: InterviewTurn[]): string {
  const userTurns = transcript.filter((turn) => turn.role === 'user').length;
  const index = Math.min(userTurns, FALLBACK_QUESTIONS.length - 1);
  return FALLBACK_QUESTIONS[index];
}

