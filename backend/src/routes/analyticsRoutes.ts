import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware);

router.get('/overview', (req, res) => {
  res.json({
    totalTransactions: 0,
    totalAmount: 0,
    suspiciousCount: 0,
    averageRisk: 0,
    monthlyGrowth: 0
  });
});

router.get('/spending', (req, res) => {
  res.json({
    byDepartment: [],
    byCategory: [],
    timeline: []
  });
});

router.get('/trends', (req, res) => {
  res.json({
    monthly: [],
    quarterly: [],
    yearly: []
  });
});

router.get('/departments', (req, res) => {
  res.json([
    { id: '1', name: 'Education', spent: 350000, budget: 500000 },
    { id: '2', name: 'Healthcare', spent: 620000, budget: 750000 },
    { id: '3', name: 'Infrastructure', spent: 890000, budget: 1200000 }
  ]);
});

export default router;
