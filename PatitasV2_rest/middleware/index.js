import authMiddleware from './authentication.js';
import queryMiddleware from './query.js';

// Middleware compuesto que combina todos los middleware personalizados
export default function (app) {
    app.use(authMiddleware);
    app.use(queryMiddleware);
};