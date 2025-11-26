import jwt from "jsonwebtoken";

// Middleware para verificar que haya un token válido
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ msg: "Token requerido" });

  const token = authHeader.split(" ")[1]; // Bearer TOKEN
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Token inválido" });

    req.user = decoded; // Aquí guardamos id, email y role
    next();
  });
};
