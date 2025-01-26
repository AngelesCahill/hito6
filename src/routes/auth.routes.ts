import { Router } from 'express';
import { loginUser, registerUser, verifyToken, logoutUser } from '../controllers/auth.controller.js';
import { Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registro de nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.post('/register', registerUser);

// Esta ruta es para verificar si el token es válido
router.get('/verify', verifyToken, (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Token válido' });
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 *       401:
 *         description: No autorizado
 */
router.post('/logout', verifyToken, logoutUser);

export default router; 

/*
# Registro
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Verificar Token
curl -X GET http://localhost:4000/api/auth/verify \
  -H "Authorization: Bearer tu_token_aqui"

# Logout
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer tu_token_aqui"
*/