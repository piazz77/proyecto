import express from "express";
import { getUsuarios, updateUsuario, deleteUsuario } from "../controllers/usuariosController.js";
import { verificarToken, soloAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verificarToken, soloAdmin, getUsuarios);
router.put("/:id", verificarToken, soloAdmin, updateUsuario);
router.delete("/:id", verificarToken, soloAdmin, deleteUsuario);

export default router;
