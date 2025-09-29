import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "@/api";
import "./GalleryPet.css";

const DEFAULT_IMG = "/imgPerro.jpg";

function toArraySafe(payload) {
  try {
    const raw = typeof payload === "string" ? JSON.parse(payload) : payload;
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.pets)) return raw.pets;
    if (Array.isArray(raw?.results)) return raw.results;
    console.warn("Respuesta no reconocida, keys:", raw && Object.keys(raw));
    return [];
  } catch (e) {
    console.error("Parse JSON error:", e, payload);
    return [];
  }
}
const norm = (v) => (typeof v === "string" ? v : v ? String(v) : "");

export default function GalleryPet() {
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [filtros, setFiltros] = useState({ raza: "", especie: "", genero: "", search: "" });
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setErrMsg("");

        // 1) intenta con axios
        try {
          const res = await client.get("/mascota/available");
          console.log("AXIOS /mascota/available →", res.status, res.headers);
          const list = toArraySafe(res?.data);
          if (mounted) setMascotas(list);
        } catch (axErr) {
          console.warn("Axios falló, probando fetch:", axErr?.message);

          // 2) fallback a fetch (sin credenciales)
          const url = `${import.meta.env.VITE_API_URL?.replace(/\/+$/, "")}/mascota/available`;
          const r = await fetch(url, { method: "GET", credentials: "omit", headers: { Accept: "application/json" } });
          console.log("FETCH /mascota/available →", r.status, r.type);

          if (!r.ok) throw new Error(`Fetch status ${r.status}`);
          // Si la respuesta es opaca (CORS), r.type sería 'opaque' y no se puede leer
          // pero en 200 + CORS OK debería poderse:
          const text = await r.text();
          const list = toArraySafe(text);
          if (mounted) setMascotas(list);
        }
      } catch (e) {
        console.error("fetchPets error FINAL:", e);
        if (mounted) setErrMsg("No se pudo cargar la lista de mascotas.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const filtradas = mascotas
    .filter((m) => norm(m.raza).toLowerCase().includes(filtros.raza.toLowerCase()))
    .filter((m) => norm(m.especie).toLowerCase().includes(filtros.especie.toLowerCase()))
    .filter((m) => !filtros.genero || norm(m.genero) === filtros.genero)
    .filter((m) => norm(m.nombre).toLowerCase().includes(filtros.search.toLowerCase()));

  return (
    <div className="gallery-container">
      <div className="filters-bar">
        <span className="filters-label">Filtrar por:</span>
        <input type="text" placeholder="Raza" value={filtros.raza} onChange={(e)=>setFiltros({ ...filtros, raza:e.target.value })}/>
        <input type="text" placeholder="Especie" value={filtros.especie} onChange={(e)=>setFiltros({ ...filtros, especie:e.target.value })}/>
        <select value={filtros.genero} onChange={(e)=>setFiltros({ ...filtros, genero:e.target.value })}>
          <option value="">Género</option><option value="Macho">Macho</option><option value="Hembra">Hembra</option>
        </select>
        <input type="text" placeholder="Buscar por nombre" value={filtros.search} onChange={(e)=>setFiltros({ ...filtros, search:e.target.value })}/>
      </div>

      {loading && <p className="no-results">Cargando mascotas…</p>}
      {!!errMsg && !loading && <p className="no-results">{errMsg}</p>}

      {!loading && !errMsg && (
        <>
          <div className="cards-grid">
            {filtradas.map((m) => {
              const firstImg = Array.isArray(m.imagen) ? m.imagen[0] : null;
              const imgUrl = (firstImg && (firstImg.url || firstImg)) || DEFAULT_IMG;
              return (
                <div key={m._id || m.id || `${norm(m.nombre)}-${Math.random()}`}
                     className="card"
                     onClick={() => navigate(`/mascotasT/${m._id || m.id}`)}>
                  <div className="card-img"><img src={imgUrl} alt={norm(m.nombre) || "Mascota"} className="img-cover"/></div>
                  <div className="card-name">{norm(m.nombre) || "Sin nombre"}</div>
                </div>
              );
            })}
          </div>
          {filtradas.length === 0 && <p className="no-results">No se encontraron mascotas.</p>}
        </>
      )}
    </div>
  );
}
