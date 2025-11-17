import connection from "../config/db.js";

// 📦 Obtener todas las lámparas
export const getLamparas = (req, res) => {
  const sql = "SELECT * FROM lamparas";
  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error al obtener lámparas", error: err });
    res.json(results);
  });
};

// 💡 Obtener una lámpara por ID
export const getLamparaById = (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM lamparas WHERE id = ?";
  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Error al obtener lámpara", error: err });
    if (results.length === 0) return res.status(404).json({ message: "Lámpara no encontrada" });
    res.json(results[0]);
  });
};

// ➕ Agregar nueva lámpara (solo admin)
export const addLampara = (req, res) => {
  const { nombre, descripcion, tipo, ruta_imagen } = req.body;
  const sql = "INSERT INTO lamparas (nombre, descripcion, tipo, ruta_imagen) VALUES (?, ?, ?, ?)";
  connection.query(sql, [nombre, descripcion, tipo, ruta_imagen], (err, result) => {
    if (err) return res.status(500).json({ message: "Error al agregar lámpara", error: err });
    res.json({ message: "Lámpara agregada correctamente", id: result.insertId });
  });
};

// ✏️ Editar lámpara (solo admin)
export const updateLampara = (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, tipo, ruta_imagen } = req.body;
  const sql = "UPDATE lamparas SET nombre=?, descripcion=?, tipo=?, ruta_imagen=? WHERE id=?";
  connection.query(sql, [nombre, descripcion, tipo, ruta_imagen, id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error al actualizar lámpara", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Lámpara no encontrada" });
    res.json({ message: "Lámpara actualizada correctamente" });
  });
};

// 🗑️ Eliminar lámpara (solo admin)
export const deleteLampara = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM lamparas WHERE id = ?";
  connection.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Error al eliminar lámpara", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Lámpara no encontrada" });
    res.json({ message: "Lámpara eliminada correctamente" });
  });
};
