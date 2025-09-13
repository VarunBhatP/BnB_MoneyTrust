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

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'BnB MoneyTrust Backend API',
    status: 'running'
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/departments', departmentRoutes);
app.use('/api/v1/reports', reportsRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
