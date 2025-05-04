import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import uploadRoutes from './routes/upload.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    aiEnabled: Boolean(config.openai.apiKey)
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api`);
  });
}

export default app;