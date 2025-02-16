import { Router } from 'express';
import { logout } from '../controllers/loginOut.controller';
import { verifyToken } from '../middlewares/jsonwebtoken';

const router = Router();

router.post('/', verifyToken, logout);

export default router; 