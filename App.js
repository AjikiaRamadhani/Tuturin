import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './theme.js';
import { loadJSON, saveJSON } from './storage.js';
import { buildSession, evaluate } from './logic.js';
import OnboardingScreen from './OnboardingScreen.js';
import HomeScreen from './HomeScreen.js';
import PracticeScreen from './PracticeScreen.js';
import FeedbackScreen from './FeedbackScreen.js';

const PREFS_KEY = 'tuturin:prefs';
const PROGRESS_KEY = 'tuturin:progress';

function todayKey() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function freshProgress() {
  return { date: todayKey(), count: 0, scoreSum: 0 };
}

export default function App() {
  const [screen, setScreen] = useState('loading'); // loading | onboarding | home | practice | feedback
  const [prefs, setPrefs] = useState(null);
  const [progress, setProgress] = useState(freshProgress());
  // session: { sentences: string[], index: number, counted: boolean[] }
  const [session, setSession] = useState(null);
  const [attempt, setAttempt] = useState(null); // { transcript, result }

  useEffect(() => {
    (async () => {
      const savedPrefs = await loadJSON(PREFS_KEY);
      const savedProgress = await loadJSON(PROGRESS_KEY);
      setProgress(savedProgress && savedProgress.date === todayKey() ? savedProgress : freshProgress());
      if (savedPrefs) {
        setPrefs(savedPrefs);
        setScreen('home');
      } else {
        setScreen('onboarding');
      }
    })();
  }, []);

  const savePrefs = async (next) => {
    setPrefs(next);
    await saveJSON(PREFS_KEY, next);
    setScreen('home');
  };

  const startPractice = () => {
    const sentences = buildSession(prefs.level, prefs.goal, prefs.target);
    setSession({ sentences, index: 0, counted: sentences.map(() => false) });
    setScreen('practice');
  };

  const submitTranscript = async (transcript) => {
    const target = session.sentences[session.index];
    const result = evaluate(target, transcript);
    setAttempt({ transcript, result });

    // Hanya percobaan pertama tiap kalimat yang dihitung ke progres.
    if (!session.counted[session.index]) {
      const counted = session.counted.slice();
      counted[session.index] = true;
      setSession({ ...session, counted });

      const base = progress.date === todayKey() ? progress : freshProgress();
      const nextProgress = {
        date: base.date,
        count: base.count + 1,
        scoreSum: base.scoreSum + result.score,
      };
      setProgress(nextProgress);
      await saveJSON(PROGRESS_KEY, nextProgress);
    }
    setScreen('feedback');
  };

  const goNext = () => {
    if (session.index + 1 < session.sentences.length) {
      setSession({ ...session, index: session.index + 1 });
      setScreen('practice');
    } else {
      setScreen('home');
    }
  };

  let content = null;
  if (screen === 'loading') {
    content = (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  } else if (screen === 'onboarding') {
    content = (
      <OnboardingScreen
        initial={prefs}
        onSave={savePrefs}
        onCancel={() => setScreen('home')}
      />
    );
  } else if (screen === 'home') {
    content = (
      <HomeScreen
        prefs={prefs}
        progress={progress}
        onStart={startPractice}
        onChangeTarget={() => setScreen('onboarding')}
      />
    );
  } else if (screen === 'practice') {
    content = (
      <PracticeScreen
        sentence={session.sentences[session.index]}
        index={session.index}
        total={session.sentences.length}
        onSubmit={submitTranscript}
        onBack={() => setScreen('home')}
      />
    );
  } else if (screen === 'feedback') {
    content = (
      <FeedbackScreen
        sentence={session.sentences[session.index]}
        transcript={attempt.transcript}
        result={attempt.result}
        isLast={session.index + 1 >= session.sentences.length}
        onRetry={() => setScreen('practice')}
        onNext={goNext}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style="dark" />
      {content}
    </View>
  );
}
