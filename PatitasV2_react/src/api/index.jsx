// src/api/index.jsx
import Swal from "sweetalert2";
import axios from "axios";

const api_uri =
  import.meta.env.VITE_NODE_ENV == "dev"
    ? import.meta.env.VITE_GRAPHQL_URI
    : import.meta.env.VITE_GRAPHQL_URI;
// Usa directa la URL de tu API, sin jugar con NODE_ENV
const client = axios.create({
  baseURL: api_uri,
  timeout: 90000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// limpia strings vacíos de JSON
const cleanEmptyStrings = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] && typeof obj[k] === "object") cleanEmptyStrings(obj[k]);
    else if (obj[k] === "") delete obj[k];
  });
};

client.interceptors.request.use((config) => {
  // token
  const token = localStorage.getItem("heaven");
  if (token) config.headers["Authorization"] = token;

  // limpia payload
  if (config.data && config.headers["Content-Type"] === "application/json") {
    const d =
      typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    cleanEmptyStrings(d);
    config.data = typeof config.data === "string" ? JSON.stringify(d) : d;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === "ECONNABORTED") {
      Swal.fire("Problema de Conexión", "Revisa tu internet.", "warning");
    } else if (!import.meta.env.PROD) {
      console.error("API ERROR:", err.config.url, err.response);
    }
    return Promise.reject(err);
  }
);

export default client;
