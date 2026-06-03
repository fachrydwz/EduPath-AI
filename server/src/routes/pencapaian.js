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
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM quiz_history WHERE user_id = ?',
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

    const uniqueTopics =
      [...new Set(rows.map(r => r.topic))]
        .length;

    const highestScore =
      totalQuiz > 0
        ? Math.max(...rows.map(r => r.skor))
        : 0;

    const achievements = [
      {
        title: 'Pemula',
        icon: '🌱',
        unlocked: totalQuiz >= 1,
        desc: 'Mengerjakan kuis pertama'
      },
      {
        title: 'Rajin Belajar',
        icon: '📚',
        unlocked: totalQuiz >= 5,
        desc: 'Menyelesaikan 5 kuis'
      },
      {
        title: 'Penjelajah Topik',
        icon: '🧭',
        unlocked: uniqueTopics >= 3,
        desc: 'Belajar 3 topik berbeda'
      },
      {
        title: 'Master Quiz',
        icon: '🏆',
        unlocked: avgScore >= 80,
        desc: 'Rata-rata nilai minimal 80'
      },
      {
        title: 'Nilai Sempurna',
        icon: '⭐',
        unlocked: highestScore === 100,
        desc: 'Mendapat nilai 100'
      }
    ];

    res.json({
      success: true,
      data: {
        totalQuiz,
        avgScore,
        uniqueTopics,
        highestScore,
        achievements
      }
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;