const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');

function readCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, '../../data/materi_modul.csv');

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

// GET detail modul by topic
router.get('/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const data = await readCSV();

    const materi = data.filter((m) => m.topic === topic);

    if (materi.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Materi tidak ditemukan',
      });
    }

    const formatted = {
      topic,
      totalStep: materi.length,
      materi: materi.map((m) => ({
        step: Number(m.step),
        title: m.title,
        content: m.content,
        example: m.example,
      })),
    };

    res.json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;