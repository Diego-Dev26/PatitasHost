// src/pages/Private/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

// Tu menú lateral (asegúrate de que la ruta coincida con tu carpeta)
import SideMenu from "@/components/SideMenu";

// Tu header para usuarios autenticados
import PrivateHeader from "@/components/PrivateHeader/PrivateHeader";

export default function PrivateLayout() {
  return (
   <div className="flex-1 flex flex-col">
        {/* Header privado */}
        <PrivateHeader />

        {/* Contenido de las rutas hijas */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
  );
}
