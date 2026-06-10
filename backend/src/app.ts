import cors from 'cors';
import express from 'express';
import { config } from './config';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/requestLogger';
import authRoutes from './routes/auth';
import groupBuyRoutes from './routes/groupbuy';
import joinRoutes from './routes/join';
import shopRoutes from './routes/shop';
import userRoutes from './routes/user';
import voteRoutes from './routes/vote';
import { success } from './utils/response';

export const app = express();

app.use(cors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin }));
app.use(express.json());
app.use(requestLogger);

app.get('/api/health', (_req, res) => success(res, { status: 'healthy' }));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groupbuys', groupBuyRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/joins', joinRoutes);
app.use('/api/votes', voteRoutes);

app.use(errorHandler);
