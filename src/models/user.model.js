import { db } from "../config/database.js";
import bcrypt from "bcryptjs";

export const User = {
  // Buscar usuario por email
  findByEmail: async (email) => {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  },

  // Buscar usuario por ID
  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role_id,
        r.name AS role_name,
        u.created_at
      FROM users u
      LEFT JOIN roles r ON r.id = u.role_id
      WHERE u.id = ?
    `, [id]);
    return rows[0];
  },

  findAdmins: async () => {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role_id,
        r.name AS role_name
      FROM users u
      INNER JOIN roles r ON r.id = u.role_id
      WHERE u.role_id IN (1, 2)
      ORDER BY u.name ASC
    `);

    return rows;
  },

  // Obtener usuarios por company_id
  findUsersByCompany: async (company_id) => {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.role_id, u.created_at
      FROM users u
      INNER JOIN user_companies uc ON uc.user_id = u.id
      WHERE uc.company_id = ?`,
      [company_id]
    );
    return rows;
  },

  // Buscar todos los usuarios
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role_id,
        r.name AS role_name,
        u.created_at
      FROM users u
      LEFT JOIN roles r ON r.id = u.role_id
      ORDER BY u.created_at DESC
    `);
    return rows;
  },

  // Crear usuario con rol
  create: async (name, email, password, role_id) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role_id]
    );
    return result;
  },

  // Actualizar usuario
  update: async (id, name, email, role_id) => {
    const [result] = await db.query(
      "UPDATE users SET name = ?, email = ?, role_id = ? WHERE id = ?",
      [name, email, role_id, id]
    );
    return result;
  },

  // Actualizar contraseña
  updatePassword: async (id, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, id]
    );
    return result;
  },

  // Eliminar usuario
  delete: async (id) => {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result;
  }
};