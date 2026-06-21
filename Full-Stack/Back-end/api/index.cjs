const express = require('express');
const cors = require('cors');
const path = require('path');
const dataBalitaRoutes = require('../routes/dataBalitaRoutes.js');
const analisisRoutes = require('../routes/analisisRoutes.js');
const authRoutes = require('../routes/authRoutes.js');
const logger = require('../middleware/logger.js');
const errorHandler = require('../middleware/errorHandler.js');

const app = express();

// Middleware untuk mem-parsing body JSON
app.use(express.json());
// Middleware CORS agar bisa diakses dari frontend
app.use(cors());
// Middleware untuk mencatat log request
app.use(logger);

// Mengarahkan folder statis uploads mundur satu folder ke luar area 'api'
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mendaftarkan rute (routing) API
app.use('/api/auth', authRoutes);
app.use('/api/data-balita', dataBalitaRoutes);
app.use('/api/analisis', analisisRoutes);

// Middleware untuk menangani error secara terpusat
app.use(errorHandler);

// PERBAIKAN: Menggunakan export ala CommonJS yang dikenali Vercel Serverless
module.exports = app;