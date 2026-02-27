-- Add learner personalization fields used by the tutor.
alter table public.profiles
  add column if not exists tutor_profile_summary text;

alter table public.profiles
  add column if not exists tutor_profile_json jsonb not null default '{}'::jsonb;
