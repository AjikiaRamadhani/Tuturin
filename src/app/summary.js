import React from 'react';
import { Redirect, router } from 'expo-router';
import SummaryScreen from '../screens/SummaryScreen.js';
import { useTuturin } from '../providers/TuturinProvider.js';

export default function SummaryRoute() {
  const { result, lessons, streak, vocabulary, toggleVocabulary } = useTuturin();
  const lessonId = result?.lessonId;
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!result || !lesson) return <Redirect href="/home" />;

  return (
    <SummaryScreen
      lesson={lesson}
      result={result}
      streak={streak}
      savedVocab={vocabulary}
      onToggleVocab={toggleVocabulary}
      onHome={() => router.replace('/home')}
    />
  );
}

