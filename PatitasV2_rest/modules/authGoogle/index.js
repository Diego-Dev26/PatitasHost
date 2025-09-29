import express from "express";
import {
  convertDurationToMilliseconds,
  makeHeaven,
} from "../../utils/index.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../user/model.js";
import fs from "fs";

// Importar configuración OAuth2 desde un archivo JSON
const keys = JSON.parse(
  fs.readFileSync("./modules/authGoogle/oauth2.keys.json", "utf8")
);

const routes = express.Router();
const CLIENT_ID = keys.web.client_id;
const CLIENT_SECRET = keys.web.client_secret;
const REDIRECT_URI = keys.web.redirect_uris[0];

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Ruta para iniciar el proceso de autenticación con Google
routes.get("/google", (req, res) => {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
  res.redirect(authUrl);
});

function generateUsername(data) {
  let username = data.email;
  username = username.split("@")[0];
  return username;
}

function generateRandomPassword(length = 10) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
}

// Ruta de callback para recibir el código de Google
routes.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    const userInfo = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    // Buscar si el usuario ya existe en la base de datos
    let user = await User.findOne({ email: userInfo.data.email });

    if (!user) {
      // Si el usuario no existe, crear uno nuevo
      user = new User({
        name: userInfo.data.name.toUpperCase(),
        username: generateUsername(userInfo.data),
        email: userInfo.data.email,
        password: generateRandomPassword(24),
        photo_url: userInfo?.data?.picture || null,
        last_login: new Date(),
      });
    } else {
      if (!user.is_active)
        return res.status(401).json({ message: "Usuario Deshabilitado" });
      user.name = userInfo.data.name.toUpperCase();
      user.photo_url = userInfo?.data?.picture || null;
      user.last_login = new Date();
    }

    await user.save();
    const permissions = await user.get_all_permissions();
    const token = jwt.sign(
      {
        id: user.id,
        permissions,
        is_admin: user.is_admin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_TIME,
      }
    );
    user._doc.all_permissions = [...permissions];
    const formattedHeaven = makeHeaven(7) + token + makeHeaven(7);
    const formattedToken = makeHeaven(formattedHeaven.length);

    res.cookie("heaven", formattedHeaven, {
      httpOnly: true,
      maxAge: convertDurationToMilliseconds(process.env.JWT_TIME),
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    const encodedUserData = Buffer.from(JSON.stringify(user)).toString(
      "base64"
    );
    const encodedToken = Buffer.from(formattedToken).toString("base64");
    return res.redirect(
      `http://localhost:5173/login?user=${encodedUserData}&token=${encodedToken}`
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error en la autenticación", error });
  }
});

export default routes;
