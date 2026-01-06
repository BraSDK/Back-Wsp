// src/services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { UserCompany } from "../models/UserCompany.model.js";

export const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw {
      status: 400,
      message: "Faltan datos obligatorios",
    };
  }

  const existing = await User.findByEmail(email);
  if (existing) {
    throw {
      status: 400,
      message: "El email ya está registrado",
    };
  }

  const defaultRoleId = 2; // usuario normal
  await User.create(name, email, password, defaultRoleId);

  return {
    msg: "Usuario registrado exitosamente",
    hint: "Ahora puedes iniciar sesión",
  };
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw {
      status: 400,
      message: "Email y contraseña requeridos",
    };
  }

  const user = await User.findByEmail(email);
  if (!user) {
    throw {
      status: 401,
      message: "Credenciales inválidas",
    };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw {
      status: 401,
      message: "Credenciales inválidas",
    };
  }

  const company = await UserCompany.getMainCompanyByUser(user.id);

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role_id: user.role_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "1h" }
  );

  return {
    msg: "Login exitoso",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
    },
    company: company || null,
  };
};

export const getMe = async (authUser) => {
  const fullUser = await User.findById(authUser.id);
  if (!fullUser) {
    throw {
      status: 404,
      message: "Usuario no encontrado",
    };
  }

  const companies = await UserCompany.getCompaniesByUser(authUser.id);

  return {
    id: fullUser.id,
    name: fullUser.name,
    email: fullUser.email,
    role_id: fullUser.role_id,
    isSuperAdmin: fullUser.role_id === 1,
    companies,
  };
};
