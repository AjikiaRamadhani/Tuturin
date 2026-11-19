# Pembaruan tampilan Tuturin (berdasarkan desain Stitch)

## Cara memasang
1. Timpa 8 file ini ke folder proyek (di samping `index.js`): `App.js`, `theme.js`, `ui.js`, `data.js`,
   `OnboardingScreen.js`, `HomeScreen.js`, `PracticeScreen.js`, `FeedbackScreen.js`.
   `logic.js`, `speech.js`, `storage.js` sengaja TIDAK disertakan, jadi perubahanmu di sana aman.
2. Pasang paket baru:
   ```
   npx expo install expo-font @expo-google-fonts/plus-jakarta-sans @expo/vector-icons
   ```
3. Jalankan ulang dengan cache bersih: `npx expo start -c`

## Yang diambil dari desain
Palet pink/teal/kuning, kartu dan tombol membulat, tombol utama bergaya "timbul", font Plus Jakarta Sans,
ikon di kepala kartu, kartu hero "Misi Harian", kartu progres dengan bilah, lingkaran skor, dan lencana status.

## Yang sengaja TIDAK diambil (tidak ada di aplikasi, atau menyesatkan)
Streak, avatar profil, navigasi bawah, tombol "Dengarkan" (suara), chip IPA, "Dengar Rekaman",
"Hasil A.I.", metrik Kelancaran/Intonasi/Kecepatan, penjelasan fonetik, dan klaim "80% dalam 2 minggu".
Layar hasil kini memakai data nyata: skor kecocokan kata, kata benar/salah/tambahan, dan saran tata bahasa.

## Yang ditambahkan
Terjemahan Indonesia untuk tiap 48 kalimat latihan (`TRANSLATIONS` di `data.js`).

## Perubahan teks pada testID (untuk skrip Maestro)
| testID | Dulu | Sekarang |
|---|---|---|
| `summary-level` | Level: Pemula | Pemula |
| `summary-goal` | Tujuan: Percakapan harian | Percakapan harian |
| `summary-target` | Target harian: 5 kalimat | 5 kalimat |
| `progress-text` | Latihan hari ini: 2 / 5 | 2 / 5 |
| `score-text` | Skor pelafalan: 86% | 86% |
| `back-button` | tombol bawah "Kembali ke Beranda" | tombol kiri atas "Kembali" |

testID baru: `target-translation`, `progress-percent`, `progress-bar`, `practice-bar`, `stat-correct`, `stat-wrong`, `stat-extra`.
Semua testID lain tidak berubah.

## Status pengujian
- Lolos: 42 uji logika, kompilasi semua file, dan 13 uji render (tiap layar, kondisi target tercapai, tanpa metrik palsu).
- BELUM dicoba di Expo Go/HP: tampilan sebenarnya, font, dan ikon. Paket font/ikon tidak bisa dipasang di lingkungan
  tempat kode ini ditulis, jadi diuji dengan tiruan. Nama ikon dicocokkan dengan daftar dari ingatan, bukan dengan paketnya.
- `@expo/vector-icons` ditandai akan di-deprecate di dokumentasi Expo, tetapi masih berfungsi. Semua ikon dipanggil lewat
  komponen `Icon` di `ui.js`, jadi penggantian cukup di satu tempat.
- Font dimuat dengan pengaman: kalau gagal, aplikasi tetap tampil dengan font bawaan Android.
