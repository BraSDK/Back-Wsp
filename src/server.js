import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import roleRoutes from "./routes/role.routes.js";
import userRoutes from "./routes/user.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import companyRoutes from "./routes/company.routes.js";
import userCompanyRoutes from "./routes/userCompany.routes.js";
import campanaRoutes from "./routes/campana.routes.js";

// Swagger
import { specs, swaggerUi } from "./config/swagger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DOCUMENTACIÓN SWAGGER ---
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Docs - Gestión de Usuarios"
}));
app.use("/uploads", express.static(path.resolve("uploads")));
// --- RUTAS ---
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/user-company", userCompanyRoutes);
app.use("/api/campanas", campanaRoutes);

app.listen(3000, () => {
  console.log("Server en puerto 3000");
  console.log("Documentación Swagger disponible en: http://localhost:3000/api-docs");
});