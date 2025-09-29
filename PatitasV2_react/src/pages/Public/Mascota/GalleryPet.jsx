// src/components/GalleryPet.jsx  (ajusta la ruta si la tuya es distinta)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@/api";
import "./GalleryPet.css";

const DEFAULT_IMG = "/imgPerro.jpg";

export default function GalleryPet() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [filtros, setFiltros] = useState({
    raza: "",
    especie: "",
    genero: "",
    search: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchPets() {
      try {
        setLoading(true);
        setErrMsg("");

        const res = await client.get("/mascota/available");
        const raw = res?.data;

        // 👇 Normaliza el shape: admite [ ... ] o { data:[...] } o { pets:[...] } o { results:[...] }
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
          ? raw.data
          : Array.isArray(raw?.pets)
          ? raw.pets
          : Array.isArray(raw?.results)
          ? raw.results
          : [];

        if (mounted) setMascotas(list);
      } catch (e) {
        console.error("fetchPets error:", e);
        if (mounted) setErrMsg("No se pudo cargar la lista de mascotas.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchPets();
    return () => {
      mounted = false;
    };
  }, []);

  // Normaliza strings para evitar errores cuando alguna propiedad viene undefined/null
  const norm = (v) => (typeof v === "string" ? v : v ? String(v) : "");

  const filtradas = mascotas
    .filter((m) => norm(m.raza).toLowerCase().includes(filtros.raza.toLowerCase()))
    .filter((m) => norm(m.especie).toLowerCase().includes(filtros.especie.toLowerCase()))
    .filter((m) => !filtros.genero || norm(m.genero) === filtros.genero)
    .filter((m) => norm(m.nombre).toLowerCase().includes(filtros.search.toLowerCase()));

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

      {/* Estados */}
      {loading && <p className="no-results">Cargando mascotas…</p>}
      {!!errMsg && !loading && <p className="no-results">{errMsg}</p>}

      {/* Grilla */}
      {!loading && !errMsg && (
        <>
          <div className="cards-grid">
            {filtradas.map((m) => {
              const firstImg = Array.isArray(m.imagen) ? m.imagen[0] : null;
              const imgUrl =
                (firstImg && (firstImg.url || firstImg)) || DEFAULT_IMG;

              return (
                <div
                  key={m._id || m.id || `${norm(m.nombre)}-${Math.random()}`}
                  className="card"
                  onClick={() => navigate(`/mascotasT/${m._id || m.id}`)}
                >
                  <div className="card-img">
                    <img src={imgUrl} alt={norm(m.nombre) || "Mascota"} className="img-cover" />
                  </div>
                  <div className="card-name">{norm(m.nombre) || "Sin nombre"}</div>
                </div>
              );
            })}
          </div>

          {filtradas.length === 0 && (
            <p className="no-results">No se encontraron mascotas.</p>
          )}
        </>
      )}
    </div>
  );
}
