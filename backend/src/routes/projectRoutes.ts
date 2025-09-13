import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all project routes
router.use(authMiddleware);

// Sample project data
const sampleProjects = [
  { id: '1', name: 'School Infrastructure', departmentId: '1' },
  { id: '2', name: 'Medical Equipment', departmentId: '2' },
  { id: '3', name: 'Road Construction', departmentId: '3' },
];

router.get('/', (req, res) => {
  res.json(sampleProjects);
});

router.post('/', (req, res) => {
  const { name, departmentId } = req.body;
  const newProject = {
    id: (sampleProjects.length + 1).toString(),
    name,
    departmentId
  };
  sampleProjects.push(newProject);
  res.status(201).json(newProject);
});

export default router;
