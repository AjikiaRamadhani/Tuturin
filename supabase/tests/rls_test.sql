\set ON_ERROR_STOP on
drop schema if exists tt cascade; create schema tt;
create table tt.res (n serial, name text, ok boolean, detail text);
create function tt.rec(name text, ok boolean, detail text default '') returns void language sql security definer as $$ insert into tt.res(name, ok, detail) values (name, ok, detail) $$;
create function tt.as_user(uid uuid) returns void language plpgsql as $$ begin perform set_config('request.jwt.claim.sub', coalesce(uid::text, ''), true); execute 'set local role authenticated'; end $$;
create function tt.as_anon() returns void language plpgsql as $$ begin perform set_config('request.jwt.claim.sub', '', true); execute 'set local role anon'; end $$;
create function tt.back() returns void language plpgsql as $$ begin execute 'reset role'; perform set_config('request.jwt.claim.sub', '', true); end $$;
grant usage on schema tt to anon, authenticated; grant execute on all functions in schema tt to anon, authenticated;
truncate auth.users cascade; delete from lesson_results; 
insert into auth.users (id, email) values
 ('00000000-0000-0000-0000-00000000000a', 'admin@x.id'),
 ('00000000-0000-0000-0000-00000000000b', 'budi@x.id'),
 ('00000000-0000-0000-0000-00000000000c', 'cici@x.id');
update profiles set role = 'admin' where email = 'admin@x.id';   -- bootstrap lewat SQL Editor (tanpa jwt)
delete from storage.objects where bucket_id = 'avatars' and name in (
  '00000000-0000-0000-0000-00000000000a/admin-fixture.png',
  '00000000-0000-0000-0000-00000000000b/budi-fixture.png',
  '00000000-0000-0000-0000-00000000000b/budi-renamed.png',
  '00000000-0000-0000-0000-00000000000b/inactive-fixture.png',
  '00000000-0000-0000-0000-00000000000b/inactive-upload.png',
  '00000000-0000-0000-0000-00000000000c/cici-fixture.png',
  '00000000-0000-0000-0000-00000000000c/hack.png'
);
insert into storage.objects (bucket_id, name) values
  ('avatars', '00000000-0000-0000-0000-00000000000a/admin-fixture.png'),
  ('avatars', '00000000-0000-0000-0000-00000000000c/cici-fixture.png');

do $$
declare A uuid := '00000000-0000-0000-0000-00000000000a'; B uuid := '00000000-0000-0000-0000-00000000000b'; C uuid := '00000000-0000-0000-0000-00000000000c';
  n int; r text; ok boolean;
