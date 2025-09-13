import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import express from 'express';
import multer from 'multer';
import type { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';

// imports
import authRoutes from './routes/authRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

app.use(cookieParser());
app.use(express.json());

// routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/uploads', uploadRoutes);

// multer error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File size exceeds the allowed limit' });
    }
    return res.status(400).json({ message: err.message });
  }
  next(err);
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

function broadcast(data: any) {
  const message = JSON.stringify(data);
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

export { broadcast };

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
