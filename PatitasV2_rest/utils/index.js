// utils.js

export function auth_required(req, res, permissions = [], is_admin = false) {
  if (!req.currentUser) {
    res.status(401).json({ message: "Inicio de Sesión Requerido" });
    return false;
  }

  if (req.currentUser.is_admin) return true;

  const unauthorizedPermissions = permissions.filter(
    (permission) => !req.currentUser.permissions.includes(permission)
  );

  if (unauthorizedPermissions.length > 0) {
    res
      .status(403)
      .json({
        message: "Usted no tiene permiso para realizar esta acción.",
        permissions: unauthorizedPermissions,
      });
    return false;
  }

  if (is_admin && !req.currentUser.is_admin) {
    res
      .status(403)
      .json({
        message: "Usted no tiene permiso para realizar esta acción.",
        permission: "Solo Superadmin",
      });
    return false;
  }

  return true;
}

export function getFields(req) {
  const select = req.body?.query?.select || null;
  const populate = req.body?.query?.populate || null;
  return { select, populate };
}

export async function getAll(model, req, res) {
  try {
    var { select, populate } = getFields(req);
    const { find, page, limit, sort, count } = req.body.query;
    var query = select
      ? model.find({ ...find }).select(select)
      : model.find({ ...find });
    if (populate) query.populate(populate);
    var countQuery = null;
    if (page && limit) query.skip((page - 1) * limit).limit(limit);
    if (sort) query.sort(sort);
    if (count) countQuery = await model.countDocuments({ ...find }).exec();
    query = await query.exec();
    // Enviar la respuesta exitosa con los datos
    return { list: query, count: countQuery };
  } catch (error) {
    console.error(error);
    // Enviar una respuesta de error con el mensaje y el código de error
    res.status(500).json({ message: "Error en la consulta", error });
    return null;
  }
}

export async function getDocument(model, req, res) {
  var { select, populate } = getFields(req);
  var query = select
    ? model.findOne({ ...req.body?.query?.find }).select(select)
    : model.findOne({ ...req.body?.query?.find });
  if (populate) query.populate(populate);
  try {
    const result = await query.exec();
    if (!result) {
      // Manejar el caso en el que no se encuentra ningún documento
      res.status(404).json({ message: "Documento no encontrado" });
      return null;
    }
    return result;
  } catch (error) {
    // Manejar errores de consulta
    console.error(error);
    res.status(400).json({ message: "Error en la consulta", error });
    return null;
  }
}

export function makeHeaven(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}

export function convertDurationToMilliseconds(duration) {
  const unit = duration.slice(-1); // Obtiene la última letra para la unidad
  const value = parseInt(duration.slice(0, -1)); // Obtiene el valor numérico

  if (isNaN(value)) {
    throw new Error("Duración no válida: el valor no es un número");
  }

  switch (unit) {
    case "m": // minutos
      return value * 60 * 1000;
    case "h": // horas
      return value * 60 * 60 * 1000;
    default:
      throw new Error(
        "Unidad de duración no reconocida. Use 'm' para minutos o 'h' para horas."
      );
  }
}
