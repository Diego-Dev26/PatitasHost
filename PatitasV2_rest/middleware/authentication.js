import jwt from "jsonwebtoken";

/** Lee el token desde Authorization o cookie "heaven" */
function extractToken(req) {
  // 1) Authorization: "Bearer <token>" o token crudo
  const auth = req.headers["authorization"] || "";
  if (auth) {
    if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
    return auth.trim();
  }

  // 2) Cookie "heaven"
  const c = req.cookies?.heaven;
  if (c) {
    // Si alguna vez guardaste con prefijo/sufijo, intenta recortar,
    // si no, devuélvelo tal cual
    try {
      if (c.length > 20) {
        const maybe = c.slice(7, -7);
        if (maybe.length > 10) return maybe.trim();
      }
    } catch (_) {}
    return c.trim();
  }

  return null;
}

function verifyToken(token) {
  try {
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // si firmaste como { user: {...} } devuelve user; si no, payload completo
    return payload?.user ? payload.user : payload;
  } catch {
    return null;
  }
}

export default function authentication(req, _res, next) {
  const token = extractToken(req);
  const currentUser = verifyToken(token);
  req.currentUser = currentUser; // null si no hay/vale
  next();
}
