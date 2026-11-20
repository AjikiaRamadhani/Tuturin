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

// Target harian = jumlah pelajaran yang diselesaikan per hari.
export const TARGETS = [1, 2, 3];

export const TUTOR_NAME = 'Nala';

// 3 level x 4 tujuan x 6 kalimat = 72 kalimat.
// Catatan: hindari tanda hubung dan kontraksi (o'clock, I'm) supaya
// pencocokan kata dengan hasil speech-to-text lebih konsisten.
export const SENTENCES = {
  pemula: {
    percakapan: [
      'Hello, my name is Rina.',
      'I like to drink tea every morning.',
      'How are you today?',
      'Nice to meet you.',
      'I live in Bandung with my family.',
      'What do you like to do on weekends?',
    ],
    karier: [
      'I work in a small office.',
      'My job starts at eight in the morning.',
      'I want to learn new skills.',
      'Please send me an email.',
      'Could you help me with this task?',
      'I have a meeting at ten in the morning.',
    ],
    perjalanan: [
      'Where is the bus station?',
      'I would like a ticket to Jakarta.',
      'How much is the hotel room?',
      'The airport is very far from here.',
      'Does this bus go to the city center?',
      'I need a room for one night.',
    ],
    ujian: [
      'I study English every night.',
      'The test is on Friday.',
      'Please repeat the question.',
      'I need more time to answer.',
      'Could you explain the instructions?',
      'I am ready to begin the test.',
    ],
  },
  menengah: {
    percakapan: [
      'I usually go jogging with my friends on weekends.',
      'Could you tell me how to get to the nearest pharmacy?',
      'She told me that she would be late for dinner.',
      'I have been learning English for two years.',
      'We often talk about our favorite movies.',
      'I would rather stay home this evening.',
    ],
    karier: [
      'I would like to apply for the marketing position.',
      'My responsibilities include managing the weekly schedule.',
      'We need to finish this report before the deadline.',
      'I am looking forward to working with your team.',
      'Could you give me feedback on this proposal?',
      'I can take responsibility for the next step.',
    ],
    perjalanan: [
      'We booked a hotel near the beach for three nights.',
      'Could I change my flight to an earlier time?',
      'Excuse me, does this train stop at Yogyakarta?',
      'The tour guide recommended a local restaurant.',
      'Our reservation is under the name Rina.',
      'Could you tell me when we need to check out?',
    ],
    ujian: [
      'I am preparing for the English speaking test next month.',
      'My teacher says that practice makes progress.',
      'Please speak more slowly so I can understand.',
      'I think the second question was the most difficult.',
      'I would like to add one more example.',
      'My answer is based on the information in the passage.',
    ],
  },
  mahir: {
    percakapan: [
      'Despite the rain, we decided to walk home together.',
      'If I had more free time, I would travel around the world.',
      'She suggested that we meet at the coffee shop after work.',
      'I have never been to such a beautiful place.',
      'We ended up taking the scenic route home.',
      'I wish I had asked her for advice earlier.',
    ],
    karier: [
      'I believe my experience would be valuable to your organization.',
      'We should consider the impact of this decision on our clients.',
      'She has extensive experience in project management.',
      'Could we schedule a meeting to discuss the budget?',
      'The data suggests that we should revise our approach.',
      'I will follow up with the team after the presentation.',
    ],
    perjalanan: [
      'Would it be possible to extend our stay by one more night?',
      'We missed our connecting flight because of a delay.',
      'I would appreciate it if you could recommend a quiet hotel.',
      'The customs officer asked whether we had anything to declare.',
      'Our departure was postponed due to severe weather.',
      'Could you arrange transportation to the conference venue?',
    ],
    ujian: [
      'In my opinion, education should focus on developing critical thinking.',
      'Although the topic was challenging, I managed to finish on time.',
      'Many students believe that regular practice improves speaking skills.',
      'I would like to clarify my answer to the previous question.',
      'The evidence supports the conclusion that I have presented.',
      'There are several factors that should be taken into account.',
    ],
  },
};

