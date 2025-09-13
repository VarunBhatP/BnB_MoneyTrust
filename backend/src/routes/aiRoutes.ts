import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { proxyBudgetQuery, proxyAnalyzeTransaction, getAIHealth } from '../controllers/aiController.js';

const router:Router = Router();

router.post('/budget-query', authenticateToken, proxyBudgetQuery);
router.post('/analyze-transaction', authenticateToken, proxyAnalyzeTransaction);
router.get('/health', getAIHealth);

export default router;