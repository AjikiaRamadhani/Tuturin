import React, { useState } from 'react';
import { View } from 'react-native';
import { Screen, Title, Card, CardHeader, Button, Chip, Brand, Icon, T } from './ui.js';
import { LEVELS, GOALS, TARGETS } from './data.js';
import { colors } from './theme.js';

const GOAL_ICONS = {
  percakapan: 'chatbubble-ellipses-outline',
  karier: 'briefcase-outline',
  perjalanan: 'airplane-outline',
  ujian: 'school-outline',
};

const ROW = { flexDirection: 'row', flexWrap: 'wrap', gap: 8 };

export default function OnboardingScreen({ initial, onSave, onCancel }) {
  const [level, setLevel] = useState(initial ? initial.level : null);
  const [goal, setGoal] = useState(initial ? initial.goal : null);
  const [target, setTarget] = useState(initial ? initial.target : null);

  const complete = level && goal && target;
  const editing = !!initial;

  return (
    <Screen>
      <Brand />
      <Title testID="onboarding-title" style={{ marginTop: 20 }}>
        {editing ? 'Ubah target belajar' : 'Selamat datang di Tuturin'}
      </Title>
      <T color={colors.muted} style={{ marginTop: 8, marginBottom: 20 }}>
        Atur preferensi belajarmu. Nala, tutor kamu, akan menyiapkan pelajaran berbicara yang sesuai.
      </T>

      <Card>
        <CardHeader
          icon="bar-chart-outline"
          title="Level bahasa Inggris"
          subtitle="Pilih tingkat kemampuanmu saat ini"
        />
        <View style={ROW}>
          {LEVELS.map((l) => (
            <Chip
              key={l.id}
              testID={`level-${l.id}`}
              label={l.label}
              selected={level === l.id}
              onPress={() => setLevel(l.id)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <CardHeader icon="locate-outline" title="Tujuan belajar" subtitle="Apa fokus utama latihanmu?" />
        <View style={ROW}>
          {GOALS.map((g) => (
            <Chip
              key={g.id}
              testID={`goal-${g.id}`}
              label={g.label}
              icon={GOAL_ICONS[g.id]}
              selected={goal === g.id}
              onPress={() => setGoal(g.id)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <CardHeader icon="flag-outline" title="Target latihan per hari" subtitle="Berapa pelajaran yang ingin kamu selesaikan tiap hari?" />
        <View style={ROW}>
          {TARGETS.map((n) => (
            <Chip
              key={n}
              testID={`target-${n}`}
              label={`${n} pelajaran`}
              selected={target === n}
              onPress={() => setTarget(n)}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 16,
            padding: 12,
            borderRadius: 16,
            backgroundColor: colors.yellowSoft,
          }}
        >
          <Icon name="bulb-outline" size={20} color={colors.onYellow} />
          <T v="label" color={colors.onYellow} style={{ flex: 1, marginLeft: 10, fontSize: 13, lineHeight: 18 }}>
            Latihan singkat tiap hari lebih efektif daripada belajar lama sekali seminggu.
          </T>
        </View>
      </Card>

      <Button
        testID="onboarding-start"
        label={editing ? 'Simpan' : 'Mulai'}
        iconRight="arrow-forward"
        disabled={!complete}
        onPress={() => onSave({ level, goal, target })}
      />
      {editing && (
        <View style={{ marginTop: 12 }}>
          <Button testID="onboarding-cancel" label="Batal" variant="secondary" onPress={onCancel} />
        </View>
      )}
      <T v="caption" color={colors.muted} style={{ textAlign: 'center', marginTop: 16 }}>
        Preferensi bisa diganti kapan saja lewat tombol Ubah Target di beranda.
      </T>
    </Screen>
  );
}
