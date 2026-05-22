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

router.get('/', async (req, res) => {
  try {
    const data = await readCSV();
    const topicStats = {};

    data.forEach((row) => {
      const topic = row.Topic;
      if (!topic) return;
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, high: 0, medium: 0, low: 0, engagement: 0 };
      }
      topicStats[topic].total++;
      if (row.Class === 'H') topicStats[topic].high++;
      if (row.Class === 'M') topicStats[topic].medium++;
      if (row.Class === 'L') topicStats[topic].low++;
      topicStats[topic].engagement +=
        (parseInt(row.raisedhands) || 0) +
        (parseInt(row.VisITedResources) || 0) +
        (parseInt(row.AnnouncementsView) || 0) +
        (parseInt(row.Discussion) || 0);
    });

    const moduls = Object.entries(topicStats).map(([topic, stats], index) => {
      const meta = topicMeta[topic] || { emoji: '📚', desc: 'Pelajari topik ini secara mendalam.' };
      const difficulty =
        stats.high / stats.total > 0.4 ? 'Mudah' :
        stats.low / stats.total > 0.4 ? 'Sulit' : 'Sedang';
      const diffColor =
        difficulty === 'Mudah' ? '#10b981' :
        difficulty === 'Sulit' ? '#ef4444' : '#f59e0b';

      return {
        id: index + 1,
        topic,
        emoji: meta.emoji,
        desc: meta.desc,
        totalSiswa: stats.total,
        difficulty,
        diffColor,
        avgEngagement: Math.round(stats.engagement / stats.total),
        highPct: Math.round((stats.high / stats.total) * 100),
        mediumPct: Math.round((stats.medium / stats.total) * 100),
        lowPct: Math.round((stats.low / stats.total) * 100),
      };
    });

    res.json({ success: true, data: moduls });
  } catch (err) {
    console.error('Modul Error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat modul' });
  }
});

router.get('/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const data = await readCSV();
    const filtered = data.filter((row) => row.Topic === topic);

    if (filtered.length === 0) {
      return res.status(404).json({ success: false, message: 'Modul tidak ditemukan' });
    }

    const meta = topicMeta[topic] || { emoji: '📚', desc: 'Pelajari topik ini secara mendalam.' };
    const high = filtered.filter((r) => r.Class === 'H').length;
    const medium = filtered.filter((r) => r.Class === 'M').length;
    const low = filtered.filter((r) => r.Class === 'L').length;
    const avgHands = Math.round(filtered.reduce((a, b) => a + (parseInt(b.raisedhands) || 0), 0) / filtered.length);
    const avgResources = Math.round(filtered.reduce((a, b) => a + (parseInt(b.VisITedResources) || 0), 0) / filtered.length);
    const avgDiscussion = Math.round(filtered.reduce((a, b) => a + (parseInt(b.Discussion) || 0), 0) / filtered.length);

    res.json({
      success: true,
      data: {
        topic,
        emoji: meta.emoji,
        desc: meta.desc,
        totalSiswa: filtered.length,
        distribusiKelas: { high, medium, low },
        engagement: { avgHands, avgResources, avgDiscussion },
      },
    });
  } catch (err) {
    console.error('Detail Modul Error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat detail modul' });
  }
});

module.exports = router;