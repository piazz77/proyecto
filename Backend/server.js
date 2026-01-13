import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import lamparaRoutes from "./routes/lamparaRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import favoritosRoutes from "./routes/favoritosRoutes.js";
import connection from "./config/db.js";


dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/lamparas", lamparaRoutes); 
app.use("/api/usuarios", usuariosRoutes);
app.use("/favoritos", favoritosRoutes);



// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
