// frontend/src/routes/Private.jsx  (o la ruta real)
import { StoreContext } from "@/context/store";
import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import client from "@/api";

function Private() {
  const store = useContext(StoreContext);

  async function refreshToken() {
    try {
      // con withCredentials:true (ya está en el cliente) para enviar la cookie de refresh
      const r = await client.post("/user/refreshToken");
      // tu store debe guardar el nuevo access token (y quizá user)
      store.refreshToken(r?.data);
    } catch (e) {
      console.error("refreshToken error:", e?.response?.status, e?.message);
      store.logout();
      // opcional: redirigir a login sin recargar toda la página
      // window.location.reload();
    }
  }

  useEffect(() => {
    // intenta refrescar al montar
    refreshToken();

    // intervalo en minutos desde env (por defecto 9 min)
    const minutes = Number(import.meta.env.VITE_JWT_TIME || 9);
    const ms = isNaN(minutes) ? 9 * 60 * 1000 : minutes * 60 * 1000;

    const interval = setInterval(() => {
      refreshToken();
    }, ms);

    return () => clearInterval(interval);
  }, []);

  // si no hay sesión, manda a login
  if (!store.user) return <Navigate to={"/login"} replace />;

  return <Outlet />;
}

export default Private;
