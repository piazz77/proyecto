import connection from "../config/db.js";
import bcrypt from "bcryptjs";

// 🔹 Listar todos los usuarios
export const getUsuarios = (req, res) => {
  const sql = "SELECT id, nombre, email, rol FROM usuarios";
  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error al obtener usuarios:", err);
      return res.status(500).json({ message: "Error al obtener usuarios", error: err });
    }
    res.json(results);
  });
};

// 🔹 Editar usuario
export const updateUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol, password } = req.body;

  // Validaciones básicas
  if (!nombre || !email || !rol) {
    return res.status(400).json({ message: "Nombre, email y rol son obligatorios" });
  }

  // Construir SQL y parámetros
  let sql, params;
  if (password && password.trim() !== "") {
    // Si se proporciona password, lo hasheamos
    const hashed = bcrypt.hashSync(password, 8);
    sql = "UPDATE usuarios SET nombre = ?, email = ?, rol = ?, password = ? WHERE id = ?";
    params = [nombre, email, rol, hashed, id];
  } else {
    sql = "UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?";
    params = [nombre, email, rol, id];
  }

  connection.query(sql, params, (err, result) => {
    if (err) {
      console.error("Error al actualizar usuario:", err);
      return res.status(500).json({ message: "Error al actualizar usuario", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado correctamente" });
  });
};

// 🔹 Eliminar usuario
export const deleteUsuario = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM usuarios WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error al eliminar usuario:", err);
      return res.status(500).json({ message: "Error al eliminar usuario", error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado correctamente" });
  });
};

