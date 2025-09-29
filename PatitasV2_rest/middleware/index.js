import authentication from "./authentication.js";
import queryMiddleware from "./query.js";

export default function configureMiddleware(app) {
  app.use(authentication);
  app.use(queryMiddleware);
}
