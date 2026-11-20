import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import StatusScreen from '../screens/StatusScreen.js';
import { useTuturin } from '../providers/TuturinProvider.js';

export default function StatusRoute() {
  const { kind } = useLocalSearchParams();
  const { signOut, retry } = useTuturin();
  const safeKind = ['config', 'deactivated', 'error'].includes(kind) ? kind : 'error';
  return <StatusScreen kind={safeKind} onSignOut={signOut} onRetry={retry} />;
}

