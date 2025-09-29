//initJSid_usuario
import User from "../user/model.js";
//endJSid_usuario
import express from "express";
import { auth_required, getAll, getDocument } from "../../utils/index.js";
import { convertToOr, getQueryDate } from "../../utils/database.js";
import Denuncia from "./model.js";
//imports
const routes = express.Router();

async function searchDenuncia(searchParams) {
  let query = {};
  if (searchParams?.all)
    searchParams = {
      all: searchParams?.all,
      //initJSid_usuario
      id_usuario: searchParams?.all,
      //endJSid_usuario
      //initJStipo_denuncia
      tipo_denuncia: searchParams?.all,
      //endJStipo_denuncia
      //initJSdescripcion
      descripcion: searchParams?.all,
      //endJSdescripcion
      //initJSestado
      estado: searchParams?.all,
      //endJSestado
      //fieldsSearch
      createdAt: searchParams?.all,
      updatedAt: searchParams?.all,
    };
  //initJSid_usuario

  if (searchParams?.id_usuario) {
    let list = await User.find({
      name: { $regex: searchParams.id_usuario, $options: "i" },
    }).exec();
    list = list.map((l) => l._id);
    if (list.length > 0) query.id_usuario = { $in: list };
  }

  //endJSid_usuario
  //initJStipo_denuncia
  if (searchParams?.tipo_denuncia)
    query.tipo_denuncia = { $regex: searchParams.tipo_denuncia, $options: "i" };

  //endJStipo_denuncia
  //initJSdescripcion
  if (searchParams?.descripcion)
    query.descripcion = { $regex: searchParams.descripcion, $options: "i" };

  //endJSdescripcion
  //initJSestado
  if (searchParams?.estado)
    query.estado = { $regex: searchParams.estado, $options: "i" };

  //endJSestado
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
  if (!auth_required(req, res, ["read_denuncia"], false)) return;
  if (req?.body?.query?.search)
    req.body.query.find = {
      ...req.body.query.find,
      ...(await searchDenuncia(req?.body?.query?.search)),
    };
  const query = await getAll(Denuncia, req, res);
  if (query) return res.status(200).json(query);
});

routes.post("/read", async function (req, res) {
  if (!auth_required(req, res, ["read_denuncia"], false)) return;
  const query = await getDocument(Denuncia, req, res);
  if (query) delete query._doc.password;
  if (query) return res.status(200).json(query);
});

//POST
routes.post("/create", async function (req, res) {
  // if (!auth_required(req, res, ["create_denuncia"], false)) return;
  try {
    var { denuncia } = req.body;
    //validadores
    // denuncia.last_user = req.currentUser.id;
    //extrasCreate
    var query = await new Denuncia(denuncia).save();
    return res.status(200).json(query);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

//PUT
routes.put("/update/:id", async function (req, res) {
  if (!auth_required(req, res, ["update_denuncia"], false)) return;
  const { id } = req.params;
  try {
    var { denuncia } = req.body;
    denuncia.last_user = req.currentUser.id;
    //extrasUpdate
    const document = await Denuncia.findByIdAndUpdate(
      id,
      {
        $set: denuncia,
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
  if (!auth_required(req, res, ["delete_denuncia"], false)) return;
  const { id } = req.params;
  try {
    const denuncia = await Denuncia.findById(id);

    //extrasDelete
    await Denuncia.deleteOne({ _id: id });
    return res.status(200).json({ message: "Denuncia Delete" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

export default routes;
