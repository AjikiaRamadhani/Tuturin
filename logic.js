// Logika inti Tuturin (tanpa dependensi React Native, jadi mudah diuji).
// Semua fungsi bersifat deterministik: masukan yang sama selalu memberi hasil yang sama.

import { SENTENCES, LESSONS } from './data.js';

// ---------- Normalisasi teks ----------

export function normalizeText(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[‘’`]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------- Pelafalan: perbandingan kata target vs transkrip ----------
// Memakai Longest Common Subsequence (LCS) supaya urutan kata ikut diperhitungkan.
// Skor = kata yang cocok / jumlah kata terpanjang (target atau transkrip),
// jadi kata tambahan di transkrip ikut menurunkan skor.

export function alignWords(target, transcript) {
  const tRaw = String(target || '').trim().split(/\s+/).filter(Boolean);
  const tNorm = tRaw.map(normalizeText);
  const sNorm = normalizeText(transcript).split(' ').filter(Boolean);
  const n = tNorm.length;
  const m = sNorm.length;

  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      dp[i][j] =
        tNorm[i - 1] === sNorm[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }

  const matchedT = new Set();
  const matchedS = new Set();
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (tNorm[i - 1] === sNorm[j - 1]) {
      matchedT.add(i - 1);
      matchedS.add(j - 1);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }

  const words = tRaw.map((word, idx) => ({ word, ok: matchedT.has(idx) }));
  const extra = sNorm.filter((_, idx) => !matchedS.has(idx));
  const denom = Math.max(n, m);
  const score = denom === 0 ? 0 : Math.round((100 * dp[n][m]) / denom);
  return { score, words, extra };
}

// ---------- Tata bahasa: aturan sederhana ----------

const IRREGULAR_BASE = {
  goes: 'go', has: 'have', does: 'do', is: 'be',
  went: 'go', ate: 'eat', saw: 'see', took: 'take', came: 'come',
  got: 'get', made: 'make', bought: 'buy', said: 'say', was: 'be',
  were: 'be', had: 'have', gave: 'give', ran: 'run', wrote: 'write',
  met: 'meet', knew: 'know', thought: 'think', began: 'begin', brought: 'bring',
  drank: 'drink', felt: 'feel', paid: 'pay', slept: 'sleep', spoke: 'speak',
  taught: 'teach', told: 'tell', understood: 'understand', sent: 'send',
};

function baseForm(verb) {
  if (IRREGULAR_BASE[verb]) return IRREGULAR_BASE[verb];
  if (verb.endsWith('ies')) return verb.slice(0, -3) + 'y';
  if (/(sh|ch|ss|x|o)es$/.test(verb)) return verb.slice(0, -2);
  if (verb.endsWith('s')) return verb.slice(0, -1);
  return verb;
}

function thirdPerson(verb) {
  if (verb === 'have') return 'has';
  if (verb === 'go') return 'goes';
  if (verb === 'do') return 'does';
  if (verb.endsWith('y') && !/[aeiou]y$/.test(verb)) return verb.slice(0, -1) + 'ies';
  if (/(sh|ch|ss|x|o)$/.test(verb)) return verb + 'es';
  return verb + 's';
}

const DOUBLE_FINAL = ['run', 'sit', 'get', 'swim', 'stop', 'begin', 'plan'];
function ingForm(verb) {
  if (verb.endsWith('ie')) return verb.slice(0, -2) + 'ying';
  if (verb.endsWith('e') && !verb.endsWith('ee')) return verb.slice(0, -1) + 'ing';
  if (DOUBLE_FINAL.includes(verb)) return verb + verb[verb.length - 1] + 'ing';
  return verb + 'ing';
}

// Kata kerja yang dikenali. Sengaja tidak memuat kata yang juga sering jadi kata benda
// (book, call, walk, change, help, visit, look, practice) supaya tidak salah menandai.
const BASE_LIST = [
  'go', 'have', 'do', 'want', 'like', 'need', 'work', 'live', 'study', 'speak', 'eat', 'play', 'know',
  'think', 'come', 'take', 'make', 'get', 'see', 'use', 'help', 'learn', 'try', 'start', 'finish', 'open',
  'close', 'drink', 'buy', 'send', 'ask', 'tell', 'give', 'find', 'leave', 'meet', 'run', 'write', 'teach',
  'travel', 'cook', 'wait', 'stay', 'sleep', 'listen', 'pay', 'arrive', 'begin', 'bring', 'keep', 'feel',
  'love', 'hate', 'enjoy', 'prefer', 'remember', 'understand', 'sing', 'swim', 'drive', 'watch', 'wash',
  'clean', 'teach', 'join', 'follow', 'believe', 'hope', 'say',
];
const VERBS_BASE = [...new Set(BASE_LIST)].join('|');
const VERBS_S = [...new Set(BASE_LIST)].map(thirdPerson).join('|');
const VERBS_PAST =
  'went|ate|saw|took|came|got|made|bought|said|was|were|had|gave|ran|wrote|met|knew|thought|began|brought|drank|felt|paid|slept|spoke|taught|told|understood|sent';
// Untuk aturan am/is/are + kata kerja dasar. Daftar lebih pendek karena open, close, clean, dll.
// juga kata sifat (is open, is clean) dan tidak boleh ditandai salah.
const BE_BASE =
  'go|eat|work|study|learn|try|come|speak|write|play|do|run|sleep|travel|cook|drive|swim|sing|wait|stay|watch|listen';

const CONSONANT_SOUND_U = /^(uni|use|usu|eur|one|onc|uti)/;

// Setiap aturan: regex dijalankan pada teks yang sudah dinormalisasi.
// check(match) mengembalikan null (tidak ada kesalahan) atau {message, suggestion}.
const RULES = [
  {
    id: 'sv-3sg',
    regex: new RegExp(`\\b(he|she|it) (${VERBS_BASE})\\b`),
    check: (m) => ({
      message: 'Setelah he/she/it, kata kerja biasanya diberi akhiran -s atau -es.',
      suggestion: `${m[1]} ${thirdPerson(m[2])}`,
    }),
  },
  {
    id: 'base-plural',
    regex: new RegExp(`\\b(i|you|we|they) (${VERBS_S})\\b`),
    check: (m) => ({
      message: 'Setelah I/you/we/they, pakai bentuk dasar kata kerja tanpa akhiran -s.',
      suggestion: `${m[1]} ${baseForm(m[2])}`,
    }),
  },
  {
    id: 'dont-3sg',
    regex: /\b(he|she|it) (don't|do not)\b/,
    check: (m) => ({
      message: "Untuk he/she/it, gunakan doesn't (atau does not), bukan don't.",
      suggestion: `${m[1]} ${m[2] === "don't" ? "doesn't" : 'does not'}`,
    }),
  },
  {
    id: 'after-aux',
    regex: new RegExp(
      `\\b(does|doesn't|did|didn't|can|could|will|would|must|should|may|might|won't|can't) ((?:he|she|it|i|you|we|they) )?(${VERBS_S}|${VERBS_PAST})\\b`
    ),
    check: (m) => ({
      message:
        'Setelah kata bantu seperti does/did/can/will, kata kerja memakai bentuk dasar.',
      suggestion: `${m[1]} ${m[2] || ''}${baseForm(m[3])}`,
    }),
  },
  {
    id: 'after-to',
    regex: new RegExp(`\\bto (${VERBS_S}|${VERBS_PAST})\\b`),
    check: (m) => ({
      message: 'Setelah kata "to", kata kerja memakai bentuk dasar.',
      suggestion: `to ${baseForm(m[1])}`,
    }),
  },
  {
    id: 'be-agreement',
    regex: /\b(i|you|we|they|he|she|it) (is|are|am)\b/,
    check: (m) => {
      const correct = m[1] === 'i' ? 'am' : /^(he|she|it)$/.test(m[1]) ? 'is' : 'are';
      if (m[2] === correct) return null;
      return {
        message: `Bentuk "to be" untuk ${m[1]} adalah ${correct}.`,
        suggestion: `${m[1]} ${correct}`,
      };
    },
  },
  {
    id: 'be-agree',
    regex: /\b(am|is|are) (agree|disagree)\b/,
    check: (m) => ({
      message: `${m[2]} sudah merupakan kata kerja, tidak perlu am/is/are.`,
      suggestion: m[2],
    }),
  },
  {
    id: 'be-base',
    regex: new RegExp(`\\b(am|is|are) (${BE_BASE})\\b`),
    check: (m) => ({
      message: 'Setelah am/is/are, gunakan kata kerja berakhiran -ing.',
      suggestion: `${m[1]} ${ingForm(m[2])}`,
    }),
  },
  {
    id: 'discuss-about',
    regex: /\b(discuss|discussed|discussing|discusses) about\b/,
    check: (m) => ({
      message: 'Kata discuss tidak diikuti about.',
      suggestion: m[1],
    }),
  },
  {
    id: 'double-comparative',
    regex:
      /\b(more|most) (better|best|easier|easiest|cheaper|cheapest|faster|fastest|bigger|biggest|smaller|smallest|harder|cleaner|older|taller|larger|higher|lower)\b/,
    check: (m) => ({
      message: 'Jangan memakai more/most bersama bentuk -er/-est atau better/best.',
      suggestion: m[2],
    }),
  },
  {
    id: 'a-an',
    regex: /\b(a|an) ([a-z]\w*)\b/,
    check: (m) => {
      const word = m[2];
      const startsVowel = /^[aeiou]/.test(word);
      const soundsVowel = (startsVowel && !CONSONANT_SOUND_U.test(word)) || /^(hour|honest|honor|heir)/.test(word);
      const expected = soundsVowel ? 'an' : 'a';
      if (m[1] === expected) return null;
      return {
        message: "Gunakan 'an' sebelum bunyi vokal dan 'a' sebelum bunyi konsonan.",
        suggestion: `${expected} ${word}`,
      };
    },
  },
  {
    id: 'uncountable-plural',
    regex: /\b(informations|advices|furnitures|homeworks|equipments|knowledges)\b/,
    check: (m) => ({
      message: 'Kata ini tidak punya bentuk jamak.',
      suggestion: m[1].slice(0, -1),
    }),
  },
  {
    id: 'modal-to',
    regex: /\b(can|could|must|should|will|would|may|might) to\b/,
    check: (m) => ({
      message: `Setelah ${m[1]}, tidak perlu memakai "to".`,
      suggestion: m[1],
    }),
  },
  {
    id: 'much-many',
    regex:
      /\b(many) (water|money|time|information|advice|traffic|rice|homework|furniture|equipment|luggage)\b|\b(much) (people|friends|books|students|cars|things|questions|tickets)\b/,
    check: (m) => {
      if (m[1]) {
        return {
          message: 'Gunakan much untuk benda yang tidak bisa dihitung.',
          suggestion: `much ${m[2]}`,
        };
      }
      return {
        message: 'Gunakan many untuk benda yang bisa dihitung.',
        suggestion: `many ${m[4]}`,
      };
    },
  },
];

export function checkGrammar(transcript) {
  const text = normalizeText(transcript);
  const issues = [];
  const spans = [];

  for (const rule of RULES) {
    // Cari semua kemunculan aturan ini, bukan hanya yang pertama.
    const re = new RegExp(rule.regex.source, 'g');
    let m;
    while ((m = re.exec(text)) !== null) {
      if (m[0].length === 0) {
        re.lastIndex++;
        continue;
      }
      const result = rule.check(m);
      if (!result) continue;
      const start = m.index;
      const end = m.index + m[0].length;
      // Lewati jika tumpang tindih dengan kesalahan yang sudah dilaporkan.
      if (spans.some(([s, e]) => start < e && end > s)) continue;
      spans.push([start, end]);
      issues.push({
        id: rule.id,
        found: m[0],
        message: result.message,
        suggestion: result.suggestion,
        start,
      });
    }
  }

  return issues.sort((a, b) => a.start - b.start).map(({ start, ...rest }) => rest);
}

// ---------- Gabungan: evaluasi satu percobaan latihan ----------

export function evaluate(target, transcript) {
  const { score, words, extra } = alignWords(target, transcript);
  return { score, words, extra, grammar: checkGrammar(transcript) };
}

// ---------- Susun daftar kalimat untuk satu sesi ----------
// Kalimat dari tujuan yang dipilih dulu, sisanya dilengkapi dari tujuan lain di level yang sama.

export function buildSession(levelId, goalId, count) {
  const level = SENTENCES[levelId] || {};
  const first = level[goalId] || [];
  const others = Object.keys(level)
    .filter((g) => g !== goalId)
    .flatMap((g) => level[g]);
  return [...first, ...others].slice(0, count);
}

// ---------- Pelajaran ----------

// 4 pelajaran untuk satu level. Pelajaran yang cocok dengan tujuan diberi tanda
// recommended dan ditaruh paling atas; sisanya mengikuti urutan tetap.
export function lessonsFor(levelId, goalId) {
  const list = LESSONS.filter((l) => l.level === levelId).map((l) => ({ ...l, recommended: l.goal === goalId }));
  return [...list.filter((l) => l.recommended), ...list.filter((l) => !l.recommended)];
}

export function getLesson(id) {
  return LESSONS.find((l) => l.id === id) || null;
}

// ---------- Balasan Nala (skrip tetap, bukan AI) ----------
// Dipilih dari skor. Variasi kalimat ditentukan oleh nomor langkah, bukan acak,
// supaya hasil uji selalu sama.

export const MAX_ATTEMPTS = 3;

const PRAISE = [
  'Hebat! Pelafalanmu sangat jelas.',
  'Bagus sekali! Itu hampir sempurna.',
  'Mantap! Kamu terdengar percaya diri.',
  'Luar biasa! Pertahankan ya.',
];
const ENCOURAGE = [
  'Sudah cukup baik. Coba lagi supaya lebih tepat, atau lanjut kalau kamu mau.',
  'Hampir! Beberapa kata masih perlu dilatih.',
  'Bagus, tinggal sedikit lagi. Mau coba sekali lagi?',
  'Lumayan! Perhatikan kata yang ditandai merah.',
];
const REPEAT = [
  'Hmm, aku belum menangkap kalimatnya. Coba ucapkan sekali lagi pelan-pelan.',
  'Belum cocok dengan kalimat target. Yuk ulangi, dengarkan dulu terjemahannya.',
  'Masih jauh dari kalimat target. Ulangi lagi ya, kamu pasti bisa.',
  'Belum tepat. Coba lagi dengan lebih pelan dan jelas.',
];

// attempts = jumlah percobaan pada langkah ini (termasuk yang barusan).
// Hasil: { kind, text, canRetry, canContinue }
export function nalaReply(score, attempts, stepIndex) {
  const i = Math.abs(stepIndex || 0) % 4;
  if (score >= 90) {
    return { kind: 'great', text: PRAISE[i], canRetry: false, canContinue: true };
  }
  if (score >= 60) {
    return { kind: 'ok', text: ENCOURAGE[i], canRetry: true, canContinue: true };
  }
  const forced = attempts >= MAX_ATTEMPTS;
  return {
    kind: 'retry',
    text: forced ? 'Tidak apa-apa, kita lanjut dulu ya. Nanti bisa diulang lagi.' : REPEAT[i],
    canRetry: true,
    canContinue: forced,
  };
}

export function nalaIntro(step, index, total, tutorName = 'Nala') {
  const opening = index === 0 ? `Hai, aku ${tutorName}! Yuk mulai. ` : '';
  return `${opening}Langkah ${index + 1} dari ${total}. Ucapkan: "${step.en}" Artinya: ${step.id}`;
}

export function hintFor(step) {
  const words = step.en.split(' ');
  const start = words.slice(0, 2).join(' ');
  return `Artinya: ${step.id}\nMulai dengan: "${start}"`;
}

// ---------- Ringkasan pelajaran ----------

export function mastery(bestScores) {
  if (!bestScores || bestScores.length === 0) return 0;
  const sum = bestScores.reduce((a, b) => a + b, 0);
  return Math.round(sum / bestScores.length);
}

export function formatDuration(seconds) {
  const s = Math.max(0, Math.round(seconds || 0));
  if (s < 60) return `${s} dtk`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r === 0 ? `${m} mnt` : `${m} mnt ${r} dtk`;
}

// ---------- Tanggal, progres, streak ----------

export function dateKey(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function previousDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return dateKey(new Date(y, m - 1, d - 1));
}

// streak = { last: 'YYYY-MM-DD' | null, count: number }
export function nextStreak(streak, today) {
  const cur = streak || { last: null, count: 0 };
  if (cur.last === today) return cur;
  if (cur.last === previousDateKey(today)) return { last: today, count: cur.count + 1 };
  return { last: today, count: 1 };
}

// Streak yang ditampilkan: 0 kalau sudah lewat dari kemarin.
export function activeStreak(streak, today) {
  if (!streak || !streak.last) return 0;
  if (streak.last === today || streak.last === previousDateKey(today)) return streak.count;
  return 0;
}

// Progres hari ini: { date, completed: [lessonId] }
export function freshProgress(today) {
  return { date: today, completed: [] };
}

export function normalizeProgress(saved, today) {
  if (!saved || saved.date !== today || !Array.isArray(saved.completed)) return freshProgress(today);
  return { date: today, completed: [...new Set(saved.completed)] };
}

export function normalizePrefs(saved) {
  if (!saved || !saved.level || !saved.goal) return null;
  const target = [1, 2, 3].includes(saved.target) ? saved.target : 2;
  return { level: saved.level, goal: saved.goal, target };
}

export function completeLesson(progress, lessonId, today) {
  const base = normalizeProgress(progress, today);
  if (base.completed.includes(lessonId)) return base;
  return { date: today, completed: [...base.completed, lessonId] };
}

// ---------- Kosakata tersimpan ----------

export function toggleVocab(list, item) {
  const cur = Array.isArray(list) ? list : [];
  if (cur.some((v) => v.en === item.en)) return cur.filter((v) => v.en !== item.en);
  return [...cur, { en: item.en, id: item.id }];
}
