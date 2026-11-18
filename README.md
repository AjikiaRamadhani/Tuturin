# Tuturin: kode MVP tahap 1

Aplikasi latihan berbicara bahasa Inggris (tiruan sederhana Pingo AI) untuk tugas Mobile Testing, Kelompok 2 NullPointer.
Dibuat dengan Expo (React Native), JavaScript biasa, tanpa backend dan tanpa API key.

**Tahap 1 (versi ini):** onboarding, beranda, latihan, umpan balik, dan Mode Simulasi. Tombol mikrofon sudah ada, tetapi suara sungguhan belum aktif.
**Tahap 2 (nanti, jika waktu cukup):** speech-to-text sungguhan lewat `expo-speech-recognition` (butuh development build, tidak jalan di Expo Go). Cukup ganti isi `speech.js`, layar lain tidak perlu diubah.

## Isi folder

| File | Fungsi |
|---|---|
| `App.js` | Pengatur alur antar layar, penyimpanan preferensi dan progres |
| `OnboardingScreen.js` | Pilih level, tujuan, dan target harian |
| `HomeScreen.js` | Ringkasan pengaturan dan progres hari ini |
| `PracticeScreen.js` | Kalimat target, tombol mikrofon, Mode Simulasi |
| `FeedbackScreen.js` | Skor pelafalan, kata salah, saran tata bahasa |
| `logic.js` | Hitung skor, aturan tata bahasa, susun daftar kalimat (tanpa React) |
| `data.js` | Pilihan onboarding dan 48 kalimat latihan |
| `speech.js` | Lapisan speech-to-text (tahap 1: belum aktif) |
| `storage.js`, `theme.js`, `ui.js` | Penyimpanan lokal, warna, komponen bersama |

## Cara menjalankan (Windows)

1. Pasang **Node.js versi LTS** dari nodejs.org, lalu cek di terminal: `node -v`.
2. Pasang **Expo Go** di HP Android (Play Store). HP dan laptop harus satu jaringan Wi-Fi.
3. Buat proyek kosong:
   ```
   npx create-expo-app@latest tuturin --template blank
   cd tuturin
   ```
4. Salin semua file `.js` dari folder ini ke folder `tuturin` (timpa `App.js` bawaan). Jika proyek yang terbentuk punya `App.tsx` atau folder `app/`, berarti template-nya bukan `blank`: ulangi langkah 3.
5. Pasang penyimpanan lokal:
   ```
   npx expo install @react-native-async-storage/async-storage
   ```
6. Jalankan:
   ```
   npx expo start
   ```
   Di Expo Go pilih **Scan QR code**, lalu scan QR di terminal.

**Tanpa HP (opsional, belum diuji):** pratinjau di browser dengan
`npx expo install react-dom react-native-web @expo/metro-runtime` lalu `npx expo start --web`.

## Catatan jujur tentang pengujian kode ini

- Logika di `logic.js` diuji otomatis dengan Node (42 uji: skor pelafalan, 13 aturan tata bahasa, tidak ada temuan palsu pada 48 kalimat target, pembuatan sesi).
- Tiap layar diperiksa sintaksnya dan dirender dengan tiruan `react-native` di Node, untuk memastikan semua teks dan `testID` yang dibutuhkan ada.
- **Belum pernah dijalankan di Expo Go, emulator, atau HP sungguhan.** Kalau muncul layar merah atau error di terminal, kirim pesan error-nya apa adanya.

## Cara kerja singkat

- **Skor pelafalan:** kata target dibandingkan dengan transkrip (huruf besar dan tanda baca diabaikan, urutan diperhitungkan). Skor = kata cocok / jumlah kata terpanjang antara target dan transkrip, jadi kata tambahan menurunkan skor.
- **Tata bahasa:** 13 aturan sederhana untuk kesalahan umum (he go, I is, a apple, discuss about, dan sebagainya). Bukan AI, jadi hasilnya selalu sama untuk masukan yang sama.
- **Mode Simulasi:** ketik transkrip manual (atau tekan "Isi dengan kalimat target"). Dipakai untuk pengujian otomatis karena Maestro tidak bisa berbicara ke mikrofon.
- **Progres:** hanya percobaan pertama tiap kalimat yang dihitung. Tombol Ulangi tidak menambah hitungan. Progres di-reset otomatis saat ganti hari.

## testID untuk skrip Maestro

| Layar | testID |
|---|---|
| Onboarding | `onboarding-title`, `level-pemula` / `level-menengah` / `level-mahir`, `goal-percakapan` / `goal-karier` / `goal-perjalanan` / `goal-ujian`, `target-3` / `target-5` / `target-10`, `onboarding-start`, `onboarding-cancel` |
| Beranda | `home-greeting`, `summary-level`, `summary-goal`, `summary-target`, `progress-text`, `avg-score-text`, `start-button`, `change-target-button` |
| Latihan | `practice-progress`, `target-sentence`, `mic-button`, `speech-status`, `practice-message`, `sim-input`, `sim-fill-target`, `sim-submit`, `back-button` |
| Umpan balik | `score-text`, `score-label`, `word-{i}-ok` / `word-{i}-bad`, `bad-words-text`, `extra-words-text`, `transcript-text`, `grammar-none`, `grammar-issue-{i}`, `retry-button`, `next-button` |

Catatan: di Android, `testID` React Native biasanya terbaca Maestro sebagai `id`. Ini perlu dikonfirmasi saat skrip pertama dijalankan; kalau gagal, selektor bisa memakai teks yang tampil.

## Build APK (tahap berikutnya)

APK dibuat lewat EAS Build (cloud) dengan profil `preview` bertipe `apk`, jadi tidak perlu Android Studio. Langkahnya dibahas terpisah setelah aplikasi berjalan di Expo Go.