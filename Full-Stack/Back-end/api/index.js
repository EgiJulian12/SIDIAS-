import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dataBalitaRoutes from '../routes/dataBalitaRoutes.js';
import analisisRoutes from '../routes/analisisRoutes.js';
import authRoutes from '../routes/authRoutes.js';
import logger from '../middleware/logger.js';
import errorHandler from '../middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. CORS Middleware (Handle all origins & preflight OPTIONS explicitly)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type', 'Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());
app.use(logger);

// Health check routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'SIDIAS API is running smoothly' });
});

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'SIDIAS API is running smoothly' });
});

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routes with and without /api prefix for maximum serverless compatibility
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/data-balita', dataBalitaRoutes);
app.use('/data-balita', dataBalitaRoutes);

app.use('/api/analisis', analisisRoutes);
app.use('/analisis', analisisRoutes);

app.use(errorHandler);

export default app;