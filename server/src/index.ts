import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

// Import middlewares
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import { errorHandler } from './middlewares/errorHandler';

// Import routes
import githubRoutes from './routes/githubRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Security and utility middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: true, // Dynamically mirrors request origin to allow access from any domain
  credentials: true
}));
app.use(express.json());

// Custom logging middleware
app.use(loggerMiddleware);

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'GitHub Developer DNA API is running' });
});

app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling middleware must be defined after all routes
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
