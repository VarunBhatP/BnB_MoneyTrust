import { Router } from 'express';
import {
  createBudget,
  getAllBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
} from '../controllers/budgetController.js';
import {authenticateToken} from '../middleware/authMiddleware.js'

const router:Router = Router();

router.post('/', authenticateToken,createBudget);
router.get('/', authenticateToken,getAllBudgets);
router.get('/:id', authenticateToken,getBudgetById);
router.put('/:id', authenticateToken,updateBudget);
router.delete('/:id', authenticateToken,deleteBudget);

export default router;
