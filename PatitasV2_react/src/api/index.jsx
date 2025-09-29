// src/api/index.jsx
import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: apiBaseURL?.replace(/\/+$/, ""),
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true, // si usas refresh por cookie
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  let raw = (localStorage.getItem("heaven") || "").trim();
  if (raw.toLowerCase().startsWith("bearer ")) raw = raw.slice(7).trim();
  if (raw) config.headers["Authorization"] = `Bearer ${raw}`;
  return config;
});

export default client;
