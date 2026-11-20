import React from 'react';
import { Redirect, router } from 'expo-router';
import AdminScreen from '../screens/AdminScreen.js';
import { services } from '../services/index.js';
import { useTuturin } from '../providers/TuturinProvider.js';

export default function AdminRoute() {
  const { phase, profile, signOut } = useTuturin();
  if (phase !== 'ready' || profile?.role !== 'admin') return <Redirect href="/home" />;
  return <AdminScreen
    profile={profile}
    lessonsApi={services.lessons}
    usersApi={services.profiles}
    onSignOut={signOut}
    onOpenAccount={() => router.push('/account')}
  />;
}
