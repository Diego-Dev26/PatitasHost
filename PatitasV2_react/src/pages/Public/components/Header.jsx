// src/components/PublicHeader.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import Logo from "@/assets/logo.png";

export default function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { label: "INICIO", path: "/" },
    { label: "QUIÉNES SOMOS", path: "/quienes-somos" },
    { label: "MASCOTAS", path: "/mascotas" },
  ];

  return (
    <header
      className="w-full shadow-md"
      style={{ backgroundColor: "#5D8A66", borderColor: "#5D8A66" }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="w-10 h-10" />
          <span className="text-white font-bold text-xl hidden sm:block">
            PATITAS
          </span>
        </Link>

        {/* Menú de escritorio */}
        <nav className="hidden md:flex space-x-4 text-white font-semibold text-sm lg:text-base">
          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} className="hover:underline">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Login / Icono */}
        <div className="flex items-center space-x-2">
          <Link
            to="/login"
            className="text-white font-semibold hidden sm:block"
          >
            INICIAR SESION
          </Link>
          <FaUserCircle className="text-white text-2xl" />
        </div>

        {/* Botón hamburguesa móvil */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden text-white text-2xl focus:outline-none"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-[#5D8A66] px-6 pb-4">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className="block py-2 text-white font-semibold border-b border-white/20"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/login" className="block py-2 text-white font-semibold">
            login
          </Link>
        </div>
      )}
    </header>
  );
}
