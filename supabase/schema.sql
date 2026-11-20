-- Tuturin: skema database Supabase.
-- Jalankan sekali di Supabase Dashboard > SQL Editor (seluruh isi file ini), lalu jalankan seed.sql.
-- Aman dijalankan ulang: memakai "if not exists" dan "create or replace".

-- ============ Tabel ============

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  email        text not null,
  display_name text,
  avatar_path  text,
  role         text not null default 'learner' check (role in ('learner', 'admin')),
  active       boolean not null default true,
  level        text check (level in ('pemula', 'menengah', 'mahir')),
  goal         text check (goal in ('percakapan', 'karier', 'perjalanan', 'ujian')),
  target       int  check (target between 1 and 3),
  created_at   timestamptz not null default now()
);

alter table public.profiles add column if not exists avatar_path text;

create table if not exists public.lessons (
  id          text primary key check (id ~ '^[a-z0-9-]+$'),
  level       text not null check (level in ('pemula', 'menengah', 'mahir')),
  goal        text not null check (goal in ('percakapan', 'karier', 'perjalanan', 'ujian')),
  title       text not null check (length(trim(title)) > 0),
  minutes     int  not null default 4 check (minutes between 1 and 60),
  objectives  text[] not null check (array_length(objectives, 1) between 1 and 5),
  published   boolean not null default false,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.lesson_steps (
  lesson_id text not null references public.lessons (id) on delete cascade,
  position  int  not null check (position >= 0),
  en        text not null check (length(trim(en)) > 0),
  id_text   text not null check (length(trim(id_text)) > 0),
  primary key (lesson_id, position)
);

-- Riwayat selesai per pengguna. lesson_id sengaja tanpa foreign key agar riwayat tetap ada
-- kalau admin menghapus pelajaran.
create table if not exists public.lesson_results (
  user_id    uuid not null references auth.users (id) on delete cascade,
  lesson_id  text not null,
  day        date not null,
  mastery    int  not null check (mastery between 0 and 100),
  seconds    int  not null check (seconds >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, lesson_id, day)
);

create table if not exists public.streaks (
  user_id  uuid primary key references auth.users (id) on delete cascade,
  last_day date,
  count    int not null default 0 check (count >= 0)
);

create table if not exists public.saved_vocab (
  user_id    uuid not null references auth.users (id) on delete cascade,
  en         text not null,
  id_text    text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, en)
);

-- Foto profil privat; setiap akun hanya dapat membaca dan mengelola foldernya sendiri.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ============ Fungsi bantu ============

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and active)
$$;

create or replace function public.is_active() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and active)
$$;

-- Profil dibuat otomatis saat ada akun baru. Peran awal selalu learner.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1)));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Pelajar tidak boleh mengubah peran, status, atau email sendiri. Admin terakhir tidak boleh hilang.
-- (auth.uid() kosong saat dijalankan dari SQL Editor, jadi pengaturan admin pertama lewat SQL tetap bisa.)
create or replace function public.protect_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if new.role is distinct from old.role or new.active is distinct from old.active
       or new.email is distinct from old.email or new.id is distinct from old.id then
      raise exception 'Tidak boleh mengubah peran, status, atau email';
    end if;
  end if;
  if old.role = 'admin' and old.active and (new.role <> 'admin' or not new.active)
     and (select count(*) from public.profiles where role = 'admin' and active) <= 1 then
    raise exception 'Tidak boleh menghapus atau menonaktifkan admin terakhir';
  end if;
  return new;
end $$;

drop trigger if exists protect_profile_trg on public.profiles;
create trigger protect_profile_trg before update on public.profiles
  for each row execute function public.protect_profile();

create or replace function public.touch_lesson() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists touch_lesson_trg on public.lessons;
create trigger touch_lesson_trg before update on public.lessons
  for each row execute function public.touch_lesson();

-- ============ Aturan akses (Row Level Security) ============

alter table public.profiles       enable row level security;
alter table public.lessons        enable row level security;
alter table public.lesson_steps   enable row level security;
alter table public.lesson_results enable row level security;
alter table public.streaks        enable row level security;
alter table public.saved_vocab    enable row level security;

drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid() and public.is_active()) with check (id = auth.uid());

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin on public.profiles for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists lessons_select on public.lessons;
create policy lessons_select on public.lessons for select to authenticated
  using (public.is_active() and (published or public.is_admin()));

drop policy if exists lessons_admin on public.lessons;
create policy lessons_admin on public.lessons for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists steps_select on public.lesson_steps;
create policy steps_select on public.lesson_steps for select to authenticated
  using (public.is_active() and exists (select 1 from public.lessons l where l.id = lesson_id));

drop policy if exists steps_admin on public.lesson_steps;
create policy steps_admin on public.lesson_steps for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists results_own on public.lesson_results;
create policy results_own on public.lesson_results for all to authenticated
  using (user_id = auth.uid() and public.is_active()) with check (user_id = auth.uid() and public.is_active());

drop policy if exists results_admin_read on public.lesson_results;
create policy results_admin_read on public.lesson_results for select to authenticated
  using (public.is_admin());

drop policy if exists streaks_own on public.streaks;
create policy streaks_own on public.streaks for all to authenticated
  using (user_id = auth.uid() and public.is_active()) with check (user_id = auth.uid() and public.is_active());

drop policy if exists vocab_own on public.saved_vocab;
create policy vocab_own on public.saved_vocab for all to authenticated
  using (user_id = auth.uid() and public.is_active()) with check (user_id = auth.uid() and public.is_active());

drop policy if exists avatars_public_read on storage.objects;
drop policy if exists avatars_read_own on storage.objects;
create policy avatars_read_own on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text and public.is_active());

drop policy if exists avatars_insert_own on storage.objects;
create policy avatars_insert_own on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text and public.is_active());

drop policy if exists avatars_update_own on storage.objects;
create policy avatars_update_own on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text and public.is_active())
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text and public.is_active());

drop policy if exists avatars_delete_own on storage.objects;
create policy avatars_delete_own on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text and public.is_active());

grant usage on schema public to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke all on all tables in schema public from anon;

-- ============ RPC ============

-- Admin menyimpan pelajaran beserta langkahnya dalam satu transaksi.
-- p: { id, level, goal, title, minutes, objectives: [..], published, sort_order, steps: [{en, id}] }
create or replace function public.save_lesson(p jsonb) returns text
language plpgsql security definer set search_path = public as $$
declare
  lid text := p ->> 'id';
  step jsonb;
  pos int := 0;
begin
  if not public.is_admin() then
    raise exception 'Hanya admin yang boleh menyimpan pelajaran';
  end if;
  if jsonb_typeof(p -> 'steps') is distinct from 'array' or jsonb_array_length(p -> 'steps') < 1 then
    raise exception 'Pelajaran harus punya minimal satu langkah';
  end if;

  insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
  values (lid, p ->> 'level', p ->> 'goal', p ->> 'title', coalesce((p ->> 'minutes')::int, 4),
          array(select jsonb_array_elements_text(p -> 'objectives')),
          coalesce((p ->> 'published')::boolean, false), coalesce((p ->> 'sort_order')::int, 0))
  on conflict (id) do update set
    level = excluded.level, goal = excluded.goal, title = excluded.title, minutes = excluded.minutes,
    objectives = excluded.objectives, published = excluded.published, sort_order = excluded.sort_order;

  delete from public.lesson_steps where lesson_id = lid;
  for step in select * from jsonb_array_elements(p -> 'steps') loop
    insert into public.lesson_steps (lesson_id, position, en, id_text)
    values (lid, pos, step ->> 'en', step ->> 'id');
    pos := pos + 1;
  end loop;
  return lid;
end $$;

-- Pengguna menghapus akunnya sendiri beserta semua datanya.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then
    raise exception 'Belum masuk';
  end if;
  if public.is_admin() and (select count(*) from public.profiles where role = 'admin' and active) <= 1 then
    raise exception 'Admin terakhir tidak boleh menghapus akunnya';
  end if;
  delete from auth.users where id = auth.uid();
end $$;

revoke all on function public.save_lesson(jsonb) from public, anon;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.save_lesson(jsonb) to authenticated;
grant execute on function public.delete_my_account() to authenticated;
