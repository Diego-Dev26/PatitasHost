import { useEffect, useState, useContext } from "react";
import { StoreContext } from "@/context/store";
import client from "@/api";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMG = "/imgPerro.jpg";

export default function MisMascotas() {
  const [mascotas, setMascotas] = useState([]);
  const store = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!store.user?._id) return;

    client
      .get("/mascota/mis-mascotas")
      .then((res) => setMascotas(res.data))
      .catch((err) => console.error("Error al cargar mascotas:", err));
  }, [store.user]);

  return (
    <div className="gallery-container">
      <div className="filters-bar justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis Mascotas</h1>
        <button
          onClick={() => navigate("/crear-mascota")}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded shadow"
        >
          + Nueva Mascota
        </button>
      </div>

      {/* Tarjetas estilo público */}
      <div className="cards-grid">
        {mascotas.map((m) => {
          const imgUrl = m.imagen?.[0]?.url || m.imagen?.[0] || DEFAULT_IMG;

          return (
            <div
              key={m._id}
              className="card"
              onClick={() => navigate(`/mis-mascotas/detail/${m._id}`)}
            >
              <div className="card-img">
                <img src={imgUrl} alt={m.nombre} className="img-cover" />
              </div>
              <div className="card-name">{m.nombre}</div>
            </div>
          );
        })}
      </div>

      {mascotas.length === 0 && (
        <p className="no-results">No has publicado mascotas aún.</p>
      )}
    </div>
  );
}
