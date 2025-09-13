import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();

// Simple CORS - allow everything
app.use(cors());

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'BnB MoneyTrust Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: [
      '/api/v1/auth',
      '/api/v1/ai',
      '/api/v1/transactions',
      '/api/v1/budgets',
      '/api/v1/vendors',
      '/api/v1/departments',
      '/api/v1/reports',
      '/api/v1/analytics'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
