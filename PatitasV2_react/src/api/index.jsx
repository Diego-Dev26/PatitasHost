import Swal from "sweetalert2";
import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/+$/, ""),
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 15000,
});

// Limpia strings vacíos
const cleanEmptyStrings = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] && typeof obj[k] === "object") cleanEmptyStrings(obj[k]);
    else if (obj[k] === "") delete obj[k];
  });
};

// Adjunta token normalizado como Bearer
client.interceptors.request.use((config) => {
  let raw = (localStorage.getItem("heaven") || "").trim();
  if (raw.toLowerCase().startsWith("bearer ")) raw = raw.slice(7).trim();
  if (raw) config.headers["Authorization"] = `Bearer ${raw}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === "ECONNABORTED") {
      Swal.fire("Problema de Conexión", "Revisa tu internet.", "warning");
    } else if (!import.meta.env.PROD) {
      console.error("API ERROR:", err.config?.url, err.response);
    }
    return Promise.reject(err);
  }
);

export default client;
