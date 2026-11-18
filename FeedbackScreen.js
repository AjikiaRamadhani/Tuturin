import React from 'react';
import { Text, View } from 'react-native';
import { Screen, Title, Card, Button } from './ui.js';
import { colors } from './theme.js';

function labelForScore(score) {
  if (score >= 90) return 'Bagus sekali!';
  if (score >= 60) return 'Cukup baik, terus berlatih.';
  return 'Perlu latihan lagi.';
}

export default function FeedbackScreen({ sentence, transcript, result, isLast, onRetry, onNext }) {
  const badWords = result.words.filter((w) => !w.ok).map((w) => w.word);

  return (
    <Screen>
      <Title>Hasil latihan</Title>

      <Card>
        <Text testID="score-text" style={{ fontSize: 28, fontWeight: '700', color: colors.primaryDark }}>
          {`Skor pelafalan: ${result.score}%`}
        </Text>
        <Text testID="score-label" style={{ color: colors.muted, marginTop: 4 }}>
          {labelForScore(result.score)}
        </Text>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700', marginBottom: 6 }}>Kalimat target</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
          {result.words.map((w, i) => (
            <Text
              key={`${w.word}-${i}`}
              testID={`word-${i}-${w.ok ? 'ok' : 'bad'}`}
              style={{
                marginRight: 6,
                marginBottom: 6,
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 8,
                overflow: 'hidden',
                backgroundColor: w.ok ? colors.goodBg : colors.badBg,
                color: w.ok ? colors.good : colors.bad,
                fontWeight: '600',
              }}
            >
              {w.word}
            </Text>
          ))}
        </View>
        <Text testID="bad-words-text">
          {badWords.length === 0
            ? 'Semua kata sudah benar.'
            : `Kata yang perlu dilatih: ${badWords.join(', ')}`}
        </Text>
        {result.extra.length > 0 && (
          <Text testID="extra-words-text" style={{ color: colors.muted, marginTop: 4 }}>
            {`Kata tambahan yang terdengar: ${result.extra.join(', ')}`}
          </Text>
        )}
      </Card>

      <Card>
        <Text style={{ fontWeight: '700', marginBottom: 4 }}>Transkrip kamu</Text>
        <Text testID="transcript-text">{transcript}</Text>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Tata bahasa</Text>
        {result.grammar.length === 0 ? (
          <Text testID="grammar-none">Tidak ada kesalahan tata bahasa yang terdeteksi.</Text>
        ) : (
          result.grammar.map((g, i) => (
            <View
              key={`${g.id}-${i}`}
              testID={`grammar-issue-${i}`}
              style={{ marginBottom: 10, padding: 10, borderRadius: 10, backgroundColor: colors.warnBg }}
            >
              <Text style={{ fontWeight: '600' }}>{`"${g.found}"`}</Text>
              <Text style={{ marginTop: 2 }}>{g.message}</Text>
              <Text style={{ marginTop: 2, color: colors.good }}>{`Saran: ${g.suggestion}`}</Text>
            </View>
          ))
        )}
      </Card>

      <Button testID="retry-button" label="Ulangi" variant="secondary" onPress={onRetry} />
      <Button testID="next-button" label={isLast ? 'Selesai' : 'Lanjut'} onPress={onNext} />
    </Screen>
  );
}
