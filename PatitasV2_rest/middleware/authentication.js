import jwt from 'jsonwebtoken';
// Función para verificar el token JWT
export async function verifyToken(token) {
    try {
        if (!token) return null;
        const userToken = jwt.verify(token, process.env.JWT_SECRET);
        //Descomentar para mayor seguridad de verificacion
        //import User from '../modules/user/model.js'; //llevar arriba
        //const currentUser = await User.findById(userToken.id);
        //incluir all_permissions
        //return {currentUser}
        return userToken;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Middleware principal para verificar el token JWT
export default async function (req, res, next) {
    const token = (req.cookies && req.cookies.heaven) ? req.cookies.heaven.slice(7, -7) : null;
    const user = await verifyToken(token);
    // Agrega la información del usuario autenticado a la solicitud
    req.currentUser = user;
    next();
}
