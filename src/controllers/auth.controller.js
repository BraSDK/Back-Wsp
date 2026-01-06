// src/controllers/auth.controller.js
import * as AuthService from "../services/auth.service.js";

export const registerController = async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      msg: error.message || "Error al registrar usuario",
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const result = await AuthService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      msg: error.message || "Error al iniciar sesión",
    });
  }
};

export const meController = async (req, res) => {
  try {
    const result = await AuthService.getMe(req.user);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({
      msg: error.message || "Error obteniendo usuario autenticado",
    });
  }
};
