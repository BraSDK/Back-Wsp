import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getCompanies,
  createCompany,
  updateCompany,
  changeStatus,
  deleteCompany
} from "../controllers/company.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: CRUD de empresas
 */

/**
 * @swagger
 * /api/companies/:
 *   get:
 *     summary: Listar todas las empresas
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas
 */
router.get("/", verifyToken, getCompanies);

/**
 * @swagger
 * /api/companies/:
 *   post:
 *     summary: Crear una empresa
 *     tags: [Companies]
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
 *               - ruc
 *               - address
 *               - admin_user_id
 *             properties:
 *               name:
 *                 type: string
 *               ruc:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               admin_user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Empresa creada correctamente
 */
router.post("/", verifyToken, createCompany);

/**
 * @swagger
 * /api/companies/{id}:
 *   put:
 *     summary: Actualizar una empresa
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               ruc:
 *                 type: string
 *               description:
 *                 type: string
 *               address:
 *                 type: string
 *               admin_user_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Empresa actualizada
 */
router.put("/:id", verifyToken, updateCompany);

/**
 * @swagger
 * /api/companies/{id}/status:
 *   patch:
 *     summary: Cambiar estado de una empresa (activo/inactivo)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch("/:id/status", verifyToken, changeStatus);

/**
 * @swagger
 * /api/companies/{id}:
 *   delete:
 *     summary: Eliminar empresa
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Empresa eliminada
 */
router.delete("/:id", verifyToken, deleteCompany);

// 🔹 Export default para ES Modules
export default router;