// Terjemahan Indonesia untuk tiap kalimat latihan (kunci = kalimat Inggris persis).
export const TRANSLATIONS = {
  'Hello, my name is Rina.': 'Halo, namaku Rina.',
  'I like to drink tea every morning.': 'Aku suka minum teh setiap pagi.',
  'How are you today?': 'Apa kabar hari ini?',
  'Nice to meet you.': 'Senang bertemu denganmu.',
  'I live in Bandung with my family.': 'Aku tinggal di Bandung bersama keluargaku.',
  'What do you like to do on weekends?': 'Apa yang kamu suka lakukan saat akhir pekan?',
  'I work in a small office.': 'Aku bekerja di kantor kecil.',
  'My job starts at eight in the morning.': 'Pekerjaanku dimulai pukul delapan pagi.',
  'I want to learn new skills.': 'Aku ingin mempelajari keterampilan baru.',
  'Please send me an email.': 'Tolong kirimi aku email.',
  'Could you help me with this task?': 'Bisakah kamu membantuku mengerjakan tugas ini?',
  'I have a meeting at ten in the morning.': 'Aku ada rapat pukul sepuluh pagi.',
  'Where is the bus station?': 'Di mana terminal bus?',
  'I would like a ticket to Jakarta.': 'Aku ingin tiket ke Jakarta.',
  'How much is the hotel room?': 'Berapa harga kamar hotelnya?',
  'The airport is very far from here.': 'Bandara sangat jauh dari sini.',
  'Does this bus go to the city center?': 'Apakah bus ini menuju pusat kota?',
  'I need a room for one night.': 'Aku membutuhkan kamar untuk satu malam.',
  'I study English every night.': 'Aku belajar bahasa Inggris setiap malam.',
  'The test is on Friday.': 'Ujiannya hari Jumat.',
  'Please repeat the question.': 'Tolong ulangi pertanyaannya.',
  'I need more time to answer.': 'Aku butuh waktu lebih untuk menjawab.',
  'Could you explain the instructions?': 'Bisakah kamu menjelaskan petunjuknya?',
  'I am ready to begin the test.': 'Aku siap memulai ujiannya.',
  'I usually go jogging with my friends on weekends.': 'Aku biasanya jogging bersama teman-temanku di akhir pekan.',
  'Could you tell me how to get to the nearest pharmacy?': 'Bisakah kamu memberi tahu cara menuju apotek terdekat?',
  'She told me that she would be late for dinner.': 'Dia bilang kepadaku bahwa dia akan terlambat makan malam.',
  'I have been learning English for two years.': 'Aku sudah belajar bahasa Inggris selama dua tahun.',
  'We often talk about our favorite movies.': 'Kami sering membicarakan film favorit kami.',
  'I would rather stay home this evening.': 'Aku lebih memilih tinggal di rumah malam ini.',
  'I would like to apply for the marketing position.': 'Saya ingin melamar posisi pemasaran.',
  'My responsibilities include managing the weekly schedule.': 'Tanggung jawab saya mencakup mengatur jadwal mingguan.',
  'We need to finish this report before the deadline.': 'Kita perlu menyelesaikan laporan ini sebelum tenggat.',
  'I am looking forward to working with your team.': 'Saya menantikan kesempatan bekerja dengan tim Anda.',
  'Could you give me feedback on this proposal?': 'Bisakah Anda memberi masukan tentang proposal ini?',
  'I can take responsibility for the next step.': 'Saya bisa bertanggung jawab atas langkah berikutnya.',
  'We booked a hotel near the beach for three nights.': 'Kami memesan hotel dekat pantai untuk tiga malam.',
  'Could I change my flight to an earlier time?': 'Bisakah saya mengubah penerbangan ke jam yang lebih awal?',
  'Excuse me, does this train stop at Yogyakarta?': 'Permisi, apakah kereta ini berhenti di Yogyakarta?',
  'The tour guide recommended a local restaurant.': 'Pemandu wisata merekomendasikan restoran lokal.',
  'Our reservation is under the name Rina.': 'Reservasi kami atas nama Rina.',
  'Could you tell me when we need to check out?': 'Bisakah Anda memberi tahu kapan kami harus check-out?',
  'I am preparing for the English speaking test next month.': 'Aku sedang mempersiapkan ujian berbicara bahasa Inggris bulan depan.',
  'My teacher says that practice makes progress.': 'Guruku bilang bahwa latihan membuat kita berkembang.',
  'Please speak more slowly so I can understand.': 'Tolong bicara lebih pelan agar aku bisa mengerti.',
  'I think the second question was the most difficult.': 'Menurutku pertanyaan kedua adalah yang paling sulit.',
  'I would like to add one more example.': 'Saya ingin menambahkan satu contoh lagi.',
  'My answer is based on the information in the passage.': 'Jawaban saya didasarkan pada informasi dalam bacaan.',
  'Despite the rain, we decided to walk home together.': 'Meskipun hujan, kami memutuskan berjalan pulang bersama.',
  'If I had more free time, I would travel around the world.': 'Kalau aku punya lebih banyak waktu luang, aku akan keliling dunia.',
  'She suggested that we meet at the coffee shop after work.': 'Dia menyarankan agar kita bertemu di kedai kopi setelah kerja.',
  'I have never been to such a beautiful place.': 'Aku belum pernah ke tempat seindah ini.',
  'We ended up taking the scenic route home.': 'Akhirnya kami memilih rute pulang yang pemandangannya indah.',
  'I wish I had asked her for advice earlier.': 'Andai saja aku meminta sarannya lebih awal.',
  'I believe my experience would be valuable to your organization.': 'Saya yakin pengalaman saya akan berharga bagi organisasi Anda.',
  'We should consider the impact of this decision on our clients.': 'Kita perlu mempertimbangkan dampak keputusan ini terhadap klien kita.',
  'She has extensive experience in project management.': 'Dia memiliki pengalaman luas dalam manajemen proyek.',
  'Could we schedule a meeting to discuss the budget?': 'Bisakah kita menjadwalkan rapat untuk membahas anggaran?',
  'The data suggests that we should revise our approach.': 'Data menunjukkan bahwa kita sebaiknya meninjau ulang pendekatan kita.',
  'I will follow up with the team after the presentation.': 'Saya akan menindaklanjutinya bersama tim setelah presentasi.',
  'Would it be possible to extend our stay by one more night?': 'Mungkinkah kami memperpanjang masa menginap satu malam lagi?',
  'We missed our connecting flight because of a delay.': 'Kami ketinggalan penerbangan lanjutan karena keterlambatan.',
  'I would appreciate it if you could recommend a quiet hotel.': 'Saya akan sangat berterima kasih jika Anda bisa merekomendasikan hotel yang tenang.',
  'The customs officer asked whether we had anything to declare.': 'Petugas bea cukai bertanya apakah kami membawa barang yang perlu dilaporkan.',
  'Our departure was postponed due to severe weather.': 'Keberangkatan kami ditunda karena cuaca buruk.',
  'Could you arrange transportation to the conference venue?': 'Bisakah Anda mengatur transportasi ke lokasi konferensi?',
  'In my opinion, education should focus on developing critical thinking.': 'Menurut saya, pendidikan seharusnya berfokus pada pengembangan pemikiran kritis.',
  'Although the topic was challenging, I managed to finish on time.': 'Meskipun topiknya menantang, saya berhasil menyelesaikannya tepat waktu.',
  'Many students believe that regular practice improves speaking skills.': 'Banyak siswa percaya bahwa latihan rutin meningkatkan kemampuan berbicara.',
  'I would like to clarify my answer to the previous question.': 'Saya ingin memperjelas jawaban saya untuk pertanyaan sebelumnya.',
  'The evidence supports the conclusion that I have presented.': 'Bukti tersebut mendukung kesimpulan yang telah saya sampaikan.',
  'There are several factors that should be taken into account.': 'Ada beberapa faktor yang perlu dipertimbangkan.',
};

