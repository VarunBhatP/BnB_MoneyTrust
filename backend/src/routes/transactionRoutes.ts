import { Router } from 'express';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController.js';

const router:Router = Router();
import {authenticateToken} from '../middleware/authMiddleware.js'


router.post('/', authenticateToken,createTransaction);
router.get('/', authenticateToken,getAllTransactions);
router.get('/:id', authenticateToken,getTransactionById);
router.put('/:id', authenticateToken,updateTransaction);
router.delete('/:id', authenticateToken,deleteTransaction);

export default router;
