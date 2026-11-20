import React from 'react';
import { Redirect, router } from 'expo-router';
import TrainingScreen from '../screens/TrainingScreen.js';
import { buildLearningPath } from '../domain/learningPath.js';
import { useTuturin } from '../providers/TuturinProvider.js';

export default function TrainingRoute() {
  const { profile, preferences, lessons, progress, pathCompleted } = useTuturin();
  if (profile?.role === 'admin') return <Redirect href="/admin" />;
  if (!preferences) return <Redirect href="/onboarding" />;
  const learningPath = buildLearningPath(lessons, preferences.level, preferences.goal, pathCompleted);
  return <TrainingScreen
        lessons={learningPath}
        progress={progress}
        onOpenLesson={(id) => router.push({ pathname: '/lesson-intro/[id]', params: { id } })}
      />;
}
