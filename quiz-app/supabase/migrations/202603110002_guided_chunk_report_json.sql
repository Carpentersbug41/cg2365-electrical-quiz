alter table public.gc_lesson_versions
  add column if not exists report_json jsonb null default null;

