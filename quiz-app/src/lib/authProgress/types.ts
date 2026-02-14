export type AcSource = 'question' | 'block' | 'lesson' | 'none';
export type QuestionType = 'mcq' | 'short' | 'numeric' | 'other';
export type GradingMode = 'deterministic' | 'llm';

export interface AttemptPayload {
  lesson_id?: string | null;
  block_id?: string | null;
  question_stable_id: string;
  question_type: QuestionType;
  correct: boolean;
  score?: number | null;
  user_answer?: string | null;
  attempt_number?: number;
  response_time_ms?: number | null;
  ac_key?: string | null;
  ac_source?: AcSource;
  grading_mode: GradingMode;
}

export interface LessonStartPayload {
  lessonId: string;
}

export interface LessonCompletePayload {
  lessonId: string;
  score?: number;
  masteryAchieved?: boolean;
}

