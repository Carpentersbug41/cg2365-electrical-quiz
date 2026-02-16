alter table public.generated_lessons
  drop constraint if exists generated_lessons_status_check;

alter table public.generated_lessons
  add constraint generated_lessons_status_check
  check (status in ('planned', 'pending', 'success', 'failed'));
