# Tuturin

Tuturin adalah aplikasi latihan berbicara bahasa Inggris untuk tugas Mobile Testing, Kelompok 2 NullPointer. Aplikasi ini meniru sebagian alur Pingo AI: pengguna memilih preferensi belajar, menyelesaikan pelajaran berbicara, lalu menerima umpan balik yang konsisten.

Proyek menggunakan Expo SDK 58 dan React Native. Preferensi, progres harian, streak, dan kosakata tersimpan di perangkat; tidak ada akun, backend, atau API AI.

## Fitur saat ini

- Onboarding untuk memilih level, tujuan, dan target harian 1, 2, atau 3 pelajaran.
- Rencana belajar setelah onboarding pertama.
- Beranda berisi progres harian, streak, daftar pelajaran, preferensi, dan kosakata tersimpan.
- 12 pelajaran (3 level x 4 tujuan), masing-masing terdiri dari 4 kalimat dengan terjemahan Indonesia.
- Tutor Nala dengan respons skrip berdasarkan skor, bukan model AI.
- Input transkrip melalui mikrofon pada build native yang mendukung `expo-speech-recognition`, serta Mode Simulasi untuk mengetik transkrip.
- Umpan balik skor kecocokan kata dan saran tata bahasa berbasis aturan.
- Penyimpanan frasa/kosakata dari pelajaran dan ringkasan.

## Menjalankan proyek

Persyaratan: Node.js versi LTS dan npm. Repository ini sudah merupakan proyek Expo lengkap; tidak perlu membuat proyek baru atau menyalin file secara manual.

```bash
npm ci
npx expo start
```

Scan QR code dengan Expo Go untuk melihat tampilan dan alur simulasi. **Expo Go tidak menyertakan modul native speech recognition**, jadi gunakan Mode Simulasi untuk mengirim transkrip. Perubahan yang melibatkan modul native perlu dijalankan dalam development build atau APK.

## Membuat APK Android

`eas.json` sudah menyediakan profil `preview` dengan keluaran APK. Pastikan sudah masuk ke akun Expo yang memiliki akses ke proyek ini, lalu jalankan:

```bash
npx eas-cli@latest build --platform android --profile preview
```

EAS Build berjalan di cloud dan dapat memerlukan waktu antre. Setelah build selesai, unduh APK dari tautan hasil build dan pasang di perangkat Android. Ketersediaan pengenalan suara bergantung pada layanan speech recognition di perangkat dan izin mikrofon; coba Mode Simulasi jika layanan tidak tersedia.

## Alur aplikasi

1. Pilih level, tujuan, dan target harian pada onboarding.
2. Setelah onboarding pertama, tinjau Rencana Belajar lalu lanjut ke Beranda.
3. Pilih pelajaran yang direkomendasikan atau pelajaran lain di level yang dipilih.
4. Tinjau tujuan pelajaran, lalu mulai empat langkah latihan bersama Nala.
5. Ucapkan kalimat target atau isi transkrip melalui Mode Simulasi.
6. Tinjau skor dan umpan balik. Pada skor tinggi, pengguna dapat lanjut; pada skor menengah pengguna dapat mencoba lagi atau lanjut; pada skor rendah, tombol lanjut tersedia setelah tiga percobaan. Pengguna tetap dapat mencoba lagi.
7. Setelah menyelesaikan seluruh langkah, lihat ringkasan dan kembali ke Beranda.

## Aturan progres dan umpan balik

- Target harian adalah jumlah pelajaran yang selesai, bukan jumlah kalimat. Setiap pelajaran berisi empat langkah.
- Pelajaran baru dihitung setelah seluruh langkah diselesaikan, dan maksimal sekali per hari untuk setiap pelajaran. Keluar sebelum selesai tidak menambah progres.
- Setelah target tercapai, tombol Beranda berubah menjadi **Belajar Lagi**. Pengguna masih dapat menyelesaikan pelajaran tambahan; progres selesai dapat melebihi target, sementara persentase progres dibatasi sampai 100%.
- Streak bertambah maksimal sekali per hari saat pelajaran pertama hari itu selesai. Streak aktif ditampilkan untuk hari ini atau kemarin; tanggal mengikuti waktu lokal perangkat.
- Penguasaan pelajaran pada ringkasan adalah rata-rata skor terbaik dari empat langkah.
- Skor adalah kecocokan urutan kata antara target dan transkrip. Ini bukan analisis audio atau penilaian fonetik.
- Pemeriksa tata bahasa memakai aturan dan daftar kata kerja terbatas. Kesalahan yang tidak tercakup daftar tidak akan terdeteksi; hasilnya bukan pemeriksaan tata bahasa lengkap.
- Nala memakai respons deterministik berdasarkan skor dan nomor langkah. Variasi teks respons tidak dipilih secara acak.
- Progres harian versi lama (yang memakai daftar kalimat) direset karena formatnya berbeda. Preferensi level dan tujuan yang valid tetap dipakai; target lama bernilai 3 kebetulan tetap cocok, sedangkan target lama 5 atau 10 dinormalisasi ke 2 pelajaran.

