import React from 'react';
import { View } from 'react-native';
import { Screen, Title, Card, Button, Brand, T } from '../components/ui.js';
import { colors } from '../theme.js';

// Layar tunggal untuk keadaan khusus: konfigurasi belum diisi, akun nonaktif, gagal memuat.
export default function StatusScreen({ kind, onSignOut, onRetry }) {
  const content = {
    config: {
      title: 'Supabase belum dikonfigurasi',
      body: 'Isi SUPABASE_URL dan SUPABASE_ANON_KEY di file config.js sesuai proyek Supabase-mu, lalu jalankan ulang aplikasi. Langkahnya ada di docs/SETUP_SUPABASE.md.',
    },
    deactivated: {
      title: 'Akun dinonaktifkan',
      body: 'Akunmu dinonaktifkan oleh admin. Hubungi admin Tuturin jika ini keliru.',
    },
    error: {
      title: 'Gagal memuat data',
      body: 'Data akunmu tidak bisa dimuat. Periksa koneksi internet lalu coba lagi.',
    },
  }[kind];

  return (
    <Screen>
      <Brand />
      <Title testID="status-title" style={{ marginTop: 24, marginBottom: 12 }}>
        {content.title}
      </Title>
      <Card tone="surface">
        <T testID="status-body" color={colors.muted}>
          {content.body}
        </T>
      </Card>
      {kind === 'error' ? <Button testID="status-retry" label="Coba Lagi" icon="refresh" onPress={onRetry} /> : null}
      {kind !== 'config' ? (
        <View style={{ marginTop: 12 }}>
          <Button testID="status-signout" label="Keluar" icon="log-out-outline" variant="secondary" onPress={onSignOut} />
        </View>
      ) : null}
    </Screen>
  );
}
