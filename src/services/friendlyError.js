export function friendlyError(err) {
  const message = String((err && (err.message || err.error_description)) || err || '');
  if (/invalid login credentials/i.test(message)) return 'Email atau password salah.';
  if (/already registered|already been registered/i.test(message)) return 'Email ini sudah terdaftar. Silakan masuk.';
  if (/email not confirmed/i.test(message)) return 'Email belum dikonfirmasi. Buka tautan konfirmasi di emailmu.';
  if (/password.*(at least|should be)/i.test(message)) return 'Password terlalu pendek.';
  if (/rate limit|too many/i.test(message)) return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.';
  if (/network|failed to fetch|fetch failed|timeout/i.test(message)) return 'Tidak ada koneksi internet. Periksa jaringanmu.';
  if (/unable to validate email|invalid.*email/i.test(message)) return 'Format email tidak valid.';
  return 'Terjadi kesalahan. Coba lagi.';
}

