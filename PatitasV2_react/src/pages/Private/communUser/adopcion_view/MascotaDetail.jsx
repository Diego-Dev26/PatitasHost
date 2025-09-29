import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // <--- AÑADIR useNavigate
import client from "@/api";
import "./MascotaDetail.css";
import Icon from "@/components/Icon";
import { Link } from "react-router-dom";

export default function MascotaDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // <--- INICIALIZAR
  const [mascota, setMascota] = useState(null);
  const [historial, setHistorial] = useState(null);
  const [selectedImg, setSelectedImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      client.get("/mascota/available"),
      client.post("/historial/list", {
        query: { find: { id_mascota: id } },
      }),
    ])
      .then(([mascotaRes, historialRes]) => {
        const found = mascotaRes.data.find((m) => m._id === id);
        if (!found) {
          setError("Mascota no encontrada");
        } else {
          setMascota(found);
          const first = found.imagen?.[0]?.url || found.imagen?.[0] || "";
          setSelectedImg(first);
        }

        const listaHistorial = historialRes?.data?.list || [];
        if (listaHistorial.length > 0) {
          setHistorial(listaHistorial[0]);
        }
      })
      .catch(() => setError("Error cargando datos"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-20">Cargando...</div>;
  if (error)
    return <div className="text-center py-20 text-red-600">{error}</div>;

  const imgs = mascota.imagen || [];
  const fecha = new Date(mascota.fecha_nacimiento).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="px-4 py-10 bg-[#F8F4E9] min-h-screen">
      {/* Botón de volver */}
      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-[#2F855A] hover:text-white border border-[#2F855A] px-4 py-2 rounded-md hover:bg-[#2F855A] transition-colors"
        >
          <Icon name="ArrowLeftCircleIcon" className="h-5 w-5 mr-2" />
          Volver atrás
        </button>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#2F855A] mb-8">
        {`${mascota.especie} ${mascota.genero}, raza ${mascota.raza} llamado ${mascota.nombre}`}
      </h1>

      <div className="max-w-5xl mx-auto bg-white rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* IZQ: imágenes */}
          <div>
            <div className="w-full h-80 overflow-hidden rounded-lg">
              <img
                src={selectedImg}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            {imgs.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {imgs.slice(0, 4).map((f, i) => {
                  const url = f.url || f;
                  return (
                    <div
                      key={i}
                      className={`w-24 h-24 flex-shrink-0 overflow-hidden rounded-md thumb ${
                        url === selectedImg ? "ring-2 ring-[#5D8A66]" : ""
                      }`}
                      onClick={() => setSelectedImg(url)}
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* DER: datos */}
          <div className="space-y-4">
            {[
              ["Nombre", mascota.nombre],
              ["Especie", mascota.especie],
              ["Raza", mascota.raza],
              ["Nacimiento", fecha],
              ["Sexo", mascota.genero],
            ].map(([l, v]) => (
              <div key={l} className="flex">
                <span className="font-semibold mr-2">{l}:</span>
                <span>{v}</span>
              </div>
            ))}
            {/* NUEVO: usuario que registró */}
            <div className="flex">
              <span className="font-semibold mr-2">Registrado por:</span>
              <span>
                {mascota.last_user?.nombres}
                {mascota.last_user?.celular
                  ? ` (${mascota.last_user.celular})`
                  : ""}
              </span>
            </div>
            <div className="mt-4 text-gray-700 whitespace-pre-line">
              {mascota.descripcion}
            </div>
            {historial && (
              <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-2 text-[#2F855A]">
                  Historial Médico
                </h3>
                <div className="mb-1">
                  <strong>Esterilizado:</strong>{" "}
                  {historial.esterilizacion ? "Sí" : "No"}
                </div>
                <div className="mb-1">
                  <strong>Vacunas:</strong> {historial.vacunas}
                </div>
                <div className="mb-1">
                  <strong>Descripción médica:</strong> {historial.descripcion}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <p className="mb-2 text-lg font-semibold">
                ¿Interesado en adoptarlo?
              </p>
              <a
                href={`https://wa.me/${mascota.last_user.celular}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors"
              >
                Contactar por WhatsApp
                <Icon name="ChatAlt2Icon" className="h-5 w-5 mr-2" />
              </a>
              <Link
                to={`/denuncia/crear/${mascota.last_user._id}`}
                className="inline-flex items-center bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg shadow transition-colors"
              >
                <Icon name="ExclamationCircleIcon" className="h-5 w-5 mr-2" />
                Denunciar al dueño
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
