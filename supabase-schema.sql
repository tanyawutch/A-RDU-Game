-- ARD Learning Game Supabase schema
-- Run this in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'student' check (role in ('student','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  game_id text not null,
  game_title text not null,
  score integer not null default 0,
  stars integer not null default 0,
  completed_count integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.survey_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  profile jsonb not null default '{}'::jsonb,
  confidence jsonb not null default '{}'::jsonb,
  knowledge jsonb not null default '{}'::jsonb,
  quiz_score integer,
  quiz_total integer,
  quiz_percent numeric,
  satisfaction jsonb not null default '{}'::jsonb,
  suggestion text,
  game_score_text text,
  game_stars_text text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_ard_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.user_profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
      and lower(p.email) = 'ardumfu@gmail.com'
  );
$$;

create or replace function public.handle_ard_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_email text := lower(coalesce(new.email,''));
begin
  if user_email <> 'ardumfu@gmail.com'
     and user_email not like '%@lamduan.mfu.ac.th' then
    raise exception 'Only @lamduan.mfu.ac.th email addresses can register.';
  end if;

  insert into public.user_profiles(id,email,role)
  values (new.id, user_email, case when user_email = 'ardumfu@gmail.com' then 'admin' else 'student' end)
  on conflict (id) do update set
    email = excluded.email,
    role = case when excluded.email = 'ardumfu@gmail.com' then 'admin' else public.user_profiles.role end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_ard on auth.users;
create trigger on_auth_user_created_ard
  after insert on auth.users
  for each row execute function public.handle_ard_new_user();

alter table public.user_profiles enable row level security;
alter table public.game_scores enable row level security;
alter table public.survey_submissions enable row level security;

drop policy if exists "profile own read" on public.user_profiles;
create policy "profile own read" on public.user_profiles
  for select using (auth.uid() = id or public.is_ard_admin());

drop policy if exists "score own insert" on public.game_scores;
create policy "score own insert" on public.game_scores
  for insert with check (auth.uid() = user_id);

drop policy if exists "score own or admin read" on public.game_scores;
create policy "score own or admin read" on public.game_scores
  for select using (auth.uid() = user_id or public.is_ard_admin());

drop policy if exists "survey own insert" on public.survey_submissions;
create policy "survey own insert" on public.survey_submissions
  for insert with check (auth.uid() = user_id);

drop policy if exists "survey own or admin read" on public.survey_submissions;
create policy "survey own or admin read" on public.survey_submissions
  for select using (auth.uid() = user_id or public.is_ard_admin());

create index if not exists idx_game_scores_user_created on public.game_scores(user_id, created_at desc);
create index if not exists idx_survey_submissions_user_created on public.survey_submissions(user_id, created_at desc);

alter table public.survey_submissions add column if not exists quiz_score integer;
alter table public.survey_submissions add column if not exists quiz_total integer;
alter table public.survey_submissions add column if not exists quiz_percent numeric;
