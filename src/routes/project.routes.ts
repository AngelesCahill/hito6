import { Router } from 'express';
import { 
    getProjects, 
    findAllProjectsByUserId, 
    createProject, 
    updateProject, 
    deleteProject 
} from '../controllers/project.controller.js';
import { verifyToken } from '../controllers/auth.controller.js';

const router = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Obtener todos los proyectos
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos con información del usuario
 */
router.get('/', verifyToken, getProjects);

/**
 * @swagger
 * /api/projects/my-projects:
 *   get:
 *     summary: Obtener todos los proyectos del usuario autenticado
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de proyectos del usuario autenticado
 */
router.get('/my-projects', verifyToken, findAllProjectsByUserId);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crear un nuevo proyecto
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 */
router.post('/', verifyToken, createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Actualizar un proyecto (solo el propietario puede actualizarlo)
 *     tags: [Projects]
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               img:
 *                 type: string
 */
router.put('/:id', verifyToken, updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto (solo el propietario puede eliminarlo)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', verifyToken, deleteProject);

export default router;

/*
# Obtener todos los proyectos
curl -X GET http://localhost:4000/api/projects \
  -H "Authorization: Bearer tu_token_aqui"

# Obtener proyectos del usuario autenticado
curl -X GET http://localhost:4000/api/projects/my-projects \
  -H "Authorization: Bearer tu_token_aqui"

# Crear proyecto
curl -X POST http://localhost:4000/api/projects \
  -H "Authorization: Bearer tu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Proyecto",
    "description": "Descripción del proyecto",
    "image": "url_de_la_imagen"
  }'

# Actualizar proyecto
curl -X PUT http://localhost:4000/api/projects/id_proyecto \
  -H "Authorization: Bearer tu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Proyecto Actualizado",
    "description": "Nueva descripción",
    "img": "nueva_url_imagen"
  }'

# Eliminar proyecto
curl -X DELETE http://localhost:4000/api/projects/id_proyecto \
  -H "Authorization: Bearer tu_token_aqui"
*/ 