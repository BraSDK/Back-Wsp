import { Company } from "../models/company.model.js";

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener empresas" });
  }
};

export const fetchCompanyIds = async (req, res) => {
  try {
    const { id } = req.params;

    const companies = await Company.findById(id);
    
    if (!companies) {
      return res.status(404).json({ msg: "Empresa no encontrado" });
    }

    // No enviar la contraseña
    const safeCompanies = {
      id: companies.id,
      name: companies.name,
      ruc: companies.ruc,
      description: companies.description,
      address: companies.address,
      admin_user_id: companies.admin_user_id,
      user_name: companies.user_name,
      created_at: companies.created_at
    };

    res.json({ companies: safeCompanies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener usuario" });
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
    // Verificar que el usuario existe
    const company = await Company.findById(id);
    // Validaciones obligatorias
    if (!company) {
      return res.status(404).json({ error: "Empresa no encontrada" });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    if (!ruc || ruc.trim() === "") {
      return res.status(400).json({ error: "El RUC es obligatorio" });
    }

    if (!address || address.trim() === "") {
      return res.status(400).json({ error: "La dirección es obligatoria" });
    }

    // Consultar usuario actualizado (con role_name)
      const updateCompany = await Company.findById(id);

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

    res.json({ 
      msg: "Empresa actualizada correctamente",
      company: updateCompany      
    });
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