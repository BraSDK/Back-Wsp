/**
 * @swagger
 * tags:
 *   name: UserCompany
 *   description: Asignación y eliminación de usuarios a empresas (Super Admin podra eliminar cualquiera y admin solo de su empresa)
 */

/**
 * @swagger
 * /api/users/assign-company:
 *   post:
 *     summary: Asigna un usuario a una empresa
 *     tags: [UserCompany]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - companyId
 *             properties:
 *               user_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID del usuario a asignar
 *               company_id:
 *                 type: integer
 *                 example: 2
 *                 description: ID de la empresa
 *     responses:
 *       200:
 *         description: Usuario asignado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario asignado a la empresa correctamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/users/remove-company:
 *   post:
 *     summary: Remueve un usuario de una empresa
 *     tags: [UserCompany]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - companyId
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *                 description: ID del usuario a remover
 *               companyId:
 *                 type: integer
 *                 example: 2
 *                 description: ID de la empresa
 *     responses:
 *       200:
 *         description: Usuario removido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuario removido de la empresa correctamente
 *       400:
 *         description: Datos inválidos
 */

/**
 * @swagger
 * /api/user-company/by-company:
 *   get:
 *     summary: Obtener usuarios según el rol o empresa del usuario autenticado
 *     description: >
 *       Devuelve diferentes listas dependiendo del rol:
 *       
 *       - **SuperAdmin (role_id = 1):** Devuelve todos los usuarios.  
 *       - **Admin (role_id = 2):** Devuelve usuarios de su misma empresa.  
 *       - **Usuario Empresa (role_id = 3):** Devuelve usuarios role_id 3–4.  
 *       - **Usuario Normal (role_id = 4):** Devuelve solo su propio usuario.  
 *     tags: [UserCompany]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista filtrada de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: El administrador no tiene empresa asignada
 *       401:
 *         description: Token inválido o faltante
 *       500:
 *         description: Error interno del servidor
 */

import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { assignUserToCompanyController, removeUserFromCompanyController, getUsersByRoleAndCompany } from "../controllers/userCompany.controller.js";

const router = express.Router();

router.post("/assign-company", verifyToken, assignUserToCompanyController);
router.post("/remove-company", verifyToken, removeUserFromCompanyController);
router.get("/by-company", verifyToken, getUsersByRoleAndCompany);

export default router;
