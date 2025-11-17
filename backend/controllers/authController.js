import connection from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const { nombre, email, password, rol } = req.body;

  // Si no mandan rol, asigno "usuario"
  const userRol = rol === "admin" ? "admin" : "user";

  const hashedPassword = bcrypt.hashSync(password, 8);

  const sql = "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)";

  connection.query(sql, [nombre, email, hashedPassword, userRol], (err, result) => {
    if (err) {
      console.error("Error al registrar usuario:", err);
      return res.status(500).json({ message: "Error al registrar usuario", error: err });
    }
    res.json({ message: "Usuario registrado con éxito" });
  });
};


export const login = (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";
  connection.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Error al buscar usuario" });
    if (results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) return res.status(401).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: user.id, rol: user.rol, email: user.email },
      process.env.JWT_SECRET || "secreto123",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: { id: user.id, nombre: user.nombre, rol: user.rol },
    });
  });
};
