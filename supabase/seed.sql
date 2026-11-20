-- Data awal: 12 pelajaran bawaan. Jalankan setelah schema.sql. Aman dijalankan ulang.

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('pemula-percakapan', 'pemula', 'percakapan', 'Berkenalan dan Menyapa', 4, array['Memperkenalkan diri', 'Menyapa dan menanyakan kabar'], true, 10)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('pemula-percakapan', 0, 'Hello, my name is Rina.', 'Halo, namaku Rina.'),
  ('pemula-percakapan', 1, 'I like to drink tea every morning.', 'Aku suka minum teh setiap pagi.'),
  ('pemula-percakapan', 2, 'How are you today?', 'Apa kabar hari ini?'),
  ('pemula-percakapan', 3, 'Nice to meet you.', 'Senang bertemu denganmu.')
on conflict (lesson_id, position) do nothing;


insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('pemula-karier', 'pemula', 'karier', 'Di Tempat Kerja', 4, array['Menyebut tempat dan jam kerja', 'Meminta sesuatu dengan sopan'], true, 20)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('pemula-karier', 0, 'I work in a small office.', 'Aku bekerja di kantor kecil.'),
  ('pemula-karier', 1, 'My job starts at eight in the morning.', 'Pekerjaanku dimulai pukul delapan pagi.'),
  ('pemula-karier', 2, 'I want to learn new skills.', 'Aku ingin mempelajari keterampilan baru.'),
  ('pemula-karier', 3, 'Please send me an email.', 'Tolong kirimi aku email.')
on conflict (lesson_id, position) do nothing;

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('pemula-perjalanan', 'pemula', 'perjalanan', 'Bertanya Arah dan Harga', 4, array['Menanyakan lokasi', 'Menanyakan harga dan jarak'], true, 30)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('pemula-perjalanan', 0, 'Where is the bus station?', 'Di mana terminal bus?'),
  ('pemula-perjalanan', 1, 'I would like a ticket to Jakarta.', 'Aku ingin tiket ke Jakarta.'),
  ('pemula-perjalanan', 2, 'How much is the hotel room?', 'Berapa harga kamar hotelnya?'),
  ('pemula-perjalanan', 3, 'The airport is very far from here.', 'Bandara sangat jauh dari sini.')
on conflict (lesson_id, position) do nothing;

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('pemula-ujian', 'pemula', 'ujian', 'Persiapan Ujian', 4, array['Menyebut jadwal ujian', 'Meminta pengulangan dan waktu tambahan'], true, 40)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('pemula-ujian', 0, 'I study English every night.', 'Aku belajar bahasa Inggris setiap malam.'),
  ('pemula-ujian', 1, 'The test is on Friday.', 'Ujiannya hari Jumat.'),
  ('pemula-ujian', 2, 'Please repeat the question.', 'Tolong ulangi pertanyaannya.'),
  ('pemula-ujian', 3, 'I need more time to answer.', 'Aku butuh waktu lebih untuk menjawab.')
on conflict (lesson_id, position) do nothing;

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('menengah-percakapan', 'menengah', 'percakapan', 'Obrolan Santai', 5, array['Menceritakan kebiasaan', 'Meminta petunjuk jalan', 'Menggunakan bentuk waktu yang tepat'], true, 50)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('menengah-percakapan', 0, 'I usually go jogging with my friends on weekends.', 'Aku biasanya jogging bersama teman-temanku di akhir pekan.'),
  ('menengah-percakapan', 1, 'Could you tell me how to get to the nearest pharmacy?', 'Bisakah kamu memberi tahu cara menuju apotek terdekat?'),
  ('menengah-percakapan', 2, 'She told me that she would be late for dinner.', 'Dia bilang kepadaku bahwa dia akan terlambat makan malam.'),
  ('menengah-percakapan', 3, 'I have been learning English for two years.', 'Aku sudah belajar bahasa Inggris selama dua tahun.')
on conflict (lesson_id, position) do nothing;

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('menengah-karier', 'menengah', 'karier', 'Melamar dan Bekerja', 5, array['Melamar posisi', 'Menjelaskan tanggung jawab'], true, 60)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('menengah-karier', 0, 'I would like to apply for the marketing position.', 'Saya ingin melamar posisi pemasaran.'),
  ('menengah-karier', 1, 'My responsibilities include managing the weekly schedule.', 'Tanggung jawab saya mencakup mengatur jadwal mingguan.'),
  ('menengah-karier', 2, 'We need to finish this report before the deadline.', 'Kita perlu menyelesaikan laporan ini sebelum tenggat.'),
  ('menengah-karier', 3, 'I am looking forward to working with your team.', 'Saya menantikan kesempatan bekerja dengan tim Anda.')
