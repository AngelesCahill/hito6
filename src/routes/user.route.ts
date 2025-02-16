import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/jsonwebtoken';

const router = Router();

// Rutas públicas
router.get('/', getUsers);
router.get('/:id', getUserById);

// Rutas protegidas (necesitan token)
router.put('/:id', verifyToken, updateUser);
router.delete('/:id', verifyToken, deleteUser);

export default router; 