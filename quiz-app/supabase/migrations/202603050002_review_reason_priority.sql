-- Add explicit review reason + priority for queue injection ordering.

alter table public.student_review_queue
  add column if not exists review_reason text not null default 'wrong'
    check (review_reason in ('misconception', 'wrong', 'guessing'));

alter table public.student_review_queue
  add column if not exists priority_score integer not null default 70
    check (priority_score >= 0 and priority_score <= 100);

create index if not exists idx_student_review_queue_user_status_priority_due
  on public.student_review_queue (user_id, status, priority_score desc, due_at asc);
