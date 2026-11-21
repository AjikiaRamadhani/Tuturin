import React from 'react';
import { Redirect, router } from 'expo-router';
import AccountScreen from '../screens/account/AccountScreen.js';
import { useTuturin } from '../providers/TuturinProvider.js';

export default function AccountRoute() {
  const { profile, preferences, progress, streak, vocabulary, signOut, deleteAccount, updateAvatar, removeAvatar } = useTuturin();
  if (!profile) return <Redirect href="/home" />;
  return <AccountScreen
        profile={profile}
        preferences={preferences}
        progress={progress}
        streak={streak}
        vocabCount={vocabulary.length}
        onBack={() => router.back()}
        onEditPreferences={!profile.role || profile.role === 'learner' ? () => router.push('/onboarding') : undefined}
        onSignOut={signOut}
        onDeleteAccount={deleteAccount}
        onUpdateAvatar={updateAvatar}
        onRemoveAvatar={removeAvatar}
        hasBottomNav={profile.role === 'learner'}
      />;
}
