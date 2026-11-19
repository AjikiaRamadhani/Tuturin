import React from 'react';
import { View } from 'react-native';
import { Screen, Title, Card, CardHeader, Button, Icon, T } from './ui.js';
import { colors } from './theme.js';

function labelForScore(score) {
  if (score >= 90) return 'Bagus sekali!';
  if (score >= 60) return 'Cukup baik, terus berlatih.';
  return 'Perlu latihan lagi.';
}

function ringColor(score) {
  if (score >= 90) return colors.teal;
  if (score >= 60) return colors.yellow;
  return colors.coral;
}

function Stat({ label, value, testID, bg, fg }) {
  return (
    <View style={{ flex: 1, backgroundColor: bg, borderRadius: 20, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center' }}>
      <T v="h2" testID={testID} color={fg}>
        {value}
      </T>
      <T v="caption" color={fg} style={{ marginTop: 2, textAlign: 'center' }}>
        {label}
      </T>
    </View>
  );
}

export default function FeedbackScreen({ sentence, transcript, result, isLast, onRetry, onNext }) {
  const total = result.words.length;
  const okCount = result.words.filter((w) => w.ok).length;
  const badWords = result.words.filter((w) => !w.ok).map((w) => w.word);

  return (
    <Screen>
      <Title style={{ marginBottom: 16 }}>Hasil latihan</Title>

      <Card>
        <View style={{ alignItems: 'center' }}>
          <View
            style={{
              width: 156,
              height: 156,
              borderRadius: 78,
              borderWidth: 12,
              borderColor: ringColor(result.score),
              backgroundColor: '#FFFFFF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <T v="display" testID="score-text">{`${result.score}%`}</T>
            <T v="caption" color={colors.muted}>
              KECOCOKAN
            </T>
          </View>
          <T v="h2" testID="score-label" style={{ marginTop: 16, textAlign: 'center' }}>
            {labelForScore(result.score)}
          </T>
          <T v="caption" color={colors.muted} style={{ marginTop: 4, textAlign: 'center' }}>
            Dihitung dari kecocokan kata transkrip dengan kalimat target, bukan analisis audio.
          </T>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
          <Stat testID="stat-correct" label="Kata benar" value={`${okCount}/${total}`} bg={colors.tealSoft} fg={colors.teal} />
          <Stat testID="stat-wrong" label="Perlu dilatih" value={`${badWords.length}`} bg={colors.badBg} fg={colors.bad} />
          <Stat testID="stat-extra" label="Kata tambahan" value={`${result.extra.length}`} bg={colors.yellowSoft} fg={colors.onYellow} />
        </View>
      </Card>

      <Card>
        <CardHeader icon="locate-outline" title="Kalimat target" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {result.words.map((w, i) => (
            <View
              key={`${w.word}-${i}`}
              testID={`word-${i}-${w.ok ? 'ok' : 'bad'}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 999,
                backgroundColor: w.ok ? colors.mint : colors.badBg,
              }}
            >
              <Icon name={w.ok ? 'checkmark-circle' : 'close-circle'} size={16} color={w.ok ? colors.onMint : colors.bad} />
              <T v="label" color={w.ok ? colors.onMint : colors.bad} style={{ marginLeft: 6 }}>
                {w.word}
              </T>
            </View>
          ))}
        </View>
        <T v="bodyBold" testID="bad-words-text" color={badWords.length === 0 ? colors.teal : colors.bad}>
          {badWords.length === 0 ? 'Semua kata sudah benar.' : `Kata yang perlu dilatih: ${badWords.join(', ')}`}
        </T>
        {result.extra.length > 0 && (
          <T testID="extra-words-text" color={colors.muted} style={{ marginTop: 4 }}>
            {`Kata tambahan yang terdengar: ${result.extra.join(', ')}`}
          </T>
        )}
      </Card>

      <Card>
        <CardHeader icon="document-text-outline" title="Transkrip kamu" />
        <View style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 14 }}>
          <T testID="transcript-text">{transcript}</T>
        </View>
      </Card>

      <Card>
        <CardHeader icon="bulb-outline" title="Tata bahasa" />
        {result.grammar.length === 0 ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.tealSoft, borderRadius: 16, padding: 14 }}>
            <Icon name="checkmark-circle" size={22} color={colors.teal} />
            <T testID="grammar-none" color={colors.teal} style={{ flex: 1, marginLeft: 10 }}>
              Tidak ada kesalahan tata bahasa yang terdeteksi.
            </T>
          </View>
        ) : (
          result.grammar.map((g, i) => (
            <View
              key={`${g.id}-${i}`}
              testID={`grammar-issue-${i}`}
              style={{ marginBottom: 10, padding: 14, borderRadius: 16, backgroundColor: colors.yellowSoft }}
            >
              <T v="bodyBold" color={colors.onYellow}>{`"${g.found}"`}</T>
              <T style={{ marginTop: 4 }}>{g.message}</T>
              <T v="bodyBold" color={colors.teal} style={{ marginTop: 6 }}>{`Saran: ${g.suggestion}`}</T>
            </View>
          ))
        )}
      </Card>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Button testID="retry-button" label="Ulangi" icon="refresh" variant="secondary" onPress={onRetry} />
        </View>
        <View style={{ flex: 1 }}>
          <Button testID="next-button" label={isLast ? 'Selesai' : 'Lanjut'} iconRight="arrow-forward" onPress={onNext} />
        </View>
      </View>
    </Screen>
  );
}
