//initJSid_usuario
import User from "../user/model.js";
//endJSid_usuario
//initJSid_mascota
import Mascota from "../mascota/model.js";
//endJSid_mascota
import express from "express";
import { auth_required, getAll, getDocument } from "../../utils/index.js";
import { convertToOr, getQueryDate } from "../../utils/database.js";
import Adopcion from "./model.js";
//imports
const routes = express.Router();

async function searchAdopcion(searchParams) {
  let query = {};
  if (searchParams?.all)
    searchParams = {
      all: searchParams?.all,
      //initJSid_mascota
      id_mascota: searchParams?.all,
      //endJSid_mascota
      //initJSid_usuario
      id_usuario: searchParams?.all,
      //endJSid_usuario
      //initJSdescripcion
      descripcion: searchParams?.all,
      //endJSdescripcion
      //fieldsSearch
      createdAt: searchParams?.all,
      updatedAt: searchParams?.all,
    };
  //initJSid_mascota

  if (searchParams?.id_mascota) {
    let list = await Mascota.find({
      nombre: { $regex: searchParams.id_mascota, $options: "i" },
    }).exec();
    list = list.map((l) => l._id);
    if (list.length > 0) query.id_mascota = { $in: list };
  }

  //endJSid_mascota
  //initJSid_usuario

  if (searchParams?.id_usuario) {
    let list = await User.find({
      name: { $regex: searchParams.id_usuario, $options: "i" },
    }).exec();
    list = list.map((l) => l._id);
    if (list.length > 0) query.id_usuario = { $in: list };
  }

  //endJSid_usuario
  //initJSdescripcion
  if (searchParams?.descripcion)
    query.descripcion = { $regex: searchParams.descripcion, $options: "i" };

  //endJSdescripcion
  //ifSearch
  if (searchParams?.last_user) {
    let id = await User.findOne({
      name: { $regex: searchParams.last_user, $options: "i" },
    }).exec()._id;
    if (id) query.last_user = { $in: id };
  }
  if (searchParams?.createdAt) {
    const date = getQueryDate(searchParams.createdAt);
    if (date) query.createdAt = date;
  }
  if (searchParams?.updatedAt) {
    const date = getQueryDate(searchParams.updatedAt);
    if (date) query.updatedAt = date;
  }
  if (searchParams?.all) query = convertToOr(query);
  return query;
}

//GET
routes.post("/list", async function (req, res) {
  if (!auth_required(req, res, ["read_adopcion"], false)) return;
  if (req?.body?.query?.search)
    req.body.query.find = {
      ...req.body.query.find,
      ...(await searchAdopcion(req?.body?.query?.search)),
    };
  const query = await getAll(Adopcion, req, res);
  if (query) return res.status(200).json(query);
});

routes.post("/read", async function (req, res) {
  if (!auth_required(req, res, ["read_adopcion"], false)) return;
  const query = await getDocument(Adopcion, req, res);
  if (query) delete query._doc.password;
  if (query) return res.status(200).json(query);
});

//POST
routes.post("/create", async function (req, res) {
  if (!auth_required(req, res, ["create_adopcion"], false)) return;
  try {
    var { adopcion } = req.body;
    //validadores
    adopcion.last_user = req.currentUser.id;
    //extrasCreate
    var query = await new Adopcion(adopcion).save();
    return res.status(200).json(query);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

//PUT
routes.put("/update/:id", async function (req, res) {
  if (!auth_required(req, res, ["update_adopcion"], false)) return;
  const { id } = req.params;
  try {
    var { adopcion } = req.body;
    adopcion.last_user = req.currentUser.id;
    //extrasUpdate
    const document = await Adopcion.findByIdAndUpdate(
      id,
      {
        $set: adopcion,
      },
      { new: true }
    );
    if (!document) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }
    return res.status(200).json(document);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

//DELETE
routes.delete("/delete/:id", async function (req, res) {
  if (!auth_required(req, res, ["delete_adopcion"], false)) return;
  const { id } = req.params;
  try {
    const adopcion = await Adopcion.findById(id);

    //extrasDelete
    await Adopcion.deleteOne({ _id: id });
    return res.status(200).json({ message: "Adopcion Delete" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

export default routes;
