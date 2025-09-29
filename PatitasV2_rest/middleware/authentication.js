// middleware/authentication.js
import jwt from "jsonwebtoken";

/**
 * Intenta extraer el token JWT desde:
 *  1) Header Authorization ("Bearer <token>" o token crudo)
 *  2) Cookie "heaven" (cruda o con prefijo/sufijo antiguos)
 */
function extractToken(req) {
  // 1) Authorization
  const auth = req.headers["authorization"] || "";
  if (auth) {
    if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
    return auth.trim();
  }

  // 2) Cookie "heaven"
  const c = req.cookies?.heaven;
  if (c) {
    // Compatibilidad con formatos antiguos donde se agregaban 7 chars a ambos lados
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

/**
 * Verifica el JWT y devuelve el "usuario actual".
 * - Si firmaste como { user: {...} } → devuelve user
 * - Si firmaste como { id, email, is_admin, permissions, ... } → devuelve el payload completo
 */
function verifyToken(token) {
  try {
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload?.user ? payload.user : payload;
  } catch {
    return null;
  }
}

/**
 * Middleware de autenticación:
 *  - Pone req.currentUser (objeto o null)
 *  - NO corta la request; tus handlers decidirán con auth_required()
 */
export default function authentication(req, _res, next) {
  const token = extractToken(req);
  req.currentUser = verifyToken(token);
  next();
}
