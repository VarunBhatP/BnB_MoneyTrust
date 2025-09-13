import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { budgetQuery, analyzeTransaction, getAIHealth } from '../controllers/aiController.js';

const router = express.Router();

// Protect all AI routes
router.use(authMiddleware);

router.get('/health', getAIHealth);
router.post('/budget-query', budgetQuery);
router.post('/analyze-transaction', analyzeTransaction);

export default router;
