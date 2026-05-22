const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

function readCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, '../../data/cleaned_student_data.csv');
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

const topicMeta = {
  IT:        { emoji: '💻', desc: 'Pelajari dasar-dasar teknologi informasi dan komputer.' },
  Math:      { emoji: '➗', desc: 'Kuasai konsep matematika dari dasar hingga lanjutan.' },
  Science:   { emoji: '🔬', desc: 'Eksplorasi ilmu pengetahuan alam dan fenomenanya.' },
  English:   { emoji: '📖', desc: 'Tingkatkan kemampuan bahasa Inggris kamu.' },
  Arabic:    { emoji: '🌙', desc: 'Belajar bahasa dan budaya Arab secara mendalam.' },
  French:    { emoji: '🗼', desc: 'Kuasai bahasa Prancis untuk komunikasi global.' },
  Spanish:   { emoji: '💃', desc: 'Pelajari bahasa Spanyol yang kaya budaya.' },
  Quran:     { emoji: '📿', desc: 'Pelajari dan pahami Al-Quran dengan baik.' },
  Biology:   { emoji: '🧬', desc: 'Jelajahi dunia biologi dan makhluk hidup.' },
  Chemistry: { emoji: '⚗️', desc: 'Pahami reaksi kimia dan unsur-unsur materi.' },
  Geology:   { emoji: '🪨', desc: 'Pelajari struktur bumi dan fenomena geologis.' },
  History:   { emoji: '🏛️', desc: 'Telusuri peristiwa bersejarah yang membentuk dunia.' },
};

// GET /api/recommendation?skor=80&topic=Math
router.get('/', async (req, res) => {
  try {
    const skor = parseInt(req.query.skor) || 0;
    const topikSekarang = req.query.topic || null;

    const data = await readCSV();

    // Hitung engagement score rata-rata per topik
    const topicStats = {};
    data.forEach((row) => {
      const topic = row.Topic;
      if (!topic) return;
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, high: 0, medium: 0, low: 0, totalEngagement: 0 };
      }
      topicStats[topic].total++;
      if (row.Class === 'H') topicStats[topic].high++;
      if (row.Class === 'M') topicStats[topic].medium++;
      if (row.Class === 'L') topicStats[topic].low++;
      topicStats[topic].totalEngagement +=
        (parseInt(row.raisedhands) || 0) +
        (parseInt(row.VisITedResources) || 0) +
        (parseInt(row.AnnouncementsView) || 0) +
        (parseInt(row.Discussion) || 0);
    });

    // Tentukan level user berdasarkan skor kuis
    const levelUser = skor >= 80 ? 'H' : skor >= 60 ? 'M' : 'L';

    // Hitung skor rekomendasi per topik
    const rekomendasi = Object.entries(topicStats)
      .filter(([topic]) => topic !== topikSekarang)
      .map(([topic, stats]) => {
        const meta = topicMeta[topic] || { emoji: '📚', desc: 'Pelajari topik ini.' };
        const avgEngagement = Math.round(stats.totalEngagement / stats.total);
        const highPct = stats.high / stats.total;
        const mediumPct = stats.medium / stats.total;
        const lowPct = stats.low / stats.total;

        // Algoritma rekomendasi berdasarkan level user
        let skorRekomen = 0;
        if (levelUser === 'H') {
          // User pintar → rekomendasiin topik yang juga challenging (banyak siswa H)
          skorRekomen = (highPct * 0.6) + (avgEngagement / 400 * 0.4);
        } else if (levelUser === 'M') {
          // User sedang → rekomendasiin topik yang balanced
          skorRekomen = (mediumPct * 0.5) + (highPct * 0.3) + (avgEngagement / 400 * 0.2);
        } else {
          // User butuh bantuan → rekomendasiin topik yang banyak siswa berhasil (mudah)
          skorRekomen = (highPct * 0.4) + (mediumPct * 0.4) + (avgEngagement / 400 * 0.2);
        }

        const difficulty = highPct > 0.4 ? 'Mudah' : lowPct > 0.4 ? 'Sulit' : 'Sedang';
        const diffColor = difficulty === 'Mudah' ? '#10b981' : difficulty === 'Sulit' ? '#ef4444' : '#f59e0b';
        const alasan =
          levelUser === 'H'
            ? `Kamu berprestasi tinggi! Topik ini menantang dan cocok untuk level kamu.`
            : levelUser === 'M'
            ? `Topik ini sesuai dengan progres belajarmu saat ini.`
            : `Topik ini memiliki tingkat keberhasilan tinggi, cocok untuk membangun kepercayaan dirimu.`;

        return {
          topic,
          emoji: meta.emoji,
          desc: meta.desc,
          skorRekomen: Math.round(skorRekomen * 100),
          avgEngagement,
          difficulty,
          diffColor,
          totalSiswa: stats.total,
          highPct: Math.round(highPct * 100),
          alasan,
        };
      })
      .sort((a, b) => b.skorRekomen - a.skorRekomen)
      .slice(0, 6); // Top 6 rekomendasi

    res.json({
      success: true,
      levelUser,
      skor,
      topikSekarang,
      data: rekomendasi,
    });
  } catch (err) {
    console.error('Recommendation Error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat rekomendasi' });
  }
});

module.exports = router;