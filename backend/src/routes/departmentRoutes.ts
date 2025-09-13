import { Router } from 'express';
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from '../controllers/departmentController.js';
import {authenticateToken} from '../middleware/authMiddleware.js'



const router:Router = Router();

router.post('/', authenticateToken,createDepartment);
router.get('/', authenticateToken,getAllDepartments);
router.get('/:id', authenticateToken,getDepartmentById);
router.put('/:id', authenticateToken,updateDepartment);
router.delete('/:id', authenticateToken,deleteDepartment);

export default router;
