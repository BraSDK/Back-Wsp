import { db } from "../config/database.js";

export const Company = {
  findAll: async () => {
    const [rows] = await db.query(
      "SELECT * FROM companies ORDER BY created_at DESC"
    );
    return rows;
  },

  // Buscar empresa por ID
  findById: async (id) => {
    const [rows] = await db.query(`
      SELECT 
        c.id,
        c.name,
        c.ruc,
        c.description,
        c.address,
        c.admin_user_id,
        u.name AS user_name,
        c.created_at
      FROM companies c
      LEFT JOIN users u ON u.id = c.admin_user_id
      WHERE c.id = ?
    `, [id]);
    return rows[0];
  },

  create: async (name, ruc, description, address, admin_user_id) => {
    const [result] = await db.query(
      "INSERT INTO companies (name, ruc, description, address, admin_user_id) VALUES (?, ?, ?, ?, ?)",
      [name, ruc, description, address, admin_user_id]
    );
    return result;
  },

  update: async (id, name, ruc, description, address, admin_user_id = null, status = null) => {
    let query = "UPDATE companies SET name = ?, ruc = ?, description = ?, address = ?";
    const params = [name, ruc, description, address];

    if (admin_user_id !== null) {
      query += ", admin_user_id = ?";
      params.push(admin_user_id);
    }

  if (status !== null) {
    if (!["active", "inactive"].includes(status)) {
      throw new Error("Status inválido (debe ser 'active' o 'inactive')");
    }
    query += ", status = ?";
    params.push(status);
  }

  query += " WHERE id = ?";
  params.push(id);

  const [result] = await db.query(query, params);
  return result;
},


  changeStatus: async (id, status) => {
    const [result] = await db.query(
      "UPDATE companies SET status = ? WHERE id = ?",
      [status, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await db.query("DELETE FROM companies WHERE id = ?", [id]);
    return result;
  }
};
