with ranked as (
  select
    id,
    row_number() over (
      partition by lesson_id, kind
      order by queued_at desc, created_at desc, id desc
    ) as row_num
  from public.v2_generation_jobs
  where kind = 'question_draft'
    and lesson_id is not null
    and status in ('queued', 'running')
)
update public.v2_generation_jobs jobs
set
  status = 'cancelled',
  finished_at = coalesce(finished_at, now()),
  locked_by = null,
  locked_at = null,
  error_message = coalesce(error_message, 'Cancelled by migration: duplicate active question_draft job')
from ranked
where jobs.id = ranked.id
  and ranked.row_num > 1;

create unique index if not exists idx_v2_generation_jobs_one_active_question_draft
  on public.v2_generation_jobs (lesson_id, kind)
  where kind = 'question_draft'
    and lesson_id is not null
    and status in ('queued', 'running');
