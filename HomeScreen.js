import React from 'react';
import { View } from 'react-native';
import { Screen, Title, Card, CardHeader, Button, Badge, ProgressBar, Brand, Icon, T } from './ui.js';
import { LEVELS, GOALS } from './data.js';
import { colors } from './theme.js';

function SettingRow({ icon, label, value, testID, tone }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 20,
        backgroundColor: colors.surface,
        marginBottom: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name={icon} size={20} color={colors.teal} />
        <T v="bodyBold" style={{ marginLeft: 10 }}>
          {label}
        </T>
      </View>
      <Badge testID={testID} label={value} tone={tone} />
    </View>
  );
}

export default function HomeScreen({ prefs, progress, onStart, onChangeTarget, targetReached }) {
  const levelLabel = (LEVELS.find((l) => l.id === prefs.level) || {}).label || '-';
  const goalLabel = (GOALS.find((g) => g.id === prefs.goal) || {}).label || '-';
  const avg = progress.count > 0 ? `${Math.round(progress.scoreSum / progress.count)}%` : '-';
  const remaining = Math.max(0, prefs.target - progress.count);
  const pct = prefs.target > 0 ? Math.min(1, progress.count / prefs.target) : 0;

  return (
    <Screen>
      <Brand />
      <Title testID="home-greeting" style={{ marginTop: 20, marginBottom: 16 }}>
        Halo! Siap latihan berbicara?
      </Title>

      <Card tone="coral">
        <Badge label="MISI HARIAN" tone="white" icon="flash" />
        <T v="h1" color="#FFFFFF" style={{ marginTop: 12 }}>
          Latihan Berbicara Hari Ini
        </T>
        <T color="#FFFFFF" style={{ marginTop: 6, marginBottom: 16 }}>
          {targetReached
            ? 'Target hari ini sudah tercapai. Mantap, sampai jumpa besok!'
            : `Latih bahasa Inggrismu dengan ${remaining} kalimat lagi hari ini.`}
        </T>
        <Button
          testID="start-button"
          label={targetReached ? 'Target Harian Tercapai' : 'Mulai Latihan'}
          icon={targetReached ? 'checkmark-circle' : 'mic'}
          variant="light"
          onPress={onStart}
          disabled={targetReached}
        />
      </Card>

      <Card>
        <CardHeader
          icon="trending-up"
          title="Progres hari ini"
          right={<Badge testID="avg-score-text" label={`Rata-rata skor: ${avg}`} tone="yellow" icon="star" />}
        />
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <T v="display" testID="progress-text">{`${progress.count} / ${prefs.target}`}</T>
            <T color={colors.muted} style={{ marginLeft: 8 }}>
              kalimat selesai
            </T>
          </View>
          <T v="bodyBold" testID="progress-percent" color={colors.teal}>{`${Math.round(pct * 100)}%`}</T>
        </View>
        <View style={{ marginTop: 12 }}>
          <ProgressBar value={pct} testID="progress-bar" />
        </View>
      </Card>

      <Card>
        <CardHeader icon="settings-outline" title="Pengaturan belajarmu" />
        <SettingRow icon="bar-chart-outline" label="Level" value={levelLabel} testID="summary-level" tone="mint" />
        <SettingRow
          icon="chatbubble-ellipses-outline"
          label="Tujuan"
          value={goalLabel}
          testID="summary-goal"
          tone="coral"
        />
        <SettingRow
          icon="flag-outline"
          label="Target harian"
          value={`${prefs.target} kalimat`}
          testID="summary-target"
          tone="yellow"
        />
        <View style={{ marginTop: 8 }}>
          <Button
            testID="change-target-button"
            label="Ubah Target"
            icon="options-outline"
            variant="secondary"
            onPress={onChangeTarget}
          />
        </View>
      </Card>

      <Card tone="surface">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name="bulb-outline" size={22} color={colors.onYellow} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <T v="caption" color={colors.muted}>
              TIPS CEPAT
            </T>
            <T style={{ marginTop: 2 }}>Ucapkan kalimat dengan jelas dan tidak terlalu cepat.</T>
          </View>
        </View>
      </Card>
    </Screen>
  );
}
