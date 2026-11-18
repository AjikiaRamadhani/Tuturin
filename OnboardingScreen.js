import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Screen, Title, Card, Button, Chip } from './ui.js';
import { LEVELS, GOALS, TARGETS } from './data.js';
import { colors } from './theme.js';

export default function OnboardingScreen({ initial, onSave, onCancel }) {
  const [level, setLevel] = useState(initial ? initial.level : null);
  const [goal, setGoal] = useState(initial ? initial.goal : null);
  const [target, setTarget] = useState(initial ? initial.target : null);

  const complete = level && goal && target;
  const editing = !!initial;

  return (
    <Screen>
      <Title testID="onboarding-title">
        {editing ? 'Ubah target belajar' : 'Selamat datang di Tuturin'}
      </Title>
      <Text style={{ color: colors.muted, marginBottom: 16 }}>
        Atur dulu level dan tujuanmu supaya latihan berbicara bahasa Inggris sesuai kebutuhan.
      </Text>

      <Card>
        <Text style={{ fontWeight: '700', marginBottom: 10 }}>Level bahasa Inggris</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
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
        <Text style={{ fontWeight: '700', marginBottom: 10 }}>Tujuan belajar</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {GOALS.map((g) => (
            <Chip
              key={g.id}
              testID={`goal-${g.id}`}
              label={g.label}
              selected={goal === g.id}
              onPress={() => setGoal(g.id)}
            />
          ))}
        </View>
      </Card>

      <Card>
        <Text style={{ fontWeight: '700', marginBottom: 10 }}>Target latihan per hari</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {TARGETS.map((n) => (
            <Chip
              key={n}
              testID={`target-${n}`}
              label={`${n} kalimat`}
              selected={target === n}
              onPress={() => setTarget(n)}
            />
          ))}
        </View>
      </Card>

      <Button
        testID="onboarding-start"
        label={editing ? 'Simpan' : 'Mulai'}
        disabled={!complete}
        onPress={() => onSave({ level, goal, target })}
      />
      {editing && (
        <Button testID="onboarding-cancel" label="Batal" variant="secondary" onPress={onCancel} />
      )}
    </Screen>
  );
}
