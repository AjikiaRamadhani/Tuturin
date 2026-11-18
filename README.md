# Tuturin — MVP tahap 1

Tuturin adalah aplikasi latihan berbicara bahasa Inggris untuk tugas Mobile Testing, Kelompok 2 NullPointer. Aplikasi dibuat dengan Expo dan React Native menggunakan JavaScript. Versi ini tidak memakai backend atau API key.

## Fitur

- Onboarding untuk memilih level bahasa, tujuan belajar, dan target harian.
- Beranda yang menampilkan pilihan belajar, progres, dan rata-rata skor hari ini.
- Latihan dari 48 kalimat untuk tiga level dan empat tujuan.
- Mode Simulasi untuk mengetik transkrip sebagai pengganti input suara.
- Umpan balik berupa skor kecocokan kata, kata yang berbeda, dan saran tata bahasa sederhana.
- Penyimpanan preferensi dan progres lokal menggunakan AsyncStorage.

> **Input suara:** tombol mikrofon tersedia, tetapi speech-to-text belum aktif. `speech.js` saat ini melaporkan input suara tidak tersedia. Implementasi `expo-speech-recognition` direncanakan untuk tahap berikutnya dan memerlukan development build; fitur tersebut tidak tersedia di Expo Go.

## Persyaratan

- Node.js versi LTS.
- Expo Go di perangkat Android atau iOS untuk mencoba versi saat ini.
- Komputer dan perangkat berada pada jaringan yang sama jika menggunakan koneksi Wi-Fi.

## Menjalankan proyek

Repository ini sudah berisi proyek Expo lengkap; tidak perlu membuat proyek blank atau menyalin file secara manual.

```bash
npm install
npx expo start
```

> Gunakan `npm ci` sebagai pengganti `npm install` jika ingin memasang dependensi persis sesuai `package-lock.json`.

Setelah server Expo berjalan, scan QR code dengan Expo Go. Untuk menjalankan dari terminal pada perangkat atau simulator yang sudah disiapkan, tersedia juga:

```bash
npm run android
npm run ios
```

## Mencoba alur utama

1. Pilih level, tujuan, dan target harian pada onboarding, lalu tekan **Mulai**.
2. Di beranda, tekan **Mulai Latihan**.
3. Ketik transkrip di bagian **Mode Simulasi**, atau tekan **Isi dengan kalimat target**, lalu **Kirim Transkrip**.
4. Tinjau skor, kata yang perlu dilatih, dan saran tata bahasa.
5. Pilih **Ulangi** untuk mencoba kalimat yang sama atau **Lanjut** untuk meneruskan sesi.

Contoh transkrip untuk melihat saran tata bahasa:

```text
He go to school
I like to drinks tea every morning
She don't like coffee
```

Untuk input `I like to drinks tea every morning`, aturan sederhana aplikasi seharusnya menyarankan `to drink`.

## Cara kerja dan batasan

- **Skor pelafalan:** membandingkan urutan kata pada kalimat target dan transkrip. Huruf besar dan tanda baca diabaikan. Skor dihitung dari jumlah kata yang cocok dibagi jumlah kata terpanjang antara target dan transkrip; kata tambahan dapat menurunkan skor. Ini adalah skor kecocokan teks, bukan analisis audio atau penilaian fonetik.
- **Saran tata bahasa:** memakai aturan berbasis pola untuk beberapa kesalahan umum. Ini bukan AI atau pemeriksa tata bahasa lengkap; hasilnya terbatas pada aturan di `logic.js`.
- **Mode Simulasi:** menyediakan transkrip manual sehingga alur latihan dapat dicoba tanpa mikrofon.
- **Progres:** kalimat yang sudah diselesaikan hanya dihitung sekali per hari. Mengulangi kalimat tidak menambah hitungan. Progres harian direset ketika tanggal lokal perangkat berubah.
- **Mengubah pengaturan:** tombol **Ubah Target** membuka kembali pilihan level, tujuan, dan target harian. Progres hari itu tetap tersimpan setelah pengaturan diubah.

## Pengujian

> Repository saat ini tidak menyertakan test runner atau skrip pengujian otomatis di `package.json`. Klaim hasil pengujian manual atau otomatis perlu dicatat berdasarkan pengujian yang benar-benar dijalankan pada perangkat dan lingkungan masing-masing.

> Pengujian mikrofon sungguhan belum dapat dilakukan karena speech-to-text belum diaktifkan. Jika aplikasi menampilkan layar merah atau error di terminal, simpan pesan error lengkap untuk membantu penelusuran.

## `testID` untuk Maestro

| Layar | `testID` |
|---|---|
| Onboarding | `onboarding-title`, `level-pemula` / `level-menengah` / `level-mahir`, `goal-percakapan` / `goal-karier` / `goal-perjalanan` / `goal-ujian`, `target-3` / `target-5` / `target-10`, `onboarding-start`, `onboarding-cancel` (saat mengubah pengaturan) |
| Beranda | `home-greeting`, `summary-level`, `summary-goal`, `summary-target`, `progress-text`, `avg-score-text`, `start-button`, `change-target-button` |
| Latihan | `practice-progress`, `target-sentence`, `mic-button`, `speech-status`, `practice-message` (saat ada pesan), `sim-input`, `sim-fill-target`, `sim-submit`, `back-button` |
| Umpan balik | `score-text`, `score-label`, `word-{i}-ok` / `word-{i}-bad`, `bad-words-text`, `extra-words-text` (jika ada kata tambahan), `transcript-text`, `grammar-none` atau `grammar-issue-{i}`, `retry-button`, `next-button` |

> Pada Android, `testID` React Native umumnya terekspos sebagai `id` pada Maestro. Pastikan selector di skrip Maestro cocok dengan elemen yang terlihat pada perangkat yang digunakan.

## Struktur file utama

| File | Fungsi |
|---|---|
| `App.js` | Alur antar layar, sesi latihan, dan progres |
| `OnboardingScreen.js` | Pemilihan level, tujuan, dan target harian |
| `HomeScreen.js` | Ringkasan pengaturan dan progres |
| `PracticeScreen.js` | Kalimat target, tombol mikrofon, dan Mode Simulasi |
| `FeedbackScreen.js` | Skor kecocokan kata dan saran tata bahasa |
| `logic.js` | Perhitungan skor, aturan tata bahasa, dan penyusunan sesi |
| `data.js` | Pilihan onboarding dan 48 kalimat latihan |
| `speech.js` | Antarmuka speech-to-text; saat ini belum aktif |
| `storage.js` | Penyimpanan lokal dengan AsyncStorage |
| `theme.js`, `ui.js` | Warna dan komponen UI bersama |

## Build APK

> Konfigurasi EAS Build belum disertakan dalam repository ini. Untuk membuat APK melalui EAS, siapkan akun dan konfigurasi EAS, termasuk profil build bertipe APK, terlebih dahulu. Petunjuk EAS dibahas terpisah dari langkah menjalankan MVP di Expo Go.
