import authentication from "./authentication.js";
import queryMiddleware from "./query.js";

export default function configureMiddleware(app) {
  // Asegúrate que ANTES de esto ya hiciste:
  // app.set("trust proxy", 1);
  // app.use(cors({ origin: ..., credentials: true }));
  // app.use(express.json());
  // app.use(cookieParser());

  app.use(authentication);   // ← importante: antes de las rutas
  app.use(queryMiddleware);  // crea req.body.query si no existe
}
