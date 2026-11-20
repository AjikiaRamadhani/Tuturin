import React from 'react';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import LessonScreen from '../../screens/LessonScreen.js';
import { useTuturin } from '../../providers/TuturinProvider.js';

export default function LessonRoute() {
  const { id } = useLocalSearchParams();
  const { lessons, vocabulary, toggleVocabulary, finishLesson } = useTuturin();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const lesson = lessons.find((item) => item.id === lessonId);

  if (!lesson) return <Redirect href="/home" />;

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

