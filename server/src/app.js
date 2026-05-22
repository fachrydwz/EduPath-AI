const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const recommendationRoutes = require('./routes/recommendation');
const modulRoutes = require('./routes/modul');
const riwayatRoutes = require('./routes/riwayat');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/recommendation', recommendationRoutes);
app.use('/api/modul', modulRoutes);
app.use('/api/riwayat', riwayatRoutes);

module.exports = app;