import express from 'express';
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all transaction routes
router.use(authMiddleware);

router.get('/', getAllTransactions);
router.post('/', createTransaction);
router.get('/:id', getTransactionById);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;
