const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Helper ambil user dari token (Sudah dilengkapi log error untuk debugging)
function getUserFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('--- DBG BACKEND: Header Authorization tidak ditemukan ---');
    return null;
  }
  
  try {
    const token = authHeader.split(' ')[1];
    // Memverifikasi token menggunakan secret key dari .env atau fallback 'secretkey'
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    
    console.log('--- DBG BACKEND: Token Valid! Isi Payload:', decoded);
    return decoded;
  } catch (err) {
    // Mencetak alasan utama token gagal didekripsi ke terminal backend
    console.error('--- DBG BACKEND: Gagal Verifikasi Token! Alasan:', err.message);
    return null;
  }
}

// GET /api/riwayat — ambil semua riwayat kuis user
router.get('/', async (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM quiz_history WHERE user_id = ? ORDER BY created_at DESC',
      [user.id]
    );

    const totalKuis = rows.length;
    const rataRata = totalKuis > 0
      ? Math.round(rows.reduce((sum, r) => sum + r.skor, 0) / totalKuis)
      : 0;
    const topikUnik = [...new Set(rows.map((r) => r.topic))].length;
    const skorTertinggi = totalKuis > 0 ? Math.max(...rows.map((r) => r.skor)) : 0;

    res.json({
      success: true,
      data: rows,
      stats: { totalKuis, rataRata, topikUnik, skorTertinggi },
    });
  } catch (err) {
    console.error('Riwayat Error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat' });
  }
});

// DELETE /api/riwayat/:id — hapus satu riwayat
router.delete('/:id', async (req, res) => {
  const user = getUserFromToken(req);
  if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

  try {
    await db.promise().query(
      'DELETE FROM quiz_history WHERE id = ? AND user_id = ?',
      [req.params.id, user.id]
    );
    res.json({ success: true, message: 'Riwayat dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Gagal menghapus riwayat' });
  }
});

module.exports = router;