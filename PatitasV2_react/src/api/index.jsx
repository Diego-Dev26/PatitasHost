import Swal from "sweetalert2";
import axios from "axios";

// Usa una única variable de entorno para la API pública
// En Vercel la pondremos a: https://patitashost.onrender.com
const apiBaseURL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: apiBaseURL?.replace(/\/+$/, ""), // quita slash final
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: false, // <- muy importante si no usas cookies
  timeout: 15000,
});

// limpia strings vacíos de JSON
const cleanEmptyStrings = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] && typeof obj[k] === "object") cleanEmptyStrings(obj[k]);
    else if (obj[k] === "") delete obj[k];
  });
};

client.interceptors.request.use((config) => {
  // token (si lo usas)
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
      console.error("API ERROR:", err.config?.url, err.response);
    }
    return Promise.reject(err);
  }
);

// Export por compatibilidad si lo importabas como default
export default client;
