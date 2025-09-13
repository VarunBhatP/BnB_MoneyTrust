import express from 'express';
import cookieParser from 'cookie-parser';

//imports
import authRoutes from './routes/authRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js'
import departmentRoutes from './routes/departmentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

app.use(cookieParser()); 
app.use(express.json());

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/departments',departmentRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/vendors', vendorRoutes);
app.use('/api/v1/transactions', transactionRoutes);
app.use('/api/v1/uploads', uploadRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
