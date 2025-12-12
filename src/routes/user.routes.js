import { Router } from "express";
import { 
  getAdminUsersController,
  createUserController, 
  listUsersController,
  getUserController,
  updateUserController,
  deleteUserController
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios
 */

 /**
  * @swagger
  * components:
  *   schemas:
  *     User:
  *       type: object
  *       properties:
  *         id:
  *           type: integer
  *         name:
  *           type: string
  *         email:
  *           type: string
  *         role_id:
  *           type: integer
  *         created_at:
  *           type: string
  *           format: date-time
  *
  *     CreateUserRequest:
  *       type: object
  *       required:
  *         - name
  *         - email
  *         - password
  *         - role_id
  *       properties:
  *         name:
  *           type: string
  *         email:
  *           type: string
  *         password:
  *           type: string
  *         role_id:
  *           type: integer
  */

/**
 * @swagger
 * /api/users/admins:
 *   get:
 *     summary: Obtener usuarios con rol Admin o SuperAdmin
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios admin/superadmin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/admins", verifyToken, getAdminUsersController);

/**
 * @swagger
 * /api/users/create:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuario creado correctamente
 *                 createdBy:
 *                   type: string
 *                   example: admin@example.com
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Token inválido o ausente
 *       500:
 *         description: Error del servidor
 */
router.post("/create", verifyToken, createUserController);

/**
 * @swagger
 * /api/users/list:
 *   get:
 *     summary: Listar todos los usuarios (requiere autenticación)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/list", verifyToken, listUsersController);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener un usuario por ID (requiere autenticación)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get("/:id", verifyToken, getUserController);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualizar un usuario (requiere autenticación)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuario actualizado correctamente
 *                 updatedBy:
 *                   type: string
 *                   example: admin@example.com
 *       400:
 *         description: Datos inválidos o email ya en uso
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.put("/:id", verifyToken, updateUserController);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario (requiere autenticación)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Usuario eliminado correctamente
 *                 deletedBy:
 *                   type: string
 *                   example: admin@example.com
 *       400:
 *         description: No puedes eliminar tu propia cuenta
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.delete("/:id", verifyToken, deleteUserController);

export default router;