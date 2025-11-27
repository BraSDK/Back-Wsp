// models/role.model.js
import { db } from "../config/database.js";

export const Role = {
  findAll: async () => {
    const [rows] = await db.query(`
      SELECT id, name
      FROM roles
      ORDER BY id
    `);
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query("SELECT id, name FROM roles WHERE id = ?", [id]);
    return rows[0];
  }
};
