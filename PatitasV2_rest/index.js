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

// Render y Vercel usan proxy → necesario para cookies SameSite=None
app.set("trust proxy", 1);

// ===== CORS =====
const allowList = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// En desarrollo permitir localhost si no hay lista
if (!allowList.length && process.env.NODE_ENV !== "production") {
  allowList.push(
    "http://localhost:7011",
    "http://localhost:8100",
    "http://localhost:5173"
  );
}

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // permitir healthchecks/curl
    if (allowList.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Accept",
    "Authorization", // ← clave, así sí pasa el token
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));
// responder preflight
app.options("*", cors(corsOptions));

// ===== Middlewares base =====
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

// ===== Conexión a DB =====
await connectDB();

// ===== Seeds en dev =====
if (process.env.NODE_ENV !== "production") {
  updatePermission();
  createAdminUser();
}

// ===== Healthcheck =====
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ===== Middlewares custom (auth/query) =====
configureMiddleware(app);

// ===== Rutas =====
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