// ---------- Pelajaran ----------
// 12 pelajaran (3 level x 4 tujuan). Tiap pelajaran memakai 6 kalimat dari SENTENCES
// sebagai 4 langkah, jadi isi dan terjemahannya tetap konsisten.
export const LESSON_META = {
  'pemula-percakapan': { title: 'Berkenalan dan Menyapa', minutes: 4, objectives: ['Memperkenalkan diri', 'Menyapa dan menanyakan kabar'] },
  'pemula-karier': { title: 'Di Tempat Kerja', minutes: 4, objectives: ['Menyebut tempat dan jam kerja', 'Meminta sesuatu dengan sopan'] },
  'pemula-perjalanan': { title: 'Bertanya Arah dan Harga', minutes: 4, objectives: ['Menanyakan lokasi', 'Menanyakan harga dan jarak'] },
  'pemula-ujian': { title: 'Persiapan Ujian', minutes: 4, objectives: ['Menyebut jadwal ujian', 'Meminta pengulangan dan waktu tambahan'] },
  'menengah-percakapan': { title: 'Obrolan Santai', minutes: 5, objectives: ['Menceritakan kebiasaan', 'Meminta petunjuk jalan', 'Menggunakan bentuk waktu yang tepat'] },
  'menengah-karier': { title: 'Melamar dan Bekerja', minutes: 5, objectives: ['Melamar posisi', 'Menjelaskan tanggung jawab'] },
  'menengah-perjalanan': { title: 'Memesan dan Bepergian', minutes: 5, objectives: ['Memesan hotel dan mengubah jadwal', 'Bertanya pada petugas'] },
  'menengah-ujian': { title: 'Ujian Berbicara', minutes: 5, objectives: ['Membicarakan persiapan ujian', 'Meminta lawan bicara berbicara lebih pelan'] },
  'mahir-percakapan': { title: 'Berbagi Pendapat dan Rencana', minutes: 5, objectives: ['Mengungkapkan pengandaian', 'Memberi saran', 'Menceritakan pengalaman'] },
  'mahir-karier': { title: 'Komunikasi Profesional', minutes: 5, objectives: ['Menyampaikan nilai diri', 'Mengusulkan rapat dan pertimbangan'] },
  'mahir-perjalanan': { title: 'Situasi Rumit Saat Bepergian', minutes: 5, objectives: ['Meminta perpanjangan dengan sopan', 'Menjelaskan masalah penerbangan'] },
  'mahir-ujian': { title: 'Ujian Tingkat Lanjut', minutes: 5, objectives: ['Menyampaikan opini dengan argumen', 'Memperjelas jawaban'] },
};

export const LESSONS = [];
for (const level of LEVELS) {
  for (const goal of GOALS) {
    const id = `${level.id}-${goal.id}`;
    const meta = LESSON_META[id];
    LESSONS.push({
      id,
      level: level.id,
      goal: goal.id,
      title: meta.title,
      minutes: meta.minutes,
      objectives: meta.objectives,
      steps: SENTENCES[level.id][goal.id].map((en) => ({ en, id: TRANSLATIONS[en] })),
    });
  }
}
