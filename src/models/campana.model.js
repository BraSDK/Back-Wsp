import { db } from "../config/database.js";

export const Campana = {

  // Crear campaña
  create: async ({ company_id, nombre, descripcion }) => {
    const [result] = await db.query(
      `INSERT INTO campanas (company_id, nombre, descripcion)
       VALUES (?, ?, ?)`,
      [company_id, nombre, descripcion]
    );
    return result.insertId;
  },

  // Obtener campañas por empresa
  findByCompany: async (company_id) => {
    const [rows] = await db.query(
      `SELECT *
       FROM campanas
       WHERE company_id = ?
       ORDER BY created_at DESC`,
      [company_id]
    );
    return rows;
  },

  // Obtener campaña por ID
  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT *
       FROM campanas
       WHERE id = ?`,
      [id]
    );
    return rows[0];
  },

  // Asignar usuario a campaña
  assignUser: async (campana_id, user_id) => {
    const [result] = await db.query(
      `INSERT INTO campana_users (campana_id, user_id)
       VALUES (?, ?)`,
      [campana_id, user_id]
    );
    return result;
  },

  // Obtener campañas visibles para un usuario (por empresa)
  findByUserCompany: async (user_id) => {
    const [rows] = await db.query(`
      SELECT DISTINCT
        c.id,
        c.nombre,
        c.descripcion,
        c.created_at
      FROM campanas c
      JOIN companies co ON co.id = c.company_id
      JOIN user_companies uc ON uc.company_id = co.id
      WHERE uc.user_id = ?
      ORDER BY c.created_at DESC
    `, [user_id]);

    return rows;
  },

  // Verificar que usuario y campaña pertenecen a la misma empresa
  canAssignUserToCampana: async (campana_id, user_id) => {
    const [rows] = await db.query(`
      SELECT 1
      FROM campanas c
      JOIN companies co ON co.id = c.company_id
      JOIN user_companies uc ON uc.company_id = co.id
      WHERE c.id = ? AND uc.user_id = ?
      LIMIT 1
    `, [campana_id, user_id]);

    return rows.length > 0;
  },

  // Asignar usuario a campaña
  assignUserToCampana: async (campana_id, user_id) => {
    const [result] = await db.query(`
      INSERT INTO campana_users (campana_id, user_id)
      VALUES (?, ?)
    `, [campana_id, user_id]);

    return result;
  },

  // Obtener usuarios de una campaña
  getUsers: async (campana_id) => {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email
       FROM campana_users cu
       JOIN users u ON u.id = cu.user_id
       WHERE cu.campana_id = ?`,
      [campana_id]
    );
    return rows;
  },
  
  // 🔹 Listar usuarios asignados a una campaña
  getUsersByCampana: async (campana_id) => {
    const [rows] = await db.query(
      `SELECT 
          u.id,
          u.name,
          u.email,
          r.name AS role_name
        FROM campana_users cu
        INNER JOIN users u ON u.id = cu.user_id
        LEFT JOIN roles r ON r.id = u.role_id
        WHERE cu.campana_id = ?
        ORDER BY u.name ASC`,
      [campana_id]
    );

    return rows;
  },

  // 🔹 Eliminar usuario de una campaña
  removeUserFromCampana: async (campana_id, user_id) => {
    const [result] = await db.query(
      `DELETE FROM campana_users
        WHERE campana_id = ? AND user_id = ?
        LIMIT 1`,
      [campana_id, user_id]
    );

    return result.affectedRows > 0;
  }

};
