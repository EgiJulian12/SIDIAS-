import express from 'express';
import dataBalitaRoutes from './routes/dataBalitaRoutes.js';
import analisisRoutes from './routes/analisisRoutes.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(logger);

app.use('/api/data-balita', dataBalitaRoutes);
app.use('/api/analisis', analisisRoutes);

app.use(errorHandler);

export default app;
