import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all upload routes
router.use(authMiddleware);

router.post('/budget', (req, res) => {
  res.json({
    message: 'File upload processed successfully',
    filename: 'budget_data.csv',
    recordsProcessed: 0
  });
});

export default router;
