# Tuturin

Tuturin adalah aplikasi latihan berbicara bahasa Inggris untuk tugas Mobile Testing, Kelompok 2 NullPointer. Aplikasi ini mengambil inspirasi dari alur belajar Pingo AI: pengguna memilih preferensi, berlatih percakapan, lalu menerima umpan balik.

Proyek dibuat dengan Expo SDK 58 dan React Native. Versi saat ini menggunakan Supabase untuk autentikasi dan penyimpanan data. Pelajar dan admin memakai aplikasi/website yang sama; tampilan setelah login mengikuti role pada profil Supabase.

## Fitur

- Daftar, masuk, reset kata sandi, dan hapus akun.
- Halaman sambutan animasi, tautan undangan, dan layar untuk membuat password pertama/reset.
- Peran `learner` dan `admin`; pendaftaran baru selalu menjadi pelajar.
- Preferensi belajar: level, tujuan, dan target harian.
- Jalur belajar bertahap sesuai tujuan, dari level yang dipilih; pelajaran berikutnya terbuka setelah pelajaran aktif selesai.
- Target harian dan streak terpisah dari progres kursus, sehingga progres jalur tetap tersimpan lintas hari.
- Latihan berbicara dengan Nala, transkrip simulasi, penilaian kecocokan kata, dan aturan tata bahasa.
- Penyimpanan hasil pelajaran, streak, dan kosakata per akun.
- Fallback katalog lokal ketika daftar pelajaran server tidak dapat dimuat.
- Dashboard admin di dalam aplikasi/website untuk mengelola pelajaran dan akun.
- Navigasi bawah untuk Beranda, Latihan, dan Profil.

Nala dan penilaian bahasa masih berbasis aturan lokal; aplikasi belum menggunakan AI untuk menilai audio atau pelafalan. Pengenalan suara memerlukan development build/APK yang mendukung modul native.

## Menjalankan aplikasi

Persyaratan: Node.js LTS, npm, dan proyek Supabase. Konfigurasi database dan akun dijelaskan di [docs/SETUP_SUPABASE.md](docs/SETUP_SUPABASE.md).

1. Isi `SUPABASE_URL` dan **publishable/anon key** di `config.js`. Jangan gunakan `sb_secret` atau `service_role` key pada aplikasi atau panel admin.
2. Pasang dependensi dan jalankan Expo:

   ```bash
   npm ci
   npx expo start
   ```

Jika Supabase belum dikonfigurasi, aplikasi menampilkan layar petunjuk konfigurasi. Untuk mencoba pengenalan suara, gunakan development build atau APK; Expo Go dapat dipakai untuk menjelajahi UI dan Mode Simulasi.

Untuk menjalankan website dari proyek yang sama, gunakan `npx expo start --web`. Pelajar dan admin membuka alamat yang sama; dashboard admin muncul otomatis setelah login dengan akun ber-role `admin`.

## Peran dan pengelolaan

- **Pelajar** mendaftar dan masuk melalui aplikasi, mengatur preferensi, mengerjakan pelajaran, serta melihat progres dan kosakata miliknya.
- **Admin** masuk lewat formulir yang sama. Sesudah login, aplikasi otomatis membuka dashboard admin untuk mengelola pelajaran dan akun.
- Akun admin khusus tidak ditentukan hanya dari alamat email. Buat akun dengan email yang kamu pilih, lalu tetapkan role `admin` satu kali di Supabase. Sesudah itu dashboard admin muncul otomatis setiap kali akun tersebut masuk.
- Perubahan role dan akses data dilindungi oleh RLS serta fungsi database; UI bukan satu-satunya lapisan keamanan.
- Supabase `anon`/publishable key memang digunakan di klien dan harus dibatasi oleh kebijakan RLS. Jangan pernah membagikan secret/service-role key.

Ikuti [docs/SETUP_SUPABASE.md](docs/SETUP_SUPABASE.md) untuk membuat tabel, seed data awal, dan menetapkan akun admin pertama. Jika database sudah pernah diisi, jalankan ulang `supabase/seed.sql` untuk menambahkan frasa baru; seed memakai `ON CONFLICT` sehingga aman dijalankan ulang.

## Struktur proyek

| Lokasi | Tanggung jawab |
|---|---|
| `src/app/` | Route Expo Router dan navigasi |
| `src/screens/` | Komponen layar sambutan, autentikasi, admin, onboarding, latihan, ringkasan, profil, dan status |
| `src/providers/TuturinProvider.js` | State sesi dan koordinasi data untuk layar |
| `src/services/` | Class service/repository untuk autentikasi, profil, pelajaran, progres, dan kosakata |
| `src/domain/lessons.js`, `src/domain/learningPath.js` | Katalog pelajaran dan aturan jalur bertahap serta pembukaan pelajaran |
| `src/data.js`, `src/domain/` | Data bawaan dan aturan latihan/penilaian |
| `src/services/` | Repository data, penyimpanan lokal, autentikasi, dan adapter speech recognition |
| `src/components/ui.js`, `src/theme.js` | Komponen UI bersama, warna, dan tipografi |
| `docs/` | Catatan versi dan riwayat pengembangan |
| `supabase/schema.sql` | Skema, fungsi database, trigger, dan kebijakan RLS |
| `supabase/seed.sql` | Data awal 12 pelajaran dengan 72 frasa latihan |
| `config.js`, `supabase.js` | Konfigurasi dan client Supabase |

Struktur `services` memakai class repository/service agar akses data dan autentikasi terpisah dari UI. React screens tetap berupa komponen fungsional, sesuai pola React.

## Build APK Android

`eas.json` menyediakan profil `preview` untuk APK. Pastikan konfigurasi Supabase sudah benar dan akun Expo memiliki akses ke proyek:

```bash
npx eas-cli@latest build --platform android --profile preview
```

Konfigurasi klien akan tertanam dalam APK. Jika kredensial berubah, build ulang APK. Untuk rilis publik, siapkan kebijakan privasi dan pengungkapan data yang sesuai.

## Pengujian

Jalankan pemeriksaan kode:

```bash
npm run lint
npx expo install --check
```

`supabase/tests/rls_test.sql` adalah pengujian kebijakan database yang perlu dijalankan pada database Postgres lokal dengan shim pengujian. **Jangan jalankan file di `supabase/tests` pada proyek Supabase asli** karena setup test dapat mengosongkan data.

Keberhasilan lint/config bukan bukti bahwa login, sinkronisasi, mikrofon, maupun APK sudah diuji pada perangkat. Uji alur autentikasi, akun admin/pelajar, RLS, latihan, dan build pada emulator/perangkat setelah proyek Supabase siap.

## Catatan keamanan

- File klien hanya boleh berisi publishable/anon key; secret/service-role key memberi hak istimewa dan tidak boleh masuk ke source, APK, atau panel web.
- Role pengguna tidak boleh dinaikkan sendiri dari aplikasi; penetapan admin awal dilakukan melalui dashboard SQL.
- Kebijakan RLS pada `supabase/schema.sql` wajib diterapkan sebelum aplikasi digunakan dengan data nyata.
- Jika key `sb_secret` pernah tersimpan atau dibagikan melalui source/repository, rotasi/revoke key tersebut di dashboard Supabase dan gunakan publishable/anon key baru untuk klien.
