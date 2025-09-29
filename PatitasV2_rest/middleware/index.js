// middleware/index.js
import authentication from "./authentication.js";
import queryMiddleware from "./query.js";

export default function configureMiddleware(app) {
  app.use(authentication);   // <- primero, así ya tienes req.currentUser
  app.use(queryMiddleware);  // <- crea req.body.query si no existe
}
