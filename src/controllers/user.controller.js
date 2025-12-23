import { User } from "../models/user.model.js";
import { UserCompany } from "../models/UserCompany.model.js";

// controllers/user.controller.js
export const getAdminUsersController = async (req, res) => {
  try {
    const admins = await User.findAdmins();
    res.json({ users: admins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error obteniendo usuarios admin" });
  }
};

// CREAR USUARIO - Solo usuarios autenticados con role_id 1 o 2
export const createUserController = async (req, res) => {
  try {
    const { name, email, password, role_id, company_id } = req.body;

    // 🔒 Permisos
    if (![1, 2].includes(req.user.role_id)) {
      return res.status(403).json({ msg: "No tienes permisos para crear usuarios" });
    }

    // ❌ Admin NO puede crear super_admin
    if (req.user.role_id === 2 && role_id === 1) {
      return res.status(403).json({
        msg: "No tienes permiso para crear Super Administradores"
      });
    }

    // 📌 Validaciones básicas
    if (!name || !email || !password || !role_id) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    // 📌 SuperAdmin debe enviar empresa
    if (req.user.role_id === 1 && !company_id) {
      return res.status(400).json({
        msg: "Debes seleccionar una empresa"
      });
    }

    // 📌 Email único
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    // ✅ Crear usuario
    const newUser = await User.create(name, email, password, role_id);

    // 🔗 ASIGNACIÓN DE EMPRESA
    if (req.user.role_id === 2) {
      // Admin → hereda empresa
      const adminCompanies = await UserCompany.getCompaniesByUser(req.user.id);

      if (adminCompanies.length > 0) {
        await UserCompany.assignUserToCompany(
          newUser.insertId,
          adminCompanies[0].company_id
        );
      }
    }

    if (req.user.role_id === 1) {
      // SuperAdmin → empresa seleccionada
      await UserCompany.assignUserToCompany(
        newUser.insertId,
        company_id
      );
    }

    res.status(201).json({
      msg: "Usuario creado correctamente",
      user: {
        id: newUser.insertId,
        name,
        email,
        role_id
      },
      createdBy: req.user.email
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al crear usuario" });
  }
};

// LISTAR USUARIOS - Solo usuarios autenticados
export const listUsersController = async (req, res) => {
  try {
    const users = await User.findAll();

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al listar usuarios" });
  }
};

// OBTENER UN USUARIO POR ID - Solo usuarios autenticados
export const getUserController = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdWithCompany(id);
    
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // No enviar la contraseña
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role_name,
      created_at: user.created_at
    };

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener usuario" });
  }
};

// EDITAR USUARIO - Solo usuarios autenticados
export const updateUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role_id, password, company_id } = req.body;

    // Verificar que el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Validar datos
    if (!name || !email || !role_id) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }


    // Verificar si el email ya está en uso por otro usuario
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail.id !== parseInt(id)) {
      return res.status(400).json({ msg: "El email ya está en uso" });
    }

    // Actualizar datos básicos
    await User.update(id, name, email, role_id);

    // 🔥 actualizar empresa SOLO super admin
    if (req.user.role_id === 1 && company_id) {
      const companies = await UserCompany.getCompaniesByUser(id);

      if (companies.length > 0) {
        await UserCompany.updateUserCompany(id, company_id);
      } else {
        await UserCompany.assignUserToCompany(id, company_id);
      }
    }

    // Si se proporciona nueva contraseña, actualizarla
    if (password && password.trim() !== "") {
      await User.updatePassword(id, password);
    }

    // 🔥 Consultar usuario actualizado (con role_name)
    const updatedUser = await User.findByIdWithCompany(id);

    res.json({ 
      msg: "Usuario actualizado correctamente",
      updatedBy: req.user?.email || null,
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar usuario" });
  }
};

// ELIMINAR USUARIO - Solo usuarios autenticados
export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Evitar que un usuario se elimine a sí mismo
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ msg: "No puedes eliminar tu propia cuenta" });
    }

    // Eliminar usuario
    await User.delete(id);

    res.json({ 
      msg: "Usuario eliminado correctamente",
      deletedBy: req.user.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar usuario" });
  }
};