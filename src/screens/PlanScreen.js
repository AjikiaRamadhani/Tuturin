import React from 'react';
import { View } from 'react-native';
import { Screen, Title, Card, CardHeader, Button, Badge, Icon, T } from '../components/ui.js';
import { LEVELS, GOALS, TUTOR_NAME } from '../data.js';
import { colors } from '../theme.js';

export default function PlanScreen({ prefs, lessons, onContinue }) {
  if (!prefs) return null;
  const levelLabel = (LEVELS.find((l) => l.id === prefs.level) || {}).label || '-';
  const goalLabel = (GOALS.find((g) => g.id === prefs.goal) || {}).label || '-';
  const recommended = lessons.find((l) => l.recommended) || lessons[0];

  return (
    <Screen>
      <Title testID="plan-title" style={{ marginBottom: 8 }}>
        Rencana belajarmu
      </Title>
      <T color={colors.muted} style={{ marginBottom: 20 }}>
        {`${TUTOR_NAME} sudah menyiapkan rencana berdasarkan pilihanmu.`}
      </T>

      <Card>
        <CardHeader icon="settings-outline" title="Pilihanmu" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          <Badge testID="plan-level" label={levelLabel} tone="mint" />
          <Badge testID="plan-goal" label={goalLabel} tone="coral" />
          <Badge testID="plan-target" label={`${prefs.target} pelajaran per hari`} tone="yellow" />
        </View>
      </Card>

      {recommended ? (
        <Card tone="tealSoft">
          <Badge label="PELAJARAN PERTAMA" tone="mint" icon="sparkles" />
          <T v="h2" testID="plan-recommended" style={{ marginTop: 10 }}>
            {recommended.title}
          </T>
          {recommended.objectives.map((o) => (
            <View key={o} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
              <Icon name="checkmark-circle" size={18} color={colors.teal} />
              <T style={{ flex: 1, marginLeft: 8 }}>{o}</T>
            </View>
          ))}
        </Card>
      ) : (
        <Card tone="surface">
          <T testID="plan-recommended" color={colors.muted}>
            Belum ada pelajaran yang terbit untuk level ini. Kamu bisa lanjut ke Beranda dan cek lagi nanti.
          </T>
        </Card>
      )}

      <Button testID="plan-continue" label="Lanjut ke Beranda" iconRight="arrow-forward" onPress={onContinue} />
    </Screen>
  );
}
