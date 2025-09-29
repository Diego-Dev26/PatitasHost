import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Permission from "../modules/permission/model.js";
import User from "../modules/user/model.js";
import Group from "../modules/group/model.js";
import { autoIncrement } from "./database.js";
import bcrypt from "bcryptjs";

const pathModels = new URL("../modules", import.meta.url);
const __dirModels = fileURLToPath(pathModels);

const models = [];
function searchModels(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }
  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
    if (stat.isDirectory()) {
      models.push(files[i].toLowerCase());
    }
  }
}

const traductor = {
  group: "Grupo",
  user: "Usuario",

  create: "Crear",
  read: "Ver",
  report: "Reporte",
  update: "Editar",
  delete: "Eliminar",
};

async function updatePermissions() {
  // Permisos personalizados que siempre deben estar presentes
  const customPermissions = [
    //{ codename: "custom_permission_codename1", name: "Nombre del Permiso Personalizado 1" },
  ];

  //MODELOS PARA EXCLUIR EN LA LISTA DE PERMISOS
  const exclude = ["permission", "authgoogle", "storagegoogle", "notification"];

  searchModels(__dirModels, ".js");
  const permissions = [];
  models.forEach((element) => {
    if (exclude.includes(element)) return;
    permissions.push("create_" + element);
    permissions.push("read_" + element);
    permissions.push("report_" + element);
    permissions.push("update_" + element);
    permissions.push("delete_" + element);
  });

  // Añadir permisos personalizados a la lista de permisos
  customPermissions.forEach((permission) => {
    if (!permissions.find((p) => p === permission.codename)) {
      permissions.push(permission.codename);
    }
  });

  const permissions_db = await Permission.find();

  // Delete unused permissions
  for (let per of permissions_db) {
    if (!permissions.includes(per.codename)) {
      await User.updateMany({}, { $pull: { permissions: per.id } });
      await Group.updateMany({}, { $pull: { permissions: per.id } });
      await Permission.findByIdAndDelete(per.id);
    }
  }

  // Create new permissions
  for (let codename of permissions) {
    let find = permissions_db.find((element) => element.codename === codename);
    if (!find) {
      let name;
      const customPermission = customPermissions.find(
        (p) => p.codename === codename
      );
      if (customPermission) {
        name = customPermission.name;
      } else {
        let [action, model] = codename.split("_");
        action = Object.keys(traductor).includes(action)
          ? traductor[action]
          : action;
        model = Object.keys(traductor).includes(model)
          ? traductor[model]
          : model;
        model = model.charAt(0).toUpperCase() + model.slice(1);
        name = action + " " + model;
      }
      const number = await autoIncrement("permission");
      const newPer = new Permission({
        codename,
        name,
        number,
      });
      await newPer.save();
    }
  }
  console.log(
    "--------------> " + permissions.length + " Permisos Actualizados"
  );
}

export async function createAdminUser() {
  const password = await bcrypt.hash("admin1234", 10);
  const user = await User.findOne({ username: "admin" }).exec();

  if (user) {
    console.log("--------------> Usuario Encontrado : " + user.username);
  } else {
    await new User({
      nombres: "ADMIN",
      primerApellido: "ISTRADOR",
      username: "admin",
      password,
      email: "admin@admin.com",
      celular: "77777777",
      direccion: "Dirección del admin",
      is_admin: true,
      is_active: true,
    }).save();

    console.log("--------------> Usuario Administrador CREADO");
  }
}

export async function updatePermission() {
  try {
    await updatePermissions();
  } catch (error) {
    console.error(error);
  }
}
