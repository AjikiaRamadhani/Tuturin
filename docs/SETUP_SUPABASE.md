# Setup Tuturin dengan Supabase (akun, database, admin)

Urutannya penting. Total sekitar 30 menit.

## 1. Buat proyek Supabase
1. Buka https://supabase.com, daftar, lalu **New project** (pilih region terdekat, mis. Singapore). Catat password database.
2. Tunggu proyek siap. Buka **Project Settings > API**. Salin dua nilai:
   - **Project URL** (bentuk `https://abcdefgh.supabase.co`)
   - **Publishable key** (atau anon public key pada proyek lama)
   Jangan pernah memakai atau membagikan `sb_secret`/`service_role` key.

## 2. Buat tabel, aturan akses, dan data awal
1. Buka **SQL Editor > New query**. Tempel seluruh isi `supabase/schema.sql`, klik **Run**.
2. Query baru lagi, tempel seluruh isi `supabase/seed.sql`, klik **Run**. Ini memasukkan 18 pelajaran dengan 108 frasa latihan.
3. Cek di **Table Editor**: ada tabel `profiles`, `lessons` (18 baris), `lesson_steps` (108 baris), `lesson_results`, `streaks`, `saved_vocab`, serta bucket Storage `avatars`.
   File schema dan seed aman dijalankan ulang untuk memperbarui proyek yang sudah ada.

## 3. Pengaturan login
Buka **Authentication**:
- **Providers > Email**: pastikan aktif.
  - **Confirm email**: matikan selama pengembangan dan pengujian Maestro supaya akun baru langsung bisa masuk.
    Nyalakan lagi saat dipakai orang sungguhan. Aplikasi sudah menangani kedua keadaan.
- **URL Configuration**: isi **Site URL** dengan alamat website Tuturin yang akan dipakai. Tambahkan juga URL berikut ke **Redirect URLs**:
  - `tuturin://auth-callback` untuk APK/development build.
  - `http://localhost:8081/auth-callback` untuk website lokal (sesuaikan port jika Expo menampilkan port lain).
  Saat mengundang dari Dashboard, arahkan tautan undangan ke `tuturin://auth-callback` jika kolom redirect tersedia. Email reset yang diminta dari APK memakai alamat callback ini otomatis.
- Email bawaan Supabase dibatasi beberapa email per jam. Untuk pemakaian nyata pasang SMTP sendiri
  (Authentication > Emails > SMTP Settings).

## 4. Hubungkan aplikasi
1. Buka `config.js`, isi `SUPABASE_URL` dan `SUPABASE_ANON_KEY` dari langkah 1.
2. Pasang dependensi dari lockfile dengan `npm ci`, lalu jalankan `npx expo start -c`.
   Kalau `config.js` belum diisi, aplikasi menampilkan layar petunjuk, bukan crash.

## 5. Buat akun admin pertama
Pendaftaran tetap membuat akun sebagai pelajar. Admin memakai formulir masuk yang sama, lalu aplikasi menampilkan dashboard khusus berdasarkan role database. Alamat email khusus saja tidak memberi hak admin.
1. Jika akun admin sudah dibuat lewat **Authentication > Users > Add user > Send invitation**, buka email undangannya dari HP yang sudah memasang APK terbaru Tuturin. Setelah redirect Supabase diarahkan ke `tuturin://auth-callback`, aplikasi memverifikasi tautan dan menampilkan layar **Buat password**.
   Kalau akun dibuat lewat **Add user** tanpa invitation, buka aplikasi, pilih **Lupa password?**, lalu ikuti email reset untuk membuat password. Ini juga cara termudah untuk akun yang sudah terlanjur dibuat tanpa password.
   Untuk membuat akun admin dari nol, daftar dulu dari aplikasi menggunakan email khusus yang kamu inginkan.
2. Di SQL Editor jalankan (ganti emailnya):
   ```sql
   update public.profiles set role = 'admin' where email = 'emailmu@contoh.com';
   ```
