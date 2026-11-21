import React from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import LessonIntroScreen from '../../screens/LessonIntroScreen.js';
import { useTuturin } from '../../providers/TuturinProvider.js';
import { canOpenPathLesson } from '../../domain/learningPath.js';

export default function LessonIntroRoute() {
  const { id } = useLocalSearchParams();
  const { profile, preferences, lessons, pathCompleted } = useTuturin();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const lesson = lessons.find((item) => item.id === lessonId);
  if (profile?.role === 'admin') return <Redirect href="/admin" />;
  if (!preferences) return <Redirect href="/onboarding" />;
  if (!lesson) return <Redirect href="/home" />;
  if (!canOpenPathLesson(lessons, preferences.level, preferences.goal, pathCompleted, lessonId)) {
    return <Redirect href="/training" />;
  }

  return (
    <LessonIntroScreen
      lesson={lesson}
      onBack={() => router.back()}
      onStart={() => router.push({ pathname: '/lesson/[id]', params: { id: lessonId } })}
    />
  );
}

