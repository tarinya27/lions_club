import 'express-async-errors';
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';
import { uploadsDir } from './upload';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        frameSrc: ['https://maps.google.com', 'https://www.google.com'],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'self'"],
      },
    },
  }),
);

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

if (process.env.NODE_ENV === 'production') {
  const clientDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../client/dist');
  app.use(express.static(clientDir));
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      next();
      return;
    }
    res.sendFile(path.join(clientDir, 'index.html'), (error) => {
      if (error) next();
    });
  });
}

export default app;
