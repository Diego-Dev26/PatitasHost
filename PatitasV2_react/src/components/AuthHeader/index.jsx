// src/components/AuthHeader.jsx
import React, { Fragment, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import { FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { StoreContext } from "@/context/store";
import Logo from "@/assets/logo.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AuthHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const store = useContext(StoreContext);
  const user = store.user;
  const navigate = useNavigate();

  const navLinks = [
    { label: "Dashboard", path: "/dashboard" },
    // añade aquí más enlaces internos si quieres…
  ];

  return (
    <header className="w-full shadow-md bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo (click al dashboard) */}
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="w-10 h-10" />
          <span className="text-gray-800 font-bold text-xl hidden sm:block">
            PATITAS
          </span>
        </Link>

        {/* Menú de escritorio */}
        <nav className="hidden md:flex space-x-4 text-gray-700 font-medium">
          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {/* Notificaciones u otros iconos… */}

          {/* Perfil / Login */}
          {!user ? (
            <Link
              to="/login"
              className="text-gray-700 font-semibold hidden sm:block"
            >
              login
            </Link>
          ) : (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-1 focus:outline-none">
                {user.photo_url ? (
                  <img
                    src={user.photo_url}
                    alt="avatar"
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                    <FaUserCircle className="text-white text-2xl" />
                  </span>
                )}
                <span className="hidden sm:block text-gray-700">
                  {user.name}
                </span>
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-md focus:outline-none z-20">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate("/dashboard/user/profile")}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block w-full text-left px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Perfil
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          store.logout();
                          navigate("/login");
                        }}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block w-full text-left px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        Cerrar sesión
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden text-gray-700 text-2xl focus:outline-none ml-4"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-4 space-y-2">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className="block py-2 text-gray-700 font-medium border-b border-gray-200"
            >
              {link.label}
            </Link>
          ))}

          {!user ? (
            <Link to="/login" className="block py-2 text-gray-700 font-medium">
              login
            </Link>
          ) : (
            <>
              <button
                onClick={() => navigate("/dashboard/user/profile")}
                className="w-full text-left py-2 text-gray-700 font-medium border-b border-gray-200"
              >
                Perfil
              </button>
              <button
                onClick={() => {
                  store.logout();
                  navigate("/login");
                }}
                className="w-full text-left py-2 text-gray-700 font-medium"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
