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
      message: 'Unauthorized'
    });
  }

  try {
    const [history] = await db.promise().query(
      `
      SELECT *
      FROM quiz_history
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [user.id]
    );

    const totalQuiz = history.length;

    const avgScore =
      totalQuiz > 0
        ? Math.round(
            history.reduce(
              (sum, item) => sum + item.skor,
              0
            ) / totalQuiz
          )
        : 0;

    const topicCount = [
      ...new Set(history.map((item) => item.topic))
    ].length;

    const progress = Math.min(
      Math.round((topicCount / 12) * 100),
      100
    );

    const latestTopics = history
      .slice(0, 3)
      .map((item) => ({
        nama: item.topic,
        persen: item.skor
      }));

    res.json({
      success: true,
      data: {
        progress,
        totalQuiz,
        avgScore,
        topicCount,
        latestTopics
      }
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;