import express from "express";
import { auth_required, getAll, getDocument } from "../../utils/index.js";
import Permission from "./model.js";

const routes = express.Router();

//GET
routes.post("/list", async function (req, res) {
  // Permitir acceso sin autenticación si el header indica uso público
  if (!req.headers["x-public-access"]) {
    if (!auth_required(req, res, [], true)) return;
  }

  const query = await getAll(Permission, req, res);
  if (query) return res.status(200).json(query);
});

routes.post("/read", async function (req, res) {
  if (!auth_required(req, res, [], true)) return;
  const query = await getDocument(Permission, req, res);
  if (query) return res.status(200).json(query);
});

//POST

//PUT

//DELETE

//Extras

export default routes;
