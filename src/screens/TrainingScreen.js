import React from 'react';
import { Pressable, View } from 'react-native';
import { Screen, Title, Card, Badge, Icon, T } from '../components/ui.js';
import { GOALS, LEVELS } from '../data.js';
import { colors } from '../theme.js';

const LEVEL_INTRO = {
  pemula: 'Mulai dari frasa pendek untuk situasi sehari-hari.',
  menengah: 'Latih jawaban yang lebih lengkap dan terdengar alami.',
  mahir: 'Sampaikan pendapat dan tangani situasi yang lebih rumit.',
};

export default function TrainingScreen({ lessons, progress, onOpenLesson }) {
  const goal = GOALS.find((item) => lessons[0]?.goal === item.id);
  const doneCount = lessons.filter((lesson) => lesson.pathStatus === 'completed').length;
  let previousLevel = null;

  return (
    <Screen hasBottomNav>
      <Title testID="training-title">Jalur Belajar</Title>
      <T color={colors.muted} style={{ marginTop: 6, marginBottom: 16 }}>
        {goal ? `Kursus ${goal.label}. ` : ''}Selesaikan satu pelajaran untuk membuka langkah berikutnya.
      </T>

      <Card tone="teal">
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <T v="label" color="#FFFFFF">PROGRES KURSUS</T>
            <T v="h2" color="#FFFFFF" style={{ marginTop: 4 }} testID="path-progress">
              {`${doneCount} dari ${lessons.filter((lesson) => lesson.pathStatus !== 'skipped').length} pelajaran`}
            </T>
          </View>
          <Icon name="map-outline" size={30} color="#FFFFFF" />
        </View>
      </Card>

      {lessons.length === 0 ? (
        <Card tone="surface">
          <Icon name="book-outline" size={26} color={colors.teal} />
          <T v="h3" style={{ marginTop: 10 }}>Jalur belum tersedia</T>
          <T testID="training-empty" color={colors.muted} style={{ marginTop: 4 }}>
            Belum ada materi untuk pilihan tujuan dan levelmu.
          </T>
        </Card>
      ) : lessons.map((lesson, index) => {
        const level = LEVELS.find((item) => item.id === lesson.level);
        const showLevel = previousLevel !== lesson.level;
        previousLevel = lesson.level;
        const isLocked = lesson.pathStatus === 'locked' || lesson.pathStatus === 'skipped';
        const isComplete = lesson.pathStatus === 'completed';
        const isCurrent = lesson.pathStatus === 'current';
        const doneToday = progress.completed.includes(lesson.id);
        const nodeColor = isComplete ? colors.teal : isCurrent ? colors.primary : colors.muted;

        return (
          <View key={lesson.id}>
            {showLevel ? (
              <View style={{ marginTop: 14, marginBottom: 10 }}>
                <T v="h3">{level?.label || 'Materi'}</T>
                <T color={colors.muted} style={{ marginTop: 2 }}>
                  {LEVEL_INTRO[lesson.level] || 'Lanjutkan latihan berbicaramu.'}
                </T>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
              <View style={{ width: 54, alignItems: 'center' }}>
                <View style={{
                  width: 42,
                  height: 42,
                  borderRadius: 21,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCurrent ? colors.primary : isComplete ? colors.teal : colors.surface,
                  borderWidth: isLocked ? 1 : 0,
                  borderColor: colors.border,
                  marginTop: 12,
                }}>
                  <Icon name={isLocked ? 'lock-closed' : isComplete ? 'checkmark' : isCurrent ? 'mic' : 'ellipse'} size={19} color={isCurrent || isComplete ? '#FFFFFF' : nodeColor} />
                </View>
                {index < lessons.length - 1 ? (
                  <View style={{ width: 3, flex: 1, minHeight: 18, backgroundColor: isComplete ? colors.teal : colors.border, marginVertical: 3 }} />
                ) : null}
              </View>
              <Pressable
                testID={`training-lesson-${lesson.id}`}
                onPress={isLocked ? undefined : () => onOpenLesson(lesson.id)}
                accessibilityRole="button"
                accessibilityState={{ disabled: isLocked }}
                style={({ pressed }) => ({ flex: 1, opacity: isLocked ? 0.65 : pressed ? 0.82 : 1 })}
              >
                <Card tone={isCurrent ? 'coral' : isComplete ? 'tealSoft' : 'default'} style={{ marginBottom: 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <T v="h3">{lesson.title}</T>
                      <T color={colors.muted} style={{ marginTop: 4 }}>
                        {`${lesson.steps.length} frasa · sekitar ${lesson.minutes} menit`}
                      </T>
                    </View>
                    <Icon name={isLocked ? 'lock-closed' : 'chevron-forward'} size={19} color={colors.muted} />
                  </View>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                    <Badge label={lesson.pathStatus === 'skipped' ? 'Dilewati sesuai level' : isComplete ? 'Selesai' : isCurrent ? 'Mulai di sini' : 'Selesaikan sebelumnya'} tone={isComplete ? 'mint' : isCurrent ? 'coral' : 'surface'} />
                    {doneToday ? <Badge label="Latihan hari ini selesai" tone="yellow" /> : null}
                  </View>
                </Card>
              </Pressable>
            </View>
          </View>
        );
      })}
    </Screen>
  );
}
