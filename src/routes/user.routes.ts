import { Router } from 'express';
import { 
    getUsers, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser 
} from '../controllers/user.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';
import { Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', verifyToken, getUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', verifyToken, getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
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
router.post('/', verifyToken, createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
router.put('/:id', verifyToken, updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', verifyToken, deleteUser);

export default router;

/*
# Obtener todos los usuarios
curl -X GET http://localhost:4000/api/users \
  -H "Authorization: Bearer tu_token_aqui"

# Obtener usuario por ID
curl -X GET http://localhost:4000/api/users/id_usuario \
  -H "Authorization: Bearer tu_token_aqui"

# Crear usuario
curl -X POST http://localhost:4000/api/users \
  -H "Authorization: Bearer tu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{"name":"Nuevo Usuario","email":"nuevo@email.com","password":"123456"}'

# Actualizar usuario
curl -X PUT http://localhost:4000/api/users/id_usuario \
  -H "Authorization: Bearer tu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{"name":"Usuario Actualizado","email":"actualizado@email.com","password":"654321"}'

# Eliminar usuario
curl -X DELETE http://localhost:4000/api/users/id_usuario \
  -H "Authorization: Bearer tu_token_aqui"
*/ 