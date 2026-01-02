import { db } from "../config/database.js";

export const CampanaUser = {

  // 🔹 Usuarios de la empresa que NO están asignados a la campaña
  getAssignableUsers: async (campana_id) => {
    const [rows] = await db.query(`
      SELECT 
        u.id,
        u.name,
        u.email,
        r.name AS role_name
      FROM campanas ca
      JOIN user_companies uc ON uc.company_id = ca.company_id
      JOIN users u ON u.id = uc.user_id
      JOIN roles r ON r.id = u.role_id
      LEFT JOIN campana_users cu 
        ON cu.user_id = u.id 
        AND cu.campana_id = ca.id
      WHERE ca.id = ?
        AND cu.id IS NULL
      ORDER BY u.name
    `, [campana_id]);

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
