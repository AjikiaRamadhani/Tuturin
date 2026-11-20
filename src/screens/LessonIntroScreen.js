import React from 'react';
import { Pressable, View } from 'react-native';
import { Screen, Title, Card, CardHeader, Button, Badge, Icon, T } from '../components/ui.js';
import { TUTOR_NAME } from '../data.js';
import { colors } from '../theme.js';

export default function LessonIntroScreen({ lesson, onStart, onBack }) {
  return (
    <Screen>
      <Pressable
        testID="back-button"
        onPress={onBack}
        accessibilityRole="button"
        style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingRight: 12, alignSelf: 'flex-start' }}
      >
        <Icon name="chevron-back" size={22} color={colors.primary} />
        <T v="bodyBold" color={colors.primary}>
          Kembali
        </T>
      </Pressable>

      <Title testID="intro-title" style={{ marginTop: 8, marginBottom: 12 }}>
        {lesson.title}
      </Title>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        <Badge testID="intro-duration" label={`Sekitar ${lesson.minutes} menit`} tone="surface" icon="time-outline" />
        <Badge label={`${lesson.steps.length} langkah`} tone="mint" icon="list-outline" />
      </View>

      <Card>
        <CardHeader icon="flag-outline" title="Tujuan belajar" subtitle={`Bersama ${TUTOR_NAME}`} />
        {lesson.objectives.map((o, i) => (
          <View key={o} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Icon name="checkmark-circle" size={20} color={colors.teal} />
            <T testID={`intro-objective-${i}`} style={{ flex: 1, marginLeft: 10 }}>
              {o}
            </T>
          </View>
        ))}
      </Card>

      <Card tone="surface">
        <T color={colors.muted}>
          {`${TUTOR_NAME} menemanimu berlatih dengan beberapa cara: memahami arti, menyusun kata, dan mengucapkan frasa. Kamu mendapat umpan balik setelah setiap jawaban.`}
        </T>
      </Card>

      <Button testID="intro-start" label="Mulai Pelajaran" iconRight="arrow-forward" onPress={onStart} />
    </Screen>
  );
}
