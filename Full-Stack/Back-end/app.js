import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dataBalitaRoutes from './routes/dataBalitaRoutes.js';
import analisisRoutes from './routes/analisisRoutes.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware untuk mem-parsing body JSON
app.use(express.json());
// Middleware CORS agar bisa diakses dari frontend
app.use(cors());
// Middleware untuk mencatat log request
app.use(logger);
// Middleware static folder uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mendaftarkan rute (routing) API
app.use('/api/data-balita', dataBalitaRoutes);
app.use('/api/analisis', analisisRoutes);

// Middleware untuk menangani error secara terpusat
app.use(errorHandler);

export default app;
