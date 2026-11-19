import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as PlusJakarta from '@expo-google-fonts/plus-jakarta-sans';
import { colors } from './theme.js';
import { loadJSON, saveJSON } from './storage.js';
import {
  lessonsFor, getLesson, dateKey, normalizePrefs, normalizeProgress, completeLesson,
  nextStreak, activeStreak, toggleVocab,
} from './logic.js';
import OnboardingScreen from './OnboardingScreen.js';
import PlanScreen from './PlanScreen.js';
import HomeScreen from './HomeScreen.js';
import LessonIntroScreen from './LessonIntroScreen.js';
import LessonScreen from './LessonScreen.js';
import SummaryScreen from './SummaryScreen.js';
import VocabScreen from './VocabScreen.js';

const PREFS_KEY = 'tuturin:prefs';
const PROGRESS_KEY = 'tuturin:progress';
const STREAK_KEY = 'tuturin:streak';
const VOCAB_KEY = 'tuturin:vocab';

// Hanya bobot yang dipakai. Nama yang tidak ada di paket dilewati supaya
// aplikasi tidak error (font bawaan Android dipakai sebagai cadangan).
const FONT_MAP = {};
[
  'PlusJakartaSans_400Regular',
  'PlusJakartaSans_500Medium',
  'PlusJakartaSans_600SemiBold',
  'PlusJakartaSans_700Bold',
  'PlusJakartaSans_800ExtraBold',
].forEach((name) => {
  if (PlusJakarta[name]) FONT_MAP[name] = PlusJakarta[name];
});

export default function App() {
  const [fontsLoaded, fontError] = useFonts(FONT_MAP);
  const fontsReady = fontsLoaded || !!fontError;

  // loading | onboarding | plan | home | intro | lesson | summary | vocab
  const [screen, setScreen] = useState('loading');
  const [prefs, setPrefs] = useState(null);
  const [progress, setProgress] = useState(normalizeProgress(null, dateKey()));
  const [streak, setStreak] = useState({ last: null, count: 0 });
  const [vocab, setVocab] = useState([]);
  const [lessonId, setLessonId] = useState(null);
  const [lessonRun, setLessonRun] = useState(0); // naik tiap pelajaran dimulai, agar state layar bersih
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      const savedPrefs = normalizePrefs(await loadJSON(PREFS_KEY));
      const today = dateKey();
      setProgress(normalizeProgress(await loadJSON(PROGRESS_KEY), today));
      const savedStreak = await loadJSON(STREAK_KEY);
      if (savedStreak && typeof savedStreak.count === 'number') setStreak(savedStreak);
      const savedVocab = await loadJSON(VOCAB_KEY);
      if (Array.isArray(savedVocab)) setVocab(savedVocab);
      if (savedPrefs) {
        setPrefs(savedPrefs);
        setScreen('home');
      } else {
        setScreen('onboarding');
      }
    })();
  }, []);

  const firstTime = !prefs;
  const savePrefs = async (next) => {
    const wasFirst = firstTime;
    setPrefs(next);
    await saveJSON(PREFS_KEY, next);
    setScreen(wasFirst ? 'plan' : 'home');
  };

  const changeVocab = async (item) => {
    const next = toggleVocab(vocab, item);
    setVocab(next);
    await saveJSON(VOCAB_KEY, next);
  };

  const deleteVocab = async (item) => {
    const next = vocab.filter((v) => v.en !== item.en);
    setVocab(next);
    await saveJSON(VOCAB_KEY, next);
  };

  const openLesson = (id) => {
    setLessonId(id);
    setScreen('intro');
  };

  const finishLesson = async (res) => {
    const today = dateKey();
    const nextProgress = completeLesson(progress, lessonId, today);
    const nextStr = nextStreak(streak, today);
    setProgress(nextProgress);
    setStreak(nextStr);
    setResult(res);
    await saveJSON(PROGRESS_KEY, nextProgress);
    await saveJSON(STREAK_KEY, nextStr);
    setScreen('summary');
  };

  const today = dateKey();
  const lesson = lessonId ? getLesson(lessonId) : null;
  const lessons = prefs ? lessonsFor(prefs.level, prefs.goal) : [];
  // Progres dari hari kemarin dianggap kosong tanpa perlu menunggu aplikasi dibuka ulang.
  const todayProgress = normalizeProgress(progress, today);

  let content = null;
  if (screen === 'loading' || !fontsReady) {
    content = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  } else if (screen === 'onboarding') {
    content = <OnboardingScreen initial={prefs} onSave={savePrefs} onCancel={() => setScreen('home')} />;
  } else if (screen === 'plan') {
    content = <PlanScreen prefs={prefs} lessons={lessons} onContinue={() => setScreen('home')} />;
  } else if (screen === 'home') {
    content = (
      <HomeScreen
        prefs={prefs}
        progress={todayProgress}
        lessons={lessons}
        streak={activeStreak(streak, today)}
        vocabCount={vocab.length}
        targetReached={todayProgress.completed.length >= prefs.target}
        onOpenLesson={openLesson}
        onChangeTarget={() => setScreen('onboarding')}
        onOpenVocab={() => setScreen('vocab')}
      />
    );
  } else if (screen === 'intro' && lesson) {
    content = (
      <LessonIntroScreen
        lesson={lesson}
        onBack={() => setScreen('home')}
        onStart={() => {
          setLessonRun((n) => n + 1);
          setScreen('lesson');
        }}
      />
    );
  } else if (screen === 'lesson' && lesson) {
    content = (
      <LessonScreen
        key={`${lesson.id}-${lessonRun}`}
        lesson={lesson}
        savedVocab={vocab}
        onToggleVocab={changeVocab}
        onExit={() => setScreen('home')}
        onFinish={finishLesson}
      />
    );
  } else if (screen === 'summary' && lesson && result) {
    content = (
      <SummaryScreen
        lesson={lesson}
        result={result}
        streak={activeStreak(streak, today)}
        savedVocab={vocab}
        onToggleVocab={changeVocab}
        onHome={() => setScreen('home')}
      />
    );
  } else if (screen === 'vocab') {
    content = <VocabScreen items={vocab} onDelete={deleteVocab} onBack={() => setScreen('home')} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      {content}
    </View>
  );
}
