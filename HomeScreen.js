import React from 'react';
import { Pressable, View } from 'react-native';
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

function LessonRow({ lesson, done, onPress }) {
  return (
    <Pressable
      testID={`lesson-${lesson.id}`}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        padding: 16,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: lesson.recommended ? colors.teal : colors.border,
        backgroundColor: lesson.recommended ? colors.tealSoft : colors.card,
        marginBottom: 10,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <T v="h3" testID={`lesson-${lesson.id}-title`}>
            {lesson.title}
          </T>
          <T color={colors.muted} style={{ marginTop: 2 }}>
            {lesson.objectives.length} tujuan, sekitar {lesson.minutes} menit
          </T>
        </View>
        <Icon name="chevron-forward" size={22} color={colors.muted} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        {lesson.recommended ? (
          <Badge testID={`lesson-${lesson.id}-recommended`} label="Rekomendasi" tone="mint" icon="sparkles" />
        ) : null}
        <Badge
          testID={`lesson-${lesson.id}-status`}
          label={done ? 'Selesai' : 'Belum'}
          tone={done ? 'yellow' : 'surface'}
          icon={done ? 'checkmark-circle' : undefined}
        />
      </View>
    </Pressable>
  );
}

export default function HomeScreen({
  prefs,
  progress,
  lessons,
  streak,
  vocabCount,
  targetReached,
  onOpenLesson,
  onChangeTarget,
  onOpenVocab,
}) {
  const levelLabel = (LEVELS.find((l) => l.id === prefs.level) || {}).label || '-';
  const goalLabel = (GOALS.find((g) => g.id === prefs.goal) || {}).label || '-';
  const doneCount = progress.completed.length;
  const remaining = Math.max(0, prefs.target - doneCount);
  const pct = prefs.target > 0 ? Math.min(1, doneCount / prefs.target) : 0;
  const nextLesson = lessons.find((l) => !progress.completed.includes(l.id)) || lessons[0];

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Brand />
        <Badge testID="streak-text" label={`${streak} hari beruntun`} tone="yellow" icon="flame" />
      </View>
      <Title testID="home-greeting" style={{ marginTop: 20, marginBottom: 16 }}>
        Halo! Siap latihan berbicara?
      </Title>

      <Card tone="coral">
        <Badge label="MISI HARIAN" tone="white" icon="flash" />
        <T v="h1" color="#FFFFFF" style={{ marginTop: 12 }}>
          Belajar bersama Nala
        </T>
        <T color="#FFFFFF" style={{ marginTop: 6, marginBottom: 16 }} testID="daily-message">
          {targetReached
            ? 'Target hari ini sudah tercapai. Mantap, kamu boleh lanjut atau istirahat!'
            : `Selesaikan ${remaining} pelajaran lagi hari ini.`}
        </T>
        <Button
          testID="start-button"
          label={targetReached ? 'Belajar Lagi' : 'Lanjut Belajar'}
          icon="mic"
          variant="light"
          onPress={() => onOpenLesson(nextLesson.id)}
        />
      </Card>

      <Card>
        <CardHeader icon="trending-up" title="Progres hari ini" />
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <T v="display" testID="progress-text">{`${doneCount} / ${prefs.target}`}</T>
            <T color={colors.muted} style={{ marginLeft: 8 }}>
              pelajaran selesai
            </T>
          </View>
          <T v="bodyBold" testID="progress-percent" color={colors.teal}>{`${Math.round(pct * 100)}%`}</T>
        </View>
        <View style={{ marginTop: 12 }}>
          <ProgressBar value={pct} testID="progress-bar" />
        </View>
      </Card>

      <T v="h2" style={{ marginBottom: 12 }}>
        Pelajaran untukmu
      </T>
      {lessons.map((l) => (
        <LessonRow
          key={l.id}
          lesson={l}
          done={progress.completed.includes(l.id)}
          onPress={() => onOpenLesson(l.id)}
        />
      ))}

      <Card style={{ marginTop: 6 }}>
        <CardHeader icon="settings-outline" title="Pengaturan belajarmu" />
        <SettingRow icon="bar-chart-outline" label="Level" value={levelLabel} testID="summary-level" tone="mint" />
        <SettingRow icon="chatbubble-ellipses-outline" label="Tujuan" value={goalLabel} testID="summary-goal" tone="coral" />
        <SettingRow icon="flag-outline" label="Target harian" value={`${prefs.target} pelajaran`} testID="summary-target" tone="yellow" />
        <View style={{ marginTop: 8 }}>
          <Button testID="change-target-button" label="Ubah Target" icon="options-outline" variant="secondary" onPress={onChangeTarget} />
        </View>
      </Card>

      <Button
        testID="vocab-button"
        label={`Kosakata Tersimpan (${vocabCount})`}
        icon="bookmark"
        variant="secondary"
        onPress={onOpenVocab}
      />
    </Screen>
  );
}
