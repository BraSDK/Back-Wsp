import express from "express";
import { createCampana, getAssignableUsersByCampana} from "../controllers/campana.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { listCampanas } from "../controllers/campana.controller.js";
import { assignUserToCampana } from "../controllers/campana.controller.js";

const router = express.Router();



router.get("/", verifyToken, listCampanas);


/**
 * @swagger
 * /api/campanas:
 *   post:
 *     summary: Crear una campaña
 *     tags: [Campañas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre]
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campaña creada
 */
router.post("/", verifyToken, createCampana);

/**
 * @swagger
 * /api/campanas/assign-user:
 *   post:
 *     summary: Asignar usuario a campaña
 *     tags: [Campañas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [campana_id, user_id]
 *             properties:
 *               campana_id:
 *                 type: integer
 *               user_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usuario asignado correctamente
 *       400:
 *         description: Usuario ya asignado o datos incompletos
 *       403:
 *         description: Usuario no pertenece a la empresa
 *       500:
 *         description: Error del servidor
 */
router.post("/assign-user", verifyToken, assignUserToCampana);

/**
 * @swagger
 * /api/campanas/{id}/assignable-users:
 *   get:
 *     summary: Listar usuarios asignables a una campaña (misma empresa)
 *     tags: [Campañas]
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
 *         description: Lista de usuarios asignables
 */


// LISTAR USUARIOS ASIGNABLES
router.get("/:id/assignable-users", verifyToken, getAssignableUsersByCampana);

export default router;
