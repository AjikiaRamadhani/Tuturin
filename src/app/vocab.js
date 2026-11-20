import React from 'react';
import { router } from 'expo-router';
import VocabScreen from '../screens/VocabScreen.js';
import { useTuturin } from '../providers/TuturinProvider.js';

export default function VocabRoute() {
  const { vocabulary, toggleVocabulary } = useTuturin();
  return (
    <VocabScreen
      items={vocabulary}
      onDelete={toggleVocabulary}
      onBack={() => router.back()}
    />
  );
}

