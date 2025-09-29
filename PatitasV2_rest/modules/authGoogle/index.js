import express from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../user/model.js";
import { convertDurationToMilliseconds, makeHeaven } from "../../utils/index.js";

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  FRONTEND_URL,
  JWT_SECRET,
  JWT_TIME,
  NODE_ENV,
} = process.env;

const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

const routes = express.Router();

routes.get("/google", (req, res) => {
  const authUrl = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "openid",
    ],
  });
  res.redirect(authUrl);
});

function generateUsername(data) {
  return (data.email || "").split("@")[0];
}

function generateRandomPassword(length = 24) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

routes.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const { data: userInfo } = await client.request({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
    });

    let user = await User.findOne({ email: userInfo.email });
    if (!user) {
      user = new User({
        name: userInfo.name?.toUpperCase(),
        username: generateUsername(userInfo),
        email: userInfo.email,
        password: generateRandomPassword(),
        photo_url: userInfo.picture || null,
        last_login: new Date(),
      });
    } else {
      if (!user.is_active) return res.status(401).json({ message: "Usuario Deshabilitado" });
      user.name = userInfo.name?.toUpperCase();
      user.photo_url = userInfo.picture || null;
      user.last_login = new Date();
    }

    await user.save();
    const permissions = await user.get_all_permissions();

    const token = jwt.sign(
      { id: user.id, permissions, is_admin: user.is_admin },
      JWT_SECRET,
      { expiresIn: JWT_TIME }
    );

    user._doc.all_permissions = [...permissions];

    const formattedHeaven = makeHeaven(7) + token + makeHeaven(7);
    const formattedToken = makeHeaven(formattedHeaven.length);

    res.cookie("heaven", formattedHeaven, {
      httpOnly: true,
      maxAge: convertDurationToMilliseconds(JWT_TIME),
      secure: NODE_ENV === "production",
      sameSite: "Lax",
    });

    const encodedUserData = Buffer.from(JSON.stringify(user)).toString("base64");
    const encodedToken = Buffer.from(formattedToken).toString("base64");

    return res.redirect(`${FRONTEND_URL}/login?user=${encodedUserData}&token=${encodedToken}`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en la autenticación", error: err.toString() });
  }
});

export default routes;
