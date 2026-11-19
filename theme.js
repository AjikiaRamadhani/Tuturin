// Tema Tuturin: warna, font, dan gaya teks.
// Font: Plus Jakarta Sans (dimuat di App.js). Jika font gagal dimuat, React Native
// otomatis memakai font bawaan Android dan aplikasi tetap tampil.

export const colors = {
  // Dasar
  bg: '#FAF8FF',
  card: '#FFFFFF',
  surface: '#F2F3FF',
  surfaceHigh: '#EAEDFD',
  border: '#E5E7F7',
  outline: '#DEBFC0',
  text: '#171B26',
  muted: '#574142',
  ink: '#1B1F2A',

  // Merah muda (aksi utama)
  primary: '#A93445',
  primaryLedge: '#7F2433',
  coral: '#F26B7A',
  coralDeep: '#CC4558',
  coralSoft: '#FDECEF',

  // Hijau teal (struktur, jawaban benar)
  teal: '#166A5B',
  tealSoft: '#E3F2EF',
  mint: '#A2EEDB',
  onMint: '#00201A',

  // Kuning (tips, kata tambahan)
  yellow: '#F5B335',
  yellowSoft: '#FEF7E6',
  onYellow: '#5F4100',

  // Umpan balik salah
  bad: '#93000A',
  badBg: '#FFDAD6',

  // Alias lama supaya kode lain tetap kompatibel
  good: '#166A5B',
  goodBg: '#A2EEDB',
  warn: '#5F4100',
  warnBg: '#FEF7E6',
};

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
};

export const type = {
  display: { fontFamily: fonts.extrabold, fontSize: 40, lineHeight: 48, letterSpacing: -0.8 },
  h1: { fontFamily: fonts.extrabold, fontSize: 26, lineHeight: 34 },
  h2: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 28 },
  h3: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 },
  bodyBold: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: fonts.bold, fontSize: 14, lineHeight: 18 },
  caption: { fontFamily: fonts.semibold, fontSize: 12, lineHeight: 16, letterSpacing: 0.3 },
};
