const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const soalPerTopik = {
  IT: [
    {
      id: 1,
      question: 'Apa kepanjangan dari CPU?',
      options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'],
      answer: 'Central Processing Unit',
    },
    {
      id: 2,
      question: 'Protokol apa yang digunakan untuk mengakses halaman web?',
      options: ['FTP', 'HTTP', 'SMTP', 'SSH'],
      answer: 'HTTP',
    },
    {
      id: 3,
      question: 'Apa fungsi dari RAM pada komputer?',
      options: ['Menyimpan data permanen', 'Memproses grafis', 'Menyimpan data sementara', 'Mengatur daya listrik'],
      answer: 'Menyimpan data sementara',
    },
    {
      id: 4,
      question: 'Bahasa pemrograman mana yang dikenal sebagai bahasa web frontend?',
      options: ['Python', 'JavaScript', 'Java', 'C++'],
      answer: 'JavaScript',
    },
    {
      id: 5,
      question: 'Apa itu IP Address?',
      options: ['Nama domain website', 'Alamat unik perangkat dalam jaringan', 'Kecepatan internet', 'Jenis kabel jaringan'],
      answer: 'Alamat unik perangkat dalam jaringan',
    },
  ],
  Math: [
    {
      id: 1,
      question: 'Berapa hasil dari 12 × 15?',
      options: ['170', '180', '175', '185'],
      answer: '180',
    },
    {
      id: 2,
      question: 'Apa nilai dari π (pi) yang umum digunakan?',
      options: ['3.14', '3.41', '3.12', '3.16'],
      answer: '3.14',
    },
    {
      id: 3,
      question: 'Jika x + 5 = 12, berapa nilai x?',
      options: ['5', '6', '7', '8'],
      answer: '7',
    },
    {
      id: 4,
      question: 'Berapa luas lingkaran dengan jari-jari 7cm? (π = 3.14)',
      options: ['153.86 cm²', '143.86 cm²', '163.86 cm²', '133.86 cm²'],
      answer: '153.86 cm²',
    },
    {
      id: 5,
      question: 'Apa hasil dari akar kuadrat 144?',
      options: ['11', '12', '13', '14'],
      answer: '12',
    },
  ],
  Science: [
    {
      id: 1,
      question: 'Apa rumus kimia dari air?',
      options: ['CO2', 'H2O', 'O2', 'NaCl'],
      answer: 'H2O',
    },
    {
      id: 2,
      question: 'Planet apa yang paling dekat dengan matahari?',
      options: ['Venus', 'Mars', 'Merkurius', 'Bumi'],
      answer: 'Merkurius',
    },
    {
      id: 3,
      question: 'Apa fungsi klorofil pada tumbuhan?',
      options: ['Menyerap air', 'Menyerap cahaya matahari untuk fotosintesis', 'Mengangkut nutrisi', 'Melindungi sel'],
      answer: 'Menyerap cahaya matahari untuk fotosintesis',
    },
    {
      id: 4,
      question: 'Berapa kecepatan cahaya dalam vakum?',
      options: ['300.000 km/s', '150.000 km/s', '200.000 km/s', '250.000 km/s'],
      answer: '300.000 km/s',
    },
    {
      id: 5,
      question: 'Apa nama proses tumbuhan membuat makanan sendiri?',
      options: ['Respirasi', 'Fotosintesis', 'Transpirasi', 'Fermentasi'],
      answer: 'Fotosintesis',
    },
  ],
  English: [
    {
      id: 1,
      question: 'What is the plural form of "child"?',
      options: ['Childs', 'Childes', 'Children', 'Childrens'],
      answer: 'Children',
    },
    {
      id: 2,
      question: 'Which sentence is grammatically correct?',
      options: ["She don't like coffee", "She doesn't likes coffee", "She doesn't like coffee", "She not like coffee"],
      answer: "She doesn't like coffee",
    },
    {
      id: 3,
      question: 'What is the past tense of "go"?',
      options: ['Goed', 'Gone', 'Goes', 'Went'],
      answer: 'Went',
    },
    {
      id: 4,
      question: 'Which word is a synonym of "happy"?',
      options: ['Sad', 'Angry', 'Joyful', 'Tired'],
      answer: 'Joyful',
    },
    {
      id: 5,
      question: 'What is the correct article for "umbrella"?',
      options: ['A umbrella', 'An umbrella', 'The umbrella', 'Some umbrella'],
      answer: 'An umbrella',
    },
  ],
  Arabic: [
    {
      id: 1,
      question: 'Apa arti kata "كِتَابٌ" (kitabun) dalam bahasa Indonesia?',
      options: ['Pensil', 'Buku', 'Meja', 'Kursi'],
      answer: 'Buku',
    },
    {
      id: 2,
      question: 'Huruf hijaiyah ada berapa jumlahnya?',
      options: ['26', '28', '30', '32'],
      answer: '28',
    },
    {
      id: 3,
      question: 'Apa arti "مَدْرَسَةٌ" (madrasatun)?',
      options: ['Rumah', 'Masjid', 'Sekolah', 'Pasar'],
      answer: 'Sekolah',
    },
    {
      id: 4,
      question: 'Apa arti "صَدِيقٌ" (shadiqun)?',
      options: ['Musuh', 'Guru', 'Teman', 'Keluarga'],
      answer: 'Teman',
    },
    {
      id: 5,
      question: 'Bagaimana cara menulis "Assalamualaikum" dalam huruf Arab?',
      options: ['اَلسَّلَامُ عَلَيْكُمْ', 'بِسْمِ اللَّهِ', 'اَلْحَمْدُ لِلَّهِ', 'اَللَّهُ أَكْبَرُ'],
      answer: 'اَلسَّلَامُ عَلَيْكُمْ',
    },
  ],
  French: [
    {
      id: 1,
      question: 'Apa arti "Bonjour" dalam bahasa Indonesia?',
      options: ['Selamat malam', 'Selamat tinggal', 'Selamat pagi/halo', 'Terima kasih'],
      answer: 'Selamat pagi/halo',
    },
    {
      id: 2,
      question: 'Bagaimana cara mengatakan "terima kasih" dalam bahasa Prancis?',
      options: ["S'il vous plaît", 'Merci', 'Excusez-moi', 'De rien'],
      answer: 'Merci',
    },
    {
      id: 3,
      question: 'Apa arti "Je m\'appelle" dalam bahasa Indonesia?',
      options: ['Aku suka', 'Nama saya', 'Aku tinggal di', 'Aku pergi'],
      answer: 'Nama saya',
    },
    {
      id: 4,
      question: 'Angka "cinq" dalam bahasa Prancis artinya?',
      options: ['3', '4', '5', '6'],
      answer: '5',
    },
    {
      id: 5,
      question: 'Apa arti "Au revoir"?',
      options: ['Halo', 'Selamat datang', 'Sampai jumpa', 'Maaf'],
      answer: 'Sampai jumpa',
    },
  ],
  Spanish: [
    {
      id: 1,
      question: 'Apa arti "Hola" dalam bahasa Indonesia?',
      options: ['Selamat tinggal', 'Halo', 'Terima kasih', 'Maaf'],
      answer: 'Halo',
    },
    {
      id: 2,
      question: 'Bagaimana cara mengatakan "Terima kasih" dalam bahasa Spanyol?',
      options: ['De nada', 'Por favor', 'Gracias', 'Lo siento'],
      answer: 'Gracias',
    },
    {
      id: 3,
      question: 'Apa arti "Buenos días"?',
      options: ['Selamat malam', 'Selamat siang', 'Selamat pagi', 'Selamat tidur'],
      answer: 'Selamat pagi',
    },
    {
      id: 4,
      question: 'Angka "diez" dalam bahasa Spanyol artinya?',
      options: ['8', '9', '10', '11'],
      answer: '10',
    },
    {
      id: 5,
      question: 'Apa arti "Me llamo"?',
      options: ['Aku suka', 'Aku tinggal di', 'Nama saya', 'Aku dari'],
      answer: 'Nama saya',
    },
  ],
  Quran: [
    {
      id: 1,
      question: 'Surah apa yang disebut sebagai "Induk Al-Quran"?',
      options: ['Al-Baqarah', 'Al-Fatihah', 'Al-Ikhlas', 'Yasin'],
      answer: 'Al-Fatihah',
    },
    {
      id: 2,
      question: 'Berapa jumlah surah dalam Al-Quran?',
      options: ['112', '113', '114', '115'],
      answer: '114',
    },
    {
      id: 3,
      question: 'Surah terpanjang dalam Al-Quran adalah?',
      options: ['Al-Imran', 'An-Nisa', 'Al-Baqarah', 'Al-Maidah'],
      answer: 'Al-Baqarah',
    },
    {
      id: 4,
      question: 'Surah terpendek dalam Al-Quran adalah?',
      options: ['Al-Ikhlas', 'Al-Falaq', 'Al-Kautsar', 'An-Nas'],
      answer: 'Al-Kautsar',
    },
    {
      id: 5,
      question: 'Wahyu pertama Al-Quran diturunkan di?',
      options: ['Madinah', 'Mekah', 'Gua Hira', 'Masjidil Haram'],
      answer: 'Gua Hira',
    },
  ],
  Biology: [
    {
      id: 1,
      question: 'Apa unit terkecil dari makhluk hidup?',
      options: ['Organ', 'Jaringan', 'Sel', 'Molekul'],
      answer: 'Sel',
    },
    {
      id: 2,
      question: 'Apa fungsi mitokondria dalam sel?',
      options: ['Sintesis protein', 'Menghasilkan energi (ATP)', 'Menyimpan informasi genetik', 'Fotosintesis'],
      answer: 'Menghasilkan energi (ATP)',
    },
    {
      id: 3,
      question: 'Proses pembelahan sel untuk reproduksi disebut?',
      options: ['Mitosis', 'Meiosis', 'Osmosis', 'Difusi'],
      answer: 'Meiosis',
    },
    {
      id: 4,
      question: 'DNA tersimpan di bagian sel mana?',
      options: ['Sitoplasma', 'Mitokondria', 'Nukleus', 'Ribosom'],
      answer: 'Nukleus',
    },
    {
      id: 5,
      question: 'Apa nama ilmuwan yang menemukan teori evolusi?',
      options: ['Isaac Newton', 'Albert Einstein', 'Charles Darwin', 'Gregor Mendel'],
      answer: 'Charles Darwin',
    },
  ],
  Chemistry: [
    {
      id: 1,
      question: 'Apa simbol kimia untuk emas?',
      options: ['Ag', 'Au', 'Fe', 'Cu'],
      answer: 'Au',
    },
    {
      id: 2,
      question: 'Berapa nomor atom Hidrogen?',
      options: ['1', '2', '3', '4'],
      answer: '1',
    },
    {
      id: 3,
      question: 'Apa hasil reaksi antara asam dan basa?',
      options: ['Oksida', 'Garam dan air', 'Gas', 'Logam'],
      answer: 'Garam dan air',
    },
    {
      id: 4,
      question: 'Rumus kimia garam dapur adalah?',
      options: ['KCl', 'NaOH', 'NaCl', 'CaCl2'],
      answer: 'NaCl',
    },
    {
      id: 5,
      question: 'Unsur yang paling banyak di atmosfer bumi adalah?',
      options: ['Oksigen', 'Karbon dioksida', 'Nitrogen', 'Argon'],
      answer: 'Nitrogen',
    },
  ],
  Geology: [
    {
      id: 1,
      question: 'Lapisan terluar bumi disebut?',
      options: ['Mantel', 'Inti', 'Kerak', 'Astenosfer'],
      answer: 'Kerak',
    },
    {
      id: 2,
      question: 'Batuan yang terbentuk dari magma yang mendingin disebut?',
      options: ['Batuan sedimen', 'Batuan metamorf', 'Batuan beku', 'Batuan karbonat'],
      answer: 'Batuan beku',
    },
    {
      id: 3,
      question: 'Skala apa yang digunakan untuk mengukur kekuatan gempa?',
      options: ['Skala Celsius', 'Skala Richter', 'Skala Beaufort', 'Skala Mohs'],
      answer: 'Skala Richter',
    },
    {
      id: 4,
      question: 'Apa nama fenomena pergerakan lempeng bumi?',
      options: ['Erosi', 'Tektonik lempeng', 'Sedimentasi', 'Vulkanisme'],
      answer: 'Tektonik lempeng',
    },
    {
      id: 5,
      question: 'Fosil biasanya ditemukan di jenis batuan apa?',
      options: ['Batuan beku', 'Batuan metamorf', 'Batuan sedimen', 'Batuan granit'],
      answer: 'Batuan sedimen',
    },
  ],
  History: [
    {
      id: 1,
      question: 'Siapa yang menemukan benua Amerika?',
      options: ['Vasco da Gama', 'Ferdinand Magellan', 'Christopher Columbus', 'James Cook'],
      answer: 'Christopher Columbus',
    },
    {
      id: 2,
      question: 'Perang Dunia II berakhir pada tahun?',
      options: ['1943', '1944', '1945', '1946'],
      answer: '1945',
    },
    {
      id: 3,
      question: 'Revolusi Industri pertama kali terjadi di negara mana?',
      options: ['Prancis', 'Amerika Serikat', 'Jerman', 'Inggris'],
      answer: 'Inggris',
    },
    {
      id: 4,
      question: 'Tembok Berlin runtuh pada tahun?',
      options: ['1987', '1988', '1989', '1990'],
      answer: '1989',
    },
    {
      id: 5,
      question: 'Siapa pemimpin Revolusi Prancis?',
      options: ['Napoleon Bonaparte', 'Louis XVI', 'Maximilien Robespierre', 'Marie Antoinette'],
      answer: 'Napoleon Bonaparte',
    },
  ],
};

