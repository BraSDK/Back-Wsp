// controllers/role.controller.js
import { Role } from "../models/role.model.js";

export const listRolesController = async (req, res) => {
    try {
      const roles = await Role.findAll();
      res.json({ roles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Error al listar roles" });
    }
  };