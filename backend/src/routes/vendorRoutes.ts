import express from 'express';
import {
  getAllVendors,
  createVendor,
  getVendorById,
  updateVendor,
  deleteVendor
} from '../controllers/vendorController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all vendor routes
router.use(authMiddleware);

router.get('/', getAllVendors);
router.post('/', createVendor);
router.get('/:id', getVendorById);
router.put('/:id', updateVendor);
router.delete('/:id', deleteVendor);

export default router;