// GET /api/quiz/:topic — ambil soal berdasarkan topik
router.get('/:topic', (req, res) => {
  const { topic } = req.params;
  const soal = soalPerTopik[topic];

  if (!soal) {
    return res.status(404).json({ success: false, message: 'Soal untuk topik ini belum tersedia' });
  }

  const shuffled = [...soal].sort(() => Math.random() - 0.5);
  res.json({ success: true, topic, data: shuffled });
});

// POST /api/quiz/submit — hitung skor + simpan ke DB
router.post('/submit', async (req, res) => {
  const { topic, answers } = req.body;
  const soal = soalPerTopik[topic];

  if (!soal) {
    return res.status(404).json({ success: false, message: 'Topik tidak ditemukan' });
  }

  let benar = 0;
  answers.forEach(({ id, jawaban }) => {
    const soalItem = soal.find((s) => s.id === id);
    if (soalItem && soalItem.answer === jawaban) benar++;
  });

  const skor = Math.round((benar / soal.length) * 100);
  const grade = skor >= 80 ? 'H' : skor >= 60 ? 'M' : 'L';
  const pesan =
    skor >= 80 ? '🎉 Luar biasa! Kamu menguasai topik ini dengan baik!' :
    skor >= 60 ? '👍 Bagus! Terus tingkatkan kemampuanmu!' :
    '💪 Jangan menyerah! Coba pelajari lagi materinya.';

  // Simpan ke DB jika ada token user
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
      await db.promise().query(
        'INSERT INTO quiz_history (user_id, topic, skor, benar, total, grade) VALUES (?, ?, ?, ?, ?, ?)',
        [decoded.id, topic, skor, benar, soal.length, grade]
      );
    }
  } catch (err) {
    // Tetap lanjut walau simpan gagal (user mungkin tidak login via token)
    console.log('Simpan riwayat skip:', err.message);
  }

  res.json({ success: true, skor, benar, total: soal.length, grade, pesan });
});

module.exports = router;