import React from 'react';
import { Pressable } from 'react-native';
import { Screen, Title, Card, Button, Icon, T } from '../components/ui.js';
import { colors } from '../theme.js';

export default function VocabScreen({ items, onDelete, onBack }) {
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
      <Title testID="vocab-title" style={{ marginTop: 8, marginBottom: 16 }}>
        Kosakata Tersimpan
      </Title>

      {items.length === 0 ? (
        <Card tone="surface">
          <T testID="vocab-empty" color={colors.muted}>
            Belum ada frasa tersimpan. Simpan frasa dari pelajaran atau ringkasan pelajaran.
          </T>
        </Card>
      ) : (
        items.map((v, i) => (
          <Card key={v.en}>
            <T v="bodyBold" testID={`vocab-item-${i}-en`}>{v.en}</T>
            <T color={colors.muted} testID={`vocab-item-${i}-id`} style={{ marginTop: 2, marginBottom: 12 }}>
              {v.id}
            </T>
            <Button testID={`vocab-delete-${i}`} label="Hapus" icon="trash-outline" variant="secondary" onPress={() => onDelete(v)} />
          </Card>
        ))
      )}
    </Screen>
  );
}
