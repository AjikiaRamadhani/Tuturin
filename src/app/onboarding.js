import React, { useState } from 'react';
import { router } from 'expo-router';
import OnboardingScreen from '../screens/OnboardingScreen.js';
import { useTuturin } from '../providers/TuturinProvider.js';

export default function OnboardingRoute() {
  const { preferences, savePreferences } = useTuturin();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async (next) => {
    setError('');
    setSaving(true);
    try {
      await savePreferences(next);
      router.replace(preferences ? '/home' : '/plan');
    } catch (e) {
      setError(e.message || 'Pengaturan belum tersimpan. Coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingScreen
      initial={preferences}
      onSave={save}
      onCancel={() => router.back()}
      saveError={error}
      saving={saving}
    />
  );
}

