import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import chatsRoutes from './routes/chats';
import chatRoutes from './routes/chat';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/chats', chatsRoutes);
app.use('/api/chat', chatRoutes);

app.use(errorMiddleware);

export default app;
