import express from "express";
import {
  auth_required,
  convertDurationToMilliseconds,
  getAll,
  getDocument,
  makeHeaven,
} from "../../utils/index.js";
import { convertToOr, getQueryDate } from "../../utils/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "./model.js";
import Group from "../group/model.js";
import Permission from "../permission/model.js";
import Denuncia from "../denuncia/model.js";
const routes = express.Router();

async function all_permissions(user) {
  const permissions = await user.get_all_permissions(user.id);
  return permissions;
}

async function searchUser(searchParams) {
  let query = {};
  if (searchParams?.all)
    searchParams = {
      all: searchParams?.all,
      name: searchParams?.all,
      username: searchParams?.all,
      email: searchParams?.all,
      groups: searchParams?.all,
      permissions: searchParams?.all,
      last_login: searchParams?.all,
      createdAt: searchParams?.all,
      updatedAt: searchParams?.all,
    };
  if (searchParams?.nombres)
    query.nombres = { $regex: searchParams.nombres, $options: "i" };
  if (searchParams?.primerApellido)
    query.primerApellido = {
      $regex: searchParams.primerApellido,
      $options: "i",
    };
  if (searchParams?.segundoApellido)
    query.segundoApellido = {
      $regex: searchParams.segundoApellido,
      $options: "i",
    };

  if (searchParams?.username)
    query.username = { $regex: searchParams.username, $options: "i" };
  if (searchParams?.email)
    query.email = { $regex: searchParams.email, $options: "i" };
  if (searchParams?.groups) {
    //let id = await Group.findOne({ name: { $regex: searchParams.groups, $options: 'i' } }).exec()._id;
    //if (id) query.groups = { $in: id };
    var list = await Group.find({
      name: { $regex: searchParams.groups, $options: "i" },
    }).exec();
    list = list.map((l) => l._id);
    if (list.length > 0) query.groups = { $in: list };
  }
  if (searchParams?.permissions) {
    var list = await Permission.find({
      name: { $regex: searchParams.permissions, $options: "i" },
    }).exec();
    list = list.map((l) => l._id);
    if (list.length > 0) query.permissions = { $in: list };
  }
  if (searchParams.is_admin !== undefined)
    query.is_admin = searchParams.is_admin;
  if (searchParams.is_active !== undefined)
    query.is_active = searchParams.is_active;
  if (searchParams?.last_login) {
    const date = getQueryDate(searchParams.last_login);
    if (date) query.last_login = date;
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
routes.get("/me", async function (req, res) {
  if (!auth_required(req, res, [])) return;
  req.body.query.find = {
    _id: req.currentUser.id,
  };
  const user = await User.findById(req.currentUser.id).populate("permissions");

  if (user) return res.status(200).json(user);
});
// GET /user/read/:id — Obtener usuario por su ID (para denuncias, perfiles, etc.)
routes.get("/read/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Opcional: evita enviar el hash de la contraseña
    const userSafe = user.toObject();
    delete userSafe.password;

    return res.status(200).json({ user: userSafe });
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    return res
      .status(400)
      .json({ message: "Error al obtener el usuario", error });
  }
});

routes.post("/all_permissions/:id", async function (req, res) {
  if (!auth_required(req, res, ["read_user"], true)) return;
  const { id } = req.params;
  req.body.query.find = {
    _id: id,
  };
  const user = await getDocument(User, req, res);
  if (user) {
    const permissions = await user.get_all_permissions(id);
    user.all_permissions = permissions;
    return res.status(200).json(user);
  }
});

routes.post("/list", async function (req, res) {
  if (!auth_required(req, res, ["read_user"], true)) return;
  if (req?.body?.query?.search)
    req.body.query.find = {
      ...req.body.query.find,
      ...(await searchUser(req?.body?.query?.search)),
    };
  const query = await getAll(User, req, res);
  if (query) return res.status(200).json(query);
});

routes.post("/read", async function (req, res) {
  if (!auth_required(req, res, ["read_user"], true)) return;
  const query = await getDocument(User, req, res);
  if (query) delete query._doc.password;
  if (query) return res.status(200).json(query);
});

