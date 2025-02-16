import { Router } from 'express';
import { register } from '../controllers/register.controller';

const router = Router();

// POST /api/register
router.post('/', register);

export default router;