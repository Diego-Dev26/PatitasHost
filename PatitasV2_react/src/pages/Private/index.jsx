import { StoreContext } from "@/context/store";
import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import client from "@/api";

function Private() {
  const store = useContext(StoreContext);

  function hasRefreshCookie() {
    // intentamos detectar cookie de refresh "heaven"
    return typeof document !== "undefined" && document.cookie.includes("heaven=");
  }

  async function refreshToken() {
    try {
      const r = await client.post("/user/refreshToken");
      // Esperamos { token, user? }
      if (r?.data?.token) store.refreshToken(r.data);
      if (r?.data?.user)  store.login(r.data); // si tu API devuelve user en refresh
    } catch (e) {
      // NO BORRES LA SESIÓN AQUÍ: puede fallar por cookie/samesite sin que tu token de acceso esté mal
      console.warn("refreshToken fallo (ignorado):", e?.response?.status, e?.message);
    }
  }

  useEffect(() => {
    // Solo intenta refrescar si hay cookie de refresh
    if (hasRefreshCookie()) {
      refreshToken();
      const minutes = Number(import.meta.env.VITE_JWT_TIME || 9);
      const intervalMs = (isNaN(minutes) ? 9 : minutes) * 60 * 1000;
      const interval = setInterval(refreshToken, intervalMs);
      return () => clearInterval(interval);
    }
  }, []);

  // Si no hay usuario logeado, bloquea
  if (!store.user) return <Navigate to={"/login"} replace />;

  return <Outlet />;
}

export default Private;
