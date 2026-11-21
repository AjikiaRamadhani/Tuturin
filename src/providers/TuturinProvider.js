import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isConfigured } from '../../config.js';
import {
  activeStreak,
  completeLesson,
  dateKey,
  mastery as calculateMastery,
  nextStreak,
  normalizeProgress,
} from '../domain/logic.js';
import { services } from '../services/index.js';

const TuturinContext = createContext(null);

function hasPreferences(profile) {
  return Boolean(profile && profile.level && profile.goal && profile.target);
}

export function TuturinProvider({ children }) {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(() => !isConfigured());
  const [phase, setPhase] = useState(isConfigured() ? 'loading' : 'config');
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [lessonsSource, setLessonsSource] = useState('bundled');
  const [progress, setProgress] = useState(() => normalizeProgress(null, dateKey()));
  const [pathCompleted, setPathCompleted] = useState([]);
  const [streak, setStreak] = useState({ last: null, count: 0 });
  const [vocabulary, setVocabulary] = useState([]);
  const [syncWarning, setSyncWarning] = useState('');
  const [result, setResult] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const user = session?.user || null;
  const userId = user?.id;
  const savedAvatarPath = profile?.avatar_path;
  const today = dateKey();

  useEffect(() => {
    if (!isConfigured()) {
      return undefined;
    }

    let mounted = true;
    const unsubscribe = services.auth.subscribe((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setAuthReady(true);
      setPhase(nextSession ? 'loading' : 'signedOut');
      setSyncWarning('');
      if (!nextSession) {
        setProfile(null);
        setLessons([]);
        setProgress(normalizeProgress(null, dateKey()));
        setPathCompleted([]);
        setStreak({ last: null, count: 0 });
        setVocabulary([]);
        setResult(null);
        setPhase('signedOut');
      }
    });

    services.auth.getSession()
      .then(({ session: currentSession }) => {
        if (!mounted) return;
        setSession(currentSession);
        setAuthReady(true);
        setPhase(currentSession ? 'loading' : 'signedOut');
      })
      .catch((error) => {
        if (!mounted) return;
        setSyncWarning(error.message);
        setAuthReady(true);
        setPhase('error');
      });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authReady || !isConfigured()) return undefined;

    if (!userId) return undefined;

    let mounted = true;

    (async () => {
      try {
        const nextProfile = await services.profiles.findById(userId);
        if (!nextProfile) throw new Error('Profil akun tidak ditemukan.');
        if (!mounted) return;
        setProfile(nextProfile);

        if (!nextProfile.active) {
          setPhase('deactivated');
          return;
        }

        const [lessonData, completedIds, pathCompletedIds, nextStreakValue, nextVocabulary] = await Promise.all([
          services.lessons.listPublished(),
          services.progress.listCompleted(userId, today),
          services.progress.listAllCompleted(userId),
          services.progress.getStreak(userId),
          services.vocabulary.list(userId),
        ]);
        if (!mounted) return;

        setLessons(lessonData.lessons);
        setLessonsSource(lessonData.source);
        setProgress({ date: today, completed: completedIds });
        setPathCompleted(pathCompletedIds);
        setStreak(nextStreakValue);
        setVocabulary(nextVocabulary);
        if (lessonData.warning) setSyncWarning('Server belum terhubung. Pelajaran dari salinan lokal ditampilkan.');
        setPhase(nextProfile.role === 'admin' || hasPreferences(nextProfile) ? 'ready' : 'onboarding');
      } catch (error) {
        if (!mounted) return;
        setSyncWarning(error.message);
        setPhase('error');
      }
    })();

    return () => {
      mounted = false;
    };
  }, [authReady, userId, reloadToken, today]);

  const retry = useCallback(() => {
    if (!isConfigured()) {
      setPhase('config');
      return;
    }
    setPhase(userId ? 'loading' : 'signedOut');
    setSyncWarning('');
    setReloadToken((value) => value + 1);
  }, [userId]);

  const signIn = useCallback((email, password) => services.auth.signIn(email, password), []);
  const signUp = useCallback((email, password, name) => services.auth.signUp(email, password, name), []);
  const resetPassword = useCallback((email) => services.auth.resetPassword(email), []);
  const signOut = useCallback(() => services.auth.signOut(), []);
  const deleteAccount = useCallback(async () => {
    if (user && savedAvatarPath) {
      try {
        await services.profiles.removeAvatar(user.id, savedAvatarPath);
      } catch {
        // Account deletion should not be blocked by stale avatar storage.
      }
    }
    await services.auth.deleteAccount();
  }, [user, savedAvatarPath]);

  const savePreferences = useCallback(async (preferences) => {
    if (!user) throw new Error('Sesi akun berakhir. Silakan masuk kembali.');
    await services.profiles.savePreferences(user.id, preferences);
    setProfile((current) => ({ ...current, ...preferences }));
    setPhase('ready');
    setSyncWarning('');
  }, [user]);

  const updateAvatar = useCallback(async (asset) => {
    if (!user) throw new Error('Sesi akun berakhir. Silakan masuk kembali.');
    const avatar = await services.profiles.saveAvatar(user.id, asset, savedAvatarPath);
    setProfile((current) => ({ ...current, avatar_path: avatar.path, avatar_url: avatar.url }));
    return avatar.url;
  }, [user, savedAvatarPath]);

  const removeAvatar = useCallback(async () => {
    if (!user) throw new Error('Sesi akun berakhir. Silakan masuk kembali.');
    if (!savedAvatarPath) return;
    const result = await services.profiles.removeAvatar(user.id, savedAvatarPath);
    setProfile((current) => ({ ...current, avatar_path: null, avatar_url: null }));
    setSyncWarning(result?.cleanupWarning || '');
    return result;
  }, [user, savedAvatarPath]);

  const finishLesson = useCallback(async (lessonId, lessonResult) => {
    if (!user) throw new Error('Sesi akun berakhir. Silakan masuk kembali.');
    const completedToday = normalizeProgress(progress, today);
    const nextProgressValue = completeLesson(completedToday, lessonId, today);
    const nextStreakValue = nextStreak(streak, today);
    const score = calculateMastery(lessonResult.bests);
    const elapsed = lessonResult.seconds || 0;

    setProgress(nextProgressValue);
    setPathCompleted((current) => [...new Set([...current, lessonId])]);
    setStreak(nextStreakValue);
    setResult({ ...lessonResult, lessonId });
    setSyncWarning('');

    try {
      await services.progress.saveLessonResult(user.id, lessonId, today, score, elapsed);
      await services.progress.saveStreak(user.id, nextStreakValue);
    } catch {
      setSyncWarning('Pelajaran selesai, tetapi progres belum tersinkron ke server. Periksa koneksi lalu coba lagi.');
    }
  }, [user, progress, streak, today]);

  const toggleVocabulary = useCallback(async (phrase) => {
    if (!user) return;
    const exists = vocabulary.some((item) => item.en === phrase.en);
    const nextVocabulary = exists
      ? vocabulary.filter((item) => item.en !== phrase.en)
      : [...vocabulary, { en: phrase.en, id: phrase.id }];

    setVocabulary(nextVocabulary);
    setSyncWarning('');
    try {
      if (exists) await services.vocabulary.remove(user.id, phrase);
      else await services.vocabulary.save(user.id, phrase);
    } catch {
      setVocabulary(vocabulary);
      setSyncWarning('Perubahan kosakata belum tersimpan. Periksa koneksi lalu coba lagi.');
    }
  }, [user, vocabulary]);

  const value = useMemo(() => ({
    phase,
    session,
    user,
    profile,
    preferences: hasPreferences(profile)
      ? { level: profile.level, goal: profile.goal, target: profile.target }
      : null,
    lessons,
    lessonsSource,
    progress: normalizeProgress(progress, today),
    pathCompleted,
    streak: activeStreak(streak, today),
    vocabulary,
    syncWarning,
    result,
    setResult,
    retry,
    signIn,
    signUp,
    resetPassword,
    signOut,
    deleteAccount,
    savePreferences,
    updateAvatar,
    removeAvatar,
    finishLesson,
    toggleVocabulary,
  }), [
    phase, session, user, profile, lessons, lessonsSource, progress, streak, today,
    pathCompleted, vocabulary, syncWarning, result, retry, signIn, signUp, resetPassword, signOut,
    deleteAccount, savePreferences, updateAvatar, removeAvatar, finishLesson, toggleVocabulary,
  ]);

  return <TuturinContext.Provider value={value}>{children}</TuturinContext.Provider>;
}

export function useTuturin() {
  const context = useContext(TuturinContext);
  if (!context) throw new Error('useTuturin harus digunakan di dalam TuturinProvider.');
  return context;
}

