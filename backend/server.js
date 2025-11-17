import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import lamparaRoutes from "./routes/lamparaRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import connection from "./config/db.js";
import OpenAI from "openai";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ============================
//  IA CHAT (OPENAI)
// ============================
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "Sos un asistente amable y experto en diseño de lámparas." },
                { role: "user", content: message }
            ]
        });

        res.json({ reply: response.choices[0].message.content });
    } catch (error) {
        console.error("Error IA:", error);
        res.status(500).json({ error: "Error al conectar con la IA" });
    }
});

// ============================
//  Rutas normales del sistema
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/lamparas", lamparaRoutes); 
app.use("/api/usuarios", usuariosRoutes);

// ============================
//  Servidor
// ============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
