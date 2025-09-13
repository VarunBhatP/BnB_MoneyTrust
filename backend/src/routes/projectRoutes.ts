import { Router } from 'express';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import {authenticateToken} from '../middleware/authMiddleware.js'


const router:Router = Router();

router.post('/', authenticateToken,createProject);
router.get('/', authenticateToken,getAllProjects);
router.get('/:id', authenticateToken,getProjectById);
router.put('/:id', authenticateToken,updateProject);
router.delete('/:id', authenticateToken,deleteProject);

export default router;