//POST
routes.post("/create", async function (req, res) {
  if (!auth_required(req, res, ["create_user"], true)) return;
  try {
    var { user } = req.body;
    //validadores
    if (!user?.password)
      return res
        .status(400)
        .json({ message: "El campo de contraseña es requerido" });
    user.password = await bcrypt.hash(user.password, 10);
    user.last_user = req.currentUser.id;

    var query = await new User(user).save();
    return res.status(200).json(query);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});
// Registro sin login con permisos por defecto
routes.post("/public_register", async function (req, res) {
  try {
    let { user } = req.body;

    // Validaciones obligatorias
    if (
      !user?.username ||
      !user?.password ||
      !user?.nombres ||
      !user?.primerApellido ||
      !user?.celular ||
      !user?.direccion
    ) {
      return res.status(400).json({ message: "Faltan campos requeridos" });
    }

    // Validar que el username no exista ya
    const exists = await User.findOne({ username: user.username });
    if (exists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Hashear contraseña
    user.password = await bcrypt.hash(user.password, 10);

    // Lista de permisos por defecto
    const defaultPermissionNames = [
      "create_adopcion",
      "read_adopcion",
      "update_adopcion",
      "delete_adopcion",
      "create_denuncia",
      "read_denuncia",
      "update_denuncia",
      "delete_denuncia",
      "create_historial",
      "read_historial",
      "update_historial",
      "delete_historial",
      "create_mascota",
      "read_mascota",
      "update_mascota",
      "delete_mascota",
    ];
    // Buscar los permisos en base de datos
    const defaultPermissions = await Permission.find({
      codename: { $in: defaultPermissionNames },
    }).select("_id");

    // Crear usuario con permisos asignados
    user.permissions = defaultPermissions.map((p) => p._id);
    const newUser = await new User(user).save();

    // Populear permisos antes de responder
    const populatedUser = await User.findById(newUser._id)
      .populate("permissions")
      .lean();

    return res.status(200).json(populatedUser);
  } catch (error) {
    console.error("Error en registro público:", error);
    return res.status(500).json({ message: "Error al registrar", error });
  }
});

//PUT
routes.put("/update/:id", async function (req, res) {
  console.log("Entró a PUT /update/:id con id =", req.params.id);
  if (!auth_required(req, res, [], true)) return;
  const { id } = req.params;
  try {
    var { user } = req.body;
    user.last_user = req.currentUser.id;
    if (user.password) user.password = await bcrypt.hash(user.password, 10);
    const document = await User.findByIdAndUpdate(
      id,
      {
        $set: user,
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
  if (!auth_required(req, res, ["delete_user"], true)) return;
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    return res.status(200).json({ message: "User Delete" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

//Extras
routes.post("/login", async function (req, res) {
  try {
    var user = await User.findOne({ username: req.body.username })
      .populate("permissions")
      .exec();

    if (!user)
      return res.status(401).json({ message: "Credenciales Inválidas" });

    // Verificar denuncias activas
    const totalDenuncias = await Denuncia.countDocuments({
      id_usuario: user._id,
    });

    if (totalDenuncias >= 10) {
      if (user.is_active !== false) {
        user.is_active = false;
        await user.save();
      }
      return res.status(403).json({
        message: "Tu cuenta ha sido deshabilitada por múltiples denuncias.",
      });
    }

    if (!user.is_active)
      return res.status(401).json({ message: "Usuario Deshabilitado" });

    if (bcrypt.compareSync(req.body.password, user.password)) {
      user.last_login = new Date();
      await user.save();

      const permissions = await user.get_all_permissions();
      const token = jwt.sign(
        {
          id: user.id,
          permissions,
          is_admin: user.is_admin,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_TIME,
        }
      );
      user._doc.all_permissions = [...permissions];
      const formattedHeaven = makeHeaven(7) + token + makeHeaven(7);
      const formattedToken = makeHeaven(formattedHeaven.length);

      res.cookie("heaven", formattedHeaven, {
        httpOnly: true,
        maxAge: convertDurationToMilliseconds(process.env.JWT_TIME),
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      });

      return res.status(200).json({ user, token: formattedToken });
    } else {
      return res.status(401).json({ message: "Credenciales Inválidas" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error en la autenticación", error });
  }
});

routes.post("/refreshToken", async function (req, res) {
  if (!auth_required(req, res, [])) return;
  try {
    const token = jwt.sign(
      {
        id: req.currentUser.id,
        permissions: req.currentUser.permissions,
        is_admin: req.currentUser.is_admin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TIME,
      }
    );
    const formattedHeaven = makeHeaven(7) + token + makeHeaven(7);
    const formattedToken = makeHeaven(formattedHeaven.length);

    res.cookie("heaven", formattedHeaven, {
      httpOnly: true,
      maxAge: convertDurationToMilliseconds(process.env.JWT_TIME),
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return res.status(200).json({ token: formattedToken });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al refrescar el token", error });
  }
});

routes.get("/logout", (req, res) => {
  res.cookie("heaven", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.send("Sesión cerrada");
});

routes.put("/update/update_profile", async function (req, res) {
  console.log("Entró a PUT /update/update_profile");

  // ❗ NO USES EL TERCER PARÁMETRO EN TRUE
  if (!auth_required(req, res, ["update_user"])) return;

  try {
    var { user } = req.body;

    user.last_user = req.currentUser.id;

    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const document = await User.findByIdAndUpdate(
      req.currentUser.id,
      { $set: user },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ message: "Documento no encontrado" });
    }

    return res.status(200).json(document);
  } catch (error) {
    console.error("🔥 ERROR EN update_profile:", error);
    return res.status(400).json({ message: "Datos Inválidos", error });
  }
});

export default routes;
