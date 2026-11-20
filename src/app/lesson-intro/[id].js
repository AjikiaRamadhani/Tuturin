import React from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import LessonIntroScreen from '../../screens/LessonIntroScreen.js';
import { useTuturin } from '../../providers/TuturinProvider.js';

export default function LessonIntroRoute() {
  const { id } = useLocalSearchParams();
  const { lessons } = useTuturin();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) return <Redirect href="/home" />;

  return (
    <LessonIntroScreen
      lesson={lesson}
      onBack={() => router.back()}
      onStart={() => router.push({ pathname: '/lesson/[id]', params: { id: lessonId } })}
    />
  );
}

