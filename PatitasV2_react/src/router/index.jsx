// src/router/index.jsx
import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// ─── Layouts ───────────────────────────────────────────────
import PublicLayout from "@/pages/Public/components/Layout";
import PrivateLayout from "@/pages/Private/components/Layout";

// ─── Páginas públicas ───────────────────────────────────────
import Public from "@/pages/Public";
import GalleryPets from "@/pages/Public/Mascota/GalleryPet";
import MascotaDetail from "@/pages/Public/Mascota/MascotaDetail";
import Login from "@/pages/Public/Login1";
import Register from "@/pages/Public/Register/Register";
import QuienesSomos from "@/pages/Public/QuienesSomos/QuienesSomos";

// ─── Componente que envuelve rutas privadas ─────────────────
import Private from "@/pages/Private";
import PermissionCheck from "@/components/PermissionCheck";
import PetStatsDashboard from "@/components/Dashboard3";

// ─── Spinner y página 404 ──────────────────────────────────
import Loading from "@/components/Loading";
const NotFound = lazy(() => import("@/pages/Public/Errors/404"));

// ─── Dashboard (ejemplo lazy) ───────────────────────────────
const Dashboard = lazy(() => import("@/components/Dashboard3"));

// ─── Rutas privadas específicas ─────────────────────────────
// Usuarios
import User_list from "@/pages/Private/admin/user/User_list";
import User_report from "@/pages/Private/admin/user/User_report";
import User_form from "@/pages/Private/admin/user/User_form";
import User_detail from "@/pages/Private/admin/user/User_detail";
import User_delete from "@/pages/Private/admin/user/User_delete";
import User_profile from "@/pages/Private/admin/user/User_profile";
// Grupos
import Group_list from "@/pages/Private/admin/group/Group_list";
import Group_report from "@/pages/Private/admin/group/Group_report";
import Group_form from "@/pages/Private/admin/group/Group_form";
import Group_detail from "@/pages/Private/admin/group/Group_detail";
import Group_delete from "@/pages/Private/admin/group/Group_delete";
// Mascotas (private)
import Mascota_list from "@/pages/Private/mascotas/mascota/Mascota_list";
import Mascota_report from "@/pages/Private/mascotas/mascota/Mascota_report";
import Mascota_form from "@/pages/Private/mascotas/mascota/Mascota_form";
import Mascota_detailP from "@/pages/Private/mascotas/mascota/Mascota_detail";
import Mascota_detailPCommun from "@/pages/Private/communUser/adopcion_view/MascotaDetail";
import Mascota_delete from "@/pages/Private/mascotas/mascota/Mascota_delete";
// Historial
import Historial_list from "@/pages/Private/mascotas/historial/Historial_list";
import Historial_report from "@/pages/Private/mascotas/historial/Historial_report";
import Historial_form from "@/pages/Private/mascotas/historial/Historial_form";
import Historial_detail from "@/pages/Private/mascotas/historial/Historial_detail";
import Historial_delete from "@/pages/Private/mascotas/historial/Historial_delete";
// Adopciones
import Adopcion_list from "@/pages/Private/mascotas/adopcion/Adopcion_list";
import Adopcion_report from "@/pages/Private/mascotas/adopcion/Adopcion_report";
import Adopcion_form from "@/pages/Private/mascotas/adopcion/Adopcion_form";
import Adopcion_detail from "@/pages/Private/mascotas/adopcion/Adopcion_detail";
import Adopcion_delete from "@/pages/Private/mascotas/adopcion/Adopcion_delete";
// Denuncias
import Denuncia_list from "@/pages/Private/denuncias/denuncia/Denuncia_list";
import Denuncia_report from "@/pages/Private/denuncias/denuncia/Denuncia_report";
import Denuncia_form from "@/pages/Private/denuncias/denuncia/Denuncia_form";
import Denuncia_detail from "@/pages/Private/denuncias/denuncia/Denuncia_detail";
import Denuncia_delete from "@/pages/Private/denuncias/denuncia/Denuncia_delete";

import Denuncia from "@/pages/Public/Denuncia/index";
// Ruta de ejemplo para usuarios comunes
import CommunUserIndex from "@/pages/Private/communUser/index";
import MisMascotas from "@/pages/Private/communUser/mis_mascotas/MisMascotas";
import MascotaFormComun from "@/pages/Private/communUser/mis_mascotas/MascotaFormComun";
import HistorialFormComun from "@/pages/Private/communUser/historial/HistorialFormComun";
import MiMascotaDetail from "@/pages/Private/communUser/mis_mascotas/MiMascotaDetail";

