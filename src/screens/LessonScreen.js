import React, { useEffect, useRef, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { Screen, Card, CardHeader, Button, Badge, ProgressBar, Icon, T } from '../components/ui.js';
import { startListening, isSpeechAvailable } from '../services/speechRecognition.js';
import { TUTOR_NAME } from '../data.js';
import { evaluate, nalaReply, nalaIntro, hintFor, normalizeText } from '../domain/logic.js';
import { colors, fonts } from '../theme.js';

function messageForError(code) {
  switch (code) {
    case 'unavailable':
      return 'Input suara tidak tersedia di sini (misalnya di Expo Go). Gunakan Mode Simulasi di bawah.';
    case 'not-allowed':
      return 'Izin mikrofon ditolak. Aktifkan izin di pengaturan, atau gunakan Mode Simulasi di bawah.';
    case 'no-speech':
      return 'Suara tidak terdeteksi. Coba lagi.';
    case 'network':
      return 'Pengenalan suara butuh koneksi internet. Periksa koneksi, atau gunakan Mode Simulasi.';
    default:
      return 'Terjadi masalah pada input suara. Coba lagi atau gunakan Mode Simulasi.';
  }
}

function labelForScore(score) {
  if (score >= 90) return 'Transkrip sangat cocok.';
  if (score >= 60) return 'Transkrip cukup cocok.';
  return 'Coba cocokkan transkripnya lagi.';
}

function ringColor(score) {
  if (score >= 90) return colors.teal;
  if (score >= 60) return colors.yellow;
  return colors.coral;
}

function Stat({ label, value, testID, bg, fg }) {
  return (
    <View style={{ flex: 1, backgroundColor: bg, borderRadius: 20, paddingVertical: 12, paddingHorizontal: 8, alignItems: 'center' }}>
      <T v="h2" testID={testID} color={fg}>
        {value}
      </T>
      <T v="caption" color={fg} style={{ marginTop: 2, textAlign: 'center' }}>
        {label}
      </T>
    </View>
  );
}

function NalaBubble({ text, testID }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.coral,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <T v="label" color="#FFFFFF">
          N
        </T>
      </View>
      <View style={{ flex: 1, marginLeft: 10, backgroundColor: colors.surface, borderRadius: 20, padding: 14 }}>
        <T v="caption" color={colors.muted} style={{ marginBottom: 2 }}>
          {TUTOR_NAME.toUpperCase()}
        </T>
        <T testID={testID}>{text}</T>
      </View>
    </View>
  );
}

function UserBubble({ text, score, exerciseType, testID }) {
  return (
    <View style={{ alignItems: 'flex-end', marginBottom: 10 }}>
      <View style={{ maxWidth: '85%', backgroundColor: colors.teal, borderRadius: 20, padding: 14 }}>
        <T testID={testID} color="#FFFFFF">
          {text}
        </T>
        <T v="caption" color="rgba(255,255,255,0.85)" style={{ marginTop: 4 }}>
          {exerciseType === 'speak' ? `Kecocokan transkrip ${score}%` : score === 100 ? 'Jawaban benar' : 'Belum tepat'}
        </T>
      </View>
    </View>
  );
}

function exerciseTypeFor(index) {
  if (index % 6 === 1) return 'choose';
  if (index % 6 === 3) return 'order';
  return 'speak';
}

function promptForStep(step, index, total) {
  const type = exerciseTypeFor(index);
  if (type === 'choose') return `Langkah ${index + 1} dari ${total}. Pilih kalimat bahasa Inggris yang sesuai dengan arti: “${step.id}”`;
  if (type === 'order') return `Langkah ${index + 1} dari ${total}. Susun kata-kata untuk membentuk kalimat yang berarti: “${step.id}”`;
  return nalaIntro(step, index, total);
}

function choiceOptions(steps, index, answer) {
  const alternatives = [...new Set(steps.map((item) => item.en).filter((phrase) => phrase !== answer))];
  const distractors = Array.from({ length: Math.min(3, alternatives.length) }, (_, offset) => alternatives[(index + offset) % alternatives.length]);
  const options = [answer, ...distractors];
  const shift = index % options.length;
  return [...options.slice(shift), ...options.slice(0, shift)];
}

