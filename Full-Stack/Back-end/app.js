import express from 'express';
import balitaRoutes from './routes/balitaRoutes.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json());
app.use(logger);

app.use('/api/balita', balitaRoutes);

app.use(errorHandler);

export default app;
