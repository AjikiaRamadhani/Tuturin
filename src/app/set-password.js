import React, { useState } from 'react';
import { TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Title, Card, Button, T } from '../components/ui.js';
import { colors, fonts } from '../theme.js';
import { services } from '../services/index.js';
import { useTuturin } from '../providers/TuturinProvider.js';

const inputStyle = {
  borderWidth: 1.5,
  borderColor: colors.border,
  borderRadius: 16,
  paddingVertical: 13,
  paddingHorizontal: 15,
  fontSize: 16,
  fontFamily: fonts.regular,
  color: colors.text,
  backgroundColor: colors.surface,
  marginTop: 8,
};

export default function SetPasswordRoute() {
  const { session } = useTuturin();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [focusedInput, setFocusedInput] = useState('');

  const save = async () => {
    if (password.length < 8) return setError('Password minimal 8 karakter.');
    if (password !== confirm) return setError('Konfirmasi password belum sama.');
    setBusy(true);
    setError('');
    try {
      await services.auth.updatePassword(password);
      router.replace('/');
    } catch (e) {
      setError(e.message || 'Password gagal diperbarui. Buka tautan terbaru dari emailmu.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Title testID="set-password-title" style={{ marginTop: 20 }}>Buat password</Title>
      <T color={colors.muted} style={{ marginTop: 8, marginBottom: 18 }}>
        Atur password agar kamu bisa masuk lagi kapan saja.
      </T>
      <Card>
        {session ? (
          <>
            <T v="label" color={colors.muted}>Password baru</T>
            <TextInput testID="new-password" value={password} onChangeText={setPassword} onFocus={() => setFocusedInput('new')} onBlur={() => setFocusedInput('')} selectionColor={colors.primary} cursorColor={colors.primary} placeholderTextColor={colors.muted} secureTextEntry autoCapitalize="none" placeholder="Minimal 8 karakter" style={[inputStyle, focusedInput === 'new' && { borderColor: colors.primary, backgroundColor: '#FFFFFF' }]} />
            <T v="label" color={colors.muted} style={{ marginTop: 16 }}>Ulangi password</T>
            <TextInput testID="confirm-password" value={confirm} onChangeText={setConfirm} onFocus={() => setFocusedInput('confirm')} onBlur={() => setFocusedInput('')} selectionColor={colors.primary} cursorColor={colors.primary} placeholderTextColor={colors.muted} secureTextEntry autoCapitalize="none" placeholder="Ketik ulang password" style={[inputStyle, focusedInput === 'confirm' && { borderColor: colors.primary, backgroundColor: '#FFFFFF' }]} />
            {error ? <T testID="set-password-error" color={colors.bad} style={{ marginTop: 12 }}>{error}</T> : null}
            <View style={{ marginTop: 18 }}><Button testID="set-password-submit" label={busy ? 'Menyimpan...' : 'Simpan password'} disabled={busy} onPress={save} /></View>
          </>
        ) : (
          <>
            <T color={colors.muted}>Sesi dari tautan email tidak ditemukan. Buka tautan terbaru dari email atau minta tautan reset baru.</T>
            <View style={{ marginTop: 16 }}><Button label="Ke halaman masuk" onPress={() => router.replace('/auth')} /></View>
          </>
        )}
      </Card>
    </Screen>
  );
}
