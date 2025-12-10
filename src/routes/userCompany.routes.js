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

import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { assignUserToCompanyController, removeUserFromCompanyController } from "../controllers/userCompany.controller.js";

const router = express.Router();

router.post("/assign-company", verifyToken, assignUserToCompanyController);
router.post("/remove-company", verifyToken, removeUserFromCompanyController);

export default router;
