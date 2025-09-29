// middleware/authentication.js
import jwt from "jsonwebtoken";

function extractToken(req) {
  const auth = req.headers["authorization"] || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  if (auth) return auth.trim();
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
