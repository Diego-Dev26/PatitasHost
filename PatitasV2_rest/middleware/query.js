// Middleware para verificar que query exista
export default async function (req, res, next) {
    if (!req.body?.query) {
        req.body.query = {};
    }
    next();
}