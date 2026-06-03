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

// GET semua catatan
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
      `SELECT * FROM notes
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [user.id]
    );

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

// tambah catatan
router.post('/', async (req, res) => {
  const user = getUserFromToken(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const { title, content } = req.body;

  try {
    await db.promise().query(
      `INSERT INTO notes
       (user_id,title,content)
       VALUES (?,?,?)`,
      [user.id, title, content]
    );

    res.json({
      success: true,
      message: 'Catatan berhasil ditambahkan',
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

// edit catatan
router.put('/:id', async (req, res) => {
  const user = getUserFromToken(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  const { title, content } = req.body;

  try {
    await db.promise().query(
      `UPDATE notes
       SET title=?, content=?
       WHERE id=? AND user_id=?`,
      [
        title,
        content,
        req.params.id,
        user.id,
      ]
    );

    res.json({
      success: true,
      message: 'Catatan berhasil diperbarui',
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

// hapus catatan
router.delete('/:id', async (req, res) => {
  const user = getUserFromToken(req);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized',
    });
  }

  try {
    await db.promise().query(
      `DELETE FROM notes
       WHERE id=? AND user_id=?`,
      [
        req.params.id,
        user.id,
      ]
    );

    res.json({
      success: true,
      message: 'Catatan berhasil dihapus',
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

module.exports = router;