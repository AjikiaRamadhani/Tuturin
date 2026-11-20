import React, { useState } from 'react';
import { TextInput, View, Pressable } from 'react-native';
import { Screen, Title, Card, Button, Brand, Icon, T } from '../../components/ui.js';
import { colors, fonts } from '../../theme.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Validasi murni agar mudah diuji. Hasil: pesan error, atau '' kalau valid.
export function validateAuth(mode, { name, email, password }) {
  if (mode !== 'forgot' && mode !== 'login' && !name.trim()) return 'Nama wajib diisi.';
  if (!email.trim()) return 'Email wajib diisi.';
  if (!EMAIL_RE.test(email.trim())) return 'Format email tidak valid.';
  if (mode === 'forgot') return '';
  if (!password) return 'Password wajib diisi.';
  if (mode === 'register' && password.length < 8) return 'Password minimal 8 karakter.';
  return '';
}

function Field({ label, testID, value, onChangeText, secure, placeholder, keyboardType }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: 14 }}>
      <T v="label" color={colors.muted} style={{ marginBottom: 6 }}>
        {label}
      </T>
      <TextInput
        testID={testID}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#8A7172"
        selectionColor={colors.primary} cursorColor={colors.primary}
        secureTextEntry={!!secure}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType={keyboardType}
        style={{
          borderWidth: 1.5,
          borderColor: focused ? colors.primary : colors.border,
          borderRadius: 20,
          paddingVertical: 14,
          paddingHorizontal: 16,
          fontSize: 16,
          fontFamily: fonts.regular,
          color: colors.text,
          backgroundColor: focused ? '#FFFFFF' : colors.surface,
        }}
      />
    </View>
  );
}

// Props: onSignIn(email, pw), onSignUp(email, pw, name) -> { needsConfirmation }, onReset(email)
export default function AuthScreen({ onSignIn, onSignUp, onReset, initialMode = 'login', onBackWelcome }) {
  const [mode, setMode] = useState(initialMode); // login | register | forgot
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  const switchMode = (m) => {
    setMode(m);
    setError('');
    setInfo('');
  };

  const submit = async () => {
    setInfo('');
    const problem = validateAuth(mode, { name, email, password });
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setBusy(true);
    try {
      const mail = email.trim();
      if (mode === 'login') {
        await onSignIn(mail, password);
      } else if (mode === 'register') {
        const r = await onSignUp(mail, password, name.trim());
        if (r && r.needsConfirmation) {
          setInfo('Akun dibuat. Kami mengirim email konfirmasi. Buka tautannya, lalu masuk.');
          setMode('login');
          setPassword('');
        }
      } else {
        await onReset(mail);
        setInfo('Jika email terdaftar, tautan untuk mengatur password baru sudah dikirim. Buka tautannya di emailmu.');
        setMode('login');
      }
    } catch (e) {
      setError(e.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  const titles = { login: 'Masuk ke Tuturin', register: 'Buat akun Tuturin', forgot: 'Lupa password' };
  const labels = { login: 'Masuk', register: 'Daftar', forgot: 'Kirim Tautan' };

  return (
    <Screen>
      <Brand />
      <Title testID="auth-title" style={{ marginTop: 24, marginBottom: 8 }}>
        {titles[mode]}
      </Title>
      <T color={colors.muted} style={{ marginBottom: 20 }}>
        {mode === 'forgot'
          ? 'Masukkan email akunmu. Kami kirim tautan untuk mengatur password baru.'
          : 'Belajar berbicara bahasa Inggris bersama Nala. Progresmu tersimpan di akunmu.'}
      </T>

      <Card>
        {mode === 'register' ? <Field label="Nama" testID="auth-name" value={name} onChangeText={setName} placeholder="Nama panggilanmu" /> : null}
        <Field label="Email" testID="auth-email" value={email} onChangeText={setEmail} placeholder="nama@email.com" keyboardType="email-address" />
        {mode !== 'forgot' ? (
          <Field
            label="Password"
            testID="auth-password"
            value={password}
            onChangeText={setPassword}
            secure
            placeholder={mode === 'register' ? 'Minimal 8 karakter' : 'Password'}
          />
        ) : null}

        {error ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.badBg, borderRadius: 16, padding: 12, marginBottom: 14 }}>
            <Icon name="close-circle" size={20} color={colors.bad} />
            <T testID="auth-error" color={colors.bad} style={{ flex: 1, marginLeft: 10 }}>
              {error}
            </T>
          </View>
        ) : null}
        {info ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.tealSoft, borderRadius: 16, padding: 12, marginBottom: 14 }}>
            <Icon name="information-circle-outline" size={20} color={colors.teal} />
            <T testID="auth-info" color={colors.teal} style={{ flex: 1, marginLeft: 10 }}>
              {info}
            </T>
          </View>
        ) : null}

        <Button testID="auth-submit" label={busy ? 'Memproses...' : labels[mode]} disabled={busy} iconRight="arrow-forward" onPress={submit} />
      </Card>

      {mode === 'login' ? (
        <Pressable testID="auth-forgot" onPress={() => switchMode('forgot')} accessibilityRole="button" style={{ padding: 12, alignItems: 'center' }}>
          <T v="bodyBold" color={colors.primary}>
            Lupa password?
          </T>
        </Pressable>
      ) : null}
      <Pressable
        testID="auth-switch"
        onPress={() => switchMode(mode === 'login' ? 'register' : 'login')}
        accessibilityRole="button"
        style={{ padding: 12, alignItems: 'center' }}
      >
        <T v="bodyBold" color={colors.primary}>
          {mode === 'login' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </T>
      </Pressable>
      {onBackWelcome ? (
        <Pressable onPress={onBackWelcome} accessibilityRole="button" style={{ padding: 10, alignItems: 'center' }}>
          <T v="caption" color={colors.muted}>Kembali ke halaman awal</T>
        </Pressable>
      ) : null}
    </Screen>
  );
}
