import { Campana } from "../models/campana.model.js";
import { UserCompany } from "../models/UserCompany.model.js";
import { CampanaUser } from "../models/campanaUser.model.js";

export const listCampanas = async (req, res) => {
  try {
    const user = req.user;

    const campanas = await Campana.findByUserCompany(user.id);

    res.json({
      total: campanas.length,
      campanas
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al listar campañas" });
  }
};

export const createCampana = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const user = req.user;

    if (!nombre) {
      return res.status(400).json({ msg: "El nombre es obligatorio" });
    }

    // Obtener empresa del usuario
    const companies = await UserCompany.getCompaniesByUser(user.id);

    if (!companies.length) {
      return res.status(403).json({ msg: "Usuario sin empresa asignada" });
    }

    const company_id = companies[0].company_id;

    const id = await Campana.create({
      company_id,
      nombre,
      descripcion
    });

    res.status(201).json({
      msg: "Campaña creada",
      id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear campaña" });
  }
};

export const assignUserToCampana = async (req, res) => {
  try {
    const { campana_id, user_id } = req.body;

    if (!campana_id || !user_id) {
      return res.status(400).json({ msg: "Datos incompletos" });
    }

    // Validar que pertenezcan a la misma empresa
    const allowed = await Campana.canAssignUserToCampana(campana_id, user_id);

    if (!allowed) {
      return res.status(403).json({
        msg: "El usuario no pertenece a la empresa de esta campaña"
      });
    }

    await Campana.assignUserToCampana(campana_id, user_id);

    res.json({ msg: "Usuario asignado correctamente a la campaña" });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ msg: "El usuario ya está asignado" });
    }

    console.error(error);
    res.status(500).json({ msg: "Error al asignar usuario a campaña" });
  }
};

export const getAssignableUsersByCampana = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar campaña
    const campana = await Campana.findById(id);
    if (!campana) {
      return res.status(404).json({ msg: "Campaña no encontrada" });
    }

    // 🔐 Admin solo puede ver campañas de su empresa
    if (req.user.role_id !== 1) {
      const [company] = await db.query(
        "SELECT company_id FROM user_companies WHERE user_id = ? LIMIT 1",
        [req.user.id]
      );

      if (!company.length || company[0].company_id !== campana.company_id) {
        return res.status(403).json({ msg: "Acceso denegado a esta campaña" });
      }
    }

    const users = await CampanaUser.getAssignableUsers(id);

    res.json({
      campana_id: Number(id),
      total: users.length,
      users
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al listar usuarios asignables" });
  }
};