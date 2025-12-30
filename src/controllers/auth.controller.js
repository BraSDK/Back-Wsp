import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UserCompany } from "../models/UserCompany.model.js";

// REGISTRO - Ruta pública (cualquiera puede registrarse)
export const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    // Verificar si el usuario ya existe
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ msg: "El email ya está registrado" });
    }

    // Crear usuario con role_id = 2 (usuario normal) por defecto
    const defaultRoleId = 2;
    await User.create(name, email, password, defaultRoleId);

    res.status(201).json({ 
      msg: "Usuario registrado exitosamente",
      hint: "Ahora puedes iniciar sesión"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al registrar usuario" });
  }
};

// LOGIN - Ruta pública
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email y contraseña requeridos" });
    }

    // Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    // 🔹 Obtener empresa del usuario
    const company = await UserCompany.getMainCompanyByUser(user.id);

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role_id: user.role_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "1h" }
    );

    res.json({
      msg: "Login exitoso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id
      },
      company: company || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
};

export const meController = async (req, res) => {
  try {
    const user = req.user; // viene del JWT

    const fullUser = await User.findById(user.id);

    const companies = await UserCompany.getCompaniesByUser(user.id);

    res.json({
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      role_id: fullUser.role_id,
      isSuperAdmin: fullUser.role_id === 1,
      companies
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error obteniendo usuario autenticado" });
  }
};
