// src/pages/Private/communUser/index.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@/api";
import "./adopcion_view/GalleryPet.css"; // Reutiliza el mismo CSS

const DEFAULT_IMG = "/imgPerro.jpg";

export default function CommunUserIndex() {
  const [mascotas, setMascotas] = useState([]);
  const [filtros, setFiltros] = useState({
    raza: "",
    especie: "",
    edad: "",
    genero: "",
    search: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    client
      .get("/mascota/available")
      .then((res) => setMascotas(res.data))
      .catch((err) => console.error("❌ Error cargando mascotas:", err));
  }, []);

  const filtradas = mascotas
    .filter(
      (m) =>
        !filtros.raza ||
        m.raza?.toLowerCase().includes(filtros.raza.toLowerCase())
    )
    .filter(
      (m) =>
        !filtros.especie ||
        m.especie?.toLowerCase().includes(filtros.especie.toLowerCase())
    )
    .filter((m) => {
      if (!filtros.edad) return true;
      const años =
        new Date().getFullYear() - new Date(m.fecha_nacimiento).getFullYear();
      return filtros.edad === "joven" ? años < 3 : años >= 3;
    })
    .filter((m) => !filtros.genero || m.genero === filtros.genero)
    .filter((m) =>
      m.nombre.toLowerCase().includes(filtros.search.toLowerCase())
    );

  return (
    <div className="gallery-container">
      {/* Filtros */}
      <div className="filters-bar">
        <span className="filters-label">Filtrar por:</span>
        <input
          type="text"
          placeholder="Raza"
          value={filtros.raza}
          onChange={(e) => setFiltros({ ...filtros, raza: e.target.value })}
        />
        <input
          type="text"
          placeholder="Especie"
          value={filtros.especie}
          onChange={(e) => setFiltros({ ...filtros, especie: e.target.value })}
        />

        <select
          value={filtros.genero}
          onChange={(e) => setFiltros({ ...filtros, genero: e.target.value })}
        >
          <option value="">Género</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtros.search}
          onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
        />
      </div>

      {/* Grilla */}
      <div className="cards-grid">
        {filtradas.map((m) => {
          const imgUrl = m.imagen?.[0]?.url || m.imagen?.[0] || DEFAULT_IMG;

          return (
            <div
              key={m._id}
              className="card"
              onClick={() => navigate(`/mascotas/${m._id}`)}
            >
              <div className="card-img">
                <img src={imgUrl} alt={m.nombre} className="img-cover" />
              </div>
              <div className="card-name">{m.nombre}</div>
            </div>
          );
        })}
      </div>

      {filtradas.length === 0 && (
        <p className="no-results">No se encontraron mascotas.</p>
      )}
    </div>
  );
}
