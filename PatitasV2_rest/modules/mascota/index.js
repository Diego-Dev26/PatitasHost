import express from "express";
import { auth_required, getAll, getDocument } from "../../utils/index.js";
import {
  convertToOr,
  getQueryDate,
  getQueryNumber,
} from "../../utils/database.js";
import User from "../user/model.js";
import Mascota from "./model.js";
import { deleteFiles } from "../storageGoogle/index.js";

const routes = express.Router();

async function searchMascota(searchParams) {
  let query = {};

  if (searchParams?.all) {
    searchParams = {
      all: searchParams.all,
      nombre: searchParams.all,
      especie: searchParams.all,
      raza: searchParams.all,
      genero: searchParams.all,
      fecha_nacimiento: searchParams.all,
      altura: searchParams.all,
      peso: searchParams.all,
      descripcion: searchParams.all,
      imagen: searchParams.all,
      alimentacion: searchParams.all,
      estado_salud: searchParams.all,
      disponibilidad: searchParams.all,
      createdAt: searchParams.all,
      updatedAt: searchParams.all,
    };
  }

  if (searchParams.nombre) {
    query.nombre = { $regex: searchParams.nombre, $options: "i" };
  }
  if (searchParams.especie) {
    query.especie = { $regex: searchParams.especie, $options: "i" };
  }
  if (searchParams.raza) {
    query.raza = { $regex: searchParams.raza, $options: "i" };
  }
  if (searchParams.genero) {
    query.genero = { $regex: searchParams.genero, $options: "i" };
  }
  if (searchParams.fecha_nacimiento) {
    const d = getQueryDate(searchParams.fecha_nacimiento);
    if (d) query.fecha_nacimiento = d;
  }
  if (searchParams.altura) {
    const n = getQueryNumber(searchParams.altura);
    if (n) query.altura = n;
  }
  if (searchParams.peso) {
    const n = getQueryNumber(searchParams.peso);
    if (n) query.peso = n;
  }
  if (searchParams.descripcion) {
    query.descripcion = { $regex: searchParams.descripcion, $options: "i" };
  }
  if (searchParams.alimentacion) {
    query.alimentacion = { $regex: searchParams.alimentacion, $options: "i" };
  }
  if (searchParams.estado_salud) {
    query.estado_salud = { $regex: searchParams.estado_salud, $options: "i" };
  }
  if (searchParams.disponibilidad !== undefined) {
    query.disponibilidad = searchParams.disponibilidad;
  }
  if (searchParams.last_user) {
    const u = await User.findOne({
      name: { $regex: searchParams.last_user, $options: "i" },
    });
    if (u) query.last_user = u._id;
  }
  if (searchParams.createdAt) {
    const d = getQueryDate(searchParams.createdAt);
    if (d) query.createdAt = d;
  }
  if (searchParams.updatedAt) {
    const d = getQueryDate(searchParams.updatedAt);
    if (d) query.updatedAt = d;
  }
  if (searchParams.all) {
    query = convertToOr(query);
  }

  return query;
}

// → POST /mascota/list
//    - Si NO viene header x-public-access → auth_required
//    - Si viene, acepta query.find y devuelve { list, count }
routes.post("/list", async (req, res) => {
  if (!req.headers["x-public-access"]) {
    if (!auth_required(req, res, ["read_mascota"], false)) return;
  }

  if (req.body?.query?.search) {
    const extra = await searchMascota(req.body.query.search);
    req.body.query.find = {
      ...req.body.query.find,
      ...extra,
    };
  }

  const result = await getAll(Mascota, req, res);
  if (result) return res.json(result);
});

// → GET /mascota/available
//    Sólo mascotas con disponibilidad: true
// → GET /mascota/available
routes.get("/available", async (req, res) => {
  try {
    const mascotas = await Mascota.find({ disponibilidad: true })
      .sort({ createdAt: -1 })
      .populate("last_user", "nombres  celular"); // <--- aquí

    return res.json(mascotas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error interno" });
  }
});
// → GET /mascota/mis-mascotas
routes.get("/mis-mascotas", async (req, res) => {
  if (!auth_required(req, res, ["read_mascota"], false)) return;

  try {
    const mascotas = await Mascota.find({ create_by: req.currentUser.id })
      .sort({ createdAt: -1 })
      .populate("last_user", "nombres celular"); // opcional si lo necesitas

    return res.json(mascotas);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error al obtener tus mascotas", error: err });
  }
});

// → POST /mascota/read  (requiere auth)
routes.post("/read", async (req, res) => {
  if (!auth_required(req, res, ["read_mascota"], false)) return;
  const doc = await getDocument(Mascota, req, res);
  if (doc) {
    delete doc._doc.password;
    return res.json(doc);
  }
});

// → POST /mascota/create
routes.post("/create", async (req, res) => {
  if (!auth_required(req, res, ["create_mascota"], false)) return;
  try {
    const { mascota } = req.body;
    mascota.last_user = req.currentUser.id;
    mascota.create_by = req.currentUser.id;
    2;
    const nuevo = await new Mascota(mascota).save();
    return res.json(nuevo);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "Datos inválidos", error: e });
  }
});

// → PUT /mascota/update/:id
routes.put("/update/:id", async (req, res) => {
  if (!auth_required(req, res, ["update_mascota"], false)) return;
  try {
    const { mascota } = req.body;
    mascota.last_user = req.currentUser.id;
    const upd = await Mascota.findByIdAndUpdate(
      req.params.id,
      { $set: mascota },
      { new: true }
    );
    if (!upd) return res.status(404).json({ message: "No encontrado" });
    return res.json(upd);
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "Datos inválidos", error: e });
  }
});

// → DELETE /mascota/delete/:id
routes.delete("/delete/:id", async (req, res) => {
  if (!auth_required(req, res, ["delete_mascota"], false)) return;
  try {
    const m = await Mascota.findById(req.params.id);
    await deleteFiles(m.imagen);
    await Mascota.deleteOne({ _id: req.params.id });
    return res.json({ message: "Eliminado" });
  } catch (e) {
    console.error(e);
    return res.status(400).json({ message: "Error al eliminar", error: e });
  }
});

export default routes;
