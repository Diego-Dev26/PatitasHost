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
await connectDB();
if (process.env.NODE_ENV != "production") {
  //comentar despues de la primera vez
  updatePermission(); ///// Actualizar Permisos
  createAdminUser();
}
// CORS
const allowList = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);
  
if (!allowList.length && process.env.NODE_ENV !== "production") {
  allowList.push("http://localhost:7011", "http://localhost:8100");
}
const corsOptions = {
  origin: [
    "http://localhost:7011",
    "http://localhost:8100",
    "https://patitas.pages.dev",
  ],
  credentials: true, // Permite que se envíen cookies y encabezados de autorización
};
app.use(cors({
  origin: (origin, cb) => {
    // Permitir herramientas sin origin (curl/healthchecks)
    if (!origin) return cb(null, true);
    return cb(null, allowList.includes(origin));
  },
  credentials: true,
}));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

//Configurar Middlware personalizados
configureMiddleware(app);

// Importa las rutas de los modulos
app.use("/", routes);

const httpServer = http.createServer(app);
// Modified server startup
await new Promise((resolve) => {
  httpServer.listen({ port: PORT }, resolve);
});

if (process.env.NODE_ENV != "production") {
  console.log(`🚀 Server ready at http://localhost:${PORT}/`);
}
