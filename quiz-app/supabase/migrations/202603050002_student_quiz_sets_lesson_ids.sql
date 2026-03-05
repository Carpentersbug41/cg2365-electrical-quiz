-- Add selected lesson IDs to student quiz sets for multi-lesson selection.

alter table public.student_quiz_sets
  add column if not exists lesson_ids text[] not null default '{}';

create index if not exists idx_student_quiz_sets_lesson_ids_gin
  on public.student_quiz_sets using gin (lesson_ids);
