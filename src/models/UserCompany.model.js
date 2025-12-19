import { db } from "../config/database.js";

export const UserCompany = {
  assignUserToCompany: async (user_id, company_id) => {
    const [result] = await db.query(
      "INSERT INTO user_companies (user_id, company_id) VALUES (?, ?)",
      [user_id, company_id]
    );
    return result;
  },

  getCompanyByUserId: async (user_id) => {
    const [rows] = await db.query(
      "SELECT company_id FROM user_companies WHERE user_id = ? LIMIT 1",
      [user_id]
    );
    return rows[0];
  },  

  removeUserFromCompany: async (user_id, company_id) => {
    const [result] = await db.query(
      "DELETE FROM user_companies WHERE user_id = ? AND company_id = ?",
      [user_id, company_id]
    );
    return result;
  },

  getUsersByCompany: async (company_id) => {
    const [rows] = await db.query(
      `SELECT u.id, u.name, u.email, u.role_id, r.name AS role_name
       FROM user_companies uc
       JOIN users u ON u.id = uc.user_id
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE uc.company_id = ?`,
      [company_id]
    );
    return rows;
  },

  getCompaniesByUser: async (user_id) => {
    const [rows] = await db.query(
      `SELECT 
         c.id AS company_id,
         c.name,
         c.ruc,
         c.description
       FROM user_companies uc
       JOIN companies c ON c.id = uc.company_id
       WHERE uc.user_id = ?`,
      [user_id]
    );
    return rows;
  },

  getMainCompanyByUser: async (user_id) => {
    const [rows] = await db.query(
      `
      SELECT 
        c.id,
        c.name,
        c.logo
      FROM user_companies uc
      JOIN companies c ON c.id = uc.company_id
      WHERE uc.user_id = ?
      ORDER BY uc.created_at ASC
      LIMIT 1
      `,
      [user_id]
    );
    return rows[0];
  }
  
};
