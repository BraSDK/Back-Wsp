import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Rutas relacionadas con el dashboard del usuario logeado
 */

/**
 * @swagger
 * /api/dashboard/:
 *   get:
 *     summary: Obtener información del dashboard del usuario logeado
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Bienvenido al dashboard!
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Token inválido
 *       403:
 *         description: Token requerido
 */
router.get("/", verifyToken, (req, res) => {
  res.json({ msg: "Bienvenido al dashboard!", userId: req.user.id });
});

export default router;
