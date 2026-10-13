import express from 'express';
import cors from 'cors';
import config from './config';
import apiRoutes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: config.clientOrigin }));
app.use(express.json());

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
