import React from 'react';
import { Redirect } from 'expo-router';
import { useTuturin } from '../providers/TuturinProvider.js';

export default function IndexRoute() {
  const { phase, profile, preferences } = useTuturin();
  if (phase === 'config' || phase === 'error' || phase === 'deactivated') {
    return <Redirect href={`/status?kind=${phase}`} />;
  }
  if (phase === 'onboarding') return <Redirect href="/onboarding" />;
  if (phase === 'signedOut') return <Redirect href="/welcome" />;
  if (profile?.role === 'admin') return <Redirect href="/admin" />;
  if (!preferences) return <Redirect href="/onboarding" />;
  return <Redirect href="/home" />;
}

