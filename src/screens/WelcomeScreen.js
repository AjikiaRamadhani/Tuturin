import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, Platform } from 'react-native';
import { Screen, Brand, Button, T } from '../components/ui.js';
import { colors, fonts } from '../theme.js';

const useNativeDriver = Platform.OS !== 'web';

export default function WelcomeScreen({ onLogin, onRegister }) {
  const heroOpacity = useMemo(() => new Animated.Value(0), []);
  const heroLift = useMemo(() => new Animated.Value(22), []);
  const logoScale = useMemo(() => new Animated.Value(0.84), []);
  const copyOpacity = useMemo(() => new Animated.Value(0), []);
  const copyLift = useMemo(() => new Animated.Value(12), []);
  const actionsOpacity = useMemo(() => new Animated.Value(0), []);
  const actionsLift = useMemo(() => new Animated.Value(12), []);
  useEffect(() => {
    const hero = Animated.parallel([
      Animated.timing(heroOpacity, { toValue: 1, duration: 360, easing: Easing.out(Easing.cubic), useNativeDriver }),
      Animated.timing(heroLift, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver }),
      Animated.spring(logoScale, { toValue: 1, damping: 13, stiffness: 125, mass: 0.8, useNativeDriver }),
    ]);
    const copy = Animated.parallel([
      Animated.timing(copyOpacity, { toValue: 1, duration: 280, easing: Easing.out(Easing.ease), useNativeDriver }),
      Animated.timing(copyLift, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver }),
    ]);
    const actions = Animated.parallel([
      Animated.timing(actionsOpacity, { toValue: 1, duration: 280, easing: Easing.out(Easing.ease), useNativeDriver }),
      Animated.timing(actionsLift, { toValue: 0, duration: 320, easing: Easing.out(Easing.cubic), useNativeDriver }),
    ]);
    const entrance = Animated.sequence([
      hero,
      Animated.delay(60),
      copy,
      Animated.delay(40),
      actions,
    ]);
    entrance.start();
    return () => {
      entrance.stop();
    };
  }, [actionsOpacity, actionsLift, copyOpacity, copyLift, heroOpacity, heroLift, logoScale]);

  return (
    <Screen>
      <Brand />
      <Animated.View style={{ alignItems: 'center', marginTop: 54, opacity: heroOpacity, transform: [{ translateY: heroLift }] }}>
        <Animated.View style={{
          width: 164,
          height: 164,
          borderRadius: 42,
          backgroundColor: colors.coralSoft,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: logoScale }],
        }}>
          <Animated.Image
            source={require('../../assets/icon.png')}
            accessibilityLabel="Logo Tuturin"
            resizeMode="contain"
            style={{ width: 148, height: 148, borderRadius: 34 }}
          />
        </Animated.View>
        <Animated.View style={{ alignItems: 'center', opacity: copyOpacity, transform: [{ translateY: copyLift }] }}>
          <T v="caption" color={colors.teal} style={{ marginTop: 32, letterSpacing: 1.2 }}>LATIHAN BICARA BAHASA INGGRIS</T>
          <T style={{ fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 42, textAlign: 'center', marginTop: 10 }}>
            Sedikit demi sedikit, makin lancar.
          </T>
          <T color={colors.muted} style={{ textAlign: 'center', marginTop: 12, maxWidth: 340 }}>
            Latihan ngobrol singkat bareng Nala. Mulai dari levelmu, lalu kumpulkan progres setiap hari.
          </T>
        </Animated.View>
      </Animated.View>

      <Animated.View style={{ marginTop: 36, gap: 12, opacity: actionsOpacity, transform: [{ translateY: actionsLift }] }}>
        <Button testID="welcome-login" label="Masuk" iconRight="arrow-forward" onPress={onLogin} />
        <Button testID="welcome-register" label="Buat akun baru" variant="secondary" onPress={onRegister} />
      </Animated.View>
      <Animated.View style={{ opacity: actionsOpacity }}>
        <T v="caption" color={colors.muted} style={{ textAlign: 'center', marginTop: 18 }}>
          Akun pelajar dan admin masuk dari sini.
        </T>
      </Animated.View>
    </Screen>
  );
}
