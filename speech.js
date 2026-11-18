// Lapisan speech-to-text.
//
// TAHAP 1 (versi sekarang): suara sungguhan belum aktif. startListening langsung
// melaporkan error 'unavailable' dan layar latihan menampilkan pesan yang sesuai.
//
// TAHAP 2: ganti isi file ini dengan implementasi expo-speech-recognition
// (butuh development build, bukan Expo Go). Antarmukanya sengaja dibuat tetap
// supaya layar latihan tidak perlu diubah:
//
//   startListening({ onStatus, onResult, onError }) -> fungsi stop()
//
//   onStatus('Mendengarkan' | 'Memproses')
//   onResult(transkrip: string)
//   onError({ code })  code: 'unavailable' | 'not-allowed' | 'no-speech' | 'unknown'

export function isSpeechAvailable() {
  return false;
}

export function startListening({ onError }) {
  onError({ code: 'unavailable' });
  return () => {};
}
