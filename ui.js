// Komponen UI bersama. Semua pemakaian ikon lewat <Icon /> di file ini,
// jadi kalau paket ikon perlu diganti, cukup ubah satu tempat.

import React from 'react';
import { Platform, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, type } from './theme.js';

const topPad = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56;

// ---------- Dasar ----------

export function Icon({ name, size = 20, color = colors.text }) {
  return <Ionicons name={name} size={size} color={color} />;
}

// Teks dengan gaya dari theme.type
export function T({ v = 'body', color = colors.text, style, children, ...rest }) {
  return (
    <Text {...rest} style={[type[v], { color }, style]}>
      {children}
    </Text>
  );
}

export function Screen({ children }) {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: topPad, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

export function Title({ children, testID, style }) {
  return (
    <T v="h1" testID={testID} style={style}>
      {children}
    </T>
  );
}

export function Brand() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={styles.brandMark}>
        <Icon name="mic" size={18} color="#FFFFFF" />
      </View>
      <T v="h3" color={colors.primary} style={{ marginLeft: 10 }}>
        Tuturin
      </T>
    </View>
  );
}

// ---------- Kartu ----------

const CARD_TONES = {
  default: { bg: colors.card, border: colors.border },
  teal: { bg: colors.teal, border: colors.teal },
  tealSoft: { bg: colors.tealSoft, border: 'rgba(22,106,91,0.15)' },
  coral: { bg: colors.coralDeep, border: colors.coralDeep },
  coralSoft: { bg: colors.coralSoft, border: 'rgba(204,69,88,0.15)' },
  yellowSoft: { bg: colors.yellowSoft, border: 'rgba(245,179,53,0.35)' },
  surface: { bg: colors.surface, border: colors.border },
};

export function Card({ children, tone = 'default', style }) {
  const t = CARD_TONES[tone] || CARD_TONES.default;
  return (
    <View style={[styles.card, { backgroundColor: t.bg, borderColor: t.border }, style]}>
      {children}
    </View>
  );
}

// Kepala kartu: ikon dalam lingkaran + judul + subjudul
export function CardHeader({ icon, title, subtitle, right }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
      <View style={styles.iconCircle}>
        <Icon name={icon} size={20} color={colors.teal} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <T v="h3">{title}</T>
        {subtitle ? (
          <T v="caption" color={colors.muted} style={{ marginTop: 2 }}>
            {subtitle}
          </T>
        ) : null}
      </View>
      {right || null}
    </View>
  );
}

// ---------- Tombol ----------

const BUTTONS = {
  primary: { bg: colors.primary, border: colors.primary, ledge: 4, ledgeColor: colors.primaryLedge, text: '#FFFFFF' },
  light: { bg: '#FFFFFF', border: '#FFFFFF', ledge: 4, ledgeColor: '#E8C4C9', text: colors.primary },
  secondary: { bg: colors.tealSoft, border: 'rgba(22,106,91,0.25)', ledge: 1.5, ledgeColor: 'rgba(22,106,91,0.25)', text: colors.teal },
  ghost: { bg: 'transparent', border: 'transparent', ledge: 1.5, ledgeColor: 'transparent', text: colors.ink },
};

export function Button({ label, onPress, testID, variant = 'primary', disabled = false, icon, iconRight }) {
  const v = BUTTONS[variant] || BUTTONS.primary;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => {
        const down = pressed && !disabled && v.ledge > 2;
        return [
          styles.button,
          {
            backgroundColor: v.bg,
            borderColor: v.border,
            borderBottomColor: v.ledgeColor,
            borderBottomWidth: down ? v.ledge - 2 : v.ledge,
            marginTop: down ? 2 : 0,
            opacity: disabled ? 0.45 : pressed && v.ledge <= 2 ? 0.8 : 1,
          },
        ];
      }}
    >
      {icon ? <Icon name={icon} size={20} color={v.text} /> : null}
      <T v="bodyBold" color={v.text} style={{ marginHorizontal: 8 }}>
        {label}
      </T>
      {iconRight ? <Icon name={iconRight} size={20} color={v.text} /> : null}
    </Pressable>
  );
}

// ---------- Chip pilihan ----------

export function Chip({ label, selected, onPress, testID, icon }) {
  const fg = selected ? '#FFFFFF' : colors.ink;
  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={[
        styles.chip,
        selected
          ? { backgroundColor: colors.teal, borderColor: colors.teal }
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {selected ? (
        <Icon name="checkmark-circle" size={18} color={fg} />
      ) : icon ? (
        <Icon name={icon} size={18} color={colors.muted} />
      ) : null}
      <T v="label" color={fg} style={{ marginLeft: selected || icon ? 8 : 0, fontSize: 15 }}>
        {label}
      </T>
    </Pressable>
  );
}

// ---------- Lencana, bilah progres ----------

const BADGES = {
  mint: { bg: colors.mint, fg: colors.onMint },
  yellow: { bg: '#FFDEAC', fg: colors.onYellow },
  coral: { bg: colors.coralSoft, fg: colors.primary },
  surface: { bg: colors.surfaceHigh, fg: colors.ink },
  white: { bg: 'rgba(255,255,255,0.2)', fg: '#FFFFFF' },
};

export function Badge({ label, tone = 'surface', icon, testID }) {
  const b = BADGES[tone] || BADGES.surface;
  return (
    <View style={[styles.badge, { backgroundColor: b.bg }]}>
      {icon ? <Icon name={icon} size={14} color={b.fg} /> : null}
      <T v="caption" testID={testID} color={b.fg} style={{ marginLeft: icon ? 6 : 0 }}>
        {label}
      </T>
    </View>
  );
}

export function ProgressBar({ value, testID }) {
  const pct = Math.max(0, Math.min(1, value || 0));
  return (
    <View testID={testID} style={styles.track}>
      <View style={[styles.fill, { width: `${Math.round(pct * 100)}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.coral,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 28,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    minHeight: 56,
    borderRadius: 999,
    borderWidth: 1.5,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    minHeight: 44,
    borderRadius: 999,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  track: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.surfaceHigh,
    overflow: 'hidden',
  },
  fill: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.teal,
  },
});
