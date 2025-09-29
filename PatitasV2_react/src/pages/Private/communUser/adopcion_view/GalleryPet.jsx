// src/pages/Public/Mascota/GalleryPet.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@/api";
import "./GalleryPet.css";

// Si tienes una imagen base en /public/default-pet.jpg puedes usarla así:
const DEFAULT_IMG = "/imgPerro.jpg";

export default function GalleryPet() {
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
      .catch((err) => console.error(err));
  }, []);

  const filtradas = mascotas
    .filter((m) => !filtros.raza || m.raza === filtros.raza)
    .filter((m) => !filtros.especie || m.especie === filtros.especie)
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
        <span className="filters-label">Ordenar por:</span>
        <select
          onChange={(e) => setFiltros({ ...filtros, raza: e.target.value })}
        >
          <option value="">Raza</option>
          {/* Si quieres, mapea aquí las razas dinámicamente */}
        </select>
        <select
          onChange={(e) => setFiltros({ ...filtros, especie: e.target.value })}
        >
          <option value="">Especie</option>
          <option value="Perro">Perro</option>
          <option value="Gato">Gato</option>
        </select>
        <select
          onChange={(e) => setFiltros({ ...filtros, edad: e.target.value })}
        >
          <option value="">Edad</option>
          <option value="joven">Menor a 3</option>
          <option value="adulto">3 o más</option>
        </select>
        <select
          onChange={(e) => setFiltros({ ...filtros, genero: e.target.value })}
        >
          <option value="">Género</option>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
        <input
          type="text"
          placeholder="Buscar por nombre"
          onChange={(e) => setFiltros({ ...filtros, search: e.target.value })}
        />
      </div>

      {/* Grilla */}
      <div className="cards-grid">
        {filtradas.map((m) => {
          // Usa la primera imagen o la de defecto
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
