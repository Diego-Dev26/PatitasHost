import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { StoreContext } from "@/context/store";
import client from "@/api";
import Toggle from "@/components/Toggle";
import Error from "@/components/Error";
import Icon from "@/components/Icon";

export default function HistorialFormComun() {
  const { id } = useParams(); // id de la mascota
  const navigate = useNavigate();
  const store = useContext(StoreContext);
  const [errors, setErrors] = useState([]);
  const [modoEditar, setModoEditar] = useState(false);
  const [historialId, setHistorialId] = useState(null);

  const [historial, setHistorial] = useState({
    id_mascota: id || "",
    esterilizacion: false,
    vacunas: "",
    descripcion: "",
  });

  useEffect(() => {
    if (!id) return;

    store.setLoading(true);

    // Paso 1: obtener nombre de la mascota por ID
    client
      .post("/mascota/read", { query: { find: { _id: id } } })
      .then((res) => {
        const nombreMascota = res.data?.nombre;
        if (!nombreMascota) throw new Error("Nombre no encontrado");

        // Paso 2: usar nombre como búsqueda
        return client.post("/historial/list", {
          query: {
            search: {
              id_mascota: nombreMascota,
            },
            limit: 1,
          },
        });
      })
      .then((res) => {
        const data = res.data?.list?.[0];
        if (data) {
          setModoEditar(true);
          setHistorialId(data._id);
          setHistorial({
            id_mascota: data.id_mascota,
            esterilizacion: data.esterilizacion,
            vacunas: data.vacunas || "",
            descripcion: data.descripcion || "",
          });
        }
      })
      .catch(() =>
        setErrors([
          "No se pudo cargar el historial médico de la mascota seleccionada",
        ])
      )
      .finally(() => store.setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = [];

    if (!historial.id_mascota) err.push("Debe estar vinculada a una mascota.");
    if (!historial.vacunas) err.push("El campo 'Vacunas' es obligatorio.");
    if (!historial.descripcion)
      err.push("El campo 'Descripción' es obligatorio.");

    if (err.length > 0) {
      setErrors(err);
      store.showErrors(err);
      return;
    }

    store.setLoading(true);
    try {
      const payload = { historial };
      if (modoEditar) {
        await client.put(`/historial/update/${historialId}`, payload);
        store.showSuccess({
          message: "Historial actualizado",
          redirect: "/mis-mascotas",
          navigate,
        });
      } else {
        await client.post("/historial/create", payload);
        store.showSuccess({
          message: "Historial creado",
          redirect: "/mis-mascotas",
          navigate,
        });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || "Error al guardar";
      setErrors([msg]);
      store.showErrors([msg]);
    } finally {
      store.setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Historial Médico
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm font-medium text-[#2F855A] hover:text-white border border-[#2F855A] px-4 py-2 rounded-md hover:bg-[#2F855A] transition-colors"
        >
          <Icon name="ArrowLeftCircleIcon" className="h-5 w-5 mr-2" />
          Volver
        </button>
      </div>

      <Error title="Errores en el formulario" errors={errors} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Toggle
          label="¿Está esterilizado?"
          value={historial.esterilizacion}
          setValue={(v) => setHistorial({ ...historial, esterilizacion: v })}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vacunas aplicadas <span className="text-red-500">*</span>
          </label>
          <textarea
            value={historial.vacunas}
            onChange={(e) =>
              setHistorial({ ...historial, vacunas: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del historial <span className="text-red-500">*</span>
          </label>
          <textarea
            value={historial.descripcion}
            onChange={(e) =>
              setHistorial({ ...historial, descripcion: e.target.value })
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {modoEditar ? "Actualizar Historial" : "Guardar Historial"}
          </button>
        </div>
      </form>
    </div>
  );
}