// ─── Helper para envolver rutas que requieren permisos ────────
function Page({ Component, permissions }) {
  if (permissions && permissions.length) {
    return (
      <PermissionCheck permissions={permissions}>
        <Suspense fallback={<Loading />}>
          <Component />
        </Suspense>
      </PermissionCheck>
    );
  }
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
}

const publicRoutesLayout = [
  {
    element: <PublicLayout />, // Layout con Header/​Footer
    children: [
      { path: "/", element: <Public /> },
      { path: "mascotas", element: <GalleryPets /> },
      {
        path: "mascotasT/:id",
        element: <MascotaDetail />,
      },
      { path: "quienes-somos", element: <QuienesSomos /> },
    ],
  },
];

const publicRoutes = [
  {
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
];

const privateCommunRoutes = [
  {
    element: <PrivateLayout />,
    children: [
      {
        path: "commun-user",
        element: <Page Component={CommunUserIndex} permissions={[]} />,
      },
      {
        path: "mis-mascotas",
        element: (
          <Page Component={MisMascotas} permissions={["read_mascota"]} />
        ),
      },
      {
        path: "mascota/detail/:id",
        element: (
          <Page Component={Mascota_detailP} permissions={["read_mascota"]} />
        ),
      },
      {
        path: "crear-mascota",
        element: (
          <Page Component={MascotaFormComun} permissions={["create_mascota"]} />
        ),
      },
      {
        path: "editar-mascota/:id",
        element: (
          <Page Component={MascotaFormComun} permissions={["update_mascota"]} />
        ),
      },
      {
        path: "mascotas/:id",
        element: <Mascota_detailPCommun />,
      },
      {
        path: "denuncia/crear/:id",
        element: <Denuncia />,
      },
      {
        path: "commun-user/historial-form-comun/:id",
        element: (
          <Page
            Component={HistorialFormComun}
            permissions={["create_historial"]}
          />
        ),
      },
      {
        path: "mis-mascotas/detail/:id",
        element: (
          <Page Component={MiMascotaDetail} permissions={["update_mascota"]} />
        ),
      },
    ],
  },
];

const privateRoutes = [
  {
    //element: <PrivateLayout />,
    children: [
      // Ejemplo de ruta pública dentro del área privada (común usuario)

      // Dashboard y subrutas administrativas
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
        children: [
          // Usuarios
          {
            index: true, // Esto mostrará el contenido cuando la ruta sea exactamente /dashboard
            element: <PetStatsDashboard /> // Este es el mismo componente que creamos en el paso 1
          },
          {
            path: "user/list",
            element: <Page Component={User_list} permissions={["read_user"]} />,
          },
          {
            path: "user/report",
            element: (
              <Page Component={User_report} permissions={["report_user"]} />
            ),
          },
          {
            path: "user/create",
            element: (
              <Page Component={User_form} permissions={["create_user"]} />
            ),
          },
          {
            path: "user/detail/:id",
            element: (
              <Page Component={User_detail} permissions={["read_user"]} />
            ),
          },
          {
            path: "user/update/:id",
            element: (
              <Page Component={User_form} permissions={["update_user"]} />
            ),
          },
          {
            path: "user/delete/:id",
            element: (
              <Page Component={User_delete} permissions={["delete_user"]} />
            ),
          },
          {
            path: "user/profile",
            element: <Page Component={User_profile} permissions={[]} />,
          },

          // Grupos
          {
            path: "group/list",
            element: (
              <Page Component={Group_list} permissions={["read_group"]} />
            ),
          },
          {
            path: "group/report",
            element: (
              <Page Component={Group_report} permissions={["report_group"]} />
            ),
          },
          {
            path: "group/create",
            element: (
              <Page Component={Group_form} permissions={["create_group"]} />
            ),
          },
          {
            path: "group/detail/:id",
            element: (
              <Page Component={Group_detail} permissions={["read_group"]} />
            ),
          },
          {
            path: "group/update/:id",
            element: (
              <Page Component={Group_form} permissions={["update_group"]} />
            ),
          },
          {
            path: "group/delete/:id",
            element: (
              <Page Component={Group_delete} permissions={["delete_group"]} />
            ),
          },

          // Mascotas privadas
          {
            path: "mascota/list",
            element: (
              <Page Component={Mascota_list} permissions={["read_mascota"]} />
            ),
          },
          {
            path: "mascota/report",
            element: (
              <Page
                Component={Mascota_report}
                permissions={["report_mascota"]}
              />
            ),
          },
          {
            path: "mascota/create",
            element: (
              <Page Component={Mascota_form} permissions={["create_mascota"]} />
            ),
          },
          {
            path: "mascota/detail/:id",
            element: (
              <Page
                Component={Mascota_detailP}
                permissions={["read_mascota"]}
              />
            ),
          },
          {
            path: "mascota/update/:id",
            element: (
              <Page Component={Mascota_form} permissions={["update_mascota"]} />
            ),
          },
          {
            path: "mascota/delete/:id",
            element: (
              <Page
                Component={Mascota_delete}
                permissions={["delete_mascota"]}
              />
            ),
          },

          // Historial
          {
            path: "historial/list",
            element: (
              <Page
                Component={Historial_list}
                permissions={["read_historial"]}
              />
            ),
          },
          {
            path: "historial/report",
            element: (
              <Page
                Component={Historial_report}
                permissions={["report_historial"]}
              />
            ),
          },
          {
            path: "historial/create",
            element: (
              <Page
                Component={Historial_form}
                permissions={["create_historial"]}
              />
            ),
          },
          {
            path: "historial/detail/:id",
            element: (
              <Page
                Component={Historial_detail}
                permissions={["read_historial"]}
              />
            ),
          },
          {
            path: "historial/update/:id",
            element: (
              <Page
                Component={Historial_form}
                permissions={["update_historial"]}
              />
            ),
          },
          {
            path: "historial/delete/:id",
            element: (
              <Page
                Component={Historial_delete}
                permissions={["delete_historial"]}
              />
            ),
          },

          // Adopciones
          {
            path: "adopcion/list",
            element: (
              <Page Component={Adopcion_list} permissions={["read_adopcion"]} />
            ),
          },
          {
            path: "adopcion/report",
            element: (
              <Page
                Component={Adopcion_report}
                permissions={["report_adopcion"]}
              />
            ),
          },
          {
            path: "adopcion/create",
            element: (
              <Page
                Component={Adopcion_form}
                permissions={["create_adopcion"]}
              />
            ),
          },
          {
            path: "adopcion/detail/:id",
            element: (
              <Page
                Component={Adopcion_detail}
                permissions={["read_adopcion"]}
              />
            ),
          },
          {
            path: "adopcion/update/:id",
            element: (
              <Page
                Component={Adopcion_form}
                permissions={["update_adopcion"]}
              />
            ),
          },
          {
            path: "adopcion/delete/:id",
            element: (
              <Page
                Component={Adopcion_delete}
                permissions={["delete_adopcion"]}
              />
            ),
          },

          // Denuncias
          {
            path: "denuncia/list",
            element: (
              <Page Component={Denuncia_list} permissions={["read_denuncia"]} />
            ),
          },
          {
            path: "denuncia/report",
            element: (
              <Page
                Component={Denuncia_report}
                permissions={["report_denuncia"]}
              />
            ),
          },
          {
            path: "denuncia/create",
            element: (
              <Page
                Component={Denuncia_form}
                permissions={["create_denuncia"]}
              />
            ),
          },
          {
            path: "denuncia/create/:id",
            element: (
              <Page
                Component={Denuncia_form}
                permissions={["create_denuncia"]}
              />
            ),
          },
          {
            path: "denuncia/detail/:id",
            element: (
              <Page
                Component={Denuncia_detail}
                permissions={["read_denuncia"]}
              />
            ),
          },
          {
            path: "denuncia/update/:id",
            element: (
              <Page
                Component={Denuncia_form}
                permissions={["update_denuncia"]}
              />
            ),
          },
          {
            path: "denuncia/delete/:id",
            element: (
              <Page
                Component={Denuncia_delete}
                permissions={["delete_denuncia"]}
              />
            ),
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      ...publicRoutesLayout,
      ...publicRoutes,
      ...privateRoutes,
      ...privateCommunRoutes,
      {
        path: "*",
        element: (
          <Suspense fallback={<Loading />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
