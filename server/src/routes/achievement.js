const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

function getUserFromToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  try {
    const token = authHeader.split(' ')[1];

    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'secretkey'
    );
  } catch {
    return null;
  }
}

router.get('/', async (req, res) => {
  const user = getUserFromToken(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    const [rows] = await db.promise().query(
      `
      SELECT *
      FROM quiz_history
      WHERE user_id = ?
      `,
      [user.id]
    );

    const totalQuiz = rows.length;

    const avgScore =
      totalQuiz > 0
        ? Math.round(
            rows.reduce(
              (sum, item) => sum + item.skor,
              0
            ) / totalQuiz
          )
        : 0;

    const topicCount = [
      ...new Set(rows.map((item) => item.topic))
    ].length;

    const achievements = [
      {
        id: 1,
        icon: '🥉',
        title: 'Pemula',
        desc: 'Menyelesaikan kuis pertama',
        unlocked: totalQuiz >= 1,
      },
      {
        id: 2,
        icon: '🥈',
        title: 'Rajin Belajar',
        desc: 'Mengerjakan 5 kuis',
        unlocked: totalQuiz >= 5,
      },
      {
        id: 3,
        icon: '🥇',
        title: 'Ahli Kuis',
        desc: 'Mengerjakan 10 kuis',
        unlocked: totalQuiz >= 10,
      },
      {
        id: 4,
        icon: '⭐',
        title: 'Nilai Tinggi',
        desc: 'Rata-rata nilai di atas 80',
        unlocked: avgScore >= 80,
      },
      {
        id: 5,
        icon: '🚀',
        title: 'Eksplorator',
        desc: 'Belajar 5 topik berbeda',
        unlocked: topicCount >= 5,
      },
    ];

    res.json({
      success: true,
      stats: {
        totalQuiz,
        avgScore,
        topicCount,
      },
      achievements,
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