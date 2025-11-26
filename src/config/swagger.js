import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Gestión de Usuarios",
      version: "1.0.0",
      description: "API RESTful para autenticación y gestión de usuarios con JWT",
      contact: {
        name: "Soporte API",
        email: "soporte@example.com"
      }
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Ingresa el token JWT obtenido al hacer login"
        }
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "ID del usuario",
              example: 1
            },
            name: {
              type: "string",
              description: "Nombre completo del usuario",
              example: "Juan Pérez"
            },
            email: {
              type: "string",
              format: "email",
              description: "Email del usuario",
              example: "juan@example.com"
            },
            role_id: {
              type: "integer",
              description: "ID del rol (1=Admin, 2=Usuario)",
              example: 2
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación"
            }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "juan@example.com"
            },
            password: {
              type: "string",
              format: "password",
              example: "password123"
            }
          }
        },
        RegisterRequest: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: {
              type: "string",
              example: "Juan Pérez"
            },
            email: {
              type: "string",
              format: "email",
              example: "juan@example.com"
            },
            password: {
              type: "string",
              format: "password",
              example: "password123"
            }
          }
        },
        CreateUserRequest: {
          type: "object",
          required: ["name", "email", "password", "role_id"],
          properties: {
            name: {
              type: "string",
              example: "María López"
            },
            email: {
              type: "string",
              format: "email",
              example: "maria@example.com"
            },
            password: {
              type: "string",
              format: "password",
              example: "password456"
            },
            role_id: {
              type: "integer",
              example: 2
            }
          }
        },
        UpdateUserRequest: {
          type: "object",
          required: ["name", "email", "role_id"],
          properties: {
            name: {
              type: "string",
              example: "Juan Actualizado"
            },
            email: {
              type: "string",
              format: "email",
              example: "juan.nuevo@example.com"
            },
            role_id: {
              type: "integer",
              example: 2
            },
            password: {
              type: "string",
              format: "password",
              description: "Opcional - Solo si deseas cambiar la contraseña",
              example: "nuevaPassword123"
            }
          }
        },
        Error: {
          type: "object",
          properties: {
            msg: {
              type: "string",
              example: "Mensaje de error"
            }
          }
        }
      }
    },
    security: []
  },
  apis: ["./src/routes/*.js"]
};

export const specs = swaggerJsdoc(options);
export { swaggerUi }; // ← CAMBIO AQUÍ: usar export { } en lugar de export const