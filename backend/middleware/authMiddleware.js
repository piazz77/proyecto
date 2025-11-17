import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: "Token requerido" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || "secreto123");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido" });
  }
};

export const soloAdmin = (req, res, next) => {
  if (req.user.rol !== "admin") {
    return res.status(403).json({ message: "Acceso solo para administradores" });
  }
  next();
};
