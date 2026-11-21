-- Tiruan minimal Supabase: skema auth, auth.uid(), peran anon/authenticated.
create role anon nologin; create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key default gen_random_uuid(), email text, raw_user_meta_data jsonb default '{}'::jsonb);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
grant usage on schema auth to authenticated; grant select on auth.users to authenticated;

create schema storage;
create table storage.buckets (
  id text primary key,
  name text not null,
  public boolean not null default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);
create table storage.objects (bucket_id text not null, name text not null);
alter table storage.objects enable row level security;
create function storage.foldername(object_name text) returns text[]
language sql immutable as $$ select string_to_array(object_name, '/') $$;
grant usage on schema storage to authenticated, anon;
grant select, insert, update, delete on storage.buckets, storage.objects to authenticated, anon;