## `testID` untuk Maestro

`<id>` pelajaran berbentuk `{level}-{tujuan}`, misalnya `pemula-karier`. `<i>` dan `<n>` adalah indeks angka mulai dari 0 atau nomor urut sesuai elemen yang dirender.

| Layar | `testID` utama |
|---|---|
| Onboarding | `onboarding-title`, `level-pemula` / `level-menengah` / `level-mahir`, `goal-percakapan` / `goal-karier` / `goal-perjalanan` / `goal-ujian`, `target-1` / `target-2` / `target-3`, `onboarding-start`, `onboarding-cancel` saat mengubah preferensi |
| Rencana | `plan-title`, `plan-level`, `plan-goal`, `plan-target`, `plan-recommended`, `plan-continue` |
| Beranda | `home-greeting`, `streak-text`, `daily-message`, `start-button`, `progress-text`, `progress-percent`, `progress-bar`, `lesson-<id>`, `lesson-<id>-title`, `lesson-<id>-recommended`, `lesson-<id>-status`, `summary-level`, `summary-goal`, `summary-target`, `change-target-button`, `vocab-button` |
| Intro pelajaran | `intro-title`, `intro-duration`, `intro-objective-<i>`, `intro-start`, `back-button` |
| Pelajaran | `practice-progress`, `practice-bar`, `target-sentence`, `target-translation`, `hint-button`, `hint-text` saat dibuka, `save-vocab-button`, `save-vocab-label`, `nala-latest`, `nala-message-<n>`, `user-message-<n>`, `mic-button`, `speech-status`, `practice-message` saat ada pesan, `sim-input`, `sim-fill-target`, `sim-submit` |
| Umpan balik dalam pelajaran | `score-text`, `score-label`, `stat-correct`, `stat-wrong`, `stat-extra`, `word-<i>-ok` / `word-<i>-bad`, `bad-words-text`, `extra-words-text` jika ada, `grammar-none` atau `grammar-issue-<i>`, `retry-button` dan `next-button` sesuai skor/percobaan |
| Ringkasan akhir | `objective-complete`, `summary-lesson-title`, `summary-new-phrases`, `summary-mastery`, `summary-time`, `summary-streak`, `phrase-<i>-en`, `save-phrase-<i>`, `transcript-toggle`, `transcript-list` saat dibuka, `transcript-line-<n>`, `summary-home` |
| Kosakata | `vocab-title`, `vocab-empty` saat belum ada item, `vocab-item-<i>-en`, `vocab-item-<i>-id`, `vocab-delete-<i>` |

Karena preferensi dan progres tersimpan lokal, siapkan kondisi aplikasi yang bersih sebelum mengulang skrip onboarding dari awal. Verifikasi selector `testID` pada versi Maestro dan perangkat yang digunakan.

## Status pengujian

`CATATAN_V2.md` mencatat hasil berikut dari lingkungan pengembangan: 42 uji logika versi awal, 12 uji logika tambahan, 32 uji alur di browser dengan komponen React Native tiruan, dan 1 uji tanpa modul suara. Skrip uji tersebut tidak disertakan di repository, jadi hasilnya belum dapat direproduksi langsung dari checkout ini.

> **Belum diverifikasi di perangkat:** tampilan React Native asli, font dan ikon pada HP, build APK hasil EAS, izin mikrofon, serta speech-to-text sungguhan. Pengujian browser memakai tiruan komponen dan uji suara memakai modul tiruan, bukan rekaman dari perangkat.

## Struktur file utama

| File | Fungsi |
|---|---|
| `App.js` | Inisialisasi data, navigasi layar berbasis state, dan penyimpanan lokal |
| `OnboardingScreen.js`, `PlanScreen.js` | Pengaturan awal dan rencana belajar |
| `HomeScreen.js` | Progres, streak, daftar pelajaran, dan pengaturan |
| `LessonIntroScreen.js`, `LessonScreen.js` | Intro, langkah latihan, transkrip, dan umpan balik |
| `SummaryScreen.js`, `VocabScreen.js` | Ringkasan pelajaran dan kosakata tersimpan |
| `data.js` | Pilihan onboarding, 48 kalimat, terjemahan, dan metadata pelajaran |
| `logic.js` | Penilaian, aturan tata bahasa, respons Nala, progres, streak, dan kosakata |
| `speech.js` | Adapter speech recognition dan penanganan status/error |
| `storage.js`, `theme.js`, `ui.js` | Penyimpanan, tema, dan komponen UI bersama |
| `app.json`, `eas.json` | Konfigurasi Expo, izin native, dan profil APK EAS |
