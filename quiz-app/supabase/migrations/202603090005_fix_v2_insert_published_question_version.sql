create or replace function public.v2_insert_published_question_version(
  target_question_id uuid,
  version_source text,
  version_quality_score numeric,
  version_stem text,
  version_answer_key jsonb default '{}'::jsonb,
  version_metadata jsonb default '{}'::jsonb,
  actor_user_id uuid default null,
  publish_ts timestamptz default now()
)
returns table (
  id uuid,
  question_id uuid,
  version_no integer,
  status public.v2_content_status,
  is_current boolean,
  published_at timestamptz
)
language plpgsql
as $$
declare
  next_version_no integer;
begin
  perform 1
  from public.v2_questions q
  where q.id = target_question_id
  for update;

  if not found then
    return;
  end if;

  select coalesce(max(v.version_no), 0) + 1
  into next_version_no
  from public.v2_question_versions v
  where v.question_id = target_question_id;

  update public.v2_question_versions qv
  set
    status = case when qv.status = 'published' then 'retired' else qv.status end,
    is_current = false
  where qv.question_id = target_question_id
    and (qv.is_current = true or qv.status = 'published');

  return query
  insert into public.v2_question_versions (
    question_id,
    version_no,
    status,
    source,
    quality_score,
    stem,
    answer_key,
    metadata,
    is_current,
    created_by,
    approved_by,
    published_at
  )
  values (
    target_question_id,
    next_version_no,
    'published',
    version_source,
    version_quality_score,
    version_stem,
    version_answer_key,
    version_metadata,
    true,
    actor_user_id,
    actor_user_id,
    publish_ts
  )
  returning
    v2_question_versions.id,
    v2_question_versions.question_id,
    v2_question_versions.version_no,
    v2_question_versions.status,
    v2_question_versions.is_current,
    v2_question_versions.published_at;
end;
$$;
