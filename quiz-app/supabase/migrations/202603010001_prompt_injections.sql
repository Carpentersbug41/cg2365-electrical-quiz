-- Global prompt injections for lesson generation and tutoring surfaces.

create table if not exists public.prompt_injections (
  key text primary key check (key in ('lesson_generation_profile', 'tutor_response_profile')),
  value text not null check (char_length(value) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_prompt_injections_set_updated_at on public.prompt_injections;
create trigger trg_prompt_injections_set_updated_at
before update on public.prompt_injections
for each row
execute function public.set_updated_at();

insert into public.prompt_injections (key, value)
values
  (
    'lesson_generation_profile',
    'Primary audience is beginner-to-intermediate learners preparing for technical assessments. Use clear, confidence-building language with practical examples and avoid dense jargon. Keep explanations structured, concise, and directly aligned to lesson outcomes.'
  ),
  (
    'tutor_response_profile',
    'Respond with concise, supportive coaching tailored to the learner''s pace and confidence. Prioritize clear hints, short feedback, and simple language before technical depth. Guide reasoning without revealing full solutions unless the mode explicitly allows it.'
  )
on conflict (key) do nothing;

alter table public.prompt_injections enable row level security;

drop policy if exists "prompt_injections_admin_select" on public.prompt_injections;
create policy "prompt_injections_admin_select"
on public.prompt_injections
for select
using (public.is_admin());

drop policy if exists "prompt_injections_admin_insert" on public.prompt_injections;
create policy "prompt_injections_admin_insert"
on public.prompt_injections
for insert
with check (public.is_admin());

drop policy if exists "prompt_injections_admin_update" on public.prompt_injections;
create policy "prompt_injections_admin_update"
on public.prompt_injections
for update
using (public.is_admin())
with check (public.is_admin());
