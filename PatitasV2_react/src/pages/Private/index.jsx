import { StoreContext } from "@/context/store";
import React, { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import client from "@/api";

function Private() {
  const store = useContext(StoreContext);

  function refreshToken() {
    client
      .post("/user/refreshToken")
      .then((r) => {
        store.refreshToken(r?.data);
      })
      .catch((e) => {
        store.logout();
        window.location.reload();
      });
  }
  useEffect(() => {
    refreshToken();
    const interval = setInterval(() => {
      refreshToken();
    }, parseInt(import.meta.env.VITE_JWT_TIME) * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  //if (loading) return null;
  if (!store.user) return <Navigate to={"/login"} />;

  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
}

export default Private;
