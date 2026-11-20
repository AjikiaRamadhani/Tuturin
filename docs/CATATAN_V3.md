# Tuturin v3: login, database, peran, halaman admin

Lanjutan v2. Pelajaran, Nala, suara, kosakata, dan streak tetap sama. Yang baru:

| Hal | Sebelumnya (v2) | Sekarang (v3) |
|---|---|---|
| Pengguna | tidak ada, data di satu HP | akun email + password (Supabase Auth) |
| Data progres, streak, kosakata, preferensi | AsyncStorage di HP | database Supabase, ikut akun |
| Pelajaran | 12 pelajaran tertanam di kode | tabel `lessons` + `lesson_steps`, dibaca dari server |
| Menambah pelajaran | ubah kode + APK baru | admin lewat halaman web, langsung terlihat |
| Peran | tidak ada | pelajar dan admin, dijaga aturan akses database |
| Kelola pengguna | tidak ada | admin: ubah peran, nonaktifkan akun |
| Akun | tidak ada | menu Akun: keluar, hapus akun |

Mulai dari `docs/SETUP_SUPABASE.md`.

## Perilaku yang perlu diketahui saat menguji
- Pertama kali dibuka: layar Masuk/Daftar. Setelah masuk, akun baru melewati onboarding. Akun lama langsung ke Beranda.
- Pelajaran dibaca dari server. Jika server gagal: memakai salinan terakhir di HP, jika tidak ada, 12 pelajaran bawaan.
- Menyimpan progres gagal (offline): pelajaran tetap selesai di layar dan muncul peringatan kuning di Beranda. Progres itu belum masuk server.
- Pelajaran dalam satu level ditampilkan semua yang terbit; tidak lagi dibatasi 4. Yang sesuai tujuan diberi label Rekomendasi dan di atas.
- Jumlah langkah pelajaran bebas (minimal 1), sesuai yang dibuat admin.
- Admin tidak mengelola lewat aplikasi; aplikasi hanya menampilkan peran dan catatan menuju panel web.

## testID baru untuk Maestro
Sambutan: `welcome-login`, `welcome-register`
Navigasi bawah: `tab-home`, `tab-training`, `tab-profile`
Masuk/Daftar: `auth-title`, `auth-name`, `auth-email`, `auth-password`, `auth-submit`, `auth-switch`, `auth-forgot`, `auth-error`, `auth-info`
Callback email dan password: `set-password-title`, `new-password`, `confirm-password`, `set-password-submit`, `set-password-error`
Status: `status-title`, `status-body`, `status-retry`, `status-signout`
Beranda: `account-button`, `sync-warning`, `lessons-empty`
Akun/profil: `account-title`, `account-name`, `account-email`, `account-role`, `account-admin-note`, `profile-level`, `profile-goal`, `profile-target`, `logout-button`,
`delete-account-button`, `delete-confirm-text`, `delete-confirm`, `delete-cancel`, `account-error`
(testID lain sama seperti CATATAN_V2.md.)

Untuk Maestro: siapkan akun uji khusus (mis. `uji1@tuturin.test`) dan matikan Confirm email. Skrip bisa memulai dengan `clearState`
lalu masuk dengan akun itu. Karena progres kini ada di server, hapus baris `lesson_results` dan `streaks` akun uji antar putaran,
atau pakai akun baru tiap putaran.

## Status pengujian
- Aturan akses database: 48 uji lolos di Postgres 16 sungguhan (dengan tiruan skema auth Supabase).
- Aplikasi: 24 uji alur (daftar, masuk, validasi, simpan ke server, akun nonaktif, hapus akun, offline, cache) dan 1 uji konfigurasi kosong,
  di browser dengan komponen RN tiruan dan klien Supabase tiruan di memori.
- Panel admin HTML lama: 21 uji (login, bukan admin, CRUD pelajaran, validasi, urutan langkah, pengguna, admin terakhir, reset password). Panel itu sudah dihapus; dashboard `/admin` yang sekarang belum diuji terhadap Supabase asli.
- Logika: 42 uji lama dan 14 uji baru.
- Batasan: statistik di tab Pengguna (jumlah selesai, hari terakhir) dihitung dari hasil yang dikirim server, yang secara bawaan dibatasi 1000 baris. Untuk pengguna banyak perlu dibuat ringkasan di server.
- BELUM diuji: koneksi ke proyek Supabase asli (belum ada dari lingkungan ini), tampilan asli React Native di HP,
  pengiriman email konfirmasi/reset, suara sungguhan, dan build APK. Kemungkinan ada perbaikan kecil setelah percobaan pertama.
