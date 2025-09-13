import { Router } from 'express';
import { uploadBudgetFile } from '../middleware/uploadMiddleware.js';
import { uploadBudgetData } from '../controllers/fileUploadController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router:Router = Router();


router.post('/budget-data', authenticateToken,uploadBudgetFile.single('file'), uploadBudgetData);

export default router;
