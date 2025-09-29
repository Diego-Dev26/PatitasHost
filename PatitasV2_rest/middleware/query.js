export default function (req, _res, next) {
  if (!req.body?.query) req.body.query = {};
  next();
}
