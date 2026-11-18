import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Screen, Title, Card, Button } from './ui.js';
import { startListening } from './speech.js';
import { colors } from './theme.js';

function messageForError(code) {
  switch (code) {
    case 'unavailable':
      return 'Input suara belum aktif di versi ini. Gunakan Mode Simulasi di bawah.';
    case 'not-allowed':
      return 'Izin mikrofon ditolak. Aktifkan izin di pengaturan, atau gunakan Mode Simulasi di bawah.';
    case 'no-speech':
      return 'Suara tidak terdeteksi. Coba lagi.';
    default:
      return 'Terjadi masalah pada input suara. Coba lagi atau gunakan Mode Simulasi.';
  }
}

export default function PracticeScreen({ sentence, index, total, onSubmit, onBack }) {
  const [status, setStatus] = useState('Siap');
  const [message, setMessage] = useState('');
  const [simText, setSimText] = useState('');

  const handleMic = () => {
    setMessage('');
    setStatus('Mendengarkan');
    startListening({
      onStatus: (s) => setStatus(s),
      onResult: (text) => {
        setStatus('Siap');
        onSubmit(text);
      },
      onError: ({ code }) => {
        setStatus('Siap');
        setMessage(messageForError(code));
      },
    });
  };

  const handleSimSubmit = () => {
    if (!simText.trim()) {
      setMessage('Suara tidak terdeteksi. Coba lagi.');
      return;
    }
    setMessage('');
    onSubmit(simText.trim());
  };

  return (
    <Screen>
      <Text testID="practice-progress" style={{ color: colors.muted, marginBottom: 4 }}>
        {`Kalimat ${index + 1} dari ${total}`}
      </Text>
      <Title>Ucapkan kalimat ini</Title>

      <Card>
        <Text testID="target-sentence" style={{ fontSize: 22, lineHeight: 30, color: colors.primaryDark }}>
          {sentence}
        </Text>
      </Card>

      <View style={{ alignItems: 'center', marginVertical: 8 }}>
        <Pressable
          testID="mic-button"
          onPress={handleMic}
          accessibilityRole="button"
          style={({ pressed }) => ({
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>MIC</Text>
        </Pressable>
        <Text style={{ marginTop: 8, color: colors.muted }}>Tekan untuk bicara</Text>
        <Text testID="speech-status" style={{ marginTop: 4, fontWeight: '600' }}>{`Status: ${status}`}</Text>
      </View>

      {message ? (
        <View
          style={{
            backgroundColor: colors.warnBg,
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <Text testID="practice-message" style={{ color: colors.warn }}>
            {message}
          </Text>
        </View>
      ) : null}

      <Card>
        <Text style={{ fontWeight: '700', marginBottom: 4 }}>Mode Simulasi</Text>
        <Text style={{ color: colors.muted, marginBottom: 10 }}>
          Ketik transkrip sebagai pengganti suara. Dipakai untuk pengujian otomatis.
        </Text>
        <TextInput
          testID="sim-input"
          value={simText}
          onChangeText={setSimText}
          placeholder="Ketik transkrip di sini"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 10,
            padding: 12,
            fontSize: 16,
            backgroundColor: '#FFFFFF',
          }}
        />
        <Button
          testID="sim-fill-target"
          label="Isi dengan kalimat target"
          variant="secondary"
          onPress={() => setSimText(sentence)}
        />
        <Button testID="sim-submit" label="Kirim Transkrip" onPress={handleSimSubmit} />
      </Card>

      <Button testID="back-button" label="Kembali ke Beranda" variant="secondary" onPress={onBack} />
    </Screen>
  );
}
