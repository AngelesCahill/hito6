import { Router } from 'express';
import { 
    getProjects, 
    getProjectById, 
    getProjectsByUserId,
    createProject, 
    updateProject, 
    deleteProject 
} from '../controllers/project.controller';
import { verifyToken } from '../middlewares/jsonwebtoken';
import { upload } from '../controllers/project.controller';

const router = Router();

// Rutas públicas
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.get('/user/:userId', getProjectsByUserId);

// Rutas protegidas
router.post('/', verifyToken, upload.single('image'), createProject);
router.put('/:id', verifyToken, upload.single('image'), updateProject);
router.delete('/:id', verifyToken, deleteProject);

export default router; 