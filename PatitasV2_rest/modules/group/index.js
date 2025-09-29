import express from "express";
import { auth_required, getAll, getDocument } from "../../utils/index.js";
import Group from "./model.js";

const routes = express.Router();

async function searchGroup(searchParams) {
  let query = {};
  if (searchParams?.all)
    searchParams = {
      all: searchParams?.all,
      name: searchParams?.all,
      permissions: searchParams?.all,
      createdAt: searchParams?.all,
      updatedAt: searchParams?.all,
    };
  if (searchParams?.name)
    query.name = { $regex: searchParams.name, $options: "i" };
  if (searchParams?.permissions) {
    var list = await Permission.find({
      name: { $regex: searchParams.permissions, $options: "i" },
    }).exec();
    list = list.map((l) => l._id);
    if (list.length > 0) query.permissions = { $in: list };
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
  if (!auth_required(req, res, ["read_group"], true)) return;
  if (req?.body?.query?.search)
    req.body.query.find = {
      ...req.body.query.find,
      ...(await searchGroup(req?.body?.query?.search)),
    };
  const query = await getAll(Group, req, res);
  if (query) return res.status(200).json(query);
});

routes.post("/read", async function (req, res) {
  if (!auth_required(req, res, ["read_group"], true)) return;
  const query = await getDocument(Group, req, res);
  if (query) return res.status(200).json(query);
});

//POST
routes.post("/create", async function (req, res) {
  if (!auth_required(req, res, ["create_group"], true)) return;
  try {
    var { group } = req.body;
    group.last_user = req.currentUser.id;
    var query = await new Group(group).save();
    return res.status(200).json(query);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

//PUT
routes.put("/update/:id", async function (req, res) {
  if (!auth_required(req, res, ["update_group"], true)) return;
  const { id } = req.params;
  try {
    var { group } = req.body;
    group.last_user = req.currentUser.id;
    const document = await Group.findByIdAndUpdate(
      id,
      {
        $set: group,
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
  if (!auth_required(req, res, ["delete_group"], true)) return;
  const { id } = req.params;
  try {
    const group = await Group.findByIdAndDelete(id);
    return res.status(200).json({ message: "Group Delete" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

//Extras

export default routes;
