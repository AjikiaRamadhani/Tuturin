// Lapisan speech-to-text memakai expo-speech-recognition.
//
// Modul ini native, jadi TIDAK ada di Expo Go. Di Expo Go, isSpeechAvailable() bernilai
// false dan layar pelajaran menampilkan pesan sambil tetap menyediakan Mode Simulasi.
// Di APK / development build, suara bekerja.
//
//   startListening({ onStatus, onResult, onError }) -> fungsi stop()
//   onStatus('Mendengarkan' | 'Memproses')
//   onResult(transkrip: string)
//   onError({ code })  code: 'unavailable' | 'not-allowed' | 'no-speech' | 'network' | 'unknown'

let Module = null;
try {
  // eslint-disable-next-line global-require
  Module = require('expo-speech-recognition').ExpoSpeechRecognitionModule || null;
} catch (e) {
  Module = null;
}

export function isSpeechAvailable() {
  try {
    return !!Module && Module.isRecognitionAvailable() === true;
  } catch (e) {
    return false;
  }
}

function mapError(err) {
  switch (err) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'not-allowed';
    case 'no-speech':
    case 'speech-timeout':
      return 'no-speech';
    case 'network':
      return 'network';
    case 'aborted':
      return 'aborted';
    default:
      return 'unknown';
  }
}

export function startListening({ onStatus, onResult, onError }) {
  if (!Module) {
    onError({ code: 'unavailable' });
    return () => {};
  }

  const subs = [];
  let finished = false;
  let heard = '';

  const cleanup = () => {
    subs.forEach((s) => {
      try { s.remove(); } catch (e) { /* abaikan */ }
    });
    subs.length = 0;
  };
  const finish = (fn) => {
    if (finished) return;
    finished = true;
    cleanup();
    fn();
  };

  (async () => {
    try {
      const perm = await Module.requestPermissionsAsync();
      if (!perm.granted) {
        finish(() => onError({ code: 'not-allowed' }));
        return;
      }
      subs.push(
        Module.addListener('start', () => onStatus && onStatus('Mendengarkan')),
        Module.addListener('result', (e) => {
          const text = e && e.results && e.results[0] ? e.results[0].transcript : '';
          if (text) heard = text;
          if (e && e.isFinal) {
            onStatus && onStatus('Memproses');
            finish(() => (heard ? onResult(heard) : onError({ code: 'no-speech' })));
          }
        }),
        Module.addListener('error', (e) => {
          const code = mapError(e && e.error);
          finish(() => onError({ code }));
        }),
        Module.addListener('end', () => {
          // 'end' selalu datang terakhir. Kalau belum ada hasil akhir, pakai yang terdengar.
          finish(() => (heard ? onResult(heard) : onError({ code: 'no-speech' })));
        })
      );
      Module.start({ lang: 'en-US', interimResults: true, continuous: false });
    } catch (e) {
      finish(() => onError({ code: 'unknown' }));
    }
  })();

  return () => {
    try {
      if (Module) Module.stop();
    } catch (e) { /* abaikan */ }
  };
}
