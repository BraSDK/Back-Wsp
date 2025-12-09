import { UserCompany } from "../models/UserCompany.js";
import { User } from "../models/user.model.js";
import { Company } from "../models/company.model.js";

export const assignUserToCompanyController = async (req, res) => {
  try {
    const { user_id, company_id } = req.body;

    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const company = await Company.findById(company_id);
    if (!company) return res.status(404).json({ msg: "Empresa no encontrada" });

    // ❌ Lógica de rol
    if (req.user.role_id === 2) { // Admin
      // Obtener la empresa del admin
      const adminCompanies = await UserCompany.getCompaniesByUser(req.user.id);
      if (adminCompanies.length === 0) {
        return res.status(403).json({ msg: "Debes estar asignado a una empresa antes de asignar usuarios" });
      }

      // Admin solo puede asignar usuarios a SU empresa
      const adminCompanyId = adminCompanies[0].id; // Si el admin puede estar en varias, aquí se puede ajustar
      if (company_id !== adminCompanyId) {
        return res.status(403).json({ msg: "Solo puedes asignar usuarios a tu propia empresa" });
      }
    }

    // Super Admin (rol_id 1) puede asignar a cualquier empresa → no restricciones

    // Asignar usuario
    await UserCompany.assignUserToCompany(user_id, company_id);

    res.json({
      msg: "Usuario asignado a la empresa correctamente",
      assignedBy: req.user.email
    });

  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ msg: "Usuario ya está asignado a esta empresa" });
    }
    res.status(500).json({ msg: "Error al asignar usuario a la empresa" });
  }
};

export const removeUserFromCompanyController = async (req, res) => {
  try {
    const { user_id, company_id } = req.body;

    // Validar existencia del usuario
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const company = await Company.findById(company_id);
    if (!company) return res.status(404).json({ msg: "Empresa no encontrada" });

    // 🔹 Lógica de rol
    if (req.user.role_id === 2) { // Admin
      // Obtener empresas del Admin
      const adminCompanies = await UserCompany.getCompaniesByUser(req.user.id);
      if (adminCompanies.length === 0) {
        return res.status(403).json({ msg: "No puedes eliminar relaciones, no estás asignado a ninguna empresa" });
      }

      const adminCompanyId = adminCompanies[0].id;
      if (company_id !== adminCompanyId) {
        return res.status(403).json({ msg: "Solo puedes eliminar usuarios de tu propia empresa" });
      }
    }

    // Super Admin (rol 1) → no restricciones

    // Eliminar relación
    await UserCompany.removeUserFromCompany(user_id, company_id);

    res.json({
      msg: "Usuario eliminado de la empresa correctamente",
      removedBy: req.user.email
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar relación usuario–empresa" });
  }
};
