import express from "express";
import { auth_required, getAll, getDocument } from "../../utils/index.js";
import Notification from "./model.js";

const routes = express.Router();

//GET
routes.post("/list", async function (req, res) {
  if (!auth_required(req, res, [], true)) return;
  const query = await getAll(Notification, req, res);
  if (query) return res.status(200).json(query);
});

routes.post("/read", async function (req, res) {
  if (!auth_required(req, res, [])) return;
  const query = await getDocument(Notification, req, res);
  if (query) return res.status(200).json(query);
});

//POST
routes.post("/create", async function (req, res) {
  if (!auth_required(req, res, [])) return;
  try {
    var { notification } = req.body;
    notification.password = await bcrypt.hash(notification.password, 10);
    notification.last_user = req.currentUser.id;
    var query = await new Notification(notification).save();
    return res.status(200).json(query);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

//PUT
routes.put("/update/:id", async function (req, res) {
  if (!auth_required(req, res, [])) return;
  const { id } = req.params;
  try {
    var { notification } = req.body;
    notification.last_user = req.currentUser.id;
    const document = await Notification.findByIdAndUpdate(
      id,
      {
        $set: notification,
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
  if (!auth_required(req, res, [])) return;
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndDelete(id);
    return res.status(200).json({ message: "Notification Delete" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

//Extras

routes.get("/me_notification", async function (req, res) {
  if (!auth_required(req, res, [])) return;
  req.body.query.find = {
    user: req.currentUser.id,
  };
  req.body.query.sort = {
    createdAt: -1,
  };
  const query = await getAll(Notification, req, res);
  if (query) return res.status(200).json(query);
});

export default routes;
