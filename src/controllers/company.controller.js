import { Company } from "../models/company.model.js";

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener empresas" });
  }
};

export const createCompany = async (req, res) => {
  try {
    const { name, ruc, description, address } = req.body;
    
    // Validaciones - campos obligatorios
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }
    
    if (!ruc || ruc.trim() === "") {
      return res.status(400).json({ error: "El RUC es obligatorio" });
    }
    
    if (!address || address.trim() === "") {
      return res.status(400).json({ error: "La dirección es obligatoria" });
    }

    console.log("Body:", req.body);
    console.log("Usuario token:", req.user);

    const admin_user_id = req.user.id;

    const result = await Company.create(
      name.trim(), 
      ruc.trim(), 
      description ? description.trim() : null, 
      address.trim(), 
      admin_user_id
    );
    
    res.json({ 
      msg: "Empresa creada correctamente", 
      companyId: result.insertId 
    });
  } catch (err) {
    console.error("Error al crear empresa:", err);
    res.status(500).json({ 
      error: "Error al crear empresa", 
      detail: err.message 
    });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, ruc, description, address, admin_user_id, status } = req.body;

    // Validaciones obligatorias
    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    if (!ruc || ruc.trim() === "") {
      return res.status(400).json({ error: "El RUC es obligatorio" });
    }

    if (!address || address.trim() === "") {
      return res.status(400).json({ error: "La dirección es obligatoria" });
    }

    // Llamada al modelo
    await Company.update(
      id,
      name.trim(),
      ruc.trim(),
      description ? description.trim() : null,
      address.trim(),
      admin_user_id ? admin_user_id : null,
      status ? status : null
    );

    res.json({ msg: "Empresa actualizada correctamente" });
  } catch (err) {
    console.error("Error al actualizar empresa:", err);
    res.status(500).json({ error: "Error al actualizar empresa", detail: err.message });
  }
};



export const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validación de estado
    if (!status || !["active", "inactive"].includes(status)) {
      return res.status(400).json({ 
        error: "Estado inválido. Debe ser 'active' o 'inactive'" 
      });
    }

    await Company.changeStatus(id, status);

    res.json({ msg: `Empresa ${status}` });
  } catch (err) {
    console.error("Error al cambiar estado:", err);
    res.status(500).json({ error: "Error al cambiar estado" });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    await Company.delete(id);

    res.json({ msg: "Empresa eliminada" });
  } catch (err) {
    console.error("Error al eliminar empresa:", err);
    res.status(500).json({ error: "Error al eliminar empresa" });
  }
};