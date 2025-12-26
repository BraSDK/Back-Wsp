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
  }

};
