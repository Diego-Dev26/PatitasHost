// src/components/PrivateHeader/PrivateHeader.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "@/context/store"; // ✔ trae tu contexto
import logo from "@/assets/logo.png"; // ✔ ajusta la extensión y ruta
import "./PrivateHeader.css";

export default function PrivateHeader() {
  const navigate = useNavigate();
  const store = useContext(StoreContext); // ✔ obtén el store

  const handleLogout = () => {
    store.logout(); // ✔ limpia user + token
    navigate("/", { replace: true }); // navega a login
  };

  return (
    <header className="private-header">
      <div className="ph-left">
        <Link to="/commun-user" className="ph-logo">
          <img src={logo} alt="Patitas" />
          <span>Patitas</span>
        </Link>
      </div>
      <nav className="ph-nav">
        <Link to="/commun-user" className="ph-link">
          Inicio
        </Link>
        <Link to="/mis-mascotas" className="ph-link">
          Mis Mascotas
        </Link>
      </nav>
      <div className="ph-right">
        <button onClick={handleLogout} className="ph-logout">
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