on conflict (lesson_id, position) do nothing;

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('menengah-perjalanan', 'menengah', 'perjalanan', 'Memesan dan Bepergian', 5, array['Memesan hotel dan mengubah jadwal', 'Bertanya pada petugas'], true, 70)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('menengah-perjalanan', 0, 'We booked a hotel near the beach for three nights.', 'Kami memesan hotel dekat pantai untuk tiga malam.'),
  ('menengah-perjalanan', 1, 'Could I change my flight to an earlier time?', 'Bisakah saya mengubah penerbangan ke jam yang lebih awal?'),
  ('menengah-perjalanan', 2, 'Excuse me, does this train stop at Yogyakarta?', 'Permisi, apakah kereta ini berhenti di Yogyakarta?'),
  ('menengah-perjalanan', 3, 'The tour guide recommended a local restaurant.', 'Pemandu wisata merekomendasikan restoran lokal.')
on conflict (lesson_id, position) do nothing;

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('menengah-ujian', 'menengah', 'ujian', 'Ujian Berbicara', 5, array['Membicarakan persiapan ujian', 'Meminta lawan bicara berbicara lebih pelan'], true, 80)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('menengah-ujian', 0, 'I am preparing for the English speaking test next month.', 'Aku sedang mempersiapkan ujian berbicara bahasa Inggris bulan depan.'),
  ('menengah-ujian', 1, 'My teacher says that practice makes progress.', 'Guruku bilang bahwa latihan membuat kita berkembang.'),
  ('menengah-ujian', 2, 'Please speak more slowly so I can understand.', 'Tolong bicara lebih pelan agar aku bisa mengerti.'),
  ('menengah-ujian', 3, 'I think the second question was the most difficult.', 'Menurutku pertanyaan kedua adalah yang paling sulit.')
on conflict (lesson_id, position) do nothing;

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('mahir-percakapan', 'mahir', 'percakapan', 'Berbagi Pendapat dan Rencana', 5, array['Mengungkapkan pengandaian', 'Memberi saran', 'Menceritakan pengalaman'], true, 90)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('mahir-percakapan', 0, 'Despite the rain, we decided to walk home together.', 'Meskipun hujan, kami memutuskan berjalan pulang bersama.'),
  ('mahir-percakapan', 1, 'If I had more free time, I would travel around the world.', 'Kalau aku punya lebih banyak waktu luang, aku akan keliling dunia.'),
  ('mahir-percakapan', 2, 'She suggested that we meet at the coffee shop after work.', 'Dia menyarankan agar kita bertemu di kedai kopi setelah kerja.'),
  ('mahir-percakapan', 3, 'I have never been to such a beautiful place.', 'Aku belum pernah ke tempat seindah ini.')
on conflict (lesson_id, position) do nothing;

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('mahir-karier', 'mahir', 'karier', 'Komunikasi Profesional', 5, array['Menyampaikan nilai diri', 'Mengusulkan rapat dan pertimbangan'], true, 100)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('mahir-karier', 0, 'I believe my experience would be valuable to your organization.', 'Saya yakin pengalaman saya akan berharga bagi organisasi Anda.'),
  ('mahir-karier', 1, 'We should consider the impact of this decision on our clients.', 'Kita perlu mempertimbangkan dampak keputusan ini terhadap klien kita.'),
  ('mahir-karier', 2, 'She has extensive experience in project management.', 'Dia memiliki pengalaman luas dalam manajemen proyek.'),
  ('mahir-karier', 3, 'Could we schedule a meeting to discuss the budget?', 'Bisakah kita menjadwalkan rapat untuk membahas anggaran?')
on conflict (lesson_id, position) do nothing;

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('mahir-perjalanan', 'mahir', 'perjalanan', 'Situasi Rumit Saat Bepergian', 5, array['Meminta perpanjangan dengan sopan', 'Menjelaskan masalah penerbangan'], true, 110)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('mahir-perjalanan', 0, 'Would it be possible to extend our stay by one more night?', 'Mungkinkah kami memperpanjang masa menginap satu malam lagi?'),
  ('mahir-perjalanan', 1, 'We missed our connecting flight because of a delay.', 'Kami ketinggalan penerbangan lanjutan karena keterlambatan.'),
  ('mahir-perjalanan', 2, 'I would appreciate it if you could recommend a quiet hotel.', 'Saya akan sangat berterima kasih jika Anda bisa merekomendasikan hotel yang tenang.'),
  ('mahir-perjalanan', 3, 'The customs officer asked whether we had anything to declare.', 'Petugas bea cukai bertanya apakah kami membawa barang yang perlu dilaporkan.')
on conflict (lesson_id, position) do nothing;

