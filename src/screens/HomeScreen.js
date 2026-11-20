import React from 'react';
import { Pressable, View } from 'react-native';
import { Screen, Title, Card, CardHeader, Button, Badge, ProgressBar, Brand, Icon, T } from '../components/ui.js';
import { LEVELS, GOALS } from '../data.js';
import { colors } from '../theme.js';

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

function LessonRow({ lesson, onPress }) {
  const isLocked = lesson.pathStatus === 'locked' || lesson.pathStatus === 'skipped';
  const isComplete = lesson.pathStatus === 'completed';
  const isCurrent = lesson.pathStatus === 'current';
  return (
    <Pressable
      testID={`lesson-${lesson.id}`}
      onPress={isLocked ? undefined : onPress}
      accessibilityRole="button"
      accessibilityState={{ disabled: isLocked }}
      style={({ pressed }) => ({
        padding: 16,
        borderRadius: 24,
        borderWidth: 1.5,
        borderColor: isCurrent ? colors.primary : isComplete ? colors.teal : colors.border,
        backgroundColor: isCurrent ? colors.coralSoft : isComplete ? colors.tealSoft : colors.card,
        marginBottom: 10,
        opacity: isLocked ? 0.68 : pressed ? 0.85 : 1,
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
        <Icon name={isLocked ? 'lock-closed' : isComplete ? 'checkmark-circle' : 'play-circle'} size={25} color={isCurrent ? colors.primary : isComplete ? colors.teal : colors.muted} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
        <Badge
          testID={`lesson-${lesson.id}-status`}
          label={isComplete ? 'Selesai' : isCurrent ? 'Lanjutkan' : lesson.pathStatus === 'skipped' ? 'Sesuai levelmu' : 'Terkunci'}
          tone={isComplete ? 'mint' : isCurrent ? 'coral' : 'surface'}
          icon={isComplete ? 'checkmark-circle' : isLocked ? 'lock-closed' : 'arrow-forward'}
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
  onOpenAccount,
  syncWarning,
}) {
  const levelLabel = (LEVELS.find((l) => l.id === prefs.level) || {}).label || '-';
  const goalLabel = (GOALS.find((g) => g.id === prefs.goal) || {}).label || '-';
  const doneCount = progress.completed.length;
  const remaining = Math.max(0, prefs.target - doneCount);
  const pct = prefs.target > 0 ? Math.min(1, doneCount / prefs.target) : 0;
  const nextLesson = lessons.find((lesson) => lesson.pathStatus === 'current')
    || [...lessons].reverse().find((lesson) => lesson.pathStatus === 'completed');
  const pathCompletedCount = lessons.filter((lesson) => lesson.pathStatus === 'completed').length;
  const activePathCount = lessons.filter((lesson) => lesson.pathStatus !== 'skipped').length;

  return (
    <Screen hasBottomNav>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Brand />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Badge testID="streak-text" label={`${streak} hari beruntun`} tone="yellow" icon="flame" />
          <Pressable testID="account-button" onPress={onOpenAccount} accessibilityRole="button" accessibilityLabel="Akun">
            <Icon name="person-circle-outline" size={34} color={colors.primary} />
          </Pressable>
        </View>
      </View>
      {syncWarning ? (
        <View style={{ backgroundColor: colors.yellowSoft, borderRadius: 16, padding: 12, marginTop: 12 }}>
          <T testID="sync-warning" color={colors.onYellow}>{syncWarning}</T>
        </View>
      ) : null}
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
            ? `Target harian tercapai! Jalur belajarmu sudah ${pathCompletedCount} dari ${activePathCount} pelajaran.`
            : `Selesaikan ${remaining} pelajaran lagi hari ini, satu langkah demi satu langkah.`}
        </T>
        <Button
          testID="start-button"
          label={nextLesson?.pathStatus === 'completed' ? 'Ulangi Pelajaran' : 'Lanjutkan Jalur'}
          icon="mic"
          variant="light"
          disabled={!nextLesson}
          onPress={() => nextLesson && onOpenLesson(nextLesson.id)}
        />
      </Card>

      <Card>
        <CardHeader icon="trending-up" title="Target hari ini" />
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

      <T v="h2" style={{ marginBottom: 4 }}>
        Jalur belajarmu
      </T>
      <T color={colors.muted} style={{ marginBottom: 12 }}>
        {`${pathCompletedCount} dari ${activePathCount} pelajaran selesai. Selesaikan pelajaran aktif untuk membuka langkah berikutnya.`}
      </T>
      {lessons.length === 0 ? (
        <Card tone="surface">
          <T testID="lessons-empty" color={colors.muted}>
            Belum ada pelajaran untuk levelmu. Coba lagi nanti atau ubah levelmu.
          </T>
        </Card>
      ) : null}
      {lessons.map((l) => (
        <LessonRow
          key={l.id}
          lesson={l}
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
