// Data statis Tuturin: pilihan onboarding dan kalimat latihan.

export const LEVELS = [
  { id: 'pemula', label: 'Pemula' },
  { id: 'menengah', label: 'Menengah' },
  { id: 'mahir', label: 'Mahir' },
];

export const GOALS = [
  { id: 'percakapan', label: 'Percakapan harian' },
  { id: 'karier', label: 'Karier' },
  { id: 'perjalanan', label: 'Perjalanan' },
  { id: 'ujian', label: 'Ujian' },
];

export const TARGETS = [3, 5, 10];

// 3 level x 4 tujuan x 4 kalimat = 48 kalimat.
// Catatan: hindari tanda hubung dan kontraksi (o'clock, I'm) supaya
// pencocokan kata dengan hasil speech-to-text lebih konsisten.
export const SENTENCES = {
  pemula: {
    percakapan: [
      'Hello, my name is Rina.',
      'I like to drink tea every morning.',
      'How are you today?',
      'Nice to meet you.',
    ],
    karier: [
      'I work in a small office.',
      'My job starts at eight in the morning.',
      'I want to learn new skills.',
      'Please send me an email.',
    ],
    perjalanan: [
      'Where is the bus station?',
      'I would like a ticket to Jakarta.',
      'How much is the hotel room?',
      'The airport is very far from here.',
    ],
    ujian: [
      'I study English every night.',
      'The test is on Friday.',
      'Please repeat the question.',
      'I need more time to answer.',
    ],
  },
  menengah: {
    percakapan: [
      'I usually go jogging with my friends on weekends.',
      'Could you tell me how to get to the nearest pharmacy?',
      'She told me that she would be late for dinner.',
      'I have been learning English for two years.',
    ],
    karier: [
      'I would like to apply for the marketing position.',
      'My responsibilities include managing the weekly schedule.',
      'We need to finish this report before the deadline.',
      'I am looking forward to working with your team.',
    ],
    perjalanan: [
      'We booked a hotel near the beach for three nights.',
      'Could I change my flight to an earlier time?',
      'Excuse me, does this train stop at Yogyakarta?',
      'The tour guide recommended a local restaurant.',
    ],
    ujian: [
      'I am preparing for the English speaking test next month.',
      'My teacher says that practice makes progress.',
      'Please speak more slowly so I can understand.',
      'I think the second question was the most difficult.',
    ],
  },
  mahir: {
    percakapan: [
      'Despite the rain, we decided to walk home together.',
      'If I had more free time, I would travel around the world.',
      'She suggested that we meet at the coffee shop after work.',
      'I have never been to such a beautiful place.',
    ],
    karier: [
      'I believe my experience would be valuable to your organization.',
      'We should consider the impact of this decision on our clients.',
      'She has extensive experience in project management.',
      'Could we schedule a meeting to discuss the budget?',
    ],
    perjalanan: [
      'Would it be possible to extend our stay by one more night?',
      'We missed our connecting flight because of a delay.',
      'I would appreciate it if you could recommend a quiet hotel.',
      'The customs officer asked whether we had anything to declare.',
    ],
    ujian: [
      'In my opinion, education should focus on developing critical thinking.',
      'Although the topic was challenging, I managed to finish on time.',
      'Many students believe that regular practice improves speaking skills.',
      'I would like to clarify my answer to the previous question.',
    ],
  },
};