insert into public.lessons (id, level, goal, title, minutes, objectives, published, sort_order)
values ('mahir-ujian', 'mahir', 'ujian', 'Ujian Tingkat Lanjut', 5, array['Menyampaikan opini dengan argumen', 'Memperjelas jawaban'], true, 120)
on conflict (id) do nothing;
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('mahir-ujian', 0, 'In my opinion, education should focus on developing critical thinking.', 'Menurut saya, pendidikan seharusnya berfokus pada pengembangan pemikiran kritis.'),
  ('mahir-ujian', 1, 'Although the topic was challenging, I managed to finish on time.', 'Meskipun topiknya menantang, saya berhasil menyelesaikannya tepat waktu.'),
  ('mahir-ujian', 2, 'Many students believe that regular practice improves speaking skills.', 'Banyak siswa percaya bahwa latihan rutin meningkatkan kemampuan berbicara.'),
  ('mahir-ujian', 3, 'I would like to clarify my answer to the previous question.', 'Saya ingin memperjelas jawaban saya untuk pertanyaan sebelumnya.')
on conflict (lesson_id, position) do nothing;

-- Frasa tambahan untuk jalur belajar (langkah 5 dan 6 per pelajaran).
insert into public.lesson_steps (lesson_id, position, en, id_text) values
  ('pemula-percakapan', 4, 'I live in Bandung with my family.', 'Aku tinggal di Bandung bersama keluargaku.'),
  ('pemula-percakapan', 5, 'What do you like to do on weekends?', 'Apa yang kamu suka lakukan saat akhir pekan?'),
  ('pemula-karier', 4, 'Could you help me with this task?', 'Bisakah kamu membantuku mengerjakan tugas ini?'),
  ('pemula-karier', 5, 'I have a meeting at ten in the morning.', 'Aku ada rapat pukul sepuluh pagi.'),
  ('pemula-perjalanan', 4, 'Does this bus go to the city center?', 'Apakah bus ini menuju pusat kota?'),
  ('pemula-perjalanan', 5, 'I need a room for one night.', 'Aku membutuhkan kamar untuk satu malam.'),
  ('pemula-ujian', 4, 'Could you explain the instructions?', 'Bisakah kamu menjelaskan petunjuknya?'),
  ('pemula-ujian', 5, 'I am ready to begin the test.', 'Aku siap memulai ujiannya.'),
  ('menengah-percakapan', 4, 'We often talk about our favorite movies.', 'Kami sering membicarakan film favorit kami.'),
  ('menengah-percakapan', 5, 'I would rather stay home this evening.', 'Aku lebih memilih tinggal di rumah malam ini.'),
  ('menengah-karier', 4, 'Could you give me feedback on this proposal?', 'Bisakah Anda memberi masukan tentang proposal ini?'),
  ('menengah-karier', 5, 'I can take responsibility for the next step.', 'Saya bisa bertanggung jawab atas langkah berikutnya.'),
  ('menengah-perjalanan', 4, 'Our reservation is under the name Rina.', 'Reservasi kami atas nama Rina.'),
  ('menengah-perjalanan', 5, 'Could you tell me when we need to check out?', 'Bisakah Anda memberi tahu kapan kami harus check-out?'),
  ('menengah-ujian', 4, 'I would like to add one more example.', 'Saya ingin menambahkan satu contoh lagi.'),
  ('menengah-ujian', 5, 'My answer is based on the information in the passage.', 'Jawaban saya didasarkan pada informasi dalam bacaan.'),
  ('mahir-percakapan', 4, 'We ended up taking the scenic route home.', 'Akhirnya kami memilih rute pulang yang pemandangannya indah.'),
  ('mahir-percakapan', 5, 'I wish I had asked her for advice earlier.', 'Andai saja aku meminta sarannya lebih awal.'),
  ('mahir-karier', 4, 'The data suggests that we should revise our approach.', 'Data menunjukkan bahwa kita sebaiknya meninjau ulang pendekatan kita.'),
  ('mahir-karier', 5, 'I will follow up with the team after the presentation.', 'Saya akan menindaklanjutinya bersama tim setelah presentasi.'),
  ('mahir-perjalanan', 4, 'Our departure was postponed due to severe weather.', 'Keberangkatan kami ditunda karena cuaca buruk.'),
  ('mahir-perjalanan', 5, 'Could you arrange transportation to the conference venue?', 'Bisakah Anda mengatur transportasi ke lokasi konferensi?'),
  ('mahir-ujian', 4, 'The evidence supports the conclusion that I have presented.', 'Bukti tersebut mendukung kesimpulan yang telah saya sampaikan.'),
  ('mahir-ujian', 5, 'There are several factors that should be taken into account.', 'Ada beberapa faktor yang perlu dipertimbangkan.')
on conflict (lesson_id, position) do nothing;
