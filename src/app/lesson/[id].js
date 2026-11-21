import React from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import LessonScreen from '../../screens/LessonScreen.js';
import { useTuturin } from '../../providers/TuturinProvider.js';
import { canOpenPathLesson } from '../../domain/learningPath.js';

export default function LessonRoute() {
  const { id } = useLocalSearchParams();
  const { profile, preferences, lessons, pathCompleted, vocabulary, toggleVocabulary, finishLesson } = useTuturin();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const lesson = lessons.find((item) => item.id === lessonId);

  if (profile?.role === 'admin') return <Redirect href="/admin" />;
  if (!preferences) return <Redirect href="/onboarding" />;
  if (!lesson) return <Redirect href="/home" />;
  if (!canOpenPathLesson(lessons, preferences.level, preferences.goal, pathCompleted, lessonId)) {
    return <Redirect href="/training" />;
  }

  const complete = async (result) => {
    await finishLesson(lessonId, result);
    router.replace('/summary');
  };

  return (
    <LessonScreen
      key={lessonId}
      lesson={lesson}
      savedVocab={vocabulary}
      onToggleVocab={toggleVocabulary}
      onExit={() => router.replace('/home')}
      onFinish={complete}
    />
  );
}

