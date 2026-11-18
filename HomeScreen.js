import React from 'react';
import { Text } from 'react-native';
import { Screen, Title, Card, Button } from './ui.js';
import { LEVELS, GOALS } from './data.js';
import { colors } from './theme.js';

export default function HomeScreen({ prefs, progress, onStart, onChangeTarget }) {
  const levelLabel = (LEVELS.find((l) => l.id === prefs.level) || {}).label || '-';
  const goalLabel = (GOALS.find((g) => g.id === prefs.goal) || {}).label || '-';
  const avg = progress.count > 0 ? `${Math.round(progress.scoreSum / progress.count)}%` : '-';

  return (
    <Screen>
      <Title testID="home-greeting">Halo! Siap latihan berbicara?</Title>
      <Text style={{ color: colors.muted, marginBottom: 16 }}>
        Latihan singkat tiap hari lebih efektif daripada belajar lama sekali seminggu.
      </Text>

      <Card>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Pengaturan belajarmu</Text>
        <Text testID="summary-level" style={{ marginBottom: 4 }}>{`Level: ${levelLabel}`}</Text>
        <Text testID="summary-goal" style={{ marginBottom: 4 }}>{`Tujuan: ${goalLabel}`}</Text>
        <Text testID="summary-target">{`Target harian: ${prefs.target} kalimat`}</Text>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700', marginBottom: 8 }}>Progres hari ini</Text>
        <Text testID="progress-text" style={{ marginBottom: 4 }}>
          {`Latihan hari ini: ${progress.count} / ${prefs.target}`}
        </Text>
        <Text testID="avg-score-text">{`Rata-rata skor: ${avg}`}</Text>
      </Card>

      <Button testID="start-button" label="Mulai Latihan" onPress={onStart} />
      <Button
        testID="change-target-button"
        label="Ubah Target"
        variant="secondary"
        onPress={onChangeTarget}
      />
    </Screen>
  );
}