function wordTiles(sentence, index) {
  const words = sentence.split(/\s+/).map((word, id) => ({ id, word }));
  const shift = words.length ? (index + 2) % words.length : 0;
  return [...words.slice(shift), ...words.slice(0, shift)].reverse();
}

function ActivityPanel({ type, options, selectedOption, onSelect, tiles, arranged, onAddWord, onUndoWord, onCheck, canCheck }) {
  return (
    <Card>
      <CardHeader
        icon={type === 'choose' ? 'checkmark-circle-outline' : 'reorder-two-outline'}
        title={type === 'choose' ? 'Pilih jawaban' : 'Susun kalimat'}
        subtitle={type === 'choose' ? 'Pilih kalimat Inggris yang artinya paling sesuai.' : 'Ketuk kata sesuai urutannya.'}
      />
      {type === 'choose' ? options.map((option, index) => (
        <Pressable
          key={option}
          testID={`choice-option-${index}`}
          onPress={() => onSelect(option)}
          accessibilityRole="button"
          accessibilityState={{ selected: selectedOption === option }}
          style={{
            padding: 14,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: selectedOption === option ? colors.primary : colors.border,
            backgroundColor: selectedOption === option ? colors.coralSoft : colors.surface,
            marginBottom: 8,
          }}
        >
          <T v="bodyBold">{option}</T>
        </Pressable>
      )) : (
        <>
          <View style={{ minHeight: 58, flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 10, borderRadius: 16, backgroundColor: colors.surface, marginBottom: 12 }}>
            {arranged.map((tile) => (
              <Badge key={`${tile.id}-${tile.word}`} label={tile.word} tone="mint" />
            ))}
            {arranged.length === 0 ? <T color={colors.muted}>Susunan kata akan muncul di sini.</T> : null}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {tiles.map((tile) => {
              const used = arranged.some((item) => item.id === tile.id);
              return (
                <Pressable
                  key={`${tile.id}-${tile.word}`}
                  testID={`word-tile-${tile.id}`}
                  disabled={used}
                  onPress={() => onAddWord(tile)}
                  accessibilityRole="button"
                  style={{ paddingVertical: 9, paddingHorizontal: 12, borderRadius: 14, backgroundColor: used ? colors.border : '#FFFFFF', borderWidth: 1, borderColor: colors.border, opacity: used ? 0.4 : 1 }}
                >
                  <T v="label">{tile.word}</T>
                </Pressable>
              );
            })}
          </View>
          <View style={{ marginTop: 12 }}>
            <Button label="Hapus kata terakhir" variant="secondary" disabled={arranged.length === 0} onPress={onUndoWord} />
          </View>
        </>
      )}
      <View style={{ marginTop: 12 }}>
        <Button testID="activity-check" label="Cek Jawaban" iconRight="arrow-forward" disabled={!canCheck} onPress={onCheck} />
      </View>
    </Card>
  );
}

function ActivityFeedback({ last, isLastStep, onRetry, onContinue }) {
  return (
    <View>
      <Card tone={last.isCorrect ? 'tealSoft' : 'yellowSoft'}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Icon name={last.isCorrect ? 'checkmark-circle' : 'bulb'} size={24} color={last.isCorrect ? colors.teal : colors.onYellow} />
          <T v="h3" color={last.isCorrect ? colors.teal : colors.onYellow} style={{ marginLeft: 8 }}>
            {last.isCorrect ? 'Jawabanmu tepat!' : 'Yuk, coba perhatikan lagi.'}
          </T>
        </View>
        <T style={{ marginTop: 10 }}>{`Jawabanmu: ${last.transcript}`}</T>
        {!last.isCorrect ? <T v="bodyBold" color={colors.teal} style={{ marginTop: 6 }}>{`Jawaban yang tepat: ${last.answer}`}</T> : null}
      </Card>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {last.reply.canRetry ? (
          <View style={{ flex: 1 }}>
            <Button testID="retry-button" label="Coba lagi" icon="refresh" variant="secondary" onPress={onRetry} />
          </View>
        ) : null}
        <View style={{ flex: 1 }}>
          <Button testID="next-button" label={isLastStep ? 'Selesai' : 'Lanjut'} iconRight="arrow-forward" onPress={onContinue} />
        </View>
      </View>
    </View>
  );
}

