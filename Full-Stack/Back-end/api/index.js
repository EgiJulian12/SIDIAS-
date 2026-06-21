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

app.use(express.json());
app.use(cors());
app.use(logger);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/data-balita', dataBalitaRoutes);
app.use('/api/analisis', analisisRoutes);

app.use(errorHandler);

export default app;