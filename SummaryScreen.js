import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen, Card, CardHeader, Button, Badge, Icon, T } from './ui.js';
import { TUTOR_NAME } from './data.js';
import { mastery, formatDuration } from './logic.js';
import { colors } from './theme.js';

function Stat({ label, value, testID, bg, fg }) {
  return (
    <View style={{ flex: 1, backgroundColor: bg, borderRadius: 20, paddingVertical: 14, paddingHorizontal: 8, alignItems: 'center' }}>
      <T v="h2" testID={testID} color={fg}>
        {value}
      </T>
      <T v="caption" color={fg} style={{ marginTop: 2, textAlign: 'center' }}>
        {label}
      </T>
    </View>
  );
}

// result = { bests, transcript, seconds }
export default function SummaryScreen({ lesson, result, streak, savedVocab, onToggleVocab, onHome }) {
  const [showTranscript, setShowTranscript] = useState(false);
  const pct = mastery(result.bests);

  return (
    <Screen>
      <Card tone="teal">
        <View style={{ alignItems: 'center' }}>
          <Icon name="trophy" size={44} color="#FFFFFF" />
          <T v="h1" testID="objective-complete" color="#FFFFFF" style={{ marginTop: 8, textAlign: 'center' }}>
            Tujuan tercapai
          </T>
          <T color="rgba(255,255,255,0.9)" testID="summary-lesson-title" style={{ marginTop: 4, textAlign: 'center' }}>
            {lesson.title}
          </T>
          <T color="rgba(255,255,255,0.9)" style={{ marginTop: 4, textAlign: 'center' }}>
            {`${TUTOR_NAME}: Kerja bagus, sampai ketemu di pelajaran berikutnya!`}
          </T>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <Stat testID="summary-new-phrases" label="Frasa baru" value={`${lesson.steps.length}`} bg={colors.tealSoft} fg={colors.teal} />
        <Stat testID="summary-mastery" label="Penguasaan" value={`${pct}%`} bg={colors.coralSoft} fg={colors.primary} />
        <Stat testID="summary-time" label="Waktu belajar" value={formatDuration(result.seconds)} bg={colors.yellowSoft} fg={colors.onYellow} />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Badge testID="summary-streak" label={`${streak} hari beruntun`} tone="yellow" icon="flame" />
      </View>

      <Card>
        <CardHeader icon="flag-outline" title="Tujuan yang dicapai" />
        {lesson.objectives.map((o) => (
          <View key={o} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Icon name="checkmark-circle" size={20} color={colors.teal} />
            <T style={{ flex: 1, marginLeft: 10 }}>{o}</T>
          </View>
        ))}
      </Card>

      <Card>
        <CardHeader icon="book-outline" title="Frasa baru" subtitle="Ketuk penanda untuk menyimpan" />
        {lesson.steps.map((s, i) => {
          const saved = (savedVocab || []).some((v) => v.en === s.en);
          return (
            <View key={s.en} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <T v="bodyBold" testID={`phrase-${i}-en`}>{s.en}</T>
                <T color={colors.muted}>{s.id}</T>
              </View>
              <View style={{ width: 120 }}>
                <Button
                  testID={`save-phrase-${i}`}
                  label={saved ? 'Tersimpan' : 'Simpan'}
                  icon={saved ? 'bookmark' : 'bookmark-outline'}
                  variant="secondary"
                  onPress={() => onToggleVocab(s)}
                />
              </View>
            </View>
          );
        })}
      </Card>

      <Card>
        <CardHeader icon="document-text-outline" title="Transkrip percakapan" />
        <Button
          testID="transcript-toggle"
          label={showTranscript ? 'Sembunyikan Transkrip' : 'Lihat Transkrip'}
          variant="secondary"
          onPress={() => setShowTranscript((v) => !v)}
        />
        {showTranscript ? (
          <View style={{ marginTop: 12 }} testID="transcript-list">
            {result.transcript.map((m, i) => (
              <View key={i} style={{ marginBottom: 8, padding: 12, borderRadius: 16, backgroundColor: m.role === 'nala' ? colors.surface : colors.tealSoft }}>
                <T v="caption" color={colors.muted}>
                  {m.role === 'nala' ? TUTOR_NAME.toUpperCase() : 'KAMU'}
                </T>
                <T testID={`transcript-line-${i}`}>{m.text}</T>
              </View>
            ))}
          </View>
        ) : null}
      </Card>

      <Button testID="summary-home" label="Kembali ke Beranda" iconRight="arrow-forward" onPress={onHome} />
    </Screen>
  );
}
