import express from "express";
import {
  getLamparas,
  getLamparaById,
  addLampara,
  updateLampara,
  deleteLampara,
} from "../controllers/lamparaController.js";

import { verificarToken, soloAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Listar lámparas (todos los usuarios)
router.get("/", getLamparas);

//  Ver una lámpara por ID
router.get("/:id", getLamparaById);

//  Crear nueva lámpara (solo admin)
router.post("/", verificarToken, soloAdmin, addLampara);

//  Actualizar lámpara (solo admin)
router.put("/:id", verificarToken, soloAdmin, updateLampara);

//  Eliminar lámpara (solo admin)
router.delete("/:id", verificarToken, soloAdmin, deleteLampara);

export default router;
