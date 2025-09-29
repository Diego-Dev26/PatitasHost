// middleware/authentication.js
import jwt from "jsonwebtoken";

/** Extrae token desde Authorization (Bearer upper/lower) o cookie "heaven" */
function extractToken(req) {
  const auth = req.headers["authorization"] || "";

  // Acepta 'Bearer <token>' o 'bearer <token>' (case-insensitive)
  const m = auth.match(/^bearer\s+(.+)$/i);
  if (m && m[1]) return m[1].trim();

  // Si vino un token "crudo" sin 'Bearer', úsalo igual
  if (auth) return auth.trim();

  // Cookie "heaven" (cruda o con adornos antiguos)
  const c = req.cookies?.heaven;
  if (c) {
    try {
      if (c.length > 20) {
        const maybe = c.slice(7, -7);
        if (maybe.length > 10) return maybe.trim();
      }
    } catch {}
    return c.trim();
  }
  return null;
}

function verifyToken(token) {
  try {
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload?.user ? payload.user : payload;
  } catch {
    return null;
  }
}

export default function authentication(req, _res, next) {
  const token = extractToken(req);
  req.currentUser = verifyToken(token);
  next();
}
