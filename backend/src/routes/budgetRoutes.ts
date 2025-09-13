import express from 'express';
import {
  getAllBudgets,
  createBudget,
  getBudgetById,
  updateBudget,
  deleteBudget,
  addFeedback,
  getFeedback
} from '../controllers/budgetController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all budget routes
router.use(authMiddleware);

// Budget CRUD routes
router.get('/', getAllBudgets);
router.post('/', createBudget);
router.get('/:id', getBudgetById);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

// Simple upload endpoint (without file handling for now)
router.post('/upload', (req, res) => {
  res.json({
    message: 'File upload feature coming soon',
    status: 'success'
  });
});

// Feedback routes
router.post('/feedback', addFeedback);
router.get('/:budgetId/feedback', getFeedback);

export default router;
