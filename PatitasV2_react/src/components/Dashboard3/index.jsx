import { Fragment, useContext, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { StoreContext } from "@/context/store";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Notifications from "../Notifications";
import SideMenu from "../SideMenu";
import "./Dashboard2.css";
import { navigation, adminNavigation } from "@/router/Menu";
import PetStatsDashboard from "./PetDashboard";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const store = useContext(StoreContext);
  const navigate = useNavigate(); // 1. Insertamos useNavigate

  // Función simple que primero cierra sesión y luego redirige al login
  const handleLogout = () => {
    store.logout(); // se encarga de borrar token, limpiar estado, etc.
    navigate("/login"); // forzamos la navegación al login
  };

  return (
    <>
      <Notifications open={open} setOpen={setOpen} />

      {/* Wrapper principal */}
      <div className="min-h-full flex overflow-visible max-w-screen mx-auto">
        {/* SideMenu (siempre presente a la izquierda) */}
        <SideMenu
          navigation={navigation}
          adminNavigation={adminNavigation}
          store={store}
        />

        {/* Contenedor Principal: Header + Outlet */}
        <div className="flex flex-1 flex-col overflow-visible">
          {/* HEADER */}
          <div
            className="border-b border-blue-300 border-opacity-25"
            style={{ backgroundColor: "#5D8A66", borderColor: "#5D8A66" }}
          >
            <div className="px-3 sm:px-6 2xl:px-10">
              {/* h-16 = 64px de alto; overflow-visible para que el dropdown no quede recortado */}
              <div className="relative flex items-center justify-between h-16 lg:border-b lg:border-indigo-400 lg:border-opacity-25 overflow-visible">
                <img
                  src="/logo.png"
                  className="2xl:w-16 2xl:h-16 sm:w-14 sm:h-14 w-8 h-8 bg-white rounded-r-md p-0.5 sm:mt-2 2xl:mt-4"
                  alt="Logo"
                />

                <div className="w-full flex px-1 rounded-md border-gray-500">
                  <div className="w-full ml-4 flex justify-end items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3 overflow-visible">
                      <div>
                        <Menu.Button className="bg-white flex max-w-xs items-center rounded-full sm:text-sm text-xs focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-300">
                          <span className="text-sm font-medium text-gray-700 lg:block hidden">
                            {store?.user?.name ||
                              `${store.user?.nombres ?? ""} ${
                                store.user?.primerApellido ?? ""
                              }`}
                          </span>
                          <ChevronDownIcon
                            className="ml-2 h-6 w-6 flex-shrink-0 text-gray-400"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        {/* Con z-50 garantizamos que esté por encima de cualquier tabla o contenido */}
                        <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/dashboard/user/profile"
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 sm:text-sm text-xs text-gray-700 w-full text-left"
                                )}
                              >
                                Perfil
                              </Link>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={classNames(
                                  active ? "bg-gray-100" : "",
                                  "block px-4 py-2 sm:text-sm text-xs text-gray-700 w-full text-left"
                                )}
                              >
                                Cerrar Sesión
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN: aquí se renderiza la vista activa (por ejemplo “Lista de Mascotas”) */}
          <main className="flex-1 bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              <div className="relative">
                {location.pathname === "/dashboard" ? (
                  <div className="flex-1 overflow-y-auto">
                    <PetStatsDashboard />
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-md p-6 min-h-[calc(100vh-180px)]">
                    <Outlet />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
