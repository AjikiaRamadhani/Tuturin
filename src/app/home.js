import React from 'react';
import { Redirect, router } from 'expo-router';
import HomeScreen from '../screens/HomeScreen.js';
import { useTuturin } from '../providers/TuturinProvider.js';
import { buildLearningPath } from '../domain/learningPath.js';

export default function HomeRoute() {
  const { profile, preferences, progress, pathCompleted, lessons, streak, vocabulary, syncWarning } = useTuturin();
  if (profile?.role === 'admin') return <Redirect href="/admin" />;
  if (!preferences) return <Redirect href="/onboarding" />;
  const learningPath = buildLearningPath(lessons, preferences.level, preferences.goal, pathCompleted);

  return <HomeScreen
      prefs={preferences}
      progress={progress}
      lessons={learningPath}
      streak={streak}
      vocabCount={vocabulary.length}
      targetReached={progress.completed.length >= preferences.target}
      syncWarning={syncWarning}
      onOpenLesson={(id) => router.push({ pathname: '/lesson-intro/[id]', params: { id } })}
      onChangeTarget={() => router.push('/onboarding')}
      onOpenVocab={() => router.push('/vocab')}
      onOpenAccount={() => router.push('/account')}
    />;
}

