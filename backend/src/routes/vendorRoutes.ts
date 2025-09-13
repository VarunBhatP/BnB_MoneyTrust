import { Router } from 'express';
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
} from '../controllers/vendorController.js';
import {authenticateToken} from '../middleware/authMiddleware.js'
const router:Router = Router();

router.post('/', authenticateToken,createVendor);
router.get('/', authenticateToken,getAllVendors);
router.get('/:id', authenticateToken,getVendorById);
router.put('/:id', authenticateToken,updateVendor);
router.delete('/:id', authenticateToken,deleteVendor);

export default router;
