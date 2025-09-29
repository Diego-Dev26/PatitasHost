import { Fragment, useContext, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link, Outlet } from "react-router-dom";
import { StoreContext } from "@/context/store";
import Logo from "@/assets/logo.png";
import { BellIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import "./Dashboard2.css";
import Notifications from "../Notifications";
import { navigation, adminNavigation } from "@/router/Menu";
import SideMenu from "../SideMenu";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Dashboard() {
  const [open, setOpen] = useState(false); //notifications
  const store = useContext(StoreContext);

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <Notifications open={open} setOpen={setOpen} />
      <div className="min-h-full flex">
        {/* SIDE MENU */}
        <SideMenu
          navigation={navigation}
          adminNavigation={adminNavigation}
          store={store}
        />
        <div className="flex flex-1 flex-col">
          <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-gray-900 no-print">
            <img
              src="/logo.png"
              className="w-auto h-16 bg-white rounded-r-md p-0.5"
            />
            <div className="w-full flex px-1 rounded-md border-gray-500">
              <div className="w-full ml-4 flex justify-end items-center md:ml-6">
                <button
                  type="button"
                  className="rounded-full bg-white hover:bg-gray-300 p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon
                    className="h-6 w-6 text-red-600 animate-pulse"
                    aria-hidden="true"
                    onClick={() => setOpen(!open)}
                  />
                </button>
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="bg-white flex max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-300">
                      {store?.user?.photo_url != "" ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={store.user.photo_url}
                          alt=""
                        />
                      ) : (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
                          <span className="text-sm font-medium leading-none text-white">
                            {store.user.name[0].toUpperCase()}
                          </span>
                        </span>
                      )}
                      <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                        <span className="sr-only">Open user menu for </span>
                        {store?.user?.name}
                      </span>
                      <ChevronDownIcon
                        className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block"
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard/user/profile"
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                            )}
                          >
                            Perfil
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => store.logout()}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 w-full text-left"
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
          <main className="flex-1 pb-8">
            <div className="relative z-0 mt-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
