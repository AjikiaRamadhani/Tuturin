import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Screen, Title, Card, CardHeader, Button, Badge, ProgressBar, Icon, T } from './ui.js';
import { startListening } from './speech.js';
import { TRANSLATIONS } from './data.js';
import { colors, fonts } from './theme.js';

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

  const translation = TRANSLATIONS[sentence];

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
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          testID="back-button"
          onPress={onBack}
          accessibilityRole="button"
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingRight: 12 }}
        >
          <Icon name="chevron-back" size={22} color={colors.primary} />
          <T v="bodyBold" color={colors.primary}>
            Kembali
          </T>
        </Pressable>
        <Badge testID="practice-progress" label={`Kalimat ${index + 1} dari ${total}`} tone="surface" icon="checkmark-circle" />
      </View>

      <View style={{ marginTop: 8, marginBottom: 20 }}>
        <ProgressBar value={(index + 1) / total} testID="practice-bar" />
      </View>

      <Title style={{ marginBottom: 12 }}>Ucapkan kalimat ini</Title>

      <Card tone="teal">
        <T v="h1" testID="target-sentence" color="#FFFFFF">
          {sentence}
        </T>
        {translation ? (
          <T testID="target-translation" color="rgba(255,255,255,0.88)" style={{ marginTop: 10 }}>
            {translation}
          </T>
        ) : null}
      </Card>

      <View style={{ alignItems: 'center', marginVertical: 12 }}>
        <View
          style={{
            width: 144,
            height: 144,
            borderRadius: 72,
            backgroundColor: 'rgba(242,107,122,0.12)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 116,
              height: 116,
              borderRadius: 58,
              backgroundColor: 'rgba(242,107,122,0.22)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pressable
              testID="mic-button"
              onPress={handleMic}
              accessibilityRole="button"
              accessibilityLabel="Tekan untuk bicara"
              style={({ pressed }) => ({
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: colors.coral,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.85 : 1,
              })}
            >
              <Icon name="mic" size={38} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
        <T v="h3" style={{ marginTop: 12 }}>
          Tekan untuk bicara
        </T>
        <View style={{ marginTop: 8 }}>
          <Badge testID="speech-status" label={`Status: ${status}`} tone="surface" />
        </View>
      </View>

      {message ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.yellowSoft,
            borderRadius: 16,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <Icon name="information-circle-outline" size={22} color={colors.onYellow} />
          <T testID="practice-message" color={colors.onYellow} style={{ flex: 1, marginLeft: 10 }}>
            {message}
          </T>
        </View>
      ) : null}

      <Card>
        <CardHeader
          icon="keypad-outline"
          title="Mode Simulasi"
          subtitle="Ketik transkrip sebagai pengganti suara. Dipakai untuk pengujian otomatis."
          right={<Badge label="Uji Teks" tone="mint" />}
        />
        <TextInput
          testID="sim-input"
          value={simText}
          onChangeText={setSimText}
          placeholder="Ketik transkrip di sini..."
          placeholderTextColor="#8A7172"
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            borderWidth: 1.5,
            borderColor: colors.border,
            borderRadius: 20,
            paddingVertical: 14,
            paddingHorizontal: 16,
            fontSize: 16,
            fontFamily: fonts.regular,
            color: colors.text,
            backgroundColor: colors.surface,
            marginBottom: 12,
          }}
        />
        <Button
          testID="sim-fill-target"
          label="Isi dengan kalimat target"
          icon="sparkles"
          variant="secondary"
          onPress={() => setSimText(sentence)}
        />
        <View style={{ marginTop: 12 }}>
          <Button testID="sim-submit" label="Kirim Transkrip" iconRight="arrow-forward" onPress={handleSimSubmit} />
        </View>
      </Card>
    </Screen>
  );
}
