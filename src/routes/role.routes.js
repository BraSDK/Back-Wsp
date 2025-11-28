import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { listRolesController } from "../controllers/role.controller.js";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 */

/**
 * @swagger
 * /api/roles/:
 *   get:
 *     summary: Listar todas los roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 */

// Obtener todos los roles
router.get("/", verifyToken, listRolesController);

export default router;
