import React from 'react';
import { router } from 'expo-router';
import PlanScreen from '../screens/PlanScreen.js';
import { useTuturin } from '../providers/TuturinProvider.js';
import { lessonsForProfile } from '../domain/lessons.js';

export default function PlanRoute() {
  const { preferences, lessons } = useTuturin();
  const personalized = preferences ? lessonsForProfile(lessons, preferences.level, preferences.goal) : [];
  return <PlanScreen prefs={preferences} lessons={personalized} onContinue={() => router.replace('/home')} />;
}

