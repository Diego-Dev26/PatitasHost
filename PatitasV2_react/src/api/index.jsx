import axios from "axios";
const apiBaseURL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: apiBaseURL?.replace(/\/+$/, ""),
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  // lee lo que hayas guardado en login
  let raw = (localStorage.getItem("heaven") || "").trim();

  // si lo guardaste como 'bearer xxx' o 'Bearer xxx', quita ese prefijo
  if (raw.toLowerCase().startsWith("bearer ")) raw = raw.slice(7).trim();

  if (raw) config.headers["Authorization"] = `Bearer ${raw}`; // SIEMPRE 'Bearer ' mayúscula
  return config;
});

export default client;
