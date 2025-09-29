import express from "express";
import user from "./user/index.js";
import group from "./group/index.js";
import permission from "./permission/index.js";
import authGoogle from "./authGoogle/index.js";
import files from "./storageGoogle/index.js";
import mascota from "./mascota/index.js";
import historial from "./historial/index.js";
import adopcion from "./adopcion/index.js";
import denuncia from "./denuncia/index.js";
//imports

const routes = express.Router();

routes.use("/user", user);
routes.use("/authGoogle", authGoogle);
routes.use("/group", group);
routes.use("/permission", permission);
routes.use("/files", files);
routes.use("/mascota", mascota);
routes.use("/historial", historial);
routes.use("/adopcion", adopcion);
routes.use("/denuncia", denuncia);
//functions

export default routes;
