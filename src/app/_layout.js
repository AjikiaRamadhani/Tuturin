import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { TuturinProvider, useTuturin } from '../providers/TuturinProvider.js';
import { colors } from '../theme.js';
import BottomNav from '../components/BottomNav.js';

function RouteGate() {
  const { phase, profile } = useTuturin();
  const router = useRouter();
  const segments = useSegments();
  const params = useLocalSearchParams();
  const route = segments[0] || 'index';
  const statusKind = Array.isArray(params.kind) ? params.kind[0] : params.kind;

  useEffect(() => {
    if (phase === 'config' && route !== 'index' && route !== 'status') {
      router.replace('/status?kind=config');
      return;
    }
    if (phase === 'config' && route === 'status' && statusKind !== 'config') {
      router.replace('/status?kind=config');
      return;
    }
    if (phase === 'signedOut' && !['index', 'welcome', 'auth', 'auth-callback'].includes(route)) {
      router.replace('/welcome');
      return;
    }
    if ((phase === 'deactivated' || phase === 'error') && route !== 'index' && route !== 'status') {
      router.replace(`/status?kind=${phase}`);
      return;
    }
    if ((phase === 'deactivated' || phase === 'error') && route === 'status' && statusKind !== phase) {
      router.replace(`/status?kind=${phase}`);
      return;
    }
    if (phase === 'onboarding' && route !== 'index' && route !== 'onboarding') {
      router.replace('/onboarding');
      return;
    }
    if (phase === 'ready' && profile?.role === 'admin' && !['index', 'admin', 'account', 'auth-callback', 'set-password'].includes(route)) {
      router.replace('/admin');
      return;
    }
    if (phase === 'ready' && profile?.role !== 'admin' && route === 'admin') {
      router.replace('/home');
      return;
    }
    if (phase === 'ready' && (route === 'welcome' || route === 'auth' || route === 'status')) {
      router.replace('/home');
    }
  }, [phase, profile?.role, route, router, statusKind]);

  if (phase === 'loading' && route !== 'auth-callback') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const showBottomNav = phase === 'ready'
    && profile?.role !== 'admin'
    && ['home', 'training', 'account'].includes(route);
  const activeTab = route === 'account' ? 'profile' : route;

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      animationDuration: 420,
      animationTypeForReplace: 'push',
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="status" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="plan" />
      <Stack.Screen name="home" options={{ animation: 'none' }} />
      <Stack.Screen name="training" options={{ animation: 'none' }} />
      <Stack.Screen name="lesson-intro/[id]" />
      <Stack.Screen name="lesson/[id]" />
      <Stack.Screen name="summary" />
      <Stack.Screen name="vocab" />
      <Stack.Screen name="account" options={{ animation: 'none' }} />
      <Stack.Screen name="admin" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="auth-callback" />
      <Stack.Screen name="set-password" />
      </Stack>
      {showBottomNav ? <BottomNav active={activeTab} /> : null}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <TuturinProvider>
        <RouteGate />
      </TuturinProvider>
    </SafeAreaProvider>
  );
}

