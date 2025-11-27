import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { listRolesController } from "../controllers/role.controller.js";


const router = Router();

// Obtener todos los roles
router.get("/", verifyToken, listRolesController);

export default router;
