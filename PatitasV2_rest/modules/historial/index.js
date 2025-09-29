//initJSid_mascota
import Mascota from "../mascota/model.js";
//endJSid_mascota
import express from "express";
import { auth_required, getAll, getDocument } from "../../utils/index.js";
import { convertToOr, getQueryDate } from "../../utils/database.js";
import User from "../user/model.js";
import Historial from "./model.js";
//imports
const routes = express.Router();

async function searchHistorial(searchParams) {
  let query = {};
  if (searchParams?.all)
    searchParams = {
      all: searchParams?.all,
      //initJSid_mascota
      id_mascota: searchParams?.all,
      //endJSid_mascota
      //initJSesterilizacion
      esterilizacion: searchParams?.all,
      //endJSesterilizacion
      //initJSvacunas
      vacunas: searchParams?.all,
      //endJSvacunas
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
  //initJSesterilizacion
  if (searchParams.esterilizacion !== undefined)
    query.esterilizacion = searchParams.esterilizacion;

  //endJSesterilizacion
  //initJSvacunas
  if (searchParams?.vacunas)
    query.vacunas = { $regex: searchParams.vacunas, $options: "i" };

  //endJSvacunas
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
  if (!auth_required(req, res, ["read_historial"], false)) return;
  if (req?.body?.query?.search)
    req.body.query.find = {
      ...req.body.query.find,
      ...(await searchHistorial(req?.body?.query?.search)),
    };
  const query = await getAll(Historial, req, res);
  if (query) return res.status(200).json(query);
});

routes.post("/read", async function (req, res) {
  if (!auth_required(req, res, ["read_historial"], false)) return;
  const query = await getDocument(Historial, req, res);
  if (query) delete query._doc.password;
  if (query) return res.status(200).json(query);
});

//POST
routes.post("/create", async function (req, res) {
  if (!auth_required(req, res, ["create_historial"], false)) return;
  try {
    var { historial } = req.body;
    //validadores
    historial.last_user = req.currentUser.id;
    //extrasCreate
    var query = await new Historial(historial).save();
    return res.status(200).json(query);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

//PUT
routes.put("/update/:id", async function (req, res) {
  if (!auth_required(req, res, ["update_historial"], false)) return;
  const { id } = req.params;
  try {
    var { historial } = req.body;
    historial.last_user = req.currentUser.id;
    //extrasUpdate
    const document = await Historial.findByIdAndUpdate(
      id,
      {
        $set: historial,
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
  if (!auth_required(req, res, ["delete_historial"], false)) return;
  const { id } = req.params;
  try {
    const historial = await Historial.findById(id);

    //extrasDelete
    await Historial.deleteOne({ _id: id });
    return res.status(200).json({ message: "Historial Delete" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

export default routes;
