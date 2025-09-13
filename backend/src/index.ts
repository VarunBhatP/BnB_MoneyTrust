import express from 'express';
import cookieParser from 'cookie-parser';

//imports
import authRoutes from './routes/authRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js'
import departmentRoutes from './routes/departmentRoutes.js'

const app = express();

app.use(cookieParser()); 
app.use(express.json());

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/budgets', budgetRoutes);
app.use('/api/v1/departments',departmentRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