begin
  -- 1 profil otomatis
  perform tt.rec('profil dibuat otomatis, peran awal learner', (select role = 'learner' and display_name = 'budi' from profiles where id = B));
  perform tt.rec('admin awal bisa diatur lewat SQL Editor', (select role = 'admin' from profiles where id = A));

  -- 2 pelajar
  perform tt.as_user(B);
  select count(*) into n from profiles; perform tt.rec('pelajar hanya melihat profilnya sendiri', n = 1, n::text);
  update profiles set level = 'menengah', goal = 'karier', target = 2 where id = B; get diagnostics n = row_count;
  perform tt.rec('pelajar boleh mengubah level/tujuan/target sendiri', n = 1);
  begin update profiles set role = 'admin' where id = B; perform tt.rec('pelajar TIDAK boleh menaikkan perannya', false); exception when others then perform tt.rec('pelajar TIDAK boleh menaikkan perannya', true, sqlerrm); end;
  begin update profiles set active = false where id = B; perform tt.rec('pelajar tidak boleh mengubah status aktif', false); exception when others then perform tt.rec('pelajar tidak boleh mengubah status aktif', true); end;
  begin update profiles set email = 'x@x.id' where id = B; perform tt.rec('pelajar tidak boleh mengubah email profil', false); exception when others then perform tt.rec('pelajar tidak boleh mengubah email profil', true); end;
  begin update profiles set target = 5 where id = B; perform tt.rec('target di luar 1..3 ditolak', false); exception when others then perform tt.rec('target di luar 1..3 ditolak', true); end;
  update profiles set display_name = 'hack' where id = C; get diagnostics n = row_count; perform tt.rec('pelajar tidak bisa mengubah profil orang lain', n = 0);
  select count(*) into n from lessons; perform tt.rec('pelajar melihat 18 pelajaran terbit', n = 18, n::text);
  select count(*) into n from lesson_steps; perform tt.rec('pelajar melihat 108 langkah', n = 108, n::text);
  insert into storage.objects (bucket_id, name) values ('avatars', B::text || '/budi-fixture.png'); get diagnostics n = row_count;
  perform tt.rec('pelajar mengunggah avatar ke folder sendiri', n = 1);
  update storage.objects set name = B::text || '/budi-renamed.png' where bucket_id = 'avatars' and name = B::text || '/budi-fixture.png'; get diagnostics n = row_count;
  perform tt.rec('pelajar dapat mengganti objek avatar sendiri', n = 1);
  update storage.objects set name = B::text || '/hack.png' where bucket_id = 'avatars' and name = '00000000-0000-0000-0000-00000000000c/cici-fixture.png'; get diagnostics n = row_count;
  perform tt.rec('pelajar tidak dapat mengganti objek avatar orang lain', n = 0);
  perform tt.rec('pelajar dapat membaca avatar sendiri', (select count(*) from storage.objects where bucket_id = 'avatars' and name = B::text || '/budi-renamed.png') = 1);
  select count(*) into n from storage.objects where bucket_id = 'avatars' and name = '00000000-0000-0000-0000-00000000000c/cici-fixture.png';
  perform tt.rec('pelajar tidak dapat membaca avatar orang lain', n = 0);
  begin insert into storage.objects (bucket_id, name) values ('avatars', '00000000-0000-0000-0000-00000000000c/hack.png'); perform tt.rec('pelajar tidak dapat mengunggah ke folder orang lain', false); exception when others then perform tt.rec('pelajar tidak dapat mengunggah ke folder orang lain', true); end;
  delete from storage.objects where bucket_id = 'avatars' and name = '00000000-0000-0000-0000-00000000000c/cici-fixture.png'; get diagnostics n = row_count;
  perform tt.rec('pelajar tidak dapat menghapus avatar orang lain', n = 0);
  delete from storage.objects where bucket_id = 'avatars' and name = B::text || '/budi-renamed.png'; get diagnostics n = row_count;
  perform tt.rec('pelajar dapat menghapus avatar sendiri', n = 1);
  begin insert into lessons (id, level, goal, title, objectives) values ('hack', 'pemula', 'ujian', 'x', array['y']); perform tt.rec('pelajar tidak boleh menambah pelajaran', false); exception when others then perform tt.rec('pelajar tidak boleh menambah pelajaran', true); end;
  update lessons set title = 'diubah' where id = 'pemula-ujian'; get diagnostics n = row_count; perform tt.rec('pelajar tidak bisa mengubah pelajaran', n = 0);
  delete from lessons where id = 'pemula-ujian'; get diagnostics n = row_count; perform tt.rec('pelajar tidak bisa menghapus pelajaran', n = 0);
  delete from lesson_steps where lesson_id = 'pemula-ujian'; get diagnostics n = row_count; perform tt.rec('pelajar tidak bisa menghapus langkah', n = 0);
  begin perform save_lesson('{"id":"hack","level":"pemula","goal":"ujian","title":"x","objectives":["y"],"steps":[{"en":"a","id":"b"}]}'::jsonb); perform tt.rec('pelajar tidak boleh memanggil save_lesson', false); exception when others then perform tt.rec('pelajar tidak boleh memanggil save_lesson', true, sqlerrm); end;

  -- 3 data pribadi
  insert into lesson_results (user_id, lesson_id, day, mastery, seconds) values (B, 'pemula-ujian', current_date, 88, 120);
  insert into streaks (user_id, last_day, count) values (B, current_date, 1);
  insert into saved_vocab (user_id, en, id_text) values (B, 'Hello', 'Halo');
  perform tt.rec('pelajar menyimpan hasil, streak, kosakata sendiri', (select count(*) from lesson_results) = 1);
  begin insert into saved_vocab (user_id, en, id_text) values (C, 'Hi', 'Hai'); perform tt.rec('pelajar tidak bisa menulis data orang lain', false); exception when others then perform tt.rec('pelajar tidak bisa menulis data orang lain', true); end;
  perform tt.back();
  perform tt.as_user(C);
  select count(*) into n from lesson_results; perform tt.rec('pelajar lain tidak melihat hasil Budi', n = 0);
  select count(*) into n from saved_vocab; perform tt.rec('pelajar lain tidak melihat kosakata Budi', n = 0);
  perform tt.back();

  -- 4 anon
  perform tt.as_anon();
  begin perform count(*) from lessons; perform tt.rec('tanpa login tidak bisa membaca pelajaran', false); exception when others then perform tt.rec('tanpa login tidak bisa membaca pelajaran', true); end;
  perform tt.back();

  -- 5 admin
  perform tt.as_user(A);
  select count(*) into n from storage.objects where bucket_id = 'avatars' and name = A::text || '/admin-fixture.png';
  perform tt.rec('admin dapat membaca avatar sendiri', n = 1);
  select count(*) into n from storage.objects where bucket_id = 'avatars' and name = '00000000-0000-0000-0000-00000000000c/cici-fixture.png';
  perform tt.rec('admin hanya dapat membaca avatar di foldernya sendiri', n = 0);
  select count(*) into n from profiles; perform tt.rec('admin melihat semua profil', n = 3, n::text);
  select count(*) into n from lesson_results; perform tt.rec('admin dapat membaca hasil semua pelajar', n = 1);
  begin insert into saved_vocab (user_id, en, id_text) values (B, 'Hack', 'x'); perform tt.rec('admin tidak menulis kosakata pelajar', false); exception when others then perform tt.rec('admin tidak menulis kosakata pelajar', true); end;
  perform save_lesson('{"id":"baru-satu","level":"pemula","goal":"karier","title":"Pelajaran Baru","minutes":6,"objectives":["Tujuan A","Tujuan B"],"published":false,"sort_order":5,"steps":[{"en":"One.","id":"Satu."},{"en":"Two.","id":"Dua."},{"en":"Three.","id":"Tiga."}]}'::jsonb);
  select count(*) into n from lesson_steps where lesson_id = 'baru-satu'; perform tt.rec('admin menambah pelajaran dengan 3 langkah (draf)', n = 3, n::text);
  perform tt.back();
  perform tt.as_user(B);
  select count(*) into n from lessons where id = 'baru-satu'; perform tt.rec('draf tidak terlihat oleh pelajar', n = 0);
  select count(*) into n from lesson_steps where lesson_id = 'baru-satu'; perform tt.rec('langkah draf tidak terlihat oleh pelajar', n = 0);
  perform tt.back();
  perform tt.as_user(A);
  perform save_lesson('{"id":"baru-satu","level":"pemula","goal":"karier","title":"Pelajaran Baru","minutes":6,"objectives":["Tujuan A"],"published":true,"sort_order":5,"steps":[{"en":"One.","id":"Satu."},{"en":"Two.","id":"Dua."}]}'::jsonb);
  perform tt.rec('menyimpan ulang mengganti langkah (3 jadi 2)', (select count(*) from lesson_steps where lesson_id = 'baru-satu') = 2);
  perform tt.back();
  perform tt.as_user(B);
  select count(*) into n from lessons where id = 'baru-satu'; perform tt.rec('pelajaran terbit terlihat oleh pelajar', n = 1);
  select count(*) into n from lesson_steps where lesson_id = 'baru-satu'; perform tt.rec('langkah pelajaran terbit terlihat', n = 2);
  perform tt.back();
  perform tt.as_user(A);
  begin perform save_lesson('{"id":"kosong","level":"pemula","goal":"ujian","title":"x","objectives":["y"],"steps":[]}'::jsonb); perform tt.rec('pelajaran tanpa langkah ditolak', false); exception when others then perform tt.rec('pelajaran tanpa langkah ditolak', true, sqlerrm); end;
  begin perform save_lesson('{"id":"Bad Id","level":"pemula","goal":"ujian","title":"x","objectives":["y"],"steps":[{"en":"a","id":"b"}]}'::jsonb); perform tt.rec('id pelajaran tidak valid ditolak', false); exception when others then perform tt.rec('id pelajaran tidak valid ditolak', true); end;
  begin perform save_lesson('{"id":"lvl","level":"expert","goal":"ujian","title":"x","objectives":["y"],"steps":[{"en":"a","id":"b"}]}'::jsonb); perform tt.rec('level tidak dikenal ditolak', false); exception when others then perform tt.rec('level tidak dikenal ditolak', true); end;
  perform tt.rec('transaksi gagal tidak meninggalkan sisa', (select count(*) from lessons where id in ('kosong','lvl')) = 0 and (select count(*) from lesson_steps where lesson_id = 'kosong') = 0);
  update lessons set published = false where id = 'pemula-ujian'; get diagnostics n = row_count; perform tt.rec('admin dapat menyembunyikan pelajaran', n = 1);
  perform tt.back();
  perform tt.as_user(B); select count(*) into n from lessons where id = 'pemula-ujian'; perform tt.rec('pelajaran disembunyikan hilang dari pelajar', n = 0); perform tt.back();

  -- 6 nonaktif
  perform tt.as_user(A);
  update profiles set active = false where id = B; get diagnostics n = row_count; perform tt.rec('admin dapat menonaktifkan pelajar', n = 1);
  perform tt.back();
  insert into storage.objects (bucket_id, name) values ('avatars', B::text || '/inactive-fixture.png');
  perform tt.as_user(B);
  select count(*) into n from lessons; perform tt.rec('akun nonaktif tidak melihat pelajaran', n = 0);
  select count(*) into n from profiles; perform tt.rec('akun nonaktif masih membaca profilnya (untuk pesan)', n = 1);
  select count(*) into n from storage.objects where bucket_id = 'avatars' and name = B::text || '/inactive-fixture.png'; perform tt.rec('akun nonaktif tidak dapat membaca avatar', n = 0);
  begin insert into storage.objects (bucket_id, name) values ('avatars', B::text || '/inactive-upload.png'); perform tt.rec('akun nonaktif tidak dapat mengunggah avatar', false); exception when others then perform tt.rec('akun nonaktif tidak dapat mengunggah avatar', true); end;
  delete from storage.objects where bucket_id = 'avatars' and name = B::text || '/inactive-fixture.png'; get diagnostics n = row_count; perform tt.rec('akun nonaktif tidak dapat menghapus avatar', n = 0);
  begin insert into lesson_results (user_id, lesson_id, day, mastery, seconds) values (B, 'x', current_date, 1, 1); perform tt.rec('akun nonaktif tidak bisa menyimpan hasil', false); exception when others then perform tt.rec('akun nonaktif tidak bisa menyimpan hasil', true); end;
  update profiles set active = true where id = B; get diagnostics n = row_count; perform tt.rec('akun nonaktif tidak bisa mengaktifkan dirinya', n = 0);
  perform tt.back();
  perform tt.as_user(A); update profiles set active = true where id = B; perform tt.back();
  delete from storage.objects where bucket_id = 'avatars' and name = B::text || '/inactive-fixture.png';

  -- 7 admin terakhir
  perform tt.as_user(A);
  begin update profiles set role = 'learner' where id = A; perform tt.rec('admin terakhir tidak boleh diturunkan', false); exception when others then perform tt.rec('admin terakhir tidak boleh diturunkan', true, sqlerrm); end;
  begin update profiles set active = false where id = A; perform tt.rec('admin terakhir tidak boleh dinonaktifkan', false); exception when others then perform tt.rec('admin terakhir tidak boleh dinonaktifkan', true); end;
  begin perform delete_my_account(); perform tt.rec('admin terakhir tidak boleh menghapus akun', false); exception when others then perform tt.rec('admin terakhir tidak boleh menghapus akun', true, sqlerrm); end;
  update profiles set role = 'admin' where id = C; perform tt.rec('admin dapat mengangkat admin kedua', (select role from profiles where id = C) = 'admin' );
  update profiles set role = 'learner' where id = A; get diagnostics n = row_count; perform tt.rec('dengan admin kedua, admin boleh turun peran', n = 1);
  perform tt.back();
  perform tt.as_user(A);
  select count(*) into n from lessons where published; perform tt.rec('mantan admin kini seperti pelajar (hanya terbit)', n = 18, n::text);
  perform tt.back();
  update profiles set role = 'admin' where id = A; update profiles set role = 'learner' where id = C;

  -- 8 hapus akun
  perform tt.as_user(B);
  perform delete_my_account();
  perform tt.back();
  perform tt.rec('hapus akun menghapus profil dan semua data', (select count(*) from profiles where id = B) = 0 and (select count(*) from saved_vocab where user_id = B) = 0 and (select count(*) from lesson_results where user_id = B) = 0 and (select count(*) from streaks where user_id = B) = 0);
end $$;
select case when ok then 'ok   ' else 'FAIL ' end || name || case when ok then '' else '  <<<' || detail end as hasil from tt.res order by n;
select count(*) filter (where ok) as lolos, count(*) filter (where not ok) as gagal from tt.res;
