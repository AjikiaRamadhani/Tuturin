# Tuturin v2: pelajaran terpandu dengan Nala

## Cara memasang
1. Timpa semua file `.js` di folder ini ke folder proyekmu (di samping `index.js`). Termasuk `logic.js`, `data.js`,
   `speech.js`, dan `storage.js`, karena semuanya berubah. File lama `PracticeScreen.js` dan `FeedbackScreen.js`
   sudah tidak dipakai, hapus saja.
2. Timpa `app.json` dan tambahkan `eas.json`. (Perubahan app.json: nama paket Android dan plugin mikrofon.)
3. Pasang paket:
   ```
   npx expo install expo-font @expo-google-fonts/plus-jakarta-sans @expo/vector-icons expo-speech-recognition
   ```
4. Jalankan: `npx expo start -c`

## Dua cara menjalankan
| Cara | Suara | Mode Simulasi | Dipakai untuk |
|---|---|---|---|
| Expo Go (scan QR) | tidak ada (modul native tidak ikut Expo Go) | ada | melihat tampilan dan alur, uji Maestro |
| APK (EAS Build) | ada | ada | uji suara sungguhan, penyerahan tugas |

Di Expo Go, tombol mikrofon menampilkan pesan "Input suara tidak tersedia" dan aplikasi tidak crash.

## Membuat APK
```
npm install -g eas-cli
eas login
eas build:configure      (jika diminta; eas.json sudah disediakan)
eas build -p android --profile preview
```
Hasilnya tautan unduh APK. Build cloud gratis dibatasi dan antreannya bisa lama.
Pengenalan suara di Android memakai layanan Google di HP, jadi butuh Google app dan biasanya internet.

## Alur aplikasi
Onboarding (level, tujuan, target = jumlah pelajaran) -> Rencana belajar (hanya setelah onboarding pertama) -> Beranda
-> pilih pelajaran -> Ringkasan awal -> Pelajaran 4 langkah bersama Nala -> Tujuan tercapai + ringkasan.
Dari Beranda juga ada Kosakata Tersimpan dan Ubah Target.

## Aturan yang perlu diketahui saat menguji
- Skor = kecocokan kata (bukan analisis audio). Balasan Nala berdasarkan skor: 90 ke atas = pujian, hanya Lanjut;
  60 sampai 89 = Coba lagi atau Lanjut; di bawah 60 = diminta mengulang, Lanjut baru muncul setelah 3 percobaan.
- Penguasaan di ringkasan = rata-rata skor terbaik tiap langkah.
- Satu pelajaran dihitung selesai sekali per hari. Keluar di tengah pelajaran tidak dihitung.
- Streak = hari berturut-turut ada pelajaran selesai. Berdasarkan tanggal perangkat.
- Tata bahasa: sekitar 13 aturan dengan daftar ~70 kata kerja. Kesalahan di luar daftar tidak terdeteksi (keterbatasan, TC-11).
- Data lama (target 3/5/10 dan progres per kalimat) otomatis diabaikan atau diganti jadi 2 pelajaran per hari.

## Daftar testID untuk Maestro
Onboarding: `onboarding-title`, `level-pemula|menengah|mahir`, `goal-percakapan|karier|perjalanan|ujian`, `target-1|2|3`,
`onboarding-start`, `onboarding-cancel`
Rencana: `plan-title`, `plan-level`, `plan-goal`, `plan-target`, `plan-recommended`, `plan-continue`
Beranda: `home-greeting`, `streak-text`, `daily-message`, `start-button`, `progress-text`, `progress-percent`, `progress-bar`,
`lesson-<id>`, `lesson-<id>-title`, `lesson-<id>-recommended`, `lesson-<id>-status`, `summary-level`, `summary-goal`,
`summary-target`, `change-target-button`, `vocab-button`
  (id pelajaran: `pemula|menengah|mahir` + `-` + `percakapan|karier|perjalanan|ujian`, mis. `lesson-pemula-karier`)
Ringkasan awal: `intro-title`, `intro-duration`, `intro-objective-0..2`, `intro-start`, `back-button`
Pelajaran: `practice-progress`, `practice-bar`, `target-sentence`, `target-translation`, `hint-button`, `hint-text`,
`save-vocab-button`, `save-vocab-label`, `nala-latest`, `nala-message-<n>`, `user-message-<n>`, `mic-button`, `speech-status`,
`practice-message`, `sim-input`, `sim-fill-target`, `sim-submit`
Umpan balik: `score-text`, `score-label`, `stat-correct`, `stat-wrong`, `stat-extra`, `word-<i>-ok|bad`, `bad-words-text`,
`extra-words-text`, `grammar-none`, `grammar-issue-<i>`, `retry-button`, `next-button`
Ringkasan akhir: `objective-complete`, `summary-lesson-title`, `summary-new-phrases`, `summary-mastery`, `summary-time`,
`summary-streak`, `phrase-<i>-en`, `save-phrase-<i>`, `transcript-toggle`, `transcript-list`, `transcript-line-<n>`, `summary-home`
Kosakata: `vocab-title`, `vocab-empty`, `vocab-item-<i>-en`, `vocab-item-<i>-id`, `vocab-delete-<i>`

Catatan Maestro: mulai skrip dengan `clearState` supaya onboarding muncul. Karena nilai `nala-latest` bisa berbeda
tiap langkah (variasi per nomor langkah, bukan acak), cukup periksa potongan teks yang tetap seperti "Hebat!" atau "kita lanjut".

## Status pengujian
- Lolos di lingkungan penulisan: 42 uji logika lama, 12 uji logika baru, 32 uji alur lengkap di browser (onboarding sampai
  ringkasan, penyimpanan, streak, kosakata, suara dengan modul tiruan), dan 1 uji tanpa modul suara (seperti Expo Go).
- BELUM dicoba di HP: tampilan asli React Native, font, ikon, dan suara sungguhan. Uji browser memakai tiruan komponen RN.
  Pengenalan suara hanya diuji dengan modul tiruan, jadi cek pertama di HP kemungkinan perlu perbaikan kecil.
