// index.js
import "./config.js";
import express from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import configureMiddleware from "./middleware/index.js";
import { connectDB } from "./utils/database.js";
import { updatePermission, createAdminUser } from "./utils/update.js";
import routes from "./modules/index.js";

const PORT = process.env.PORT || 4014;

const app = express();

// Confía en el proxy (Render) para que cookies Secure/SameSite=None funcionen bien
app.set("trust proxy", 1);

// ===== CORS por variable de entorno =====
const allowList = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// En dev, si no hay allowList, permite localhost
if (!allowList.length && process.env.NODE_ENV !== "production") {
  allowList.push("http://localhost:7011", "http://localhost:8100", "http://localhost:5173");
}

app.use(cors({
  origin: (origin, cb) => {
    // Permite requests sin origin (curl/healthchecks)
    if (!origin) return cb(null, true);
    return cb(null, allowList.includes(origin));
  },
  credentials: true,
}));

// ===== Middlewares base =====
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// ===== Conexión DB =====
await connectDB();

// Solo en dev corre “seeds” / actualizaciones
if (process.env.NODE_ENV !== "production") {
  // comentar después de la primera vez si ya no quieres actualizar/sembrar cada arranque
  updatePermission(); // Actualizar Permisos
  createAdminUser();
}

// ===== Health =====
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ===== Tus middlewares personalizados =====
configureMiddleware(app);

// ===== Rutas de módulos =====
app.use("/", routes);

// ===== Start HTTP =====
const httpServer = http.createServer(app);
await new Promise((resolve) => {
  httpServer.listen({ port: PORT }, resolve);
});

if (process.env.NODE_ENV !== "production") {
  console.log(`🚀 Server ready at http://localhost:${PORT}/`);
  console.log("CORS allowList:", allowList);
}