// Props:
//  lesson, onExit(), onFinish({ bests, transcript, seconds }),
//  savedVocab (array), onToggleVocab(step)
export default function LessonScreen({ lesson, savedVocab, onToggleVocab, onExit, onFinish }) {
  const steps = lesson.steps;
  const firstPrompt = promptForStep(steps[0], 0, steps.length);
  const startedAt = useRef(null);
  const stopRef = useRef(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [chat, setChat] = useState([{ role: 'nala', text: firstPrompt }]);
  const [transcript, setTranscript] = useState([{ role: 'nala', text: firstPrompt }]);
  const [attempts, setAttempts] = useState(0);
  const [bests, setBests] = useState([]);
  const [last, setLast] = useState(null); // { transcript, result, reply }
  const [hintOpen, setHintOpen] = useState(false);
  const [status, setStatus] = useState('Siap');
  const [message, setMessage] = useState('');
  const [simText, setSimText] = useState('');
  const [simInputFocused, setSimInputFocused] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [arranged, setArranged] = useState([]);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => () => {
    if (stopRef.current && stopRef.current.cancel) stopRef.current.cancel();
  }, []);

  const step = steps[stepIndex];
  const exerciseType = exerciseTypeFor(stepIndex);
  const options = exerciseType === 'choose' ? choiceOptions(steps, stepIndex, step.en) : [];
  const tiles = exerciseType === 'order' ? wordTiles(step.en, stepIndex) : [];
  const isLastStep = stepIndex + 1 >= steps.length;
  const saved = (savedVocab || []).some((v) => v.en === step.en);

  const submit = (text) => {
    const result = evaluate(step.en, text);
    const nextAttempts = attempts + 1;
    const reply = nalaReply(result.score, nextAttempts, stepIndex);
    setAttempts(nextAttempts);
    const nextBests = [...bests];
    nextBests[stepIndex] = Math.max(nextBests[stepIndex] || 0, result.score);
    setBests(nextBests);
    const userMsg = { role: 'user', text, score: result.score, exerciseType: 'speak' };
    const nalaMsg = { role: 'nala', text: reply.text };
    setChat((c) => [...c, userMsg, nalaMsg]);
    setTranscript((t) => [...t, userMsg, nalaMsg]);
    setLast({ transcript: text, result, reply, exerciseType: 'speak' });
    setSimText('');
    setMessage('');
    setStatus('Siap');
  };

  const handleMic = () => {
    if (status === 'Mendengarkan' && stopRef.current) {
      stopRef.current();
      return;
    }
    setMessage('');
    setStatus('Mendengarkan');
    stopRef.current = startListening({
      onStatus: (s) => setStatus(s),
      onResult: (text) => submit(text),
      onError: ({ code }) => {
        setStatus('Siap');
        setMessage(messageForError(code));
      },
    });
  };

  const handleSimSubmit = () => {
    if (exerciseType !== 'speak') return;
    if (!simText.trim()) {
      setMessage('Suara tidak terdeteksi. Coba lagi.');
      return;
    }
    submit(simText.trim());
  };

  const submitInteractive = (answer) => {
    const isCorrect = exerciseType === 'choose'
      ? answer === step.en
      : normalizeText(answer) === normalizeText(step.en);
    const score = isCorrect ? 100 : 0;
    const result = evaluate(step.en, isCorrect ? step.en : '');
    const reply = {
      text: isCorrect ? 'Betul! Kamu memahami frasa ini.' : 'Belum tepat. Coba cek lagi arti kalimatnya.',
      canRetry: !isCorrect,
      canContinue: true,
    };
    const nextBests = [...bests];
    nextBests[stepIndex] = Math.max(nextBests[stepIndex] || 0, score);
    setBests(nextBests);
    const userMsg = { role: 'user', text: answer, score, exerciseType };
    const nalaMsg = { role: 'nala', text: reply.text };
    setChat((current) => [...current, userMsg, nalaMsg]);
    setTranscript((current) => [...current, userMsg, nalaMsg]);
    setLast({ transcript: answer, answer: step.en, result, reply, exerciseType, isCorrect });
    setMessage('');
  };

  const handleCheckChoice = () => {
    if (!selectedOption) {
      setMessage('Pilih satu jawaban dulu ya.');
      return;
    }
    submitInteractive(selectedOption);
  };

  const handleCheckOrder = () => {
    if (arranged.length !== tiles.length) {
      setMessage('Susun semua kata terlebih dahulu.');
      return;
    }
    submitInteractive(arranged.map((tile) => tile.word).join(' '));
  };

  const handleRetry = () => {
    setLast(null);
    setHintOpen(false);
    setSelectedOption(null);
    setArranged([]);
    setSimText('');
  };

  const handleContinue = () => {
    if (isLastStep) {
      const seconds = Math.round((Date.now() - (startedAt.current || Date.now())) / 1000);
      onFinish({ bests, transcript, seconds });
      return;
    }
    const nextIndex = stepIndex + 1;
    const intro = { role: 'nala', text: promptForStep(steps[nextIndex], nextIndex, steps.length) };
    setStepIndex(nextIndex);
    setChat([intro]);
    setTranscript((t) => [...t, intro]);
    setAttempts(0);
    setLast(null);
    setHintOpen(false);
    setMessage('');
    setSimText('');
    setSelectedOption(null);
    setArranged([]);
  };

  const badWords = last ? last.result.words.filter((w) => !w.ok).map((w) => w.word) : [];
  const okCount = last ? last.result.words.filter((w) => w.ok).length : 0;
  const listening = status === 'Mendengarkan';

  return (
    <Screen avoidKeyboard>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          testID="back-button"
          onPress={() => {
            if (stopRef.current && stopRef.current.cancel) stopRef.current.cancel();
            onExit();
          }}
          accessibilityRole="button"
          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingRight: 12 }}
        >
          <Icon name="chevron-back" size={22} color={colors.primary} />
          <T v="bodyBold" color={colors.primary}>
            Kembali
          </T>
        </Pressable>
        <Badge testID="practice-progress" label={`Langkah ${stepIndex + 1} dari ${steps.length}`} tone="surface" icon="checkmark-circle" />
      </View>
      <View style={{ marginTop: 8, marginBottom: 16 }}>
        <ProgressBar value={(stepIndex + 1) / steps.length} testID="practice-bar" />
      </View>

      <Card tone="teal">
        {exerciseType === 'speak' ? (
          <>
            <T v="h1" testID="target-sentence" color="#FFFFFF">{step.en}</T>
            <T testID="target-translation" color="rgba(255,255,255,0.88)" style={{ marginTop: 10 }}>{step.id}</T>
          </>
        ) : (
          <>
            <T v="caption" color="rgba(255,255,255,0.78)">{exerciseType === 'choose' ? 'PILIH TERJEMAHAN YANG TEPAT' : 'SUSUN KATA MENJADI KALIMAT'}</T>
            <T v="h1" testID="target-translation" color="#FFFFFF" style={{ marginTop: 8 }}>{step.id}</T>
          </>
        )}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
          <Pressable
            testID="hint-button"
            onPress={() => setHintOpen((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="Petunjuk"
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 }}
          >
            <Icon name="bulb-outline" size={18} color="#FFFFFF" />
            <T v="label" color="#FFFFFF" style={{ marginLeft: 6 }}>
              Petunjuk
            </T>
          </Pressable>
          <Pressable
            testID="save-vocab-button"
            onPress={() => onToggleVocab(step)}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Hapus dari kosakata' : 'Simpan ke kosakata'}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 999, paddingVertical: 8, paddingHorizontal: 14 }}
          >
            <Icon name={saved ? 'bookmark' : 'bookmark-outline'} size={18} color="#FFFFFF" />
            <T v="label" color="#FFFFFF" testID="save-vocab-label" style={{ marginLeft: 6 }}>
              {saved ? 'Tersimpan' : 'Simpan'}
            </T>
          </Pressable>
        </View>
        {hintOpen ? (
          <View style={{ marginTop: 12, backgroundColor: colors.yellowSoft, borderRadius: 16, padding: 12 }}>
            <T testID="hint-text" color={colors.onYellow}>
              {hintFor(step)}
            </T>
          </View>
        ) : null}
      </Card>

      <View style={{ marginBottom: 6 }}>
        {chat.map((m, i) =>
          m.role === 'nala' ? (
            <NalaBubble
              key={`n${i}`}
              text={m.text}
              testID={i === chat.length - 1 ? 'nala-latest' : `nala-message-${i}`}
            />
          ) : (
            <UserBubble key={`u${i}`} text={m.text} score={m.score} exerciseType={m.exerciseType} testID={`user-message-${i}`} />
          )
        )}
      </View>

      {last ? last.exerciseType === 'speak' ? (
        <View>
          <Card>
            <View style={{ alignItems: 'center' }}>
              <View
                style={{
                  width: 132,
                  height: 132,
                  borderRadius: 66,
                  borderWidth: 12,
                  borderColor: ringColor(last.result.score),
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <T v="display" testID="score-text" style={{ fontSize: 34, lineHeight: 40 }}>{`${last.result.score}%`}</T>
                <T v="caption" color={colors.muted}>
                  KECOCOKAN TRANSKRIP
                </T>
              </View>
              <T v="h2" testID="score-label" style={{ marginTop: 14, textAlign: 'center' }}>
                {labelForScore(last.result.score)}
              </T>
              <T v="caption" color={colors.muted} style={{ marginTop: 4, textAlign: 'center' }}>
                Dihitung dari kecocokan kata transkrip dengan kalimat target, bukan analisis audio.
              </T>
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
              <Stat testID="stat-correct" label="Kata benar" value={`${okCount}/${last.result.words.length}`} bg={colors.tealSoft} fg={colors.teal} />
              <Stat testID="stat-wrong" label="Perlu dilatih" value={`${badWords.length}`} bg={colors.badBg} fg={colors.bad} />
              <Stat testID="stat-extra" label="Kata tambahan" value={`${last.result.extra.length}`} bg={colors.yellowSoft} fg={colors.onYellow} />
            </View>
          </Card>

          <Card>
            <CardHeader icon="locate-outline" title="Kalimat target" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {last.result.words.map((w, i) => (
                <View
                  key={`${w.word}-${i}`}
                  testID={`word-${i}-${w.ok ? 'ok' : 'bad'}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    backgroundColor: w.ok ? colors.mint : colors.badBg,
                  }}
                >
                  <Icon name={w.ok ? 'checkmark-circle' : 'close-circle'} size={16} color={w.ok ? colors.onMint : colors.bad} />
                  <T v="label" color={w.ok ? colors.onMint : colors.bad} style={{ marginLeft: 6 }}>
                    {w.word}
                  </T>
                </View>
              ))}
            </View>
            <T v="bodyBold" testID="bad-words-text" color={badWords.length === 0 ? colors.teal : colors.bad}>
              {badWords.length === 0 ? 'Semua kata sudah benar.' : `Kata yang perlu dilatih: ${badWords.join(', ')}`}
            </T>
            {last.result.extra.length > 0 && (
              <T testID="extra-words-text" color={colors.muted} style={{ marginTop: 4 }}>
                {`Kata tambahan yang terdengar: ${last.result.extra.join(', ')}`}
              </T>
            )}
          </Card>

          <Card>
            <CardHeader icon="bulb-outline" title="Tata bahasa" />
            {last.result.grammar.length === 0 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.tealSoft, borderRadius: 16, padding: 14 }}>
                <Icon name="checkmark-circle" size={22} color={colors.teal} />
                <T testID="grammar-none" color={colors.teal} style={{ flex: 1, marginLeft: 10 }}>
                  Tidak ada kesalahan tata bahasa yang terdeteksi.
                </T>
              </View>
            ) : (
              last.result.grammar.map((g, i) => (
                <View key={`${g.id}-${i}`} testID={`grammar-issue-${i}`} style={{ marginBottom: 10, padding: 14, borderRadius: 16, backgroundColor: colors.yellowSoft }}>
                  <T v="bodyBold" color={colors.onYellow}>{`"${g.found}"`}</T>
                  <T style={{ marginTop: 4 }}>{g.message}</T>
                  <T v="bodyBold" color={colors.teal} style={{ marginTop: 6 }}>{`Saran: ${g.suggestion}`}</T>
                </View>
              ))
            )}
          </Card>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {last.reply.canRetry ? (
              <View style={{ flex: 1 }}>
                <Button testID="retry-button" label="Coba lagi" icon="refresh" variant="secondary" onPress={handleRetry} />
              </View>
            ) : null}
            {last.reply.canContinue ? (
              <View style={{ flex: 1 }}>
                <Button testID="next-button" label={isLastStep ? 'Selesai' : 'Lanjut'} iconRight="arrow-forward" onPress={handleContinue} />
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        <ActivityFeedback last={last} isLastStep={isLastStep} onRetry={handleRetry} onContinue={handleContinue} />
      ) : exerciseType === 'speak' ? (
        <View>
          <View style={{ alignItems: 'center', marginVertical: 12 }}>
            <View style={{ width: 144, height: 144, borderRadius: 72, backgroundColor: 'rgba(242,107,122,0.12)', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 116, height: 116, borderRadius: 58, backgroundColor: 'rgba(242,107,122,0.22)', alignItems: 'center', justifyContent: 'center' }}>
                <Pressable
                  testID="mic-button"
                  onPress={handleMic}
                  accessibilityRole="button"
                  accessibilityLabel="Tekan untuk bicara"
                  style={({ pressed }) => ({
                    width: 88,
                    height: 88,
                    borderRadius: 44,
                    backgroundColor: listening ? colors.primary : colors.coral,
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Icon name={listening ? 'stop' : 'mic'} size={38} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>
            <T v="h3" style={{ marginTop: 12 }}>
              {listening ? 'Sedang mendengarkan...' : 'Tekan untuk bicara'}
            </T>
            <View style={{ marginTop: 8 }}>
              <Badge testID="speech-status" label={`Status: ${status}`} tone="surface" />
            </View>
            {!isSpeechAvailable() ? (
              <T v="caption" color={colors.muted} style={{ marginTop: 8, textAlign: 'center' }}>
                Suara aktif di APK. Di Expo Go gunakan Mode Simulasi.
              </T>
            ) : null}
          </View>

          {message ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.yellowSoft, borderRadius: 16, padding: 12, marginBottom: 16 }}>
              <Icon name="information-circle-outline" size={22} color={colors.onYellow} />
              <T testID="practice-message" color={colors.onYellow} style={{ flex: 1, marginLeft: 10 }}>
                {message}
              </T>
            </View>
          ) : null}

          <Card>
            <CardHeader
              icon="keypad-outline"
              title="Mode Simulasi"
              subtitle="Ketik transkrip sebagai pengganti suara. Dipakai untuk pengujian otomatis."
              right={<Badge label="Uji Teks" tone="mint" />}
            />
            <TextInput
              testID="sim-input"
              value={simText}
              onChangeText={setSimText}
              onFocus={() => setSimInputFocused(true)}
              onBlur={() => setSimInputFocused(false)}
              placeholder="Ketik transkrip di sini..."
              placeholderTextColor="#8A7172"
              selectionColor={colors.primary} cursorColor={colors.primary}
              autoCapitalize="none"
              autoCorrect={false}
              style={{
                borderWidth: 1.5,
                borderColor: simInputFocused ? colors.primary : colors.border,
                borderRadius: 20,
                paddingVertical: 14,
                paddingHorizontal: 16,
                fontSize: 16,
                fontFamily: fonts.regular,
                color: colors.text,
                backgroundColor: simInputFocused ? '#FFFFFF' : colors.surface,
                marginBottom: 12,
              }}
            />
            <Button testID="sim-fill-target" label="Isi dengan kalimat target" icon="sparkles" variant="secondary" onPress={() => setSimText(step.en)} />
            <View style={{ marginTop: 12 }}>
              <Button testID="sim-submit" label="Kirim Transkrip" iconRight="arrow-forward" onPress={handleSimSubmit} />
            </View>
          </Card>
        </View>
      ) : (
        <View>
          {message ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.yellowSoft, borderRadius: 16, padding: 12, marginBottom: 16 }}>
              <Icon name="information-circle-outline" size={22} color={colors.onYellow} />
              <T testID="practice-message" color={colors.onYellow} style={{ flex: 1, marginLeft: 10 }}>{message}</T>
            </View>
          ) : null}
          <ActivityPanel
            type={exerciseType}
            options={options}
            selectedOption={selectedOption}
            onSelect={(option) => { setSelectedOption(option); setMessage(''); }}
            tiles={tiles}
            arranged={arranged}
            onAddWord={(tile) => { setArranged((current) => [...current, tile]); setMessage(''); }}
            onUndoWord={() => setArranged((current) => current.slice(0, -1))}
            onCheck={exerciseType === 'choose' ? handleCheckChoice : handleCheckOrder}
            canCheck={exerciseType === 'choose' ? Boolean(selectedOption) : arranged.length === tiles.length}
          />
        </View>
      )}
    </Screen>
  );
}
