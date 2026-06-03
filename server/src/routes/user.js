const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

function getUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
  } catch {
    return null;
  }
}

// GET profile user
router.get('/profile', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const [rows] = await db.promise().query(
      'SELECT id, name, email FROM users WHERE id=?',
      [user.id]
    );

    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE profile user
router.put('/profile', async (req, res) => {
  const user = getUser(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { name, email, password } = req.body;

  try {
    // kalau password diisi → update juga
    if (password && password.trim() !== '') {
      const bcrypt = require('bcryptjs');
      const hashed = await bcrypt.hash(password, 10);

      await db.promise().query(
        'UPDATE users SET name=?, email=?, password=? WHERE id=?',
        [name, email, hashed, user.id]
      );
    } else {
      await db.promise().query(
        'UPDATE users SET name=?, email=? WHERE id=?',
        [name, email, user.id]
      );
    }

    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;