3. Admin berikutnya dapat dijadikan admin dari dashboard Tuturin (tab Pengguna).

## 6. Buka dashboard admin
Jalankan aplikasi atau website Tuturin seperti biasa. Masuk dengan akun yang role-nya `admin`; aplikasi akan langsung membuka dashboard admin. Admin dapat menambah/mengedit/menghapus pelajaran, menerbitkan draf, serta mengubah role dan status pengguna. Akun pelajar tetap masuk ke beranda belajar.

Dashboard memeriksa role dari Supabase dan database tetap menolak perubahan yang tidak berhak. Jangan mengubah aplikasi agar memberi role admin hanya berdasarkan kecocokan email.

### Yang bisa dilakukan admin
- **Pelajaran:** tambah, edit langkah, terbitkan atau sembunyikan (draf), hapus. Pelajar langsung melihat perubahan saat membuka aplikasi lagi, tanpa APK baru.
  Jalur pelajar mengurutkan materi menurut tujuan, level, dan `sort_order`; materi berikutnya terbuka setelah pelajaran sebelumnya diselesaikan.
- **Pengguna:** lihat daftar, jumlah pelajaran selesai dan hari terakhir, ubah peran pelajar/admin, nonaktifkan atau aktifkan akun.
  Admin terakhir tidak bisa diturunkan, dinonaktifkan, atau menghapus akunnya (dijaga di database).

## 7. Membuat APK
Jalankan `npx eas-cli@latest build --platform android --profile preview`. Pasang APK terbaru agar route callback undangan/reset tersedia. Pastikan `config.js` sudah terisi sebelum build,
karena nilainya ikut tertanam di APK.

## Keamanan singkat
- Anon key boleh ada di aplikasi dan halaman admin. Yang menjaga data adalah aturan akses (RLS) di `schema.sql`:
  pelajar hanya membaca pelajaran terbit dan hanya mengakses datanya sendiri; hanya admin yang boleh menulis pelajaran dan mengubah peran.
- Pelajar tidak bisa menaikkan perannya sendiri (dijaga trigger di database, bukan hanya di layar).
- Jangan menaruh `sb_secret` atau `service_role` key di `config.js`, panel admin, atau APK.
- Akun nonaktif tidak bisa membaca pelajaran atau menyimpan progres.
- Pengguna bisa menghapus akunnya sendiri dari menu Akun (semua datanya ikut terhapus).
- Foto profil berada di bucket privat `avatars`; setiap akun hanya bisa membaca, mengunggah, dan menghapus file pada folder dengan ID miliknya. Pengguna dapat mengganti foto atau menghapusnya untuk kembali ke gambar bawaan.

## Hal yang perlu diketahui
- Proyek Supabase gratis **dijeda otomatis jika tidak dipakai sekitar 7 hari**. Buka dashboard lalu klik Restore.
- Gratis tidak ada backup otomatis yang bisa dipulihkan sendiri. Untuk data penting, ekspor berkala atau upgrade.
- Untuk rilis ke Play Store masih perlu: halaman kebijakan privasi (aplikasi menyimpan email dan progres), formulir Data safety,
  dan tanda tangan rilis. Fitur hapus akun di dalam aplikasi sudah ada karena Play Store mensyaratkannya.
- Nala masih skrip, bukan AI sungguhan.

## Uji aturan akses
`supabase/tests/rls_test.sql` menguji aturan akses tabel dan Storage, termasuk pembatasan folder avatar serta akun nonaktif. Butuh Postgres lokal dengan tiruan Supabase:
buat database kosong, jalankan `tests/supabase_shim.sql`, `schema.sql`, `seed.sql`, lalu `tests/rls_test.sql`. Semua baris harus berawalan `ok`.
Jangan menjalankan berkas di folder tests pada proyek Supabase asli (berkas itu mengosongkan tabel pengguna).
