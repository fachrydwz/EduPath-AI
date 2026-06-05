const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const recommendationRoutes = require('./routes/recommendation');
const modulRoutes = require('./routes/modul');
const riwayatRoutes = require('./routes/riwayat');
const dashboardRoutes = require('./routes/dashboard');
const achievementRoutes = require('./routes/achievement');
const pencapaianRoutes = require('./routes/pencapaian');
const catatanRoutes = require('./routes/catatan');
const userRoutes = require('./routes/user');
const modulDetailRoutes = require('./routes/modulDetail');


const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/modul', modulRoutes);
app.use('/api/riwayat', riwayatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/achievement', achievementRoutes);
app.use('/api/pencapaian', pencapaianRoutes);
app.use('/api/catatan', catatanRoutes);
app.use('/api/user', userRoutes);
app.use('/api/modul-detail', modulDetailRoutes);

module.exports = app;
