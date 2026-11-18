// Komponen UI kecil yang dipakai bersama oleh semua layar.

import React from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme.js';

const topPad = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56;

export function Screen({ children }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: topPad, paddingBottom: 48 }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

export function Title({ children, testID }) {
  return (
    <Text testID={testID} style={styles.title}>
      {children}
    </Text>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ label, onPress, testID, variant = 'primary', disabled = false }) {
  const secondary = variant === 'secondary';
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        secondary ? styles.buttonSecondary : styles.buttonPrimary,
        disabled && styles.buttonDisabled,
        pressed && !disabled && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.buttonText, secondary && { color: colors.primary }]}>{label}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress, testID }) {
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: '700', color: colors.primaryDark, marginBottom: 8 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  button: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 18, alignItems: 'center', marginTop: 10 },
  buttonPrimary: { backgroundColor: colors.primary },
  buttonSecondary: { backgroundColor: colors.card, borderWidth: 1.5, borderColor: colors.primary },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: { borderColor: colors.primary, backgroundColor: '#E3EBFA' },
  chipText: { fontSize: 15, color: colors.text },
  chipTextSelected: { color: colors.primaryDark, fontWeight: '700' },
});
